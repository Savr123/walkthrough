/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/merge",
	"sap/ui/fl/apply/connectors/BaseConnector"
], function(
	merge,
	BaseConnector
) {
	"use strict";

	/**
	 * Connector for requesting data from an LRep based back end.
	 *
	 * @namespace
	 * @name sap.ui.fl.apply.connectors.LrepConnector
	 * @author SAP SE
	 * @experimental Since 1.67
	 * @since 1.67
	 * @version 1.69.1
	 * @private
	 */
	var LrepConnector = merge({}, BaseConnector, {

		_URL_PREFIX: "/sap/bc/lrep"
	});

	return LrepConnector;
}, true);
