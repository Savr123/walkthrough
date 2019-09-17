/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/internal/connectors/Utils","sap/ui/fl/apply/connectors/BaseConnector","sap/base/Log"],function(C,B,L){"use strict";function _(s,t,k){if(!t[k]){t[k]=s[k];return;}if(Array.isArray(t[k])){t[k]=t[k].concat(s[k]);return;}if(typeof t[k]==='object'){Object.keys(s[k]).forEach(function(i){_(s[k],t[k],i);return;});}t[k]=s[k];}function a(r){var R={};r.forEach(function(o){Object.keys(o).forEach(function(k){_(o,R,k);});});return R;}function b(r,A,f){var g=f.map(function(o){return new Promise(function(h){o.connector.loadFlexData(r,A).then(h,d.bind(null,h,B._RESPONSES.FLEX_DATA,o,"loadFlexData"));});});return Promise.all(g);}function c(f){var g=f.map(function(o){return new Promise(function(r){return o.connector.loadFeatures().then(r,d.bind(null,r,B._RESPONSES.FEATURES,o,"loadFeatures"));});});return Promise.all(g);}function d(r,R,o,f,E){L.error("Connector ("+o.connectorName+") failed call '"+f+"': "+E);r(R);}var e={};e.loadFlexData=function(r,A){return C.getApplyConnectors().then(b.bind(this,r,A)).then(a);};e.loadFeatures=function(){return C.getApplyConnectors().then(c).then(a);};return e;},true);
