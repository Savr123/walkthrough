// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview default event delegation setup for application
 * @version 1.69.1
 */
sap.ui.define([
	"sap/ushell/appRuntime/ui5/services/TunnelsAgent"
], function (tunnelsAgent) {
	"use strict";

	function AppDelegationBootstrap () {
		this.init = function () {

		};

		this.bootstrap = function () {

			// var clickCallback = tunnelsAgent.usePairedInterface({
			// 	sService: "sap.ushell.pairedInterface",
			// 	sMethodName: "clickCallback",
			// 	fnPackArgs: function(sTestParam) {
			// 		return {
			// 			sTestParam: sTestParam
			// 		}
			// 	}
			// });
			//
			// clickCallback("My test param!")
			// 	.done(function(val){
			// 		console.log("DEBUG: the function returned the value: " + val);
			// 	});

			tunnelsAgent.reflectEvents({
				"addmouseclick": {
					iInterface: document,
					sFuncName: "addEventListener",
					fnProxy: function (eventType, fnCallback, useCapture) {
						var oCallback = {};
						if (fnCallback.getPairedInterface) {
							oCallback = {
								pairedInterface: fnCallback.getPairedInterface()
							};
						} else {
							oCallback = fnCallback;
						}
						return [eventType, oCallback, useCapture];
					},
					fnSpy: function (eventType) {
						return eventType === "click";
					}
				},
				"addkeypress": {
					iInterface: document,
					sFuncName: "addEventListener",
					fnProxy: function (eventType, fnCallback, useCapture) {
						return [eventType, undefined, useCapture];
					},
					fnSpy: function (eventType) {
						return eventType === "keypress";
					}
				},
				"appOpening": {
					iInterface: sap.ui.getCore().getEventBus(),
					sFuncName: "subscribe",
					fnSpy: function (publisher, eventName) {
						return publisher === "launchpad" && eventName === "appOpening";
					}
				}
			});
		};
	}

	return new AppDelegationBootstrap();

}, /* bExport= */ true);