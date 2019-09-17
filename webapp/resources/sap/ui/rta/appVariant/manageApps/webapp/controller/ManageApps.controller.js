/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/rta/appVariant/manageApps/webapp/model/models","sap/ui/rta/appVariant/Utils","sap/m/MessageBox","sap/ui/rta/Utils","sap/ui/rta/appVariant/Feature","sap/ui/rta/RuntimeAuthoring","sap/ui/core/BusyIndicator","sap/ui/rta/appVariant/AppVariantUtils","sap/base/i18n/ResourceBundle"],function(C,M,A,a,R,b,c,B,d,e){"use strict";var _;var f;var g;var m;var i;return C.extend("sap.ui.rta.appVariant.manageApps.webapp.controller.ManageApps",{onInit:function(){_=this.getOwnerComponent().getIdRunningApp();f=this.getOwnerComponent().getIsOverviewForKeyUser();g=this.getOwnerComponent().getLayer();if(!i){this._createResourceBundle();}B.show();return A.getAppVariantOverview(_,f).then(function(h){B.hide();if(h.length){return this._arrangeOverviewDataAndBindToModel(h).then(function(h){return this._highlightNewCreatedAppVariant(h);}.bind(this));}d.closeOverviewDialog();return this._showMessageWhenNoAppVariantsExist();}.bind(this))["catch"](function(E){d.closeOverviewDialog();var o=d.buildErrorInfo("MSG_MANAGE_APPS_FAILED",E);o.overviewDialog=true;B.hide();return d.showRelevantDialog(o,false);});},_createResourceBundle:function(){m=sap.ui.require.toUrl("sap/ui/rta/appVariant/manageApps/")+"webapp";i=e.create({url:m+"/i18n/i18n.properties"});},_showMessageWhenNoAppVariantsExist:function(){return R._showMessageBox(a.Icon.INFORMATION,"TITLE_APP_VARIANT_OVERVIEW_SAP_DEVELOPER","MSG_APP_VARIANT_OVERVIEW_SAP_DEVELOPER");},_highlightNewCreatedAppVariant:function(h){var t=this.byId("Table1");h.forEach(function(o,j){if(o.currentStatus===i.getText("MAA_NEW_APP_VARIANT")||o.currentStatus===i.getText("MAA_OPERATION_IN_PROGRESS")){if(t.getItems().length>=j){t.getItems()[j].focus();}}});return Promise.resolve();},_arrangeOverviewDataAndBindToModel:function(h){var j=h.filter(function(p){return p.appId===_;});var o=j[0];if(o&&o.appVarStatus!=="R"){o.currentStatus=i.getText("MAA_CURRENTLY_ADAPTING");}h=h.filter(function(p){return p.appId!==_;});h.unshift(o);var r=h.filter(function(p){return p.isOriginal;});var k=r[0];h=h.filter(function(p){return!p.isOriginal;});h.unshift(k);var l={appVariants:h};var n=M.createModel(l);this.getView().setModel(n);return Promise.resolve(h);},formatRowHighlight:function(v){if(v===i.getText("MAA_CURRENTLY_ADAPTING")){return"Success";}else if(v===i.getText("MAA_NEW_APP_VARIANT")){return"Information";}else if(v===i.getText("MAA_OPERATION_IN_PROGRESS")){return"Warning";}return"None";},formatDelButtonTooltip:function(D,I){if(!D&&!I){return i.getText("TOOLTIP_DELETE_APP_VAR");}return undefined;},getModelProperty:function(s,h){return this.getView().getModel().getProperty(s,h);},onMenuAction:function(E){var I=E.getParameter("item");var s="";while(I instanceof sap.m.MenuItem){s=I.getText()+" > "+s;I=I.getParent();}s=s.substr(0,s.lastIndexOf(" > "));if(!i){this._createResourceBundle();}if(s===i.getText("MAA_DIALOG_ADAPT_UI")){return this.handleUiAdaptation(E);}else if(s===i.getText("MAA_DIALOG_COPY_ID")){return this.copyId(E);}else if(s===i.getText("MAA_DIALOG_DELETE_APPVAR")){return this.deleteAppVariant(E);}else if(s===i.getText("MAA_DIALOG_SAVE_AS_APP")){return this.saveAsAppVariant(E);}return undefined;},handleUiAdaptation:function(E){var n=sap.ushell.Container.getService("CrossApplicationNavigation");var s=this.getModelProperty("semanticObject",E.getSource().getBindingContext());var h=this.getModelProperty("action",E.getSource().getBindingContext());var p=this.getModelProperty("params",E.getSource().getBindingContext());var N;if(s&&h&&p){N={target:{semanticObject:s,action:h},params:p,writeHistory:false};c.enableRestart("CUSTOMER");n.toExternal(N);d.closeOverviewDialog();return true;}return false;},saveAsAppVariant:function(E){d.closeOverviewDialog();var D=this.getModelProperty("descriptorUrl",E.getSource().getBindingContext());B.show();return A.getDescriptor(D).then(function(o){B.hide();return b.onSaveAs(false,g,o);});},copyId:function(E){var s=this.getModelProperty("appId",E.getSource().getBindingContext());d.copyId(s);},deleteAppVariant:function(E){var I={};if(!i){this._createResourceBundle();}var s=i.getText("MSG_APP_VARIANT_DELETE_CONFIRMATION");I.text=s;I.deleteAppVariant=true;var h=this.getModelProperty("appId",E.getSource().getBindingContext());var j=this.getModelProperty("currentStatus",E.getSource().getBindingContext());var k=j===i.getText("MAA_CURRENTLY_ADAPTING");return d.showRelevantDialog(I).then(function(){return b.onDeleteFromOverviewDialog(h,k,g);}).catch(function(){return true;});}});});