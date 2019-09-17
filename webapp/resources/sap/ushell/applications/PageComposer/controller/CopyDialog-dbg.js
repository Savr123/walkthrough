// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/strings/formatMessage",
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment",
    "sap/ushell/resources"
], function (
    formatMessage,
    ManagedObject,
    Fragment,
    resources
) {
    "use strict";

    return ManagedObject.extend("sap.ushell.applications.PageComposer.controller.CopyDialog", {
        constructor: function (oView) {
            this._oView = oView;
        },

        exit: function () {
            delete this._oView;
        },

        /**
         * Load the fragment and open the dialog
         *
         * @param {sap.ui.model.Model} oModel The model to set to the dialog
         * @param {function} fnResolve Function called if the dialog action is confirmed
         */
        open: function (oModel, fnResolve) {
            var oView = this._oView;
            var oFragmentLoadOptions = {
                id: oView.getId(),
                name: "sap.ushell.applications.PageComposer.view.CopyDialog",
                controller: {
                    formatMessage: formatMessage,
                    /**
                     * Called after the dialog closes. Destroys the control
                     */
                    onAfterClose: function () {
                        oView.byId("pageDetailCopyDialog").destroy();
                    },
                    /**
                     * Called if the cancel button is pressed
                     */
                    onCancel: function () {
                        oView.byId("pageDetailCopyDialog").close();
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
                    },
                    onConfirm: fnResolve
                }
            };
            Fragment.load(oFragmentLoadOptions).then(function (fragment) {
                fragment.setModel(oModel);
                fragment.setModel(resources.i18nModel, "i18n");
                oView.addDependent(fragment);
                fragment.open();
            });
        }
    });
});