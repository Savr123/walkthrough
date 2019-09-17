/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./NS"],function(M,N){"use strict";var C=M.extend(N.getName("Core"),{metadata:{publicMethods:["registerClass"]},constructor:function(){var l=N.getObject();if(l.getCore){return l.getCore();}M.call(this);var t=this;l.getCore=function(){return t;};this._classes=[];}});C.prototype.registerClass=function(c){if(this._classes.indexOf(c)>=0){return this;}var t=this,f=c.getMetadata().getName(),e=f+"-created",a=f+"-destroying",b=c.prototype.register,d=c.prototype.deregister;c.prototype.register=function(){if(b){b.call(this);}t.fireEvent(e,{object:this});};c.prototype.deregister=function(){t.fireEvent(a,{object:this});if(d){d.call(this);}};this._classes.push(c);return this;};return new C();});
