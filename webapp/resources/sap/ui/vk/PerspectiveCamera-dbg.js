/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the PerspectiveCamera class.
sap.ui.define([
	"./NS",
	"./Camera"
], function(
	NS,
	Camera
) {
	"use strict";

	/**
	 * Constructor for a new perspective camera.
	 *
	 *
	 * @class Provides the interface for the camera.
	 *
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.69.0
	 * @extends sap.ui.vk.Camera
	 * @alias sap.ui.vk.PerspectiveCamera
	 * @since 1.52.0
	 */
	var PerspectiveCamera = Camera.extend(NS.getName("PerspectiveCamera"), /** @lends sap.ui.vk.PerspectiveCamera.prototype */ {
		metadata: {
			properties: {
				/**
				 * Camera frustum field of view in degree
				 */
				"fov": {
					type: "float"
				}
			}
		}
	});

	return PerspectiveCamera;
});
