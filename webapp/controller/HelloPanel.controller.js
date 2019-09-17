sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Controller, MessageToast, Fragment){
  "use strict";

  return Controller.extend("walkthrough.controller.HelloPanel", {

    onShowHello: function () {
      // read Msg from i18n model
      var oBundle = this.getView().getModel('i18n').getResourceBundle();
      var sRecipient = this.getView().getModel().getProperty("/recipient/name");
      var sMsg = oBundle.getText("helloMsg", [sRecipient]);
      // show Message
      MessageToast.show(sMsg);
    },

    onOpenDialog: function (){

			this.getOwnerComponent().openHelloDialog();

      // deleted
      // var oView=this.getView();
      // //create Dialog lazily (?)
      // if(!this.byId("helloDialog")) {
      //   Fragment.load({
			// 	// load asynchronous XML fragment
      //     id: oView.getId(),
      //     name: "walkthrough.view.HelloPanel",
      //     controller: this
      //   }).then(function (oDialog){
			// 		// connect dialog to the root view of this component (models, lifecycle)
      //     oView.addDependent(oDialog);
      //     oDialog.open();
      //   });
      // } else {
      //   this.byId("helloDialog").open();
      // }
    },

    onCloseDialog: function (){
      this.byId("helloDialog").close();
    }

  });
});
