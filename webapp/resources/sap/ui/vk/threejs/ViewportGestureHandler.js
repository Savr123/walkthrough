/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/
sap.ui.define(["jquery.sap.global","sap/ui/base/EventProvider","../NS","./PerspectiveCamera","./OrthographicCamera","./thirdparty/three","../getResourceBundle"],function(q,E,N,P,O,t,g){"use strict";var V=E.extend(N.getName("threejs.ViewportGestureHandler"),{metadata:{},constructor:function(v){this._matProj=null;this._viewport=v;this._rect=null;this._evt={x:0,y:0,z:0,d:0,initd:0};this._gesture=false;this._viewport.attachEvent("resize",this,this._onresize);this._nomenu=false;var T=function(b){var v=b;var c=new THREE.Vector3();var z=new THREE.Vector2();var A=0.001;var M=-Math.PI/2+A;var d=Math.PI/2-A;this.isTurnTableMode=true;this._timeIntervalForCameraAnimation=500;this._startTimeForCameraAnimation=0;this._newCamera=null;this._oldCamera=null;this._animationType=null;this._zoomedNodeRef=null;this._isZoomIn=true;this.beginGesture=function(x,y){var e=v.getScene();if(e==null){return;}var f=e.getSceneRef();var h=v.getCamera().getCameraRef();var i=v.getRenderer().getSize();z.x=x/i.width*2-1;z.y=y/i.height*-2+1;v._gesturePoint={x:x,y:y};var j=v.hitTest(x,y,f,h);if(j){c.copy(j.point);}else{var k=new THREE.Box3();f._expandBoundingBox(k,true,true);if(!k.isEmpty()){k.getCenter(c);}else{c.setScalar(0);}}};this.endGesture=function(){};this.pan=function(e,f){if(v.getFreezeCamera()||v.getCamera()==null){return;}if(e===0&&f===0){return;}var h=v.getCamera().getCameraRef();var i=v.getRenderer().getSize();if(v._viewportGestureHandler._matProj){var m=v._viewportGestureHandler._matProj;m[8]-=e*2/i.width;m[9]+=f*2/i.height;}else{var o=c.clone().project(h);o.x-=e*2/i.width;o.y+=f*2/i.height;o.unproject(h).sub(c);h.position.add(o);}h.updateMatrixWorld();v.fireCameraChanged({position:h.position.toArray()});};this.rotate=function(e,f,i){if(v.getFreezeCamera()||v.getCamera()==null){return;}if(i!==undefined){this.isTurnTableMode=i;}if(e===0&&f===0){return;}var h=v.getCamera().getCameraRef(),j=e*-0.01,k=f*-0.01;var o=h.position.clone().sub(c);var l=new THREE.Vector3(),u=new THREE.Vector3().setFromMatrixColumn(h.matrixWorld,1).normalize(),r=new THREE.Vector3().setFromMatrixColumn(h.matrixWorld,0).normalize();h.getWorldDirection(l);l.normalize();var m=new THREE.Quaternion(),n=new THREE.Quaternion();if(this.isTurnTableMode){var p=new THREE.Vector3(0,1,0);r.crossVectors(l,p).normalize();u.crossVectors(r,l);var w=Math.atan2(l.y,Math.sqrt(l.x*l.x+l.z*l.z));m.setFromAxisAngle(p,j);n.setFromAxisAngle(r,THREE.Math.clamp(k,M-w,d-w));}else{m.setFromAxisAngle(u,j);n.setFromAxisAngle(r,k);}m.multiply(n);o.applyQuaternion(m);l.applyQuaternion(m);u.applyQuaternion(m);o.add(c);h.position.copy(o);h.up.copy(u);h.lookAt(o.add(l));h.updateMatrixWorld();v.fireCameraChanged({position:h.position.toArray(),quaternion:h.quaternion.toArray()});};this.zoom=function(e){if(v.getFreezeCamera()||v.getCamera()==null){return;}var h=v.getScene();if(h==null){return;}var i=h.getSceneRef();if(e===0||e===1){return;}if(e>1.12){e=1.12;}else if(e<0.88){e=0.88;}var j=100;var k=v.getCamera().getCameraRef();var l=new THREE.Vector3();var m=new THREE.Box3();var n=new THREE.Vector3();i._expandBoundingBox(m,true,true);m.applyMatrix4(k.matrixWorldInverse);m.min.z=Math.max(m.min.z,k.near);m.max.z=Math.max(m.max.z,k.near);m.applyMatrix4(k.projectionMatrix);m.getSize(n);var o=v.getRenderer().getSize();var p=n.x*o.width*0.5;var r=n.y*o.height*0.5;if(p<j&&r<j&&e<1){return;}if(k.isPerspectiveCamera){if(v._viewportGestureHandler._matProj){this._matProj=v._viewportGestureHandler._matProj;var u=v.getDomRef();var w=a(this._matProj);var x=w.left+(w.right-w.left)*v._gesturePoint.x/u.clientWidth;var y=w.top+(w.bottom-w.top)*v._gesturePoint.y/u.clientHeight;var f=1/e;w.left=x+(w.left-x)*f;w.right=x+(w.right-x)*f;w.top=y+(w.top-y)*f;w.bottom=y+(w.bottom-y)*f;s(this._matProj,w);}else{l.set(z.x,z.y,1).unproject(k);l.sub(new THREE.Vector3(z.x,z.y,-1).unproject(k));var B=c.clone().sub(k.position).length()*(1-1/e);l.setLength(B);k.position.add(l);}}else if(k.isOrthographicCamera){l.set(z.x,z.y,1).unproject(k);l.sub(new THREE.Vector3(0,0,1).unproject(k));l.multiplyScalar(1-1/e);k.zoom*=e;k.updateProjectionMatrix();k.position.add(l);}else{q.sap.log.error(g().getText("VIEWPORTGESTUREHANDLER_MSG_UNSUPPORTEDCAMERATYPE"));}k.updateMatrixWorld();var C={position:k.position.toArray()};if(k.isOrthographicCamera){C.zoom=k.zoom;}v.fireCameraChanged(C);};this.animateCameraUpdate=function(){if(this._newCamera===null||this._oldCamera===null){return;}if(v.getCamera()==null){this._newCamera=null;this._oldCamera=null;return;}function e(h,j,x){x=THREE.Math.clamp((x-h)/(j-h),0.0,1.0);return x*x*x*(x*(x*6-15)+10);}var i=Math.min((Date.now()-this._startTimeForCameraAnimation)/this._timeIntervalForCameraAnimation,1);i=e(0,1,i);var f=v.getCamera().getCameraRef();if(f.isOrthographicCamera&&this._newCamera.isOrthographicCamera&&this._oldCamera.isOrthographicCamera){f.left=THREE.Math.lerp(this._oldCamera.left,this._newCamera.left,i);f.right=THREE.Math.lerp(this._oldCamera.right,this._newCamera.right,i);f.top=THREE.Math.lerp(this._oldCamera.top,this._newCamera.top,i);f.bottom=THREE.Math.lerp(this._oldCamera.bottom,this._newCamera.bottom,i);f.zoom=THREE.Math.lerp(this._oldCamera.zoom,this._newCamera.zoom,i);}if(f.isPerspectiveCamera&&this._newCamera.isPerspectiveCamera&&this._oldCamera.isPerspectiveCamera){f.fov=THREE.Math.lerp(this._oldCamera.fov,this._newCamera.fov,i);f.aspect=THREE.Math.lerp(this._oldCamera.aspect,this._newCamera.aspect,i);}f.far=THREE.Math.lerp(this._oldCamera.far,this._newCamera.far,i);f.near=THREE.Math.lerp(this._oldCamera.near,this._newCamera.near,i);f.updateProjectionMatrix();f.position.lerpVectors(this._oldCamera.position,this._newCamera.position,i);f.quaternion.copy(this._oldCamera.quaternion).slerp(this._newCamera.quaternion,i);f.scale.lerpVectors(this._oldCamera.scale,this._newCamera.scale,i);f.updateMatrixWorld();if(i===1){this._newCamera=null;this._oldCamera=null;if(this._animationType==="zooming"&&this._zoomedNodeRef){v.fireNodeZoomed({zoomed:this._zoomedNodeRef,isZoomIn:this._isZoomIn});}v.cameraUpdateCompleted({position:f.position.toArray(),quaternion:f.quaternion.toArray()});}v.fireCameraChanged({position:f.position.toArray(),quaternion:f.quaternion.toArray()});};this.zoomObject=function(n,i,e){if(v.getScene()==null){return;}var f=new THREE.Box3();(i&&n?n:v.getScene().getSceneRef())._expandBoundingBox(f,true,true);this.zoomBox(f,0,e,n,i);};this.zoomBox=function(e,m,f,n,h){this._zoomedNodeRef=n;this._isZoomIn=h;this._animationType="zooming";var j=v.getCamera().getCameraRef();var k=new THREE.Vector3();e.getSize(k);var l=new THREE.Vector3();j.getWorldDirection(l);l.multiplyScalar(k.length());var o=new THREE.Vector3();e.getCenter(o);var p=[new THREE.Vector3(e.min.x,e.min.y,e.min.z),new THREE.Vector3(e.max.x,e.max.y,e.max.z),new THREE.Vector3(e.min.x,e.min.y,e.max.z),new THREE.Vector3(e.min.x,e.max.y,e.max.z),new THREE.Vector3(e.max.x,e.min.y,e.max.z),new THREE.Vector3(e.max.x,e.max.y,e.min.z),new THREE.Vector3(e.min.x,e.max.y,e.min.z),new THREE.Vector3(e.max.x,e.min.y,e.min.z)];var r=new THREE.Matrix4(),u=new THREE.Vector3();function w(j){r.multiplyMatrices(j.projectionMatrix,j.matrixWorldInverse);for(var i in p){u.copy(p[i]).applyMatrix4(r);if(u.x<-1.0||u.x>1.0||u.y<-1.0||u.y>1.0){return false;}}return true;}this._newCamera=j.clone();this._newCamera.position.copy(o).sub(l);this._newCamera.updateMatrixWorld(true);if(j.isPerspectiveCamera){while(!w(this._newCamera)){this._newCamera.position.sub(l);this._newCamera.updateMatrixWorld(true);}var x=10;var y=this._newCamera.position.clone();var B=o.clone();for(var C=0;C<x;C++){this._newCamera.position.copy(y).add(B).multiplyScalar(0.5);this._newCamera.updateMatrixWorld(true);if(w(this._newCamera)){y.copy(this._newCamera.position);}else{B.copy(this._newCamera.position);}}this._newCamera.position.copy(y).sub(o).multiplyScalar(m).add(y);this._newCamera.updateMatrixWorld(true);}if(j.isOrthographicCamera){var D=new THREE.Box2();p.forEach(function(i){u=i.project(this._newCamera);D.expandByPoint(new THREE.Vector2(u.x,u.y));}.bind(this));this._newCamera.zoom/=Math.max(D.getSize().x,D.getSize().y)*0.5*(1+m);this._newCamera.updateProjectionMatrix();}this._startTimeForCameraAnimation=Date.now();this._timeIntervalForCameraAnimation=f!==undefined?f:500;};this.prepareForCameraUpdateAnimation=function(){this._oldCamera=v.getCamera().getCameraRef().clone();};this.startAnimatingCameraUpdate=function(e){var f=v.getCamera().getCameraRef();if(!this._oldCamera){return;}var h=0.0001;var n=false;if(f.isOrthographicCamera&&this._oldCamera.isOrthographicCamera){if(Math.abs(f.left-this._oldCamera.left)>h||Math.abs(f.right-this._oldCamera.right)>h||Math.abs(f.top-this._oldCamera.top)>h||Math.abs(f.bottom-this._oldCamera.bottom)>h||Math.abs(f.zoom-this._oldCamera.zoom)>h){n=true;}}else if(f.isPerspectiveCamera&&this._oldCamera.isPerspectiveCamera){if(Math.abs(f.fov-this._oldCamera.fov)>h||Math.abs(f.aspect-this._oldCamera.aspect)>h){n=true;}}if(!n){if(Math.abs(f.position.x-this._oldCamera.position.x)>h||Math.abs(f.position.y-this._oldCamera.position.y)>h||Math.abs(f.position.z-this._oldCamera.position.z)>h||Math.abs(f.scale.x-this._oldCamera.scale.x)>h||Math.abs(f.scale.y-this._oldCamera.scale.y)>h||Math.abs(f.scale.z-this._oldCamera.scale.z)>h||Math.abs(f.quaternion.x-this._oldCamera.quaternion.x)>h||Math.abs(f.quaternion.y-this._oldCamera.quaternion.y)>h||Math.abs(f.quaternion.z-this._oldCamera.quaternion.z)>h||Math.abs(f.quaternion.w-this._oldCamera.quaternion.w)>h){n=true;}}if(!n){v.cameraUpdateCompleted({position:f.position.toArray(),quaternion:f.quaternion.toArray()});return;}this._newCamera=v.getCamera().getCameraRef().clone();this._timeIntervalForCameraAnimation=e!==undefined?e:500;this._startTimeForCameraAnimation=Date.now();};};this._cameraController=new T(v);}});function a(b){var m=b;var i=m[15]===1;var r=2/m[0];var c=2/m[5];var d,e;if(i){d=-m[12]*r;e=-m[13]*c;}else{d=m[8]*r;e=m[9]*c;}var f=(r+d)*0.5;var l=d-f;var h=(c+e)*0.5;var j=e-h;return{left:l,top:h,right:f,bottom:j};}function s(b,r){var m=b;var i=m[15]===1;m[0]=2/(r.right-r.left);m[5]=2/(r.top-r.bottom);if(i){m[12]=-(r.right+r.left)/(r.right-r.left);m[13]=-(r.top+r.bottom)/(r.top-r.bottom);}else{m[8]=(r.right+r.left)/(r.right-r.left);m[9]=(r.top+r.bottom)/(r.top-r.bottom);}}V.prototype._activateRedline=function(){var c=this._viewport.getCamera().getCameraRef();this._matProj=c.projectionMatrix.elements;};V.prototype._deactivateRedline=function(){this._matProj=null;};V.prototype.destroy=function(){this._viewport=null;this._rect=null;this._evt=null;this._gesture=false;};V.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};V.prototype._inside=function(e){if(this._rect===null||true){var i=this._viewport.getIdForLabel();var d=document.getElementById(i);if(!d){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};}return(e.x>=this._rect.x&&e.x<=this._rect.x+this._rect.w&&e.y>=this._rect.y&&e.y<=this._rect.y+this._rect.h);};V.prototype._onresize=function(e){this._gesture=false;this._rect=null;};V.prototype.beginGesture=function(b){if(this._inside(b)&&!this._gesture){this._gesture=true;var x=b.x-this._rect.x,y=b.y-this._rect.y;this._evt.x=x;this._evt.y=y;this._evt.d=b.d;this._evt.initd=b.d;this._evt.avgd=b.d;this._evt.avgx=0;this._evt.avgy=0;q.sap.log.debug("Loco: beginGesture: "+x+", "+y);this._cameraController.beginGesture(x,y);b.handled=true;if(document.activeElement){try{document.activeElement.blur();}catch(e){}}var d=document.getElementById(this._viewport.getIdForLabel());d.focus();}this._nomenu=false;};V.prototype.move=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;var d=x-this._evt.x;var b=y-this._evt.y;var c=e.d-this._evt.d;this._evt.x=x;this._evt.y=y;this._evt.d=e.d;this._evt.avgx=this._evt.avgx*0.99+d*0.01;this._evt.avgy=this._evt.avgy*0.99+b*0.01;var z=1.0;if(this._evt.initd>0){z=1.0+c*(1.0/this._evt.initd);}else if(e.n===2){if(e.points[0].y>e.points[1].y){z=1.0-c*0.005;if(z<0.333){z=0.333;}}else{z=1.0+c*0.005;if(z>3){z=3;}}}if(this._evt.initd>0){var f=Math.sqrt(this._evt.avgx*this._evt.avgx+this._evt.avgy*this._evt.avgy);q.sap.log.debug("AvgDist: "+f);if((Math.abs(e.d-this._evt.avgd)/this._evt.avgd)<(f/10)){z=1.0;}}this._evt.avgd=this._evt.avgd*0.97+e.d*0.03;switch(e.n){case 1:q.sap.log.debug("Loco: Rotate: "+(d)+", "+(b));this._cameraController.rotate(d,b);break;case 2:q.sap.log.debug("Loco: Pan: "+(d)+", "+(b));if(z!=0&&z!=1.0){q.sap.log.debug("Loco: Zoom: "+(z));}this._cameraController.pan(d,b);if(d<10&&b<10&&z!=0&&z!=1.0){this._cameraController.zoom(z);}break;default:break;}this._nomenu=true;e.handled=true;}};V.prototype.endGesture=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: endGesture: "+x+", "+y);this._cameraController.endGesture();this._gesture=false;e.handled=true;}};V.prototype.click=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: click: "+(x)+", "+(y));if(this._viewport){this._viewport.tap(x,y,false);}e.handled=true;}};V.prototype.doubleClick=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: doubleClick: "+(x)+", "+(y));if(this._viewport){this._viewport.tap(x,y,true);}e.handled=true;}};V.prototype.contextMenu=function(e){if(this._inside(e)||this._nomenu||e.buttons===5){this._nomenu=false;e.handled=true;}};V.prototype.keyEventHandler=function(e){};V.prototype.getViewport=function(){return this._viewport;};V.prototype.activateCamera=function(c,b){this._cameraController.prepareForCameraUpdateAnimation();if(this._viewport.getCamera().getCameraRef().isPerspectiveCamera!=c.isPerspectiveCamera){this._viewport.setCamera(c.isPerspectiveCamera?new P():new O());}this._viewport.getCamera().getCameraRef().copy(c);var d=this._viewport.getRenderer().getSize();this._viewport.getCamera().update(d.width,d.height);this._cameraController.startAnimatingCameraUpdate(b);return this;};V.prototype.setView=function(b,c){this._cameraController.prepareForCameraUpdateAnimation();var d=this._viewport.getCamera().getCameraRef();if(b){d.quaternion.copy(b);d.updateMatrixWorld();d.up.setFromMatrixColumn(d.matrixWorld,1).normalize();this._cameraController.zoomObject(null,false,c);}else{d.copy(this._viewport._homeCamera?this._viewport._homeCamera:new P().getCameraRef());var e=this._viewport.getRenderer().getSize();this._viewport.getCamera().update(e.width,e.height);this._cameraController.startAnimatingCameraUpdate(c);}return this;};V.prototype.zoomTo=function(b,c,m,d,n,i){this._cameraController.prepareForCameraUpdateAnimation();if(c){var e=this._viewport.getCamera().getCameraRef();e.quaternion.copy(c);e.updateMatrixWorld();e.up.setFromMatrixColumn(e.matrixWorld,1).normalize();}this._cameraController.zoomBox(b,m,d,n,i);return this;};V.prototype.zoomObject=function(n,i,b){this._cameraController.prepareForCameraUpdateAnimation();this._cameraController.zoomObject(n,i,b);return this;};V.prototype.animateCameraUpdate=function(){this._cameraController.animateCameraUpdate();};V.prototype.prepareForCameraUpdateAnimation=function(){this._cameraController.prepareForCameraUpdateAnimation();};V.prototype.startAnimatingCameraUpdate=function(b){this._cameraController.startAnimatingCameraUpdate(b);};return V;});
