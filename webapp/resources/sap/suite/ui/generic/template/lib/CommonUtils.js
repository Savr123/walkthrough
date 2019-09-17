sap.ui.define(["sap/ui/base/Object","sap/ui/base/Event","sap/ui/core/mvc/ControllerExtension","sap/ui/model/Context","sap/ui/model/Filter","sap/m/Table","sap/m/ListBase","sap/m/MessageBox","sap/ui/generic/app/navigation/service/NavigationHandler","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/lib/testableHelper","sap/base/Log","sap/ui/model/analytics/odata4analytics"],function(B,E,C,a,F,R,L,M,N,b,t,c,o){"use strict";var d=sap.ui.getCore();function f(e,P){var i=sap.ui.require(P);return typeof i==="function"&&(e instanceof i);}function g(e){return f(e,"sap/ui/comp/smarttable/SmartTable");}function h(e){return f(e,"sap/ui/comp/smartchart/SmartChart");}function l(e){return f(e,"sap/ui/table/Table");}function m(e){return f(e,"sap/ui/table/AnalyticalTable");}function n(e){return f(e,"sap/ui/table/TreeTable");}function p(e){return f(e,"sap/m/Table");}function q(e){if(h(e)||g(e)){return e.getEntitySet();}else if(g(e.getParent())){return e.getParent().getEntitySet();}}function r(e){var T=e&&sap.ui.getCore().byId(e);if(T){T.focus();}}var g=t.testableStatic(g,"CommonUtils_isSmartTable");function s(u,S,v){var w;var x=Object.create(null);function y(e){var i,j,k,L1;i=e.getEntitySet();j=u.getOwnerComponent().getModel().getMetaModel();k=j.getODataEntitySet(i);L1=j.getODataEntityType(k.entityType);return L1;}function z(e,i,j){var k=e instanceof E?e.getSource():e;var L1=k.getId();var M1=x[L1];if(!M1){if(j){return null;}M1={control:k,infoObject:Object.create(null),categories:[]};(i||jQuery.noop)(M1.infoObject,M1.categories,k);x[L1]=M1;}return M1.infoObject;}function A(e,i){for(var j in x){var k=x[j];if(k.categories.indexOf(e)>=0){i(k.infoObject,k.control);}}}function D(e){S.oApplication.attachControlToParent(e,u.getView());}function G(e){if(e.getVisible&&!e.getVisible()){return null;}return e.getParent()||e.oContainer;}function H(e){var i=u.getView();var j=false;for(var k=i.getVisible()&&d.byId(e);k&&!j;k=G(k)){j=k===i;}return j;}function I(e){for(var i=0;i<e.length;i++){var j=e[i];if(H(j)){return j;}}return"";}function J(e,i,j,k){return S.oApplication.getDialogFragmentForView(u.getView(),e,i,j,k);}var K;function O(){var e=u.getOwnerComponent();K=K||e.getModel("i18n").getResourceBundle();return K.getText.apply(K,arguments);}function P(k,e,i,j){var L1,M1,N1,O1;var P1=u.getOwnerComponent();var Q1=e.indexOf("::"+P1.getEntitySet()+"--")+2;L1=e.substring(Q1,e.lastIndexOf("::"));L1=L1.replace(/--/g,"|").replace(/::/g,"|");M1=k+"|"+L1;N1=i||k;O1=O(M1,j);if(O1===M1){O1=O(N1,j);}return O1;}function Q(e,i){var i=i||e.getSelectionBehavior();if(i==="DATAPOINT"){return{"dataPoints":e.getSelectedDataPoints().dataPoints,"count":e.getSelectedDataPoints().count};}else if(i==="CATEGORY"){return{"dataPoints":e.getSelectedCategories().categories,"count":e.getSelectedCategories().count};}else if(i==="SERIES"){return{"dataPoints":e.getSelectedSeries().series,"count":e.getSelectedSeries().count};}}function T(e,j,k){var L1=[];if(g(e)){e=e.getTable();}else if(h(e)){e.getChartAsync().then(function(N1){e=N1;if(e&&e.getMetadata().getName()==="sap.chart.Chart"){var O1=false;j=j||e.getSelectionBehavior();k=k||Q(e,j);if(k&&k.count>0){if(j==="DATAPOINT"){O1=true;}var P1=k.dataPoints;var Q1=[];for(var i=0;i<P1.length;i++){if(O1){if(P1[i].context){L1.push(P1[i].context);}}else{Q1.push(P1[i].dimensions);}}if(!O1){L1[0]=Q1;}}}});}if(e instanceof L){L1=e.getSelectedContexts();}else if(l(e)){var M1=e.getSelectedIndices();if(M1){for(var i=0;i<M1.length;i++){L1.push(e.getContextByIndex(M1[i]));}}}return L1;}function U(e){var i={};if(e instanceof sap.ui.core.Element){e.getCustomData().forEach(function(j){i[j.getKey()]=j.getValue();});}return i;}function V(e){var k,L1,M1,N1;var O1=f1(e);if(!g(O1)&&!h(O1)){O1=O1.getParent();}var P1=T(O1);var Q1=O1.getModel();L1=c1(O1);a1(L1,P1,Q1,O1);if(g(O1)){k=O1.getCustomToolbar()&&O1.getCustomToolbar().getContent();}else if(h(O1)){k=O1.getToolbar()&&O1.getToolbar().getContent();}if(k&&k.length>0){for(var i=0;i<k.length;i++){M1=k[i];if(M1.getMetadata().getName()==="sap.m.Button"){W(M1,Q1,P1,O1);}else if(M1.getMetadata().getName()==="sap.m.MenuButton"){N1=M1.getMenu().getItems();if(N1&&N1.length>0){for(var j=0;j<N1.length;j++){M1=N1[j];if(M1.getVisible()){W(M1,Q1,P1,O1);}}}}}}}function W(e,i,j,k){var L1,M1;var N1=U(e);var O1=u.getView();if(N1&&N1.Type){if(N1.originalButtonId){L1=O1.getLocalId(N1.originalButtonId);e=O1.byId(L1);}else{L1=O1.getLocalId(e.getId());}if(N1.Type==="CRUDActionDelete"){M1=$(i,j,k);k.getModel("_templPriv").setProperty("/listReport/deleteEnabled",M1);}else if(N1.Type==="com.sap.vocabularies.UI.v1.DataFieldForAction"||N1.Type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){var P1=i.getMetaModel();M1=Z(i,P1,j,N1.Type,N1.Action,k);}}if(/generic\/controlProperties/.test(e.getBindingPath("enabled"))&&M1!==undefined){Y(L1,"enabled",M1);}}function X(e){var i;var j=f1(e);var k=T(j);var L1=e.getModel();i=d1();a1(i,k,L1,j);}function Y(i,e,j){var k=u.getView().getModel("_templPriv");var L1=k.getProperty("/generic/controlProperties/"+i);if(!L1){L1={};L1[e]=j;k.setProperty("/generic/controlProperties/"+i,L1);}else{k.setProperty("/generic/controlProperties/"+i+"/"+e,j);}}function Z(e,i,k,L1,M1,N1){var O1,P1,Q1,R1;var S1=false;if(L1==="com.sap.vocabularies.UI.v1.DataFieldForAction"){O1=i.getODataFunctionImport(M1);Q1=O1&&O1["sap:action-for"];if(Q1&&Q1!==""&&Q1!==" "){if(k.length>0){R1=O1["sap:applicable-path"];if(R1&&R1!==""&&R1!==" "){for(var j=0;j<k.length;j++){if(!k[j]){continue;}P1=e.getObject(k[j].getPath());if(P1&&P1[R1]){S1=true;break;}}}else{S1=true;}}}else{S1=true;}}else if(L1==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){if(k.length>0||(h(N1)&&N1.getDrillStackFilters().length>0)){S1=true;}}return S1;}function $(e,i,j){if(i.length===0){return false;}var k=_(j);var L1=k&&k.Deletable&&k.Deletable.Path;return i.some(function(M1){var N1=e.getObject(M1.getPath()+"/DraftAdministrativeData");var O1=!(N1&&N1.InProcessByUser&&!N1.DraftIsProcessedByMe);return O1&&!(L1&&!e.getProperty(L1,M1));});}function _(e){var i=e.getModel()&&e.getModel().getMetaModel();var j=i&&i.getODataEntitySet(e.getEntitySet());var k=j&&j["Org.OData.Capabilities.V1.DeleteRestrictions"];return k;}function a1(e,i,j,k){var L1=e1(k);var M1=u.getView().getModel("_templPriv");var N1=M1.getProperty("/generic/listCommons/breakoutActionsEnabled");if(L1){var O1=u.byId("template::IconTabBar");var P1="";if(O1){P1=O1.getSelectedKey();}b1(N1,L1,e,i,j,P1,k);}M1.setProperty("/generic/listCommons/breakoutActionsEnabled",N1);}function b1(e,i,j,k,L1,M1,N1){var O1;for(var P1 in i){O1=true;var Q1=i[P1].id+((M1&&!i[P1].determining)?"-"+M1:"");if(N1&&N1.getId().indexOf("AnalyticalListPage")>-1){O1=!!e[Q1].enabled;}if(i[P1].requiresSelection){if(k.length>0){if(N1&&h(N1)){if(i[P1].filter==="chart"){O1=true;}}else if(N1&&g(N1)){if(i[P1].filter!=="chart"){O1=true;}}if(i[P1].applicablePath!==undefined&&i[P1].applicablePath!==""){O1=false;for(var R1=0;R1<k.length;R1++){var S1="";var T1=i[P1].applicablePath.split("/");if(T1.length>1){for(var U1=0;U1<T1.length-1;U1++){S1+="/"+T1[U1];}}var V1=L1.getObject(k[R1].getPath()+S1);var W1=T1[T1.length-1];if(V1[W1]===true){O1=true;break;}}}}else if(h(N1)){if((N1.getId().indexOf("AnalyticalListPage")>-1?i[P1].filter==="chart":true)){if(N1.getDrillStackFilters().length>0){O1=true;}else{O1=false;}}}else{if(i[P1].filter!=="chart"){O1=false;}}}e[Q1]={enabled:O1};}}function c1(e){var i=[];var j=e1(e);for(var k in j){i.push(j[k].id);}return i;}function d1(){var e=[];var i=e1();for(var j in i){if(i[j].determining){e.push(j);}}return e;}function e1(e){var i=u.getOwnerComponent();var j=i.getAppComponent().getManifestEntry("sap.ui5");var k=j.extends&&j.extends.extensions&&j.extends.extensions["sap.ui.controllerExtensions"];k=k&&k[i.getTemplateName()];k=k&&k["sap.ui.generic.app"];var L1=i.getEntitySet();var M1=U(e).sectionId;if(!M1){return k&&k[L1]&&k[L1]["Actions"];}else{var N1=k&&k[L1]&&k[L1]["Sections"];return N1&&N1[M1]&&N1[M1].Actions;}}function f1(e){var i=e;while(i){if(i instanceof R||l(i)||g(i)||h(i)){return i;}i=i.getParent&&i.getParent();}return null;}function g1(e){if(g(e)){e=e.getTable();}if(l(e)){return e.getBindingInfo("rows");}else if(e instanceof R){return e.getBindingInfo("items");}return null;}function h1(e){var i=g1(e);if(i&&i.binding){i.binding.refresh();}else if(e&&e.rebindTable){e.rebindTable();}}function i1(e){var i=u.getOwnerComponent();var j=i.getModel();var k,L1;var M1=!S.oApplication.checkEtags();if(M1){L1=g1(e);if(L1){k=L1.path;var N1=e.getEntitySet();var O1=j.getMetaModel();var P1=O1.getODataEntitySet(N1);if(u.getMetadata().getName()==='sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage'&&j1(j,P1)){j.invalidateEntityType(P1.entityType);}else{j.invalidate(k1.bind(null,k));}var Q1=i.getId();var R1=Object.create(null);R1[Q1]=true;S.oApplication.refreshAllComponents(R1);}}}function j1(e,i){var j=new o.Model(o.Model.ReferenceByModel(e));var k=j.findQueryResultByName(i.name);var L1=k&&k.getParameterization();return!!L1;}function k1(e,k,i){var j=e[0]==="/"?e.substr(1):e;if(k.split("(")[0]===j){return true;}else{return false;}}function l1(e,i){var j=e.getPath();var k=u.getOwnerComponent();var L1=k.getComponentContainer().getElementBinding();var M1=L1?L1.getPath():"";var N1=null;if(j.indexOf(M1)!==0){N1=g1(i).path;}var O1=!S.oApplication.isNewHistoryEntryRequired(e,N1);var P1;if(v.isDraftEnabled()){P1=S.oDraftController.isActiveEntity(e)?1:6;}else{P1=k.getModel("ui").getProperty("/editable")?6:1;}var Q1=v.getViewLevel();if(Q1===0){var R1=S.oApplication.getForwardNavigationProperty(Q1);}if(R1){var S1=new Promise(function(U1){e.getModel().createBindingContext(R1,e,null,function(V1){if(V1){S.oNavigationController.navigateToContext(V1,N1,O1,P1);U1();}else{v.navigateToDataLoadedFailedPage();U1();}});});var T1=S.oApplication.getBusyHelper();T1.setBusy(S1);}else{S.oNavigationController.navigateToContext(e,N1,O1,P1);}}function m1(e,i){if(e instanceof a){S.oNavigationController.navigateToContext(e,i&&i.navigationProperty,i&&i.replaceInHistory);return;}var j=i&&i.routeName;if(j){v.navigateRoute(j,e,null,i&&i.replaceInHistory);return;}c.warning("navigateToContext called without context or route");}function n1(e){if(e instanceof b){if(e.getErrorCode()==="NavigationHandler.isIntentSupported.notSupported"){M.show(O("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"),{title:O("ST_GENERIC_ERROR_TITLE")});}else{M.show(e.getErrorCode(),{title:O("ST_GENERIC_ERROR_TITLE")});}}}function o1(e,i){D1(function(){w=J1();var j={semanticObject:e.semanticObject,action:e.action};var k=w.mixAttributesAndSelectionVariant(e.parameters);u.adaptNavigationParameterExtension(k,j);w.navigate(e.semanticObject,e.action,k.toJSONString(),null,n1);},jQuery.noop,i,"LeavePage");}function p1(e){var L1=[],M1,N1,O1;var P1=u.getOwnerComponent();var Q1=P1.getModel().getMetaModel();if(!e){return{};}var R1=P1.getAppComponent().getConfig().pages[0];if(!R1){return{};}var S1=function(i){O1=Q1.getODataEntitySet(i.entitySet).entityType;N1=Q1.getODataEntityType(O1);M1={};M1={entitySet:i.entitySet,aKeys:Q1.getODataEntityType(O1).key.propertyRef,navigationProperty:i.navigationProperty};for(var j=0,U1=M1.aKeys.length;j<U1;j++){var k=0,V1=N1.property.length;for(k;k<V1;k++){if(M1.aKeys[j].name===N1.property[k].name){M1.aKeys[j].type=N1.property[k].type;break;}}}};var T1=function(e,R1){if(!R1.pages){return L1;}for(var i=0,j=R1.pages.length;i<j;i++){if(!R1.pages[i]){break;}if(e===R1.pages[i].entitySet){S1(R1.pages[i]);L1.splice(0,0,M1);break;}L1=T1(e,R1.pages[i]);if(L1.length>0){S1(R1.pages[i]);L1.splice(0,0,M1);}}return L1;};return T1(e,R1);}function q1(k,e){var L1,M1,i,N1;for(i=0,N1=k.length;i<N1;i++){if(k[i].navigationProperty){M1+="/"+k[i].navigationProperty;}else{M1="/"+k[i].entitySet;}for(var j=0,O1=k[i].aKeys.length;j<O1;j++){if(j===0){M1+="(";L1="";}else{L1=",";}switch(k[i].aKeys[j].type){case"Edm.Guid":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){M1+=L1+k[i].aKeys[j].name+"="+"guid'"+e.DraftAdministrativeData[k[i].aKeys[j].name]+"'";}else{M1+=L1+k[i].aKeys[j].name+"="+"guid'"+e[k[i].aKeys[j].name]+"'";}break;case"Edm.Boolean":if(e.DraftAdministrativeData&&e.DraftAdministrativeData.DraftIsCreatedByMe){M1+=L1+k[i].aKeys[j].name+"="+false;}else{M1+=L1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;default:if(typeof e[k[i].aKeys[j].name]==="string"){M1+=L1+k[i].aKeys[j].name+"="+"'"+e[k[i].aKeys[j].name]+"'";}else{M1+=L1+k[i].aKeys[j].name+"="+e[k[i].aKeys[j].name];}break;}if(j===(O1-1)){M1+=")";}}}return M1;}function r1(e,k,u){var L1,M1,N1,O1,P1,Q1,R1;var S1={semanticObject:"",action:""};w=J1();L1=w.mixAttributesAndSelectionVariant({},k);for(O1 in e.semanticAttributesOfSemanticObjects){for(N1 in e.semanticAttributesOfSemanticObjects[O1]){if(!L1.getSelectOption(N1)){L1.addParameter(N1,"");}}P1=L1.getPropertyNames();S1.semanticObject=O1;u.adaptNavigationParameterExtension(L1,S1);Q1=L1.getSelectOptionsPropertyNames();R1=L1.getParameterNames();for(var i=0,T1=P1.length;i<T1;i++){if(Q1.indexOf(P1[i])<0&&R1.indexOf(P1[i])<0){delete e.semanticAttributesOfSemanticObjects[O1][P1[i]];L1.removeSelectOption(P1[i]);}}if(O1===e.semanticObject){var U1=e.semanticAttributesOfSemanticObjects[""];for(var j=0,T1=R1.length;j<T1;j++){L1.removeParameter(R1[j]);if(!(R1[j]in U1)){var V1=e.semanticAttributesOfSemanticObjects[e.semanticObject][R1[j]];V1=(typeof V1==="undefined"||V1===null)?"":String(V1);L1.addParameter(R1[j],V1);}}L1=w.mixAttributesAndSelectionVariant(e.semanticAttributesOfSemanticObjects[O1],L1.toJSONString());M1=L1.toJSONString();}}delete e.semanticAttributes;w.processBeforeSmartLinkPopoverOpens(e,M1);}function s1(e,j){var k=function(P1){for(var i=0;i<P1.length;i++){j(P1[i].name);}};var L1=u.getView().getModel().getMetaModel();var M1=L1.getODataEntitySet(e,false);var N1=L1.getODataEntityType(M1.entityType,false);k(N1.key.propertyRef);var O1=S.oDraftController.getDraftContext();if(O1.isDraftEnabled(e)){k(O1.getSemanticKey(e));j("IsActiveEntity");j("HasDraftEntity");j("HasActiveEntity");}}function t1(e,i){if(!v.isDraftEnabled()||!e){return;}var j=e.getControlByKey("EditState");var k=j&&j.getSelectedKey()||"";switch(k){case"1":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("HasDraftEntity","EQ",false));break;case"2":i.filters.push(new F("IsActiveEntity","EQ",false));break;case"3":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("SiblingEntity/IsActiveEntity","EQ",null));i.filters.push(new F("DraftAdministrativeData/InProcessByUser","NE",""));break;case"4":i.filters.push(new F("IsActiveEntity","EQ",true));i.filters.push(new F("SiblingEntity/IsActiveEntity","EQ",null));i.filters.push(new F("DraftAdministrativeData/InProcessByUser","EQ",""));break;default:var L1=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});if(i.filters[0]&&i.filters[0].aFilters){var M1=i.filters[0];i.filters[0]=new F([M1,L1],true);}else{i.filters.push(L1);}break;}}function u1(e,i){if(i){e.filters.push(new F("IsActiveEntity","EQ",true));}else{var j=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});if(e.filters[0]&&e.filters[0].aFilters){var k=e.filters[0];e.filters[0]=new F([k,j],true);}else{e.filters.push(j);}}}function v1(i,j,k){if(j&&i&&i.getAnalyticBindingPath&&i.getConsiderAnalyticalParameters()){try{var L1=i.getAnalyticBindingPath();if(L1){j(L1);}}catch(e){c.warning("Mandatory parameters have no values","",k);}}}function w1(e,j,k){for(var i=0;i<j.length;i++){var L1=j[i];var M1=L1.lastIndexOf("/");var N1;if(M1<0){if(S.oApplication.getNavigationProperty(e,L1)){N1=L1;}else{continue;}}else{N1=L1.substring(0,M1);}if(k.indexOf(N1)===-1){k.push(N1);}}}function x1(e,i,j){var k=e.getParameter("bindingParams"),L1=e.getSource().getId();k.parameters=k.parameters||{};var M1=v.getTemplatePrivateModel();var N1=M1.getProperty("/listReport/vDraftState");var O1=M1.getProperty("/listReport/activeObjectEnabled");var P1=function(W1,X1,L1){if(i&&i[W1]){var Y1=true;var Z1=function(){var $1=arguments[0];if(!($1 instanceof C)){throw new Error("Please provide a valid ControllerExtension in order to execute extension "+W1);}if(!Y1){throw new Error("Extension "+W1+" must be executed synchronously");}var _1=Array.prototype.slice.call(arguments,1);X1.apply(null,_1);};i[W1](Z1,L1);Y1=false;}};var Q1=function(W1){if(!L1||u.byId(L1)===e.getSource()){k.filters.push(W1);}};if((u.getMetadata().getName()!=='sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage')||(u.getMetadata().getName()!=='sap.suite.ui.generic.template.ObjectPage.view.Details')){if(N1=="0"&&v.isDraftEnabled()){u1(k,O1);}else{t1(j,k);}}P1("addExtensionFilters",Q1,L1);if(u.getMetadata().getName()!=='sap.suite.ui.generic.template.ObjectPage.view.Details'){v1(j,i.setBindingPath,i.isAnalyticalListPage?"AnalyticalListPage":"ListReport");}var R1=e.getSource();var S1=R1.getEntitySet();var T1=k.parameters.select&&k.parameters.select.split(",")||[];var U1=k.parameters.expand&&k.parameters.expand.split(",")||[];var V1=function(W1,L1){if(W1&&(!L1||u.byId(L1)===e.getSource())){var X1=W1.split(',');X1.forEach(function(Y1){if(Y1&&jQuery.inArray(Y1,T1)===-1){T1.push(Y1);}});}};if(!i.isAnalyticalListPage){s1(S1,V1);}P1("ensureExtensionFields",V1,L1);(i.addNecessaryFields||jQuery.noop)(T1,V1,S1);w1(S1,T1,U1);if(U1.length>0){k.parameters.expand=U1.join(",");}if(T1.length>0){k.parameters.select=T1.join(",");}}function y1(e,i,j){if(!e){return O("DRAFT_OBJECT");}else if(i){return O(j?"LOCKED_OBJECT":"UNSAVED_CHANGES");}else{return"";}}function z1(){var e=J("sap.suite.ui.generic.template.fragments.DraftAdminDataPopover",{formatText:function(){var i=Array.prototype.slice.call(arguments,1);var k=arguments[0];if(!k){return"";}if(i.length>0&&(i[0]===null||i[0]===undefined||i[0]==="")){if(i.length>3&&(i[3]===null||i[3]===undefined||i[3]==="")){return(i.length>2&&(i[1]===null||i[1]===undefined||i[1]===""))?"":i[2];}else{return O(k,i[3]);}}else{return O(k,i[0]);}},closeDraftAdminPopover:function(){e.close();},formatDraftLockText:y1},"admin");return e;}function A1(e){var i={};if(e){i.discardPromise=e;}var j=u.getView();var k=j.getModel();if(k.hasPendingChanges()){j.setBindingContext(null);k.resetChanges();j.setBindingContext();}v.fire(u,"AfterCancel",{});}function B1(e,i,j,k,L1){var M1=S.oApplication.getBusyHelper();if(!L1&&M1.isBusy()){return;}if(!v.isDraftEnabled()){var N1=false;if(j&&j.aUnsavedDataCheckFunctions){N1=j.aUnsavedDataCheckFunctions.some(function(R1){return R1();});}var O1=u.getView();var P1=O1.getModel();if(N1||P1.hasPendingChanges()){var Q1;G1(function(){A1();Q1=e();},function(){Q1=i();},k,false);return Q1;}}return e();}function C1(e,i,j,k){var L1=false;if(j&&j.aUnsavedDataCheckFunctions){L1=j.aUnsavedDataCheckFunctions.some(function(N1){return N1();});}if(L1||u.getView().getModel().hasPendingChanges()){var M1;G1(function(){u.getView().getModel().resetChanges();v.fire(u,"AfterCancel",{});M1=e();},function(){M1=i();},k,true);return M1;}return e();}function D1(e,i,j,k,L1){if(L1){return B1(e,i,j,k,true);}S.oApplication.performAfterSideEffectExecution(B1.bind(null,e,i,j,k,false));}var E1;var F1;function G1(e,i,j,k){var L1;E1=e;F1=i;var M1=k?"sap.suite.ui.generic.template.fragments.DataLossTechnicalError":"sap.suite.ui.generic.template.fragments.DataLoss";var N1=J(M1,{onDataLossOK:function(){N1.close();E1();},onDataLossCancel:function(){N1.close();F1();}},"dataLoss");j=j||"LeavePage";L1=N1.getModel("dataLoss");L1.setProperty("/mode",j);N1.open();}function H1(e,i,j,k,L1,M1){if(i.busy.check&&k.isBusy()){M1();return;}var N1=i.busy.set?function(){k.setBusy(Promise.resolve(),false,{actionLabel:i.sActionLabel});return e();}:e;var O1=i.mConsiderObjectsAsDeleted?function(Q1){S.oApplication.prepareDeletion(i.mConsiderObjectsAsDeleted);return N1();}:N1;var P1=(i.dataloss.popup?D1(O1,M1,j,(i.dataloss.navigation?"LeavePage":"Proceed"),true):O1());if(P1 instanceof Promise){P1.then(L1,M1);}else{L1();}}function I1(e,i,j){i=jQuery.extend(true,{busy:{set:true,check:true},dataloss:{popup:true,navigation:false}},i);var k=S.oApplication.getBusyHelper();var L1=new Promise(function(M1,N1){S.oApplication.performAfterSideEffectExecution(H1.bind(null,e,i,j,k,M1,N1));});if(i.busy.set){k.setBusy(L1,false,{actionLabel:i.sActionLabel});}return L1;}function J1(){w=w||new N(u);return w;}function K1(e){var j;var k=v.getTemplatePrivateModel();var L1=u.getOwnerComponent();var M1,N1,O1,P1,Q1,R1=[],S1=[],i,T1,U1,V1,W1,X1,Y1;var Z1,$1;M1=L1.getAppComponent();N1=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");O1=k.getProperty("/generic/supportedIntents/");if(h(e)){j=e.getToolbar();}else if(g(e)){j=e.getCustomToolbar();}P1=j.getContent();Q1=P1.length;for(i=0;i<Q1;i++){T1=U(P1[i]);if(T1.hasOwnProperty("SemanticObject")&&T1.hasOwnProperty("Action")){U1=T1.SemanticObject;V1=T1.Action;W1={semanticObject:U1,action:V1,ui5Component:M1};R1.push([W1]);X1=jQuery.extend({},W1);X1.bLinkIsSupported=false;S1.push(X1);}}if(R1.length>0&&N1){Y1=N1.getLinks(R1);Y1.done(function(_1){O1=k.getProperty("/generic/supportedIntents/");Z1=_1.length;for(i=0;i<Z1;i++){if(_1[i][0].length>0){S1[i].bLinkIsSupported=true;}U1=S1[i].semanticObject;V1=S1[i].action;$1=k.getProperty("/generic/supportedIntents/"+U1);if(!$1){O1[U1]={};O1[U1][V1]={"visible":S1[i].bLinkIsSupported};}else if(!$1[V1]){$1[V1]={"visible":S1[i].bLinkIsSupported};}else{$1[V1]["visible"]=S1[i].bLinkIsSupported;}}k.updateBindings();});}}var J1=t.testable(J1,"getNavigationHandler");var a1=t.testable(a1,"fillEnabledMapForBreakoutActions");var c1=t.testable(c1,"getBreakoutActionIds");var f1=t.testable(f1,"getOwnerControl");var T=t.testable(T,"getSelectedContexts");return{isSmartTable:g,isSmartChart:h,isUiTable:l,isAnalyticalTable:m,isTreeTable:n,isMTable:p,getPositionableControlId:I,getCurrentEntitySetName:q,getMetaModelEntityType:y,getText:O,getContextText:P,getNavigationHandler:J1,getNavigationKeyProperties:p1,mergeNavigationKeyPropertiesWithValues:q1,executeGlobalSideEffect:function(){if(v.isDraftEnabled()){var e=u.getView();e.attachBrowserEvent("keydown",function(i){var j=(i.target.type==="search")?true:false;var k=(i.target.type==="textarea")?true:false;var L1=i.target.id.indexOf("rowAction")>-1?true:false;var M1=i.target.id.indexOf("ColumnListItem")>-1?true:false;if(i.keyCode===13&&i.ctrlKey!==true&&e.getModel("ui").getProperty("/editable")&&!j&&!k&&!L1&&!M1){var N1=u.getOwnerComponent().getAppComponent().getConfig();var O1=N1.settings&&N1.settings.forceGlobalRefresh;var P1;S.oApplication.addSideEffectPromise(new Promise(function(Q1){P1=Q1;}));setTimeout(function(){var Q1=S.oApplicationController.executeSideEffects(e.getBindingContext(),null,null,O1);Q1.then(function(){P1();setTimeout(function(){document.getElementById(i.target.id).focus();});});});}});}},setEnabledToolbarButtons:V,setEnabledFooterButtons:X,fillEnabledMapForBreakoutActions:a1,getBreakoutActions:e1,getSelectedContexts:T,getSelectionPoints:Q,getDeleteRestrictions:_,setPrivateModelControlProperty:Y,navigateFromListItem:l1,navigateToContext:m1,navigateExternal:o1,semanticObjectLinkNavigation:r1,getCustomData:function(e){var j=e.getSource().getCustomData();var k={};for(var i=0;i<j.length;i++){k[j[i].getKey()]=j[i].getValue();}return k;},onBeforeRebindTableOrChart:x1,formatDraftLockText:y1,resetChangesAndFireCancelEvent:A1,showDraftPopover:function(e,i){var j=z1();var k=j.getModel("admin");k.setProperty("/IsActiveEntity",e.getProperty("IsActiveEntity"));k.setProperty("/HasDraftEntity",e.getProperty("HasDraftEntity"));j.bindElement({path:e.getPath()+"/DraftAdministrativeData"});if(j.getBindingContext()){j.openBy(i);}else{j.getObjectBinding().attachDataReceived(function(){j.openBy(i);});}},getContentDensityClass:function(){return S.oApplication.getContentDensityClass();},attachControlToView:D,getDialogFragment:J,processDataLossConfirmationIfNonDraft:D1,processDataLossTechnicalErrorConfirmation:C1,securedExecution:I1,getOwnerControl:f1,getTableBindingInfo:g1,refreshSmartTable:h1,refreshModel:i1,getElementCustomData:U,triggerAction:function(e,i,j,k,L1){D1(function(){S.oCRUDManager.callAction({functionImportPath:j.Action,contexts:e,sourceControl:k,label:j.Label,operationGrouping:"",navigationProperty:""}).then(function(M1){if(M1&&M1.length>0){var N1=M1[0];if(N1.response&&N1.response.context&&(!N1.actionContext||N1.actionContext&&N1.response.context.getPath()!==N1.actionContext.getPath())){S.oApplication.getBusyHelper().getUnbusy().then(S.oViewDependencyHelper.setMeToDirty.bind(null,u.getOwnerComponent(),i));}}});},jQuery.noop,L1,"Proceed");},checkToolbarIntentsSupported:K1,getControlInformation:z,executeForAllInformationObjects:A,focusControl:r};}return B.extend("sap.suite.ui.generic.template.lib.CommonUtils",{constructor:function(e,S,i){jQuery.extend(this,s(e,S,i));}});});