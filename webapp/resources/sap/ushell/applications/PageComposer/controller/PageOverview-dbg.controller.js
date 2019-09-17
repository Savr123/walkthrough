//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ushell/Config",
    "sap/ushell/extensions/_PageComposition/Factory/PageSaveDialog",
    "sap/base/Log",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/applications/PageComposer/model/formatter"
], function (
    BaseController,
    Config,
    PageSaveDialogFactory,
    Log,
    Dialog,
    Button,
    Text,
    MessageToast,
    resources,
    JSONModel,
    formatter
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.Main", {

        onInit: function () {
            this.oDeleteDialogModel = new JSONModel({
                approvalText: ""
            });
            this.oCopyDialogModel = new JSONModel({
                page: null,
                approvalText: ""
            });

            this.getRouter().getRoute("overview").attachPatternMatched(this._onPageOverviewMatched, this);
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
        },

        formatter: formatter,

        /**
         * Called if a list item in the pageOverview table is pressed
         *
         * @param {sap.ui.base.Event} oEvent The press event
         */
        onItemPress: function (oEvent) {
            var oPage = oEvent.getParameter("listItem").getBindingContext().getObject();
            this._navigateToDetail(oPage.content.id);
        },

        /**
         * Called if the route is entered. Refreshes the model
         *
         * @private
         */
        _onPageOverviewMatched: function () {
            this.refreshModel();
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The pageId to navigate to
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The pageId to navigate to
         * @private
         */
        _navigateToDetail: function (pageId) {
            this.getRouter().navTo("detail", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if a list item in the pageOverview table is selected
         * Sets the state of the Delete and Copy buttons
         *
         * @param {sap.ui.base.Event} oEvent The select event
         */
        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var nSelected = oTable.getSelectedItems().length;
            var bDeleteEnabled = nSelected > 0;
            var bCopyEnabled = nSelected === 1;
            var oButtonStateModel = this.getView().getModel("buttonStates");

            oButtonStateModel.setProperty("/isDeleteEnabled", bDeleteEnabled);
            oButtonStateModel.setProperty("/isCopyEnabled", bCopyEnabled);
        },

        /**
         * Called if the edit button in the pageOverview table is pressed
         * Sets the config values and navigates to the dashboard
         *
         * @param {sap.ui.base.Event} event The press event
         */
        onEdit: function (event) {
            var oPage = event.getSource().getParent().getBindingContext().getObject();
            this._navigateToEdit(oPage.content.id);
        },

        /**
         * Called if the add button is clicked
         * Creates and saves (!) a new page, then sets the config values and navigates to the dashboard
         */
        onAdd: function () {
            PageSaveDialogFactory.create().getPageSaveInformation(this.getView()).then(function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                            return PagePersistence.createPage(oReferencePage);
                        });
                    })
                    .then(function () {
                        this._navigateToEdit(pageInfo.content.id);
                        MessageToast.show(resources.i18nModel.getProperty("pageOverviewCreateSuccess"));
                    }.bind(this)).catch(Log.error);
            }.bind(this)).catch(Log.error);
        },

        /**
         * Called if the delete dialog is confirmed
         * Deletes the selected page and refreshes the model to display the change in the pageOverview table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         * @returns {Promise<void>} The delete promise
         * @private
         */
        _deletePage: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var oTable = this.byId("sapUshellPagesTable");
            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });

            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                var aDeletePromises = aItemsToDelete.map(function (oItemToDelete) {
                    return PagePersistence.deletePage(oItemToDelete.content.id);
                });
                return Promise.all(aDeletePromises);
            }).then(function () {
                this.refreshModel().then(function () {
                    oTable.fireSelectionChange();
                    MessageToast.show(resources.i18nModel.getProperty("pageOverviewSuccess"));
                    oDialog.close();
                });
            }.bind(this)).catch(Log.error);
        },

        /**
         * Creates the string to display in the delete dialog
         *
         * @returns {string} The string to display
         * @private
         */
        _formatDeleteDialogText: function () {
            var oTable = this.byId("sapUshellPagesTable");
            var oResourceBundle = this.getResourceBundle();

            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });
            var sItemsFormatted = formatter.deleteDialogText(aItemsToDelete);
            return oResourceBundle.getText("pageOverviewDeleteText") + "\n\n" + sItemsFormatted;
        },

        /**
         * Called if the delete button is clicked
         * Displays the delete dialog with the pages to delete
         * on confirmation deletes the pages
         * on cancel closes the dialog
         */
        onDelete: function () {
            var oTable = this.byId("sapUshellPagesTable");

            if (oTable.getSelectedItems().length === 0) {
                return;
            }
            var sApprovalText = this._formatDeleteDialogText();
            this.oDeleteDialogModel.setProperty("/approvalText", sApprovalText);
            this.getOwnerComponent()
                .showDeleteDialog(this.oDeleteDialogModel, this._deletePage.bind(this));
        },

        /**
         * Called if the copy button is clicked.
         * Opens the copy dialog
         */
        onCopy: function () {
            var oTable = this.byId("sapUshellPagesTable");

            var aItemsToCopy = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });

            if (aItemsToCopy.length !== 1) {
                return;
            }
            var oSelectedPage = aItemsToCopy[0];

            this.oCopyDialogModel.setProperty("/page", oSelectedPage);
            this.getOwnerComponent()
                .showCopyDialog(this.oCopyDialogModel, this._copyPage.bind(this));
        },

        _copyPage: function (oEvent) {
            //@TODO: implement
            // var oDialog = oEvent.getSource().getParent();
        },

        /**
         * Loads available pages and sets the model
         *
         * @returns {Promise<void>} Promise that resolves when the pages have been loaded
         */
        refreshModel: function () {
            return this._loadAvailablePages().then(function (pages) {
                this.setModel(new JSONModel(pages));
            }.bind(this));
        },

        /**
         * Load available pages from the page persistence
         *
         * @returns {Promise<{pages: array}>} A promise which contains an object with the pages
         * @private
         */
        _loadAvailablePages: function () {
            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                return PagePersistence.getPages();
            }).then(function (aPages) {
                return {
                    pages: aPages
                };
            });
        },

        /**
         * Creates the model for the state of the delete and copy buttons
         * @returns {object} The created model
         * @private
         */
        _createInitialButtonStateModel: function () {
            return new JSONModel({
                isDeleteEnabled: false,
                isCopyEnabled: false
            });
        }
    });

}, false /* bExport */);
