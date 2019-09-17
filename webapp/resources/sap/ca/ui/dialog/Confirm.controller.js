/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.utils.resourcebundle");sap.ui.controller("sap.ca.ui.dialog.Confirm",{_CONFIRM_NOTE_ID:"TXA_NOTE",_CONFIRM_BUTTON_ID:"BTN_CONFIRM",_CONFIRM_DIALOG_ID:"DLG_CONFIRM",_CONFIRM_VERTICALLAYOUT_SM_ID:"VLT_ADDINFO",_CONFIRM_TEXT_EMPTYLINE:"TXT_EMPTYLINE",_bNoteMandatory:false,_sPreviousInput:"",onInit:function(){var d=this.getView().byId(this._CONFIRM_DIALOG_ID);if(jQuery.device.is.phone===false){d.setContentWidth("25em");}d.addDelegate({onBeforeRendering:function(){this._onBeforeRenderingDialog();}},true,this);},_onBeforeRenderingDialog:function(){var t=this.getView().byId(this._CONFIRM_NOTE_ID);t.setValue("");this._sPreviousInput="";this._bNoteMandatory=false;var d=this.getView().byId(this._CONFIRM_DIALOG_ID).getModel();if(d){this._bNoteMandatory=d.getProperty("/noteMandatory");if(this._bNoteMandatory){this.enableConfirmButton(false);t.setPlaceholder(sap.ca.ui.utils.resourcebundle.getText("YMSG_TEXT_NOTE_MANDATORY"));}else{this.enableConfirmButton(true);t.setPlaceholder(sap.ca.ui.utils.resourcebundle.getText("YMSG_TEXT_NOTE"));}if(this._bNoteMandatory){t.setVisible(true);}else{if(d.getProperty("/showNote")){t.setVisible(true);}else{t.setVisible(false);}}var i=d.getProperty("/additionalInformation");var v=this._visibleAdditionalInformation(i);var V=this.getView().byId(this._CONFIRM_VERTICALLAYOUT_SM_ID);V.setVisible(v);var e=this.getView().byId(this._CONFIRM_TEXT_EMPTYLINE);e.setVisible(!v);var l=this.getView().byId("LBL_INFO1");var a=d.getProperty("/additionalInformation/0/label");l.setVisible(this._formatVisible(a));var b=this.getView().byId("TXT_INFO1");var c=d.getProperty("/additionalInformation/0/text");b.setVisible(this._formatVisible(c));var f=this.getView().byId("LBL_INFO2");var g=d.getProperty("/additionalInformation/1/label");f.setVisible(this._formatVisible(g));var h=this.getView().byId("TXT_INFO2");var j=d.getProperty("/additionalInformation/1/text");h.setVisible(this._formatVisible(j));var k=this.getView().byId("LBL_INFO3");var m=d.getProperty("/additionalInformation/2/label");k.setVisible(this._formatVisible(m));var n=this.getView().byId("TXT_INFO3");var o=d.getProperty("/additionalInformation/2/text");n.setVisible(this._formatVisible(o));var p=this.getView().byId("LBL_INFO4");var q=d.getProperty("/additionalInformation/3/label");p.setVisible(this._formatVisible(q));var r=this.getView().byId("TXT_INFO4");var s=d.getProperty("/additionalInformation/3/text");r.setVisible(this._formatVisible(s));}},_visibleAdditionalInformation:function(i){return(i&&i.length>0)?true:false;},onConfirmDialog:function(e){var t=this.getView().byId(this._CONFIRM_NOTE_ID);var r={isConfirmed:true,sNote:t.getValue()};sap.ca.ui.dialog.factory.closeDialog(this._CONFIRM_DIALOG_ID,r);},onCancelDialog:function(e){var r={isConfirmed:false};sap.ca.ui.dialog.factory.closeDialog(this._CONFIRM_DIALOG_ID,r);},onNoteInput:function(e){var n=e.getParameters().value?e.getParameters().value:e.getParameters().newValue;n=jQuery.trim(n);if(n&&!this._sPreviousInput){this.enableConfirmButton(true);}else{if(this._sPreviousInput&&!n&&this._bNoteMandatory){this.enableConfirmButton(false);}}this._sPreviousInput=(n)?n:"";},enableConfirmButton:function(e){var b=this.getView().byId(this._CONFIRM_BUTTON_ID);if(b.getEnabled()!==e){b.setEnabled(e);b.rerender();}},_formatVisible:function(t){if(t&&t.length>0)return true;return false;}});