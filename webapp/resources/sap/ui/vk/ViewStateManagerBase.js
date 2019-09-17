/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element","./NS","./ContentConnector","./Scene"],function(E,N,C,S){"use strict";var V=E.extend(N.getName("ViewStateManagerBase"),{metadata:{"abstract":true,properties:{shouldTrackVisibilityChanges:{type:"boolean",defaultValue:false},recursiveSelection:{type:"boolean",defaultValue:false}},associations:{contentConnector:{type:N.getName("ContentConnector")}},events:{visibilityChanged:{parameters:{visible:{type:"any[]"},hidden:{type:"any[]"}},enableEventBubbling:true},selectionChanged:{parameters:{selected:{type:"any[]"},unselected:{type:"any[]"}},enableEventBubbling:true},opacityChanged:{parameters:{changed:{type:"any[]"},opacity:{type:"float"}},enableEventBubbling:true},tintColorChanged:{parameters:{changed:{type:"any[]"},tintColor:{type:"sap.ui.core.CSSColor"},tintColorABGR:{type:"int"}},enableEventBubbling:true},nodeHierarchyReplaced:{parameters:{oldNodeHierarchy:{type:N.getName("NodeHierarchy")},newNodeHierarchy:{type:N.getName("NodeHierarchy")}}},highlightColorChanged:{parameters:{highlightColor:{type:"sap.ui.core.CSSColor"},highlightColorABGR:{type:"int"}},enableEventBubbling:true}}}});return V;});
