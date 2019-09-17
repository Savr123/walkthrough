// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ui/core/theming/Parameters","sap/ui/core/library","sap/base/Log","sap/ushell/ui/shell/ContentRenderer","./SplitContainerRenderer"],function(C,P,c,L,a){"use strict";var O=c.Orientation;var S=C.extend("sap.ushell.ui.shell.SplitContainer",{metadata:{library:"sap.ushell.ui.shell",properties:{showSecondaryContent:{type:"boolean",group:"Appearance",defaultValue:null},secondaryContentSize:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"250px"},secondaryContentWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"250px",deprecated:true},orientation:{type:"sap.ui.core.Orientation",group:"Appearance",defaultValue:O.Horizontal}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},secondaryContent:{type:"sap.ui.core.Control",multiple:true,singularName:"secondaryContent"},subHeader:{type:"sap.ui.core.Control",multiple:true,singularName:"subHeader"}}}});(function(){S.prototype.init=function(){this.bRtl=sap.ui.getCore().getConfiguration().getRTL();this._paneRenderer=new a(this,this.getId()+"-panecntnt","secondaryContent");this._subHeadersRenderer=new a(this,this.getId()+"-canvassubHeader","subHeader");this._canvasRenderer=new a(this,this.getId()+"-canvasrootContent","content");this._moveContent=true;};S.prototype.exit=function(){this._paneRenderer.destroy();delete this._paneRenderer;this._canvasRenderer.destroy();delete this._canvasRenderer;this._subHeadersRenderer.destroy();delete this._subHeadersRenderer;delete this._contentContainer;delete this._secondaryContentContainer;};S.prototype.onAfterRendering=function(){this._contentContainer=this.$("canvas");this._secondaryContentContainer=this.$("pane");this._toolArea=this.getParent()&&this.getParent().getToolArea&&this.getParent().getToolArea()?this.getParent().getToolArea():{};this._shellLayout=this.getParent();this._applySecondaryContentSize();};S.prototype._applySecondaryContentSize=function(){if(this.getDomRef()){var v=this.getOrientation()===O.Vertical;var s,o;var d,b,D;var e=this.getSecondaryContentSize();var f=this.getShowSecondaryContent();if(v){s="height";o="width";d="top";b=this.bRtl?"right":"left";}else{s="width";o="height";d=this.bRtl?"right":"left";b="top";}if(this._closeContentDelayId){clearTimeout(this._closeContentDelayId);}this._secondaryContentContainer.css(s,e);this._secondaryContentContainer.css(o,"");if(this.getParent().getToolAreaVisible&&!this.getParent().getToolAreaVisible()){D="0";}else{D=this._toolArea.getSize?this._toolArea.getSize():"0";}this._secondaryContentContainer.css(d,f?D:"-"+e);this._secondaryContentContainer.css(b,"");if(this._moveContent){e=this._adjustSecondaryContentSize();this._contentContainer.css(d,f?e:D);}else{this._contentContainer.css(d,D);}if(!f){var h=parseInt(P.get("sapUshellSplitContAnimationDuration"),10);this._closeContentDelayId=setTimeout(function(){if(this._secondaryContentContainer){this._secondaryContentContainer.toggleClass("sapUshellSplitContSecondClosed",true);}}.bind(this),h);}else{this._secondaryContentContainer.toggleClass("sapUshellSplitContSecondClosed",false);}}};S.prototype._modifyAggregationOrProperty=function(m,d){var r=!!this.getDomRef();var b=m.apply(this,[r]);if(r&&d){d.render();}return b;};S.prototype._adjustSecondaryContentSize=function(){var s=this.getProperty("secondaryContentSize"),b=this._shellLayout.getToolAreaVisible&&this._shellLayout.getToolAreaVisible()?this._toolArea.getSize():"0rem";s=parseFloat(s,10)+parseFloat(b,10)+"rem";return s;};S.prototype.setShowSecondaryContent=function(s){var r=this.getDomRef();this.setProperty("showSecondaryContent",!!s,r);this._applySecondaryContentSize();return this;};S.prototype.setSecondaryContentSize=function(s){this.setProperty("secondaryContentSize",s,true);this._applySecondaryContentSize();return this;};S.prototype.getSecondaryContentWidth=function(){L.warning("SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use "+"\"SecondaryContentSize\" instead.");return this.getSecondaryContentSize.apply(this,arguments);};S.prototype.setSecondaryContentWidth=function(){L.warning("SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use "+"\"SecondaryContentSize\" instead.");return this.setSecondaryContentSize.apply(this,arguments);};S.prototype.insertContent=function(o,i){return this._modifyAggregationOrProperty(function(r){return this.insertAggregation("content",o,i,r);},this._canvasRenderer);};S.prototype.addContent=function(o){return this._modifyAggregationOrProperty(function(r){return this.addAggregation("content",o,r);},this._canvasRenderer);};S.prototype.removeContent=function(i){return this._modifyAggregationOrProperty(function(r){return this.removeAggregation("content",i,r);},this._canvasRenderer);};S.prototype.removeAllContent=function(){return this._modifyAggregationOrProperty(function(r){return this.removeAllAggregation("content",r);},this._canvasRenderer);};S.prototype.destroyContent=function(){return this._modifyAggregationOrProperty(function(r){return this.destroyAggregation("content",r);},this._canvasRenderer);};S.prototype.insertSecondaryContent=function(o,i){return this._modifyAggregationOrProperty(function(r){return this.insertAggregation("secondaryContent",o,i,r);},this._paneRenderer);};S.prototype.addSecondaryContent=function(o){return this._modifyAggregationOrProperty(function(r){return this.addAggregation("secondaryContent",o,r);},this._paneRenderer);};S.prototype.removeSecondaryContent=function(i){return this._modifyAggregationOrProperty(function(r){return this.removeAggregation("secondaryContent",i,r);},this._paneRenderer);};S.prototype.removeAllSecondaryContent=function(){return this._modifyAggregationOrProperty(function(r){return this.removeAllAggregation("secondaryContent",r);},this._paneRenderer);};S.prototype.destroySecondaryContent=function(){return this._modifyAggregationOrProperty(function(r){return this.destroyAggregation("secondaryContent",r);},this._paneRenderer);};S.prototype.addSubHeader=function(o){return this._modifyAggregationOrProperty(function(r){return this.addAggregation("subHeader",o,r);},this._subHeadersRenderer);};S.prototype.removeSubHeader=function(){return this._modifyAggregationOrProperty(function(r){return this.removeAllAggregation("subHeader",r);},this._subHeadersRenderer);};S.prototype.destroySubHeader=function(){return this._modifyAggregationOrProperty(function(r){return this.destroyAggregation("subHeader",r);},this._subHeadersRenderer);};})();return S;});
