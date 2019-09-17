/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../NS","../Scene","./NodeHierarchy"],function(q,N,S,a){"use strict";var b=S.extend(N.getName("dvl.Scene"),{metadata:{},constructor:function(g,d){S.call(this);this._id=q.sap.uid();this._graphicsCore=g;this._dvlSceneRef=d;this._defaultNodeHierarchy=null;}});b.prototype.destroy=function(){if(this._defaultNodeHierarchy){this._defaultNodeHierarchy.destroy();this._defaultNodeHierarchy=null;}this._dvlSceneRef=null;this._graphicsCore=null;S.prototype.destroy.call(this);};b.prototype.getId=function(){return this._id;};b.prototype.getGraphicsCore=function(){return this._graphicsCore;};b.prototype.getDefaultNodeHierarchy=function(){if(!this._defaultNodeHierarchy){this._defaultNodeHierarchy=new a(this);}return this._defaultNodeHierarchy;};b.prototype.getSceneRef=function(){return this._dvlSceneRef;};b.prototype.setDoubleSided=function(v){this.setProperty("doubleSided",v,true);this._graphicsCore._dvl.Renderer.SetOption(sap.ve.dvl.DVLRENDEROPTION.DVLRENDEROPTION_SHOW_BACKFACING,v);return this;};return b;});
