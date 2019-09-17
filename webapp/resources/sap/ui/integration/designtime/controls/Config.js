/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject','./DefaultConfig','sap/base/util/merge'],function(M,d,m){"use strict";var C=M.extend("sap.ui.integration.designtime.controls.Config",{metadata:{properties:{data:{type:"any",defaultValue:d}}}});C.prototype.getDefaultData=function(){return d;};C.prototype.setData=function(D){this.setProperty("data",m({},this.getDefaultData(),D||{}));return this;};return C;},true);
