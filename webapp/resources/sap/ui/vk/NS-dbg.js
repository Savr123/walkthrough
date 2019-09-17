/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/base/util/ObjectPath"
], function(
	ObjectPath
) {
	"use strict";

	// An application specific copy of the VIT library may override these 2 variables.
	// E.g.:
	//   var namespace = "sap.ve.special.vk";
	//   var modulePath = "sap/ve/special/vk";
	var namespace = "sap.ui.vk";
	var modulePath = "sap/ui/vk";

	/**
	 * Manages the VIT namespace.
	 *
	 * @namespace
	 * @since 1.67.0
	 * @alias module:sap/ui/vk/NS
	 * @private
	 */
	var NS = {};

	/**
	 * Get the module's full name.
	 *
	 * @private
	 * @param {string} [moduleRelativePath] The module's relative name where each name is separated by '.', e.g. <code>"threejs.Scene"</code>.
	 *                                      If the parameter is omitted then the library's full name is returned.
	 * @returns {string} The module's full name, e.g. <code>"sap.ui.vk.threejs.Scene"</code>.
	 */
	NS.getName = function(moduleRelativePath) {
		return arguments.length === 0 ? namespace : namespace + "." + moduleRelativePath;
	};

	/**
	 * Get the module's full path.
	 *
	 * @private
	 * @param {string} [moduleRelativePath] The module's relative path where each name is separated by '/', e.g. <code>"threejs/Scene"</code>.
	 *                                      If the parameter is omitted then the library's full path is returned.
	 * @returns {string} The module's full path, e.g. <code>"sap/ui/vk/threejs/Scene"</code>.
	 */
	NS.getPath = function(moduleRelativePath) {
		return arguments.length === 0 ? modulePath : modulePath + "/" + moduleRelativePath;
	};

	/**
	 * Get the module's object.
	 *
	 * @private
	 * @param {string} [moduleRelativePath] The module's relative name where each name is separated by '.', e.g. <code>threejs.Scene</code>.
	 *                                      If the parameter is omitted then the library is returned.
	 * @returns {string} The module's object, e.g. <code>sap.ui.vk.threejs.Scene</code>.
	 */
	NS.getObject = function(moduleRelativePath) {
		return ObjectPath.get(arguments.length === 0 ? NS.getName() : NS.getName(moduleRelativePath));
	};

	return NS;
});
