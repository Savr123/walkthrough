// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ushell_abap/transport/TransportInformation.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/extensions/_PageComposition/TransportInformation"
], function (
    Fragment,
    oTransportInformationController,
    JSONModel,
    TransportInformation
) {
    "use strict";

    return TransportInformation.extend("sap.ushell_abap.transport.Transport", {
        constructor: function () {
            this.oModel = new JSONModel({
                package: "",
                workbenchRequest: ""
            });
        },

        /**
         * Creates the transport fragment containing the form fields to display
         *
         * @returns {Promise<object>} The promise resolving to the fragment
         */
        createContent: function () {
            return Fragment.load({
                name: "sap.ushell_abap.transport.TransportInformation",
                controller: oTransportInformationController,
                type: "XML"
            }).then(function (oFragment) {
                oFragment.setModel(this.oModel);
                return oFragment;
            }.bind(this))
                .then(function (oFragment) {
                    return Promise.all([
                        this._getPackageSuggestions(),
                        this._getWorkbenchSuggestions()
                    ]).then(function (result) {
                        oFragment.setModel(new JSONModel({
                            "PackageSuggestions": result[0],
                            "WorkbenchSuggestions": result[1]
                        }), "suggestions");

                        return oFragment;
                    });
                }.bind(this));
        },

        /**
         * Returns a promise that resolves to an array of suggestions
         * @returns {Promise<[]>} The resulting promise
         * @private
         */
        _getPackageSuggestions: function () {
            return Promise.resolve([{
                "Name": "$TMP"
            }, {
                "Name": "/UI2/FLP_SETTINGS"
            }, {
                "Name": "/UI2/FLP_TEST_HOME"
            }]);
        },

        /**
         * Returns a promise that resolves to an array of suggestions
         * @returns {Promise<[]>} The resulting promise
         * @private
         */
        _getWorkbenchSuggestions: function () {
            return Promise.resolve([{
                "Name": "U1YK012400"
            }, {
                "Name": "U1YK011369"
            }, {
                "Name": "U1YK010697"
            }]);
        },

        /**
         * Registers a function to call on the change event of a mandatory input field
         *
         * @param {function} changeHandler The change handler function
         */
        change: function (changeHandler) {
            oTransportInformationController.attachChangeEventHandler(changeHandler);
        },

        /**
         * Decorates the result object by adding transport-specific properties
         *
         * @param {object} pageInfo The result object
         * @returns {object} The enhanced object
         */
        decorateResultWithTransportInformation: function (pageInfo) {
            pageInfo.metadata = {
                devclass: this.oModel.getProperty("/package"),
                transportId: this.oModel.getProperty("/workbenchRequest")
            };

            return pageInfo;
        }
    });
});
