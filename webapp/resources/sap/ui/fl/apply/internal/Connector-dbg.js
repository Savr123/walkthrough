/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/apply/internal/connectors/Utils",
	"sap/ui/fl/apply/connectors/BaseConnector",
	"sap/base/Log"
], function(
	ConnectorUtils,
	BaseConnector,
	Log
) {
	"use strict";

	/**
	 * Abstraction providing an API to handle communication with persistencies like back ends, local & session storage or work spaces.
	 *
	 * @namespace
	 * @name sap.ui.fl.apply.internal.Connector
	 * @author SAP SE
	 * @experimental Since 1.67
	 * @since 1.67
	 * @version 1.69.1
	 * @private
	 */

	/**
	 * Adds entities of one object into another; depending of the type and presence of entries the behaviour differs:
	 * * not present: it is just added
	 * * present and an array: it is merged
	 * * present and an object: it is merged (recursion)
	 * This function changes the object directly without returning it.
	 *
	 * @param {Object} oSource Object providing the data to merge
	 * @param {Object} oTarget Object which got the data added provided by the source
	 * @param {string} sKey key of the property which should be added
	 * @private
	 */
	function _addToObject(oSource, oTarget, sKey) {
		if (!oTarget[sKey]) {
			oTarget[sKey] = oSource[sKey];
			return; // continue
		}

		if (Array.isArray(oTarget[sKey])) {
			oTarget[sKey] = oTarget[sKey].concat(oSource[sKey]);
			return; // continue
		}

		if (typeof oTarget[sKey] === 'object') {
			Object.keys(oSource[sKey]).forEach(function (sInnerKey) {
				_addToObject(oSource[sKey], oTarget[sKey], sInnerKey);
				return; // continue
			});
		}

		// simple entities are just overwritten
		oTarget[sKey] = oSource[sKey];
	}

	/**
	 * Merges the results from all involved connectors.
	 *
	 * @param {Object[]} aResponses all responses provided by the different connectors
	 * @returns {Object} merged result
	 * @private
	 */
	function _mergeResults(aResponses) {
		var oResult = {};

		aResponses.forEach(function (oResponse) {
			Object.keys(oResponse).forEach(function (sKey) {
				_addToObject(oResponse, oResult, sKey);
			});
		});

		return oResult;
	}

	function _loadFlexData (sReference, sAppVersion, aConnectors) {
		var aConnectorPromises = aConnectors.map(function (oConnectorConfig) {
			return new Promise(function (resolve) {
				oConnectorConfig.connector.loadFlexData(sReference, sAppVersion)
					.then(resolve, _logAndResolveDefault.bind(null, resolve, BaseConnector._RESPONSES.FLEX_DATA, oConnectorConfig, "loadFlexData"));
			});
		});

		return Promise.all(aConnectorPromises);
	}

	function _loadFeatures (aConnectors) {
		var aConnectorPromises = aConnectors.map(function (oConnectorConfig) {
			return new Promise(function (resolve) {
				return oConnectorConfig.connector.loadFeatures()
					.then(resolve, _logAndResolveDefault.bind(null, resolve, BaseConnector._RESPONSES.FEATURES, oConnectorConfig, "loadFeatures"));
			});
		});

		return Promise.all(aConnectorPromises);
	}

	function _logAndResolveDefault(resolve, oResponse, oConnectorConfig, sFunctionName, sErrorMessage) {
		Log.error("Connector (" + oConnectorConfig.connectorName + ") failed call '" + sFunctionName + "': " + sErrorMessage);
		resolve(oResponse);
	}

	var Connector = {};

	/**
	 * Provides the flex data for a given application based on the configured connectors, the application reference and its version.
	 *
	 * @param {string} sReference reference of the application for which the flex data is requested
	 * @param {string} sAppVersion version of the application for which the flex data is requested
	 * @returns {Promise<Object>}
	 */
	Connector.loadFlexData = function (sReference, sAppVersion) {
		return ConnectorUtils.getApplyConnectors()
			.then(_loadFlexData.bind(this, sReference, sAppVersion))
			.then(_mergeResults);
	};

	/**
	 * Provides the information which features are provided based on the responses of the involved connectors.
	 *
	 * @returns {Promise<Object>} map feature flags and additional provided information form the connectors
	 */
	Connector.loadFeatures = function () {
		return ConnectorUtils.getApplyConnectors()
			.then(_loadFeatures)
			.then(_mergeResults);
	};

	return Connector;
}, true);
