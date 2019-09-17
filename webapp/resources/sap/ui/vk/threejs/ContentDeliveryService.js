/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/
sap.ui.define(["jquery.sap.global","sap/ui/base/ManagedObject","../NS","../totara/TotaraLoader","./Material","./thirdparty/three","../getResourceBundle","../ObjectType"],function(q,M,N,T,a,t,g,O){"use strict";var C=M.extend(N.getName("threejs.ContentDeliveryService"),{metadata:{properties:{authorizationHandler:"any"},events:{cameraChanged:{parameters:{sceneId:{type:"string"},camera:{type:"any"}},enableEventBubbling:true},sceneUpdated:{parameters:{},enableEventBubbling:true},viewGroupUpdated:{parameters:{},enableEventBubbling:true},sceneCompleted:{parameters:{sceneId:{type:"string"}},enableEventBubbling:true},errorReported:{parameters:{error:{type:"any"}}}}}});var b=C.getMetadata().getParent().getClass().prototype;C.prototype.init=function(){if(b.init){b.init.call(this);}this._loader=null;this._transientSceneMap=new Map();this._currentNodeHierarchy=null;};C.prototype.initUrl=function(u,k){var c=this;function n(){c.fireSceneUpdated({});}function d(){c.fireViewGroupUpdated({});}if(!c._loader||c._loader.getUrl()!==u){this._loader=new T();var s=this._loader.getState();s.onErrorCallbacks.attach(this._reportError.bind(c));s.onMaterialFinishedCallbacks.attach(n);s.onImageFinishedCallbacks.attach(n);s.onSetGeometryCallbacks.attach(n);s.onViewGroupUpdatedCallbacks.attach(d);return this._loader.init(u);}else if(!k){var e=this._loader.getState();if(e){e.cleanup();}}return Promise.resolve("Loader is ready");};C.prototype._reportError=function(e){this.fireErrorReported(e);};C.prototype._createLoadParam=function(r,c,p,d){var e=this;var i;var s=false;var f;if(this._currentNodeHierarchy){f=this._currentNodeHierarchy.getScene();}var h={root:p,includeHidden:d.getIncludeHidden(),includeAnimation:d.getIncludeAnimation(),pushPMI:d.getPushPMI(),metadataFilter:d.getMetadataFilter(),useSecureConnection:d.getUseSecureConnection(),activateView:d.getActivateView(),enableLogger:d.getEnableLogger()===true,pushViewGroups:d.getPushViewGroups(),vkScene:f,onActiveCamera:function(n){var k=false;var l=e._loader.getState();if(l){var m=l.contextMap.get(d.getVeid());if(m&&m.phase<2){i=n;k=true;}}if(!k){e.fireCameraChanged({sceneId:d.getVeid(),camera:n});}},onInitialSceneFinished:function(k){s=true;r({node:p,camera:i,contentResource:d,initialView:k,loader:e});},onSceneCompleted:function(){e.fireSceneCompleted({sceneId:d.getVeid()});}};var j=function(k){var l;if(k.getParameter("errorText")){l=k.getParameter("errorText");}else if(k.getParameter("error")){l=k.getParameter("error");}else if(k.getParameter("reason")){l=k.getParameter("reason");}else{l="failed to load: unknown reason";}if(s){var m=k.getParameter("error");if(m&&m===4){e.initUrl(this._loader.getUrl(),true);}}else{e.detachErrorReported(j);if(k.getParameter("events")){l=l+"\n"+JSON.stringify(k.getParameter("events"));}c(l);}};e.attachErrorReported(j);return h;};C.prototype.load=function(p,c,d){var e=this;var n=c.getNodeProxy();if(n){this._currentNodeHierarchy=n.getNodeHierarchy();}return new Promise(function(r,f){if(!c.getSource()||!c.getVeid()){f(g().getText("CONTENTDELIVERYSERVICE_MSG_NOURLORVEID"));return;}e.initUrl(c.getSource(),true);var h=e._createLoadParam(r,f,p,c);if(e._loader){e._loader.request(c.getVeid(),h,d);}});};C.prototype.getState=function(){if(this._loader){return this._loader.getState();}return null;};C.prototype.getSceneBuilder=function(){if(this._loader){return this._loader.getSceneBuilder();}return null;};C.prototype.decrementResourceCountersForDeletedTreeNode=function(s){var c=this.getState();if(c){var d=c.getContext(c.currentSceneInfo.id);this._loader.decrementResourceCountersForDeletedTreeNode(c,d,s);}};C.prototype.loadTransientScene=function(s,p,u){var c=this;return new Promise(function(r,d){if(!s||!p){d(g().getText("CONTENTDELIVERYSERVICE_MSG_INVALIDARGUMENTS"));return;}if(c._transientSceneMap.has(s)){var e=c._transientSceneMap.get(s).clone();p.add(e);r({nodeRef:e});return;}if(!c._loader){d(g().getText("CONTENTDELIVERYSERVICE_MSG_CONTENTDELIVERYSERVICENOTINITIALISED"));return;}var f=new THREE.Object3D();f.name="transient";var o=function(){var i=c._loader.getState().getContext(s);i.onSceneCompletedCallbacks.detach(o);c._transientSceneMap.set(s,f);var e=f.clone();p.add(e);r({nodeRef:e});};var h={root:f,onSceneCompleted:o,useSecureConnection:u};c._loader.request(s,h);});};C.prototype.update=function(s,c,v){var d=this;return new Promise(function(r,e){if(!d._loader){e(g().getText("CONTENTDELIVERYSERVICE_MSG_CONTENTDELIVERYSERVICENOTINITIALISED"));return;}d._loader.update(s,c,v).then(function(f){if(d._currentNodeHierarchy){for(var i=0;i<f.replacedNodeRefs.length;i++){d._currentNodeHierarchy.fireNodeReplaced({ReplacedNodeRef:f.replacedNodeRefs[i],ReplacementNodeRef:f.replacementNodeRefs[i],ReplacedNodeId:f.replacedNodeRefs[i],ReplacementNodeId:f.replacementNodeRefs[i]});}}r({sceneVeId:f.sceneVeId,sids:f.sidArray});}).catch(function(f){return e(f);});});};C.prototype.exit=function(){if(b.exit){b.exit.call(this);}if(this._loader){this._loader.dispose();this._loader=null;}this._transientSceneMap=null;};C.prototype.loadView=function(s,v,c){if(typeof c==="undefined"){c="static";}var d=this;return this._loader.requestView(s,c,v).then(function(e){if(d._currentNodeHierarchy&&e.updatedNodes){for(var i=0;i<e.updatedNodes.length;i++){d._currentNodeHierarchy.fireNodeUpdated({nodeRef:e.updatedNodes[i]});}}d.fireSceneUpdated({});return e;}).catch(function(e){q.sap.log.error(e);return null;});};C.prototype.updatePlaybacks=function(s,v,p){var c=this;return this._loader.requestView(s,"static",v,p).then(function(d){if(c._currentNodeHierarchy&&d.updatedNodes){for(var i=0;i<d.updatedNodes.length;i++){c._currentNodeHierarchy.fireNodeUpdated({nodeRef:d.updatedNodes[i]});}}c.fireSceneUpdated({});return d;}).catch(function(e){q.sap.log.error(e);return null;});};C.prototype.loadViewGroup=function(s,v){var c=this;return this._loader.requestViewGroup(s,v).then(function(d){c.fireSceneUpdated({});return d;}).catch(function(e){q.sap.log.error(e);return null;});};C.prototype.assignMaterialToNodes=function(s,m,n,c){var d=this;return this._loader.requestMaterial(m).then(function(e){function f(e,l,r){if(!l){return;}if(l.userData.markedForNotAssigningMaterial){delete l.userData.markedForNotAssigningMaterial;return;}if(d._currentNodeHierarchy){var o=d._currentNodeHierarchy.createNodeProxy(l);var p=new a();p.setMaterialRef(e);o.assignMaterial(p);d._currentNodeHierarchy.destroyNodeProxy(o);}if(r){l.children.forEach(function(u){if(!u||u.userData.objectType===O.PMI||u.userData.objectType===O.Hotspot){return;}f(e,u,r);});}}if(!c){for(var i=0;i<n.length;i++){f(e,n[i],true);}}else{for(var j=0;j<n.length;j++){n[j].userData.markedForNotAssigningMaterial=true;}var h=d._loader.getState().contextMap.get(s);var k=h.root;f(e,k,true);}d.fireSceneUpdated({});return true;}).catch(function(e){q.sap.log.error(e);return false;});};C.prototype.printLogTokens=function(){if(this._loader){this._loader.printLogTokens();return true;}else{return false;}};return C;});
