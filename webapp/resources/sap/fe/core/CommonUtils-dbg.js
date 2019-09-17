/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/core/mvc/View"
], function (View) {
	"use strict";
	function fnGetParentViewOfControl(oControl) {
		while (oControl && !(oControl instanceof View)) {
			oControl = oControl.getParent();
		}
		return oControl;
	}


	function fnHasTransientContexts(oListBinding) {
		var bHasTransientContexts = false;
		oListBinding.getCurrentContexts().forEach(function (oContext) {
			if (oContext && oContext.isTransient()) {
				bHasTransientContexts = true;
			}
		});
		return bHasTransientContexts;
	}

	return {
		getParentViewOfControl: fnGetParentViewOfControl,
		hasTransientContext : fnHasTransientContexts
	};
});
