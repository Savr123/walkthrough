/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/base/util/ObjectPath","sap/ui/core/Element","./NS","./ContentConnector","./Scene","./ViewStateManagerBase","./Core"],function(q,O,E,N,C,S,V,v){"use strict";var a=V.extend(N.getName("ViewStateManager"),{metadata:{}});var b=a.getMetadata().getParent().getClass().prototype;a.prototype.init=function(){if(b.init){b.init.call(this);}this._implementation=null;};a.prototype.exit=function(){this._destroyImplementation();if(b.exit){b.exit.call(this);}};a.prototype._destroyImplementation=function(){if(this._implementation){this._implementation.destroy();this._implementation=null;}return this;};a.prototype.getImplementation=function(){return this._implementation;};a.prototype._setContent=function(c){var s=null;if(c&&c instanceof S){s=c;}this._setScene(s);};a.prototype._onAfterUpdateContentConnector=function(){this._setContent(this._contentConnector.getContent());};a.prototype._onBeforeClearContentConnector=function(){this._setScene(null);};a.prototype._handleContentReplaced=function(e){this._setContent(e.getParameter("newContent"));};a.prototype._setScene=function(s){if(s&&s instanceof S){var c=s.getMetadata().getName(),i=this._implementation&&this._implementation.getMetadata().getName(),r=c===N.getName("dvl.Scene")&&i===N.getName("dvl.ViewStateManager")||c===N.getName("threejs.Scene")&&i===N.getName("threejs.ViewStateManager");if(!r){this._destroyImplementation();var n;if(c===N.getName("dvl.Scene")){n=N.getName("dvl.ViewStateManager");}else if(c===N.getName("threejs.Scene")){n=N.getName("threejs.ViewStateManager");}if(n){var t=this;var d=O.get(n);this._implementation=new d({shouldTrackVisibilityChanges:this.getShouldTrackVisibilityChanges(),recursiveSelection:this.getRecursiveSelection(),contentConnector:this.getContentConnector(),visibilityChanged:function(e){t.fireVisibilityChanged({visible:e.getParameter("visible"),hidden:e.getParameter("hidden")});},selectionChanged:function(e){t.fireSelectionChanged({selected:e.getParameter("selected"),unselected:e.getParameter("unselected")});},opacityChanged:function(e){t.fireOpacityChanged({changed:e.getParameter("changed"),opacity:e.getParameter("opacity")});},tintColorChanged:function(e){t.fireTintColorChanged({changed:e.getParameter("changed"),tintColor:e.getParameter("tintColor"),tintColorABGR:e.getParameter("tintColorABGR")});},nodeHierarchyReplaced:function(e){t.fireNodeHierarchyReplaced({oldNodeHierarchy:e.getParameter("oldNodeHierarchy"),newNodeHierarchy:e.getParameter("newNodeHierarchy")});}});}}}else{this._destroyImplementation();}return this;};a.prototype.getNodeHierarchy=function(){return this._implementation&&this._implementation.getNodeHierarchy();};a.prototype.getVisibilityChanges=function(){return this._implementation&&this._implementation.getVisibilityChanges();};a.prototype.getVisibilityComplete=function(){return this._implementation&&this._implementation.getVisibilityComplete();};a.prototype.getVisibilityState=function(n){return this._implementation&&this._implementation.getVisibilityState(n);};a.prototype.setVisibilityState=function(n,c,r){if(this._implementation){this._implementation.setVisibilityState(n,c,r);}return this;};a.prototype.resetVisibility=function(){return this._implementation&&this._implementation.resetVisibility();};a.prototype.enumerateSelection=function(c){if(this._implementation){this._implementation.enumerateSelection(c);}return this;};a.prototype.setShowSelectionBoundingBox=function(c){if(this._implementation){this._implementation.setShowSelectionBoundingBox(c);}};a.prototype.getShowSelectionBoundingBox=function(){if(this._implementation){return this._implementation.getShowSelectionBoundingBox();}};a.prototype.getSelectionState=function(n){return this._implementation&&this._implementation.getSelectionState(n);};a.prototype.setSelectionState=function(n,s,r){if(this._implementation){this._implementation.setSelectionState(n,s,r);}return this;};a.prototype.setSelectionStates=function(s,u,r){if(this._implementation){this._implementation.setSelectionStates(s,u,r);}return this;};a.prototype.getOpacity=function(n){return this._implementation&&this._implementation.getOpacity(n);};a.prototype.setOpacity=function(n,o,r){if(this._implementation){this._implementation.setOpacity(n,o,r);}return this;};a.prototype.getTintColor=function(n,i){return this._implementation&&this._implementation.getTintColor(n,i);};a.prototype.setTintColor=function(n,t,r){if(this._implementation){this._implementation.setTintColor(n,t,r);}return this;};a.prototype.setHighlightColor=function(c){if(this._implementation&&this._implementation.setHighlightColor){this._implementation.setHighlightColor(c);}return this;};a.prototype.getHighlightColor=function(i){if(this._implementation&&this._implementation.getHighlightColor){return this._implementation.getHighlightColor(i);}};a.prototype.setRecursiveSelection=function(p){this.setProperty("recursiveSelection",p,true);if(this._implementation){this._implementation.setRecursiveSelection(p);}return this;};var f=a.getMetadata().getName();var m={init:function(){this._viewStateManager=null;v.attachEvent(f+"-created",this._handleViewStateManagerCreated,this).attachEvent(f+"-destroying",this._handleViewStateManagerDestroying,this);},exit:function(){this.setViewStateManager(null);v.detachEvent(f+"-destroying",this._handleViewStateManagerDestroying,this).detachEvent(f+"-created",this._handleViewStateManagerCreated,this);},setViewStateManager:function(c){this.setAssociation("viewStateManager",c,true);this._updateViewStateManager();return this;},_updateViewStateManager:function(){var n=this.getViewStateManager(),c=n&&sap.ui.getCore().byId(n)||null;if(this._viewStateManager!==c){this._clearViewStateManager();if(c){if(this._handleNodeHierarchyReplaced){c.attachNodeHierarchyReplaced(this._handleNodeHierarchyReplaced,this);}if(this._handleVisibilityChanged){c.attachVisibilityChanged(this._handleVisibilityChanged,this);}if(this._handleSelectionChanged){c.attachSelectionChanged(this._handleSelectionChanged,this);}if(this._handleOpacityChanged){c.attachOpacityChanged(this._handleOpacityChanged,this);}if(this._handleTintColorChanged){c.attachTintColorChanged(this._handleTintColorChanged,this);}this._viewStateManager=c;if(this._onAfterUpdateViewStateManager){this._onAfterUpdateViewStateManager();}}}return this;},_clearViewStateManager:function(){if(this._viewStateManager){if(this._onBeforeClearViewStateManager){this._onBeforeClearViewStateManager();}if(this._handleTintColorChanged){this._viewStateManager.detachTintColorChanged(this._handleTintColorChanged,this);}if(this._handleOpacityChanged){this._viewStateManager.detachOpacityChanged(this._handleOpacityChanged,this);}if(this._handleSelectionChanged){this._viewStateManager.detachSelectionChanged(this._handleSelectionChanged,this);}if(this._handleVisibilityChanged){this._viewStateManager.detachVisibilityChanged(this._handleVisibilityChanged,this);}if(this._handleNodeHierarchyReplaced){this._viewStateManager.detachNodeHierarchyReplaced(this._handleNodeHierarchyReplaced,this);}this._viewStateManager=null;}return this;},_handleViewStateManagerCreated:function(e){if(this.getViewStateManager()===e.getParameter("object").getId()){this._updateViewStateManager();}},_handleViewStateManagerDestroying:function(e){if(this.getViewStateManager()===e.getParameter("object").getId()){this._clearViewStateManager();}}};a.injectMethodsIntoClass=function(c){var p=c.prototype,i=p.init,e=p.exit;p.init=function(){if(i){i.call(this);}m.init.call(this);};p.exit=function(){m.exit.call(this);if(e){e.call(this);}};p.setViewStateManager=m.setViewStateManager;p._updateViewStateManager=m._updateViewStateManager;p._clearViewStateManager=m._clearViewStateManager;p._handleViewStateManagerCreated=m._handleViewStateManagerCreated;p._handleViewStateManagerDestroying=m._handleViewStateManagerDestroying;};v.registerClass(a);C.injectMethodsIntoClass(a);return a;});
