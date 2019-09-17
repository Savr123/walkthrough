/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","./NS","sap/ui/core/Control","./Loco","./RedlineGesturesHandler","./RedlineSurfaceRenderer","./Redline"],function(q,v,N,C,L,R,a,b){"use strict";var c=C.extend(N.getName("RedlineSurface"),{metadata:{library:N.getName(),aggregations:{redlineElements:{type:N.getName("RedlineElement")}},properties:{virtualLeft:{type:"float"},virtualTop:{type:"float"},virtualSideLength:{type:"float"},panningRatio:{type:"float",defaultValue:1}},events:{pan:{parameters:{deltaX:"float",deltaY:"float"}},zoom:{parameters:{originX:"float",originY:"float",zoomFactor:"float"}}}}});c.prototype.init=function(){};c.prototype.onAfterRendering=function(){};c.prototype.exportJSON=function(){return this.getRedlineElements().map(function(e){return e.exportJSON();});};c.prototype.importJSON=function(j){if(!q.isArray(j)){j=[j];}j.forEach(function(d){var E;switch(d.type){case b.ElementType.Rectangle:E=sap.ui.vk.RedlineElementRectangle;break;case b.ElementType.Ellipse:E=sap.ui.vk.RedlineElementEllipse;break;case b.ElementType.Freehand:E=sap.ui.vk.RedlineElementFreehand;break;case b.ElementType.Line:E=sap.ui.vk.RedlineElementLine;break;case b.ElementType.Text:E=sap.ui.vk.RedlineElementText;break;default:q.sap.log.warning("Unsupported JSON element type "+d.type);}this.addRedlineElement(new E().importJSON(d));}.bind(this));return this;};c.prototype._toVirtualSpace=function(x,y){if(arguments.length===1){return x/this.getVirtualSideLength();}else{return{x:(x-this.getVirtualLeft())/this.getVirtualSideLength(),y:(y-this.getVirtualTop())/this.getVirtualSideLength()};}};c.prototype._toPixelSpace=function(x,y){if(arguments.length===1){return x*this.getVirtualSideLength();}else{return{x:x*this.getVirtualSideLength()+this.getVirtualLeft(),y:y*this.getVirtualSideLength()+this.getVirtualTop()};}};c.prototype.setPanningRatio=function(p){this.setProperty("panningRatio",p,true);};c.prototype.updatePanningRatio=function(){var d=this.getVirtualLeft(),e=this.getVirtualTop(),r=this.getDomRef(),f=r.getBoundingClientRect(),h=f.height,w=f.width,p;if(d===0&&(h<w&&e<0||(h>w&&e>0))){p=h/w;}else{p=1;}this.setPanningRatio(p);return this;};c.prototype.exportSVG=function(){var s=document.createElementNS(b.svgNamespace,"svg");this.getRedlineElements().map(function(e){s.appendChild(e.exportSVG());});return s;};c.prototype.importSVG=function(s){s.childNodes.forEach(function(t){if(t.getAttribute){var E;switch(t.tagName){case"rect":E=sap.ui.vk.RedlineElementRectangle;break;case"ellipse":E=sap.ui.vk.RedlineElementEllipse;break;case"path":E=sap.ui.vk.RedlineElementFreehand;break;case"line":E=sap.ui.vk.RedlineElementLine;break;case"text":E=sap.ui.vk.RedlineElementText;break;default:q.sap.log.warning("Unsupported SVG element type "+E);}if(E){this.addRedlineElement(new E().importSVG(t));}}}.bind(this));return this;};return c;});