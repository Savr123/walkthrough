sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press"
], function (Opa5, Press){
  "use strict";

  var sViewName = "walkthrough.view.HelloPanel"

  Opa5.createPageObjects({
    onTheAppPage: {
      actions: {
        iPressTheSayHelloWithDialogButton: function (){
          return this.waitFor({
            id: "helloDialogButton",
            viewName: sViewName,
            actions: new Press(),
            errorMessage: "Did not find the 'Say Hello with dialog' button on the HellPanel view"
          })
        }
      },

      assertions: {
        iShouldSeeTheHelloDialog: function (){
          return this.waitFor({
            controlType: "sap.m.Dialog",
            success: function (){
              //we set the view busy, so we need the query of the App
              Opa5.assert.ok(true, "The dialog is open");
            },
            errorMessage: "Did not find the dialog control"
          })
        }
      }
    }
  })
})
