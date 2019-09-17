// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * Abstract base class for extending the "PageSave" process by
 * - adding fields to the "PageSaveDialog" form
 * - listening to changes on these fields
 * - decorating the result object with values from these fields
 * - resetting these fields
 */
sap.ui.define([
    "sap/ui/base/Object"
], function (BaseObject) {
    "use strict";

    function _err () {
        throw Error("Please implement in subclass");
    }

    return BaseObject.extend("sap.ushell.extensions._PageComposition.TransportInformation", {
        /**
         * Creates the transport fragment containing the form fields to display
         *
         * @abstract
         * @returns {Promise<object>} The promise resolving to the fragment
         */
        createContent: _err,
        /**
         * Registers a function to call on the change event of a mandatory input field
         *
         * @abstract
         * @param {function} changeHandler The change handler function
         */
        change: _err,
        /**
         * Decorates the result object by adding transport-specific properties
         *
         * @abstract
         * @param {object} pageInfo The result object
         * @returns {object} The enhanced object
         */
        decorateResultWithTransportInformation: _err,
        /**
         * Resets the input fields and the model for the transport
         */
        reset: _err
    });

});