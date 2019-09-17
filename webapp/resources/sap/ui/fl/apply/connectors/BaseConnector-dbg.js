/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
], function(
) {
	"use strict";

	/**
	 * Base class for connectors.
	 *
	 * @namespace sap.ui.fl.apply.connectors.BaseConnector
	 * @experimental Since 1.67
	 * @since 1.67
	 * @ui5-restricted sap.ui.fl.apply.connectors, sap.ui.fl.apply.internal.Connector, sap.ui.fl.write.internal.Connector
	 */
	var BaseConnector = /** @lends sap.ui.fl.apply.connectors.BaseConnector */{
		/**
		 * Returns default responses for non-implemented functions, or needed response for error handling.
		 *
		 */
		_RESPONSES: {
			FLEX_DATA : {
				changes : [],
				variantSection : {}
			},
			FEATURES : {}
		},

		/**
		 * Interface called to get the flex data, including changes and variants.
		 *
		 * @param {string} sFlexReference - Reference of the application
		 * @param {string} sAppVersion - Version of the application
		 * @returns {Promise<Object>} Promise resolving with an object containing a flex data response
		 * @ui5-restricted
		 */
		loadFlexData:function (/* sFlexReference , sAppVersion */) {
			return Promise.resolve(this._RESPONSES.FLEX_DATA);
		},

		/**
		 * Interface called to get the flex feature.
		 *
		 * @returns {Promise<Object>} Promise resolving with an object containing a flex data response
		 * @ui5-restricted
		 */
		loadFeatures: function () {
			return Promise.resolve(this._RESPONSES.FEATURES);
		}
	};

	return BaseConnector;
}, true);
