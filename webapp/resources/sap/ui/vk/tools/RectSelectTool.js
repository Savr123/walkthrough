/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NS","./Tool","./RectSelectToolHandler","../Loco"],function(N,T,R,L){"use strict";var a=T.extend(N.getName("tools.RectSelectTool"),{metadata:{properties:{subtractMode:{type:"boolean",defaultValue:false}}},constructor:function(i,s){if(a._instance){return a._instance;}T.apply(this,arguments);this._viewport=null;this._handler=new R(this);this._loco=null;a._instance=this;}});a.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint([N.getName("dvl.Viewport"),N.getName("threejs.Viewport")]);};a.prototype.setActive=function(v,b,g){if(T.prototype.setActive){T.prototype.setActive.call(this,v,b,g);}if(v){this._activateTool(b);}else{this._deactivateTool();}if(b){b.setShouldRenderFrame();}return this;};a.prototype._activateTool=function(b){this._viewport=this.getViewportImplementation(b);if(this._prepare()){this._handler.activate(this._viewport);}};a.prototype._deactivateTool=function(){this._handler.deactivate();};a.prototype._prepare=function(){if(this.isViewportType(N.getName("dvl.Viewport"))&&this._viewport._dvl){return true;}else if(this.isViewportType(N.getName("threejs.Viewport"))&&this._viewport._scene&&this._viewport._scene.getSceneRef()){return true;}else{return false;}};a.prototype.queueCommand=function(b){if(this._prepare()){if(this.isViewportType(N.getName("threejs.Viewport"))){b();}}return this;};function c(b,d,v){var m=b.elements;var i=m[15]===1;var r=2/m[0];var t=2/m[5];var e,f;if(i){e=-m[12]*r;f=-m[13]*t;}else{e=m[8]*r;f=m[9]*t;}var g=(r+e)*0.5;var l=e-g;var h=(t+f)*0.5;var j=f-h;var k=THREE.Math.lerp(l,g,Math.min(d.x1,d.x2)/v.width);var n=THREE.Math.lerp(l,g,Math.max(d.x1,d.x2)/v.width);var o=THREE.Math.lerp(h,j,Math.min(d.y1,d.y2)/v.height);var p=THREE.Math.lerp(h,j,Math.max(d.y1,d.y2)/v.height);m[0]=2/(n-k);m[5]=2/(o-p);if(i){m[12]=-(n+k)/(n-k);m[13]=-(o+p)/(o-p);}else{m[8]=(n+k)/(n-k);m[9]=(o+p)/(o-p);}}a.prototype.select=function(x,y,b,d,s,e){var n=[];if(!this._prepare()){return n;}if(this.isViewportType(N.getName("dvl.Viewport"))){n=this._viewport.rectSelect(x,y,b,d);if(n.length>0){var p={picked:n};this._viewport.fireNodesPicked(p);if(this.getSubtractMode()){this._viewport._viewStateManager.setSelectionStates([],n);}else{this._viewport._viewStateManager.setSelectionStates(n,[]);}}return n;}var f=s?s.getSceneRef():undefined;var g=e?e.getCameraRef():undefined;var v=this._viewport._getViewStateManagerThreeJS();if(!g||!f||!v||x===b||y===d){return n;}var r={x1:x,y1:y,x2:b,y2:d};var m=g.projectionMatrix.clone();c(m,r,this._viewport._renderer.getSize());var h=new THREE.Matrix4().multiplyMatrices(m,g.matrixWorldInverse);var j=new THREE.Frustum().setFromMatrix(h);var k=new THREE.Vector3();function o(u){var w=u.geometry;if(w!==undefined&&j.intersectsObject(u)){var i,l=0;if(w.isGeometry){var z=w.vertices;for(i=0,l=z.length;i<l;i++){k.copy(z[i]).applyMatrix4(u.matrixWorld);if(!j.containsPoint(k)){break;}}}else if(w.isBufferGeometry){var A=w.attributes.position;if(A!==undefined){for(i=0,l=A.count;i<l;i++){k.fromBufferAttribute(A,i).applyMatrix4(u.matrixWorld);if(!j.containsPoint(k)){break;}}}}return l>0&&i===l;}return false;}function t(l){if(l.visible===false){return;}var u=0,w=0;if(l.geometry!==undefined){u++;if(o(l)){w++;}}var z=l.children;if(z.length>0){for(var i=0;i<z.length;i++){var A=z[i];if(A.geometry!==undefined&&!A.name&&A.children.length===0){if(A.visible===true){u++;if(o(A)){w++;}}}else{t(A);}}}if(w>0&&u===w){n.push(l);}}t(f);if(n.length>0){var q={picked:n};this._viewport.fireNodesPicked(q);if(this.getSubtractMode()){v.setSelectionStates([],n);}else{v.setSelectionStates(n,[]);}}return n;};a.prototype.destroy=function(){T.prototype.destroy.call(this);this._viewport=null;this._handler=null;};return a;});
