/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides the OrthographicCamera class.
sap.ui.define([
	"./NS",
	"./Camera"
], function(
	NS,
	Camera
) {
	"use strict";

	/**
	 * Constructor for a new OrthographicCamera.
	 *
	 *
	 * @class Provides the interface for the camera.
	 *
	 *
	 * @public
	 * @author SAP SE
	 * @version 1.69.0
	 * @extends sap.ui.vk.Camera
	 * @alias sap.ui.vk.OrthographicCamera
	 * @since 1.52.0
	 */
	var OrthographicCamera = Camera.extend(NS.getName("OrthographicCamera"), /** @lends sap.ui.vk.OrthographicCamera.prototype */ {
		metadata: {
			properties: {
				/**
				 * Camera zoom factor
				 */
				"zoomFactor": {
					type: "float"
				}
			}
		}
	});

	return OrthographicCamera;
});
