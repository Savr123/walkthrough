/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","./thirdparty/three","../NS","../ContentManager","./Scene","../TransformationMatrix","./PerspectiveCamera","./OrthographicCamera","../Messages","../getResourceBundle","./ContentDeliveryService","./Viewport","./ViewStateManager"],function(L,t,N,C,S,T,P,O,M,g,a){"use strict";var b=C.extend(N.getName("threejs.ContentManager"),{metadata:{library:N.getName()}});var c=b.getMetadata().getParent().getClass().prototype;b.prototype.init=function(){if(c.init){c.init.call(this);}};b.prototype.exit=function(){if(this.defaultCdsLoader){this.defaultCdsLoader.destroy();this.defaultCdsLoader=null;}if(c.exit){c.exit.call(this);}};function s(o){if(o&&o.isMesh){o.castShadow=true;o.receiveShadow=false;}if(o&&o.children){for(var n=0;n<o.children.length;n++){s(o.children[n]);}}}function e(n,f){if(n){var h=new THREE.Group();n.add(h);h.name="DefaultLights";h.private=true;var i=new THREE.Box3().setFromObject(n);var j=new THREE.Vector3();i.getSize(j);var m=j.length();var p=new THREE.PointLight();p.color.copy(new THREE.Color(0.72,0.72,0.81));i.getCenter(p.position);p.visible=true;p.private=true;h.add(p);var k=[new THREE.Color(0.2,0.2,0.2),new THREE.Color(0.32,0.32,0.36),new THREE.Color(0.36,0.36,0.36)];var o=[new THREE.Vector3(2.0,1.5,0.5),new THREE.Vector3(-2.0,-1.1,2.5),new THREE.Vector3(-0.04,-0.01,-2.0)];for(var l=0,q=k.length;l<q;l++){var r=new THREE.DirectionalLight();r.color.copy(k[l]);r.position.copy(o[l]);r.private=true;h.add(r);}if(f){s(n);var u=new THREE.DirectionalLight();u.color.copy(new THREE.Color(0.5,0.5,0.5));u.position.copy(new THREE.Vector3(0,1.0,0));u.castShadow=true;u.shadow.mapSize.width=512;u.shadow.mapSize.height=512;var d=2000;u.shadow.camera.left=-d;u.shadow.camera.right=d;u.shadow.camera.top=d;u.shadow.camera.bottom=-d;u.shadow.camera.far=3500;u.shadow.bias=-0.0001;u.private=true;h.add(u);var v=new THREE.PlaneBufferGeometry(i.getSize().x,i.getSize().z);var w=new THREE.ShadowMaterial();w.opacity=0.2;var x=new THREE.Mesh(v,w);x.rotation.x=-Math.PI/2;x.position.x=i.getCenter().x;x.position.y=i.min.y-m*0.1;x.position.z=i.getCenter().z;n.add(x);x.receiveShadow=true;}}}b.prototype.loadContent=function(d,f){var h=this;var l=function(){h.fireContentChangesStarted();var j=new THREE.Scene(),k=new S(j);h._loadContentResources(k,f).then(function(v){if(v&&v.length>0&&v[0].initialView){k.setInitialView(v[0].initialView);}for(var n=0;n<v.length;n++){if(v[n].camera){k.camera=v[n].camera;break;}}if(v.length>0){var m=v[0];k.backgroundTopColor=m.backgroundTopColor;k.backgroundBottomColor=m.backgroundBottomColor;k.renderMode=m.renderMode;}for(var i=0;i<v.length;i++){if(v[i].loader){k.loaders=k.loaders||[];k.loaders.push(v[i].loader);}if(v[i].builder){k.builders=k.builders||[];k.builders.push(v[i].builder);}}if(k.loaders){h._initSceneWithCDSLoaderIfExists(k,k.loaders);}e(k.getSceneRef(),false);h.fireContentChangesFinished({content:k});},function(r){var i=typeof r==="string"?r:r.errorText;if(i==null){i=g().getText(M.VIT37.summary);}L.error(g().getText("CONTENTMANAGER_MSG_CONTENTRESOURCESFAILEDTOLOAD"),i);h.fireContentChangesFinished({content:null,failureReason:[{error:r,errorMessage:i}]});});};l();return this;};b.prototype._findLoader=function(d){if(d._contentManagerResolver&&d._contentManagerResolver.settings&&d._contentManagerResolver.settings.loader){return Promise.resolve(d._contentManagerResolver.settings.loader);}if(d.getSource()){var f=d.getSourceType();if(f==="stream"){if(this.defaultCdsLoader==null){var h=this;return new Promise(function(r){var i=N.getPath("threejs/ContentDeliveryService");sap.ui.require([i],function(j){r(h.defaultCdsLoader=new j({authorizationHandler:h._authorizationHandler}));});});}return Promise.resolve(this.defaultCdsLoader);}}return Promise.resolve(null);};b.prototype._loadContentResources=function(d,f){var p=[];f.forEach(function loadContentResource(h,i){var n=new THREE.Group();n.name=i.getName();n.sourceId=i.getSourceId();i._shadowContentResource={nodeProxy:d.getDefaultNodeHierarchy().createNodeProxy(n)};var l=i.getLocalMatrix();if(l){n.applyMatrix(new THREE.Matrix4().fromArray(T.convertTo4x4(l)));}h.add(n);var j=this;p.push(this._findLoader(i).then(function(k){if(typeof k==="function"){return k(n,i,j._authorizationHandler);}else if(k&&k.load){return k.load(n,i,j._authorizationHandler);}else{return Promise.resolve({node:n,contentResource:i});}}));i.getContentResources().forEach(loadContentResource.bind(this,n));}.bind(this,d.getSceneRef()));return Promise.all(p);};b.prototype._initSceneWithCDSLoaderIfExists=function(d,l){var f;if(l){for(var i=0;i<l.length;i++){if(l[i]instanceof a){f=l[i];break;}}if(f){d._setState(f.getState());d.getDefaultNodeHierarchy().attachNodeRemoving(function(h){var r=h.getParameter("nodeRef");if(r.userData&&r.userData.treeNode&&r.userData.treeNode.sid){f.decrementResourceCountersForDeletedTreeNode(r.userData.treeNode.sid);}});return true;}}return false;};b.prototype.createOrthographicCamera=function(){return new O();};b.prototype.createPerspectiveCamera=function(){return new P();};return b;});
