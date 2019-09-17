// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Helper functions for the different UI factories.
 */
sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ushell/resources"
], function (Fragment, resources) {
    "use strict";

    var Utils = {};

    /**
     * Loads and prepares the XML fragment instance.
     *
     * @param {string} fragmentName The name of the fragment to load
     * @param {sap.ui.model.json.JSONModel} model The JSON model to assign to the fragment
     * @param {object} controller The controller to use with the fragment
     * @return {Promise<sap.ui.core.Control>}
     *      A promise that resolves with the instance of
     *      the XML fragment complete of model and controller.
     * @experimental Since 1.68.0
     *
     * @protected
     */
    Utils.setupXMLFragment = function (fragmentName, model, controller) {
        return new Promise(function (resolve, reject) {
            Fragment.load({
                name: fragmentName,
                controller: controller,
                type: "XML"
            }).then(function (fragment) {
                fragment.setModel(model);
                fragment.setModel(resources.i18nModel, "i18n");

                resolve(fragment);
            }).catch(reject);
        });
    };

    return Utils;

}, false /* bExport */);
