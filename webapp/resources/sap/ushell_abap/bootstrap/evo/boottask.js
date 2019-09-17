// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/common/common.boot.path","sap/ushell/bootstrap/common/common.load.xhrlogon","sap/ushell/utils","./abap.bootstrap.utils","./abap.request.server.config","./abap.request.startup","./abap.request.pageset","./abap.xhr.handler","sap/ushell/services/Container","sap/ui/Device","sap/ui2/srvc/utils"],function(b,x,u,a,r,s,p,X){"use strict";var B={};sap.ushell_abap=sap.ushell_abap||{};sap.ushell_abap.bootstrap=sap.ushell_abap.bootstrap||{};sap.ushell_abap.getShellType=function(){return u.hasNativeNavigationCapability()?"NWBC":"FLP";};sap.ushell_abap.bootstrap.addPostParametersToNavTargetResultUrl=function(P,U){if(P){U+=(U.indexOf("?")<0)?"?":"&";U+=P;}return U;};sap.ushell_abap.bootstrap.adjustNavTargetResult=function(R){if(R){var U=R.url,e,H={applicationType:R.applicationType,additionalInformation:R.applicationData},I,M,J,K;if(R.text){H.text=R.text;}if((R.applicationType==="URL"||R.applicationType==="SAPUI5")){M=/^SAPUI5\.Component=(.*)/.exec(R.applicationData);I=M&&M[1];if(I||R.applicationDependencies){if(I){H.ui5ComponentName=I;}if(R.applicationDependencies){try{J=JSON.parse(R.applicationDependencies);K=J.self;if(!H.ui5ComponentName&&K.name){H.ui5ComponentName=K.name;H.additionalInformation="SAPUI5.Component="+H.ui5ComponentName;}if(K&&K.url&&typeof K.url==="string"){var L=sap.ui.require("sap/ui/thirdparty/URI");e=U&&new L(U);if(e){if(K.url.toUpperCase().indexOf(e.path().toUpperCase())!==0){sap.ui2.srvc.log.debug("Component URL defined in target mapping "+"does not match the URL retrieved from application index. "+"The URL of the application index is used for further processing.","Target mapping URL: "+R.url+"\nApplication index URL: "+K.url,"sap.ushell_abap.bootstrap.abap");}e.path(K.url);U=e.toString();jQuery.sap.log.debug("ResolveLink result's component url has been replaced with the url specified "+"in Application Dependencies, which includes cache buster token");}else{U=K.url;}}H.applicationDependencies=J;}catch(N){sap.ui2.srvc.log.error("Parsing of applicationDependencies attribute in resolveLink result failed for SAPUI5 component '"+I+"'",N,"sap.ushell_abap.bootstrap.abap");}}U=sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(U);}}H.url=U;return H;}};var c=new RegExp("^(#)?([A-Za-z0-9_]+)-([A-Za-z0-9_]+)"),S,o;function i(H){function e(H){if(!H){return false;}return(H.indexOf("Shell-runStandaloneApp")===0)||(H.indexOf("Shell-home")===0)||(H.indexOf("Shell-appfinder")===0)||(H.indexOf("Shell-catalog")===0)||(H.indexOf("shell-catalog")===0)||(H.indexOf("Action-search")===0);}function I(){return window["sap-ushell_abap-bootstrap-abap-noInitialTarget"]!==undefined;}var M=H.match(c);var J=M&&M[2];var K=M&&M[3];var L=H&&!e(H)&&!I()&&J&&K;return L;}function g(){var H,e=a.getLocationHref(),I=e.indexOf("#");if(I<0){return"";}H=decodeURI(e.slice(I+1));return H;}function d(){var H=g(),e=H.indexOf("&/");return e<0?H:H.slice(0,e);}function f(H){var M=H.match(c);return M?{semanticObject:M[2],action:M[3]}:undefined;}function h(H){if(!H||H==="#"){return true;}return(H.indexOf("Shell-home")===0)||(H.indexOf("Shell-appfinder")===0)||(H.indexOf("Shell-catalog")===0)||(H.indexOf("shell-catalog")===0);}function j(O){if(O===undefined){return undefined;}try{return JSON.parse(JSON.stringify(O));}catch(e){sap.ui2.srvc.log.error("Could not clone object",null,"sap.ushell_abap.bootstrap");return undefined;}}function k(T){return T.indexOf("sap_")===0;}function l(e,H){var I=sap.ui.getCore(),J=I.getConfiguration(),K=J.getFormatSettings();u.addTime("setSapui5Settings");jQuery.sap.log.debug("setSapui5Settings()",JSON.stringify(e),"sap.ushell_abap.bootstrap.abap");if(e.language){J.setLanguage(e.language,e.ABAPLanguage);}if(e.legacyDateFormat){K.setLegacyDateFormat(e.legacyDateFormat);}if(e.legacyDateCalendarCustomizing){K.setLegacyDateCalendarCustomizing(e.legacyDateCalendarCustomizing);}if(e.legacyNumberFormat){K.setLegacyNumberFormat(e.legacyNumberFormat);}if(e.legacyTimeFormat){K.setLegacyTimeFormat(e.legacyTimeFormat);}if(typeof H==="object"){K.addCustomCurrencies(H);}}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function m(e){jQuery.sap.getObject("sap-ushell-config.services.Container.adapter.config",0).bootTheme=j(e);}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function n(e){if(!e){sap.ui2.srvc.log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");}if(e.themeRoot){return e.themeRoot;}if(e.client){sap.ui2.srvc.log.warning("Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used",null,"sap.ushell_abap.bootstrap");return"/sap/public/bc/themes/~client-"+e.client;}sap.ui2.srvc.log.error("extractSystemThemeRoot: Could not determine system theme root");}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function q(e){var P,T;if(e&&e.userProfile){P=e.userProfile.filter(function(H){return H.id==="THEME";});T=P.length?P[0]:{};if(T.value){return T.value;}}if(e&&e.theme){return e.theme;}return"";}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function t(T,S){if(T&&k(T)){return"";}return S;}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function v(e,S){var T;T=q(e);return{theme:T,root:t(T,S)};}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function w(S){var T,e;T=a.getUrlParameterValue("sap-theme");if(T){if(T.indexOf("@")>0){e=T.split("@",2);return{theme:e[0],root:e[1]};}return{theme:T,root:t(T,S)};}return undefined;}sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);function y(){if(sap.ui2.srvc.getParameterMap()["sap-theme"]){return true;}return false;}function z(o,S){var U,H={},e;u.addTime("applyTheme");if(y()){U=w(S);e=U;sap.ui2.srvc.log.debug("theme: URL theme = '"+e.theme+"' theme root = '"+e.root+"'",null,"sap.ushell_abap.bootstrap");if(e.root){sap.ui.getCore().setThemeRoot(e.theme,e.root+"/UI5/");}}else if(o){e=o;sap.ui2.srvc.log.debug("theme: startup service theme = '"+e.theme+"' theme root = '"+e.root+"'",null,"sap.ushell_abap.bootstrap");if(e.root){sap.ui.getCore().applyTheme(e.theme,e.root+"/UI5/");}else{sap.ui.getCore().applyTheme(e.theme);}}else{H.theme=jQuery.sap.getObject("sap-ui-config.theme");if(H.theme){H.root=jQuery.sap.getObject("sap-ui-config.themeRoots."+H.theme||"");if(!H.root){H.root=t(H.theme,S);}e={theme:H.theme,root:H.root};sap.ui2.srvc.log.debug("theme: html file theme = '"+e.theme+"' theme root = '"+e.root+"'",null,"sap.ushell_abap.bootstrap");}else{e={theme:"",root:""};sap.ui2.srvc.log.error("Could not determine theme",null,"sap.ushell_abap.bootstrap");}}m(e);return e;}function A(e){var P=sap.ui2.srvc.getParameterMap(),R=a.getUrlParameterValue("sap-locale",P),U={},H;H=jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config",0);if(H.enabled!==false){H.enabled=(e.isEmbReportingActive===true);}H=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config.services",0);H.targetMappings=e.services&&e.services.targetMappings;H=jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config.services",0);H.targetMappings=e.services&&e.services.targetMappings;H.launchPage=e.services&&e.services.pbFioriHome;H=jQuery.sap.getObject("sap-ushell-config.services.VisualizationDataProvider.adapter",0);H.module="sap.ushell_abap.adapters.abap.LaunchPageAdapter";H=jQuery.sap.getObject("sap-ushell-config.services.VisualizationDataProvider.adapter.config.services",0);H.targetMappings=e.services&&e.services.targetMappings;H.launchPage=e.services&&e.services.pbFioriHome;H=jQuery.sap.getObject("sap-ushell-config.services.PageBuilding.adapter.config.services",0);H.pageBuilding=e.services&&e.services.pbFioriHome;H=jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config.services",0);H.personalization=e.services&&e.services.personalization;H=jQuery.sap.getObject("sap-ushell-config.services.Personalization.config",0);H.seed=e.seed;if(!R){U={language:e.languageBcp47||e.language,ABAPLanguage:e.language,legacyDateFormat:e.dateFormat,legacyDateCalendarCustomizing:e.tislcal,legacyNumberFormat:e.numberFormat===""?" ":e.numberFormat,legacyTimeFormat:e.timeFormat};}z(o,S);l(U,e.currencyFormats);}function C(e,N){var H=d(),I=g(),R=f(H),J=[R],K={},L={},M;var O=jQuery.sap.getObject("sap-ushell-config.services.AppState.config",0);var P=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config",0);function Q(U,I){var V=I.match(U);var W=[];if(!V){return;}W=(V[2]).toString().split("=");L[W[0]]=W[1];}function T(U,V,L,W,Y){if(V&&V[Y]&&L&&L[W]){U[L[W]]=V[Y];}}if(i(H)){Q(/(\?|&)(sap-xapp-state=[A-Z0-9]+)/,H);Q(/(\?|&)(sap-intent-param=[A-Z0-9]+)/,H);Q(/(\?|&)(sap-system=[A-Z0-9]+)/,H);Q(/(\?|&|[/])(sap-iapp-state=[A-Z0-9]+)/,I);M=s.requestDirectStart(e,N,R,L);O.initialAppStatesPromise=M.then(function(U){T(K,U,L,"sap-intent-param","iparState");T(K,U,L,"sap-iapp-state","iappState");T(K,U,L,"sap-xapp-state","xappState");O.initialAppStates=K;return Promise.resolve(K);});P.initialSegmentPromise=M.then(function(U){if(U.targetMappings){return Promise.resolve([J,U.targetMappings,U.systemAliases]);}return Promise.resolve(null);});}else{O.initialAppStatesPromise=Promise.resolve({});P.initialSegmentPromise=Promise.resolve(null);}}function D(){var P=new Promise(function(e,H){var R,O;O=function(){jQuery.sap.log.info("Direct application start: resolving component waitFor promise after shell renderer created event fired.");e();sap.ushell.Container.detachRendererCreatedEvent(O);};R=sap.ushell.Container.getRenderer();if(R){jQuery.sap.log.info("Direct application start: resolving component waitFor promise immediately (shell renderer already created).");e();}else{sap.ushell.Container.attachRendererCreatedEvent(O);}});return P;}function E(M){var U=a.getUrlParameterValue("sap-ushell-reload"),e;if(U){if(U==="X"||U==="true"){e=true;}else{e=false;}}if(e!==undefined){jQuery.sap.getObject("services.ShellNavigation.config",0,M).reload=e;}}function F(e,H,I){var J=d();A(e);H.forEach(function(K){a.mergeConfig(window["sap-ushell-config"],K,true);});E(window["sap-ushell-config"]);sap.ushell.bootstrap("abap",{abap:"sap.ushell_abap.adapters.abap",hana:"sap.ushell_abap.adapters.hana"}).done(function(){var K=x.FrameLogonManager.getInstance();sap.ushell.Container.oFrameLogonManager=K;}).always(function(){if(i(J)){var R,K;window["sap-ushell-async-libs-promise-directstart"]=new Promise(function(L,M){R=L;K=M;});window["sap-ushell-async-libs-promise-directstart"].catch(function(M){});sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.resolveHashFragment("#"+d()).done(function(L){var M=sap.ui.require("sap/ushell/services/AppConfiguration");M.setCurrentApplication(L);if(L&&L.ui5ComponentName){sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function(U){U.createComponent(L,f(J),D()).done(function(O){R({resolvedHashFragment:O,dependenciesLoaded:true});}).fail(function(O){K(O);});});}else{R({resolvedHashFragment:L,dependenciesLoaded:false});}}).fail(function(M){K(M);});});}I();});}function G(U){var N=false,e,R;if(window["sap-ushell_abap-bootstrap-abap-noOData"]){N=true;}X.initXhrLogon(window["sap-ushell-config"]);e=s.requestStartupConfig().then(function(H){var I=d();jQuery.sap.getObject("sap-ushell-config.services.Container.adapter",0).config=H;C(H,N);S=n(H);o=v(H,S);if(!y()&&o){jQuery.sap.log.debug("theme: load theme from startup service via window",null,"sap.ushell_abap.bootstrap");}if(h(I)){p.requestPageSet(H,N);var L=jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config",0);L.compactTMPromise=s.requestCompactTM(H,N);}var J=jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config",0);J.navTargetDataPromise=s.requestFullTM(H,N);return Promise.resolve(H);},function(M){jQuery.sap.log.error("start_up request failed: "+M,null,"sap.ushell_abap.bootstrap");return Promise.resolve({});});R=r().then(function(H){return Promise.resolve(H);},function(M){jQuery.sap.log.error("Could not load server configuration: "+M,null,"sap.ushell_abap.bootstrap.abap");return Promise.resolve([]);});Promise.all([e,R,U]).then(function(P){F.apply(null,P);});}B.start=G;B.bootstrap=F;B._getShellHash=d;B._getFullShellHash=g;B._createWaitForRendererCreatedPromise=D;return B;});