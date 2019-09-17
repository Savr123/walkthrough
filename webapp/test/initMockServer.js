sap.ui.define([
  "../localService/mockServer"
], function (mockServer){
  "use strict";

  //init the mock server
  mockServer.init();

  //
  sap.ui.require(['sap/ui/core/ComponentSupport']);
});
