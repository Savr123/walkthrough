/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/fe/controllerextensions/Transaction",
	"sap/fe/controllerextensions/Routing",
	"sap/fe/controllerextensions/EditFlow",
	"sap/ui/model/odata/v4/ODataListBinding"
], function (Controller, JSONModel, Transaction, Routing, EditFlow, ODataListBinding) {
	"use strict";

	return Controller.extend("sap.fe.templates.ObjectPage.ObjectPageController", {

		transaction : Transaction,
		routing : Routing,
		editFlow : EditFlow,

		onInit : function() {
			//var oObjectPage = this.byId("fe::op");

			this.getView().setModel(this.editFlow.getUIStateModel(), "ui");
			this.getView().setModel(new JSONModel(), "localUI");

			//Attaching the event to make the subsection context binding active when it is visible.

			/*
			oObjectPage.attachEvent("subSectionEnteredViewPort", function(oEvent) {
				var oObjectPage = oEvent.getSource();
				var oSubSection = oEvent.getParameter("subSection");
				oObjectPage.getHeaderTitle().setBindingContext(undefined);
				oObjectPage.getHeaderContent()[0].setBindingContext(undefined);//The 0 is used because header content will have only one content (FlexBox).
				oSubSection.setBindingContext(undefined);
			});
			*/

		},

		onBeforeBinding: function (oContext, mParameters) {
			// TODO: we should check how this comes together with the transaction controllerExtension, same to the change in the afterBinding
			var aTables = this._findTables(),
				oFastCreationRow,
				bCreateMode;


			// For now we have to set the binding context to null for every fast creation row TODO: to be changed
			for (var i = 0; i < aTables.length; i++) {
				oFastCreationRow = aTables[i].getCreationRow();
				if (oFastCreationRow) {
					oFastCreationRow.setBindingContext(null);
				}
			}

			if (mParameters && mParameters.editable) {
				if (oContext === null){
					// currently having no context means we are in the create mode
					// TODO: the create mode logic has to be refactored - the mode shall be set by the transaction controller
					bCreateMode = true;
				}

				// the page shall be immediately in the edit mode to avoid flickering
				this.editFlow.setEditMode('Editable', bCreateMode);
			} else {
				// currently there is no other place removing the create mode so we set it by default to false
				// TODO: this should be also improved, see comment above
				if (this.getView().getViewData().viewLevel === 1){
					this.editFlow.setEditMode('Display', false);
				} else {
					this.editFlow.setEditMode(undefined, false);
				}
			}

			var oObjectPage = this.byId("fe::op");

			// Srcoll to present Section so that bindings are enabled during navigation through paginator buttons, as there is no view rerendering/rebind
			var fnScrollToPresentSection = function (oEvent) {
				oObjectPage.scrollToSection(oObjectPage.getScrollingSectionId());
				oObjectPage.detachModelContextChange(fnScrollToPresentSection);
			};

			oObjectPage.attachModelContextChange(fnScrollToPresentSection);

			//Setting the context binding to inactive state for all object page components.
			/*
			oObjectPage.getHeaderTitle().setBindingContext(null);
			oObjectPage.getHeaderContent()[0].setBindingContext(null);//The 0 is used because header content will have only one content (FlexBox).
			oObjectPage.getSections().forEach(function(oSection){
				oSection.getSubSections().forEach(function(oSubSection){
					oSubSection.setBindingContext(null);
				});
			});
			*/
		},

		onAfterBinding : function(oBindingContext, mParameters) {
			var oObjectPage = this.byId('fe::op'),
				that = this,
				oModel = oBindingContext.getModel(),
				aTables = this._findTables(),
				oFinalUIState,
				oPaginator;

			//Set the Binding for Paginators using ListBinding ID
			oModel.getBindingForReference(mParameters.listBindingId).then(function (oBinding) {
				if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					oPaginator = that.byId("fe::paginator");
					if (oPaginator && !oPaginator.getListBinding()) {
						oPaginator.setListBinding(oBinding);
					}
				}
			});

            // TODO: this is only a temp solution as long as the model fix the cache issue and we use this additional
			// binding with ownRequest
            oBindingContext = oObjectPage.getBindingContext();

			// Compute Edit Mode
			oFinalUIState = this.editFlow.computeEditMode(oBindingContext);

            // TODO: this should be moved into an init event of the MDC tables (not yet existing)
			function enableFastCreationRow(oTable, oListBinding){
				var oFastCreationRow = oTable.getCreationRow(),
					sAbsolutePath, oFastCreationListBinding, oFastCreationContext;

				if (oFastCreationRow ){
					oFinalUIState.then(function(){
						if (oFastCreationRow.getVisible()){
							sAbsolutePath = oListBinding.getContext().getPath() + '/' + oListBinding.getPath();
							oFastCreationListBinding = oModel.bindList(sAbsolutePath, null, [], [], {$$updateGroupId: "create"});
							oFastCreationContext = oFastCreationListBinding.create();
							oFastCreationRow.setBindingContext(oFastCreationContext);
						}
					});
				}
			}

			// should be called only after binding is ready hence calling it in onAfterBinding
			oObjectPage._triggerVisibleSubSectionsEvents();

			// this should not be needed at the all
			function handleTableModifications(sLocalTableId, oTable){
				oModel.getBindingForReference(sLocalTableId).then(function(oBinding){
					that.editFlow.handlePatchEvents(oBinding);
					enableFastCreationRow(oTable, oBinding);
				});
			}

			// take care on message handling, draft indicator (in case of draft)
			//Attach the patch sent and patch completed event to the object page binding so that we can react
			this.editFlow.handlePatchEvents(oBindingContext).then(function(){
				// same needs to be done for tha tables as well
				var sNamedBindingId, aCustomData;

				for (var i = 0; i < aTables.length; i++){
					aCustomData = aTables[i].getCustomData();
					for (var item in aCustomData) {
						if (aCustomData[item].getKey() === 'namedBindingId') {
							sNamedBindingId = aCustomData[item].getValue();
						}
					}
					handleTableModifications(sNamedBindingId, aTables[i]);
				}
			});
		},

		//TODO: This is needed for two workarounds - to be removed again
		_findTables : function(){
			var oObjectPage = this.byId('fe::op'),
				aTables = [];

			function findTableInSubSection(aParentElement) {
				for (var element = 0; element < aParentElement.length; element++) {
					var oParent = aParentElement[element].getAggregation('items') && aParentElement[element].getAggregation('items')[0],
						oElement = oParent && oParent.getAggregation('content');

					if (oElement && oElement.isA('sap.ui.mdc.Table')) {
						aTables.push(oElement);
					}
				}
			}

			var aSections = oObjectPage.getSections();
			for (var section = 0; section < aSections.length; section++) {
				var aSubsections = aSections[section].getSubSections();
				for (var subSection = 0; subSection < aSubsections.length; subSection++) {
					findTableInSubSection(aSubsections[subSection].getBlocks());
					findTableInSubSection(aSubsections[subSection].getMoreBlocks());
				}
			}

			return aTables;
		},
		handlers: {
			onDataRequested : function() {
				// TODO: this is a temporary solution to keep the OP busy until data is received and bound to the object page
				// should be removed once POST with $select and $expand is supported
				var oNavContainer = this.getView().getController().getOwnerComponent().getRootControl();
				oNavContainer.setBusy(true);
			},
			onDataReceived:function(oEvent){
				// TODO: this is a temporary solution to remove the Navigation Container's busy after data has been bound to object page.
				// should be removed once POST with $select and $expand is supported
				var sErrorDescription = oEvent && oEvent.getParameter("error");
				var oNavContainer = this.getView().getController().getOwnerComponent().getRootControl();
				oNavContainer.setBusy(false);
				var that = this;
				if (sErrorDescription) {
					// TODO: in case of 404 the text shall be different
					sap.ui.getCore().getLibraryResourceBundle("sap.fe", true).then(function (oResourceBundle) {
						that.routing.navigateToMessagePage(oResourceBundle.getText('SAPFE_DATA_RECEIVED_ERROR'), {
							title: oResourceBundle.getText('SAPFE_ERROR'),
							description: sErrorDescription,
							navContainer: oNavContainer
						});
					});
				}
			}
		}

	});
});