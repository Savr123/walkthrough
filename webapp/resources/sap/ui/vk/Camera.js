/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./NS"],function(M,N){"use strict";var C=M.extend(N.getName("Camera"),{metadata:{properties:{"position":{type:"float[]"},"targetDirection":{type:"float[]"},"upDirection":{type:"float[]"},"nearClipPlane":{type:"float"},"farClipPlane":{type:"float"},"isModified":{type:"boolean"}}}});C.prototype.getCameraRef=function(){return null;};return C;});
