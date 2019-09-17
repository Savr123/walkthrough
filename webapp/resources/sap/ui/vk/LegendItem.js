/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./NS","sap/m/StandardListItem","./LegendItemRenderer"],function(N,S,L){"use strict";var a=S.extend(N.getName("LegendItem"),{metadata:{library:N.getName(),properties:{color:{type:"sap.ui.core.CSSColor",group:"Appearance",defaultValue:null},semanticSpotType:{type:"sap.ui.vbm.SemanticType",group:"Behavior",defaultValue:null}},aggregations:{}}});return a;});
