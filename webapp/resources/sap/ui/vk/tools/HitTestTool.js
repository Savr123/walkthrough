/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Tool","./HitTestToolHandler","./HitTestIdMode","../NS"],function(T,H,a,N){"use strict";var b=T.extend(N.getName("tools.HitTestTool"),{metadata:{properties:{IdMode:{type:N.getName("tools.HitTestIdMode"),defaultValue:a.ThreeJS}},events:{hit:{parameters:{id:"any",object:"any",point:"any",clickType:N.getName("tools.HitTestClickType")}}}},constructor:function(i,s){if(b._instance){return b._instance;}T.apply(this,arguments);this.setToolid("63150593-75f6-c330-2a7a-c1f85d36b2b9");this._viewport=null;this._handler=null;this._loco=null;b._instance=this;}});b.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint([N.getName("threejs.Viewport")]);};b.prototype.setActive=function(v,c,g){if(T.prototype.setActive){T.prototype.setActive.call(this,v,c,g);}if(v){this._activateTool(c);}else{this._deactivateTool();}return this;};b.prototype._activateTool=function(c){this._viewport=this.getViewportImplementation(c);this._handler=new H(this);this._prepare();};b.prototype._deactivateTool=function(){if(this._handler){this._viewport._loco.removeHandler(this._handler);}this._handler=null;};b.prototype._prepare=function(){var o=false;if(this._viewport._loco){this._viewport._loco.addHandler(this._handler);o=true;}if(o){if(this.isViewportType(N.getName("dvl.Viewport"))&&this._viewport._dvl){this._dvlRendererId=this._viewport._dvlRendererId;this._dvl=this._viewport._dvl;o=true;}else if(this.isViewportType(N.getName("threejs.Viewport"))&&(this._viewport._scene&&this._viewport._scene.getSceneRef())){o=true;}}return o;};b.prototype.queueCommand=function(c){if(this._prepare()){if(this._dvlRendererId){this._dvl.Renderer._queueCommand(c,this._dvlRendererId);}}return this;};b.prototype.hitTest=function(x,y,s,c,d){if(this._prepare()){var h=null;if(this.isViewportType(N.getName("dvl.Viewport"))&&this._viewport._dvl){return null;}else if(this.isViewportType(N.getName("threejs.Viewport"))){if(!s||!c){h=null;}else if(this._viewport._renderer){var e=this._viewport._renderer.domElement;var m=new THREE.Vector2((x-e.offsetLeft)/e.clientWidth*2-1,(e.offsetTop-y)/e.clientHeight*2+1);var r=new THREE.Raycaster();r.setFromCamera(m,c.getCameraRef());var i=r.intersectObjects(s.getSceneRef().children,true);if(i&&i.length){h=i[0];}}}var f=null;if(h){var g;switch(this.getIdMode()){case a.VEsID:g=this._viewport._scene.nodeRefToPersistentId(h.object);break;case a.ThreeJS:g=h.object.id;break;default:g=h.object.id;break;}f={id:g,object:h.object,point:h.point,clickType:d};this.fireHit(f);}return f;}};b.prototype.destroy=function(){T.prototype.destroy.call(this);this._viewport=null;this._handler=null;};return b;});