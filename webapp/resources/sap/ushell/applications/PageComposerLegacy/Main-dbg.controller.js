//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/Config",
    "sap/ushell/extensions/_PageComposition/Factory/PageSaveDialog",
    "sap/base/Log",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageToast",
    "sap/ushell/resources",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    Config,
    PageSaveDialogFactory,
    Log,
    Dialog,
    Button,
    Text,
    MessageToast,
    resources,
    DateFormat,
    Fragment,
    JSONModel
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposerLegacy.Controller", {

        onInit: function () {
            this.oDeleteDialogModel = new JSONModel({
                sApprovalText: ""
            });
        },

        /**
         * Navigates to #Shell-home
         * @private
         */
        _navigateHome: function () {
            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(
                function (oCrossAppNavigator) {
                    oCrossAppNavigator.toExternal({
                        target: { shellHash: "#Shell-home" }
                    });
                }
            );
        },

        /**
         * Called if a list item in the pageOverview table is pressed
         * Sets the config values and navigates to the dashboard
         *
         * @param {sap.ui.base.Event} oEvent The press event
         */
        onItemPress: function (oEvent) {
            var oPage = oEvent.getParameter("listItem").getBindingContext().getObject();

            Config.emit("/core/extension/PageComposition", true);
            Config.emit("/core/pageComposition/currentPageId", oPage.Id);
            Config.emit("/core/pageComposition/editMode", false);
            Config.emit("/core/pageComposition/composerState", "initial");

            this._navigateHome();
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
         * @param {sap.ui.base.Event} oEvent The press event
         */
        onEdit: function (oEvent) {
            var oPage = oEvent.getSource().getParent().getBindingContext().getObject();

            Config.emit("/core/extension/PageComposition", true);
            Config.emit("/core/pageComposition/currentPageId", oPage.Id);
            Config.emit("/core/pageComposition/editMode", true);
            Config.emit("/core/pageComposition/composerState", "composing");

            this._navigateHome();
        },

        /**
         * Called if the add button is clicked
         * Creates and saves (!) a new page, then sets the config values and navigates to the dashboard
         */
        onAdd: function () {
            PageSaveDialogFactory.create().getPageSaveInformation().then(function (pageInfo) {

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
                        Config.emit("/core/extension/PageComposition", true);
                        Config.emit("/core/pageComposition/editMode", true);
                        Config.emit("/core/pageComposition/composerState", "composing");
                        Config.emit("/core/pageComposition/currentPageId", pageInfo.content.id);

                        this._navigateHome();
                    }.bind(this)).catch(Log.error);
            }.bind(this)).catch(Log.error);
        },

        /**
         * Called if the delete dialog is confirmed
         * Deletes the selected page and refreshes the model to display the change in the pageOverview table
         * @returns {Promise<void>} The delete promise
         * @private
         */
        _confirmDelete: function () {
            var oTable = this.byId("sapUshellPagesTable");
            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });

            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                var aDeletePromises = aItemsToDelete.map(function (oItemToDelete) {
                    return PagePersistence.deletePage(oItemToDelete.Id);
                });
                return Promise.all(aDeletePromises);
            }).then(function () {
                this.getOwnerComponent().refreshModel().then(function () {
                    oTable.fireSelectionChange();
                });
            }.bind(this)).catch(Log.error);
        },

        /**
         * Formats the given date string to a language-specific format
         *
         * @param {string} sDate The date string
         * @returns {string} The formatted date string
         */
        formatDate: function (sDate) {
            var oDate = new Date(sDate);

            if (!oDate) {
                return sDate;
            }

            var oFormat = DateFormat.getInstance({
                format: "yMMMd"
            });
            return oFormat.format(new Date(oDate));
        },

        /**
         * Called if the delete action has been cancelled
         */
        onDeleteCancel: function () {
            var oDialog = this.byId("pageOverviewDeleteDialog");
            oDialog.close();
        },

        /**
         * Called if the delete action has been confirmed
         */
        onDeleteConfirm: function () {
            var oDialog = this.byId("pageOverviewDeleteDialog");
            this._confirmDelete();
            MessageToast.show(resources.i18nModel.getProperty("pageOverviewSuccess"));
            oDialog.close();
        },

        /**
         * Creates the string to display in the delete dialog
         *
         * @returns {string} The string to display
         * @private
         */
        _formatDeleteDialogText: function () {
            var oView = this.getView();
            var oTable = this.byId("sapUshellPagesTable");
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();

            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });
            var sItemsFormatted = aItemsToDelete.map(function (oItemToDelete) {
                return oItemToDelete.Id;
            }).join("\n");
            return oResourceBundle.getText("pageOverviewDeleteText") + "\n\n" + sItemsFormatted;
        },

        /**
         * Called if the delete button is clicked
         * Displays the delete dialog with the pages to delete
         * on confirmation deletes the pages
         * on cancel closes the dialog
         */
        onDelete: function () {
            var oView = this.getView();
            var oTable = this.byId("sapUshellPagesTable");

            if (oTable.getSelectedItems().length === 0) {
                return;
            }
            var sApprovalText = this._formatDeleteDialogText();

            this.oDeleteDialogModel.setProperty("/sApprovalText", sApprovalText);

            // create dialog lazily
            if (!this.oDeleteDialogPromise) {
                this.oDeleteDialogPromise = Fragment.load({
                    id: oView.getId(),
                    name: "sap.ushell.applications.PageComposerLegacy.view.DeleteDialog",
                    controller: this
                }).then(function (fragment) {
                    fragment.setModel(this.oDeleteDialogModel);
                    fragment.setModel(resources.i18nModel, "i18n");
                    oView.addDependent(fragment);
                    return fragment;
                }.bind(this));
            }

            this.oDeleteDialogPromise.then(function (fragment) {
                fragment.open();
            });
        }
    });

}, false /* bExport */);
