/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/ManagedObjectObserver","sap/ui/core/Element","./NS","./Messages","./Core","./getResourceBundle","./ContentResource"],function(q,M,E,N,a,v,g,C){"use strict";var l=q.sap.log;var b=E.extend(N.getName("ContentConnector"),{metadata:{library:N.getName(),aggregations:{contentResources:{type:N.getName("ContentResource"),bindable:"bindable"},viewStateManagers:{type:N.getName("ViewStateManager")},contentManagers:{type:N.getName("ContentManager"),visibility:"hidden"}},defaultAggregation:"contentResources",events:{contentChangesStarted:{parameters:{}},contentChangesFinished:{parameters:{content:{type:"any"},failureReason:{type:"any"}}},contentChangesProgress:{parameters:{phase:{type:"string"},percentage:{type:"float"},source:{type:"any"}}},contentReplaced:{parameters:{newContent:{type:"any"},oldContent:{type:"any"}}},contentDestroying:{parameters:{content:{type:"any"},preventGarbageCollection:{type:"function"}}}}}});v.registerClass(b);var c=b.getMetadata().getParent().getClass().prototype;b.prototype.isTreeBinding=function(n){return n==="contentResources";};b.prototype.init=function(){if(c.init){c.init.call(this);}this._inLoading=false;this._delayContentResourcesUpdate=false;this._scheduleContentResourcesUpdateTimerId=null;this._content=null;this._contentManager=null;this._decryptionHandler=null;this._authorizationHandler=null;this._selfObserver=new M(this._observeChanges.bind(this));this._selfObserver.observe(this,{aggregations:["contentResources","viewStateManagers"]});};b.prototype.exit=function(){this._selfObserver.disconnect();this._selfObserver=null;if(this._scheduleContentResourcesUpdateTimerId){q.sap.clearDelayedCall(this._scheduleContentResourcesUpdateTimerId);this._scheduleContentResourcesUpdateTimerId=null;}this._delayContentResourcesUpdate=false;this._setContent(null,null);if(c.exit){c.exit.call(this);}};b.prototype._observeChanges=function(e){if(e.name==="contentResources"){this._scheduleContentResourcesUpdate();}else if(e.name==="viewStateManagers"){if(e.mutation==="insert"){e.child.setContentConnector(this);}else if(e.mutation==="remove"){e.child.setContentConnector(null);}}};b.prototype.invalidate=function(o){if(o instanceof C){this._scheduleContentResourcesUpdate();return;}c.invalidate.apply(this,arguments);};b.prototype._scheduleContentResourcesUpdate=function(){if(this._inLoading){this._delayContentResourcesUpdate=true;return this;}if(!this._scheduleContentResourcesUpdateTimerId){this._scheduleContentResourcesUpdateTimerId=q.sap.delayedCall(0,this,function(){this._scheduleContentResourcesUpdateTimerId=null;var e=this.getContentResources();if(e.length>0){this._collectContentResourceSourceTypeInformation(e).then(function(i){if(i.dimensions.length>1){q.sap.delayedCall(0,this,function(){this.fireContentChangesStarted();this._setContent(null,null);this.fireContentChangesFinished({content:null,failureReason:{errorMessage:g().getText(a.VIT17.cause)}});l.error(g().getText(a.VIT17.summary),a.VIT17.code,"sap.ui.vk.ContentConnector");});}else if(i.contentManagerClassNames.length>1){q.sap.delayedCall(0,this,function(){this.fireContentChangesStarted();this._setContent(null,null);this.fireContentChangesFinished({content:null,failureReason:{errorMessage:g().getText(a.VIT35.cause)}});l.error(g().getText(a.VIT35.summary),a.VIT35.code,"sap.ui.vk.ContentConnector");});}else if(i.contentManagerClassNames.length===0){q.sap.delayedCall(0,this,function(){this.fireContentChangesStarted();this._setContent(null,null);this.fireContentChangesFinished({content:null,failureReason:{errorMessage:g().getText(a.VIT36.cause)}});l.error(g().getText(a.VIT36.summary),a.VIT36.code,"sap.ui.vk.ContentConnector");});}else if(i.contentManagerClassNames.length===1){var t=this;this._getContentManagerByClassName(i.contentManagerClassNames[0]).then(function(h){if(t._contentManager&&h!==t._contentManager){t.fireContentChangesStarted();t._setContent(null,null);t.fireContentChangesFinished({content:null});}h.loadContent(t._content,e);});}}.bind(this));}else{q.sap.delayedCall(0,this,function(){this.fireContentChangesStarted();this._setContent(null,null);this.fireContentChangesFinished({content:null});});}});}return this;};b.prototype._handleContentChangesStarted=function(e){this._inLoading=true;this.fireContentChangesStarted();};b.prototype._handleContentChangesFinished=function(e){var h=e.getParameter("content");this._setContent(h,e.getSource());this.fireContentChangesFinished({content:h,failureReason:e.getParameter("failureReason")});this._inLoading=false;if(this._delayContentResourcesUpdate){this._delayContentResourcesUpdate=false;this._scheduleContentResourcesUpdate();}};b.prototype._handleContentChangesProgress=function(e){this.fireContentChangesProgress({phase:e.getParameter("phase"),source:e.getParameter("source"),percentage:e.getParameter("percentage")});};b.prototype._getContentManagerByClassName=function(e){var h,j=this.getAggregation("contentManagers",[]);for(var i=0,k=j.length;i<k;++i){h=j[i];if(h.getMetadata().getName()===e){return Promise.resolve(h);}}var t=this;return new Promise(function(n,o){sap.ui.require([e.replace(/\./g,"/")],function(p){var h=new p();t.addAggregation("contentManagers",h);h.attachContentChangesStarted(t._handleContentChangesStarted,t);h.attachContentChangesFinished(t._handleContentChangesFinished,t);h.attachContentChangesProgress(t._handleContentChangesProgress,t);t._assignDecryptionHandler([h]);t._assignAuthorizationHandler([h]);n(h);});});};b.prototype.getContent=function(){return this._content;};b.prototype.getContentManager=function(){return this._contentManager;};b.prototype._assignDecryptionHandler=function(e){for(var i=0;i<e.length;i++){e[i].setDecryptionHandler(this._decryptionHandler);}};b.prototype._assignAuthorizationHandler=function(e){for(var i=0;i<e.length;i++){e[i].setAuthorizationHandler(this._authorizationHandler);}};b.prototype.setDecryptionHandler=function(h){this._decryptionHandler=h;this._assignDecryptionHandler(this.getAggregation("contentManagers",[]));return this;};b.prototype.setAuthorizationHandler=function(h){this._authorizationHandler=h;this._assignAuthorizationHandler(this.getAggregation("contentManagers",[]));return this;};b.prototype._setContent=function(n,e){var o=this._content,h=this._contentManager;if(o!==n){this._content=n;this._contentManager=e;this.fireContentReplaced({oldContent:o,newContent:n});if(o){var p=false;this.fireContentDestroying({content:o,preventGarbageCollection:function(i){p=i;}});h.destroyContent(o);if(!p){h.collectGarbage();}}}return this;};var r=[{pattern:/(^threejs[:.])|(^(threejs|stream)$)/,dimension:3,contentManagerClassName:N.getName("threejs.ContentManager")},{pattern:/^vdsl?$/,dimension:3,contentManagerClassName:N.getName("dvl.ContentManager")},{pattern:/^(png|jpg|jpeg|gif|bmp|tiff?|svg)$/,dimension:2,contentManagerClassName:N.getName("ImageContentManager")},{pattern:"cgm",dimension:2,contentManagerClassName:N.getName("dvl.ContentManager")}];var d=function(e){return new Promise(function(h,i){var j=r.slice();var t=function(k){if(k>=j.length){i();return;}var n=j[k];(function(){var s=e.getSourceType();if(s){s=s.toLowerCase();}if(typeof n==="function"){return n(e);}else if(typeof n.pattern==="string"){var p=n.pattern.toLowerCase();if(p===s){return Promise.resolve(n);}}else if(n.pattern instanceof RegExp){if(n.pattern.test(s)){return Promise.resolve(n);}}return Promise.reject();})().then(function(o){h({dimension:o.dimension,contentManagerClassName:o.contentManagerClassName,settings:o.settings});},function(){t(k+1);});};t(0);});};b.addContentManagerResolver=function(e){if(typeof e==="function"){r.unshift(e);}else{r.unshift({pattern:e.pattern,dimension:e.dimension,contentManagerClassName:e.contentManagerClassName,settings:e.settings});}return this;};b.removeAllContentManagerResolvers=function(){r=[];return this;};b.removeContentManagerResolver=function(e){var h=typeof e==="function",j=typeof e==="string",k=e instanceof RegExp;for(var i=0,n=r.length;i<n;++i){if(h||j){if(r[i]===e){r.splice(i,1);return true;}}else if(k){if(typeof r[i]==="object"&&r[i].pattern instanceof RegExp&&r[i].pattern.source===e.source){r.splice(i,1);return true;}}}return false;};b.prototype._collectContentResourceSourceTypeInformation=function(e){var n=false,u=false,h={},j={},k=[];e.forEach(function flatten(i){k.push(i);i.getContentResources().forEach(flatten);});return Promise.all(k.map(function(i){return d(i).then(function(o){h[o.dimension]=true;j[o.contentManagerClassName]=true;return o;},function(){if(i.getSourceType()){u=true;}else{n=true;}return false;});})).then(function(o){for(var i=0,p=k.length;i<p;++i){if(o[i]){k[i]._contentManagerResolver=o[i];}}return{noSourceTypes:n,unknownSourceTypes:u,dimensions:Object.getOwnPropertyNames(h).sort(),contentManagerClassNames:Object.getOwnPropertyNames(j)};});};var f=b.getMetadata().getName();var m={init:function(){this._contentConnector=null;v.attachEvent(f+"-created",this._handleContentConnectorCreated,this).attachEvent(f+"-destroying",this._handleContentConnectorDestroying,this);},exit:function(){this.setContentConnector(null);v.detachEvent(f+"-destroying",this._handleContentConnectorDestroying,this).detachEvent(f+"-created",this._handleContentConnectorCreated,this);},setContentConnector:function(e){this.setAssociation("contentConnector",e,true);this._updateContentConnector();return this;},_updateContentConnector:function(){var n=this.getContentConnector(),e=n&&sap.ui.getCore().byId(n)||null;if(this._contentConnector!==e){this._clearContentConnector();if(e){if(this._handleContentChangesStarted){e.attachContentChangesStarted(this._handleContentChangesStarted,this);}if(this._handleContentChangesFinished){e.attachContentChangesFinished(this._handleContentChangesFinished,this);}if(this._handleContentChangesProgress){e.attachContentChangesProgress(this._handleContentChangesProgress,this);}if(this._handleContentReplaced){e.attachContentReplaced(this._handleContentReplaced,this);}if(this._handleContentDestroying){e.attachContentDestroying(this._handleContentDestroying,this);}this._contentConnector=e;if(this._onAfterUpdateContentConnector){this._onAfterUpdateContentConnector();}}}return this;},_clearContentConnector:function(){if(this._contentConnector){if(this._onBeforeClearContentConnector){this._onBeforeClearContentConnector();}if(this._handleContentDestroying){this._contentConnector.detachContentDestroying(this._handleContentDestroying,this);}if(this._handleContentReplaced){this._contentConnector.detachContentReplaced(this._handleContentReplaced,this);}if(this._handleContentChangesProgress){this._contentConnector.detachContentChangesProgress(this._handleContentChangesProgress,this);}if(this._handleContentChangesFinished){this._contentConnector.detachContentChangesFinished(this._handleContentChangesFinished,this);}if(this._handleContentChangesStarted){this._contentConnector.detachContentChangesStarted(this._handleContentChangesStarted,this);}this._contentConnector=null;}return this;},_handleContentConnectorCreated:function(e){if(this.getContentConnector()===e.getParameter("object").getId()){this._updateContentConnector();}},_handleContentConnectorDestroying:function(e){if(this.getContentConnector()===e.getParameter("object").getId()){this._clearContentConnector();}}};b.injectMethodsIntoClass=function(e){var p=e.prototype,i=p.init,h=p.exit;p.init=function(){if(i){i.call(this);}m.init.call(this);};p.exit=function(){m.exit.call(this);if(h){h.call(this);}};p.setContentConnector=m.setContentConnector;p._updateContentConnector=m._updateContentConnector;p._clearContentConnector=m._clearContentConnector;p._handleContentConnectorCreated=m._handleContentConnectorCreated;p._handleContentConnectorDestroying=m._handleContentConnectorDestroying;};return b;});
