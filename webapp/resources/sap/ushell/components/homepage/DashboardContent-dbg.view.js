// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview The Fiori launchpad main view.<br>
 * The view is of type <code>sap.ui.jsview</code> that includes a <code>sap.m.page</code>
 * with a header of type <code>sap.ushell.ui.launchpad.AnchorNavigationBar</code>
 * and content of type <code>sap.ushell.ui.launchpad.DashboardGroupsContainer</code>.
 *
 * @version 1.69.1
 * @name sap.ushell.components.homepage.DashboardContent.view
 * @private
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/m/library",
    "sap/m/Page",
    "sap/ui/core/AccessibleLandmarkRole",
    "sap/ui/core/mvc/View",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ushell/components/homepage/ComponentKeysHandler",
    "sap/ushell/components/homepage/DashboardGroupsBox",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/renderers/fiori2/AccessKeysHandler",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/AnchorItem",
    "sap/ushell/ui/launchpad/AnchorNavigationBar",
    "sap/ushell/utils",
    "sap/ui/core/Component",
    "sap/ui/model/FilterOperator"
], function (
    jQuery,
    oMLib,
    Page,
    AccessibleLandmarkRole,
    View,
    Device,
    Filter,
    ComponentKeysHandler,
    DashboardGroupsBox,
    Config,
    EventHub,
    AccessKeysHandler,
    resources,
    AnchorItem,
    AnchorNavigationBar,
    utils,
    Component,
    FilterOperator
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.homepage.DashboardContent", {
        /*
        * Creating the content of the main dashboard view.
        * The view is basically a sap.m.Page control that contains:
        *  - AnchorNavigationBar as header.
        *  - DashboardGroupsBox that contains the groups and tiles as content.
        *  - Bar in the footer if edit mode is enabled.
        */
        createContent: function (oController) {
            this.oModel = this.getModel();

            var bEnablePersonalization = this.oModel.getProperty("/personalization"),
                oHomepageManager = sap.ushell.components.getHomepageManager ? sap.ushell.components.getHomepageManager() : undefined;

            this.isCombi = Device.system.combi;
            this.isTouch = this.isCombi ? false : (Device.system.phone || Device.system.tablet);
            this.parentComponent = Component.getOwnerComponentFor(this);
            this.addStyleClass("sapUshellDashboardView");
            this.ieHtml5DnD = bEnablePersonalization && oHomepageManager && oHomepageManager.isIeHtml5DnD();
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeInactive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "actionModeActive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().subscribe("launchpad", "contentRefresh", this._onDashboardShown, this);

            /**
             * In order to save performance we delay the actionmode, the footer creation and the overflow of the anchorBar
             * till core-ext file has been loaded.
             */
            this.oDoable = EventHub.once("CoreResourcesComplementLoaded").do(function () {
                this.oAnchorNavigationBar.setOverflowEnabled(true);

                if (bEnablePersonalization) {
                    sap.ui.require(["sap/ushell/components/homepage/ActionMode"], function (ActionMode) {
                        ActionMode.init(this.oModel);
                    }.bind(this));

                    this._createFooter();
                    this._createActionModeMenuButton();
                }
            }.bind(this));

            this.oRenderer.getRouter().getRoute("home").attachMatched(this._onDashboardShown, this);

            this.oAnchorNavigationBar = this._getAnchorNavigationBar(oController);

            var oDashboardGroupsBoxModule = new DashboardGroupsBox();
            // Create the DashboardGroupsBox object that contains groups and tiles
            this.oDashboardGroupsBox = oDashboardGroupsBoxModule.createGroupsBox(oController, this.oModel);

            this.oFilterSelectedGroup = new Filter("isGroupSelected", FilterOperator.EQ, true);

            this.oPage = new Page("sapUshellDashboardPage", {
                customHeader: this.oAnchorNavigationBar,
                landmarkInfo: { headerRole: AccessibleLandmarkRole.Navigation },
                floatingFooter: true,
                content: [this.oDashboardGroupsBox]
            });

            this.oPage.addEventDelegate({
                onAfterRendering: function () {
                    var oDomRef = this.getDomRef(),
                        oScrollableElement = oDomRef.getElementsByTagName("section");

                    jQuery(oScrollableElement[0]).off("scrollstop", oController.handleDashboardScroll);
                    jQuery(oScrollableElement[0]).on("scrollstop", oController.handleDashboardScroll);
                }.bind(this)
            });

            return this.oPage;
        },

        getAnchorItemTemplate: function () {
            var that = this,
                bHelpEnabled = Config.last("/core/extension/enableHelp");
            var oAnchorItemTemplate = new AnchorItem({
                index: "{index}",
                title: "{title}",
                groupId: "{groupId}",
                defaultGroup: "{isDefaultGroup}",
                writeHelpId: bHelpEnabled,
                selected: false,
                isGroupRendered: "{isRendered}",
                visible: {
                    parts: ["/tileActionModeActive", "isGroupVisible", "visibilityModes"],
                    formatter: function (tileActionModeActive, isGroupVisible, visibilityModes) {
                        // Empty groups should not be displayed when personalization is off or
                        // if they are locked or default group not in action mode
                        if (!visibilityModes[tileActionModeActive ? 1 : 0]) {
                            return false;
                        }
                        return isGroupVisible || tileActionModeActive;
                    }
                },
                locked: "{isGroupLocked}",
                isGroupDisabled: {
                    parts: ["isGroupLocked", "/isInDrag", "/homePageGroupDisplay"],
                    formatter: function (bIsGroupLocked, bIsInDrag, sAnchorbarMode) {
                        return bIsGroupLocked && bIsInDrag && sAnchorbarMode === "tabs";
                    }
                },
                press: function (oEvent) {
                    that.oAnchorNavigationBar.handleAnchorItemPress(oEvent);
                }
            });

            oAnchorItemTemplate.attachBrowserEvent("focus", function () {
                this.setNavigationBarItemsVisibility();
            }.bind(this.oAnchorNavigationBar));

            return oAnchorItemTemplate;
        },

        _getAnchorNavigationBar: function (oController) {
            var oAnchorNavigationBar = new AnchorNavigationBar("anchorNavigationBar", {
                selectedItemIndex: "{/topGroupInViewPortIndex}",
                itemPress: [function (oEvent) {
                    this._handleAnchorItemPress(oEvent);
                }, oController],
                overflowEnabled: false // we will enable the overflow once coreExt will be loaded!!!
            });

            oAnchorNavigationBar.addEventDelegate({
                onsapskipforward: function (oEvent) {
                    oEvent.preventDefault();
                    AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    ComponentKeysHandler.goToTileContainer(oEvent, this.bGroupWasPressed);
                    this.bGroupWasPressed = false;
                },
                onsapskipback: function (oEvent) {
                    oEvent.preventDefault();
                    AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                    AccessKeysHandler.sendFocusBackToShell(oEvent);
                },
                onsapenter: function (oEvent) {
                    oEvent.srcControl.getDomRef().click();
                },
                onsapspace: function (oEvent) {
                    oEvent.srcControl.getDomRef().click();
                }
            });

            oAnchorNavigationBar.addStyleClass("sapContrastPlus");

            return oAnchorNavigationBar;
        },

        _actionModeButtonPress: function () {
            this.oDashboardGroupsBox.getBinding("groups").filter([]); // replace model filter inorder to show hidden groups
            var dashboardGroups = this.oDashboardGroupsBox.getGroups();
            sap.ushell.components.homepage.ActionMode.toggleActionMode(this.oModel, "Menu Item", dashboardGroups);
            this.oAnchorNavigationBar.updateVisibility();
            if (this.oModel.getProperty("/homePageGroupDisplay") === "tabs") {
                if (this.oModel.getProperty("/tileActionModeActive")) { // To edit mode
                    // find the selected group
                    var aGroups = this.oModel.getProperty("/groups"),
                        selectedGroup;
                    for (var i = 0; i < aGroups.length; i++) {
                        if (aGroups[i].isGroupSelected) {
                            selectedGroup = i;
                            break;
                        }
                    }
                    // scroll to selected group
                    this.getController()._scrollToGroup("launchpad", "scrollToGroup", {
                        group: {
                            getGroupId: function () {
                                return aGroups[selectedGroup].groupId;
                            }
                        },
                        groupChanged: false,
                        focus: true
                    });
                } else { // To non-edit mode
                    this.getController()._deactivateActionModeInTabsState();
                }
            }
        },

        _createActionModeMenuButton: function () {
            var oActionButtonObjectData = {
                id: "ActionModeBtn",
                text: resources.i18n.getText("activateEditMode"),
                icon: "sap-icon://edit",
                press: this._actionModeButtonPress.bind(this)
            };

            // in case the edit home page button was moved to the shell header,
            // it was already created as an shell Head Item in Controll Manager
            // only here we have access to the text and press method
            this.oTileActionsButton = sap.ui.getCore().byId(oActionButtonObjectData.id);
            if (this.oTileActionsButton) {
                this.oTileActionsButton.setTooltip(oActionButtonObjectData.text);
                this.oTileActionsButton.setText(oActionButtonObjectData.text);
                this.oTileActionsButton.attachPress(oActionButtonObjectData.press);
            } else {
                var oAddActionButtonParameters = {
                    controlType: "sap.ushell.ui.launchpad.ActionItem",
                    oControlProperties: oActionButtonObjectData,
                    bIsVisible: true,
                    aStates: ["home"]
                };

                this.oRenderer.addUserAction(oAddActionButtonParameters).done(function (oActionButton) {
                    this.oTileActionsButton = oActionButton;
                    // if xRay is enabled
                    if (Config.last("/core/extension/enableHelp")) {
                        this.oTileActionsButton.addStyleClass("help-id-ActionModeBtn");// xRay help ID
                    }
                }.bind(this));
            }
        },

        _handleEditModeChange: function () {
            if (this.oTileActionsButton) {
                this.oTileActionsButton.toggleStyleClass("sapUshellAcionItemActive");
            }
        },

        _createFooter: function () {
            sap.ui.require([
                "sap/m/Bar",
                "sap/m/Button",
                "sap/m/ToolbarSpacer",
                "sap/ui/core/InvisibleText"
            ], function (Bar, Button, ToolbarSpacer, InvisibleText) {
                var oFooter = new Bar("sapUshellDashboardFooter", {
                    visible: "{/tileActionModeActive}",
                    contentRight: [new ToolbarSpacer()]
                });

                if (!this.oDoneBtnLabel) {
                    this.oDoneBtnLabel = new InvisibleText({
                        text: resources.i18n.getText("exitEditMode")
                    });
                    this.oDoneBtnLabel.toStatic();
                }

                var oDoneBtn = new Button("sapUshellDashboardFooterDoneBtn", {
                    type: oMLib.ButtonType.Emphasized,
                    text: resources.i18n.getText("closeEditMode"),
                    ariaLabelledBy: this.oDoneBtnLabel.getId(),
                    press: this._actionModeButtonPress.bind(this)
                });
                oDoneBtn.addEventDelegate({
                    onsapskipforward: function (oEvent) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        AccessKeysHandler.sendFocusBackToShell(oEvent);
                    },
                    onsapskipback: function (oEvent) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        ComponentKeysHandler.goToFirstVisibleTileContainer();
                    },
                    onsaptabprevious: function (oEvent) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        ComponentKeysHandler.goToFirstVisibleTileContainer();
                    },
                    onsaptabnext: function (oEvent) {
                        oEvent.preventDefault();
                        AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);
                        AccessKeysHandler.sendFocusBackToShell(oEvent);
                    }
                });

                oFooter.addContentRight(oDoneBtn);
                this.oPage.setFooter(oFooter);
            }.bind(this));
        },

        _onDashboardShown: function () {
            var bInDashboard = this.oRenderer && this.oRenderer.getCurrentCoreView() === "home";

            if (bInDashboard) {
                if (!Device.system.phone) {
                    this.oRenderer.showRightFloatingContainer(false);
                }

                utils.handleTilesVisibility();
                utils.refreshTiles();
                ComponentKeysHandler.goToTileContainer();
            }
        },

        getControllerName: function () {
            return "sap.ushell.components.homepage.DashboardContent";
        },

        exit: function () {
            View.prototype.exit.apply(this, arguments);

            if (this.oAnchorNavigationBar) {
                this.oAnchorNavigationBar.handleExit();
                this.oAnchorNavigationBar.destroy();
            }
            if (this.oTileActionsButton) {
                this.oTileActionsButton.destroy();
            }

            if (this.oDoable) {
                this.oDoable.off();
            }

            if (this.oDoneBtnLabel) {
                this.oDoneBtnLabel.destroy();
            }

            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeInactive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "actionModeActive", this._handleEditModeChange, this);
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "contentRefresh", this._onDashboardShown, this);
        }
    });
}, /* bExport= */ false);
