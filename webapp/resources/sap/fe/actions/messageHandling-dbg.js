/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// Static functions for Fiori Message Handling
sap.ui.define([
		"sap/m/MessageToast",
		"sap/m/MessageItem",
		"sap/m/MessageView",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/ui/core/MessageType",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"],
	function (MessageToast, MessageItem, MessageView, Button, Dialog, MessageType, Filter, FilterOperator) {
		'use strict';

		var that = this;

		function fnFormatTechnicalDetails() {
			var sPreviousGroupName;
			// Insert technical detail if it exists
			function insertDetail(oProperty) {
				return oProperty.property ? '( ${' + oProperty.property + '} ? ("<p>' + oProperty.property.substr(Math.max(oProperty.property.lastIndexOf('/'), oProperty.property.lastIndexOf('.')) + 1) + ' : " + ' + '${' + oProperty.property + '} + "<p/>") : "" )' : '';
			}
			// Insert groupname if it exists
			function insertGroupName(oProperty) {
				var sHTML = '';
				if (oProperty.groupName && oProperty.property && oProperty.groupName !== sPreviousGroupName) {
					sHTML += '( ${' + oProperty.property + '} ? "<br/><h3>' + oProperty.groupName + '</h3>" : "" ) + ';
					sPreviousGroupName = oProperty.groupName;
				}
				return sHTML;
			}

			// List of technical details to be shown
			function getPaths() {
				var sTD = "technicalDetails"; // name of property in message model data for technical details
				return [
					{ 'groupName': '', 'property': sTD + "/status"},
					{ 'groupName': '', 'property': sTD + "/statusText"},
					{ 'groupName': 'Application', 'property': sTD + "/error/@SAP__common.Application/ComponentId"},
					{ 'groupName': 'Application', 'property': sTD + "/error/@SAP__common.Application/ServiceId"},
					{ 'groupName': 'Application', 'property': sTD + "/error/@SAP__common.Application/ServiceRepository"},
					{ 'groupName': 'Application', 'property': sTD + "/error/@SAP__common.Application/ServiceVersion"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.ErrorResolution/Analysis"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.ErrorResolution/Note"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.ErrorResolution/DetailedNote"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.ExceptionCategory"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.TimeStamp"},
					{ 'groupName': 'ErrorResolution', 'property': sTD + "/error/@SAP__common.TransactionId"},
					{ 'groupName': 'Messages', 'property': sTD + "/error/code"},
					{ 'groupName': 'Messages', 'property': sTD + "/error/message"}
				];
			}
			var sHTML = 'Object.keys(' + '${technicalDetails}' + ').length > 0 ? "<h2>Technical Details</h2>" : "" ';
			getPaths().forEach(function (oProperty) {
				sHTML = sHTML + insertGroupName(oProperty) + '' + insertDetail(oProperty) + ' + ';
			});
			return sHTML;
		}
		function fnFormatDescription() {
			var sHTML =  '(${' + 'description} ? ("<h2>Description</h2>" + ${' + 'description}) : "")';
			return sHTML;
		}

		/**
		 * Shows all unbound (including technical) messages and removes those the ones which are transient
		 * @function
		 * @static
		 * @name sap.fe.actions.messageHandling.showUnboundMessages
		 * @memberof sap.fe.actions.messageHandling
		 * @param {Object} [mParameters] Optional, can contain the following attributes:
		 * 	@param {Array} [mParameters.additionalMessages] Array of additional messages given by the user to be displayed along with the other unbound messages.
		 * 	@param {Boolean} [mParameters.includeBoundMessages] Target that should be shown as well
		 * @returns {Promise} Promise resolves once toast disappears / user closes popup
		 * @private
		 * @sap-restricted
		 */
		function showUnboundMessages(mParameters) {
			mParameters = mParameters || {};
			var aUnboundMessages = getMessages(mParameters.includeBoundMessages),
				oMessageManager = sap.ui.getCore().getMessageManager(),
				aFilter = [];

			if (aUnboundMessages.length === 0 && !mParameters.additionalMessages) {
				// Don't show the popup if there are no transient messages
				return Promise.resolve(true);
			} else if (aUnboundMessages.length === 1 && aUnboundMessages[0].getType() === MessageType.Success && !mParameters.additionalMessages) {
				return new Promise(function (resolve, reject) {
					MessageToast.show(aUnboundMessages[0].message);
					oMessageManager.removeMessages(aUnboundMessages);
				});
			} else {
				return new Promise(function (resolve, reject) {
					that.resolve = resolve;
					that.includeBoundMessages = mParameters.includeBoundMessages;

					sap.ui.getCore().getLibraryResourceBundle("sap.fe", true).then(function (oResourceBundle) {
						that.oMessageTemplate = that.oMessageTemplate || new MessageItem({
							counter: '{counter}',
							title: '{message}',
							subtitle: '{additionalText}',
							longtextUrl: '{descriptionUrl}',
							type: '{type}',
							description: '{= ${' + 'description} || ${technicalDetails} ? ' + '"<html><body>" + ' + fnFormatDescription() + ' + ' + fnFormatTechnicalDetails() + '"</body></html>"' + ' : "" }',
							markupDescription: true
						});

						// filter for the unbound
						aFilter.push(new Filter({
							path: 'target',
							operator: FilterOperator.EQ,
							value1: ''
						}));

						if (mParameters.includeBoundMessages){
							aFilter.push(new Filter({
								path: 'target',
								operator: FilterOperator.EQ,
								value1: mParameters.includeBoundMessages
							}));
						}

						if (that.oMessageView){
							that.oMessageView.getBinding("items").filter(aFilter);
						}

						that.oMessageView = that.oMessageView || new MessageView({
							showDetailsPageHeader: false,
							itemSelect: function () {
								that.oBackButton.setVisible(true);
							},
							items: {
								path: '/',
								filters: [
									new Filter({
										filters: aFilter,
										and: false
									})
								],
								template: that.oMessageTemplate
							}
						});
						that.oBackButton = that.oBackButton || new Button({
							icon: sap.ui.core.IconPool.getIconURI("nav-back"),
							visible: false,
							press: function () {
								that.oMessageView.navigateBack();
								this.setVisible(false);
							}
						});
						if (mParameters.additionalMessages && mParameters.additionalMessages.length) {
							mParameters.additionalMessages.forEach(function (oMessage) {
								//The target and persistent properties of the message are hardcoded as '' and true because the function deals with only unbound messages.
								oMessageManager.addMessages(new sap.ui.core.message.Message({
									message: oMessage.text,
									type: oMessage.type,
									target: '',
									persistent: true
								}));
							});
						}
						that.oMessageView.setModel(oMessageManager.getMessageModel());
						that.oDialog = that.oDialog || new Dialog({
							resizable: true,
							content: that.oMessageView,
							state: 'Error',
							beginButton: new Button({
								press: function () {
									that.oDialog.close();
									removeUnboundTransitionMessages();
									if (that.includeBoundMessages){
										removeBoundTransitionMessages(that.includeBoundMessages);
									}

								},
								text: oResourceBundle.getText('SAPFE_CLOSE')
							}),
							customHeader: new sap.m.Bar({
								contentMiddle: [
									new sap.m.Text({text: oResourceBundle.getText('SAPFE_ERROR')})
								],
								contentLeft: [that.oBackButton]
							}),
							contentWidth: "37.5em",
							contentHeight: "21.5em",
							verticalScrolling: false,
							afterClose: function (oEvent) {
								that.resolve();
							}
						});
						that.oDialog.open();
					});
				});
			}
		}

		function removeUnboundTransitionMessages() {
			removeTransitionMessages();
		}

		function removeBoundTransitionMessages(sTarget) {
			removeTransitionMessages(sTarget);
		}

		function getMessages(sTarget, bTransitionOnly){
			var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				aMessages = oMessageModel.getObject('/'),
				aTransitionMessages = [];

			for (var i = 0; i < aMessages.length; i++){
				if ((!bTransitionOnly || aMessages[i].persistent) && (aMessages[i].target === sTarget || aMessages[i].target === '')){
					aTransitionMessages.push(aMessages[i]);
				}
			}

			return aTransitionMessages;
		}

		function removeTransitionMessages(sTarget) {
			var aMessagesToBeDeleted = getMessages(sTarget, true);

			if (aMessagesToBeDeleted.length > 0) {
				sap.ui.getCore().getMessageManager().removeMessages(aMessagesToBeDeleted);
			}
		}
		/**
		 * Static functions for Fiori Message Handling
		 *
		 * @namespace
		 * @alias sap.fe.actions.messageHandling
		 * @public
		 * @sap-restricted
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.56.0
		 */
		var messageHandling = {
			showUnboundMessages: showUnboundMessages,
			removeUnboundTransitionMessages: removeUnboundTransitionMessages,
			removeBoundTransitionMessages: removeBoundTransitionMessages
		};
		return messageHandling;

	}
);
