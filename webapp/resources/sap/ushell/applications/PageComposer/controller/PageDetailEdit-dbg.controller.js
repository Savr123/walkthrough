// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/applications/PageComposer/model/formatter"
], function (
    BaseController,
    JSONModel,
    formatter
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetailEdit", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("edit").attachPatternMatched(this._onPageMatched, this);
        },

        formatter: formatter,

        /**
         * Called if the save button is pressed.
         * Navigates to the page overview after saving all changes to the page
         */
        onSave: function () {
            this._savePage(this.getModel().getProperty("/page")).then(function () {
                this._navigateToPageOverview();
            }.bind(this));
        },

        /**
         * Called if the cancel button is pressed
         * Navigates to the page overview without saving changes
         */
        onCancel: function () {
            this._navigateToPageOverview();
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
         * Called if the route matched the pattern for the editing of a page.
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
         * Saves the page model using the PagePersistence service
         *
         * @param {object} page The page model to save
         * @returns {Promise<void>} A promise
         * @private
         */
        _savePage: function (page) {
            //@TODO: save page groups
            return sap.ushell.Container.getServiceAsync("PagePersistence").then(function (PagePersistence) {
                return PagePersistence.updatePage(page);
            });
        },

        onShowCards: function () {
            //@TODO: show cards
        },

        onShowPreview: function () {
            //@TODO: show preview
        }
    });
});