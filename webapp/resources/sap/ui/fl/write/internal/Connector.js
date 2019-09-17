/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/internal/connectors/Utils"],function(C){"use strict";function _(l,d){var f=d.filter(function(o){return o.layerFilter.indexOf("ALL")!==-1||o.layerFilter.indexOf(l)!==-1;});if(f.length===1){return f[0].connector;}if(f.length===0){throw new Error("No Connector could be found to write into layer: "+l);}if(f.length>1){throw new Error("sap.ui.core.Configuration 'xx-flexibilityConnectors' has a misconfiguration: Multiple Connectors were found to write into layer: "+l);}}function a(l){return C.getWriteConnectors().then(_.bind(this,l));}var b={};b.writeChanges=function(l,p){return a(l).then(c.bind(this,p));};function c(p,o){return o.writeChanges(p);}return b;},true);
