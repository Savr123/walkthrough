/*global QUnit, opaTest*/

sap.ui.define([
  "walkthrough/localService/mockServer",
  "sap/ui/test/opaQunit",
  "./pages/App"
], function (mockserver){
  "use strict";

  QUnit.module("Navigation");

  opaTest("Should open the Hello dialog", function (Given, When, Then){
    //initiallize the mock server
    mockserver.init();

    //Arrangements
    Given.iStartMyUIComponent({
      componentConfig: {
        name: "walkthrough"
      }
    });
    //Actions
    When.onTheAppPage.iPressTheSayHelloWithDialogButton();
    //Assertions
    Then.onTheAppPage.iShouldSeeTheHelloDialog();
    //CleanUp
    Then.iTeardownMyApp();
  })
})
