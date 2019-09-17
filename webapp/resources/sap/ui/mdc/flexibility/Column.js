/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base"],function(F){"use strict";var r=function(c){clearTimeout(r.iTimer);r.iTimer=setTimeout(function(){if(c&&c.isA&&c.isA("sap.ui.mdc.Table")){c.rebindTable();}});};var C={};C.removeColumn={"changeHandler":{applyChange:function(c,o,p){var m=p.modifier;var a=c.getContent();var b=m.getSelector(a.id.replace("-innerColumn",""),p.appComponent);var M=m.bySelector(b,p.appComponent,p.view);if(!M){F.markAsNotApplicable("Specified change is already existing",true);}var i=m.findIndexInParentAggregation(M);m.removeAggregation(o,"columns",M);if(M.isA){m.insertAggregation(o,"dependent",M);}c.setRevertData({id:a.id,preventRebind:a.preventRebind,label:m.getProperty(M,"header"),dataProperties:m.getProperty(M,"dataProperties"),controlSelector:b,index:i});},completeChangeContent:function(c,m,p){if((!c.getContent()||!c.getContent().id)&&m.removedElement){c.setContent(m.removedElement);}},revertChange:function(c,o,p){var m=p.modifier;var R=c.getRevertData();var a=R.controlSelector;var M=m.bySelector(a,p.appComponent,p.view);if(!M){M=m.createControl("sap.ui.mdc.Column",p.appComponent,p.view,R.id,{header:R.label,dataProperties:R.dataProperties});}if(!m.findAggregation(M,"columns")){m.insertAggregation(o,"columns",M,R.index);}c.resetRevertData();if(!R.preventRebind){r(o);}}},"layers":{"USER":true}};C.addColumn={"changeHandler":{applyChange:function(c,o,p){var m=p.modifier;var a=c.getContent();var i=m.getControlIdBySelector(c.getSelector(),p.appComponent)+"--"+a.name;var b=m.getSelector(i,p.appComponent);var M=m.bySelector(b,p.appComponent,p.view);var d,I;if(!M){M=m.createControl("sap.ui.mdc.Column",p.appComponent,p.view,i,{header:a.label||a.name,dataProperties:[a.name]});}d=m.getAggregation(o,"columns");I=a.index>-1?a.index:d.length;if(!m.findAggregation(M,"columns")){m.insertAggregation(o,"columns",M,I);}else{F.markAsNotApplicable("Specified change is already existing",true);}c.setRevertData({id:a.id,column:i});if(!a.preventRebind){r(o);}},completeChangeContent:function(c,m,p){},revertChange:function(c,o,p){var m=p.modifier;var R=c.getRevertData();var a=m.getSelector(R.column,p.appComponent);var M=m.bySelector(a,p.appComponent,p.view);m.removeAggregation(o,"columns",M);c.resetRevertData();}},"layers":{"USER":true}};return C;});
