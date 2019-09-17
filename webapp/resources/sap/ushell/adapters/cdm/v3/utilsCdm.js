// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject","sap/base/util/ObjectPath"],function(u,R,q,i,O){"use strict";function g(o,A){return u.getMember(o,A);}function a(o,A,D){return u.getNestedObjectProperty(o,A,D);}function m(k,s,A,v,V,S){var I=false;s=u.clone(s);A=u.clone(A);v=v||{};V=V||{};var o={};o.semanticObject=g(s,"semanticObject");o.action=g(s,"action");var e=R.getConfig(v);o.title=a([e,s,A],["sap|app.title","title","sap|app.title"]);o.info=a([e,s,A],["sap|app.info","info","sap|app.info"]);o.icon=a([e,s,A],["sap|ui.icons.icon","icon","sap|ui.icons.icon"]);o.subTitle=a([e,s,A],["sap|app.subTitle","subTitle","sap|app.subTitle"]);o.shortTitle=a([e,s,A],["sap|app.shortTitle","shortTitle","sap|app.shortTitle"]);o.deviceTypes=g(A,"sap|ui.deviceTypes")||{};["desktop","tablet","phone"].forEach(function(M){if(Object.prototype.hasOwnProperty.call(g(s,"deviceTypes")||{},M)){o.deviceTypes[M]=s.deviceTypes[M];}if(!Object.prototype.hasOwnProperty.call(o.deviceTypes,M)){o.deviceTypes[M]=true;}o.deviceTypes[M]=!!o.deviceTypes[M];});o.signature=g(s,"signature")||{};o.signature.parameters=g(o,"signature.parameters")||{};o.signature.additionalParameters=g(s,"signature.additionalParameters")||"allowed";var h=g(A,"sap|platform|runtime");o.resolutionResult=q.extend(true,{},h);if(h){o.resolutionResult["sap.platform.runtime"]=q.extend(true,{},h);}if(g(A,"sap|ui.technology")==="GUI"){o.resolutionResult["sap.gui"]=g(A,"sap|gui");}if(g(A,"sap|ui.technology")==="WDA"){o.resolutionResult["sap.wda"]=g(A,"sap|wda");}if(g(A,"sap|ui.technology")==="URL"){if(A["sap.url"]){o.resolutionResult["sap.platform.runtime"]=o.resolutionResult["sap.platform.runtime"]||{};o.resolutionResult.url=A["sap.url"].uri;o.resolutionResult["sap.platform.runtime"].url=A["sap.url"].uri;}else if(h&&h.uri){o.resolutionResult["sap.platform.runtime"].url=h.uri;o.resolutionResult.url=h.uri;}}if(!o.resolutionResult["sap.ui"]){o.resolutionResult["sap.ui"]={};}o.resolutionResult["sap.ui"].technology=g(A,"sap|ui.technology");o.resolutionResult.applicationType=this._formatApplicationType(o.resolutionResult,A);o.resolutionResult.systemAlias=o.resolutionResult.systemAlias||g(s,"systemAlias");o.resolutionResult.systemAliasSemantics="apply";o.resolutionResult.text=o.title;o.resolutionResult.appId=g(A,"sap|app.id");var T,j;var l=g(v,"vizConfig.sap|flp.indicatorDataSource");var n={};if(!i(V)){var p=g(V,"sap|app.type");if(p==="card"){I=true;n=q.extend(true,{},V,v.vizConfig);}else{n.componentName=g(V,"sap|ui5.componentName");var C=g(V,"sap|platform|runtime.componentProperties");if(C){n.componentProperties=C;}if(g(V,"sap|platform|runtime.includeManifest")){n.componentProperties=n.componentProperties||{};n.componentProperties.manifest=q.extend(true,{},V);delete n.componentProperties.manifest["sap.platform.runtime"];}}}if(g(A,"sap|app.type")==="plugin"||g(A,"sap|flp.type")==="plugin"){return undefined;}var r=a([e,A,V],"sap|flp.tileSize");var w=a([e,A,V],"sap|app.description");if(g(A,"sap|ui.technology")==="GUI"&&g(A,"sap|gui.transaction")){T=g(A,"sap|gui.transaction");}if(g(A,"sap|ui.technology")==="WDA"&&g(A,"sap|wda.applicationId")){T=g(A,"sap|wda.applicationId");}var D=a([e,A,V],"sap|app.dataSources");if(g(A,"sap|app.id")){j=g(A,"sap|app.id");}o.tileResolutionResult={appId:j,title:o.title,subTitle:o.subTitle,icon:o.icon,size:r,info:o.info,tileComponentLoadInfo:n,indicatorDataSource:l,dataSources:D,description:w,runtimeInformation:h,technicalInformation:T,deviceTypes:o.deviceTypes,isCard:I};var x=g(A,"sap|integration.urlTemplateId");var y=b(x,S);if(y){o.templateContext={payload:y,site:S,siteAppSection:A};}return o;}function b(T,s){if(!s||typeof T!=="string"){return null;}var e=T.replace(/[.]/g,"|");return g(s.urlTemplates,e+".payload");}function f(r,A){var s=r.applicationType;if(s){return s;}var C=g(A,"sap|platform|runtime.componentProperties.self.name")||g(A,"sap|ui5.componentName");if(g(A,"sap|flp.appType")==="UI5"||g(A,"sap|ui.technology")==="UI5"){r.applicationType="SAPUI5";r.additionalInformation="SAPUI5.Component="+C;r.url=g(A,"sap|platform|runtime.componentProperties.url");r.applicationDependencies=g(A,"sap|platform|runtime.componentProperties");return"SAPUI5";}if(g(A,"sap|ui.technology")==="GUI"){r.applicationType="TR";r["sap.gui"]=g(A,"sap|gui");r.systemAlias=g(A,"sap|app.destination.name");return"TR";}if(g(A,"sap|ui.technology")==="WDA"){r.applicationType="WDA";r["sap.wda"]=g(A,"sap|wda");r.systemAlias=g(A,"sap|app.destination.name");return"WDA";}if(g(A,"sap|ui.technology")==="URL"){r.applicationType="URL";r.systemAlias=g(A,"sap|app.destination.name");}return"URL";}function c(s){var e=this;if(!s){return[];}var I=[];try{var S=Object.keys(s.applications||{}).sort();S.forEach(function(A){try{var o=s.applications[A];var h=g(o,"sap|app.crossNavigation.inbounds");if(h){var l=Object.keys(h).sort();l.forEach(function(k){var n=h[k];var r=e.mapOne(k,n,o,undefined,undefined,s);if(r){I.push(r);}});}}catch(j){q.sap.log.error("Error in application "+A+": "+j,j.stack);}});}catch(E){q.sap.log.error(E);q.sap.log.error(E.stack);return[];}return I;}function t(I){var s,p,C;s={target:{semanticObject:I.semanticObject,action:I.action},params:{}};p=O.get("signature.parameters",I)||{};Object.keys(p).forEach(function(k){if(p[k].filter&&Object.prototype.hasOwnProperty.call(p[k].filter,"value")&&(p[k].filter.format===undefined||p[k].filter.format==="plain")){s.params[k]=[p[k].filter.value];}if(p[k].launcherValue&&Object.prototype.hasOwnProperty.call(p[k].launcherValue,"value")&&(p[k].launcherValue.format===undefined||p[k].launcherValue.format==="plain")){s.params[k]=[p[k].launcherValue.value];}});C=sap.ushell.Container.getService("URLParsing").constructShellHash(s);if(!C){return undefined;}return C;}function d(o){var s,p,C;s={target:{semanticObject:o.semanticObject,action:o.action},params:{}};p=o.parameters||{};Object.keys(p).forEach(function(k){if(p.hasOwnProperty(k)&&typeof p[k].value==="object"){s.params[k]=[p[k].value.value];}});C=sap.ushell.Container.getService("URLParsing").constructShellHash(s);if(!C){return undefined;}return C;}return{formatSite:c,toHashFromInbound:t,toHashFromOutbound:d,mapOne:m,_formatApplicationType:f};},true);
