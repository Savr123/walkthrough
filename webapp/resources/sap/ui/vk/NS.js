/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/util/ObjectPath"],function(O){"use strict";var n="sap.ui.vk";var m="sap/ui/vk";var N={};N.getName=function(a){return arguments.length===0?n:n+"."+a;};N.getPath=function(a){return arguments.length===0?m:m+"/"+a;};N.getObject=function(a){return O.get(arguments.length===0?N.getName():N.getName(a));};return N;});
