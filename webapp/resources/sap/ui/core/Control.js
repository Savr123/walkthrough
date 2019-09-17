/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./CustomStyleClassSupport','./Element','./UIArea','./RenderManager','./BusyIndicatorUtils','./BlockLayerUtils',"sap/base/Log","sap/ui/thirdparty/jquery"],function(C,E,U,R,B,a,L,q){"use strict";var b;var c=E.extend("sap.ui.core.Control",{metadata:{stereotype:"control","abstract":true,publicMethods:["placeAt","attachBrowserEvent","detachBrowserEvent","getControlsByFieldGroup","triggerValidateFieldGroup","checkFieldGroupIds"],library:"sap.ui.core",properties:{"blocked":{type:"boolean",defaultValue:false,visibility:"hidden"},"busy":{type:"boolean",defaultValue:false},"busyIndicatorDelay":{type:"int",defaultValue:1000},"busyIndicatorSize":{type:"sap.ui.core.BusyIndicatorSize",defaultValue:'Medium'},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"fieldGroupIds":{type:"string[]",defaultValue:[]}},events:{validateFieldGroup:{enableEventBubbling:true,parameters:{fieldGroupIds:{type:"string[]"}}}}},constructor:function(i,s){this.bAllowTextSelection=true;E.apply(this,arguments);this.bOutput=this.getDomRef()!=null;},renderer:null});c.prototype.clone=function(){var o=E.prototype.clone.apply(this,arguments);if(this.aBindParameters){for(var i=0,l=this.aBindParameters.length;i<l;i++){var p=this.aBindParameters[i];o.attachBrowserEvent(p.sEventType,p.fnHandler,p.oListener!==this?p.oListener:undefined);}}o.bAllowTextSelection=this.bAllowTextSelection;return o;};C.apply(c.prototype);c.prototype.isActive=function(){return((this.sId?window.document.getElementById(this.sId):null))!=null;};c.prototype.invalidate=function(o){var u;if(this.bOutput&&(u=this.getUIArea())){if(!this._bIsBeingDestroyed){u.addInvalidatedControl(this);}}else{var p=this.getParent();if(p&&(this.bOutput||!(this.getVisible&&this.getVisible()===false))){p.invalidate(this);}}};c.prototype.rerender=function(){U.rerenderControl(this);};c.prototype.getDomRef=function(s){if(this.bOutput===false&&!this.oParent){return null;}return E.prototype.getDomRef.call(this,s);};c.prototype.allowTextSelection=function(h){this.bAllowTextSelection=h;return this;};c.prototype.attachBrowserEvent=function(s,h,l){if(s&&(typeof(s)==="string")){if(typeof h==="function"){if(!this.aBindParameters){this.aBindParameters=[];}l=l||this;var p=h.bind(l);this.aBindParameters.push({sEventType:s,fnHandler:h,oListener:l,fnProxy:p});if(!this._sapui_bInAfterRenderingPhase){this.$().bind(s,p);}}}return this;};c.prototype.detachBrowserEvent=function(s,h,l){if(s&&(typeof(s)==="string")){if(typeof(h)==="function"){var $=this.$(),i,p;l=l||this;if(this.aBindParameters){for(i=this.aBindParameters.length-1;i>=0;i--){p=this.aBindParameters[i];if(p.sEventType===s&&p.fnHandler===h&&p.oListener===l){this.aBindParameters.splice(i,1);$.unbind(s,p.fnProxy);}}}}}return this;};c.prototype.getRenderer=function(){return R.getRenderer(this);};c.prototype.placeAt=function(o,p){var h=sap.ui.getCore();if(h.isInitialized()){var i=o;if(typeof i==="string"){i=h.byId(o);}var I=false;if(!(i instanceof E)){i=h.createUIArea(o);I=true;}if(!i){return this;}if(!I){var j=i.getMetadata().getAggregation("content");var k=true;if(j){if(!j.multiple||j.type!="sap.ui.core.Control"){k=false;}}else if(!i.addContent||!i.insertContent||!i.removeAllContent){k=false;}if(!k){L.warning("placeAt cannot be processed because container "+i+" does not have an aggregation 'content'.");return this;}}if(typeof p==="number"){i.insertContent(this,p);}else{p=p||"last";switch(p){case"last":i.addContent(this);break;case"first":i.insertContent(this,0);break;case"only":i.removeAllContent();i.addContent(this);break;default:L.warning("Position "+p+" is not supported for function placeAt.");}}}else{var t=this;h.attachInitEvent(function(){t.placeAt(o,p);});}return this;};c.prototype.onselectstart=function(o){if(!this.bAllowTextSelection){o.preventDefault();o.stopPropagation();}};c.prototype.onBeforeRendering=function(){};c.prototype.onAfterRendering=function(){};c.prototype.getIdForLabel=function(){return this.getId();};c.prototype.destroy=function(s){if(this.bIsDestroyed){return;}this._bIsBeingDestroyed=true;this._cleanupBusyIndicator();b=b||sap.ui.require("sap/ui/core/ResizeHandler");if(b){b.deregisterAllForControl(this.getId());}if(!this.getVisible()){var p=document.getElementById(R.createInvisiblePlaceholderId(this));if(p&&p.parentNode){p.parentNode.removeChild(p);}}E.prototype.destroy.call(this,s);};var r={onBeforeRendering:function(){e.call(this);},onAfterRendering:function(){if(this.getBlocked()&&this.getDomRef()&&!this.getDomRef("blockedLayer")){this._oBlockState=a.block(this,this.getId()+"-blockedLayer",this._sBlockSection);q(this._oBlockState.$blockLayer.get(0)).addClass("sapUiBlockLayerOnly");}if(this.getBusy()&&this.getDomRef()&&!this._busyIndicatorDelayedCallId&&!this.getDomRef("busyIndicator")){var D=this.getBusyIndicatorDelay();if(D){this._busyIndicatorDelayedCallId=setTimeout(A.bind(this),D);}else{A.call(this);}}}};function A(){if(!this.getBusy()){return;}var $=this.$(this._sBusySection);if(this._busyIndicatorDelayedCallId){clearTimeout(this._busyIndicatorDelayedCallId);delete this._busyIndicatorDelayedCallId;}if(!$||$.length===0){L.warning("BusyIndicator could not be rendered. The outer control instance is not valid anymore.");return;}if(this._sBlockSection===this._sBusySection){if(this._oBlockState){B.addHTML(this._oBlockState,this.getBusyIndicatorSize());a.toggleAnimationStyle(this._oBlockState,true);this._oBusyBlockState=this._oBlockState;}else{d.call(this);}}else{d.call(this);}}function f(){this._oBlockState=a.block(this,this.getId()+"-blockedLayer",this._sBlockSection);q(this._oBlockState.$blockLayer.get(0)).addClass("sapUiBlockLayerOnly");}function d(){this._oBusyBlockState=a.block(this,this.getId()+"-busyIndicator",this._sBusySection);B.addHTML(this._oBusyBlockState,this.getBusyIndicatorSize());}function e(){a.unblock(this._oBlockState);a.unblock(this._oBusyBlockState);delete this._oBlockState;delete this._oBusyBlockState;}function g(F){if(F){e.call(this);return;}var $=this.$(this._sBusySection);$.removeClass('sapUiLocalBusy');$.removeAttr('aria-busy');if(this._sBlockSection===this._sBusySection){if(!this.getBlocked()&&!this.getBusy()){e.call(this);}else if(this.getBlocked()){a.toggleAnimationStyle(this._oBlockState||this._oBusyBlockState,false);this._oBlockState=this._oBusyBlockState;}else if(this._oBusyBlockState){a.unblock(this._oBusyBlockState);delete this._oBusyBlockState;}}else if(this._oBusyBlockState){a.unblock(this._oBusyBlockState);delete this._oBusyBlockState;}}c.prototype.getBlocked=function(){return this.getProperty("blocked");};c.prototype.setBlocked=function(h,s){if(!!h==this.getProperty("blocked")){return this;}this._sBlockSection=s||this._sBlockSection;this.setProperty("blocked",h,true);if(h){this.addDelegate(r,false,this);}else{this.removeDelegate(r);}if(!this.getDomRef()){return this;}if(h){if(this._sBlockSection===this._sBusySection){if(!this._oBusyBlockState&&!this._oBlockState){f.call(this);}else{L.info("The control is already busy. Hence, no new block-layer was created for the shared section.");}}else{f.call(this);}}else{if(this._sBlockSection===this._sBusySection){if(!this.getBlocked()&&!this.getBusy()){e.call(this);}else if(this.getBusy()){L.info("The control is already busy. Hence, no new block-layer was created for the shared section.");}}else if(this._oBlockState){a.unblock(this._oBlockState);delete this._oBlockState;}}return this;};c.prototype.setBusy=function(h,s){if(!!h==this.getProperty("busy")){return this;}this._sBusySection=s||this._sBusySection;this.setProperty("busy",h,true);if(h){this.addDelegate(r,false,this);}else{this.removeDelegate(r);if(this._busyIndicatorDelayedCallId){clearTimeout(this._busyIndicatorDelayedCallId);delete this._busyIndicatorDelayedCallId;}}if(!this.getDomRef()){return this;}if(h){if(this.getBusyIndicatorDelay()<=0){A.call(this);}else{this._busyIndicatorDelayedCallId=setTimeout(A.bind(this),this.getBusyIndicatorDelay());}}else{g.call(this);}return this;};c.prototype.isBusy=c.prototype.getBusy;c.prototype.setBusyIndicatorDelay=function(D){this.setProperty("busyIndicatorDelay",D,true);return this;};c.prototype._cleanupBusyIndicator=function(){if(this._busyIndicatorDelayedCallId){clearTimeout(this._busyIndicatorDelayedCallId);delete this._busyIndicatorDelayedCallId;}g.call(this,true);};c.prototype.getControlsByFieldGroupId=function(F){return this.findAggregatedObjects(true,function(o){if(o instanceof c){return o.checkFieldGroupIds(F);}return false;});};c.prototype.checkFieldGroupIds=function(F){if(typeof F==="string"){F=F?F.split(","):[];}var h=this._getFieldGroupIds();if(Array.isArray(F)){return F.every(function(s){return h.indexOf(s)>=0;});}else if(!F){return h.length>0;}return false;};c.prototype.triggerValidateFieldGroup=function(F){this.fireValidateFieldGroup({fieldGroupIds:F});};return c;});
