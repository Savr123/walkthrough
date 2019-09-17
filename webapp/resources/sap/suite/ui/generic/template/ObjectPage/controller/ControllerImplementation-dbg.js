sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/suite/ui/generic/template/detailTemplates/detailUtils",
	"sap/suite/ui/generic/template/ObjectPage/controller/SideContentHandler",
	"sap/suite/ui/generic/template/ObjectPage/extensionAPI/ExtensionAPI",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/m/Table",
	"sap/ui/layout/DynamicSideContent",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/ui/dom/jquery/Selectors",
	"sap/base/Log",
	"sap/suite/ui/generic/template/ObjectPage/controller/MultipleViewsHandler",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/lib/MessageUtils",
	"sap/ui/events/KeyCodes"
], function(ControllerExtension, DateFormat, MessageBox, Filter, Sorter, SelectionVariant, testableHelper, detailUtils, SideContentHandler,
		ExtensionAPI, AnnotationHelper, ResponsiveTable, DynamicSideContent, ShareUtils, Selectors, Log, MultipleViewsHandler, JSONModel, MessageUtils, KeyCodes) {
	"use strict";
	var DEFAULT_GROWING_THRESHOLD = 25;

	// Scroll the specified object page to top
	function fnScrollObjectPageToTop(oObjectPage){
		oObjectPage.setSelectedSection(null);
	}

	function fnIsSmartTableWithInlineCreate(oSmartTable) {
		return oSmartTable.data("inlineCreate") === "true";
	}

	function fnSetPropertyBindingInternalType(oBinding, sInternalType) {
		if (oBinding.getBindings) { // composite Binding
			var aBindings = oBinding.getBindings();
			for (var i = 0; i < aBindings.length; i++) {
				fnSetPropertyBindingInternalType(aBindings[i], sInternalType);
			}
		} else {
			var oType = oBinding.getType();
			oBinding.setType(oType, sInternalType);
		}
	}

	// regular expression for ?
	var rPath = /[A-Za-z].*[A-Za-z]/;

	var oMethods = {
		getMethods: function(oViewProxy, oTemplateUtils, oController) {

			//contains instance attributes that are shared with helper class oMultipleViewsHandler
			var oState = {
				"oMultipleViewsHandler" : {

				}
			};

			var oBase = detailUtils.getControllerBase(oViewProxy, oTemplateUtils, oController);
			oViewProxy.oController = oController; //Controller attached to ViewProxy so that it's available wherever oViewProxy is accessed
			var bIsObjectRoot; // will currently be set first time, when edit button is pressed
			var oObjectPage;  // the object page, initialized in onInit
			var oSideContentHandler = new SideContentHandler(oController, oTemplateUtils, oBase.stateChanged); // handles all task connected with SideContent

			// current state
			var sSectionId;  // id of the last section that was navigated to

			// end of current state

			function adjustAndProvideBindingParamsForSmartTableOrChart(oEvent){
				var oBindingParams = oEvent.getParameter("bindingParams");
				oBindingParams.parameters = oBindingParams.parameters || {};
				oBindingParams.parameters.usePreliminaryContext = true;
				oBindingParams.parameters.batchGroupId = "facets";
				return oBindingParams;
			}

			function onActivateImpl() {
				Log.info("Activate object");
				var oSaveScenarioHandler = oBase.state.saveScenarioHandler;
				var oActivationPromise = oTemplateUtils.oServices.oCRUDManager.activateDraftEntity(oSaveScenarioHandler);
				oActivationPromise.then(function(oResponse) {
					// when the message model contains at least one transient message this will be shown at the end of the busy session. Otherwise we show a generic success message.
					MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_SAVED"), oTemplateUtils.oServices);
					// it's not enough to set root to dirty: Scenario: subitem has been displayed (active document), then changed (draft) and shall be
					// displayed again after activation - now data has to be read again
					// therefore we set all pages to dirty, excluding the current one (here the active data is already returned by the function import)
					var oComponent = oController.getOwnerComponent();
					oTemplateUtils.oServices.oViewDependencyHelper.setAllPagesDirty([oComponent.getId()]);
					oTemplateUtils.oServices.oViewDependencyHelper.unbindChildren(oComponent);
					// Draft activation is a kind of cross navigation -> invalidate paginator info
					oTemplateUtils.oServices.oApplication.invalidatePaginatorInfo();
					var bNavToListOnSave = oComponent.getNavToListOnSave();
					oTemplateUtils.oServices.oApplication.navigateAfterActivation(!bNavToListOnSave && oResponse.context);
				}, jQuery.noop);
				var oEvent = {
					activationPromise: oActivationPromise
				};
				oTemplateUtils.oComponentUtils.fire(oController, "AfterActivate", oEvent);
			}

			function onActivate() {
				oBase.state.saveScenarioHandler.handleSaveScenario(1, onActivateImpl);
				fnDetachPasteHandlers();
			}
			
			function onSaveImpl() {
				var oView = oController.getView();
				var oPendingChanges = oView.getModel().getPendingChanges();
				oTemplateUtils.oCommonEventHandlers.submitChangesForSmartMultiInput();
				
				var bCreateMode = oTemplateUtils.oComponentUtils.isNonDraftCreate();
				var oSaveEntityPromise = oTemplateUtils.oServices.oCRUDManager.saveEntity();
				oSaveEntityPromise.then(function(oContext) {
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", 1);
					//	switch to display mode
					oViewProxy.setEditable(false);
					oTemplateUtils.oServices.oViewDependencyHelper.setRootPageToDirty();
					oTemplateUtils.oServices.oViewDependencyHelper.unbindChildren(oController.getOwnerComponent());

					if (bCreateMode) {
						// in case of create mode navigate to new item
						if (oContext && oContext.getPath() !== "/undefined") {
							oTemplateUtils.oServices.oNavigationController.navigateToContext(oContext, undefined, true);
						} else {
							// fallback no context returned / correct path determined by transaction controller
							oTemplateUtils.oServices.oNavigationController.navigateBack();
						}
						MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_CREATED"), oTemplateUtils.oServices);
					} else {
						MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_SAVED"), oTemplateUtils.oServices);
						//for NON-Draft: navigate back after save if not root object
						if (!oTemplateUtils.oComponentUtils.isDraftEnabled() && !bIsObjectRoot) {
							oTemplateUtils.oServices.oNavigationController.navigateBack();
						}
					}
					if (oPendingChanges) {
						var oCurrentContext;
						var oPendingChangesPerContext;
						var aPendingChanges = [];
						var iMetaDataIndex;

						for (var property in oPendingChanges) {
							if (oPendingChanges.hasOwnProperty(property)) {
								oCurrentContext = oView.getModel().getContext("/" + property);
								oPendingChangesPerContext = oPendingChanges && oPendingChanges[oCurrentContext.getPath().replace("/", "")] || {};
								aPendingChanges = Object.keys(oPendingChangesPerContext) || [];

								/*	The OData model returns also a __metadata object with the canonical URL and further
								 information. As we don't want to check if sideEffects are annotated for this
								 property we remove it from the pending changes
								 */
								iMetaDataIndex = aPendingChanges.indexOf("__metadata");
								if (iMetaDataIndex > -1) {
									aPendingChanges.splice(iMetaDataIndex, 1);
								}
								oTemplateUtils.oServices.oApplicationController.executeSideEffects(oCurrentContext, aPendingChanges);
							}
						}
					}
				});
				var oEvent = {
					saveEntityPromise: oSaveEntityPromise
				};
				oTemplateUtils.oComponentUtils.fire(oController, "AfterSave", oEvent);
			}

			// The event is only called in a non-draft scenario. For draft see onActivate
			function onSave(){
				oBase.state.saveScenarioHandler.handleSaveScenario(3, onSaveImpl);
			}

			function fnAdaptBindingParamsForInlineCreate(oEvent) {
				if (fnIsSmartTableWithInlineCreate(oEvent.getSource())) {
					var oBindingParams = oEvent.getParameter("bindingParams");
					if (oBindingParams.filters && oBindingParams.filters.length) {
						/*
						 * Add a new filter condition to always show all items that are just created. In case we are in a draft,
						 * that just means to add "or HasActiveEntity = false". For active documents however, that condition
						 * would always be true. Thus, we have to add
						 * "or (HasActiveEntity = false and IsActiveEntity = false)".
						 * However, this condition is not evaluated correctly by gateway, so we have to transform it to
						 * (IsActvieEntity = true and x) or (Is ActvieEntity = false and (x or HasActvieEntity = false)),
						 * where x is the condition provided by the user
						 */
						var oUserFilter = new Filter(oBindingParams.filters);
						oBindingParams.filters = new Filter({
							filters: [
								new Filter({
									filters: [
										new Filter({
											path: "IsActiveEntity",
											operator: "EQ",
											value1: true
										}), oUserFilter
									],
									and: true
								}),
								new Filter({
									filters: [
										new Filter({
											path: "IsActiveEntity",
											operator: "EQ",
											value1: false
										}), new Filter({
											filters: [
												oUserFilter, new Filter({
													path: "HasActiveEntity",
													operator: "EQ",
													value1: false
												})
											],
											and: false
										})
									],
									and: true
								})
							],
							and: false
						});
					}
					var fnGroup = oBindingParams.sorter[0] && oBindingParams.sorter[0].getGroupFunction();
					var fnGroupExtended = fnGroup && function(oContext) {
						var oObject = oContext.getObject();
						if (oObject.IsActiveEntity || oObject.HasActiveEntity) {
							var oRet = jQuery.extend({}, fnGroup(oContext));
							oRet.key = oRet.key.charAt(0) === "§" ? "§" + oRet.key : oRet.key;
							return oRet;
						}
						return {
							key: "§",
							text: oTemplateUtils.oCommonUtils.getText("NEW_ENTRY_GROUP")
						};
					};
					//read the custom data of the smart table set by manifest flag "disableDefaultInlineCreateSort"
					if (oEvent.getSource().data("disableInlineCreateSort") === "false") {
						oBindingParams.sorter.unshift(new Sorter("HasActiveEntity", false, fnGroupExtended));
					}
				}
			}

			function getObjectHeader() {
				return oObjectPage.getHeaderTitle();
			}

			function onShareObjectPageActionButtonPress(oEvent) {
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var oFragmentController = {
					shareEmailPressed: function() {
						var sEmailSubject = oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectTitle");
						var sObjectSubtitle = oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectSubtitle");
						if (sObjectSubtitle) {
							sEmailSubject = sEmailSubject + " - " + sObjectSubtitle;
						}
						var emailBody = document.URL.replace(/\(/g, '%28').replace(/\)/g, '%29');//on 2nd Object Page the last closing Parenthesis was not being included in the link
						sap.m.URLHelper.triggerEmail(null, sEmailSubject, emailBody);
					},

					shareJamPressed: function() {
						ShareUtils.openJamShareDialog(oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectTitle") + " " + oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectSubtitle"));
					},

					getModelData: function() {
						return {
							title: oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectTitle"),
							subtitle: oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectSubtitle"),
							customUrl: ShareUtils.getCustomUrl()
						};
					}
				};

				ShareUtils.openSharePopup(oTemplateUtils.oCommonUtils, oEvent.getSource(), oFragmentController);
			}

			function getRelatedAppsSheet() {
				var oRelatedAppsSheet = oTemplateUtils.oCommonUtils.getDialogFragment(
					"sap.suite.ui.generic.template.ObjectPage.view.fragments.RelatedAppsSheet", {
						buttonPressed: function(oEvent) {
							var oButton = oEvent.getSource();
							var oButtonsContext = oButton.getBindingContext("buttons");
							var oLink = oButtonsContext.getProperty("link");
							var oParam = oButtonsContext.getProperty("param");
							var str = oLink.intent;
							var sSemanticObject = str.split("#")[1].split("-")[0];
							var sAction = str.split("-")[1].split("?")[0].split("~")[0];
							var oNavArguments = {
								target: {
									semanticObject: sSemanticObject,
									action: sAction
								},
								params: oParam
							};
							//Extension point to remove properties from link for external navigation will be NOT supported for related apps
							sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oNavArguments);
						}
					}, "buttons");
				return oRelatedAppsSheet;
			}

			var fnTableDeleteConfirmationOnDelete;

			function getObjectPageDeleteDialog() {
				fnTableDeleteConfirmationOnDelete = function(oEvent) {
					var oDialog = oEvent.getSource().getParent();
					var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
					if (oBusyHelper.isBusy()) {
						return;
					}
					var oComponent = oController.getOwnerComponent();
					var oTemplPrivGlobal = oComponent.getModel("_templPrivGlobal");
					var oObjPage = { objectPage: { currentEntitySet: oComponent.getProperty("entitySet") } };
					oTemplPrivGlobal.setProperty("/generic/multipleViews", oObjPage);
					var oDeleteEntityPromise = oTemplateUtils.oServices.oCRUDManager.deleteEntity();
					var sPath = oComponent.getBindingContext().getPath();
					var mObjectsToDelete = Object.create(null);
					mObjectsToDelete[sPath] = oDeleteEntityPromise;

					oTemplateUtils.oServices.oApplication.prepareDeletion(mObjectsToDelete);

					var oEvent = {
						deleteEntityPromise: oDeleteEntityPromise
					};
					oBusyHelper.setBusy(oDeleteEntityPromise);
					oTemplateUtils.oComponentUtils.fire(oController, "AfterDelete", oEvent);
					oDialog.close();
				};

				return oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.TableDeleteConfirmation", {
					onCancel: function(oEvent) {
						var oDialog = oEvent.getSource().getParent();
						oDialog.close();
					},
					// to be called within a function to asure that fnTableDeleteConfirmationOnDelete contains correct coding (see below function getTableDeleteDialog)
					onDelete: function(oEvent) {
						fnTableDeleteConfirmationOnDelete(oEvent);
					}
				}, "delete");
			}


			function onDeleteImpl() {
				var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
				if (oBusyHelper.isBusy()) {
					return;
				}
				var oUtils = oTemplateUtils.oCommonUtils;
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var sObjectTitle = (oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectTitle") || "").trim();
				var sObjectSubtitle = oTemplatePrivateModel.getProperty("/objectPage/headerInfo/objectSubtitle");
				var aParams;

				var oDialogParameter = {};
				oDialogParameter.title = oTemplateUtils.oCommonUtils.getText("ST_GENERIC_DELETE_TITLE");
				if (sObjectTitle) {
					if (sObjectSubtitle) {
						aParams = [" ", sObjectTitle, sObjectSubtitle];
						oDialogParameter.text = oUtils.getText("DELETE_WITH_OBJECTINFO", aParams);
					} else {
						aParams = [sObjectTitle];
						oDialogParameter.text = oUtils.getText("DELETE_WITH_OBJECTTITLE", aParams);
					}
				} else {
					oDialogParameter.text = oUtils.getText("ST_GENERIC_DELETE_SELECTED");
				}

				// ensure to have a Promise (even if extension returns sth. different)
				var oBeforeDeleteExtensionPromise = Promise.resolve(oController.beforeDeleteExtension());
				oBeforeDeleteExtensionPromise.then(function(oExtensionResult) {
					jQuery.extend(oDialogParameter, oExtensionResult);

					// get Delete Confirmation Popup fragment
					var oDialog = getObjectPageDeleteDialog();
					var oDeleteDialogModel = oDialog.getModel("delete");
					oDeleteDialogModel.setData(oDialogParameter);
					oDialog.open();
				},
				/*
				 * In case the Promise returned from extension is rejected, don't show a popup and don't execute
				 * deletion. If extension needs an asynchronous step (e.g. backend request) to determine special text
				 * that could fail, it should use securedExecution. Then error messages from backend are shown by
				 * busyHelper automatically.
				 */
				jQuery.noop);
			}

			// BEGIN - Functions related to the copy-paste from Excel

			function fnOnBeforeSmartTablePaste(oEvent) {
				var aColumnData = oEvent.getParameter("columnInfos");
				//Remove the ignored fields(not visible in the table and actions) from the column data
				var index = aColumnData && aColumnData.length - 1;

				while (index >= 0) {
					if (aColumnData[index].ignore) {
						aColumnData.splice(index, 1);
					}
					index -= 1;
				}
				//Using seperate loops to work on the array without ignored fields.
				var aUnsupportedColumns = aColumnData.reduce(function(aColumns, oColumn) {
					// Data formats for which paste is not yet supported.
					if (!oColumn.type && !oColumn.customParseFunction) {
						aColumns.push(oColumn);
					}
					return aColumns;
				}, []);

				if (aUnsupportedColumns.length > 0) {
					//Appropriate messages for columns with unsupported data formats.
					var sUnsupportedFormatError = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_UNSUPPORTED_FORMAT_MESSAGE");
					MessageBox.show(sUnsupportedFormatError, {
						icon: MessageBox.Icon.ERROR,
						title: oTemplateUtils.oCommonUtils.getText("ST_ERROR"),
						actions: [sap.m.MessageBox.Action.CLOSE]
					});
				}
			}

			function fnOnSmartTablePaste(oEvent) {
				var aParsedData;
				var oSmartTable = oEvent.getSource();
				var sSmartTableId = oSmartTable.getId();
				var sAddEntryId = sSmartTableId.split("::Table")[0] + "::addEntry";
				var oAddEntry = oController.byId(sAddEntryId); //Instance of the Create button
				if (!oAddEntry) {
					//Do not allow paste if the table doesn't allow new records to be added (non-draft apps)
					return;
				}
				var oResult = oEvent.getParameter("result");
				if (oResult) {
					if (oResult.errors) {
						var aErrorMessages = oResult.errors.map(function(oElement) {
							return oElement.message;
						});
						var sPasteError = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_MESSAGE", [aErrorMessages.length]);
						var sErrorCorrection = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_CORRECTION_MESSAGE");
						var sNote = oTemplateUtils.oCommonUtils.getText("DATA_PASTE_ERROR_CORRECTION_NOTE");
						//Push correction  message and note message to the aErrorMessages 
						aErrorMessages.unshift("");//To show space b/w the short text and detail text
						aErrorMessages.unshift(sNote);
						aErrorMessages.unshift(sErrorCorrection);
						MessageBox.show(sPasteError, {
							icon: MessageBox.Icon.ERROR,
							title: oTemplateUtils.oCommonUtils.getText("ST_ERROR"),
							actions: [sap.m.MessageBox.Action.CLOSE],
							details: aErrorMessages.join("<br />")
						});
					} else if (oResult.parsedData) {
						aParsedData = oResult.parsedData;
						if (aParsedData && aParsedData.length) {
							var iParsedDataLength = aParsedData.length;
							var bIgnoreTableRefresh;
							var oAddEntryPromise, aAddEntryPromises = [];
							var DraftSavedState = sap.m.DraftIndicatorState.Saved; //Indicator for the footer

							for (var i = 0; i < iParsedDataLength; i++) {
								bIgnoreTableRefresh = i < iParsedDataLength - 1; //Flag to overcome multiple table refreshs when records are pasted.
								oAddEntryPromise = oTemplateUtils.oCommonEventHandlers.addEntry(oAddEntry, true, undefined, aParsedData[i], bIgnoreTableRefresh);
								aAddEntryPromises.push(oAddEntryPromise);
							}

							Promise.all(aAddEntryPromises).then(function() {
								//After the records are added, show a draft saved indicator on the footer
								var oOwnerComponent = oController.getOwnerComponent();
								var oAppComponent = oOwnerComponent.getAppComponent();
								var oTemplatePrivateGlobal = oAppComponent.getModel("_templPrivGlobal");
								oTemplatePrivateGlobal.setProperty("/generic/draftIndicatorState", DraftSavedState);
							});
						}
					}
				}
			}

			/*
				Function to detach the paste handlers once the user is out of edit mode.
				We do not want to initialize the paste functionality when the object page is in display mode.
			*/
			function fnDetachPasteHandlers() {
				//To-DO: Evaluate if there's a better way of doing this. Refactor if required.
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var aPasteAttachedTables = oTemplatePrivateModel.getProperty("/objectPage/aPasteAttachedTables");
				var index = aPasteAttachedTables.length;
				var sFacet;
				var oControl;
				while (index >= 0) {
					sFacet = aPasteAttachedTables[index];
					oControl = oController.byId(sFacet + "::Table");
					if (oControl && oControl.isA("sap.ui.comp.smarttable.SmartTable") && oControl.hasListeners("paste")) {
						oControl.detachBeforePaste(fnOnBeforeSmartTablePaste);
						oControl.detachPaste(fnOnSmartTablePaste);
						aPasteAttachedTables.splice(index, 1);
					}
					index -= 1;
				}
			}

			// END - Functions related to the copy-paste from Excel

			function onDelete(oEvent) {
				oTemplateUtils.oServices.oApplication.performAfterSideEffectExecution(onDeleteImpl);
			}

			// This method is called when editing of an entity has started and the corresponding context is available
			// oResult is the target context for navigation in edit state.
			// bContinueEditing is to navigate to the context directly.
			//  - bContinueEditing faulty: User has pressed the 'Edit' button (draft and non-draft scenario)
			//  - bContinueEditing truthy: User has pressed the 'Continue Editing' button (only draft scenario)
			function fnStartEditing(oResult, bContinueEditing) {
				var oDraft, oContext;
				if (oResult) {
					oContext = oResult.context || oResult;
					if (oTemplateUtils.oServices.oDraftController.getDraftContext().hasDraft(oContext)) {
						oTemplateUtils.oServices.oViewDependencyHelper.setRootPageToDirty();
						oDraft = oContext.context || oContext;
					}
				}
				if (oDraft) {
					// navigate to draft
					// is a kind of cross navigation -> invalidate paginator info
					oTemplateUtils.oServices.oApplication.invalidatePaginatorInfo();
					oTemplateUtils.oServices.oApplication.switchToDraft(oDraft);
				} else {
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", 2);
				}
				//set Editable independent of the fact that the instance is a draft or not
				oViewProxy.setEditable(true);
			}

			var fnExpiredLockDialog;  // declare function already here, to avoid usage before declaration
			// This method is called when the user decides to edit an entity.
			// Parameter bUnconditional contains the information, whether the user has already confirmed to discard unsaved changes of another user(discard other user's draft), or whether this is still open
			function fnEditEntity(bUnconditional) {
				oTemplateUtils.oServices.oCRUDManager.editEntity(bUnconditional).then(function(oEditInfo) {
					if (oEditInfo.draftAdministrativeData) {
						fnExpiredLockDialog(oEditInfo.draftAdministrativeData.CreatedByUserDescription || oEditInfo.draftAdministrativeData.CreatedByUser);
					} else {
						fnStartEditing(oEditInfo.context, false);
					}
				});
			}

			// This method is called when the user wants to edit an entity, for which a non-locking draft of another user exists.
			// The method asks the user, whether he wants to continue editing anyway. If this is the case editing is triggered.
			// sCreatedByUser is the name of the user possessing the non-locking draft
			fnExpiredLockDialog = function(sCreatedByUser) {
				var oUnsavedChangesDialog = oTemplateUtils.oCommonUtils.getDialogFragment(
					"sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog", {
						onEdit: function() {
							oUnsavedChangesDialog.close();
							fnEditEntity(true);
						},
						onCancel: function() {
							oUnsavedChangesDialog.close();
						}
					}, "Dialog");
				var oDialogModel = oUnsavedChangesDialog.getModel("Dialog");
				var sDialogContentText = oTemplateUtils.oCommonUtils.getText("DRAFT_LOCK_EXPIRED", [sCreatedByUser]);
				oDialogModel.setProperty("/unsavedChangesQuestion", sDialogContentText);
				oUnsavedChangesDialog.open();
			};

			function getSelectionVariant() {
				// oTemplateUtils, oController
				// if there is no selection we pass an empty one with the important escaping of ", passing "" or
				// null...was not possible
				// "{\"SelectionVariantID\":\"\"}";
				var sResult = "{\"SelectionVariantID\":\"\"}";

				/*
				 * rules don't follow 1:1 association, only header entity type fields don't send fields with empty
				 * values also send not visible fields remove Ux fields (e.g. UxFcBankStatementDate) send all kinds of
				 * types String, Boolean, ... but stringify all types
				 */

				var oComponent = oController.getOwnerComponent();
				var sEntitySet = oComponent.getEntitySet();
				var model = oComponent.getModel();
				var oMetaModel = model.getMetaModel();
				var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
				var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
				var aAllFieldsMetaModel = oEntityType.property;

				//collect the names of attributes to be deleted
				//objects with existing sap:field-control -> mapped to com.sap.vocabularies.Common.v1.FieldControl attribute
				//e.g. ProductForEdit_fc field control fields shouldn't be transferred
				var aFieldsToBeIgnored = [];
				for (var x in aAllFieldsMetaModel) {
					var controlname = aAllFieldsMetaModel[x]["com.sap.vocabularies.Common.v1.FieldControl"] &&
						aAllFieldsMetaModel[x]["com.sap.vocabularies.Common.v1.FieldControl"].Path;
					if (controlname && aFieldsToBeIgnored.indexOf(controlname) < 0) {
						aFieldsToBeIgnored.push(controlname);
					}
				}

				var context = oController.getView().getBindingContext();
				var object = context.getObject();

				var oSelectionVariant = new SelectionVariant();
				for (var i in aAllFieldsMetaModel) {
					var type = aAllFieldsMetaModel[i].type;
					var name = aAllFieldsMetaModel[i].name;
					var value = object[aAllFieldsMetaModel[i].name];

					if (aFieldsToBeIgnored.indexOf(name) > -1) {
						continue;
					}

					if (name && (value || type === "Edm.Boolean")) { // also if boolean is false this must be sent
						if (type === "Edm.Time" && value.ms !== undefined) { // in case of Time an object is returned
							value = value.ms;
						}
						if (typeof value !== "string") {
							try {
								value = value.toString();
							} catch (e) {
								value = value + "";
							}
						}
						oSelectionVariant.addParameter(name, value);
					}
				}

				sResult = oSelectionVariant.toJSONString();
				return sResult;
			}

			function fnIsEntryDeletable(oContext, oSmartTable) {
				var bDeletable = true;
				var oModel = oSmartTable.getModel();
				//Since the introduction of the property "placeToolbarinTable", the hierarchy of toolbar is changed. To adjust this property the below condition is added
				oSmartTable = oSmartTable instanceof ResponsiveTable ? oSmartTable.getParent() : oSmartTable;
				var oDeleteRestrictions = oTemplateUtils.oCommonUtils.getDeleteRestrictions(oSmartTable);
				var sDeletablePath = oDeleteRestrictions && oDeleteRestrictions.Deletable && oDeleteRestrictions.Deletable.Path;
				if (sDeletablePath) {
					bDeletable = oModel.getProperty(sDeletablePath, oContext);
				}
				return bDeletable;
			}

			var oEventSource;
			var oSmartTable;

			/**
			 * Return an instance of the DeleteConfirmation fragment
			 *
			 * @param {sap.ui.base.Event} oCurrentEventSource Source event
			 * @param {sap.m.Table} oCurrentSmartTable Table
			 * @returns {sap.m.Dialog} The Delete Confirmation Dialog
			 * @private
			 */
			function getTableDeleteDialog(oCurrentEventSource, oCurrentSmartTable) {
				// make current parameters available in closure to avaid usage of old values in handlers of dialog
				oEventSource = oCurrentEventSource;
				oSmartTable = oCurrentSmartTable instanceof ResponsiveTable ? oCurrentSmartTable.getParent() : oCurrentSmartTable;
				var aPath = [];

				fnTableDeleteConfirmationOnDelete = function(oEvent) {
					var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
					var oDialog = oEvent.getSource().getParent();
					var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oSmartTable);
					aPath = [];
					var iSuccessfullyDeletedCount;
					var iFailedToDeleteCount;
					var oEntity = oController.getView().getModel().getObject(aContexts[0].getPath());
					for (var i = 0; i < aContexts.length; i++) {
						// check if item is deletable
						if (fnIsEntryDeletable(aContexts[i], oSmartTable)) {
							aPath.push(aContexts[i].getPath());
						}
					}
					var oDeletePromise = oTemplateUtils.oServices.oCRUDManager.deleteEntities(aPath);
					oBusyHelper.setBusy(oDeletePromise);
					oTemplateUtils.oServices.oApplicationController.executeSideEffects(oSmartTable.getBindingContext(), [], [oSmartTable.getTableBindingPath()]);
					var sUiElementId = oEventSource.getParent().getParent().getId();
					oDeletePromise.then(function(aFailedPath) {
						oTemplateUtils.oCommonUtils.refreshSmartTable(oSmartTable);
						if (oEntity.IsActiveEntity === false) {
							iFailedToDeleteCount = 0;
						} else {
							iFailedToDeleteCount = aFailedPath.length;
						}
						iSuccessfullyDeletedCount = aPath.length - iFailedToDeleteCount;
						var sMessage = "";
						if (iSuccessfullyDeletedCount > 0) {
							//CASE: Records have been deleted successfully
							if (iSuccessfullyDeletedCount > 1) {
								//CASE: Multiple records successfully deleted
								sMessage = oTemplateUtils.oCommonUtils.getContextText("DELETE_SUCCESS_PLURAL_WITH_COUNT", oSmartTable.getId(), null, [iSuccessfullyDeletedCount]);
							} else {
								if (iFailedToDeleteCount > 0) {
									//CASE: One record successfully deleted with some records failed to delete
									sMessage = oTemplateUtils.oCommonUtils.getContextText("DELETE_SUCCESS_WITH_COUNT", oSmartTable.getId(), null, [iSuccessfullyDeletedCount]);
								} else {
									//CASE: Only one record was selected for delete & operation completed successfully
									sMessage = oTemplateUtils.oCommonUtils.getContextText("ITEM_DELETED", oSmartTable.getId());
								}
							}
						}

						if (iFailedToDeleteCount > 0) {
							if (iFailedToDeleteCount > 1) {
								//CASE: Failed to delete multiple records
								sMessage += sMessage && sMessage + "\n";
								sMessage += oTemplateUtils.oCommonUtils.getContextText("DELETE_ERROR_PLURAL_WITH_COUNT", oSmartTable.getId(), null,  [iFailedToDeleteCount]);
							} else {
								if (iSuccessfullyDeletedCount > 0) {
									//CASE: There is record failed for delete but some records got deleted succefully
									sMessage += "\n";
									sMessage += oTemplateUtils.oCommonUtils.getContextText("DELETE_ERROR_WITH_COUNT", oSmartTable.getId(), null, [iFailedToDeleteCount]);
								} else {
									//CASE: Only one record was selected for delete & operation failed to execute
									sMessage += oTemplateUtils.oCommonUtils.getContextText("DELETE_ERROR", oSmartTable.getId());
								}
							}
						}

						if (sMessage) {
							if (iFailedToDeleteCount > 0) {
								//CASE: Error messages are show more prominent
								MessageBox.error(sMessage);
							} else {
								//CASE: Only success message and shown as a Message Toast
								MessageUtils.showSuccessMessageIfRequired(sMessage, oTemplateUtils.oServices);
							}
						}
					});

					// This object will be consumed by Application Developer via attachAfterLineItemDelete extension API
					var oAfterLineItemDeleteProperties = {
						deleteEntitiesPromise: oDeletePromise,
						sUiElementId: sUiElementId,
						aContexts: aContexts
					};
					oTemplateUtils.oComponentUtils.fire(oController, "AfterLineItemDelete", oAfterLineItemDeleteProperties);
					oDialog.close();
				};

				return oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.TableDeleteConfirmation", {
					onCancel: function(oEvent) {
						var oDialog = oEvent.getSource().getParent();
						oDialog.close();
					},
					// to be called within a function to asure that fnTableDeleteConfirmationOnDelete contains correct coding (see above function getObjectPageDeleteDialog)
					onDelete: function(oEvent) {
						fnTableDeleteConfirmationOnDelete(oEvent);
					}
				}, "delete");
			}

			function fnDeleteEntries(oEvent) {
				var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
				if (oBusyHelper.isBusy()) {
					return; // this is again tested by the CRUDManager. But in order to suppress the check for selected lines in the busy case we also need to check this here.
				}
				var oEventSource = oEvent.getSource();
				var oSmartTable = oTemplateUtils.oCommonUtils.getOwnerControl(oEventSource); //returns a sap.m.table
				if (!oTemplateUtils.oCommonUtils.isSmartTable(oSmartTable)) {
					oSmartTable = oSmartTable.getParent();
				}
				var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oSmartTable);
				if (aContexts.length === 0) {
					MessageBox.error(oTemplateUtils.oCommonUtils.getText("ST_GENERIC_NO_ITEM_SELECTED"), {
						styleClass: oTemplateUtils.oCommonUtils.getContentDensityClass()
					});
					return;
				}

				var aPath = [];
				var aNonDeletableContext = [];
				for (var i = 0; i < aContexts.length; i++) {
					// check if item is deletable
					if (fnIsEntryDeletable(aContexts[i], oSmartTable)) {
						aPath.push(aContexts[i].getPath());
					} else {
						aNonDeletableContext.push(aContexts[i]);
					}
				}

				var oDialogParameter = {};
				if (aContexts.length > 1) {
					oDialogParameter.title = oTemplateUtils.oCommonUtils.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT", [aContexts.length]);
					oDialogParameter.text = oTemplateUtils.oCommonUtils.getContextText("DELETE_SELECTED_ITEMS", oSmartTable.getId());

				} else {
					oDialogParameter.title = oTemplateUtils.oCommonUtils.getText("ST_GENERIC_DELETE_TITLE");
					oDialogParameter.text = oTemplateUtils.oCommonUtils.getContextText("DELETE_SELECTED_ITEM", oSmartTable.getId());
				}

				if (aNonDeletableContext.length > 0 ) {
					oDialogParameter.undeletableText = oTemplateUtils.oCommonUtils.getContextText("DELETE_UNDELETABLE_ITEMS", oSmartTable.getId(), null,
						[aNonDeletableContext.length, aContexts.length]);
				}

				var oBeforeLineItemDeleteProperties = {
						sUiElementId: oEventSource.getParent().getParent().getId(),
						aContexts: aContexts
				};
				// ensure to have a Promise (even if extension returns sth. different)
				var oBeforeLineItemDeleteExtensionPromise = Promise.resolve(oController.beforeLineItemDeleteExtension(oBeforeLineItemDeleteProperties));
				oBeforeLineItemDeleteExtensionPromise.then(function(oExtensionResult) {
					jQuery.extend(oDialogParameter, oExtensionResult);
					// get Delete Confirmation Popup fragment
					var oDialog = getTableDeleteDialog(oEventSource, oSmartTable);
					if (!aNonDeletableContext.length) {
						oDialogParameter.undeletableText = undefined;
					}
					var oDeleteDialogModel = oDialog.getModel("delete");
					oDeleteDialogModel.setData(oDialogParameter);
					oDialog.open();
				},
				/*
				 * In case the Promise returned from extension is rejected, don't show a popup and don't execute
				 * deletion. If extension needs an asynchronous step (e.g. backend request) to determine special text
				 * that could fail, it should use securedExecution. Then error messages from backend are shown by
				 * busyHelper automatically.
				 */
				jQuery.noop);
			}

			function getImageDialog() {
				var oImageDialog = oController.byId("imageDialog") || oTemplateUtils.oCommonUtils.getDialogFragment(
					"sap.suite.ui.generic.template.ObjectPage.view.fragments.ImageDialog", {
						onImageDialogClose: function() {
							oImageDialog.close();
						}
					}, "headerImage");

				return oImageDialog;
			}

			//handle the visibility of the Image in the Header Title
			function fnHandleVisibilityofImageInHeaderTitle() {
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				oTemplatePrivateModel.setProperty("/objectPage/isHeaderExpanded", true);
				var oTitleImage = oController.byId("template::ObjectPage::TitleImage");
				if (!oTitleImage) {
					return;
				}
				var oObjectPageDynamicHeaderTitle = oController.getView().byId("template::ObjectPage::ObjectPageHeader");
				oObjectPageDynamicHeaderTitle.attachStateChange(function(oEvent) {
					var bExpanded = oEvent.getParameter("isExpanded");
					oTemplatePrivateModel.setProperty("/objectPage/isHeaderExpanded", bExpanded);
				});
			}

			// This function will be called in onInit. It ensures that the /objectPage/headerInfo/ segment of the template private model will be updated.
			// Note that this segment was added in onInit defined in ComponentBase in sap.suite.ui.generic.template.detailTemplates.detailUtils.
			// according to the content of the corresponding customData.
			// Note that there is a special logic which ensures a fallback title which is derived from i18n-properties will	be used in createMode when no title can be derived from the OData model.
			// This fallback does not apply, when the title is a constant anyway.
			function fnEnsureTitleTransfer() {
				var sDefaultObjectTitleForCreated; // initialized on demand
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var fnCreateChangeHandlerForTitle = function(sKey) { // This function produces the change handler which will be added to the binding of the customData for key sKey.
					return function(oEvent) { // the change handler which will be applied to the property binding
						var oBinding = oEvent.getSource();
						var sValue = oBinding.getExternalValue();
						oTemplatePrivateModel.setProperty("/objectPage/headerInfo/" + sKey, sValue);
						if (sKey === "objectTitle"){
							oTemplateUtils.oComponentUtils.setText(sValue);
							if (!sValue){ // If no value for the title can be derived from the binding we have to check whether we are in create mode
								var oHeaderDataAvailablePromise = oTemplateUtils.oComponentUtils.getHeaderDataAvailablePromise();
								oHeaderDataAvailablePromise.then(function(oContext) { // evaluation must be postponed, until property createMode in the ui model has been set accordingly
									sValue = oBinding.getExternalValue();
									if (sValue) {
										return; // If meanwhile a value has been determined, ignore this asynchronous call
									}
									var oView = oController.getView();
									var oObject = oContext.getObject();
									var oUiModel = oView.getModel("ui");
									var bCreateMode = oUiModel.getProperty("/createMode");
									if (bCreateMode && oObject && (oObject.IsActiveEntity === undefined || oObject.IsActiveEntity === false || oObject.HasActiveEntity === false)) {
										sDefaultObjectTitleForCreated = sDefaultObjectTitleForCreated || oTemplateUtils.oCommonUtils.getText("NEW_OBJECT");
										oTemplatePrivateModel.setProperty("/objectPage/headerInfo/objectTitle", sDefaultObjectTitleForCreated);
										oTemplateUtils.oComponentUtils.setText(sDefaultObjectTitleForCreated);
									}
								});
							}
						}
					};
				};
				// Loop over customData and attach changeHandler (if necesary)
				oObjectPage.getCustomData().forEach(function(oCustomDataElement) {
					var sKey = oCustomDataElement.getKey();
					if (sKey === "objectTitle" || sKey === "objectSubtitle") { // check for the two properties handled in the headerInfo segment
						var oBinding = oCustomDataElement.getBinding("value");
						// UI5 does not gurantee the binding to be already available at this point in time.
						// If the binding is not available, we access the binding info as a fallback
						var oBindingInfo = !oBinding && oCustomDataElement.getBindingInfo("value");
						if (!oBinding && !oBindingInfo) { // constant -> No change handler needed, but the value must be transfered to the template private model once
							oTemplatePrivateModel.setProperty("/objectPage/headerInfo/" + sKey, oCustomDataElement.getValue());
							return; // done
						}
						var fnChangeHandler = fnCreateChangeHandlerForTitle(sKey); // Now we have the change handler
						// Moreover, the internal type of the binding must be changed from "any" (default for the value-property of the CustomData) to "string"
						if (oBinding) { // If the binding is already available we attach the change handler to the binding
							oBinding.attachChange(fnChangeHandler);
							fnSetPropertyBindingInternalType(oBinding, "string");
						} else { // otherwise the binding info will be enhanced accordingly -> binding will already be created with the corresponding change-handler
							oBindingInfo.events = {
								change: fnChangeHandler
							};
							for (var i = 0; i < oBindingInfo.parts.length; i++) {
								oBindingInfo.parts[i].targetType = "string";
							}
						}
					}
				});
			}

			function onBreadCrumbUrlPressed(oEvent) {
				oEvent.preventDefault();
				var oInfoObject = oTemplateUtils.oCommonUtils.getControlInformation(oEvent, null, true);
				if (oInfoObject){ // link not ready
					oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(oInfoObject.navigate, jQuery.noop, oBase.state);
				}
			}

			/* Begin of functions dealing with subsections (in particular lazy loading and refreshing of subsections) */

			function fnChangeBindingContext(vTarget, oSubSection){
				Log.info("Set binding context to " + vTarget, "Subsection: " + oSubSection.getId(), "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
				oSubSection.setBindingContext(vTarget);
			}

			// This method is the implementation of the standard strategy for lazy loading.
			// oSubSection is the sub section which is subject to lazy loading. oSubSectionInfoObject is the corresponding info object, which is supposed to
			// contain a mathod refresh(mRefreshInfos, bForceRefresh) with optional parameter mRefreshInfos.
			// bIsGettingVisible determines whether the data loading for the subsection should be activated or deactivated.
			// bMustWaitForHeader is only relevant when the data loading is activated.
			// If the parameter is true the data loading is postponed until the header data for the current page are available.
			// Otherwise the loading will be started directly. However, the loading will also be started asynchronously in this case. This ensures
			// that the data loading for the subsection will not be in the same batch call as the data loading for the header.
			function fnLazyLoad(bMustWaitForHeader, bIsGettingVisible, oSubSection, oSubSectionInfoObject){
				// Call of setBindingContext with value null sets the current binding to inactive.
				// Call of setBindingContext with value undefined sets the current binding to active
				if (bIsGettingVisible) {
					var oWaitForPromise = bMustWaitForHeader ? oTemplateUtils.oComponentUtils.getHeaderDataAvailablePromise() : Promise.resolve();
					oWaitForPromise.then(function(){
						fnChangeBindingContext(undefined, oSubSection);
						var sId = oSubSection.getId();
						Log.info("Start refreshing of Subsection: " + sId, "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
						oSubSectionInfoObject.refresh(null, true);
						Log.info("End refreshing of Subsection: " + sId, "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
					});
				} else {
					fnChangeBindingContext(null, oSubSection);
				}
			}

			var mStrategiesForVisibilityChangeOfSubsection = {
				lazyLoading: fnLazyLoad.bind(null, false),
				lazyLoadingAfterHeader: fnLazyLoad.bind(null, true),
				reuseComponent: function(bIsGettingVisible, oSubSection) {
					var oComponentContainer = oSubSection.getBlocks()[0];
					var oWaitForPromise = bIsGettingVisible ? oTemplateUtils.oComponentUtils.getHeaderDataAvailablePromise() : Promise.resolve();
					oWaitForPromise.then(oTemplateUtils.oComponentUtils.onVisibilityChangeOfReuseComponent.bind(null, bIsGettingVisible, oComponentContainer));
				}
			};

			// Refresh a given block. This only affects the smart tables in the block.
			// Two scenarios for this function distinguished by parameter bForceRefresh:
			// If the parameter is false the call is coming from the refreshBinding-method in the Component. In this scenario mRefreshInfos might be used to
			// reduce the set of SmartTables which need to be refreshed.
			// Moreover, in this scenario executing the side-effects will be included.
			// If the parameter is true the call is coming from activating the block due to lazy loading.
			// In this scenario mRefreshInfos is ignored and no side-effects will be executed.
			function fnRefreshBlock(mRefreshInfos, bForceRefresh, oBlock) {
				if (oBlock instanceof DynamicSideContent) {
					oBlock = oBlock.getMainContent()[0];
				} else if (!oBlock.getContent) { // dummy-blocks need not to be refreshed
					return;
				}
				oBlock.getContent().forEach(function(oContent) {
					if (oTemplateUtils.oCommonUtils.isSmartTable(oContent)) {
						if (bForceRefresh || mRefreshInfos[oContent.getEntitySet()]) {
							if (oContent.isInitialised()) {
								oTemplateUtils.oCommonUtils.refreshSmartTable(oContent);
							} else {
								oContent.attachInitialise(function() {
									oTemplateUtils.oCommonUtils.refreshSmartTable(oContent);
								});
							}

							if (!bForceRefresh) {
								oTemplateUtils.oServices.oApplicationController.executeSideEffects(oController.getOwnerComponent().getBindingContext(), [], [oContent.getTableBindingPath()]);
							}
						}
					}
				});
			}

			// Unified access to the info object for a subsection
			// The following two methods are contained in the info object:
			// - refresh(mRefreshInfos, bForceRefresh): A function that is used to refresh the subsection. For more detials see documentation of
			//   fnRefreshBlock which does the same for the blocks contained in the subsection
			// - strategyForVisibilityChange(bIsGettingVisible, oSubSection, oSubSectionInfoObject): Function that is used to deal with lazy loading.
			//   See description of function fnLazyLoad for more details.
			function getSubSectionInfoObject(oSubSection){
				return oTemplateUtils.oCommonUtils.getControlInformation(oSubSection);
			}

			function fnInitSubSectionInfoObject(oSubSection){
				oTemplateUtils.oCommonUtils.getControlInformation(oSubSection, function(oSubSectionInfoObject, aCategories){
					var aBlocks = oSubSection.getBlocks();
					// ensure that the corresponding InfoObject is initialized if the first block is a SideContent
					oSideContentHandler.initSideContentInfoObject(aBlocks[0]);
					// First construct the refresh function
					var aAllBlocks = aBlocks.concat(oSubSection.getMoreBlocks());
					oSubSectionInfoObject.refresh = function(mRefreshInfos, bForceRefresh){
						var fnMyRefreshBlock = fnRefreshBlock.bind(null, mRefreshInfos, bForceRefresh);
						aAllBlocks.forEach(fnMyRefreshBlock);
					};

					// Now determine property strategyForVisibilityChange of the info object
					var sStrategyForVisibilityChange = oTemplateUtils.oCommonUtils.getElementCustomData(oSubSection).strategyForVisibilityChange;
					var fnStrategyForVisibilityChange = mStrategiesForVisibilityChangeOfSubsection[sStrategyForVisibilityChange];
					oSubSectionInfoObject.strategyForVisibilityChange = fnStrategyForVisibilityChange || jQuery.noop;
					if (fnStrategyForVisibilityChange){
						aCategories.push("subSectionListeningToVisibilityChange");
					}
				});
			}

			function fnHandleVisibilityChangeOfSubsection(bIsGettingVisible, oSubSectionInfoObject, oSubSection) {
				oSubSectionInfoObject = oSubSectionInfoObject || getSubSectionInfoObject(oSubSection);
				if (oSubSectionInfoObject.isVisible === bIsGettingVisible){
					return;
				}
				oSubSectionInfoObject.isVisible = bIsGettingVisible;
				oSubSectionInfoObject.strategyForVisibilityChange(bIsGettingVisible, oSubSection, oSubSectionInfoObject);
			}

			function fnHandleVisibilityChangeForAllSubsections(bIsGettingVisible){
				oTemplateUtils.oCommonUtils.executeForAllInformationObjects("subSectionListeningToVisibilityChange", fnHandleVisibilityChangeOfSubsection.bind(null, bIsGettingVisible));
			}
			
            function fnGetVisibleControls(aControls){
				var aVisibleControls = [];
				for (var i = 0; i < aControls.length; i++) {
					if (aControls[i].getVisible()) {
						aVisibleControls.push(aControls[i]);
					}
				}
				return aVisibleControls;
			}
			
			//Returns true if there is only one section
			function fnHasSingleVisibleSection() {
				var aVisibleSections = [];
				var aSections = oObjectPage.getSections();
				aVisibleSections = fnGetVisibleControls(aSections);
				if (aVisibleSections.length === 1) {
					return fnHasSingleVisibleSubSection(aVisibleSections[0]);
				}
				return false;
			}

			//Returns true if there is only one sub section in the section
			function fnHasSingleVisibleSubSection(oSection) {
				if (oSection) {
					var aVisibleSubSections = [];
					var aSubSections = oSection.getSubSections();
					aVisibleSubSections = fnGetVisibleControls(aSubSections);
					return aVisibleSubSections.length === 1;
				}
			}

			function fnHandleUITableExpand(oSmartTable) {
				var oGridLayout = oSmartTable.getParent();
				var oOPSubSection = oGridLayout.getParent();
				if (oGridLayout && oGridLayout.isA("sap.ui.layout.Grid") && oOPSubSection && oOPSubSection.isA("sap.uxap.ObjectPageSubSection")) {
					oGridLayout.addStyleClass("sapSmartTemplatesObjectPageSubSectionGridExpand");
					oOPSubSection.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
					oSmartTable.setFitContainer(true);
				}
			}

			function fnSetSizeCondensedCssClass(bCondensedTableLayout, oTable) {
				var sCompactClass = "sapUiSizeCompact", sCondensedClass = "sapUiSizeCondensed", oBody;
				if (!bCondensedTableLayout) {
					return;
				}
				oBody = jQuery(document.body);
				if (oBody.hasClass(sCompactClass) ) {
					oTable.addStyleClass(sCondensedClass);
				}
			}

			function fnSetGrowingThresholdAndCondensedCssClass(oSmartTable, oTable, bCondensedTableLayout) {
				if (oTable.isA("sap.m.Table")) {
					oTable.setGrowingThreshold(DEFAULT_GROWING_THRESHOLD);
					oTable.setGrowingScrollToLoad(true);
				} else if (oTable.isA("sap.ui.table.Table")) {
					fnHandleUITableExpand(oSmartTable);
					fnSetSizeCondensedCssClass(bCondensedTableLayout, oTable);
				}
			}

			function fnApplyTableThresholdValueAndCssClass(oSmartTable, oTable, sCurrentFacet) {
				// Adding condensedClass as a styleClass to sap.ui.table
				var bCondensedTableLayout;
				var oObjectPageSettings = oController.getOwnerComponent().mProperties;
				if (oObjectPageSettings && oObjectPageSettings.sections) {
					var oSection = oObjectPageSettings.sections[sCurrentFacet];
					if (oSection && oSection.hasOwnProperty("condensedTableLayout")) {
						bCondensedTableLayout = oSection.condensedTableLayout;
					} else {
						bCondensedTableLayout = oObjectPageSettings.condensedTableLayout;
					}
				} else {
						bCondensedTableLayout = oObjectPageSettings.condensedTableLayout;
				}
				// Setting growing threshold to 25 in case of responsive table and 1 section
				if (oObjectPage.getUseIconTabBar()) {
					var oParent = oTable.getParent();
					while (oParent && oParent.sParentAggregationName !== "sections") {
						oParent = oParent.getParent();
					}
					if (fnHasSingleVisibleSubSection(oParent)) {
						fnSetGrowingThresholdAndCondensedCssClass(oSmartTable, oTable, bCondensedTableLayout);
					}
				} else if (fnHasSingleVisibleSection()) {
					fnSetGrowingThresholdAndCondensedCssClass(oSmartTable, oTable, bCondensedTableLayout);
				}
			}

			/* End of functions dealing with subsections (in particular lazy loading and refreshing of subsections) */

			function adjustSectionId(oEvent) {
				var oSection = oEvent && oEvent.getParameter("section");
				sSectionId = oSection ? oSection.getId() : oObjectPage.getSelectedSection();
			}

			function onSectionNavigate(oEvent) {
				adjustSectionId(oEvent);
				oBase.stateChanged();
			}

			// Add the information derived from the UI:Hidden annotation for one line item to either aStaticHiddenColumns or mColumnKeyToHiddenPath, or none.
			// It returns the information whether the line item is dynamically hidden.
			function fnAnalyzeColumnHideInfoForLineItem(aStaticHiddenColumns, mColumnKeyToHiddenPath, oMetaModel, oEntityType, oLineItem){
				var sColumnKey = AnnotationHelper.createP13NColumnKey(oLineItem);
				var vExpression = AnnotationHelper.getBindingForHiddenPath(oLineItem);
				if (vExpression === "{= !${} }") {
					aStaticHiddenColumns.push(sColumnKey);
					return false;
				}
				if (typeof (vExpression) === "string") {
					var sPath = vExpression.match(rPath) && vExpression.match(rPath)[0];
					if (sPath && sPath.indexOf("/") > 0 && oEntityType.navigationProperty) {
						var sParentEntitySet = oController.getOwnerComponent().getEntitySet();
						var sFirstNavigationProperty = sPath.split("/", 1)[0];
						if (oMetaModel.getODataAssociationSetEnd(oEntityType, sFirstNavigationProperty).entitySet === sParentEntitySet) {
							mColumnKeyToHiddenPath[sColumnKey] = sPath.split("/").slice(1).join("/");
							return true;
						}
					}
				} else if (!vExpression){
					aStaticHiddenColumns.push(sColumnKey);
				}
				return false;
			}

			// This method is called in the initialization phase of the specified SmartTable.
			// It handles everything which can be done regarding hiding columns at this point in time.
			// This is:
			// - Check for columns which are hidden statically or dynamically
			// - Immediately hide the columns which are statically hidden
			//    Note: This is actually a side effect of this function called implicitly via getSmartTableInfoObject.
			//          Therefore, it is essential that getSmartTableInfoObject is called during initialization
			// - If there are columns that are hidden dynamically add a dynamicHideInfos object to the specified info object. The dynamicHideInfos object
			//   contains information about the columns which are statically and which are dynamically hidden.
			//   In this case the category 'smartTableWithDynamicColumnHide' will be set for this info object. This will be used by
			//   oViewProxy.applyHeaderContextToSmartTablesDynamicColumnHide.
			//   Note: this is another side-effect of this function.
			function fnHandleSmartTableColumnHideAtInit(oSmartTable, oSmartTableInfoObject, aCategories, oMetaModel, oEntityType, aLineItems){
				var aStaticHiddenColumns = []; // list of keys of columns that are always hidden
				var mColumnKeyToHiddenPath = Object.create(null); // map of column keys to pathes that determine whether the column is shown
				var bHasDynamicHides = false;
				for (var i = 0; i < aLineItems.length; i++) {
					var oLineItem = aLineItems[i];
					bHasDynamicHides = fnAnalyzeColumnHideInfoForLineItem(aStaticHiddenColumns, mColumnKeyToHiddenPath, oMetaModel, oEntityType, oLineItem) || bHasDynamicHides;
				}
				if (bHasDynamicHides){ // if there is at least one dynmaic column hide we store this analysis in the info object
					oSmartTableInfoObject.dynamicHideInfos = {
						staticHiddenColumns: aStaticHiddenColumns,
						columnKeyToHiddenPath: mColumnKeyToHiddenPath
					};
					aCategories.push("smartTableWithDynamicColumnHide"); // Make sure that the smart table can be identified as one having dynamic hide
				}
				if (aStaticHiddenColumns.length){ // initially hide all columns which are statically hidden
					oSmartTable.deactivateColumns(aStaticHiddenColumns);
				}
			}

			// callback function that initializes the info object for a SmartTable
			function fnInitSmartTableInfoObject(oSmartTableInfoObject, aCategories, oSmartTable){
				aCategories.push("smartTable");
				// prepare some metadata
				//Since the introduction of the property "placeToolbarinTable", the hierarchy of toolbar is changed. To adjust this property the below condition is added
				oSmartTable = oTemplateUtils.oCommonUtils.isMTable(oSmartTable) ? oSmartTable.getParent() : oSmartTable;
				var oMetaModel = oSmartTable.getModel().getMetaModel();
				var oEntitySet = oMetaModel.getODataEntitySet(oSmartTable.getEntitySet());
				var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
				var aLineItems = oEntityType["com.sap.vocabularies.UI.v1.LineItem"];
				var aCustomData = oSmartTable.getCustomData();
				for (var i = 0; i < aCustomData.length; i++) {
					if (aCustomData[i].getKey() === "lineItemQualifier") {
						aLineItems = oEntityType["com.sap.vocabularies.UI.v1.LineItem#" + aCustomData[i].getValue()];
						break;
					}
				}
				// add information about hidden columns
				fnHandleSmartTableColumnHideAtInit(oSmartTable, oSmartTableInfoObject, aCategories, oMetaModel, oEntityType, aLineItems || []);
			}

			// Unified access to the info object for SmartTables. Note that the info object will be initialized in onTableInit (actually this has side-effects).
			// Currently the following optional attributes are stored in the info object:
			// - dynamicHideInfos: See fnHandleSmartTableColumnHideAtInit for more details
			// - searchField: Reference to the search field that belongs to this table. This attribute will be set, when the search field is first touched by the user
			//   (when the info object for the search field is initialized).
			function getSmartTableInfoObject(oSmartTable){
				return oTemplateUtils.oCommonUtils.getControlInformation(oSmartTable, fnInitSmartTableInfoObject);
			}

			//Get the current smart table's facet ID
			//oMultipleViewHandler contains an object for every table in the object page
			//sCurrentFacetId gives the table currently being worked upon
			function getCurrentSmartTableFacetId(sObjectPageStableId, sSmartTableStableId) {
				var sTemp, sCurrentFacetId;
				sTemp = sSmartTableStableId.split(sObjectPageStableId)[1];
				sCurrentFacetId = sTemp && sTemp.substring(0, sTemp.lastIndexOf("::Table"));
				return sCurrentFacetId;
			}

			/* Begin: Functions dealing with the search field on tables */

			// callback function that initializes the info object for a search field. Will be called when the search field is touched by the user for the first time.
			function fnInitSearchFieldInfoObject(oSearchFieldInfoObject, aCategories, oSearchField){
				aCategories.push("searchField");
				var oTable = oTemplateUtils.oCommonUtils.isMTable(oSearchField.getParent().getParent()) ? oSearchField.getParent().getParent().getParent() : oSearchField.getParent().getParent() ;
				oSearchFieldInfoObject.table = oTable;
				var oSmartTableInfoObject = getSmartTableInfoObject(oTable);
				oSmartTableInfoObject.searchField = oSearchField;
			}

			// Unified access to the info object for a search field.
			// This info object contains the following attributes:
			// - table: the SmartTable instance the search field belongs to
			// - searchString: The search string provided by this search field (Note that this might differ from the content of the field, since the user might change the
			//   content of the search field without triggering a search)
			function getSearchFieldInfoObjectForEvent(oEvent){
				return oTemplateUtils.oCommonUtils.getControlInformation(oEvent, fnInitSearchFieldInfoObject);
			}

			// Event handler for the live change of search fields
			// Its only task is to ensure that the info object for the search field is created as soon as the user enters the first character.
			// This is needed to ensure that fnClearSearchField (see below) also affects search fields that contain values without search having been triggered.
			function onSearchLiveChange(oEvent){
				getSearchFieldInfoObjectForEvent(oEvent);
			}

			// a search field in one of the tables is used to trigger a search.
			function onSearchObjectPage(oEvent) {
				var oSearchFieldInfoObject = getSearchFieldInfoObjectForEvent(oEvent);
				oSearchFieldInfoObject.searchString = oEvent.getSource().getValue();
				oSearchFieldInfoObject.table.rebindTable();
			}

			// Callback function used in the implementation of fnClearSearchField. This function clears one search field.
			function fnClearSearchField(oSearchFieldInfoObject, oSearchField){
				oSearchField.setValue("");
				if (oSearchFieldInfoObject.searchString){
					oSearchFieldInfoObject.searchString = "";
					oSearchFieldInfoObject.table.rebindTable();
				}
			}

			// set back the content of all search fields
			function fnClearSearchFields(){
				oTemplateUtils.oCommonUtils.executeForAllInformationObjects("searchField", fnClearSearchField);
			}


			/* End: Functions dealing with the search field on tables */

			// Begin: Filling the viewProxy with functions provided for the TemplateComponent to be called on the view

			oViewProxy.refreshFacets = function(mRefreshInfos) {
				var fnRefreshSubSection = function(oSubSection) {
					var oSubSectionInfoObject = getSubSectionInfoObject(oSubSection);
					oSubSectionInfoObject.refresh(mRefreshInfos, false);
				};
				oObjectPage.getSections().forEach(function(oSection) {
					oSection.getSubSections().forEach(fnRefreshSubSection);
				});
			};

			oViewProxy.onComponentActivate = oBase.onComponentActivate;

			oViewProxy.getCurrentState = function() {
				var oRet = Object.create(null);
				// Store information, which section is currently selected
				if (sSectionId) {
					oRet.section = {
						data: sSectionId,
						lifecycle: {
							permanent: true,
							pagination: true
						}
					};
				}
				oRet.sideContent = oSideContentHandler.getCurrentState(); // add information about side content
				// Now store state from application extensions
				var oCustomState = Object.create(null);
				oController.provideCustomStateExtension(oCustomState);
				for (var sCustomKey in oCustomState) {
					oRet["$custom$" + sCustomKey] = oCustomState[sCustomKey];
				}
				// Now store state from adaptation extensions
				var bIsAllowed = true; // check for synchronous calls
				var fnSetExtensionStateData = function (oControllerExtension, oExtensionState) {
					if (!(oControllerExtension instanceof ControllerExtension)){
						throw new Error("State must always be set with respect to a ControllerExtension");
					}
					if (!bIsAllowed){
						throw new Error("State must always be provided synchronously");
					}
					var sExtensionId = oControllerExtension.getMetadata().getNamespace(); // extension is identified by its namespace
					if (oExtensionState) {
						for (var sExtensionKey in oExtensionState) {
							oRet["$extension$" + sExtensionId + "$" + sExtensionKey] = oExtensionState[sExtensionKey];
						}
					}
				};
				oController.templateBaseExtension.provideExtensionStateData(fnSetExtensionStateData);
				bIsAllowed = false;

				return oRet;
			};

			oViewProxy.applyState = function(oState, bIsSameAsLast) {
				var oCustomState = Object.create(null);
				var mExtensionState = Object.create(null);
				for (var sKey in oState) {
					if (sKey.indexOf("$custom$") === 0) {
						oCustomState[sKey.substring(8)] = oState[sKey];
					} else if (sKey.indexOf("$extension$") === 0) {
						var sExtensionId = sKey.substring(11,sKey.indexOf("$", 11));//get the extensionID from sKey
						var oExtensionState = mExtensionState[sExtensionId];
						if (!oExtensionState) {
							oExtensionState = Object.create(null);
							mExtensionState[sExtensionId] = oExtensionState;
						}
						var sExtensionKey = sKey.substring(sKey.indexOf("$", 11) + 1, sKey.length);//get the extensionKey from sKey
						oExtensionState[sExtensionKey] = oState[sKey];
					}
				}
				oController.applyCustomStateExtension(oCustomState, bIsSameAsLast);
				var bIsAllowed = true;
				var fnGetExtensionStateData = function (oControllerExtension) {
					if (!(oControllerExtension instanceof ControllerExtension)){
						throw new Error("State must always be retrieved with respect to a ControllerExtension");
					}
					if (!bIsAllowed){
						throw new Error("State must always be restored synchronously");
					}
					var sExtensionId = oControllerExtension.getMetadata().getNamespace(); // extension is identified by its namespace

					return mExtensionState[sExtensionId];
				};
				oController.templateBaseExtension.restoreExtensionStateData(fnGetExtensionStateData, bIsSameAsLast);
				bIsAllowed = false;
				oSideContentHandler.applyState(oState.sideContent, bIsSameAsLast);
				if (bIsSameAsLast) {
					if (sSectionId !== (oState.section || "")) {
						oBase.stateChanged();
					}
					return;  // rely on the fact that the state needs not to be adapted, since view is like we left it
				}
				fnClearSearchFields(); // On object change all search fields should be cleared

				// scroll to the specified section or to top is no section is specified
				if (oState.section) {
					oObjectPage.setSelectedSection(oState.section);
					adjustSectionId();
				} else {
					Promise.all([
						oTemplateUtils.oComponentUtils.getHeaderDataAvailablePromise(),
						oTemplateUtils.oComponentUtils.getNavigationFinishedPromise()
					]).then(fnScrollObjectPageToTop.bind(null, oObjectPage));
					sSectionId = "";
				}
			};

			oViewProxy.beforeRebind = function() {
				fnHandleVisibilityChangeForAllSubsections(false);
			};

			oViewProxy.afterRebind = function() {
				Log.info("Call of _triggerVisibleSubSectionsEvents", "", "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
				oObjectPage._triggerVisibleSubSectionsEvents();
			};

			// Loops over all SmartTables with dynamically hidden columns and adapts hiding the columns on the specified context
			oViewProxy.applyHeaderContextToSmartTablesDynamicColumnHide = function(oContext){
				var fnExecuteDynamicColumnHide = function(oSmartTableInfoObject, oSmartTable){
					var aHiddenColumns = oSmartTableInfoObject.dynamicHideInfos.staticHiddenColumns.slice(); // start with a copy of the list of statically hidden columns
					// Now add the dynamiccaly hidden columns if applicable
					for (var sColumnKey in oSmartTableInfoObject.dynamicHideInfos.columnKeyToHiddenPath){
						var sPath = oSmartTableInfoObject.dynamicHideInfos.columnKeyToHiddenPath[sColumnKey];
						if (oContext.getProperty(sPath)){
							aHiddenColumns.push(sColumnKey);
						}
					}
					oSmartTable.deactivateColumns(aHiddenColumns); // Note: This will replace the set of hidden columns defined last time
				};
				oTemplateUtils.oCommonUtils.executeForAllInformationObjects("smartTableWithDynamicColumnHide", fnExecuteDynamicColumnHide);
			};

			// End: Filling the viewProxy with functions provided for the TemplateComponent to be called on the view.
			// Note that one last member is added to the viewProxy in onInit, since it is only available at this point in time.

			// Expose selected private functions to unit tests
			/* eslint-disable */
			var fnEditEntity = testableHelper.testable(fnEditEntity, "editEntity");
			var fnIsEntryDeletable = testableHelper.testable(fnIsEntryDeletable, "isEntryDeletable");
			var onActivateImpl = testableHelper.testable(onActivateImpl, "onActivateImpl");
			var onSaveImpl = testableHelper.testable(onSaveImpl, "onSaveImpl");
			/* eslint-enable */

			// Generation of Event Handlers
			var oControllerImplementation = {
				onInit: function() {
					oObjectPage = oController.byId("objectPage");
					var oComponent = oController.getOwnerComponent();
					// Initialize info objects for the sub sections. This allows to iterate over them via oTemplateUtils.oCommonUtils.executeForAllInformationObjects.
					var aSections = oObjectPage.getSections();
					for (var k = 0; k < aSections.length; k++) {
						var oSection = aSections[k];
						var aSubSections = oSection.getSubSections();
						aSubSections.forEach(fnInitSubSectionInfoObject);
					}
					// Create and bind breadcrumbs
					var oTitle = getObjectHeader();
					var oConfig = oComponent.getAppComponent().getConfig();
					var bIsObjectPageDynamicHeaderTitleUsed = !!(oConfig.settings && (oConfig.settings.objectPageDynamicHeaderTitleWithVM || oConfig.settings.objectPageHeaderType === 'Dynamic'));
					oViewProxy.aBreadCrumbs = oTitle && (bIsObjectPageDynamicHeaderTitleUsed ? oTitle.getBreadcrumbs().getLinks() : oTitle.getBreadCrumbsLinks()); // If ObjectPageDynamicHeaderTitle is used then oTitle.getBreadcrumbs().getLinks() is used
					if (bIsObjectPageDynamicHeaderTitleUsed) {
						fnHandleVisibilityofImageInHeaderTitle();
					}
					oBase.onInit(null, fnHandleVisibilityChangeForAllSubsections.bind(null, true));
					fnEnsureTitleTransfer();
					oTemplateUtils.oCommonUtils.executeGlobalSideEffect();
					oObjectPage.attachEvent("subSectionEnteredViewPort", function(oEvent) {
						var oSubSection = oEvent.getParameter("subSection");
						Log.info("Viewport entered ", "Subsection: " + oSubSection.getId(), "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
						fnHandleVisibilityChangeOfSubsection(true, null, oSubSection);
					});

					//An object page could have multiple sections with tables, create an instance in oState.oMultipleViewsHandler for every table.
					//var oManifestSections = oConfig && oConfig.pages && oConfig.pages[0] && oConfig.pages[0].pages[0] && oConfig.pages[0].pages[0].component && oConfig.pages[0].pages[0].component.settings && oConfig.pages[0].pages[0].component.settings.sections;
					var oManifestSections = oController.getOwnerComponent() && oController.getOwnerComponent().getSections();
					for (var key in oManifestSections) {
						if (oManifestSections.hasOwnProperty(key)) {
							oManifestSections[key]["key"] = key;
							oState.oMultipleViewsHandler[key] = new MultipleViewsHandler(oState, oController, oTemplateUtils, oManifestSections[key]);
							oState.oMultipleViewsHandler[key]["oSmartTable"] = oController.byId(key + "::Table");
						}
					}
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					oTemplatePrivateModel.setProperty("/objectPage/aPasteAttachedTables", []);
				},

				handlers: {

					/*
					 * Called to toggle between Display Active Version and Continue Editing buttons in the Draft Root.
					 *
					 * @param  {oSource, bHasDraftEntity}
					 * oSource : {sap.uxap.ObjectPageHeaderActionButton} : The Event source. The Button That triggers the request to navigate to active or draft version.
					 * bHasDraftEntity : {boolean} : To specify if the current context has draft.
					 *
					 */
					onEditAndActiveToggle: function(oSource, bHasDraftEntity) {
						oTemplateUtils.oServices.oApplication.performAfterSideEffectExecution(function() {
							var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
							if (oBusyHelper.isBusy()) {
								return; // Ignore user interaction while the app is busy.
							}
							// Getting the sibling context to navigate.
							var oContext = oSource.getBindingContext();
							var oSiblingContextPromise = oTemplateUtils.oServices.oApplication.getDraftSiblingPromise(oContext);
							oBusyHelper.setBusy(oSiblingContextPromise.then(function(oSiblingContext) {
								if (bHasDraftEntity) {
									Log.info("Navigating to draft entity");
									fnStartEditing(oSiblingContext, true);
								} else {
									Log.info("Navigating to active entity");
									oTemplateUtils.oServices.oNavigationController.navigateToContext(oSiblingContext, null, true, 1, true);
								}
								// After the navigation, the soruce button becomes invisible.
								// As a result, the foucs moves to the next button(if this next button is visible) in the toolbar.
								// If the this next button is not visible, then focus shifts to body.
								// To maintain consistency, we move the focus to the dom-body.
								Selectors(':focus').blur();
							}));
						});
					},

					addEntry: function(oEvent) {
						var oEventSource = oEvent.getSource();
						var oSmartTable = oTemplateUtils.oCommonUtils.getOwnerControl(oEventSource);
						// After adding the "placeToolbarinTable", the hierarchy of toolbar is changed. To adjust this property, below condition is added
						oSmartTable = oTemplateUtils.oCommonUtils.isMTable(oSmartTable) ? oSmartTable.getParent() : oSmartTable;
						var bSuppressNavigation = fnIsSmartTableWithInlineCreate(oSmartTable);

						if (!oEventSource.data("CrossNavigation") && bSuppressNavigation) {
							oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, true);
							return;
						}
						oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function() {
							oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false);
						}, jQuery.noop, oBase.state);
					},

					submitChangesForSmartMultiInput: function() {
						if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
							oTemplateUtils.oCommonEventHandlers.submitChangesForSmartMultiInput();
						}
					},

					deleteEntries: fnDeleteEntries,

					onSelectionChange: function(oEvent) {
						oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oEvent.getSource());
					},

					//Cancel event for draft and non draft case
					onCancel: function(oEvent) {
						var oCancelButton = oEvent.getSource();
						var oCancelPromise = oBase.state.onCancel(oCancelButton);
						oCancelPromise.then(function(){
							fnDetachPasteHandlers();
						});
					},

					onContactDetails: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onContactDetails(oEvent);
					},
					onPressDraftInfo: function(oEvent) {
						var oBindingContext = oController.getView().getBindingContext();
						var oLockButton = sap.ui.getCore().byId(
							oEvent.getSource().getId() + (oEvent.getId() === "markChangesPress" ? "-changes" : "-lock"));

						oTemplateUtils.oCommonUtils.showDraftPopover(oBindingContext, oLockButton);
					},
					onPressDraftInfoObjectPageDynamicHeaderTitle: function(oEvent) {
						var oBindingContext = oController.getView().getBindingContext();
						var oLockButton = oController.byId("template::ObjectPage::ObjectMarkerObjectPageDynamicHeaderTitle");
						oTemplateUtils.oCommonUtils.showDraftPopover(oBindingContext, oLockButton);
					},

					onShareObjectPageActionButtonPress: onShareObjectPageActionButtonPress,
					onRelatedApps: function(oEvent) {
						var oButton, oURLParsing, oParsedUrl, oViewBindingContext, oAppComponent, oXApplNavigation, oLinksDeferred;
						var oActionSheet, oButtonsModel, oUshellContainer, sCurrentSemObj, sCurrentAction;
						oButton = oEvent.getSource();
						oUshellContainer = sap.ushell && sap.ushell.Container;
						oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
						oParsedUrl = oURLParsing.parseShellHash(
							document.location.hash);
						sCurrentSemObj = oParsedUrl.semanticObject;
						sCurrentAction = oParsedUrl.action;
						oViewBindingContext = oController.getView && oController.getView().getBindingContext();

						var oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();

						var oEntity = oViewBindingContext.getObject();
						var sEntityType = oEntity.__metadata.type;
						var oDataEntityType = oMetaModel.getODataEntityType(sEntityType);
						var aSemKey = oDataEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
						var oParam = {};
						// var oSemKeyParam = {};
						if (aSemKey && aSemKey.length > 0) {
							for (var j = 0; j < aSemKey.length; j++) {
								var sSemKey = aSemKey[j].PropertyPath;
								if (!oParam[sSemKey]) {
									oParam[sSemKey] = [];
									oParam[sSemKey].push(oEntity[sSemKey]);
								}
							}
						} else {
							// Fallback if no SemanticKey
							for (var k in oDataEntityType.key.propertyRef) {
								var sObjKey = oDataEntityType.key.propertyRef[k].name;
								if (!oParam[sObjKey]) {
									oParam[sObjKey] = [];
									oParam[sObjKey].push(oEntity[sObjKey]);
								}
							}
						}

						oAppComponent = oController.getOwnerComponent().getAppComponent();
						oXApplNavigation = oUshellContainer && oUshellContainer.getService("CrossApplicationNavigation");

						oLinksDeferred = oXApplNavigation.getLinks({
							semanticObject: sCurrentSemObj,
							params: oParam,
							ui5Component: oAppComponent
						});

						oActionSheet = getRelatedAppsSheet();
						oButtonsModel = oActionSheet.getModel("buttons");
						oButtonsModel.setProperty("/buttons", []);
						oActionSheet.openBy(oButton);
						oLinksDeferred.done(function(aLinks) {
							var aButtons = [];
							// Sorting the related app links alphabetically to align with Navigation Popover in List Report - BCP(1770251716)
							aLinks.sort(function(oLink1, oLink2) {
								if (oLink1.text < oLink2.text) {
									return -1;
								}
								if (oLink1.text > oLink2.text) {
									return 1;
								}
								return 0;
							});
							// filter current semanticObject-action
							for (var i = 0; i < aLinks.length; i++) {
								var oLink = aLinks[i];
								var sIntent = oLink.intent;
								var sAction = sIntent.split("-")[1].split("?")[0];
								if (sAction !== sCurrentAction) {
									aButtons.push({
										enabled: true, // used in declarative binding
										text: oLink.text, // used in declarative binding
										link: oLink, // used by the event handler
										param: oParam
										// used by the event handler
									});
								}
							}
							if (aButtons.length === 0) {
								aButtons.push({
									enabled: false, // used in declarative binding
									text: oTemplateUtils.oCommonUtils.getText("NO_RELATED_APPS")
									// used in declarative binding
								});
							}
							oButtonsModel.setProperty("/buttons", aButtons);
						});
					},
					onSemanticObjectLinkPopoverLinkPressed: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(oEvent, oBase.state);
					},

					onEdit: function(oEvent) {
						var oEventSource = oEvent.getSource();
						if (oEventSource.data("CrossNavigation")) {
							// intent based navigation
							oTemplateUtils.oCommonEventHandlers.onEditNavigateIntent(oEventSource);
							return;
						}
						bIsObjectRoot = true; // temporarily logic until we know how to decide this in onInit
						fnEditEntity();
					},
					onSave: onSave,
					onActivate: onActivate,
					onSmartFieldUrlPressed: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onSmartFieldUrlPressed(oEvent, oBase.state);
					},
					onBreadCrumbUrlPressed: onBreadCrumbUrlPressed,
					onDelete: onDelete,
					onCallActionFromToolBar: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBar(oEvent, oBase.state);
					},
					onCallAction: function(sAction, sLabel, sInvocationGrouping) {
						oTemplateUtils.oServices.oApplication.performAfterSideEffectExecution(function(){
							var oBindingContext = oController.getView().getBindingContext();
							if (oBindingContext) {
								//var oEventSource = oEvent.getSource();
								oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function() {
									var oComponent = oController.getOwnerComponent();
									var sEntitySet = oComponent.getEntitySet();
									var mParameters = {
										functionImportPath: sAction,
										contexts: [oBindingContext],
										sourceControl: "",
										label: sLabel,
										operationGrouping: sInvocationGrouping,
										navigationProperty: oComponent.getNavigationProperty()
									};
									oTemplateUtils.oServices.oCRUDManager.callAction(mParameters).then(function(aResponses) {
										var oResponse = aResponses && aResponses[0];
										if (oResponse && oResponse.response && oResponse.response.context && (!oResponse.actionContext || oResponse.actionContext && oResponse.response.context.getPath() !== oResponse.actionContext.getPath())) {
											// set my parent page to dirty
											oTemplateUtils.oServices.oViewDependencyHelper.setParentToDirty(oComponent, sEntitySet, 1);
										}
									});
								}, jQuery.noop, oBase.state, "Proceed");
							}
						}, true);
					},
					onDataFieldForIntentBasedNavigation: function(oEvent) {
						oEvent = jQuery.extend({}, oEvent);
						oTemplateUtils.oServices.oApplication.performAfterSideEffectExecution(function(){
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oBase.state);
							});
						}, true);
					},
					onDataFieldWithIntentBasedNavigation: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(oEvent, oBase.state);
					},
					onDataFieldWithNavigationPath: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onDataFieldWithNavigationPath(oEvent);
					},
					onChartInit: function(oEvent) {
						oEvent.getSource().getChartAsync().then(function(oChart){
							var fnOnSelectionChange = oController._templateEventHandlers.onSelectionChange;
							oChart.attachSelectData(fnOnSelectionChange).attachDeselectData(fnOnSelectionChange);
							var oSmartChart = oChart.getParent();
							oTemplateUtils.oCommonUtils.checkToolbarIntentsSupported(oSmartChart);
						});
					},
					onDataRequested: function(sId){
						Log.info("Data requested", "SmartTable: " + sId, "Class sap.suite.ui.generic.template.ObjectPage.controller.ControllerImplementation");
						var sObjectPageStableId = (oController && oController.getView() && oController.getView().getId()) + "--";
						var sCurrentFacet = getCurrentSmartTableFacetId(sObjectPageStableId, sId);
						oState.oMultipleViewsHandler[sCurrentFacet] && oState.oMultipleViewsHandler[sCurrentFacet].onDataRequested();
					},
					onDataReceived: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onDataReceived(oEvent);
					},
					onBeforeRebindDetailTable: function(oEvent) {
						var sCurrentFacet, sSmartTableStableId, sObjectPageStableId;
						var oSmartTable = oEvent.getSource();
						var oBindingParams = adjustAndProvideBindingParamsForSmartTableOrChart(oEvent);
						// add the content of the search field to the search if necessary
						var oSmartTableInfoObject = getSmartTableInfoObject(oSmartTable);
						var oSearchField = oSmartTableInfoObject.searchField;
						if (oSearchField){ // note that in this case the info object for the search field surely exists
							var oSearchFieldInfoObject = oTemplateUtils.oCommonUtils.getControlInformation(oSearchField);
							if (oSearchFieldInfoObject.searchString){
								oBindingParams.parameters.custom = {
									search: oSearchFieldInfoObject.searchString
								};
							}
						}

						oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(oEvent, {
							ensureExtensionFields: oController.templateBaseExtension.ensureFieldsForSelect,
							addExtensionFilters: oController.templateBaseExtension.addFilters
						});
						oController.onBeforeRebindTableExtension(oEvent);
						sObjectPageStableId = oController && typeof oController.getView === "function" && oController.getView() && typeof oController.getView().getId === "function" && oController.getView().getId();
						if (sObjectPageStableId) {
							sObjectPageStableId = sObjectPageStableId + "--";
							sSmartTableStableId = oSmartTable && oSmartTable.getId();
							sCurrentFacet = getCurrentSmartTableFacetId(sObjectPageStableId, sSmartTableStableId);
							oState.oMultipleViewsHandler[sCurrentFacet] && oState.oMultipleViewsHandler[sCurrentFacet].onRebindContentControl(oEvent);
						}
						fnAdaptBindingParamsForInlineCreate(oEvent);
						if (oTemplateUtils.oCommonUtils.isAnalyticalTable(oSmartTable.getTable())) {
							oBindingParams.parameters.entitySet = oSmartTable.getEntitySet();
						}
					},
					onListNavigate: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onListNavigate(oEvent, oBase.state, oController.onListNavigationExtension.bind(oController));
					},
					onBeforeSemanticObjectLinkPopoverOpens: function(oEvent) {
						var oEventParameters = oEvent.getParameters();
						oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function() {
							//Success function
							var sSelectionVariant = getSelectionVariant();
							oTemplateUtils.oCommonUtils.semanticObjectLinkNavigation(oEventParameters, sSelectionVariant, oController);
						}, jQuery.noop, oBase.state, jQuery.noop);
					},

					onSemanticObjectLinkNavigationPressed: function(oEvent) {
						var oEventParameters = oEvent.getParameters();
						var oEventSource = oEvent.getSource();
						oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(oEventSource, oEventParameters);
					},

					onSemanticObjectLinkNavigationTargetObtained: function(oEvent) {
						var oEventParameters = oEvent.getParameters();
						var oEventSource = oEvent.getSource(); //set on semanticObjectController
						oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(oEventSource, oEventParameters, oBase.state);
						//fnOnSemanticObjectLinkNavigationTargetObtained(oEvent);
					},
					onSemanticObjectLinkNavigationTargetObtainedSmartLink: function(oEvent) {
						var oEventParameters, oEventSource;
						oEventParameters = oEvent.getParameters();
						oEventSource = oEvent.getSource(); //set on smart link
						oEventSource = oEventSource.getParent().getParent().getParent().getParent(); //set on smart table
						oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(oEventSource, oEventParameters, oBase.state);
					},
					onHeaderImagePress: function(oEvent) {
						if (oEvent.getSource().getSrc() === "") {
							return;
						}
						var oImageDialog = getImageDialog();
						var sId = oEvent.getSource().getId();
						oImageDialog.addAriaLabelledBy(sId);
						var oImageDialogModel = oImageDialog.getModel("headerImage");
						oImageDialogModel.setProperty("/src", oEvent.getSource().getSrc());
						if (sap.ui.Device.system.phone) {
							oImageDialog.setProperty("stretch", true);
						}
						oImageDialog.open();
					},
					sectionNavigate: onSectionNavigate,
					onInlineDataFieldForAction: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForAction(oEvent, oBase.state);
					},
					onInlineDataFieldForIntentBasedNavigation: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(oEvent.getSource(), oBase.state);
					},
					onDeterminingDataFieldForAction: function(oEvent) {
						oTemplateUtils.oCommonEventHandlers.onDeterminingDataFieldForAction(oEvent);
					},
					onBeforeRebindChart: function(oEvent) {
						adjustAndProvideBindingParamsForSmartTableOrChart(oEvent);
						var oSmartChart = oEvent.getSource();
						oSmartChart.getChartAsync().then(function(oChart){
							oSmartChart.oModels = oChart.oPropagatedProperties.oModels;
						});
						var oCallbacks = {
								ensureExtensionFields: jQuery.noop, // needs further clarification
								addExtensionFilters: oController.templateBaseExtension.addFilters
						};
						oTemplateUtils.oCommonUtils.onBeforeRebindTableOrChart(oEvent, oCallbacks);
					},
					// forward handlers for side content related events to SideContentHandler
					onToggleDynamicSideContent: oSideContentHandler.onToggleDynamicSideContent,
					sideContentBreakpointChanged: oSideContentHandler.sideContentBreakpointChanged,

					onTableInit: function(oEvent) {
						var sCurrentFacet; //Holds the FacetId of the table being worked upon.
						var oSmartTable = oEvent.getSource();
						var oTable = oSmartTable.getTable();
						getSmartTableInfoObject(oSmartTable); // ensure that the info object for the SmartTable is initialized
						oTemplateUtils.oCommonUtils.checkToolbarIntentsSupported(oSmartTable);
						//Initialize MultipleViewsHandler for the table.
						var sObjectPageStableId = (oController && typeof oController.getView === "function" && oController.getView() && oController.getView().getId()) + "--";
						var sSmartTableStableId = oSmartTable && oSmartTable.getId();
						sCurrentFacet = getCurrentSmartTableFacetId(sObjectPageStableId, sSmartTableStableId);
						oState.oMultipleViewsHandler[sCurrentFacet] && oState.oMultipleViewsHandler[sCurrentFacet].init(oEvent);
						fnApplyTableThresholdValueAndCssClass(oSmartTable, oTable, sCurrentFacet);
						if (fnIsSmartTableWithInlineCreate(oSmartTable) && !oSmartTable.data("CrossNavigation")) {
							oTable.addEventDelegate({
								// CTRL + ENTER Shortcut to add an entry for tables with inline support.
								onkeyup: function(oEvent) {
									if (oEvent.ctrlKey && oEvent.keyCode === KeyCodes.ENTER && oSmartTable.getEditable()) {
										oTemplateUtils.oCommonEventHandlers.addEntry(oSmartTable, true);
										oEvent.preventDefault();
										oEvent.setMarked();
									}
								}
							});
						}
						//Get the instance of 'Create' button. If Create is present, attach paste events to the table.
						var sAddEntryId = sSmartTableStableId.split("::Table")[0] + "::addEntry";
						var oAddEntry = oController.byId(sAddEntryId);
						var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
						if (oAddEntry && oAddEntry.isA("sap.m.Button")){
							oTable.addEventDelegate({
								//Attach paste handlers for tables in edit mode
								//Copy Paste Functionality will be available for draft enable applications only
								onAfterRendering: function(oEvent) {
									var aPasteAttachedTables;
									if (oSmartTable.getEditable() && !oSmartTable.hasListeners("paste")) {
										oSmartTable.attachBeforePaste(fnOnBeforeSmartTablePaste);
										oSmartTable.attachPaste(fnOnSmartTablePaste);
										aPasteAttachedTables = oTemplatePrivateModel.getProperty("/objectPage/aPasteAttachedTables");
										if (aPasteAttachedTables) {
											aPasteAttachedTables.push(sCurrentFacet);
										}
									}
								}
							});
						}
					},
					onSearchObjectPage: onSearchObjectPage,
					onSearchLiveChange: onSearchLiveChange,
					onSmartTablePaste: fnOnSmartTablePaste,
					onUITableExpand: fnHandleUITableExpand,
					onSingleVisibleSection: fnHasSingleVisibleSection,
					onSingleVisibleSubSection: fnHasSingleVisibleSubSection

				},
				formatters: {
					sideContentActionButtonText: oSideContentHandler.formatSideContentActionButtonText,

					setNoDataTextForSmartTable: function(sSmartTableId) {
						if (oTemplateUtils.oCommonUtils && sSmartTableId) {
							var sNoDataText = oTemplateUtils.oCommonUtils.getContextText("NOITEMS_SMARTTABLE", sSmartTableId);
							if (sNoDataText !== "NOITEMS_SMARTTABLE") {
								return sNoDataText;
							}
							return "";
						}
					},

					setVMVisibilityForVendor: function() {
						var oUriParameters = jQuery.sap.getUriParameters();
						if (oUriParameters.mParams["sap-ui-layer"]) {
							var aUiLayer = oUriParameters.mParams["sap-ui-layer"];
							for (var i = 0; i < aUiLayer.length; i++) {
								if (aUiLayer[i].toUpperCase() === "VENDOR"){
									return true;
								}
							}
						}
						return false;
					},

					/*
						Formats the Text to be shown in the segmented button used for multple views in object page tables
					*/
					formatItemTextForMultipleView: function(oItem) {
						var sFacetId = oItem && oItem.facetId;
						return oState.oMultipleViewsHandler[sFacetId] ? oState.oMultipleViewsHandler[sFacetId].formatItemTextForMultipleView(oItem) : "";
					}
				},
				extensionAPI: new ExtensionAPI(oTemplateUtils, oController, oBase)
			};

			oControllerImplementation.handlers = jQuery.extend(oBase.handlers, oControllerImplementation.handlers);

			return oControllerImplementation;
		}
	};
	return oMethods;
});
