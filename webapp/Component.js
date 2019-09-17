sap.ui.define([
   "sap/ui/core/UIComponent",
   'sap/m/MessageToast',
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel",
   "./controller/HelloDialog",
   "sap/ui/Device"
], function (UIComponent, MessageToast, JSONModel, ResourceModel, HelloDialog, Device) {
   "use strict";
   return UIComponent.extend("walkthrough.Component", {

     metadata : {
 			manifest: "json"
 		},

      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
         //Step-7 (9)
         //set data model on view
         var oData = {
           recipient: {
             name: "World"
           }
         };
         var oModel = new JSONModel(oData);
         this.setModel(oModel);

         //set Device model
         var oDeviceModel = new JSONModel(Device);
         oDeviceModel.setDefaultBindingMode("OneWay");
         this.setModel(oDeviceModel, "deviceModel");

         //set Dialog
         this._helloDialog = new HelloDialog(this.getRootControl());
  			 // create the views based on the url/hash
         this.getRouter().initialize();

         // //set i18n model on view
         // var i18nModel = new ResourceModel({
         //   bundleName: "walkthrough.i18n.i18n"
         // });
         // this.setModel(i18nModel,'i18n');
      },

      getContentDensityClass: function (){
  			if (!this._sContentDensityClass) {
  				if (!Device.support.touch) {
  					this._sContentDensityClass = "sapUiSizeCompact";
  				} else {
  					this._sContentDensityClass = "sapUiSizeCozy";
  				}
  			}
  			return this._sContentDensityClass;
      },

      exit: function(){
        this._helloDialog.destroy();
        delete this._helloDialog;
      },
      openHelloDialog: function(){
        this._helloDialog.open();
      }
   });
});
