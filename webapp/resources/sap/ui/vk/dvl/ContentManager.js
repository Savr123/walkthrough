/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../ContentManager","../NS","../getResourceBundle"],function(C,N,g){"use strict";var a=C.extend(N.getName("dvl.ContentManager"),{metadata:{library:N.getName()}});var b=a.getMetadata().getParent().getClass().prototype;a.prototype.init=function(){if(b.init){b.init.call(this);}this._handleDownloadingProgressProxy=this._handleDownloadingProgress.bind(this);this._graphicsCore=null;this._failedSources=[];};a.prototype.exit=function(){if(this._graphicsCore){this._graphicsCore.destroy();this._graphicsCore=null;}if(b.exit){b.exit.call(this);}};var r={},w={antialias:true,alpha:true,premultipliedAlpha:true};a.getRuntimeSettings=function(){return r;};a.setRuntimeSettings=function(s){r=s;};a.getWebGLContextAttributes=function(){return w;};a.setWebGLContextAttributes=function(c){w=Object.assign(w,c);};a.prototype._getGraphicsCore=function(){var t=this;return new Promise(function(c,d){if(t._graphicsCore){c(t._graphicsCore);}else{sap.ui.require([N.getPath("dvl/GraphicsCore")],function(G){G.create(r,w).then(function(e){t._graphicsCore=e;t._graphicsCore.attachSceneLoadingStarted(t._handleDvlSceneLoadingStarted,t);t._graphicsCore.attachSceneLoadingFinished(t._handleDvlSceneLoadingFinished,t);t._graphicsCore.attachSceneLoadingProgress(t._handleDvlSceneLoadingProgress,t);c(t._graphicsCore);});});}});};a.prototype._handleDownloadingProgress=function(e){var s=e.getParameter("source"),l=e.getParameter("loaded"),t=e.getParameter("total"),v=t?l/t*50:0;this.fireContentChangesProgress({phase:g().getText("PROGRESS_INDICATOR_DOWNLOADING"),source:s,percentage:v});};a.prototype._handleDvlSceneLoadingProgress=function(e){this.fireContentChangesProgress({phase:g().getText("PROGRESS_INDICATOR_RENDERING"),source:e.getParameter("source"),percentage:50+e.getParameter("percentage")*50});};a.prototype._handleDvlSceneLoadingStarted=function(e){};a.prototype._handleDvlSceneLoadingFinished=function(e){};a.prototype.loadContent=function(c,d){this.fireContentChangesStarted();var t=this;this._getGraphicsCore().then(function(e){e.setDecryptionHandler(t._decryptionHandler);e.setAuthorizationHandler(t._authorizationHandler);e.loadContentResourcesAsync(d,function(s){var f=[];if(s){s.forEach(function(i){f.push({error:i,errorMessage:"Failed to download source '"+((i.source instanceof File)?i.source.name:i.source)+"'."});});}var l=c?c:undefined;e.updateSceneTreeAsync(l,d).then(function(h){var i={content:h.scene};if(h.failureReason){f=f.concat(h.failureReason);}if(f.length>0){i.failureReason=f;}sap.ui.require([N.getPath("dvl/Viewport"),N.getPath("dvl/ViewStateManager")],function(){t.fireContentChangesFinished(i);});}).catch(function(h){if(typeof h==="string"){f.push({error:h,errorMessage:h});}else{f.push({error:h,errorMessage:h.message?h.message:h.errorMessage});}t.fireContentChangesFinished({content:null,failureReason:f});});},t._handleDownloadingProgressProxy);},function(e){t.fireContentChangesFinished({content:null,failureReason:{error:e,errorMessage:"Failed to create DVL graphics core object."}});});return this;};a.prototype.destroyContent=function(c){if(c){this._graphicsCore.destroyScene(c);}return this;};a.prototype.collectGarbage=function(){this._graphicsCore.collectGarbage();return this;};return a;});
