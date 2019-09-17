// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/extensions/ExtensionHelper",
    "sap/ushell/components/HomepageManager",
    "sap/ushell/extensions/_PageComposition/Factory",
    "sap/ushell/components/homepage/DashboardGroupsBox",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/ShellAppTitle"
], function (Log, ExtensionHelper, HomepageManager, Factory, DashboardGroupsBox, Config, ShellAppTitle) {
    "use strict";

    var oHomepageManager = sap.ushell.components.getHomepageManager();
    var oShellHeader = sap.ui.getCore().byId("shell-header");
    var oDashboardView = oHomepageManager.getDashboardView();

    /**
     * Sets the given title as appTitle in the shellheader
     *
     * @param {string} sTitle The title to display
     * @private
     */
    function _setAppTitle (sTitle) {
        oShellHeader.setAppTitle(new ShellAppTitle({
            text: sTitle
        }));
    }

    /**
     * Sets the composerState config value to "composing" and activates actionMode
     *
     * @private
     */
    function _enableComposingMode () {
        Config.emit("/core/pageComposition/composerState", "composing");
    }

    /**
     * Switches to initial mode and empties the Homepage
     * @private
     */
    function _closeComposingMode () {
        oHomepageManager.getModel().setProperty("/groups", []);
        Config.emit("/core/pageComposition/composerState", "initial");
        Config.emit("/core/pageComposition/currentPageId", null);
        Config.emit("/core/pageComposition/editMode", false);
        sap.ui.getCore().getEventBus().publish("launchpad", "actionModeInactive");
    }

    /**
     * Navigates to the pageOverview in the #Shell-compose application
     * @private
     */
    function _navigateToPageOverview () {
        sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
            function (oCrossAppNavigator) {
                oCrossAppNavigator.toExternal({
                    target: { shellHash: "#Shell-compose" }
                });
            }
        );
    }

    function _closeAndNavigate () {
        _closeComposingMode();
        _navigateToPageOverview();
    }

    /**
     * Called if catalog tiles have been selected in the tile selector
     *
     * @param {sap.ui.base.Event} oEvent the tile selection event emitted by the tile selector
     * @private
     */
    function _handleAddTileToGroup (oEvent) {
        var oGroup = oEvent.getSource();
        var sGroupTitle = oGroup.getHeaderText();

        _enableComposingMode();

        sap.ui.require([
            "sap/ushell/extensions/_PageComposition/Factory/TileSelector"
        ], function (oTileSelectorFactory) {
            oTileSelectorFactory
                .create(oTileSelectorFactory.loadCatalogTileData)
                .selectTiles(sGroupTitle)
                .then(oHomepageManager.addTilesToGroupByCatalogTileId.bind(oHomepageManager, oGroup));
        });
    }

    /**
     * Called if a page has been selected in the page selector
     *
     * @param {string} sPageId The id of the selected page
     *
     * @returns {Promise<void>} Promise which resolves when the page has been loaded
     * @private
     */
    function _openPage (sPageId) {
        if (!sPageId) {
            return Promise.reject();
        }

        return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
            return PagePersistence.getPage(sPageId);
        }).then(function (oPage) {
            oHomepageManager.importModelData(oPage);
        });
    }

    /**
     * Called if a modified page is saved
     *
     * @private
     */
    function _savePage () {
        var sPageId = Config.last("/core/pageComposition/currentPageId");

        if (!sPageId) {
            throw Error("No pageId set");
        }

        Promise.all([
            sap.ushell.Container.getServiceAsync("PagePersistence"),
            sap.ushell.Container.getServiceAsync("PageReferencing")
        ]).then(function (results) {
            var oPagePersistence = results[0];
            var oPageReferencing = results[1];

            oPagePersistence.getPage(sPageId).then(function (page) {
                var oGroupLayout = oHomepageManager.exportModelData();
                return {
                    page: page,
                    groups: oGroupLayout
                };
            }).then(function (pageData) {
                return oPageReferencing.createReferencePage(pageData.page, pageData.groups);
            }).then(function (oPage) {
                oPagePersistence.updatePage(oPage);
                _closeAndNavigate();
            }).catch(Log.error);
        }, Log.error);
    }

    /**
     * Called if there was an error while saving a page
     *
     * @private
     */
    function _savePageError () {
        Log.trace("User cancelled saving of page");
    }

    /**
     * Creates a button which is displayed if all groups have been removed
     *
     * @private
     */
    function _createAddGroupButton () {
        var oPage = sap.ui.getCore().byId("sapUshellDashboardPage");
        var oButton = Factory.createAddGroupButton(function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.publish("launchpad", "createGroupAt", {
                title: "",
                location: 0,
                isRendered: true
            });
            oEventBus.publish("launchpad", "actionModeActive");
        }, oHomepageManager.getModel());

        oPage.insertContent(oButton, 0);
    }

    /**
     * Modifies the footer to contain the buttons required in page composer mode
     * @private
     */
    function _addFooterButtons () {
        var oFooter = oDashboardView.oPage.getFooter();
        var oSaveButton = Factory.createFooterSaveButton(_savePage, _savePageError);
        var oCloseButton = Factory.createFooterCloseButton(_closeAndNavigate);

        oFooter.removeAllContentLeft();
        oFooter.removeAllContentMiddle();
        oFooter.removeAllContentRight();
        oFooter.insertContentRight(oSaveButton);
        oFooter.insertContentRight(oCloseButton);
    }

    /**
     * Imports the model data for the given page groups and sets the groups array as to the groups model
     *
     * @param {object} oPage The page object to import
     * @private
     */
    function _importModelData (oPage) {
        var that = this;
        var aGroups = [];

        oPage.content.sections.forEach(function (oGroup) {
            var oGroupModel = that.oPageOperationAdapter.getPreparedGroupModel({title: oGroup.title});
            oGroupModel.groupId = oGroup.id;
            oGroupModel.tiles = oGroup.visualizations.map(function (oTile) {
                return that.oPageOperationAdapter.getTileModelByCatalogTileId(oTile.vizId);
            });

            aGroups.push(oGroupModel);
        });

        if (aGroups.length > 0) {
            aGroups[aGroups.length-1].isLastGroup = true;
        }

        that.getModel().setProperty("/groups", aGroups);
    }

    /**
     * Exports the model data for the current page
     *
     * @returns {Promise<object>} A promise containing the exported groups
     * @private
     */
    function _exportModelData () {
        var that = this,
            aGroups = this.getModel().getProperty("/groups");

        function _exportTileData (oTileModel) {
            return {
                target: that.oPageOperationAdapter.getTileTarget(oTileModel),
                tileCatalogId: oTileModel.tileCatalogId
            };
        }

        return aGroups.reduce(function (oResult, oGroup) {
            // We don't support links for now
            oResult.push({
                id: oGroup.groupId,
                title: oGroup.title,
                tiles: oGroup.tiles.map(_exportTileData)
            });
            return oResult;
        }, []);
    }

    /**
     * Modifies the HomepageManager class by adding functionality to export and import model data
     * @private
     */
    function _modifyHomepageManager () {
        ExtensionHelper.add(HomepageManager, "importModelData", _importModelData);
        ExtensionHelper.add(HomepageManager, "exportModelData", _exportModelData);
        // override isBlindLoading in HomepageManager to always return true for page composer
        // this is done to avoid tiles being in endless loading state
        ExtensionHelper.override(HomepageManager, "isBlindLoading", function () { return true; });
        ExtensionHelper.registerExtension("HomepageManagerExtension", HomepageManager);
    }

    /**
     * Modifies the DashboardGroupsBox class to load the tile selector when a tile is added
     * @private
     */
    function _modifyDashboardGroupsBox () {
        ExtensionHelper.override(DashboardGroupsBox, "_handleAddTileToGroup", _handleAddTileToGroup);
        ExtensionHelper.registerExtension("DashboardGroupsBoxExtension", DashboardGroupsBox);
    }

    /**
     * Activates all added functions, overrides and hooks
     */
    function activateExtension () {
        _modifyHomepageManager();
        _modifyDashboardGroupsBox();
        _addFooterButtons();
        _createAddGroupButton();

        Config.emit("/core/home/enableTransientMode", true);
        _setAppTitle("FLP Page Composer");

        // Clear homepage if navigation to #Shell-compose application occurs
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appOpened",
        function (sChannelId, sEventId, oData) {
            if (oData.sShellHash === "Shell-compose") {
                _closeComposingMode();
            }
        });

        Config.on("/core/shell/model/currentState/stateName").do(function (stateName) {
            if (stateName !== "home") {
                // A different app has been navigated to
                return;
            }

            var sPageId = Config.last("/core/pageComposition/currentPageId");

            if (!sPageId) {
                // No page selected -> return to normal dashboard
                return;
            }

            if (Config.last("/core/pageComposition/editMode")) {
                // page to edit was selected -> open this page in edit mode
                oDashboardView.oTileActionsButton.firePress();
                _enableComposingMode();
                _openPage(sPageId).then(function () {
                    sap.ui.getCore().getEventBus().publish("launchpad", "actionModeActive");
                });
                return;
            }

            // page to view was selected -> just open it
            _openPage(sPageId);
        });
    }

    activateExtension();
});
