// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    return {

        fnChangeHandler: null,

        /**
         * Checks if the given values are valid
         *
         * @param {string} sWorkbenchRequest The value of the WorkbenchRequest input
         * @param {string} sPackage The value of the Package input
         * @param {boolean} bIsTmp Whether the package is "$TMP"
         * @returns {boolean} The result
         * @private
         */
        _checkModelValidity: function (sWorkbenchRequest, sPackage, bIsTmp) {
            return bIsTmp ? true : sWorkbenchRequest !== "" && sPackage !== "";
        },

        /**
         * Toggles the state of the WorkbenchRequest input according to what is entered in the Package input
         *
         * @param {boolean} isTmp Whether the package input is "$TMP"
         * @private
         */
        _toggleWorkbenchInput: function (isTmp) {
            var oWorkbenchRequestSelect = sap.ui.getCore().byId("sapUshellPageSaveDialog-workbenchRequestSelect");
            var oWorkbenchRequestSelectLabel = sap.ui.getCore().byId("sapUshellPageSaveDialog-workbenchRequestSelectLabel");
            oWorkbenchRequestSelect.setEditable(!isTmp);
            oWorkbenchRequestSelectLabel.setRequired(!isTmp);

            if (isTmp) {
                oWorkbenchRequestSelect.setSelectedKey("");
            }
        },

        /**
         * Called if a bound input field is changed
         */
        onChange: function () {
            var oCore = sap.ui.getCore();
            var sWorkbenchRequestSelectedValue = oCore.byId("sapUshellPageSaveDialog-workbenchRequestSelect").getSelectedKey();
            var sPackageInputValue = oCore.byId("sapUshellPageSaveDialog-packageInput").getValue();
            var bIsTmp = sPackageInputValue === "$TMP";

            this._toggleWorkbenchInput(bIsTmp);

            if (this.fnChangeHandler) {
                var bIsValid = this._checkModelValidity(sWorkbenchRequestSelectedValue, sPackageInputValue, bIsTmp);
                this.fnChangeHandler(bIsValid);
            }
        },

        /**
         * Attaches the given handler to the change event
         *
         * @param {function} fnHandler The handler to call on the change event
         */
        attachChangeEventHandler: function (fnHandler) {
            this.fnChangeHandler = fnHandler;
        }
    };
});
