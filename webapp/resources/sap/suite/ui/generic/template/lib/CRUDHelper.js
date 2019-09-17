sap.ui.define(["sap/ui/base/Object","sap/ui/model/Context","sap/suite/ui/generic/template/lib/MessageUtils","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(B,C,M,F,a){"use strict";function c(s,m,g,h,p){g(true);var o=m.createEntry(s,{properties:p,batchGroupId:"Changes",changeSetId:"Changes"});h(s,o);return o;}function b(D,E,s,m,A,p){s=s||"/"+E;if(D.getDraftContext().isDraftEnabled(E)){return D.createNewDraftEntity(E,s,p).then(function(g){return g.context;});}var o=c(s,m,A.setEditableNDC,A.registerNonDraftCreateContext.bind(null,E),p);return Promise.resolve(o);}function r(m,s,t){var p=new Promise(function(g,h){m.read(s,{urlParameters:{"$expand":"DraftAdministrativeData"},success:function(o){g(o);},error:function(o){h(o);}});});t.oBusyHelper.setBusy(p,true);return p;}function R(t,E,k,s,m,T){var p=new Promise(function(g,h){var i,l,P,v,j=[];if(k&&s&&m){l=k.length;for(i=0;i<l;i++){P=k[i].PropertyPath;v=s[P][0];j.push(new F(P,a.EQ,v));}if(t.getDraftController().getDraftContext().isDraftEnabled(E)){var D=new F({filters:[new F("IsActiveEntity","EQ",false),new F("SiblingEntity/IsActiveEntity","EQ",null)],and:false});j.push(D);}var o=new F(j,true);m.read("/"+E,{urlParameters:{"$expand":"DraftAdministrativeData"},filters:[o],success:function(n){var q=f(n,m,s);if(q){g(q);}else{h(n);}},error:function(n){h(n);}});}});T.oBusyHelper.setBusy(p,true);return p;}function f(o,m,s){var g,i,l,h;if(o&&o.results){l=o.results.length;if(l==0){h=null;}else if(l==1){h=o.results[0];}else if(l>=1){var D=[];var A=[];for(i=0;i<l;i++){g=o.results[i];if(g&&g.IsActiveEntity){A.push(g);}else if(g&&g.IsActiveEntity==false){D.push(g);}}if(A.length==0&&D.length>=2){var k;for(var j=0;j<D.length;j++){k=D[j];if(k.DraftUUID==s.DraftUUID){h=k;break;}}if(!h){h=D[0];}}else if(A.length==1&&D.length==1){h=A[0];}else if(A.length==1&&D.length>=2){h=A[0];}}}return h;}function e(t){var A=t.oAppComponent;var m=A.getModel();var o=m.getMetaModel();var n=A.getNavigationController();var g=A.getApplicationController();var D=g.getTransactionController().getDraftController().getDraftContext();var E=function(h){t.oApplicationProxy.getResourceBundleForEditPromise().then(function(i){M.handleError(M.operations.modifyEntity,null,null,h,{resourceBundle:i,navigationController:n,model:m});M.handleTransientMessages(t.oApplicationProxy.getDialogFragment);});};var p=function(h){var i=h.getParameter("context");if(!D.hasDraft(i)){return;}if(!o.getODataEntitySet(i.getPath().split("(")[0].substring(1))){return;}var P=h.getParameter("path");g.propertyChanged(P,i).catch(E);t.oApplicationProxy.markCurrentDraftAsModified();};m.attachPropertyChange(p);}function u(t,D,g){return new Promise(function(h,i){var U=t.oApplicationProxy.getDialogFragment("sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog",{onEdit:function(){U.close();h();},onCancel:function(){U.close();i();}},"Dialog");var s=t.getText("DRAFT_LOCK_EXPIRED",[D.LastChangedByUserDescription||D.LastChangedByUser]);var o=new sap.ui.model.resource.ResourceModel({bundleName:"sap/suite/ui/generic/template/ObjectPage/i18n/i18n",async:true});U.setModel(o,"i18n");U.getModel("Dialog").setProperty("/unsavedChangesQuestion",s);(g||jQuery.noop)();t.oBusyHelper.getUnbusy().then(function(){U.open();});});}function d(t,E,s,m,T,g,k,S){if(s===""&&k&&S){return new Promise(function(h,i){R(t,E,k,S,m,T).then(function(j){var l="/"+m.createKey(E,j);var o=new C(m,l);if(!j.DraftAdministrativeData||j.DraftAdministrativeData.DraftIsCreatedByMe){h(t.editEntity(o,false));}else if(j.DraftAdministrativeData.InProcessByUser){i({lockedByUser:j.DraftAdministrativeData.InProcessByUserDescription||j.DraftAdministrativeData.InProcessByUser});}else{u(T,j.DraftAdministrativeData,g).then(function(){h(t.editEntity(o,false));},function(){i({lockedByUser:j.DraftAdministrativeData.LastChangedByUserDescription||j.DraftAdministrativeData.LastChangedByUser});});}},function(j){i({draftAdminReadResponse:j});});});}var D=t.getDraftController().getDraftContext();var o=new C(m,s);if(D.isDraftEnabled(E)){if(true||!D.hasPreserveChanges(o)){return new Promise(function(h,i){r(m,s,T).then(function(j){if(!j.DraftAdministrativeData||j.DraftAdministrativeData.DraftIsCreatedByMe){h(t.editEntity(o,false));}else if(j.DraftAdministrativeData.InProcessByUser){i({lockedByUser:j.DraftAdministrativeData.InProcessByUserDescription||j.DraftAdministrativeData.InProcessByUser});}else{u(T,j.DraftAdministrativeData,g).then(function(){h(t.editEntity(o,false));},function(){i({lockedByUser:j.DraftAdministrativeData.LastChangedByUserDescription||j.DraftAdministrativeData.LastChangedByUser});});}},function(j){i({draftAdminReadResponse:j});});});}}else{T.oApplicationProxy.setEditableNDC(true);return Promise.resolve({context:o});}}return{createNonDraft:c,create:b,edit:d,enableAutomaticDraftSaving:e};});
