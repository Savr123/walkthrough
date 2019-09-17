sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/m/MessageToast',
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel"
], function (Controller, MessageToast, JSONModel, ResourceModel){
	"use strict";

  return Controller.extend("walkthrough.controller.App",{
    
		onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
		}

    // deleted
    // onShowHello: function (){
    //   //read msg from i18n model
    //   var oBundle = this.getView().getModel("i18n").getResourceBundle();
    //   var sRecipient = this.getView().getModel().getProperty("/recipient/name");
    //   var sMsg = oBundle.getText("helloMsg",[sRecipient]);
    //   //show message
    //   MessageToast.show('hello world');
    //   //  Step-5
    //   //show native JS alert
    //   // alert("Hello world");
    // }

  });
});
