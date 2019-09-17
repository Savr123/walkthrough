/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/fl/changeHandler/Base'],function(B){"use strict";return{createChanges:function(p,a,d){var n=d.filter(function(D){return!sap.ui.getCore().byId(D.id);});var N={};return n.reduce(function(r,D){if(!N[D.id]){N[D.id]=true;r.push(D);}return r;},[]).map(function(D){return{selectorControl:p,changeSpecificData:{changeType:"createItem",content:{selector:D.id}}};});},createItem:{layers:{USER:true},changeHandler:{applyChange:function(c,p,P){var s=c.getContent().selector;return new Promise(function(r){p.getModel();sap.ui.require(['sap/ui/mdc/base/info/PanelItem',P.modifier.getProperty(p,"metadataHelperPath")],function(a,M){if(P.modifier.bySelector(s,P.appComponent,P.view)){return r();}var m=M.retrieveAllMetadata(p).filter(function(f){return f.isMain!==true;});var i=function(I,b){var f=-1;b.some(function(e,g){if(e.getId()===I){f=g;return true;}});return f;};var I=P.modifier.getControlIdBySelector(s,P.appComponent);var b=P.modifier.getAggregation(p,"items");var d=-1;var o=null;m.some(function(f){var g=i(f.id,b);if(g>-1){d=g;}if(f.id===I){o=f;return true;}});if(!o){return r();}var e=P.modifier.createControl("sap.ui.mdc.base.info.PanelItem",P.appComponent,P.view,o.id,{text:o.text,description:o.description,href:o.href,target:o.target,icon:o.icon,isMain:o.isMain,visible:o.visible});P.modifier.insertAggregation(p,"items",e,d+1);return r();});});},revertChange:function(c,p,P){var i=c.getContent().id;var I=P.modifier.bySelector(i,P.appComponent,P.view);if(!I){return B.markAsNotApplicable("revertChange of createItem: the item with id "+i+" is not existing and therefore can not be removed.",true);}P.modifier.removeAggregation(p,"items",I);},completeChangeContent:function(c,s,p){if(s.content){var S=p.modifier.getSelector(s.content.selector,p.appComponent);var C=c.getDefinition();C.content={selector:S};}}}}};},true);
