//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/resources",
    "sap/ushell/applications/PageComposer/controller/CopyDialog",
    "sap/ushell/applications/PageComposer/controller/DeleteDialog"
], function (UIComponent, resources, CopyDialog, DeleteDialog) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.PageComposer.Component", {

        metadata: {
            "manifest": "json"
        },

        /**
         * Initializes the component
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(resources.i18nModel, "i18n");
            this.getRouter().initialize();

            this._copyDialog = new CopyDialog(this.getRootControl());
            this._deleteDialog = new DeleteDialog(this.getRootControl());
        },

        /**
         * Cleans up the references
         */
        exit: function () {
            this._copyDialog.destroy();
            this._deleteDialog.destroy();

            delete this._copyDialog;
            delete this._deleteDialog;
        },

        /**
         * Shows a copy dialog for pages
         *
         * @param {sap.ui.model.Model} oModel The model for the dialog
         * @param {function} fnResolve the function to call when the copy action is confirmed
         */
        showCopyDialog: function (oModel, fnResolve) {
            this._copyDialog.open(oModel, fnResolve);
        },

        /**
         * Shows a delete dialog for pages
         *
         * @param {sap.ui.model.Model} oModel The model for the dialog
         * @param {function} fnResolve the function to call when the delete action is confirmed
         */
        showDeleteDialog: function (oModel, fnResolve) {
            this._deleteDialog.open(oModel, fnResolve);
        }
    });
});
