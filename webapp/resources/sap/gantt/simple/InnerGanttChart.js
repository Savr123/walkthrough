/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Core","sap/ui/core/Control","./GanttExtension","./InnerGanttChartRenderer"],function(q,C,a,G){"use strict";var I=a.extend("sap.gantt.simple.InnerGanttChart",{metadata:{events:{ganttReady:{parameters:{hasRenderedShapes:{type:"boolean"}}}}}});I.prototype.getDomRef=function(s){var p=this.getParent(),d;if(s){d="-"+s;}else{d="-cnt";}if(p){return window.document.getElementById(p.getId()+d);}return null;};I.prototype.invalidate=function(){this.getUIArea().addInvalidatedControl(this);};I.prototype.hasRenderedShapes=function(){return this.$("svg").find(".sapGanttChartShapes").children().size()>0;};I.prototype.resolveWhenReady=function(w){var t=this;return new Promise(function(r){function h(e){if(w&&!e.getParameter("hasRenderedShapes")){t.attachEventOnce("ganttReady",h);}else{r();}}if((!w&&t.getDomRef("svg"))||(w&&t.hasRenderedShapes())){r();}else{t.attachEventOnce("ganttReady",h);}});};I.prototype.onAfterRendering=function(e){var g=this.getParent();var r=C.createRenderManager();this.getRenderer().renderRelationships(r,g);r.destroy();g._updateShapeSelections(g.getSelectedShapeUid(),[]);g._getConnectExtension().updateShapeConnectEffect(g);G.attachEvents(g);g.jumpToVisibleHorizon("initialRender");this.fireGanttReady({hasRenderedShapes:this.hasRenderedShapes()});};return I;},true);
