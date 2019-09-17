//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ushell/resources",
    "sap/ushell/ui/pagecomposer/PageSaveDialog.controller",
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery"
], function (
    Fragment,
    resources,
    oPageSaveDialogController,
    Config,
    jQuery
) {
    "use strict";

    // Promise used to avoid setting up the XML fragment twice
    var oFragmentPromise = null;
    var oTransport = null;

    /**
     * For ABAP systems, add the transport fields to the given PageSaveDialog fragment
     * Alter the resolve function, which is called on save, to include values for these fields
     *
     * @param {sap.ui.core.Control} fragment The PageSaveDialog fragment
     * @param {function} resolve The resolve function
     * @private
     */
    function _addTransportInformation (fragment, resolve) {
        var fnSetTransportValidation = function (isValid) {
            var oModel = fragment.getModel();
            var oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                transport: isValid
            });
            oModel.setProperty("/validation", oValidation);
        };
        var fnCreateResolve = function (transport) {
            return function (pageInfo) {
                var oPageInfo = transport.decorateResultWithTransportInformation(pageInfo);
                resolve(oPageInfo);
            };
        };

        var sTransportModuleUrl = Config.last("/core/pageComposition/transport/module");
        sap.ui.require([sTransportModuleUrl], function (Transport) {
            oTransport = new Transport();
            fnSetTransportValidation(false);
            oTransport.change(fnSetTransportValidation);
            oTransport.createContent().then(function (oTransportInformationFragment) {
                fragment.addContent(oTransportInformationFragment);
                oPageSaveDialogController._resolveSavePagePromise = fnCreateResolve(oTransport);
            });
        });
    }

    function getPageSaveInformation (oView) {

        function setBusy (bBusy) {
            var oShellControl = sap.ui.getCore().byId("viewPortContainer");
            if (oShellControl) {
                oShellControl.setBusy(bBusy);
            }
        }

        return new Promise(function (fnResolve, fnReject) {
            if (!oFragmentPromise) {
                setBusy(true);
                oFragmentPromise = Fragment.load({
                    name: "sap.ushell.ui.pagecomposer.PageSaveDialog",
                    controller: oPageSaveDialogController,
                    type: "XML"
                });
            }

            oFragmentPromise.then(function (oFragment) {
                var bTransportSupport = Config.last("/core/pageComposition/transport/support");
                setBusy(false);

                oFragment.attachAfterClose(function () {
                    oFragmentPromise = null;
                    oTransport = null;
                });

                if (oView) {
                    oView.addDependent(oFragment);
                }

                oPageSaveDialogController._resolveSavePagePromise = fnResolve;
                oPageSaveDialogController._rejectSavePagePromise = fnReject;

                if (bTransportSupport) {
                    _addTransportInformation(oFragment, fnResolve);
                }

                oFragment.open();
            });
        });
    }

    function create () {
        return {
            getPageSaveInformation: getPageSaveInformation
        };
    }

    return {
        create: create
    };


});