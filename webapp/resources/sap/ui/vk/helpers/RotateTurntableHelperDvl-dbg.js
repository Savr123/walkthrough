/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.helpers.RotateTurntableHelperDvl.
sap.ui.define([
	"sap/ui/base/EventProvider",
	"../NS"
], function(
	EventProvider,
	NS
) {
	"use strict";

	var RotateTurntableHelperDvl = EventProvider.extend(NS.getName("helpers.RotateTurntableHelperDvl"), {
		metadata: {
			publicMethods: [
				"rotate"
			]
		},
		constructor: function(RotateOrbitTool, DvlInstance) {
			this._tool = RotateOrbitTool;
			this._dvl = DvlInstance;
			this._dvlRendererId = this._tool._viewport._dvlRendererId;
		}
	});

	RotateTurntableHelperDvl.prototype.destroy = function() {
		this._rotateOrbitTool = null;
	};

    RotateTurntableHelperDvl.prototype.activateTurntableMode = function() {
		if (this._dvlRendererId) {
			this._dvl.Renderer.SetOption(sap.ve.dvl.DVLRENDEROPTION.DVLRENDEROPTION_CAMERA_ROTATION_MODE_ORBIT, false);
		}
		return this;
	};

    RotateTurntableHelperDvl.prototype.deactivateTurntableMode = function() {
		if (this._dvlRendererId) {
			this._dvl.Renderer.SetOption(sap.ve.dvl.DVLRENDEROPTION.DVLRENDEROPTION_CAMERA_ROTATION_MODE_ORBIT, true);
		}
		return this;
	};

	/**
	 * Executes orbit rotation against DVL for the target Viewport.
	 *
	 * @param {int} dx The change in x-coordinate used to define the desired rotation.
	 * @param {int} dy The change in y-coordinate used to define the desired rotation.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	RotateTurntableHelperDvl.prototype.rotate = function(dx, dy) {
		if (this._dvlRendererId) {
			this._dvl.Renderer.Rotate(dx * window.devicePixelRatio, dy * window.devicePixelRatio, this._dvlRendererId);
			this._tool.fireRotate({
				dx: dx,
				dy: dy
			});
		}
		return this;
	};

	return RotateTurntableHelperDvl;
});