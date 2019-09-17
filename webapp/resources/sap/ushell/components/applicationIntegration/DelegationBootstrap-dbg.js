// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.69.1
 */
sap.ui.define([
	"sap/ushell/components/applicationIntegration/eventDelegation/tunnels"
], function (tunnels) {
	"use strict";

	var that = this;

	function DelegationBootstrap () {
		that = this;
		this.init = function (fnRegisterCommHandler) {
			that.fnRegisterCommHandler = fnRegisterCommHandler;
			tunnels.init(fnRegisterCommHandler);
		};

		this.bootstrap = function () {
			var oInterface = {
					clickCallback: function (event) {
						// console.log("DEBUG: In outer shell click callback");
						// if (event.sTestParam) {
						// 	console.log("DEBUG: param: " + event.sTestParam);
						// }
						return "return value!";
					},
					keyPressCallback: function (event) {
						// console.log("key press handled!");
					}
				},
				oEvents = {
					"addmouseclick": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function (type, fnCallback, useCapture) {
							var oCallback;
							if (fnCallback.pairedInterface) {
								oCallback = tunnels.getPairedMethod(fnCallback.pairedInterface);
							} else {
								oCallback = fnCallback;
							}
							return [type, oCallback, useCapture];
						},
						fnSpy: function (type) {
							return type === "click";
						}
					},
					"addkeypress": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function (type, fnCallback, useCapture) {
							return [type, oInterface.keyPressCallback, useCapture];
						},
						fnSpy: function (type) {
							return type === "keypress";
						}
					},
					"appOpening": {
						oInterface: sap.ui.getCore().getEventBus(),
						sFuncName: "subscribe",
						fnSpy: function (publisher, eventName) {
							return publisher === "launchpad" && eventName === "appOpening";
						}
					}

				},

				oTunnels = {
					"clickCallback": {
						oInterface: oInterface,
						sFuncName: "clickCallback",
						pair: {
							sMethod: "clickCallback",
							sInterface: "sap.ushell.pairedInterface",
							fnExtractArguments: function (oServiceParams) {
								return [{
									sTestParam: oServiceParams.oMessageData.body.sTestParam
								}];
							}
						}
					},
					"keyPressCallback": {
						oInterface: oInterface,
						sFuncName: "keyPressCallback"
					}
				};

			tunnels.registerEvents(oEvents);

			tunnels.registerTunnels(oTunnels);
		};

		this.setup = function (fnRegisterShellCommunicationHandler) {
			tunnels.setup(fnRegisterShellCommunicationHandler);
		};

		this.createInterface = function (oConfig) {
			var sInterfaceName = oConfig.name,
				fnCallback = oConfig.callback;
			tunnels.createInterface(sInterfaceName, that.fnRegisterCommHandler, fnCallback);
		};

		this.registerEvents = function(oEvents) {
			tunnels.registerEvents(oEvents);
		};

		this.registerTunnels = function(oTunnels) {
			tunnels.registerTunnels(oTunnels);
		};
	}

	return new DelegationBootstrap();

}, /* bExport= */ true);
