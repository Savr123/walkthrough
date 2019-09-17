/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider","sap/ui/core/ResizeHandler","./NS"],function(E,R,N){"use strict";var a=E.extend(N.getName("RedlineDesignHandler"),{metadata:{publicMethods:["beginGesture","move","endGesture","click","doubleClick","contextMenu","getViewport"]},constructor:function(r){this._redlineDesign=r;this._x=0;this._y=0;this._gesture=false;}});a.prototype.destroy=function(){this._redlineDesign=null;this._rect=null;this._gesture=false;};a.prototype._getOffset=function(d){var r=d.getBoundingClientRect();return{x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};};a.prototype._inside=function(e,r){var b=r.getDomRef(),i=false;if(b!==null){var c=this._getOffset(b);var d={x:c.x,y:c.y,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height};i=(e.x>=d.x&&e.x<=d.x+d.width&&e.y>=d.y&&e.y<=d.y+d.height);}return i;};a.prototype._onresize=function(e){this._gesture=false;};a.prototype.beginGesture=function(e){var v=this.getViewport();if(this._inside(e,v)&&v._activeElementInstance){this._gesture=true;this._x=e.x;this._y=e.y;v._setIsDrawingOn(true);var d=v.getDomRef();var t=v._toVirtualSpace(e.x-d.getBoundingClientRect().left-window.pageXOffset,e.y-d.getBoundingClientRect().top-window.pageYOffset);v._activeElementInstance.setOriginX(t.x);v._activeElementInstance.setOriginY(t.y);if(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge){v.invalidate();}else{var r=sap.ui.getCore().createRenderManager();v._activeElementInstance.render(r);r.flush(v.getDomRef(),false,true);r.destroy();var x=v.$();x.html(x.html());}e.handled=true;}return this;};a.prototype.move=function(e){var v=this.getViewport();if(v._activeElementInstance&&v._getIsDrawingOn()){var b=v.getDomRef().getBoundingClientRect(),o=e.x-b.left-window.pageXOffset,c=e.y-b.top-window.pageYOffset;v._editElement(v._activeElementInstance,o,c);e.handled=true;}return this;};a.prototype.endGesture=function(e){var v=this.getViewport();this._gesture=false;if(v._activeElementInstance){v.addRedlineElement(v._activeElementInstance);v.fireElementCreated({element:v._activeElementInstance});v.stopAdding();e.handled=true;}return this;};a.prototype.contextMenu=function(e){e.handled=true;};a.prototype.getViewport=function(){return this._redlineDesign;};return a;});
