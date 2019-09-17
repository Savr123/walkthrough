// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources",
    "sap/ui/thirdparty/jquery"
], function (JSONModel, resources, jQuery) {
    "use strict";

    function getPageSaveDialog () {
        return sap.ui.getCore().byId("sapUshellPageSaveDialog");
    }

    return {
        _closeDialog: function () {
            getPageSaveDialog().close();
        },

        /**
         * Called if the save button is clicked
         * Retrieves all values and resolves the SavePagePromise with the given values
         * Closes the dialog
         */

        onSave: function () {
           var oFragment = getPageSaveDialog();
           var oModel = oFragment.getModel();

           var oResolvedResult = {
               content: {
                   id: oModel.getProperty("/id"),
                   title: oModel.getProperty("/title"),
                   description: oModel.getProperty("/description")
               },
               metadata: {}
           };

           delete this._rejectSavePagePromise;
           this._resolveSavePagePromise(oResolvedResult);
           this._closeDialog();
       },

        /**
         * Called if the cancel button is clicked.
         * Rejects the SavePagePromise and closes the dialog
         */
        onCancel: function () {
            this._rejectSavePagePromise();
            this._closeDialog();
        },

        /**
         * Rejects the promise if the reject method has not been deleted on save
         *
         * @param {sap.ui.base.Event} event The afterClose event
         */
        afterClose: function (event) {
            event.getSource().destroy();
        },
        /**
         * creates a new JSONModel containing the form fields and the validation fields
         *
         * @returns {sap.ui.model.json.JSONModel} The JSONModel instance
         * @private
         */
        _createModel: function () {
            return new JSONModel({
                id: "",
                title: "",
                description: "",
                validation: {
                    id: false
                }
            });
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/id", "");
            oModel.setProperty("/title", "");
            oModel.setProperty("/description", "");
            var oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                id: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Create a new model if it does not exist yet. If it exists, reset all the values
         *
         * @private
         */
        _createOrResetModel: function () {
            var oFragment = getPageSaveDialog();
            var oModel = oFragment.getModel();

            if (!oModel) {
                oFragment.setModel(this._createModel());
                return;
            }
            this._resetModel(oModel);
        },

        /**
         * Called before the PageSaveDialog opens
         * Creates the validation model
         */
        onBeforeOpen: function () {
            var oFragment = getPageSaveDialog();
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            oFragment.setModel(resources.i18nModel, "i18n");

            oFragment.addEventDelegate({
                onsapescape: function () {
                    this._rejectSavePagePromise();
                }.bind(this)
            });

            this._createOrResetModel();
        },

        /**
         * Called on the change of a value relevant to validation
         *
         * @param {sap.ui.base.Event} event The change event
         */
        onChange: function (event) {
            var oFragment = getPageSaveDialog();
            var oInput = event.getSource();
            var oBinding = oInput.getBinding("value");
            var bIsValid = true;
            var oModel = oFragment.getModel();
            var oType = oBinding.getType();
            var sInputValue = oInput.getValue();
            var oValidation;

            try {
                oType.validateValue(sInputValue);
            } catch (oException) {
                bIsValid = false;
            }

            oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                id: bIsValid
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Returns true if all values of the given object are truthy
         *
         * @param {{string: boolean}} oValidation The object containing the validation keys
         * @returns {boolean} The validation result
         */
        validate: function (oValidation) {
            for (var i in oValidation) {
                if (!oValidation[i]) {
                    return false;
                }
            }
            return true;
        }
    };
});
