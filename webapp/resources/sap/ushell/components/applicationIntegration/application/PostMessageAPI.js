// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ui/core/Popup","sap/ui/core/library","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/core/UIComponent","sap/ushell/services/AppConfiguration"],function(u,P,c,q,L,U,A){"use strict";var d=new U(),p;var a={"sap.ushell.services.CrossApplicationNavigation":{oServiceCalls:{"hrefForExternal":{executeServiceCallFn:function(S){return new q.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(S.oMessageData.body.oArgs)).promise();}},"getSemanticObjectLinks":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").getSemanticObjectLinks(S.oMessageData.body.sSemanticObject,S.oMessageData.body.mParameters,S.oMessageData.body.bIgnoreFormFactors,undefined,undefined,S.oMessageData.body.bCompactIntents);}},"isIntentSupported":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(S.oMessageData.body.aIntents);}},"isNavigationSupported":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").isNavigationSupported(S.oMessageData.body.aIntents);}},"backToPreviousApp":{executeServiceCallFn:function(){sap.ushell.Container.getService("CrossApplicationNavigation").backToPreviousApp();return new q.Deferred().resolve().promise();}},"historyBack":{executeServiceCallFn:function(S){sap.ushell.Container.getService("CrossApplicationNavigation").historyBack(S.oMessageData.body.iSteps);return new q.Deferred().resolve().promise();}},"getAppStateData":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").getAppStateData(S.oMessageData.body.sAppStateKey);}},"toExternal":{executeServiceCallFn:function(S){var o=u.clone(S.oMessageData.body.oArgs);u.storeSapSystemToLocalStorage(o);return new q.Deferred().resolve(sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(o)).promise();}}}},"sap.ushell.ui5service.ShellUIService":{oServiceCalls:{"setTitle":{executeServiceCallFn:function(S){return new q.Deferred().resolve(S.oContainer.getShellUIService().setTitle(S.oMessageData.body.sTitle)).promise();}},"setBackNavigation":{executeServiceCallFn:function(S){return S.executeSetBackNavigationService(S.oMessage,S.oMessageData);}}}},"sap.ushell.services.ShellUIService":{oServiceCalls:{"setTitle":{executeServiceCallFn:function(S){return new q.Deferred().resolve(S.oContainer.getShellUIService().setTitle(S.oMessageData.body.sTitle)).promise();}},"setHierarchy":{executeServiceCallFn:function(S){return new q.Deferred().resolve(S.oContainer.getShellUIService().setHierarchy(S.oMessageData.body.aHierarchyLevels)).promise();}},"setRelatedApps":{executeServiceCallFn:function(S){return new q.Deferred().resolve(S.oContainer.getShellUIService().setRelatedApps(S.oMessageData.body.aRelatedApps)).promise();}},"setDirtyFlag":{executeServiceCallFn:function(S){sap.ushell.Container.setDirtyFlag(S.oMessageData.body.bIsDirty);return new q.Deferred().resolve().promise();}},"showShellUIBlocker":{executeServiceCallFn:function(S){s(S.oMessageData.body.bShow);return new q.Deferred().resolve().promise();}},"getFLPUrl":{executeServiceCallFn:function(S){var i=false;if(S.oMessageData.body&&S.oMessageData.body.bIncludeHash===true){i=true;}return new q.Deferred().resolve(sap.ushell.Container.getFLPUrl(i)).promise();}},"getShellGroupIDs":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").getShellGroupIDs((S.oMessageData.body?S.oMessageData.body.bGetAll:undefined));}},"addBookmark":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").addBookmarkByGroupId(S.oMessageData.body.oParameters,S.oMessageData.body.groupId);}},"getShellGroupTiles":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("LaunchPage").getTilesByGroupId(S.oMessageData.body.groupId);}}}},"sap.ushell.services.Container":{oServiceCalls:{"setDirtyFlag":{executeServiceCallFn:function(S){sap.ushell.Container.setDirtyFlag(S.oMessageData.body.bIsDirty);return new q.Deferred().resolve().promise();}},"getFLPUrl":{executeServiceCallFn:function(S){var i=false;if(S.oMessageData.body&&S.oMessageData.body.bIncludeHash===true){i=true;}return new q.Deferred().resolve(sap.ushell.Container.getFLPUrl(i)).promise();}}}},"sap.ushell.services.AppState":{oServiceCalls:{"getAppState":{executeServiceCallFn:function(S){var D=new q.Deferred();sap.ushell.Container.getService("AppState").getAppState(S.oMessageData.body.sKey).done(function(o){delete o._oServiceInstance;D.resolve(o);}).fail(function(o){delete o._oServiceInstance;D.resolve(o);});return D.promise();}},"_saveAppState":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("AppState")._saveAppState(S.oMessageData.body.sKey,S.oMessageData.body.sData,S.oMessageData.body.sAppName,S.oMessageData.body.sComponent,S.oMessageData.body.bTransient,S.oMessageData.body.iPersistencyMethod,S.oMessageData.body.oPersistencySettings);}},"_loadAppState":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("AppState")._loadAppState(S.oMessageData.body.sKey);}}}},"sap.ushell.services.Bookmark":{oServiceCalls:{"addBookmarkUI5":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").addBookmark(S.oMessageData.body.oParameters,S.oMessageData.body.oGroup);}},"addBookmark":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").addBookmarkByGroupId(S.oMessageData.body.oParameters,S.oMessageData.body.groupId);}},"getShellGroupIDs":{executeServiceCallFn:function(){return sap.ushell.Container.getService("Bookmark").getShellGroupIDs();}},"addCatalogTileToGroup":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").addCatalogTileToGroup(S.oMessageData.body.sCatalogTileId,S.oMessageData.body.sGroupId,S.oMessageData.body.oCatalogData);}},"countBookmarks":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").countBookmarks(S.oMessageData.body.sUrl);}},"deleteBookmarks":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").deleteBookmarks(S.oMessageData.body.sUrl);}},"updateBookmarks":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("Bookmark").updateBookmarks(S.oMessageData.body.sUrl,S.oMessageData.body.oParameters);}}}},"sap.ushell.services.AppConfiguration":{oServiceCalls:{"setApplicationFullWidth":{executeServiceCallFn:function(S){A.setApplicationFullWidth(S.oMessageData.body.bValue);return new q.Deferred().resolve().promise();}}}}};function b(){}b.prototype.getAPIs=function(){this._registerAppRuntimeNewAPI();return a;};b.prototype.addShellCommunicationHandler=function(k,C){var o=a[k],n;if(o){if(C.oServiceCalls){Object.keys(C.oServiceCalls).forEach(function(e){o.oServiceCalls[e]=C.oServiceCalls[e];});}if(C.oRequestCalls){Object.keys(C.oRequestCalls).forEach(function(e){o.oRequestCalls[e]=C.oRequestCalls[e];});}return;}n={oRequestCalls:{},oServiceCalls:{}};if(C.oServiceCalls){Object.keys(C.oServiceCalls).forEach(function(e){n.oServiceCalls[e]=C.oServiceCalls[e];});}if(C.oRequestCalls){Object.keys(C.oRequestCalls).forEach(function(e){n.oRequestCalls[e]=C.oRequestCalls[e];});}a[k]=n;};b.prototype._getPostMesageInterface=function(S,i){var C;if(a[S]){C=a[S];if(C&&C.oRequestCalls&&C.oRequestCalls[i]){return C.oRequestCalls[i];}}return undefined;};b.prototype.registerShellCommunicationHandler=function(C){var t=this,e;Object.keys(C).forEach(function(k){e=C[k];t.addShellCommunicationHandler(k,e);});};b.prototype.isActiveOnly=function(S,i){var C=this._getPostMesageInterface(S,i);if(C){return C.isActiveOnly;}return undefined;};b.prototype.getResponseHandler=function(S,i){var C=this._getPostMesageInterface(S,i);if(C){return C.fnResponseHandler;}return undefined;};b.prototype._createNewInnerAppState=function(S){var o=sap.ushell.Container.getService("AppState"),n,h,C,N,v;n=o.createEmptyAppState();if(S.oMessageData.body.sData!==undefined){try{v=JSON.parse(S.oMessageData.body.sData);}catch(e){v=S.oMessageData.body.sData;}}else{v="";}n.setData(v);n.save();N=n.getKey();h=window.hasher.getHash();if(h.indexOf("&/")>0){if(h.indexOf("sap-iapp-state=")>0){C=/(?:sap-iapp-state=)([^&/]+)/.exec(h)[1];h=h.replace(C,N);}else{h=h+"/sap-iapp-state="+N;}}else{h=h+"&/sap-iapp-state="+N;}window.hasher.changed.active=false;window.hasher.replaceHash(h);window.hasher.changed.active=true;return N;};b.prototype._setInnerAppStateData=function(S){return b.prototype._createNewInnerAppState(S);};b.prototype._registerAppRuntimeNewAPI=function(){if(this.newAPIAdded!==undefined){return;}this.newAPIAdded=true;this.registerShellCommunicationHandler({"sap.ushell.appRuntime":{oRequestCalls:{"hashChange":{isActiveOnly:true,distributionType:["URL"]},"setDirtyFlag":{isActiveOnly:true,distributionType:["URL"]},"themeChange":{isActiveOnly:false,distributionType:["URL"]},"uiDensityChange":{isActiveOnly:false,distributionType:["URL"]}},oServiceCalls:{"hashChange":{executeServiceCallFn:function(S){window.hasher.replaceHash(S.oMessageData.body.newHash);return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.ShellNavigation":{oServiceCalls:{"toExternal":{executeServiceCallFn:function(S){sap.ushell.Container.getService("ShellNavigation").toExternal(S.oMessageData.body.oArgs,undefined,S.oMessageData.body.bWriteHistory);return new q.Deferred().resolve().promise();}},"toAppHash":{executeServiceCallFn:function(S){sap.ushell.Container.getService("ShellNavigation").toAppHash(S.oMessageData.body.sAppHash,S.oMessageData.body.bWriteHistory);return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.NavTargetResolution":{oServiceCalls:{"getDistinctSemanticObjects":{executeServiceCallFn:function(){return sap.ushell.Container.getService("NavTargetResolution").getDistinctSemanticObjects();}},"expandCompactHash":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("NavTargetResolution").expandCompactHash(S.oMessageData.body.sHashFragment);}},"resolveHashFragment":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("NavTargetResolution").expandCompactHash(S.oMessageData.body.sHashFragment);}},"isNavigationSupported":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("NavTargetResolution").isNavigationSupported(S.oMessageData.body.aIntents);}}}},"sap.ushell.services.CrossApplicationNavigation":{oServiceCalls:{"expandCompactHash":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").expandCompactHash(S.oMessageData.body.sHashFragment);}},"getDistinctSemanticObjects":{executeServiceCallFn:function(){return sap.ushell.Container.getService("CrossApplicationNavigation").getDistinctSemanticObjects();}},"getLinks":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").getLinks(S.oMessageData.body.vArgs);}},"getPrimaryIntent":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").getPrimaryIntent(S.oMessageData.body.sSemanticObject,S.oMessageData.body.mParameters);}},"hrefForAppSpecificHash":{executeServiceCallFn:function(S){return sap.ushell.Container.getService("CrossApplicationNavigation").hrefForAppSpecificHash(S.oMessageData.body.sAppHash);}},"isInitialNavigation":{executeServiceCallFn:function(){return sap.ushell.Container.getService("CrossApplicationNavigation").hrefForAppSpecificHash();}},"getAppState":{executeServiceCallFn:function(S){var D=new q.Deferred();sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(d,S.oMessageData.body.sAppStateKey).done(function(o){delete o._oServiceInstance;D.resolve(o);});return D.promise();}},"setInnerAppRoute":{executeServiceCallFn:function(S){var o=sap.ushell.Container.getService("URLParsing"),h=o.parseShellHash(window.hasher.getHash()),n;h.appSpecificRoute=S.oMessageData.body.appSpecificRoute;n="#"+o.constructShellHash(h);window.hasher.replaceHash(n);return new q.Deferred().resolve().promise();}},"setInnerAppStateData":{executeServiceCallFn:function(S){var k=b.prototype._setInnerAppStateData(S);return new q.Deferred().resolve(k).promise();}}}},"sap.ushell.services.Renderer":{oServiceCalls:{"addHeaderItem":{executeServiceCallFn:function(S){f("addHeaderItem",S);return new q.Deferred().resolve().promise();}},"addHeaderEndItem":{executeServiceCallFn:function(S){f("addHeaderEndItem",S);return new q.Deferred().resolve().promise();}},"showHeaderItem":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").showHeaderItem(S.oMessageData.body.aIds,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"showHeaderEndItem":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem(S.oMessageData.body.aIds,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"hideHeaderItem":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").hideHeaderItem(S.oMessageData.body.aIds,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"hideHeaderEndItem":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem(S.oMessageData.body.aIds,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}},"setHeaderTitle":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").setHeaderTitle(S.oMessageData.body.sTitle);return new q.Deferred().resolve().promise();}},"setHeaderVisibility":{executeServiceCallFn:function(S){sap.ushell.Container.getRenderer("fiori2").setHeaderVisibility(S.oMessageData.body.bVisible,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);return new q.Deferred().resolve().promise();}}}},"sap.ushell.services.LaunchPage":{oServiceCalls:{"getGroupsForBookmarks":{executeServiceCallFn:function(){return sap.ushell.Container.getService("LaunchPage").getGroupsForBookmarks();}}}}});};function s(S){if(S===true&&p===undefined){p=new P();p.setShadow(true);p.setModal(true,"sapMDialogBlockLayerInit");p.setNavigationMode("SCOPE");p.eOpenState=c.OpenState.OPEN;q("#shell-cntnt").css("zIndex",40);p._iZIndex=30;p._duringOpen();}else if(S===false&&p!==undefined){p._oLastPosition=p._oDefaultPosition;p.destroy();p=undefined;q("#shell-cntnt").css("zIndex","auto");}}function f(e,S){sap.ushell.Container.getRenderer("fiori2")[e]("sap.ushell.ui.shell.ShellHeadItem",{id:S.oMessageData.body.sId,tooltip:S.oMessageData.body.sTooltip,icon:S.oMessageData.body.sIcon,press:function(){S.oContainer.postMessageRequest("sap.ushell.appRuntime.buttonClick",{buttonId:S.oMessageData.body.sId});}},S.oMessageData.body.bVisible,S.oMessageData.body.bCurrentState||true,S.oMessageData.body.aStates);}return new b();},false);
