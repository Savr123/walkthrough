/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/ui/fl/changeHandler/HideControl"
], function(
	Utils,
	AnnotationChangeUtils,
	HideControl
) {
	"use strict";
	/**
	 * Generic change handler for removing an element.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveElement
	 * @author SAP SE
	 * @version 1.69.0
	 */

	var RemoveElement = {};

	RemoveElement.applyChange = function (oChange, oControl, mPropertyBag) {
		var oSelector = oChange.getContent().customChanges[0].oSelector;
		var oElement = mPropertyBag.modifier.bySelector(oSelector);

		if (oElement) {
			HideControl.applyChange(oChange, oElement, mPropertyBag);
		}
	};

	RemoveElement.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sRemovedElementId = oSpecificChangeInfo.removedElement.id;

		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var oRemovedElement = mPropertyBag.modifier.bySelector(sRemovedElementId, mPropertyBag.appComponent);
		var oSelector = mPropertyBag.modifier.getSelector(sRemovedElementId, mPropertyBag.appComponent);
		/**
		 *  get relevant element
		 *  example - smart filter bar: get control configuration element based on the removed vertical layout (label/field)
		 */
		var oRelevantRemovedElement = oSpecificChangeInfo.custom.fnGetRelevantElement ? oSpecificChangeInfo.custom.fnGetRelevantElement(oRemovedElement) : oRemovedElement;
		var mContent = {};
		var sEntityType = "";
		var oEntityType = {};
		var aAnnotations = [];
		var aAnnotationsOld = [];
		var sAnnotation = "";
		var oTemplData = Utils.getTemplatingInfo(oRelevantRemovedElement);
		if (oTemplData && oTemplData.target && oTemplData.annotation) {
			sEntityType = oTemplData.target;
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oTemplData.annotation;
			aAnnotations = oEntityType[sAnnotation];
		} else {
			// no instance-specific metadata exist => data comes from the calling change handler
			sEntityType = Utils.getEntityType(oRelevantRemovedElement);
			oEntityType = oMetaModel.getODataEntityType(sEntityType);
			sAnnotation = oSpecificChangeInfo.custom.annotation;
			aAnnotations = oEntityType[sAnnotation];
		}
		aAnnotationsOld = aAnnotations.slice();

		// remove element from the annotations
		var iAnnotationIndex = oSpecificChangeInfo.custom.fnGetAnnotationIndex && oSpecificChangeInfo.custom.fnGetAnnotationIndex(oRemovedElement);
		// do whatever the original change does
		HideControl.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		if (oSpecificChangeInfo.custom.fnPerformCustomRemove) {
			oSpecificChangeInfo.custom.fnPerformCustomRemove(oRelevantRemovedElement,aAnnotations);
			mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
		} else if (iAnnotationIndex >= 0) {
			aAnnotations.splice(iAnnotationIndex, 1);
			mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
		}
		mContent.removedElementId = sRemovedElementId;
		mContent.oSelector = oSelector;
		var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
		jQuery.extend(true, oChange.getContent(), mChanges);
	};

	return RemoveElement;
},
/* bExport= */true);