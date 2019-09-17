/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./thirdparty/three","../NS","sap/ui/base/ManagedObject","./PolylineGeometry","./PolylineMaterial","./PolylineMesh","../LeaderLineMarkStyle"],function(q,t,N,B,P,a,b,L){"use strict";var T=B.extend(N.getName("threejs.Thrustline"),{metadata:{properties:{node:{type:"object"},renderOrder:{type:"int",defaultValue:0},depthTest:{type:"boolean",defaultValue:true},principleAxis:{type:"object",defaultValue:new THREE.Vector3(0,0,0)},material:{type:"object"},items:{type:"object[]"},segments:{type:"object[]"}}}});T.prototype.init=function(){if(B.prototype.init){B.prototype.init.call(this);}this._needUpdateMeshes=false;};T.prototype.setNode=function(n){if(n instanceof THREE.Object3D){this.setProperty("node",n,true);this._needUpdateMeshes=true;}return this;};T.prototype.setRenderOrder=function(h){this.setProperty("renderOrder",h,true);this._needUpdateMeshes=true;return this;};T.prototype.setDepthTest=function(h){this.setProperty("depthTest",h,true);this._needUpdateMeshes=true;return this;};T.prototype.setMaterial=function(h){if(h instanceof THREE.Material){this.setProperty("material",h,true);this._needUpdateMeshes=true;}return this;};T.prototype.setItems=function(h){this.setProperty("items",h,true);this._needUpdateMeshes=true;return this;};T.prototype.setSegments=function(h){this.setProperty("segments",h,true);this._needUpdateMeshes=true;return this;};T.prototype._updateMeshes=function(v){var n=this.getNode();var h=this.getMaterial();var j=this.getDepthTest();var r=this.getRenderOrder();var k=h&&h.userData.lineStyle?h.userData.lineStyle:{};var o=k.width;var p=k.dashPatternScale;if(k.widthCoordinateSpace===3){o=o?o*v.y:1;p=p?p*v.y:1;}o=o||1;k.haloWidth=k.haloWidth||0;k.endCapStyle=k.endCapStyle||0;this.getSegments().forEach(function(s){if(s.polylineMesh){n.remove(s.polylineMesh);s.polylineMesh=null;}if(s.haloMesh){n.remove(s.haloMesh);s.haloMesh=null;}var u=[];for(var i=0,l=s.ratios.length;i<l;i++){u.push(new THREE.Vector3());}var w=new P();w.setVertices(u);var x=k.endCapStyle||u.length>2?1:0;var y=(x&&k.endCapStyle===0?1:0)|(x&&k.endCapStyle===0?2:0);if(k.haloWidth>0){var z=new a({color:0xFFFFFF,lineColor:0xFFFFFF,linewidth:o*(k.haloWidth*2+1),dashCapStyle:k.endCapStyle,segmentCapStyle:x,trimStyle:y,transparent:true,depthTest:j});var A=new b(w,z);A.matrixAutoUpdate=false;A.renderOrder=r;s.haloMesh=A;n.add(A);}var C=new a({color:0xFFFFFF,lineColor:h.color,linewidth:o,dashCapStyle:k.endCapStyle,segmentCapStyle:x,trimStyle:y,dashPattern:k.dashPattern||[],dashScale:p||1,transparent:true,depthTest:j,polygonOffset:true,polygonOffsetFactor:-4});var D=new b(w,C);D.matrixAutoUpdate=false;D.renderOrder=r;s.polylineMesh=D;n.add(D);});};var v=new THREE.Vector2(),m=new THREE.Matrix4(),c=new THREE.Matrix4(),d=new THREE.Vector3(),e=new THREE.Vector3(),f=new THREE.Vector3(),g=new THREE.Vector3();T.prototype._update=function(r,h){var n=this.getNode();if(!n||!n.visible){return;}var j=r.getSize();v.set(j.width,j.height);if(this._needUpdateMeshes){this._needUpdateMeshes=false;this._updateMeshes(v);}m.multiplyMatrices(h.projectionMatrix,h.matrixWorldInverse);c.copy(m);var k=h instanceof THREE.PerspectiveCamera?h.near:undefined;var o=this.getItems();d.copy(this.getPrincipleAxis()).normalize();this.getSegments().forEach(function(s){var p=s.polylineMesh;if(p){var u=p.geometry;var w=o[s.startItemIndex];var x=new THREE.Vector3().copy(w.boundPoints[s.startBoundIndex]).applyMatrix4(w.target.matrixWorld);var y=o[s.endItemIndex];var z=new THREE.Vector3().copy(y.boundPoints[s.endBoundIndex]).applyMatrix4(y.target.matrixWorld);e.copy(z).sub(x);f.copy(d).multiplyScalar(e.dot(d));g.copy(e).sub(f);var A=u.vertices;var C=[];for(var i=0,l=s.ratios.length;i<l;i++){C.push(i);var D=s.ratios[i];var E=A[i];E.copy(x);e.copy(f).multiplyScalar(D.x);E.add(e);e.copy(g).multiplyScalar(D.y);E.add(e);}u._updateVertices(C);p.material.resolution.copy(v);p.computeLineDistances(c,v,k);}var F=s.haloMesh;if(F){F.material.resolution.copy(v);F.computeLineDistances(c,v,k);}});};return T;});
