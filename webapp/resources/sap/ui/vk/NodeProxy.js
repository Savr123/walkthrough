/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./NS"],function(M,N){"use strict";var a=M.extend(N.getName("NodeProxy"),{metadata:{properties:{nodeRef:"any",veIds:"object[]",name:"string",localMatrix:{type:N.getName("TransformationMatrix"),bindable:"bindable"},worldMatrix:{type:N.getName("TransformationMatrix"),bindable:"bindable"},material:{type:N.getName("Material")},opacity:{type:"float",bindable:"bindable"},tintColorABGR:{type:"int",bindable:"bindable"},tintColor:{type:"sap.ui.core.CSSColor",bindable:"bindable"},nodeMetadata:"object",hasChildren:"boolean",closed:"boolean"}}});a.prototype.setClosed=function(v){return this;};a.prototype.setHasChildren=function(v){return this;};a.prototype.setName=function(v){return this;};a.prototype.setNodeId=function(v){return this;};a.prototype.setNodeMetadata=function(v){return this;};a.prototype.setVeIds=function(v){return this;};a.prototype.assignMaterial=function(v){return this;};a.prototype.getLocalTranslate=function(){return[0,0,0];};a.prototype.getLocalScale=function(){return[1,1,1];};a.prototype.getLocalRotationInQuaternion=function(){return[1,0,0,1];};a.prototype.getLocalRotationInAngleAxis=function(){return[1,0,0,0];};a.prototype.getLocalRotationInEuler=function(){return[0,0,0,0];};return a;});
