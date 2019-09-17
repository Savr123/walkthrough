//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Fragment","sap/ushell/resources","sap/ushell/ui/pagecomposer/PageSaveDialog.controller","sap/ushell/Config","sap/ui/thirdparty/jquery"],function(F,r,p,C,q){"use strict";var f=null;var t=null;function _(a,b){var s=function(i){var m=a.getModel();var v=q.extend({},m.getProperty("/validation"),{transport:i});m.setProperty("/validation",v);};var d=function(e){return function(h){var P=e.decorateResultWithTransportInformation(h);b(P);};};var T=C.last("/core/pageComposition/transport/module");sap.ui.require([T],function(e){t=new e();s(false);t.change(s);t.createContent().then(function(o){a.addContent(o);p._resolveSavePagePromise=d(t);});});}function g(v){function s(b){var S=sap.ui.getCore().byId("viewPortContainer");if(S){S.setBusy(b);}}return new Promise(function(R,a){if(!f){s(true);f=F.load({name:"sap.ushell.ui.pagecomposer.PageSaveDialog",controller:p,type:"XML"});}f.then(function(o){var T=C.last("/core/pageComposition/transport/support");s(false);o.attachAfterClose(function(){f=null;t=null;});if(v){v.addDependent(o);}p._resolveSavePagePromise=R;p._rejectSavePagePromise=a;if(T){_(o,R);}o.open();});});}function c(){return{getPageSaveInformation:g};}return{create:c};});