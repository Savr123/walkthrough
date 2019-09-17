sap.ui.define(["sap/ui/base/Object","sap/ui/base/Event","sap/m/MessageBox","sap/m/Table","sap/ui/model/Sorter","sap/suite/ui/generic/template/lib/testableHelper","sap/ui/model/json/JSONModel","sap/ui/core/library","sap/suite/ui/generic/template/js/AnnotationHelper","sap/suite/ui/generic/template/lib/modelHelper","sap/suite/ui/generic/template/lib/GroupHeaderFormatter","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/core/mvc/Controller","sap/base/Log","sap/suite/ui/generic/template/lib/MessageUtils"],function(B,E,M,T,S,t,J,c,A,m,G,a,C,L,b){"use strict";var V=c.mvc.ViewType;function g(o,d,s,e){function f(i){var j={};for(var k in i){var x=i[k];if(typeof x==="string"){j[k]=x;}else if(typeof x==="object"){if(x.value){j[k]=f(x).value;}else{j[k]=x;}}}return j;}function h(i){if(i instanceof sap.ui.generic.app.navigation.service.NavError){if(i.getErrorCode()==="NavigationHandler.isIntentSupported.notSupported"){sap.m.MessageBox.show(e.getText("ST_NAV_ERROR_NOT_AUTHORIZED_DESC"),{title:e.getText("ST_GENERIC_ERROR_TITLE")});}else{sap.m.MessageBox.show(i.getErrorCode(),{title:e.getText("ST_GENERIC_ERROR_TITLE")});}}}function l(j){var k=j;var x=-1;var l1=e.getOwnerControl(j);if(l1.getTable){l1=l1.getTable();}var m1=e.isAnalyticalTable(l1);var n1=d.getViewLevel();var o1;if(!m1){var p1=e.getTableBindingInfo(l1);var q1=p1&&p1.binding;var r1=null;if(q1){if(e.isTreeTable(l1)){var s1=(q1.getLength()>0)?q1.getLength():0;if(s1>0){r1=[];for(var t1=0;t1<s1;t1++){r1.push(q1.getContextByIndex(t1));}}}else if(e.isUiTable(l1)){r1=q1.getContexts();}else if(l1 instanceof T){r1=q1.getCurrentContexts();}}var u1=null;var v1=null;if(k&&k.getBindingContext&&k.getBindingContext().getPath){v1=k.getBindingContext()?k.getBindingContext().getPath():null;}if(q1&&q1.getContexts&&v1){for(var i=0;i<r1.length;i++){u1=r1[i];if(u1&&u1.getPath()===v1){x=i;break;}}}if(l1&&x!==-1&&r1.length>0){var w1;if(l1 instanceof T){w1=l1.getGrowingThreshold();}else if(e.isUiTable(l1)){w1=l1.getThreshold();}var x1=n1>0?e.getTableBindingInfo(l1).path:null;var y1=function(z1){return{context:z1,navigationData:{navigationProperty:x1}};};o1=r1&&{listBinding:q1,growingThreshold:w1,selectedRelativeIndex:x,objectPageNavigationContexts:r1,navigitionInfoProvider:y1};}}d.setPaginatorInfo(o1,true);}function n(i,j){var k=i.getSource().getUrl();i.preventDefault();e.processDataLossConfirmationIfNonDraft(function(){sap.m.URLHelper.redirect(k,false);},jQuery.noop,j);}function p(j){var k=[];return e.getDialogFragment("sap.suite.ui.generic.template.ListReport.view.fragments.DeleteConfirmation",{onCancel:function(i){var x=i.getSource().getParent();x.close();},onDelete:function(x){var l1=x.getSource().getParent();var m1=l1.getModel("delete");var n1=m1.getProperty("/items");var o1=[];var p1=[];var q1=[];k=[];for(var i=0;i<n1.length;i++){if(!n1[i].draftStatus.locked&&n1[i].deletable){if(!n1[i].draftStatus.draft){if(n1[i].draftStatus.draftActive){q1.push(n1[i].context.sPath);}else if(n1.length===m1.getProperty("/unsavedChangesItemsCount")||!n1[i].draftStatus.unsavedChanges||m1.getProperty("/checkboxSelected")){o1.push(n1[i].context.sPath);}}else{p1.push(n1[i].context.sPath);k.push(n1[i].context.sPath);}}}p1=p1.concat(o1).concat(q1);var r1=s.oCRUDManager.deleteEntities(p1);d.getBusyHelper().setBusy(r1);r1.then(function(s1){var t1=0;var u1=[];for(var i=0;i<s1.length;i++){u1.push("/"+s1[i].split('/')[1]);if(k.indexOf(u1[i])!==-1){t1=t1+1;}}var v1=p1.length-q1.length-(s1.length-t1);if((s1.length-t1)>0){var w1="";if(v1>0){w1+=(v1>1)?e.getText("ST_GENERIC_DELETE_SUCCESS_PLURAL_WITH_COUNT",[v1]):e.getText("ST_GENERIC_DELETE_SUCCESS_WITH_COUNT",[v1]);w1+="\n";w1+=(s1.length>1)?e.getText("ST_GENERIC_DELETE_ERROR_PLURAL_WITH_COUNT",[s1.length]):e.getText("ST_GENERIC_DELETE_ERROR_WITH_COUNT",[s1.length]);}else{w1=(s1.length>1)?e.getText("ST_GENERIC_DELETE_ERROR_PLURAL"):e.getText("ST_GENERIC_DELETE_ERROR");}M.error(w1);}else{var x1="";x1=(v1>1)?e.getText("ST_GENERIC_DELETE_SUCCESS_PLURAL"):e.getText("ST_GENERIC_OBJECT_DELETED");b.showSuccessMessageIfRequired(x1,s);}e.refreshSmartTable(j);},jQuery.noop);l1.close();}},"delete");}function q(i,j){return new Promise(function(k,x){j.read(i+"/SiblingEntity",{success:function(l1){var m1="/"+j.getKey(l1);k(m1);},error:function(l1){var m1="Error";k(m1);}});});}function r(j){var k=o.getView().getModel();var x=k.getMetaModel();var l1=x.getODataEntitySet(o.getOwnerComponent().getEntitySet());var m1=l1["Org.OData.Capabilities.V1.DeleteRestrictions"];var n1=(m1&&m1.Deletable&&m1.Deletable.Path)?m1.Deletable.Path:"";var o1={items:undefined,itemsCount:j.length,text:{title:undefined,text:undefined,unsavedChanges:undefined,longText:undefined,undeletableText:undefined},lockedItemsCount:0,unsavedChangesItemsCount:0,undeletableCount:0,checkboxSelected:true};var p1=[];var q1=[];var r1,s1,t1,u1,v1;var w1=[];for(var i=0;i<j.length;i++){r1=k.getObject(j[i].getPath());if(!r1.IsActiveEntity){if(r1.HasActiveEntity){w1.push(q(j[i].getPath(),k));}}}var x1=0;return new Promise(function(y1,z1){Promise.all(w1).then(function(A1){for(var i=0;i<j.length;i++){r1=k.getObject(j[i].getPath());s1={};t1={};u1=true;v1={};if(!r1.IsActiveEntity){s1.draft=true;if(r1.HasActiveEntity){t1.draft=false;t1.draftActive=true;if(A1[x1]!="Error"){v1["oModel"]=j[0].getModel();v1["sPath"]=A1[x1++];}}}else if(r1.HasDraftEntity){var B1=k.getProperty("DraftAdministrativeData/CreatedByUserDescription",j[i]);var C1=k.getProperty("DraftAdministrativeData/InProcessByUser",j[i]);if(C1){s1.locked=true;s1.user=B1;o1.lockedItemsCount++;}else{s1.unsavedChanges=true;s1.user=B1;o1.unsavedChangesItemsCount++;}}if(n1&&n1!==""){if(k.getProperty(n1,j[i])===false){u1=false;o1.undeletableCount++;}}p1.push({context:j[i],draftStatus:s1,deletable:u1});if(!r1.IsActiveEntity&&r1.HasActiveEntity){q1.push({context:v1,draftStatus:t1,deletable:u1});}}if(q1.length>0){p1=p1.concat(q1);}o1.items=p1;if(o1.lockedItemsCount===o1.itemsCount){o1.text.title=e.getText("ST_GENERIC_ERROR_TITLE");}else{o1.text.title=(o1.itemsCount>1)?e.getText("ST_GENERIC_DELETE_TITLE_WITH_COUNT",[o1.itemsCount]):e.getText("ST_GENERIC_DELETE_TITLE");}o1.text.unsavedChanges=e.getText("ST_GENERIC_UNSAVED_CHANGES_CHECKBOX");if(o1.itemsCount>1){if(o1.lockedItemsCount===o1.itemsCount){o1.text.text=e.getText("ST_GENERIC_DELETE_LOCKED_PLURAL");}else if(o1.unsavedChangesItemsCount===o1.itemsCount){o1.text.text=e.getText("ST_GENERIC_DELETE_UNSAVED_CHANGES_PLURAL");}else if(o1.lockedItemsCount>0){var D1=o1.itemsCount-o1.lockedItemsCount;o1.text.text=(o1.lockedItemsCount>1)?e.getText("ST_GENERIC_CURRENTLY_LOCKED_PLURAL",[o1.lockedItemsCount,o1.itemsCount]):e.getText("ST_GENERIC_CURRENTLY_LOCKED",[o1.itemsCount]);o1.text.text+="\n";if(D1===o1.unsavedChangesItemsCount){o1.text.text+=(D1>1)?e.getText("ST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES_PLURAL"):e.getText("ST_GENERIC_DELETE_REMAINING_UNSAVED_CHANGES");}else{o1.text.text+=(D1>1)?e.getText("ST_GENERIC_DELETE_REMAINING_PLURAL",[D1]):e.getText("ST_GENERIC_DELETE_REMAINING");}}else{o1.text.text=e.getText("ST_GENERIC_DELETE_SELECTED_PLURAL");}o1.text.undeletableText=e.getText("ST_GENERIC_DELETE_UNDELETABLE",[o1.undeletableCount,o1.itemsCount]);}else{if(o1.lockedItemsCount>0){o1.text.text=e.getText("ST_GENERIC_DELETE_LOCKED",[" ",o1.items[0].draftStatus.user]);}else if(o1.unsavedChangesItemsCount>0){o1.text.text=e.getText("ST_GENERIC_DELETE_UNSAVED_CHANGES",[" ",o1.items[0].draftStatus.user]);}else{o1.text.text=e.getText("ST_GENERIC_DELETE_SELECTED");}}y1(o1);});});}function u(i,j,k,x){var l1=e.getNavigationHandler();var m1={};var n1={};for(var o1 in i.parameters){if(jQuery.isEmptyObject(i.parameters[o1])){m1[o1]=i.parameters[o1];}else{n1[o1]=i.parameters[o1];}}n1=f(n1);l1.mixAttributesAndSelectionVariant({},x).getParameterNames().forEach(function(o1){delete m1[o1];});var p1=k&&k.getObject();var q1=j&&j.getObject?j.getObject():j&&j[0];var r1=jQuery.extend({},m1,p1,q1,n1);return l1.mixAttributesAndSelectionVariant(r1,x);}function N(i,j,k,x){var l1=e.getNavigationHandler();var m1;if(k){m1=k.getUiState().getSelectionVariant();if(typeof m1!=="string"){m1=JSON.stringify(m1);}}var n1=u(i,j,o.getView().getBindingContext(),m1);var o1={semanticObject:i.semanticObject,action:i.action};o.adaptNavigationParameterExtension(n1,o1);l1.navigate(i.semanticObject,i.action,n1.toJSONString(),null,h);}function v(i){var j=e.getNavigationHandler();var k={semanticObject:i.semanticObject,action:i.action};var x=j.mixAttributesAndSelectionVariant(i.semanticAttributes);o.adaptNavigationParameterExtension(x,k);j.navigate(i.semanticObject,i.action,x.toJSONString(),null,h);}function H(i,k){var x=i.byId("icon");var l1=x&&x.getSrc();if(l1===""){l1=undefined;}var m1=i.byId("title");var n1=m1&&m1.getText();if(n1===""){n1=undefined;}var o1=i.byId("description");var p1=o1&&o1.getText();if(p1===""){p1=undefined;}for(var j=0;j<k.length;j++){var q1=k[j];var r1=A.getStableIdPartFromFacet(q1)+"::contactTitleAreaIcon";var s1=i.byId(r1);var t1=A.getStableIdPartFromFacet(q1)+"::contactTitleAreaTitle";var u1=i.byId(t1);var v1=A.getStableIdPartFromFacet(q1)+"::contactTitleAreaDescription";var w1=i.byId(v1);var x1=s1&&s1.getSrc();if(x1===""){x1=undefined;}var y1=u1&&u1.getText();if(y1===""){y1=undefined;}var z1=w1&&w1.getText();if(z1===""){z1=undefined;}if(l1&&x1&&n1&&y1&&p1&&z1){if((l1===x1||!x1)&&(n1===y1||!y1)&&(p1===z1||!z1)){var A1=A.getStableIdPartFromFacet(q1)+"::contactTitleArea";var B1=i.byId(A1);if(B1&&B1.setVisible){B1.setVisible(false);}}}}}function w(i,j,k,x){var l1=o.getOwnerComponent().getAppComponent().getManifestEntry("sap.app");var m1=l1.crossNavigation.outbounds[i.data("CrossNavigation")];var n1;if(k){if(e.isSmartChart(i)){n1=e.getOwnerControl(x)||e.getOwnerControl(i);}else{n1=e.getOwnerControl(i).getParent();}}N(m1,j,k,n1);}function y(i,j){}function O(i,j){e.processDataLossConfirmationIfNonDraft(function(){var k=i.data('SemanticObject');var x=i.data('Action');var l1=i.data('SemanticAttributes');if(k&&x){var m1={semanticObject:k,action:x};if(l1){l1="{"+l1+"}";m1.semanticAttributes=JSON.parse(l1);}v(m1);}},jQuery.noop);}function z(k,x,l1,m1,n1){var o1="";var p1=function(V1){var W1=V1.dependent.propertyRef;var X1=x.originalId;var Y1=o.getView().byId(X1);if(Y1&&Y1.mProperties.fieldName){for(var Z1 in W1){if(W1[Z1].name===Y1.mProperties.fieldName){o1=Y1.mProperties.fieldName;return true;}}}if(!Y1){var $1=jQuery("#"+X1.replace(/(:|\.|\[|\]|,|=)/g,"\\$1"));if($1){Y1=$1.control(0);if(Y1&&Y1.mProperties.fieldName){for(var Z1 in W1){if(W1[Z1].name===Y1.mProperties.fieldName){o1=Y1.mProperties.fieldName;return true;}}}}}return false;};var q1=function(){var r1,y1,V1,W1,X1,Y1,Z1;y1=k.getModel().getMetaModel();V1=y1.getODataEntitySet(k.getEntitySet());W1=y1.getODataEntityType(V1.entityType);if(!W1||!W1.navigationProperty){return;}for(var i=0;i<W1.navigationProperty.length;i++){X1=W1.navigationProperty[i];if(X1.name==="SiblingEntity"||X1.name==="DraftAdministrativeData"){continue;}var $1=X1.relationship;var _1=$1.lastIndexOf(".");var a2=$1.slice(0,_1);var b2=$1.slice(_1+1);var c2=y1.getObject("/dataServices/schema");var d2;for(var j in c2){if(c2[j].namespace===a2){d2=c2[j];break;}}var e2=d2.association;var f2;for(var j in e2){if(e2[j].name===b2){f2=e2[j];break;}}var g2=f2.referentialConstraint;if(g2&&g2.dependent&&g2.dependent.propertyRef){var h2=p1(g2);if(h2){Y1=y1.getODataAssociationEnd(W1,X1.name);Z1=y1.getODataEntityType(Y1.type);var i2=y1.getODataEntityContainer();var j2="";var k2="";var l2="";for(var j=0;j<i2.entitySet.length;j++){var m2=Z1.entityType;if(!m2){m2=Z1.namespace+"."+Z1.name;}if(i2.entitySet[j].entityType===m2){j2=i2.entitySet[j].name;k2=i2.entitySet[j].entityType;break;}}r1={navigation:X1.name,entitySet:j2,entityType:k2};if(Z1["com.sap.vocabularies.UI.v1.HeaderInfo"]&&k2){var l2=y1.getODataEntityType(k2,true)+"/com.sap.vocabularies.UI.v1.HeaderInfo";r1.headerInfoPath=l2;}if(Z1["com.sap.vocabularies.UI.v1.QuickViewFacets"]&&k2){var n2=y1.getODataEntityType(k2,true)+"/com.sap.vocabularies.UI.v1.QuickViewFacets";r1.quickViewFacetODataPath=n2;}if(r1.headerInfoPath||r1.quickViewFacetODataPath){return r1;}}}}return r1;};var r1=q1();var s1=false;var t1=false;var u1=false;var v1=[];var w1=o.getOwnerComponent();var x1=w1.getModel();var y1=x1.getMetaModel();if(r1){if(r1.quickViewFacetODataPath){var z1=y1.createBindingContext(r1.quickViewFacetODataPath,true);var A1=z1&&z1.getModel().getObject(z1.getPath());if(A1){s1=true;for(var j=0;j<A1.length;j++){var B1=A1[j];if(B1&&B1.Target&&B1.Target.AnnotationPath){if(B1.Target.AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.FieldGroup")>-1){t1=true;}else if(B1.Target.AnnotationPath.indexOf("com.sap.vocabularies.Communication.v1.Contact")>-1){u1=true;v1.push(B1);}}}}}}if(s1){var C1,D1;C1=y1.getODataEntitySet(k.getEntitySet());D1=y1.getODataEntityType(C1.entityType);var E1=r1.headerInfoPath&&y1.createBindingContext(r1.headerInfoPath,true);var n1=x.mainNavigation;var F1=x.semanticObject;var G1,H1;if(F1&&n1){var I1=n1.getTarget&&n1.getTarget()||"";var J1=n1.getKey&&n1.getKey();if(J1){var K1=J1.split(F1+"-");G1=K1&&K1[1];if(F1&&G1){H1={"Target":I1,"SemanticObject":F1,"Action":G1};}if(x.semanticAttributes){H1.SemanticAttributes=x.semanticAttributes;for(var i in x.semanticAttributes){var L1=x.semanticAttributes[i];if(L1.indexOf("{\"__deferred\":")>-1){delete H1.SemanticAttributes[i];}if(L1.indexOf("{\"__ref\":")>-1){delete H1.SemanticAttributes[i];}}if(H1.SemanticAttributes){var M1=JSON.stringify(H1.SemanticAttributes);if(M1&&M1.length>1){H1.SemanticAttributes=M1.substring(1,M1.length-1);}}}}}var N1=y1.getODataProperty(D1,o1);var O1=k&&k.mProperties&&k.mProperties.fieldSemanticObjectMap;var P1=new J({sourceClickedField:N1,sourceEntityType:D1,showFieldGroup:t1,showContact:u1,ignoredFields:O1,navigationPath:r1.navigation,mainNavigation:H1});P1.setDefaultBindingMode("OneWay");var Q1;var R1=C.extend("",{oState:l1,_templateEventHandlers:{onSemanticObjectLinkNavigationPressed:o._templateEventHandlers.onSemanticObjectLinkNavigationPressed.bind(o._templateEventHandlers),onDataFieldWithIntentBasedNavigation:o._templateEventHandlers.onDataFieldWithIntentBasedNavigation.bind(o._templateEventHandlers)},onInit:function(){},onExit:function(){},onAfterRendering:function(){var S1=this.oView;var V1=S1.getParent().getParent().getParent();V1.setBusy(false);}});Q1=new R1();R1.connectToView=o.connectToView.bind(Q1);var S1=sap.ui.view({async:true,preprocessors:{xml:{bindingContexts:{sourceEntitySet:y1.createBindingContext(y1.getODataEntitySet(k.getEntitySet(),true)),entitySet:y1.createBindingContext(y1.getODataEntitySet(r1.entitySet,true)),header:E1,facetCollection:z1},models:{sourceEntitySet:y1,entitySet:y1,header:y1,facetCollection:y1,quickView:P1,parameter:d.getParameterModelForTemplating()}}},controller:Q1,type:V.XML,viewName:"sap.suite.ui.generic.template.fragments.QuickViewSmartForm",height:"100%"});x.show(undefined,undefined,undefined,S1);var T1=function(V1){var W1=V1.getSource();if(W1){var X1=W1.getParent().getParent().getParent();X1.setBusy(true);X1.setBusyIndicatorDelay(10);}};S1.attachBeforeRendering(T1.bind(this));var U1=function(V1){var W1=V1.getSource();if(W1){var X1=W1.byId("ownTitleArea");if(X1){var Y1=W1.getParent();if(Y1&&Y1.getItems){var Z1=Y1.getItems()&&Y1.getItems()[0];if(Z1&&Z1!=W1){Z1.setVisible(false);}}}if(u1&&v1&&X1){H(W1,v1);}}};S1.attachAfterRendering(U1.bind(this));}else{x.show(m1,n1,undefined,undefined);}}function D(o,i){var x=o.getView&&o.getView().getBindingContext();var l1=x.getObject();var m1=o.getOwnerComponent().getModel().getMetaModel();var n1=m1.getODataEntitySet(o.getOwnerComponent().getEntitySet());var o1=m1.getODataEntityType(n1.entityType);var p1=o1["com.sap.vocabularies.Common.v1.SemanticKey"];var q1={};if(p1&&p1.length>0){for(var j=0;j<p1.length;j++){var r1=p1[j].PropertyPath;if(!q1[r1]){q1[r1]=[];q1[r1].push(l1[r1]);}}}else{for(var k in o1.key.propertyRef){var s1=o1.key.propertyRef[k].name;if(!q1[s1]){q1[s1]=[];q1[s1].push(l1[s1]);}}}return q1;}function F(k,i,x,l1){if(k[i].entitySet==x&&l1===k[i].navigationProperty&&k[i].navigation&&k[i].navigation["display"]&&(k[i].component&&k[i].component.settings&&k[i].component.settings.hideChevronForUnauthorizedExtNav===true)){return k[i].navigation.display.target;}else if(k[i].entitySet==x&&k[i].navigation&&k[i].navigation["display"]&&(k[i].component&&k[i].component.settings&&k[i].component.settings.hideChevronForUnauthorizedExtNav===true)){return k[i].navigation.display.target;}else if(k[i].pages){for(var j=0;j<(k[i].pages.length);j++){var m1=F(k[i].pages,j,x,l1);if(m1!==undefined&&m1!==null){return m1;}}}}function I(i){var j=i.getSource().getTable();var k=i.getSource().getEntitySet();var x=i.getSource().getTableBindingPath();var l1=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");var m1=o.getOwnerComponent().getAppComponent().getConfig().pages;var n1=F(m1,0,k,x);if(n1!==undefined&&n1!==null&&l1){var o1=o.getOwnerComponent().getAppComponent().getManifestEntry("sap.app").crossNavigation.outbounds[n1];if(o1){var p1=o1.semanticObject;var q1=o1.action;var r1=o.getView().getModel("_templPriv");var s1=r1.getProperty("/generic/supportedIntents/");var t1=(x==="")?k:k+"::"+x;var u1=r1.getProperty("/generic/supportedIntents/"+p1+"/"+q1+"/"+t1);if(!u1){var v1={},w1;var x1=o.getOwnerComponent().getAppComponent();for(var y1 in o1.parameters){if(!jQuery.isEmptyObject(o1.parameters[y1])){v1[y1]=o1.parameters[y1];}}if(o.getMetadata().getName()==='sap.suite.ui.generic.template.ObjectPage.view.Details'){w1=D(o,x1);}var z1={semanticObject:p1,action:q1};var A1=jQuery.extend({},w1,v1);var B1={target:z1,params:A1};var C1=l1.isNavigationSupported([B1],x1);C1.done(function(D1){var E1=r1.getProperty("/generic/supportedIntents/"+p1);if(!E1){s1[p1]={};s1[p1][q1]={};s1[p1][q1][t1]={"supported":D1[0].supported};}else if(!E1[q1]){E1[q1]={};E1[q1][t1]={"supported":D1[0].supported};}else{E1[q1][t1]={"supported":D1[0].supported};}r1.updateBindings();if(D1[0].supported&&e.isUiTable(j)){var F1=j.getRowActionTemplate();F1.getItems()[0].setVisible(true);j.setRowActionTemplate(F1);}});}}}}function K(i){e.setEnabledToolbarButtons(i.getSource());I(i);}function P(l1,m1){var n1=l1.getSource();var o1=n1.getTable();var p1=e.isMTable(o1);var q1=o1.getColumns();if(!m1||(m1&&!m1.isAnalyticalListPage)&&p1){for(var r1=0;r1<q1.length;r1++){if(q1[r1].getCustomData()[0].getValue()&&q1[r1].getCustomData()[0].getValue()["actionButton"]==="true"){q1[r1].setPopinDisplay("WithoutHeader");}}}var s1=l1.getParameter("bindingParams");s1.parameters=s1.parameters||{};if(n1.data().allowSearchWorkListLight){s1.parameters["custom"]={"search":l1.getSource().data().searchString};n1.data("allowSearchWorkListLight",false);if(l1.getSource().data().searchString){s1.parameters["custom"]={"search":l1.getSource().data().searchString};}}var t1=o.byId(n1.getSmartFilterId());if(!t1&&o.getMetadata().getName()==='sap.suite.ui.generic.template.ListReport.view.ListReport'){t1=o.byId("listReportFilter");var u1=t1.getBasicSearchValue();if(u1){s1.parameters["custom"]={"search":u1};}}m1=m1||Object.create(null);m1.setBindingPath=n1.setTableBindingPath.bind(n1);m1.addNecessaryFields=function(v1,w1,x1){var y1=n1.getModel().getMetaModel();var z1=y1.getODataEntitySet(x1);var A1=y1.getODataEntityType(z1.entityType);if(v1.length>0){if(!m1.isAnalyticalListPage){var B1={};for(var C1=0;C1<v1.length;C1++){var D1=v1[C1];if(D1){var B1=y1.getODataProperty(A1,D1);if(B1&&B1["com.sap.vocabularies.Common.v1.FieldControl"]&&B1["com.sap.vocabularies.Common.v1.FieldControl"].Path){var E1=B1["com.sap.vocabularies.Common.v1.FieldControl"].Path;if(E1!==" "){w1(E1);}}}}var F1=z1["Org.OData.Capabilities.V1.DeleteRestrictions"];w1(F1&&F1.Deletable&&F1.Deletable.Path);var G1=z1["Org.OData.Capabilities.V1.UpdateRestrictions"];w1(G1&&G1.Updatable&&G1.Updatable.Path);var H1=A1["com.sap.vocabularies.UI.v1.LineItem"]||[];var I1=A1["com.sap.vocabularies.UI.v1.LineItem"];var J1=A1["com.sap.vocabularies.UI.v1.LineItem@com.sap.vocabularies.UI.v1.Criticality"];var K1=n1.getCustomData();for(var x=0;x<K1.length;x++){if(K1[x].getKey()&&K1[x].getKey()==="lineItemQualifier"){var L1=K1[x].getValue();if(L1){J1=A1["com.sap.vocabularies.UI.v1.LineItem#"+L1+"@com.sap.vocabularies.UI.v1.Criticality"];break;}}}w1(I1&&J1&&J1.Path);}else{var K1=n1.getCustomData(),H1;for(var i=0;i<K1.length;i++){if(K1[i].getKey()&&K1[i].getKey()==="lineItemQualifier"&&K1[i].getValue()){var L1=K1[i].getValue();H1=A1["com.sap.vocabularies.UI.v1.LineItem#"+L1];break;}}if(!H1){H1=A1["com.sap.vocabularies.UI.v1.LineItem"];}}for(var C1=0;C1<H1.length;C1++){if(!m1.isAnalyticalListPage){var M1,N1;if(H1[C1].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"){M1=y1.getODataFunctionImport(H1[C1].Action.String,true);if(M1){N1=y1.getObject(M1);if(N1["sap:action-for"]!==" "&&N1["sap:applicable-path"]!==" "){w1(N1["sap:applicable-path"]);}}}}if(H1[C1].RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation"||(H1[C1].RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath")){var O1,P1;if(H1[C1].Value&&H1[C1].Value.Path){O1=y1.getODataProperty(A1,H1[C1].Value.Path);if(O1){P1=O1["sap:text"]||(O1["com.sap.vocabularies.Common.v1.Text"]||"").Path||"";}if(!P1){P1=H1[C1].Value.Path;}w1(P1);}}if(H1[C1].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAnnotation"){if(H1[C1].Target&&H1[C1].Target.AnnotationPath&&H1[C1].Target.AnnotationPath.indexOf("com.sap.vocabularies.UI.v1.FieldGroup")>=0){var Q1=H1[C1].Target.AnnotationPath;var R1=A1[Q1.split("@")[1]];H1=H1.concat(R1&&R1.Data);continue;}if(H1[C1].Target&&H1[C1].Target.AnnotationPath){var Q1=H1[C1].Target.AnnotationPath;var S1=Q1.split("@")[1];var R1=A1[S1];if(R1&&R1.MeasureAttributes){if(R1.MeasureAttributes[0]&&R1.MeasureAttributes[0].DataPoint&&R1.MeasureAttributes[0].DataPoint.AnnotationPath){var T1=R1.MeasureAttributes[0].DataPoint.AnnotationPath.split("@")[1];var U1=A1[T1];if(U1){for(var V1 in U1){w1(U1[V1]&&U1[V1].Path);if(V1==="CriticalityCalculation"&&U1.CriticalityCalculation){for(var W1 in U1.CriticalityCalculation){w1(U1.CriticalityCalculation[W1].Path);}}}}}}w1(R1&&R1.Measures&&R1.Measures[0]&&R1.Measures[0].PropertyPath);}}}if(!m1.isAnalyticalListPage){var X1=e.getBreakoutActions(n1);for(var Y1 in X1){w1(X1[Y1].requiresSelection&&X1[Y1].applicablePath);}}}var Z1=n1.getCustomData();var $1={};for(var k=0;k<Z1.length;k++){$1[Z1[k].getKey()]=Z1[k].getValue();}var _1=n1.fetchVariant();if(!$1.TemplateSortOrder&&m1&&m1.determineSortOrder){$1.TemplateSortOrder=m1.determineSortOrder();}if((!_1||!_1.sort)&&$1.TemplateSortOrder){var a2=$1.TemplateSortOrder.split(", ");for(var j=0;j<a2.length;j++){var b2=a2[j].split(" ");if(b2.length>1){s1.sorter.push(new S(b2[0],b2[1]==="true"));}else{s1.sorter.push(new S(b2[0]));}}}if(p1){var c2=s1.sorter.filter(function(d2){return d2.vGroup;});if(c2.length){var d2=c2[0];var e2=m.getODataProperty(y1,A1,d2.sPath);var f2=e2["com.sap.vocabularies.Common.v1.Text"]&&e2["com.sap.vocabularies.Common.v1.Text"].Path;w1(f2);if(_1.group&&_1.group.groupItems&&_1.group.groupItems.length){var g2=_1.group.groupItems[0].columnKey;var h2=q1.filter(function(m2){return m2.data("p13nData").columnKey===g2;});if(h2.length){var i2=h2[0];var j2=i2.data("p13nData").additionalProperty;if(j2){j2.split(",").forEach(function(m2){w1(m2);});}var k2=i2.getHeader().getText();d2.fnGroup=G.getGroupFunctionForMTable(n1,d2.sPath,k2);}}}}if(e.isAnalyticalTable(o1)){G.setGroupFunctionForAnalyticalTable(n1);}if(!m1.isAnalyticalListPage){var l2=s.oDraftController.getDraftContext();if(l2.isDraftEnabled(x1)&&l2.isDraftRoot(x1)&&l2.hasDraftAdministrativeData(x1)){if(v1.length>0){w1("DraftAdministrativeData");}}}};e.onBeforeRebindTableOrChart(l1,m1,t1);}function Q(i,j,k,x,l1){var m1=new E("press",i,j);l1=l1||i.getBindingContext();if(x&&x(m1,l1)){return;}if(i.data("CrossNavigation")){w(i,l1,k.oSmartFilterbar);return;}var n1=e.getOwnerControl(i);l(i);e.navigateFromListItem(l1,n1);}function R(i,j,k,x,l1){var m1,n1={};if(i instanceof E){m1=i.getSource();n1=i.getParameters();if(e.isMTable(m1)){m1=i.getParameter('listItem');n1.id=m1.getId();}}else{m1=i;}if(l1){Q(m1,n1,j,k,x);}else{e.processDataLossConfirmationIfNonDraft(Q.bind(null,m1,n1,j,k,x),jQuery.noop,j);}}function U(i){s.oApplication.performAfterSideEffectExecution(function(){if(s.oApplication.getBusyHelper().isBusy()){L.info("Ignore incorrect selection, since app is busy anyway");return;}var j=i?"ST_GENERIC_MULTIPLE_ITEMS_SELECTED":"ST_GENERIC_NO_ITEM_SELECTED";M.error(e.getText(j),{styleClass:e.getContentDensityClass()});});}function W(k){var x,i,l1;var m1=o.getOwnerComponent(),n1=k.getSource().getCustomData(),o1="10rem";if(n1.length===0){return;}for(i=0,l1=n1.length;i<l1;i++){if(n1[i].getProperty("key")==="Target"){x=n1[i].getProperty("value");break;}}if(!x){M.show(e.getText("ST_GENERIC_ERROR_IN_NAVIGATION"),{icon:M.Icon.ERROR,title:e.getText("ST_ERROR"),actions:[sap.m.MessageBox.Action.CLOSE],horizontalScrolling:true,contentWidth:o1,details:e.getText("ST_GENERIC_ERROR_IN_NAVIGATION_PROPERTY_MISSING",["DataFieldWithNavigationPath"])});return;}var p1=m1.getModel(),q1=p1.getMetaModel();var r1=k.getSource().getBindingContext().getPath(),s1=r1.slice(1,r1.indexOf("(")),t1=q1.getODataEntityType(q1.getODataEntitySet(s1).entityType),j,u1=false,v1=t1.navigationProperty.length;for(j=0;j<v1;j++){if(t1.navigationProperty[j].name===x){u1=true;break;}}if(!u1){M.show(e.getText("ST_GENERIC_ERROR_IN_NAVIGATION"),{icon:M.Icon.ERROR,title:e.getText("ST_ERROR"),actions:[sap.m.MessageBox.Action.CLOSE],horizontalScrolling:true,contentWidth:o1,details:e.getText("ST_GENERIC_ERROR_NAVIGATION_PROPERTY_NOT_CORRECT",[x,"DataFieldWithNavigationPath"])});return;}var w1=q1.getODataAssociationEnd(t1,x),x1=q1.getODataEntityType(w1.type),y1,z1;if(x1){y1=x1.namespace+"."+x1.name;}var A1=q1.getODataEntityContainer().entitySet;for(i=0,l1=A1.length;i<l1;i++){if(A1[i].entityType===y1){z1=A1[i].name;break;}}if(!z1){var B1=y1.split(".")[1];B1=B1.slice(0,B1.length-4);M.show(e.getText("ST_GENERIC_ERROR_IN_NAVIGATION"),{icon:M.Icon.ERROR,title:e.getText("ST_ERROR"),actions:[sap.m.MessageBox.Action.CLOSE],horizontalScrolling:true,contentWidth:o1,details:e.getText("ST_NAV_ERROR_TARGET_ENTITYSET_IS_MISSING",[B1])});return;}var C1=e.getNavigationKeyProperties(z1),D1=s.oNavigationController,E1={"$expand":""};if(d.isDraftEnabled()){E1={"$expand":"DraftAdministrativeData"};}var F1=new Promise(function(G1,H1){p1.read(r1+"/"+x,{urlParameters:E1,success:function(I1){G1(I1);s.oApplication.invalidatePaginatorInfo();var J1=e.mergeNavigationKeyPropertiesWithValues(C1,I1);s.oApplication.setStoredTargetLayoutToFullscreen(1);D1.navigateToContext(J1,null,false);},error:function(I1){H1(I1);}});});d.getBusyHelper().setBusy(F1);}function X(i,j){var k=i.getSource();var x=e.getElementCustomData(k);var l1=e.getOwnerControl(k);l1=e.isMTable(l1)?l1.getParent():l1;var m1=e.getSelectedContexts(l1);$(k,x,m1,j);}function Y(i,j){var k=new a(j);var x=(k&&k.getParameterNames())||[];for(var l1 in i){var m1=i[l1].getObject(i[l1].sPath);for(var n1 in m1){if(m1[n1]&&!x.includes(n1)){if(typeof m1[n1]!=="object"){k.addSelectOption(n1,"I","EQ",m1[n1].toString());}else{k.addSelectOption(n1,"I","EQ",JSON.stringify(m1[n1]));}}}}return k;}function Z(i,j){var k=i.getSource();var x=k.getParent().getBindingContext();var l1=k.data("SemanticObject");var m1=k.data("Action");e.processDataLossConfirmationIfNonDraft(function(){var n1={action:m1,semanticObject:l1};N(n1,x,j.oSmartFilterbar||undefined,j.oSmartTable||undefined);},jQuery.noop,j);}function $(i,j,k,x){var l1={action:j.Action,semanticObject:j.SemanticObject};if(k.length<=1){e.processDataLossConfirmationIfNonDraft(function(){N(l1,k[0],x.oSmartFilterbar||undefined,x.oSmartTable||undefined);},jQuery.noop,x);}else{var m1=e.getNavigationHandler();var n1=i.data("fe_multiValue");var o1=function(){var q1=x.oSmartFilterbar.getUiState().getSelectionVariant();var r1=Y(k,q1);m1.navigate(l1.semanticObject,l1.action,r1.toJSONString(),null,h);return;};if(n1===null){var p1=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("CrossApplicationNavigation");l1.tags=["fe_multiValue"];p1.getLinks(l1).then(function(q1){var r1=q1[0];if(r1){i.data("fe_multiValue",true);e.processDataLossConfirmationIfNonDraft(o1,jQuery.noop,x);}else{i.data("fe_multiValue",false);U(k.length);}});}else if(n1===true){e.processDataLossConfirmationIfNonDraft(o1,jQuery.noop,x);}else{U(k.length);}}}function _(i,j,k){var x=e.getElementCustomData(i);var l1=e.getSelectedContexts(j);var m1=!(x.RequiresContext&&x.RequiresContext==="false");if(m1&&!l1.length){U(l1.length);}else{$(i,x,l1,k);}}function a1(i,j){e.processDataLossConfirmationIfNonDraft(function(){var k={semanticObject:i.data("SemanticObject"),action:i.data("Action")};var x=i.getParent().getBindingContext();N(k,x,j.oSmartFilterbar,j.oSmartTable);},jQuery.noop,j);}function b1(i,j){var k=i.getSource();var x=e.getOwnerControl(k).getParent();var l1=[k.getBindingContext()];var m1=e.getElementCustomData(k);var n1=x.getEntitySet();e.triggerAction(l1,n1,m1,x,j);}function c1(i,j){var k=o.getView();var x=[];var l1=i.getSource().data();if(l1.ActionFor){x=j?e.getSelectedContexts(j):[k.getBindingContext()];}if(l1.ActionFor&&x.length===0){U(x.length);}else{var m1=i.getSource();var l1=e.getElementCustomData(m1);var n1=j?j.getEntitySet():o.getOwnerComponent().getEntitySet();e.triggerAction(x,n1,l1,j);}}function d1(i,j){var k,x="";var l1=[];var m1=e.getOwnerControl(i.getSource());m1=e.isMTable(m1)?m1.getParent():m1;var n1=i.getSource().data();if(n1.ActionFor){l1=e.getSelectedContexts(m1);}if(e.isSmartTable(m1)){k=m1.getTable();x=m1.getEntitySet();}else if(e.isSmartChart(m1)){m1.getChartAsync().then(function(v1){k=v1;});x=m1.getEntitySet();}var o1=f1(l1,n1);if(n1.ActionFor&&o1.inApplicableCount>0&&(e.isSmartTable(m1)&&((k.getMode&&k.getMode()==="MultiSelect")||(k.getSelectionMode&&k.getSelectionMode()==="MultiToggle")))){var p1=e.getText("ST_GENERIC_WARNING_TEXT",[o1.inApplicableCount]);o1.warningText=p1;var q1={functionImportPath:n1.Action,contexts:o1.aApplicableContexts,sourceControl:k,label:n1.Label,operationGrouping:n1.InvocationGrouping,navigationProperty:"",sEntitySet:x,oState:j};var r1=e1(m1);var s1=r1.getModel("Action");s1.setData(q1);var t1=new sap.ui.model.json.JSONModel(o1);r1.setModel(t1,"list");var u1=r1.getModel("list");u1.setData(o1);r1.open();}else{g1({functionImportPath:n1.Action,contexts:l1,sourceControl:k,label:n1.Label,operationGrouping:n1.InvocationGrouping,navigationProperty:""},j,x);}}function e1(i){return e.getDialogFragment("sap.suite.ui.generic.template.fragments.ActionConfirmation",{onCancel:function(j){var k=j.getSource().getParent();k.close();},onContinue:function(j){var k=j.getSource().getParent();var x=j.getSource().getParent().getModel("Action").getData();g1({functionImportPath:x.functionImportPath,contexts:x.contexts,sourceControl:x.sourceControl,label:x.label,operationGrouping:x.operationGrouping,navigationProperty:x.navigationProperty},x.oState,x.sEntitySet);k.close();}},"Action");}function f1(j,k){var x,l1,m1,n1;var o1=o.getView().getModel();var p1=o1.getMetaModel();if(j&&j.length>0){m1=j[0].sPath.substring(1,j[0].sPath.indexOf('('));n1=p1.getODataEntitySet(m1);}if(n1){var q1=k.Action.split("/")[1];var r1=[],s1=[];var t1={aInApplicableItems:undefined,inApplicableCount:0,dialogTitle:k.Label,warningText:undefined,aApplicableContexts:undefined};if(q1){l1=p1.getODataFunctionImport(q1)["sap:applicable-path"];}for(var i=0;i<j.length;i++){x=o1.getObject(j[i].getPath());if(!x[l1]){t1.inApplicableCount++;var u1=p1.getODataEntityType(p1.getODataEntitySet(m1).entityType);var v1=u1["com.sap.vocabularies.UI.v1.HeaderInfo"]?(u1["com.sap.vocabularies.UI.v1.HeaderInfo"].Title&&u1["com.sap.vocabularies.UI.v1.HeaderInfo"].Title.Value)||{}:{};var w1="";if(v1.Path){w1=j[i].getProperty(v1.Path);}else{w1=v1.String||"";}r1.push({sKey:w1});}else{s1.push(j[i]);}}t1.aInApplicableItems=r1;t1.aApplicableContexts=s1;}return t1;}function g1(j,k,x){var l1;e.processDataLossConfirmationIfNonDraft(function(){s.oCRUDManager.callAction({functionImportPath:j.functionImportPath,contexts:j.contexts,sourceControl:j.sourceControl,label:j.label,operationGrouping:j.operationGrouping,navigationProperty:j.navigationProperty},k).then(function(m1){if(m1&&m1.length){for(var i=0;i<m1.length;i++){l1=m1[i];if(l1.response&&l1.response.context&&(!l1.actionContext||l1.actionContext&&l1.response.context.getPath()!==l1.actionContext.getPath())){s.oApplication.getBusyHelper().getUnbusy().then(s.oViewDependencyHelper.setMeToDirty.bind(null,o.getOwnerComponent(),x));break;}}}});},jQuery.noop,k,"Proceed");}function h1(i,j,k,x,l1){if(i.data("CrossNavigation")){w(i,i.getBindingContext(),k);return new Promise(function(r1){r1();});}var m1=e.getOwnerControl(i);m1=e.isSmartTable(m1)?m1:m1.getParent();var n1=m1.getTableBindingPath();var o1=m1.getEntitySet();var p1=o.getOwnerComponent();var q1=function(r1){var s1=s.oCRUDManager.addEntry(m1,r1).then(function(t1){if(!j){s.oNavigationController.navigateToContext(t1.newContext,t1.tableBindingPath,false,4);s.oApplication.getBusyHelper().getUnbusy().then(s.oViewDependencyHelper.setMeToDirty.bind(null,p1,o1));}else if(!l1){e.refreshSmartTable(m1);s.oApplicationController.executeSideEffects(p1.getBindingContext(),[],[n1]);}});s1.catch(jQuery.noop);return s1;};if(x instanceof Promise){return x.then(q1);}else{return q1(x);}}function i1(){var i={batchGroupId:"Changes",changeSetId:"Changes",draftSave:true,noBlockUI:true,noShowResponse:true,onlyIfPending:true,pendingChanges:true,forceSubmit:true};s.oTransactionController.triggerSubmitChanges(i);}function j1(i){var j=e.getOwnerControl(i.getSource());j=e.isMTable(j)?j.getParent():j;var k=e.getSelectedContexts(j);if(k&&k.length>0){var x=r(k);var l1=Promise.resolve(o.beforeDeleteExtension({aContexts:k}));l1.then(function(m1){var n1=s.oApplication.getBusyHelper();n1.setBusy(x);x.then(function(o1){jQuery.extend(o1.text,m1);var p1=p(j);var q1=p1.getModel("delete");q1.setData(o1);p1.open();},jQuery.noop);});}else{M.error(e.getText("ST_GENERIC_NO_ITEM_SELECTED"),{styleClass:e.getContentDensityClass()});}}function k1(j){var k=j.getSource().getModel();var x=JSON.parse(j.getSource().data("contactDetails"));var l1=e.getDialogFragment("sap.suite.ui.generic.template.fragments.ContactDetails",{},"contact");var m1=l1.getModel("contact");var n1=k.getContext(j.getSource().getBindingContext().getPath());var o1;m1.setProperty("/",{});m1.setProperty("/device",sap.ui.Device);(x.fn&&x.fn.Path)?m1.setProperty("/fn",(n1.getProperty(x.fn.Path))):m1.setProperty("/fn",(x.fn&&x.fn.String));(x.title&&x.title.Path)?m1.setProperty("/title",(n1.getProperty(x.title.Path))):m1.setProperty("/title",(x.title&&x.title.String));(x.photo&&x.photo.Path)?m1.setProperty("/photo",(n1.getProperty(x.photo.Path))):m1.setProperty("/photo",(x.photo&&x.photo.String));(x.role&&x.role.Path)?m1.setProperty("/role",(n1.getProperty(x.role.Path))):m1.setProperty("/role",(x.role&&x.role.String));(x.org&&x.org.Path)?m1.setProperty("/org",(n1.getProperty(x.org&&x.org.Path))):m1.setProperty("/org",(x.org&&x.org.String));if(x.email&&x.email[0]&&!m1.getProperty("/email")){o1=x.email[0].type&&x.email[0].type.EnumMember;if(o1&&o1.indexOf("com.sap.vocabularies.Communication.v1.ContactInformationType/work")>-1){if(x.email[0].address&&x.email[0].address.Path){m1.setProperty("/email",(n1.getProperty(x.email[0].address.Path)));}else{m1.setProperty("/email",(x.email[0].address&&x.email[0].address.String));}}}var p1=(x.tel&&x.tel.length)||0;for(var i=0;i<p1;i++){if(x.tel[i]&&!m1.getProperty("/fax")){o1=x.tel[i].type&&x.tel[i].type.EnumMember;if(o1&&o1.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/fax")>-1){if(x.tel[i].uri&&x.tel[i].uri.Path){m1.setProperty("/fax",(n1.getProperty(x.tel[i].uri.Path)));}else{m1.setProperty("/fax",(x.tel[i].uri&&x.tel[i].uri.String));}continue;}}if(x.tel[i]&&!m1.getProperty("/cell")){o1=x.tel[i].type&&x.tel[i].type.EnumMember;if(o1&&o1.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/cell")>-1){if(x.tel[i].uri&&x.tel[i].uri.Path){m1.setProperty("/cell",(n1.getProperty(x.tel[i].uri.Path)));}else{m1.setProperty("/cell",(x.tel[i].uri&&x.tel[i].uri.String));}continue;}}if(x.tel[i]&&!m1.getProperty("/work")){o1=x.tel[i].type&&x.tel[i].type.EnumMember;if(o1&&o1.indexOf("com.sap.vocabularies.Communication.v1.PhoneType/work")>-1){if(x.tel[i].uri&&x.tel[i].uri.Path){m1.setProperty("/work",(n1.getProperty(x.tel[i].uri.Path)));}else{m1.setProperty("/work",(x.tel[i].uri&&x.tel[i].uri.String));}continue;}}}l1.openBy(j.getSource());}var u=t.testable(u,"fnBuildSelectionVariantForNavigation");var f=t.testable(f,"fnEvaluateParameters");var N=t.testable(N,"fnNavigateIntent");var H=t.testable(H,"fnHideTitleArea");return{onDataReceived:K,onBeforeRebindTable:P,onListNavigate:R,onEditNavigateIntent:w,onSemanticObjectLinkPopoverLinkPressed:y,onDataFieldWithNavigationPath:W,onDataFieldForIntentBasedNavigation:X,onDeterminingDataFieldForIntentBasedNavigation:_,onDeterminingDataFieldForAction:c1,onInlineDataFieldForIntentBasedNavigation:a1,onDataFieldWithIntentBasedNavigation:Z,onInlineDataFieldForAction:b1,onSmartFieldUrlPressed:n,onCallActionFromToolBar:d1,addEntry:h1,deleteEntries:j1,onContactDetails:k1,onSemanticObjectLinkNavigationTargetObtained:z,onSemanticObjectLinkNavigationPressed:O,submitChangesForSmartMultiInput:i1};}return B.extend("sap.suite.ui.generic.template.lib.CommonEventHandlers",{constructor:function(o,d,s,e){jQuery.extend(this,g(o,d,s,e));}});});