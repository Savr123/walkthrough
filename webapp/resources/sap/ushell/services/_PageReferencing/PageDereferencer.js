// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils/clone","sap/base/util/ObjectPath","sap/ushell/services/_PageReferencing/AppForInbound","sap/base/Log","sap/ushell/utils"],function(c,O,A,L,u){"use strict";var P={};P.dereference=function(p,v,n){var s={};var N={};var I=n.inbounds;for(var i=0;i<I.length;i++){var a=I[i].permanentKey||I[i].id;N[a]=I[i];}s._version="3.0.0";s.site=this._getSiteInfo(p);s.catalogs={};s.groups=this._getGroups(p);s.visualizations=this._getVisualizations(p,v,N);s.applications=this._getApplications(N);s.systemAliases=c(n.systemAliases);return s;};P._getSiteInfo=function(p){var g=[];var a=p.sections;if(a){g=a.map(function(b){return b.id;});}var s={identification:{id:p.id,title:p.title,description:p.description},payload:{groupsOrder:g}};return s;};P._getGroups=function(p){var g={};var a=p.sections||[];for(var i=0;i<a.length;i++){g[a[i].id]={identification:{id:a[i].id,title:a[i].title,locked:true,isPreset:true},payload:{tiles:[],links:[]}};for(var y=0;y<a[i].visualizations.length;y++){g[a[i].id].payload.tiles.push({id:u.generateUniqueId([]),vizId:a[i].visualizations[y].vizId});}}return g;};P._getVisualizations=function(p,v,n){var V={};var a=p.sections.map(function(s){return s.visualizations;});var f=Array.prototype.concat.apply([],a);for(var i=0;i<f.length;i++){V[f[i].vizId]=this._getVisualization(f[i],v,n);}return V;};P._getVisualization=function(p,v,n){var V=v[p.vizId]||{};var o={vizType:"sap.ushell.StaticAppLauncher",vizConfig:{"sap.app":{title:V.title,subTitle:V.subTitle,info:V.info},"sap.ui":{icons:{icon:V.icon}},"sap.flp":{tileSize:V.size,target:{type:"IBN",appId:p.inboundPermanentKey}}}};O.set(["vizConfig","sap.flp","target","inboundId"],n[p.inboundPermanentKey]&&n[p.inboundPermanentKey].id,o);return o;};P._getApplications=function(n){return Object.keys(n).reduce(function(a,b){var i=n[b],I=i.permanentKey||i.id;try{a[I]=A.get(b,i);}catch(e){L.error("Unable to dereference app '"+b+"' of CDM page.");a[b]={};}return a;},{});};return P;});
