/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/internal/connectors/StaticFileConnector"],function(S){"use strict";var _;var a;var b="sap/ui/fl/apply/internal/connectors/";var c="sap/ui/fl/write/internal/connectors/";function d(n,i){var C=sap.ui.getCore().getConfiguration().getFlexibilityServices();var m=[];if(i){m=[S.CONFIGURATION];}m=m.concat(C);return new Promise(function(r){var e=m.map(function(f){var s=f.connectorName;return f.custom?s:n+s;});sap.ui.require(e,function(){Array.from(arguments).forEach(function(o,I){m[I].connector=o;});r(m);});});}return{getApplyConnectors:function(){if(!_){_=d(b,true);}return _;},getWriteConnectors:function(){if(!a){a=d(c,false);}return a;}};});
