/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NS","./Tool","./CoordinateSystem","./ScaleToolHandler","./ScaleToolGizmo"],function(N,T,C,S,a){"use strict";var b=T.extend(N.getName("tools.ScaleTool"),{metadata:{properties:{coordinateSystem:{type:N.getName("tools.CoordinateSystem"),defaultValue:C.World},nonUniformScaleEnabled:{type:"boolean",defaultValue:false},enableStepping:{type:"boolean",defaultValue:false},showEditingUI:{type:"boolean",defaultValue:false}},events:{scaling:{parameters:{x:"float",y:"float",z:"float"}},scaled:{parameters:{x:"float",y:"float",z:"float"}},coordinateSystemChanged:{parameters:{coordinateSystem:N.getName("tools.CoordinateSystem")}}}},constructor:function(i,s){T.apply(this,arguments);this._viewport=null;this._handler=null;this._gizmo=null;}});b.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint([N.getName("threejs.Viewport")]);this.setAggregation("gizmo",new a());};b.prototype.isViewportType=function(t){if(this._viewport&&this._viewport.getMetadata().getName()===t){return true;}return false;};b.prototype.setActive=function(v,c,g){if(T.prototype.setActive){T.prototype.setActive.call(this,v,c,g);}if(v){this._activateTool(c);}else{this._deactivateTool();}if(c){c.setShouldRenderFrame();}return this;};b.prototype._activateTool=function(c){this._viewport=this.getViewportImplementation(c);this._handler=new S(this);this._gizmo=this.getGizmo();this._gizmo.setCoordinateSystem(this.getCoordinateSystem());this._gizmo.setNonUniformScaleEnabled(this.getNonUniformScaleEnabled());this._gizmo.show(this._viewport,this);this._prepare();};b.prototype._deactivateTool=function(){if(this._handler){if(this._viewport._loco){this._viewport._loco.removeHandler(this._handler);}this._handler=null;}if(this._gizmo){this._gizmo.hide();this._gizmo=null;}};b.prototype._prepare=function(){var o=false;if(this._viewport._loco){this._viewport._loco.addHandler(this._handler,11);o=true;}return o;};b.prototype.queueCommand=function(c){if(this._prepare()){if(this.isViewportType(N.getName("threejs.Viewport"))){c();}}return this;};b.prototype.destroy=function(){T.prototype.destroy.call(this);this._viewport=null;this._handler=null;};b.prototype.setCoordinateSystem=function(v){var c=this.getCoordinateSystem();if(c!==v){this.setProperty("coordinateSystem",v,true);this.getGizmo().setCoordinateSystem(v);if(this._viewport){this._viewport.setShouldRenderFrame();}this.fireCoordinateSystemChanged({coordinateSystem:v});}return this;};b.prototype.setNonUniformScaleEnabled=function(v){this.setProperty("nonUniformScaleEnabled",v,true);this.getGizmo().setNonUniformScaleEnabled(v);if(this._viewport){this._viewport.setShouldRenderFrame();}return this;};b.prototype.setShowEditingUI=function(v){this.setProperty("showEditingUI",v,true);if(this._viewport){this._viewport.setShouldRenderFrame();}return this;};b.prototype.scale=function(x,y,z){if(this._gizmo){this._gizmo.scale(x,y,z);}if(this._viewport){this._viewport.setShouldRenderFrame();}return this;};return b;});