sap.ui.define(["sap/ui/core/support/Plugin","sap/ui/core/support/Support","sap/ui/core/format/DateFormat","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/suite/ui/generic/template/support/lib/CommonChecks","sap/suite/ui/generic/template/support/lib/CommonMethods","sap/suite/ui/generic/template/lib/testableHelper"],function(P,S,D,J,M,C,a,t){"use strict";var p="sapUiSupportFioriElementsPluginALPLROP";function g(s){var o,A,v=p+"-View",d=[],e=sap.ui.getCore().getEventBus(),m,b,r,c,I,T=10,f;function G(){return p;}function F(i){var m1=D.getDateInstance({source:{pattern:"YYYYMMdd"},style:"short"});return m1.format(m1.parse(String(i).substring(0,8)));}function h(i){var m1=window.location.origin;var n1=window.location.pathname;var o1=i||C.getComponentIDByStructure();if(o1){m=C.getManifestPath(o1);if(m){var p1=C.getManifestURL(m1,n1,m);if(p1){return p1;}}}return"";}function j(i,m1,n1,o1,p1){if(i==="string"){d.push({order:n1,name:m1,type:i,value:o1});return true;}else if(i==="link"){d.push({order:n1,name:m1,type:i,value:o1,target:p1});return true;}else if(i==="group"){d.push({order:n1,name:m1,type:i});return true;}return false;}function k(i,m1,n1){return j("string",i,m1,n1,"");}function l(i,m1,n1,o1){return j("link",i,m1,n1,o1);}function n(i,m1){return j("group",i,m1,"","");}function q(i){if(!(i&&a.hasObjectContent(i))){return undefined;}if(!(i.getMetadata()&&a.hasObjectContent(i.getMetadata()))){return undefined;}var m1=i.getMetadata();if(!(m1.getManifest()&&a.hasObjectContent(m1.getManifest()))){return undefined;}return m1.getManifest();}function u(i){d=[];k("Error",0,i);W();}function w(i){try{var m1=C.getUI5VersionInfo();if(m1&&a.hasObjectContent(m1)){k("OpenUI5 Version",i,m1.version+" (built at "+F(m1.buildTimestamp)+")");return true;}else{k("OpenUI5 Version",i,"ERROR: OpenUI5 version is not available!");return false;}}catch(ex){k("OpenUI5 Version",i,sap.ui.version+", detailed UI5 version info is not available! Possible reason: missing file \"sap-ui-version.json\"");return true;}}function x(i){var m1=a.getApplicationName(window.location.href);if(m1){l("Application URL",i,"#"+m1,window.location.href);return true;}else{k("Application URL",i,"ERROR: Could not extract application name (#semanticObject-action) from URL!");return false;}}function y(i){if(m&&b){var m1=m;if(m.indexOf("./")===0){m1=m.substring(2,m.length);}l("Manifest",i,m1,b);return true;}else{k("Manifest",i,"ERROR: Could not generate link to manifest.json! Possible reason: The application did not finish loading or is not a Fiori Elements application.");return false;}}function z(i){if(!(c)){return false;}var m1=C.getRegistrationIDsByManifest(c);if(m1&&Array.isArray(m1)&&m1.length>0){k((m1.length>1?"Fiori IDs":"Fiori ID"),i,a.concatStrings(m1));return true;}return false;}function B(i){var m1=C.getApplicationComponentByManifest(c);if(m1){k("Application Component (ACH)",i,m1);return true;}else{k("Application Component (ACH)",i,"ERROR: Path /sap.app/ach not found in manifest.json! Possible reason: Invalid manifest.json");return false;}}function E(i){var m1=C.getApplicationIDByManifest(c);if(m1){k("Application ID",i,m1);return true;}else{k("Application ID",i,"ERROR: Path /sap.app/id not found in manifest.json! Possible reason: Invalid manifest.json");return false;}}function H(i){if(c){var m1=C.getFloorplanByManifest(c);}else{m1=C.getFloorplanByStructure();}if(!C.isValidFloorplan(m1)){m1=C.mFloorplans.UNKNOWN;}if(m1===C.mFloorplans.UNKNOWN){k("Floorplan Component (ACH)",i,C.getTicketComponentForFloorplan(m1)+" (ERROR: Unknown floorplan! Possible reason: Invalid manifest.json)");return false;}else{k("Floorplan Component (ACH)",i,C.getTicketComponentForFloorplan(m1)+" ("+m1+")");return true;}}function K(i,m1){if(!(c&&a.hasObjectContent(c))){return false;}if(!(c["sap.app"]&&c["sap.app"].dataSources&&c["sap.app"].dataSources[i])){k("OData Service Metadata",m1,"ERROR: Data source "+i+" not found at /sap.app/dataSources/"+i+" in manifest.json! Possible reason: Invalid manifest.json");return false;}if(!c["sap.app"].dataSources[i].uri){k("OData Service Metadata",m1,"ERROR: Data source URI not found at /sap.app/dataSources/"+i+"/uri in manifest.json! Possible reason: Invalid manifest.json");return false;}var n1=c["sap.app"].dataSources[i].uri;if(n1.lastIndexOf("/")!==n1.length-1){n1+="/";}n1+="$metadata";l("OData Metadata",m1,n1,window.location.origin+n1);return true;}function L(i,m1){if(!(c&&a.hasObjectContent(c)&&r)){return false;}if(!(c["sap.app"]&&c["sap.app"].dataSources&&c["sap.app"].dataSources[i])){k("Annotations",m1,"ERROR: Data source "+i+" not found at /sap.app/dataSources/"+i+" in manifest.json! Possible reason: Invalid manifest.json");return false;}if(!(c["sap.app"].dataSources[i].settings&&c["sap.app"].dataSources[i].settings.annotations&&c["sap.app"].dataSources[i].settings.annotations!==[])){k("Annotations",m1,"ERROR: Data source "+i+" has no annotations at /sap.app/dataSources/"+i+"/settings/annotations in manifest.json! Possible reason: Invalid manifest.json");return false;}var n1=c["sap.app"].dataSources[i].settings.annotations;n1=n1.reverse();for(var o1 in n1){if(!n1.hasOwnProperty(o1)){continue;}var p1=n1[o1];if(c["sap.app"].dataSources[p1]){var q1=c["sap.app"].dataSources[p1].uri;if(!q1){continue;}var r1="";var s1="";if(q1.indexOf("/")===0){s1="Backend Annotation";r1=window.location.origin;}else{s1="Local Annotation";r1=r;if(r1.lastIndexOf("/")!==r1.length-1){r1+="/";}}s1+=" (Prio. "+parseInt(parseInt(o1,10)+1,10)+")";l(s1,m1,c["sap.app"].dataSources[p1].uri,r1+c["sap.app"].dataSources[p1].uri);}}return true;}function N(i){if(!(c)){return;}var m1=0;function n1(v1){m1+=0.01;return v1+m1;}if(!(c["sap.ui5"]&&c["sap.ui5"].models)){k("Data Sources",i,"ERROR: Path /sap.ui5/models not found in manifest.json! Possible reason: Invalid manifest.json");return;}var o1=c["sap.ui5"].models;var p1=[];for(var q1 in o1){if(!o1.hasOwnProperty(q1)){continue;}if(o1[q1]&&o1[q1].dataSource&&o1[q1].dataSource!==""){var r1=false;for(var s1 in p1){if(!p1.hasOwnProperty(s1)){continue;}if(p1[s1].dataSource===o1[q1].dataSource){r1=true;break;}}var t1=(q1===""?"mainService":q1);if(!r1){p1.push({models:[t1],dataSource:o1[q1].dataSource});}else{p1[s1].models.push(t1);}}}if(p1.length===0){k("Data Sources",i,"ERROR: No models with data sources found in manifest.json! Possible reason: Invalid manifest.json");return;}for(var u1 in p1){if(!p1.hasOwnProperty(u1)){continue;}if(!(c["sap.app"]&&c["sap.app"].dataSources)){k("Data Sources",i,"ERROR: No data sources found at /sap.app/dataSources in manifest.json! Possible reason: Invalid manifest.json");return;}if(!c["sap.app"].dataSources[p1[u1].dataSource]){k("Data Sources",i,"ERROR: Data source "+p1[u1].dataSource+" not found at /sap.app/dataSources/"+p1[u1].dataSource+" in manifest.json! Possible reason: Invalid manifest.json");return;}n(a.concatStrings(p1[u1].models),n1(i));K(p1[u1].dataSource,n1(i));L(p1[u1].dataSource,n1(i));}}function O(i){var m1=sap.ui.getCore().byId(i);if(m1){return m1;}else{return sap.ui.xmlview(i,{viewName:"sap.suite.ui.generic.template.support.DiagnosticsTool.view.DiagnosticsTool",viewData:{plugin:o}});}}function R(){var i=O(v);i.placeAt(p);var m1=new J();i.setModel(m1,"data");}function Q(){o=this;A=window.location.hash.slice(1);if(s.isToolStub()){if(!s.hasListeners(p+"SetData")){s.attachEvent(p+"SetData",_);}if(!s.hasListeners(p+"UpdateStatus")){s.attachEvent(p+"UpdateStatus",a1);}if(!s.hasListeners(p+"ShowDataRefreshed")){s.attachEvent(p+"ShowDataRefreshed",b1);}jQuery.sap.fioriElementsPluginID=p;R();}else{if(!s.hasListeners(p+"GetData")){s.attachEvent(p+"GetData",$);}e.unsubscribe("elements","ViewRendered",d1);e.unsubscribe("elements","ViewRenderingStarted",d1);e.subscribe("elements","ViewRendered",d1);e.subscribe("elements","ViewRenderingStarted",d1);if("onhashchange"in window){jQuery(window).bind("hashchange",e1);}}$();}function U(){if(s.isToolStub()){jQuery.sap.fnFEPluginToolInstanceExit=undefined;s.detachEvent(p+"SetData",_);s.detachEvent(p+"UpdateStatus",a1);s.detachEvent(p+"ShowDataRefreshed",b1);O(v).destroy();}else{jQuery.sap.fnFEPluginAppInstanceExit=undefined;s.detachEvent(p+"GetData",$);e.unsubscribe("elements","ViewRendered",d1);e.unsubscribe("elements","ViewRenderingStarted",d1);if("onhashchange"in window){jQuery(window).unbind("hashchange",e1);}}}function V(){s.sendEvent(p+"GetData",{});}function W(){var i=new J();d.sort(a.getDynamicComparator("order"));var m1=new Date().toLocaleTimeString([],{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});var n1=true;if(!d||d.length===0){n1=false;}var o1=a.getApplicationStatus();if(!o1){a.setApplicationStatus(a.mApplicationStatus.UNKNOWN);o1=a.mApplicationStatus.UNKNOWN;}var p1="";if(o1===a.mApplicationStatus.FAILED){p1="The application did not finish loading or is no Fiori Elements application! The shown data below could be collected anyway. If the application finishes loading, the data will be updated automatically.";}i.setData({properties:d,url:window.location.href,origin:window.location.origin,retrieval:m1,copyEnabled:n1,status:o1,statusMessage:p1});s.sendEvent(p+"SetData",JSON.parse(i.getJSON()));}function X(i,m1){s.sendEvent(p+"UpdateStatus",{timeLeft:i,status:m1});}function Y(){s.sendEvent(p+"ShowDataRefreshed",{});}function Z(i){if(b){r=C.getRootPath(b);}d=[];W();w(1);x(2);y(3);W();if(i&&c&&a.hasObjectContent(c)){z(3);B(4);H(5);N(6);W();Y();}else if(b){jQuery.when(a.getFileFromURI(b)).done(function(m1){c=m1;z(3);E(4);B(5);H(6);N(7);}).fail(function(){k("Manifest",3,"ERROR: Could not access manifest.json even though link could be generated! Possible reason: missing permission to access file.");}).always(function(){W();Y();});}}function $(){c=undefined;b=undefined;r=undefined;var i=a.getApplicationStatus();var m1=a.getAppComponent();var n1=false;if(!(i&&a.isValidApplicationStatus(i))){i=a.mApplicationStatus.UNKNOWN;}if(i===a.mApplicationStatus.LOADING){d1();return;}else if(i===a.mApplicationStatus.FAILED){var o1=q(m1);if(o1&&a.hasObjectContent(o1)){c=o1;if(c&&c["sap.app"]&&c["sap.app"].id){b=h(c["sap.app"].id);if(!b){n1=true;}}else{n1=true;}}else{u("Could not load any data because manifest and component of current application are unknown!");Y();return;}}else if(i===a.mApplicationStatus.RENDERED){b=h();if(!b){o1=q(m1);if(o1&&a.hasObjectContent(o1)){c=o1;if(c&&c["sap.app"]&&c["sap.app"].id){b=h(c["sap.app"].id);if(!b){n1=true;}}else{n1=true;}}else{u("Could not load any data because manifest and component of current application are unknown!");Y();return;}}}else if(i===a.mApplicationStatus.UNKNOWN){if(C.getFloorplanByStructure()!==C.mFloorplans.UNKNOWN){c=C.getManifestByStructure();if(c&&a.hasObjectContent(c)){if(c&&c["sap.app"]&&c["sap.app"].id){b=h(c["sap.app"].id);if(!b){n1=true;}}else{n1=true;}}}else{u("Could not load any data because manifest and component of current application are unknown!");Y();return;}}Z(n1);}function _(i){var m1=new J();m1.setJSON(JSON.stringify(i.getParameters()));var n1=O(v);n1.setModel(m1,"data");n1.invalidate();}function a1(i){var m1=i.getParameters();O(v).getController().updateStatus(m1.timeLeft,m1.status);}function b1(){var i=O(v);i.getController().showDataRefreshed();}function c1(){var i=a.getApplicationStatus();if(f>0){X(f,i);}else{f=T;a.setApplicationStatus(a.mApplicationStatus.FAILED);X(0,a.mApplicationStatus.FAILED);I.removeListener(c1);I=undefined;$();}f--;}function d1(i,m1){if(m1==="ViewRenderingStarted"||(!m1&&a.getApplicationStatus()===a.mApplicationStatus.LOADING)){a.setApplicationStatus(a.mApplicationStatus.LOADING);if(!I){f=T;I=new sap.ui.core.IntervalTrigger(1000);I.addListener(c1);}}else if(m1==="ViewRendered"){a.setApplicationStatus(a.mApplicationStatus.RENDERED);f=T;if(I){I.removeListener(c1);I=undefined;}$();}}function e1(m1){function n1(s1){for(var i=0;i<s1.length;i++){if(s1[i]==="/"||s1[i]==="&"||s1[i]==="?"||s1[i]==="~"){return i;}}return s1.length;}function o1(i,s1){if(!i||!s1){return false;}if(i===s1){return true;}var t1=n1(i);var u1=n1(s1);if(t1!==u1){return false;}else if(i.substr(0,t1)===s1.substr(0,u1)){return true;}return false;}var p1,q1,r1=false;if(m1.originalEvent.oldURL&&m1.originalEvent.newURL){p1=m1.originalEvent.oldURL.split("#")[1];q1=m1.originalEvent.newURL.split("#")[1];}else{p1=A;q1=window.location.hash.slice(1);A=q1;}if(p1.length>=q1.length){r1=o1(q1,p1);}else{r1=o1(p1,q1);}if(!r1){a.setApplicationStatus(a.mApplicationStatus.LOADING);a.setAppComponent(undefined);d1();f=(T/2);}}function f1(){return s;}function g1(){return d;}function h1(){d=[];}function i1(i){c=i;}function j1(i){b=i;}function k1(i){m=i;}function l1(i){r=i;}var F=t.testable(F,"DiagnosticsTool_fnFormatDate");var q=t.testable(q,"fnGetManifestFromAppComponent");var j=t.testable(j,"fnAddToData");var k=t.testable(k,"fnAddStringToData");var l=t.testable(l,"fnAddLinkToData");var n=t.testable(n,"fnAddGroupHeaderToData");var u=t.testable(u,"fnDisplayError");var w=t.testable(w,"fnAddVersionInfo");var y=t.testable(y,"fnAddManifestLink");var B=t.testable(B,"fnAddApplicationComponent");var H=t.testable(H,"fnAddFloorplanComponent");var K=t.testable(K,"fnAddODataServiceMetadataLink");var L=t.testable(L,"fnAddAnnotationsLinks");var N=t.testable(N,"fnAddDataSources");var z=t.testable(z,"fnAddFioriID");var E=t.testable(E,"fnAddApplicationID");var f1=t.testable(f1,"fnGetSupportStub");var g1=t.testable(g1,"fnGetData");var h1=t.testable(h1,"fnResetData");var i1=t.testable(i1,"fnSetManifest");var j1=t.testable(j1,"fnSetManifestURL");var k1=t.testable(k1,"fnSetManifestPath");var l1=t.testable(l1,"fnSetsRootPath");return{init:Q,exit:U,getId:G,onRefresh:V};}return P.extend("sap.suite.ui.generic.template.support.DiagnosticsTool.DiagnosticsTool",{constructor:function(s){P.apply(this,[p,"SAP Fiori Elements",s]);jQuery.extend(this,g(s));}});});
