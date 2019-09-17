//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources"
], function (UIComponent, JSONModel, resources) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.PageComposerLegacy.Component", {

        metadata: {
            "manifest": "json"
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            this.refreshModel();
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
            this.setModel(resources.i18nModel, "i18n");
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
                    pages: aPages.map(function (oPage) {
                        return {
                            Id: oPage.content.id,
                            Name: oPage.content.title || "",
                            Description: oPage.content.description || "",
                            CreatedBy: oPage.content.createdBy || "",
                            CreatedOn: oPage.content.createdOn || "",
                            ChangedBy: oPage.content.changedBy || "",
                            ChangedOn: oPage.content.changedOn || ""
                        };
                    })
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
});
