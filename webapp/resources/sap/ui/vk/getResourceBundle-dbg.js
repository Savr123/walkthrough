/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides function sap.ui.vk.getResourceBundle.
sap.ui.define([
	"sap/ui/core/Core",
	"./NS"
], function(
	core,
	NS
) {
	"use strict";

	var getResourceBundle = function() {
		var resourceBundle = core.getLibraryResourceBundle(NS.getName("i18n"));
		NS.getObject().getResourceBundle = function() {
			return resourceBundle;
		};
		return resourceBundle;
	};

	return getResourceBundle;

}, /* bExport= */ true);
