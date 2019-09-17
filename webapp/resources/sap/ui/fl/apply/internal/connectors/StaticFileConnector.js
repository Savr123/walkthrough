/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/apply/connectors/BaseConnector","sap/base/Log","sap/base/util/LoaderExtensions"],function(m,B,L,a){"use strict";var S=m({},B,{CONFIGURATION:{layerFilter:[],connectorName:"StaticFileConnector"},loadFlexData:function(f){var r=f.replace(/\./g,"/")+"/changes/changes-bundle.json";var c=!!sap.ui.loader._.getModuleState(r);var C=sap.ui.getCore().getConfiguration();if(c||C.getDebug()||C.isFlexBundleRequestForced()){try{var R=m({},this._RESPONSES.FLEX_DATA,{changes:a.loadResource(r)});return Promise.resolve(R);}catch(e){L.warning("flexibility did not find a changes-bundle.json for the application: "+f);}}return Promise.resolve(this._RESPONSES.FLEX_DATA);}});return S;},true);
