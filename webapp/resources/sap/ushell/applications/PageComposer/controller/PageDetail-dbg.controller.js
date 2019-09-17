// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/applications/PageComposer/model/formatter",
    "sap/ushell/resources",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/base/strings/formatMessage"
], function (
    BaseController,
    JSONModel,
    formatter,
    resources,
    MessageToast,
    Log,
    formatMessage
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetail", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this._onPageMatched, this);

            this.oDeleteDialogModel = new JSONModel({
                approvalText: ""
            });

            this.oCopyDialogModel = new JSONModel({
                page: null,
                approvalText: ""
            });
        },

        formatter: formatter,
        formatMessage: formatMessage,

        /**
         * Called if the route matched the pattern for viewing a page.
         * Loads the page with the id given in the URL parameter
         *
         * @param {sap.ui.base.Event} event The routing event
         * @private
         */
        _onPageMatched: function (event) {
            var sPageId = event.getParameter("arguments").pageId;

            this._loadPage(decodeURIComponent(sPageId)).then(function (oPage) {
                this.setModel(new JSONModel({
                    page: oPage
                }));
            }.bind(this));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence
         *
         * @param {string} pageId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         * @private
         */
        _loadPage: function (pageId) {
            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                return PagePersistence.getPage(pageId);
            });
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
         * Navigates to the page overview view
         *
         * @private
         */
        _navigateToPageOverview: function () {
            this.getRouter().navTo("overview");
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
         *
         * @param {sap.ui.base.Event} oEvent The deletePage event
         * @return {Promise<void>} A promise resolving when the page has been deleted
         */
        _deletePage: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sPageToDeleteId = this.getModel().getProperty("/page/content/id");

            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                PagePersistence.deletePage(sPageToDeleteId);
            }).then(function () {
                this._navigateToPageOverview();
                MessageToast.show(resources.i18nModel.getProperty("pageOverviewSuccess"));
                oDialog.close();
            }.bind(this)).catch(Log.error);
        },

        /**
         * Copies a page
         * @private
         */
        _copyPage: function () {
            //@TODO: implement
            // var oDialog = oEvent.getSource().getParent();
        },

        /**
         * Called if the Edit button is clicked.
         * Loads the edit route
         */
        onEdit: function () {
            this._navigateToEdit(this.getModel().getProperty("/page/content/id"));
        },

        /**
         * Called if the delete button is clicked
         * Shows the Delete Dialog
         */
        onDelete: function () {
            var oPage = this.getModel().getProperty("/page");
            var sApprovalText = this.getResourceBundle().getText("pageComposerDetailDeleteText", [oPage.content.id, oPage.content.title]);
            this.oDeleteDialogModel.setProperty("/approvalText", sApprovalText);
            this.getOwnerComponent().showDeleteDialog(this.oDeleteDialogModel, this._deletePage.bind(this));
        },

        /**
         * Called if the copy button is clicked
         */
        onCopy: function () {
            var oPage = this.getModel().getProperty("/page");
            var sApprovalText = this.getResourceBundle().getText("pageDetailCopyText", [oPage.content.id, oPage.content.title]);
            this.oCopyDialogModel.setProperty("/page", oPage);
            this.oCopyDialogModel.setProperty("/approvalText", sApprovalText);
            this.getOwnerComponent().showCopyDialog(this.oCopyDialogModel, this._copyPage.bind(this));
        },

        /**
         * Called if the input in the copy-page dialog is changed
         * Toggles the state of the save button
         * @param {sap.ui.base.Event} oEvent The change event
         */
        onCopyInputChange: function (oEvent) {
            var sText = oEvent.getParameter("value");
            var oParent = oEvent.getSource().getParent().getParent();

            oParent.getBeginButton().setEnabled(sText.length > 0);
        }
    });
});