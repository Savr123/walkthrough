/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./library","./NS","sap/ui/core/Control","sap/ui/layout/library","./ListPanelStackRenderer"],function(v,N,C,l,L){"use strict";var a=C.extend(N.getName("ListPanelStack"),{metadata:{library:N.getName(),properties:{"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"},"expanded":{type:"boolean",group:"Misc",defaultValue:true},"expandAnimation":{type:"boolean",group:"Misc",defaultValue:true},"collapsible":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"content":{type:N.getName("ListPanel"),multiple:true,singularName:"content"},"layout":{type:"sap.ui.layout.VerticalLayout",multiple:false,visibility:"hidden"}}}});a.prototype.init=function(){this._oLayout=new sap.ui.layout.VerticalLayout();this._oLayout.addStyleClass("sapUiVkLPSTrans");this.setAggregation("layout",this._oLayout,true);this._bFirstTime=true;};a.prototype.exit=function(){if(this._oLayout){this._oLayout.destroy();this._oLayout=undefined;}};a.prototype.getContent=function(){return this._oLayout.getContent();};a.prototype.addContent=function(o){o.attachExpand(this._onContentExpand.bind(this));o.attachHeaderIconPress(this._onContentHeaderIconPress.bind(this));return this._oLayout.addContent(o);};a.prototype.removeContent=function(o){return this._oLayout.removeContent(o);};a.prototype.insertContent=function(o,i){return this._oLayout.insertContent(o,i);};a.prototype.removeAllContent=function(){return this._oLayout.removeAllContent();};a.prototype.getWidth=function(){return this._oLayout.getWidth();};a.prototype.setWidth=function(b){this.setProperty("width",b,true);return this._oLayout.setWidth(b);};a.prototype.setExpanded=function(b){if(b!=this.getExpanded()){if(b){this._expand();}else{this._collapse();}}return this;};a.prototype.setExpandAnimation=function(b){this._oLayout.removeStyleClass("sapUiVkLPSTrans");if(b){this._oLayout.addStyleClass("sapUiVkLPSTrans");}return this.setProperty("expandAnimation",b,true);};a.prototype.onBeforeRendering=function(){if(this._bFirstTime){var e=false;var c=this.getContent();for(var i=0;i<c.length;++i){if(c[i].getExpanded()){e=true;}}this.setExpanded(e);this._bFirstTime=false;}};a.prototype.onAfterRendering=function(){if(!this.getExpanded()){this._updateCollapsedLayoutWidth();}};a.prototype._onContentExpand=function(e){var b=false;var c=this._oLayout.getContent();for(var i=0;i<c.length;++i){if(c[i].getExpanded()){b=true;}}this.setExpanded(b);};a.prototype._onContentHeaderIconPress=function(e){var b=e.oSource.getExpanded()?false:true;e.oSource.setExpanded(b);var E=false;var c=this._oLayout.getContent();for(var i=0;i<c.length;++i){if(c[i].getExpanded()){E=true;break;}}this.setExpanded(E);};a.prototype._expand=function(){this._oLayout.removeStyleClass("sapUiVkLPSCollapse");this._oLayout.setWidth(this.getProperty("width"));this.setProperty("expanded",true,true);};a.prototype._collapse=function(){if(!this.getCollapsible()){return;}var c=this.getContent();for(var i=0;i<c.length;++i){c[i].setExpanded(false);}this._oLayout.addStyleClass("sapUiVkLPSCollapse");this._updateCollapsedLayoutWidth();this.setProperty("expanded",false,true);};a.prototype._updateCollapsedLayoutWidth=function(){if(this._oLayout.$().closest(".sapUiSizeCompact").length===0){this._oLayout.setWidth("3rem");}else{this._oLayout.setWidth("2.5rem");}};return a;});
