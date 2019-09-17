
THREE.OrbitControls=function(o,d){this.object=o;this.domElement=(d!==undefined)?d:document;this.enabled=true;this.target=new THREE.Vector3();this.minDistance=0;this.maxDistance=Infinity;this.minZoom=0;this.maxZoom=Infinity;this.minPolarAngle=0;this.maxPolarAngle=Math.PI;this.minAzimuthAngle=-Infinity;this.maxAzimuthAngle=Infinity;this.enableDamping=false;this.dampingFactor=0.25;this.enableZoom=true;this.zoomSpeed=1.0;this.enableRotate=true;this.rotateSpeed=1.0;this.enablePan=true;this.keyPanSpeed=7.0;this.keyRotateSpeed=9.0;this.autoRotate=false;this.autoRotateSpeed=2.0;this.enableKeys=true;this.keys={LEFT:37,UP:38,RIGHT:39,DOWN:40,PLUS:187,MINUS:189,NUMPLUS:107,NUMMINUS:109};this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT};this.target0=this.target.clone();this.position0=this.object.position.clone();this.zoom0=this.object.zoom;this.getPolarAngle=function(){return f.phi;};this.getAzimuthalAngle=function(){return f.theta;};this.saveState=function(){var b={};b.target=s.target.clone();b.position=s.object.position.clone();b.zoom=s.object.zoom;return b;};this.reset=function(b){if(b){s.target.copy(b.target);s.object.position.copy(b.position);s.object.zoom=b.zoom;s.object.updateProjectionMatrix();s.dispatchEvent(c);s.update();b=S.NONE;}};this.update=function(v){var f1=new THREE.Vector3();var g1=new THREE.Quaternion().setFromUnitVectors(o.up,new THREE.Vector3(0,1,0));var h1=g1.clone().inverse();var i1=new THREE.Vector3();var j1=new THREE.Quaternion();return function update(v){var k1=s.object.position;f1.copy(k1).sub(s.target);f1.applyQuaternion(g1);f.setFromVector3(f1);if(s.autoRotate&&b===S.NONE){x(u());}f.theta+=g.theta;f.phi+=g.phi;f.theta=Math.max(s.minAzimuthAngle,Math.min(s.maxAzimuthAngle,f.theta));f.phi=Math.max(s.minPolarAngle,Math.min(s.maxPolarAngle,f.phi));f.makeSafe();f.radius*=h;f.radius=Math.max(s.minDistance,Math.min(s.maxDistance,f.radius));s.target.add(p);f1.setFromSpherical(f);f1.applyQuaternion(h1);k1.copy(s.target).add(f1);s.object.lookAt(s.target);if(s.enableDamping===true){g.theta*=(1-s.dampingFactor);g.phi*=(1-s.dampingFactor);}else{g.set(0,0,0);}h=1;p.set(0,0,0);if(z||i1.distanceToSquared(s.object.position)>E||8*(1-j1.dot(s.object.quaternion))>E){c.tag=v;s.dispatchEvent(c);delete c.tag;i1.copy(s.object.position);j1.copy(s.object.quaternion);z=false;return true;}return false;};}();this.dispose=function(){s.domElement.removeEventListener('contextmenu',e1,false);s.domElement.removeEventListener('mousedown',Y,false);s.domElement.removeEventListener('wheel',_,false);s.domElement.removeEventListener('touchstart',b1,false);s.domElement.removeEventListener('touchend',d1,false);s.domElement.removeEventListener('touchmove',c1,false);document.removeEventListener('mousemove',Z,false);document.removeEventListener('mouseup',$,false);window.removeEventListener('keydown',a1,false);};var s=this;var c={type:'change'};var a={type:'start'};var e={type:'end'};var S={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5};var b=S.NONE;var E=0.000001;var f=new THREE.Spherical();var g=new THREE.Spherical();var h=1;var p=new THREE.Vector3();var z=false;var r=new THREE.Vector2();var i=new THREE.Vector2();var j=new THREE.Vector2();var k=new THREE.Vector2();var l=new THREE.Vector2();var m=new THREE.Vector2();var n=new THREE.Vector2();var q=new THREE.Vector2();var t=new THREE.Vector2();function u(){return 2*Math.PI/60/60*s.autoRotateSpeed;}function w(){return Math.pow(0.95,s.zoomSpeed);}function x(v){g.theta-=v;}function y(v){g.phi-=v;}var A=function(){var v=new THREE.Vector3();return function A(f1,g1){v.setFromMatrixColumn(g1,0);v.multiplyScalar(-f1);p.add(v);};}();var B=function(){var v=new THREE.Vector3();return function B(f1,g1){v.setFromMatrixColumn(g1,1);v.multiplyScalar(f1);p.add(v);};}();var C=function(){var v=new THREE.Vector3();var f1=s.domElement===document?s.domElement.body:s.domElement;return function C(g1,h1){if(s.object.isPerspectiveCamera){var i1=s.object.position;v.copy(i1).sub(s.target);var j1=v.length();j1*=Math.tan((s.object.fov/2)*Math.PI/180.0);A(2*g1*j1/f1.clientHeight,s.object.matrix);B(2*h1*j1/f1.clientHeight,s.object.matrix);}else if(s.object.isOrthographicCamera){A(g1*(s.object.right-s.object.left)/s.object.zoom/f1.clientWidth,s.object.matrix);B(h1*(s.object.top-s.object.bottom)/s.object.zoom/f1.clientHeight,s.object.matrix);}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');s.enablePan=false;}};}();var D=function(){var v=s.domElement===document?s.domElement.body:s.domElement;return function D(f1,g1){x(2*Math.PI*f1/v.clientWidth*s.rotateSpeed);y(2*Math.PI*g1/v.clientHeight*s.rotateSpeed);};}();function F(v){if(s.object.isPerspectiveCamera){h/=v;}else if(s.object.isOrthographicCamera){s.object.zoom=Math.max(s.minZoom,Math.min(s.maxZoom,s.object.zoom*v));s.object.updateProjectionMatrix();z=true;}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');s.enableZoom=false;}}function G(v){if(s.object.isPerspectiveCamera){h*=v;}else if(s.object.isOrthographicCamera){s.object.zoom=Math.max(s.minZoom,Math.min(s.maxZoom,s.object.zoom/v));s.object.updateProjectionMatrix();z=true;}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');s.enableZoom=false;}}function H(v){r.set(v.clientX,v.clientY);}function I(v){n.set(v.clientX,v.clientY);}function J(v){k.set(v.clientX,v.clientY);}function K(v){i.set(v.clientX,v.clientY);j.subVectors(i,r);var f1=s.domElement===document?s.domElement.body:s.domElement;x(2*Math.PI*j.x/f1.clientWidth*s.rotateSpeed);y(2*Math.PI*j.y/f1.clientHeight*s.rotateSpeed);r.copy(i);s.update();}function L(v){q.set(v.clientX,v.clientY);t.subVectors(q,n);if(t.y>0){F(w());}else if(t.y<0){G(w());}n.copy(q);s.update();}function M(v){l.set(v.clientX,v.clientY);m.subVectors(l,k);C(m.x,m.y);k.copy(l);s.update();}function N(v){}function O(v){if(v.deltaY<0){G(w());s.update(s.keys.PLUS);}else if(v.deltaY>0){F(w());s.update(s.keys.MINUS);}}function P(v){switch(v.keyCode){case s.keys.UP:if(v.shiftKey){if(s.enableRotate){D(0,s.keyRotateSpeed);}}else if(s.enablePan){C(0,s.keyPanSpeed);}s.update(s.keys.UP);break;case s.keys.DOWN:if(v.shiftKey){if(s.enableRotate){D(0,-s.keyRotateSpeed);}}else if(s.enablePan){C(0,-s.keyPanSpeed);}s.update(s.keys.DOWN);break;case s.keys.LEFT:if(v.shiftKey){if(s.enableRotate){D(s.keyRotateSpeed,0);}}else if(s.enablePan){C(s.keyPanSpeed,0);}s.update(s.keys.LEFT);break;case s.keys.RIGHT:if(v.shiftKey){if(s.enableRotate){D(-s.keyRotateSpeed,0);}}else if(s.enablePan){C(-s.keyPanSpeed,0);}s.update(s.keys.RIGHT);break;case s.keys.MINUS:case s.keys.NUMMINUS:if(s.enableZoom){F(w());}s.update(s.keys.MINUS);break;case s.keys.PLUS:case s.keys.NUMPLUS:if(s.enableZoom){G(w());}s.update(s.keys.PLUS);break;}}function Q(v){r.set(v.touches[0].pageX,v.touches[0].pageY);}function R(v){var dx=v.touches[0].pageX-v.touches[1].pageX;var dy=v.touches[0].pageY-v.touches[1].pageY;var f1=Math.sqrt(dx*dx+dy*dy);n.set(0,f1);}function T(v){k.set(v.touches[0].pageX,v.touches[0].pageY);}function U(v){i.set(v.touches[0].pageX,v.touches[0].pageY);j.subVectors(i,r);var f1=s.domElement===document?s.domElement.body:s.domElement;x(2*Math.PI*j.x/f1.clientWidth*s.rotateSpeed);y(2*Math.PI*j.y/f1.clientHeight*s.rotateSpeed);r.copy(i);s.update();}function V(v){var dx=v.touches[0].pageX-v.touches[1].pageX;var dy=v.touches[0].pageY-v.touches[1].pageY;var f1=Math.sqrt(dx*dx+dy*dy);q.set(0,f1);t.subVectors(q,n);if(t.y>0){G(w());}else if(t.y<0){F(w());}n.copy(q);s.update();}function W(v){l.set(v.touches[0].pageX,v.touches[0].pageY);m.subVectors(l,k);C(m.x,m.y);k.copy(l);s.update();}function X(v){}function Y(v){if(s.enabled===false){return;}switch(v.button){case s.mouseButtons.ORBIT:if(s.enableRotate===false){return;}H(v);b=S.ROTATE;break;case s.mouseButtons.ZOOM:if(s.enableZoom===false){return;}I(v);b=S.DOLLY;break;case s.mouseButtons.PAN:if(s.enablePan===false){return;}J(v);b=S.PAN;break;}if(b!==S.NONE){document.addEventListener('mousemove',Z,false);document.addEventListener('mouseup',$,false);s.dispatchEvent(a);}}function Z(v){if(s.enabled===false){return;}switch(b){case S.ROTATE:if(s.enableRotate===false){return;}K(v);v.preventDefault();break;case S.DOLLY:if(s.enableZoom===false){return;}L(v);v.preventDefault();break;case S.PAN:if(s.enablePan===false){return;}M(v);v.preventDefault();break;}}function $(v){if(s.enabled===false){return;}N(v);document.removeEventListener('mousemove',Z,false);document.removeEventListener('mouseup',$,false);s.dispatchEvent(e);b=S.NONE;}function _(v){if(s.enabled===false||s.enableZoom===false||(b!==S.NONE&&b!==S.ROTATE)){return;}v.preventDefault();v.stopPropagation();O(v);s.dispatchEvent(a);s.dispatchEvent(e);}function a1(v){if(s.enabled===false||s.enableKeys===false||s.enablePan===false){return;}P(v);}function b1(v){if(s.enabled===false){return;}switch(v.touches.length){case 1:if(s.enableRotate===false){return;}Q(v);b=S.TOUCH_ROTATE;break;case 2:if(s.enableZoom===false){return;}R(v);b=S.TOUCH_DOLLY;break;case 3:if(s.enablePan===false){return;}T(v);b=S.TOUCH_PAN;break;default:b=S.NONE;}if(b!==S.NONE){s.dispatchEvent(a);}}function c1(v){if(s.enabled===false){return;}v.preventDefault();v.stopPropagation();switch(v.touches.length){case 1:if(s.enableRotate===false){return;}if(b!==S.TOUCH_ROTATE){return;}U(v);break;case 2:if(s.enableZoom===false){return;}if(b!==S.TOUCH_DOLLY){return;}V(v);break;case 3:if(s.enablePan===false){return;}if(b!==S.TOUCH_PAN){return;}W(v);break;default:b=S.NONE;}}function d1(v){if(s.enabled===false){return;}X(v);s.dispatchEvent(e);b=S.NONE;}function e1(v){if(s.enabled===false){return;}v.preventDefault();}s.domElement.addEventListener('contextmenu',e1,false);s.domElement.addEventListener('mousedown',Y,false);s.domElement.addEventListener('wheel',_,false);s.domElement.addEventListener('touchstart',b1,false);s.domElement.addEventListener('touchend',d1,false);s.domElement.addEventListener('touchmove',c1,false);s.domElement.addEventListener('keydown',a1,false);this.update();};
THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype);THREE.OrbitControls.prototype.constructor=THREE.OrbitControls;Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){console.warn('THREE.OrbitControls: .center has been renamed to .target');return this.target;}},noZoom:{get:function(){console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');return!this.enableZoom;},set:function(v){console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');this.enableZoom=!v;}},noRotate:{get:function(){console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');return!this.enableRotate;},set:function(v){console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');this.enableRotate=!v;}},noPan:{get:function(){console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');return!this.enablePan;},set:function(v){console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');this.enablePan=!v;}},noKeys:{get:function(){console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');return!this.enableKeys;},set:function(v){console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');this.enableKeys=!v;}},staticMoving:{get:function(){console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');return!this.enableDamping;},set:function(v){console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');this.enableDamping=!v;}},dynamicDampingFactor:{get:function(){console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');return this.dampingFactor;},set:function(v){console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');this.dampingFactor=v;}}});
