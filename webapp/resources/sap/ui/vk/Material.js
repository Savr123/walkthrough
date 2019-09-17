/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./NS"],function(M,N){"use strict";var a=M.extend(N.getName("Material"),{metadata:{properties:{"id":{type:"string"},"name":{type:"string"},"ambientColour":{type:"sap.ui.core.CSSColor",defaultValue:"rgba(0, 0, 0, 1)"},"diffuseColour":{type:"sap.ui.core.CSSColor",defaultValue:"rgba(0, 0, 0, 1)"},"specularColour":{type:"sap.ui.core.CSSColor",defaultValue:"rgba(0, 0, 0, 1)"},"emissiveColour":{type:"sap.ui.core.CSSColor",defaultValue:"rgba(0, 0, 0, 1)"},"opacity":{type:"float",defaultValue:1.0},"glossiness":{type:"float",defaultValue:0.0},"lineColour":{type:"sap.ui.core.CSSColor",defaultValue:"rgba(0, 0, 0, 1)"},"lineWidth":{type:"float",defaultValue:0.0},"textureDiffuse":{type:N.getName("Texture"),defaultValue:null},"textureBump":{type:N.getName("Texture"),defaultValue:null},"textureOpacity":{type:N.getName("Texture"),defaultValue:null},"textureReflection":{type:N.getName("Texture"),defaultValue:null},"textureEmissive":{type:N.getName("Texture"),defaultValue:null},"textureAmbientOcclusion":{type:N.getName("Texture"),defaultValue:null}}}});a.prototype.getMaterialRef=function(){return null;};return a;});
