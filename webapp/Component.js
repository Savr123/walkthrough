sap.ui.define([
   "sap/ui/core/UIComponent",
   'sap/m/MessageToast',
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (UIComponent, MessageToast, JSONModel, ResourceModel) {
   "use strict";
   return UIComponent.extend("walkthrough.Component", {
     metadata: {
       manifest: "json"
     },

      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
         //Step-7 (9)
         //set data model on view
         console.log(this);
         var oData = {
           recipient: {
             name: "World"
           }
         };
         var oModel = new JSONModel(oData);
         this.setModel(oModel);

         //set i18n model on view
         var i18nModel = new ResourceModel({
           bundleName: "walkthrough.i18n.i18n"
         });
         this.setModel(i18nModel,'i18n');
      }
   });
});
