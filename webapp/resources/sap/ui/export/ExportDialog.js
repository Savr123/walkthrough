/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/m/Dialog','sap/m/Button','sap/m/ProgressIndicator','sap/m/Text','sap/m/MessageBox','sap/m/library','sap/ui/core/library'],function(D,B,P,T,M,a,c){'use strict';var V=c.ValueState;var b=a.DialogType;var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.export",true);function d(){return new Promise(function(R,f){var g;r.then(function(o){var h=new B({text:o.getText("CANCEL_BUTTON"),press:function(){if(g&&g.oncancel){g.oncancel();}g.finish();}});var p=new P({showValue:false,height:"0.75rem"});p.addStyleClass("sapUiMediumMarginTop");var m=new T({text:o.getText("PROGRESS_FETCHING_MSG")});g=new D({title:o.getText("PROGRESS_TITLE"),type:b.Message,contentWidth:"500px",content:[m,p],endButton:h,ariaLabelledBy:[m]});g.updateStatus=function(n){if(n>=100){h.setEnabled(false);m.setText(o.getText("PROGRESS_BUNDLE_MSG"));}p.setPercentValue(n);};g.finish=function(){g.close();g.destroy();};R(g);return o;});});}function s(p){return new Promise(function(R,f){r.then(function(o){var C=false;var w=new T({text:o.getText("SIZE_WARNING_MSG",[p.rows,p.columns])});var W=new D({title:o.getText('PROGRESS_TITLE'),type:b.Message,state:V.Warning,content:w,ariaLabelledBy:w,beginButton:new B({text:o.getText("CANCEL_BUTTON"),press:function(){W.close();}}),endButton:new B({text:o.getText("EXPORT_BUTTON"),press:function(){C=true;W.close();}}),afterClose:function(){W.destroy();C?R():f();}});W.open();return o;});});}function e(m){r.then(function(R){var f=m||R.getText('PROGRESS_ERROR_DEFAULT');M.error(R.getText("PROGRESS_ERROR_MSG")+"\n"+f,{title:R.getText("PROGRESS_ERROR_TITLE")});return R;});}return{getProgressDialog:d,showErrorMessage:e,showWarningDialog:s};},true);
