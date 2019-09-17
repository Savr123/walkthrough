sap.ui.define(["sap/ui/base/Object","sap/ui/core/mvc/ControllerExtension","sap/ui/generic/app/navigation/service/NavError","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/comp/state/UIState","sap/base/Log","sap/base/util/deepEqual"],function(B,C,N,S,U,L,d){"use strict";var a="sap.suite.ui.generic.template.customData",b="sap.suite.ui.generic.template.extensionData",c="sap.suite.ui.generic.template.genericData";var I=["INIT","DATA_SUITE","CANCEL","RESET","SET_VM_ID"];function n(o){if(o){for(var p in o){o[p]=null;}}}function f(o,O){var k=Object.keys(o);if(k.length!==Object.keys(O).length){return true;}for(var i=0;i<k.length;i++){var K=k[i];var p=o[K];var P=O[K];if(p.length!==P.length){return true;}for(var j=0;j<p.length;j++){if(p[j]!==P[j]){return true;}}}return false;}function l(m,D){if(sap.ui.support){var i=L.getLevel();if(i<L.Level.INFO){L.setLevel(L.Level.INFO);}}var s;if(typeof D==="string"){s=D;}else{s="";var e="";for(var k in D){s=s+e+k+": "+D[k];e="; ";}}L.info(m,s,"sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");}function g(s,o,t){var e=t.oCommonUtils.getNavigationHandler();var h=o.getOwnerComponent().getSmartVariantManagement();var r={appStateKey:"",urlParams:{},selectionVariant:"",tableVariantId:""};var j=false;var k=null;var A=Promise.resolve();var D=false;var m=false;var E=o.byId("editStateFilter");var p;var q=null;var u=null;s.oSmartFilterbar.setSuppressSelection(true);var v=(function(){var i;return function(){i=i||s.oSmartFilterbar.getNonVisibleCustomFilterNames();return i;};})();function w(){return D;}function x(){var i1={};var j1=[];var k1=v();for(var i=0;i<k1.length;i++){var l1=k1[i];if(s.oSmartFilterbar.isVisibleInFilterBarByName(l1)){j1.push(l1);}}var m1={suppressDataSelection:!D,visibleCustomFields:j1};i1[c]=m1;if(E){m1.editStateFilter=E.getSelectedKey();var n1=t.oComponentUtils.getTemplatePrivateModel();var o1=n1.getProperty("/listReport/activeObjectEnabled");m1.activeStateFilter=o1;}var p1=s.oMultipleViewsHandler.getContentForIappState();if(p1){var q1=p1.mode==="single"?"tableViewData":"tableTabData";m1[q1]=p1.state;}if(s.oWorklistData.bWorkListEnabled){var r1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";var s1={"searchString":r1};m1.Worklist=s1;}var t1={};i1[a]=t1;o.getCustomAppStateDataExtension(t1);var u1;var v1=true;var w1=function(x1,y1){if(!(x1 instanceof C)){throw new Error("State must always be set with respect to a ControllerExtension");}if(!v1){throw new Error("State must always be provided synchronously");}if(y1){u1=u1||Object.create(null);var z1=x1.getMetadata().getNamespace();u1[z1]=y1;}};o.templateBaseExtension.provideExtensionAppStateData(w1);v1=false;if(u1){i1[b]=u1;}return i1;}function y(){var i1=JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant());var j1=new S(i1);var k1=o.getVisibleSelectionsWithDefaults();for(var i=0;i<k1.length;i++){if(!j1.getValue(k1[i])){j1.addSelectOption(k1[i],"I","EQ","");}}if(o.byId('template::PageVariant')&&o.byId('template::PageVariant').currentVariantGetModified()&&j1.getID()){j1.setID("");}if(s.oWorklistData.bWorkListEnabled){var l1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";j1.addSelectOption("Worklist.SearchField","I","EQ",l1);}var m1={selectionVariant:j1.toJSONString(),tableVariantId:(!h&&s.oSmartTable.getCurrentVariantId())||"",customData:x()};return m1;}function z(){l("fnStoreCurrentAppStateAndAdjustURL called",{bAppStateDirty:m,bDataAreShownInTable:D});if(!m){return;}m=false;try{q=e.storeInnerAppStateWithImmediateReturn(y(),true);}catch(i){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: "+i);return;}if(q instanceof N){m=true;q=null;return;}q.promise.fail(function(i1){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Error when persisting appState"+i1);});l("Result received from storeInnerAppStateWithImmediateReturn",{appStateKey:q.appStateKey,sAppStateKeyInUrl:u});if(u===q.appStateKey){q=null;}else{l("Call NavigationHandler.replaceHash",{appStateKey:q.appStateKey});e.replaceHash(q.appStateKey);}}function R(i1,j1){var k1=t.oComponentUtils.getTemplatePrivateModel();if(i1&&i1.editStateFilter!==undefined){if(E){E.setSelectedKey((i1.editStateFilter===null)?0:i1.editStateFilter);k1.setProperty("/listReport/vDraftState",(i1.editStateFilter===null)?0:i1.editStateFilter);}k1.setProperty("/listReport/activeObjectEnabled",!!i1.activeStateFilter);if(s.oMultipleViewsHandler.getMode()==="multi"&&E){s.oMultipleViewsHandler.restoreActiveButtonState(i1);}}var l1=i1&&i1.visibleCustomFields;if(l1&&l1.length>0){var m1=s.oSmartFilterbar.getAllFilterItems();for(var i=0;i<m1.length;i++){var n1=m1[i];var o1=n1.getName();if(l1.indexOf(o1)!==-1){n1.setVisibleInFilterBar(true);}}}D=j1&&!(i1&&i1.suppressDataSelection);if(D&&!s.oWorklistData.bWorkListEnabled){s.oSmartFilterbar.search();b1(D);}}function F(i,h){if(h){var i1=i['sap-ui-fe-variant-id'];if(i1&&i1[0]){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(i1[0]);}}else{var j1=i['sap-ui-fe-variant-id'],k1=i['sap-ui-fe-filterbar-variant-id'],l1=i['sap-ui-fe-chart-variant-id'],m1=i['sap-ui-fe-table-variant-id'];G(k1&&k1[0],l1&&l1[0],m1&&m1[0],j1&&j1[0]);}}function G(i,i1,j1,k1){if(i||k1){s.oSmartFilterbar.getSmartVariant().setCurrentVariantId(i||k1);}if(s.oSmartTable&&(j1||k1)){s.oSmartTable.attachAfterVariantInitialise(function(l1){s.oSmartTable.setCurrentVariantId(j1||k1);});s.oSmartTable.setCurrentVariantId(j1||k1);}if(s.oMultipleViewsHandler.getMode()==="multi"){s.oMultipleViewsHandler.setControlVariant(i1,j1,k1);}}function H(i){o.restoreCustomAppStateDataExtension(i||{});}function J(i){if(!i){return;}var i1=true;var j1=function(k1){if(!(k1 instanceof C)){throw new Error("State must always be retrieved with respect to a ControllerExtension");}var l1=k1.getMetadata().getNamespace();if(!i1){throw new Error("State must always be restored synchronously");}return i[l1];};o.templateBaseExtension.restoreExtensionAppStateData(j1);i1=false;}function K(i,i1){i=i||{};if(i.hasOwnProperty(a)&&i.hasOwnProperty(c)){J(i[b]);H(i[a]);R(i[c],i1);}else{if(i._editStateFilter!==undefined){R({editStateFilter:i._editStateFilter});delete i._editStateFilter;}H(i);}s.oSmartFilterbar.fireFilterChange();}function M(){return A.then(function(){if(r.appStateKey){return{"sap-iapp-state":r.appStateKey};}return{};});}function O(i){var i1=t.oComponentUtils.getTemplatePrivateModel();i1.setProperty("/generic/bDataAreShownInTable",i);}function P(i,i1){l("changeIappState called",{bFilterOrSettingsChange:i,bDataAreShown:i1,bDataAreShownInTable:D,bIsTransferringUrlStateToPageState:j,bAppStateDirty:m});O(i1);if(j){return;}if(i||i1!==D){D=i1;if(!m){m=true;if(!s.oSmartFilterbar.isDialogOpen()){if(k){z();}else{setTimeout(z,0);}}}}}function Q(i){var i1=s.oSmartFilterbar.determineMandatoryFilterItems(),j1;for(var k1=0;k1<i1.length;k1++){if(i1[k1].getName().indexOf("P_DisplayCurrency")!==-1){if(i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0]&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low){j1=i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;if(j1){i.oSelectionVariant.addParameter("P_DisplayCurrency",j1);}}break;}}}function T(i,i1,j1){l("fnAdaptToAppState called",{sNavType:j1,sAppStateKeyInUrl:u,sAppStateKey:i.appStateKey,storingInformationAppStateKey:q&&q.appStateKey});s.oSmartFilterbar.setSuppressSelection(false);s.sNavType=j1;var k1=i.appStateKey||"";if(j){return;}if(u===null){u=k1;}else if(k1!==u){return;}var l1=(!k1&&i1)||{};F(l1,h);j=true;var m1=i.selectionVariant||"";var n1=(!h&&i.tableVariantId)||"";var o1=i.oSelectionVariant||"";var p1={selectionVariant:o1,urlParameters:i1,selectedQuickVariantSelectionKey:""};var q1=new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant()));var r1=JSON.parse(JSON.stringify(q1));var s1=q1.getSelectOption(a);var t1=q1.getSelectOption(c);var u1=s.oMultipleViewsHandler.getMode();if((r.appStateKey!==k1||r.selectionVariant!==m1||r.tableVariantId!==n1||f(r.urlParams,l1))&&j1!==sap.ui.generic.app.navigation.service.NavType.initial){if(!q||q.appStateKey!==k1){var v1=i&&i.bNavSelVarHasDefaultsOnly;if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){Q(i);}if(!s.oWorklistData.bWorkListEnabled){if(!v1||s.oSmartFilterbar.isCurrentVariantStandard()){p1.selectionVariant=i.oSelectionVariant;if(j1!==sap.ui.generic.app.navigation.service.NavType.iAppState){o.modifyStartupExtension(p1);h1(p1.selectionVariant,r,m1,true);}else{h1(p1.selectionVariant,r,m1,!v1);}}else{d1(q1,s1,t1,true);p1.selectionVariant=q1;o.modifyStartupExtension(p1);d1(p1.selectionVariant,s1,t1,false);if(!d(JSON.parse(JSON.stringify(p1.selectionVariant)),r1)){h1(p1.selectionVariant,r,m1,true);}}}if(n1!==r.tableVariantId){s.oSmartTable.setCurrentVariantId(n1);}i.customData=i.customData||{};if(u1){var w1=u1==="single"?"tableViewData":"tableTabData";if(i.customData[c]&&i.customData[c][w1]){s.oMultipleViewsHandler.restoreFromIappState(i.customData[c][w1]);}}if(s.oWorklistData.bWorkListEnabled){s.oWorklistData.oWorklistSavedData=i.customData[c]&&i.customData[c]["Worklist"]?i.customData[c]["Worklist"]:{};s.oWorklistHandler.restoreWorklistStateFromIappState();}K(i.customData,true);}r={appStateKey:k1,urlParams:l1,selectionVariant:m1,tableVariantId:n1};}if(j1!==sap.ui.generic.app.navigation.service.NavType.iAppState){if(j1===sap.ui.generic.app.navigation.service.NavType.initial){d1(q1,s1,t1,true);p1.selectionVariant=q1;o.modifyStartupExtension(p1);d1(p1.selectionVariant,s1,t1,false);if(!d(JSON.parse(JSON.stringify(p1.selectionVariant)),r1)){h1(p1.selectionVariant,r,m1,true);}}if(p1.selectedQuickVariantSelectionKey){if(u1){var x1=o.getOwnerComponent().getModel("_templPriv");x1.setProperty("/listReport/multipleViews/selectedKey",p1.selectedQuickVariantSelectionKey);}}}if(k){k();k=null;}if(j1!==sap.ui.generic.app.navigation.service.NavType.iAppState&&!D){var y1=(j1===sap.ui.generic.app.navigation.service.NavType.xAppState||j1===sap.ui.generic.app.navigation.service.NavType.URLParams)&&!i.bNavSelVarHasDefaultsOnly;D=y1||s.bLoadListAndFirstEntryOnStartup||p||s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled()||s.oMultipleViewsHandler.getEnableAutoBinding();O(D);if(D){s.oSmartFilterbar.search();b1(D);}}if(j1==="initial"&&s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){s.oWorklistHandler.restoreWorklistStateFromIappState();}}q=null;j=false;}function V(){if(!k){A=new Promise(function(i1){k=i1;});}var i=new Promise(function(i1,j1){var k1=e.parseNavigation();k1.done(function(l1,m1,n1){T(l1,m1,n1);i1();});k1.fail(function(l1,m1,n1){L.warning(l1.getErrorCode(),"app state could not be parsed - continuing with empty state","sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");T({},m1,sap.ui.generic.app.navigation.service.NavType.initial);i1();});});return i;}function W(){var i=y();s.oSmartFilterbar.setFilterData({_CUSTOM:i.customData});}function X(){P(true,D);}function Y(i){var i1=i.getParameter("context");var j1=s.oSmartFilterbar.getFilterData();if(j1._CUSTOM!==undefined){if(s.oWorklistData.bWorkListEnabled){var k1=j1._CUSTOM[c]["Worklist"];s.oSmartFilterbar.setSuppressSelection(false);s.oWorklistData.oSearchField.setValue(k1.searchString);s.oWorklistData.oSearchField.fireSearch();}else{K(j1._CUSTOM);}}else{var l1=x();n(l1[a]);n(l1[c]);K(l1);}if(I.indexOf(i1)<0){D=i.getParameter("executeOnSelect");P(true,D);}}function Z(){if(!h){P(true,D);}}function $(){if(!h){P(true,D);}}function _(i){u=i["sap-iapp-state"]||"";if(q){if(q.appStateKey!==u){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Got AppstateKey "+u+" expected "+q.appStateKey);return false;}V();return true;}return false;}function a1(){p=s.oSmartTable.getEnableAutoBinding();s.oSmartFilterbar.attachFiltersDialogClosed(z);}function b1(D){var i=o.getOwnerComponent().getModel("_templPriv");if(D){i.setProperty("/listReport/isHeaderExpanded",false);}else{i.setProperty("/listReport/isHeaderExpanded",true);}}function c1(i,i1,j1){var k1=new U({selectionVariant:i});s.oSmartFilterbar.setUiState(k1,{replace:i1,strictMode:j1});}function d1(i,i1,j1,k1){if(i&&(i1||j1)){if(k1){i.removeSelectOption(a);i.removeSelectOption(c);}else{i.massAddSelectOption(a,i1);i.massAddSelectOption(c,j1);}}}function e1(i1,r,j1){if(i1&&(r.selectionVariant!==j1||s.sNavType==="initial")){var k1=i1.getParameterNames().concat(i1.getSelectOptionsPropertyNames());for(var i=0;i<k1.length;i++){s.oSmartFilterbar.addFieldToAdvancedArea(k1[i]);}}}function f1(i,i1,j1){if(i.getParameter(i1)&&!i.getParameter(j1)){i.addParameter(j1,i.getParameter(i1));}if(i.getSelectOption(i1)&&!i.getSelectOption(j1)){var k1=i.getSelectOption(i1);k1.forEach(function(l1){i.addSelectOption(j1,l1.Sign,l1.Option,l1.Low,l1.High);});}}function g1(i){var i1=o.getOwnerComponent().getModel().getMetaModel();var j1=o.getOwnerComponent().getEntitySet();var k1=i1.getODataEntityType(i1.getODataEntitySet(j1).entityType);k1.property.forEach(function(l1){if(l1["com.sap.vocabularies.Common.v1.EditableFieldFor"]){var m1=l1["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;var n1=l1.name;f1(i,m1,n1);f1(i,n1,m1);}});}function h1(i,r,i1,j1){g1(i);e1(i,r,i1);c1(i.toJSONObject(),j1,false);}s.getCurrentAppState=y;return{areDataShownInTable:w,parseUrlAndApplyAppState:V,getUrlParameterInfo:M,changeIappState:P,onSmartFilterBarInitialise:a1,onBeforeSFBVariantFetch:W,onAfterSFBVariantSave:X,onAfterSFBVariantLoad:Y,onAfterTableVariantSave:Z,onAfterApplyTableVariant:$,isStateChange:_};}return B.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler",{constructor:function(s,o,t){jQuery.extend(this,g(s,o,t));}});});
