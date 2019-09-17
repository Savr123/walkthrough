/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/theming/Parameters","sap/m/ValueCSSColor"],function(E,P,V){"use strict";var S=E.extend("sap.suite.ui.commons.networkgraph.Status",{metadata:{library:"sap.suite.ui.commons",properties:{key:{type:"string",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null},borderColor:{type:"string",group:"Appearance",defaultValue:null},backgroundColor:{type:"string",group:"Appearance",defaultValue:null},contentColor:{type:"string",group:"Appearance",defaultValue:null},headerContentColor:{type:"string",group:"Appearance",defaultValue:null},hoverBackgroundColor:{type:"string",group:"Appearance",defaultValue:null},hoverBorderColor:{type:"string",group:"Appearance",defaultValue:null},hoverContentColor:{type:"string",group:"Appearance",defaultValue:null},selectedBackgroundColor:{type:"string",group:"Appearance",defaultValue:null},selectedBorderColor:{type:"string",group:"Appearance",defaultValue:null},selectedContentColor:{type:"string",group:"Appearance",defaultValue:null},legendColor:{type:"string",group:"Appearance",defaultValue:null},useFocusColorAsContentColor:{type:"boolean",group:"Appearance",defaultValue:false},borderWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},borderStyle:{type:"string",group:"Appearance",defaultValue:null}}}});S.prototype._getLegendColor=function(){var l=this.getLegendColor()||this.getBackgroundColor();if(l){var c=P.get(l);if(!c&&V.isValid(l)){c=l;}return c;}return null;};return S;});
