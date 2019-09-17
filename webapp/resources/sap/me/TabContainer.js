/*!
 * SAPUI5

        (c) Copyright 2009-2019 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/thirdparty/jquery','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/theming/Parameters','sap/m/ScrollContainer','sap/ui/core/Icon','sap/m/Label','./TabContainerRenderer'],function(q,l,C,I,P,S,a,L,T){"use strict";var b=C.extend("sap.me.TabContainer",{metadata:{deprecated:true,library:"sap.me",properties:{selectedTab:{type:"int",group:"Data",defaultValue:null},badgeInfo:{type:"int",group:"Data",defaultValue:null},badgeNotes:{type:"int",group:"Data",defaultValue:null},badgeAttachments:{type:"int",group:"Data",defaultValue:null},badgePeople:{type:"int",group:"Data",defaultValue:null},expandable:{type:"boolean",group:"Misc",defaultValue:true},expanded:{type:"boolean",group:"Misc",defaultValue:true},visible:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{tabs:{type:"sap.ui.core.Icon",multiple:true,singularName:"tab",visibility:"hidden"},contentInfo:{type:"sap.ui.core.Control",multiple:false},contentAttachments:{type:"sap.ui.core.Control",multiple:false},contentNotes:{type:"sap.ui.core.Control",multiple:false},contentPeople:{type:"sap.ui.core.Control",multiple:false},badges:{type:"sap.ui.core.Control",multiple:true,singularName:"badge",visibility:"hidden"}},events:{select:{allowPreventDefault:true},expand:{},collapse:{}}}});b.prototype.init=function(){this.addAggregation("tabs",this._createButton("Info"));this.addAggregation("tabs",this._createButton("Notes"));this.addAggregation("tabs",this._createButton("Attachments"));this.addAggregation("tabs",this._createButton("People"));I.insertFontFaceStyle();this._bFirstRendering=true;};b.prototype.setBadgeInfo=function(v){this._setBadgeLabelByName("badgeInfo",v);return this;};b.prototype.setBadgeAttachments=function(v){this._setBadgeLabelByName("badgeAttachments",v);return this;};b.prototype.setBadgeNotes=function(v){this._setBadgeLabelByName("badgeNotes",v);return this;};b.prototype.setBadgePeople=function(v){this._setBadgeLabelByName("badgePeople",v);return this;};b.prototype.onBeforeRendering=function(){if(this.getSelectedTab()==undefined){this.setProperty("selectedTab",0,true);}};b.prototype._setBadgeLabelByName=function(n,v){var c=sap.ui.getCore().byId(this.getId()+"-"+n);c.setText(v);this.setProperty(n,v);c.toggleStyleClass("sapUIMeTabContainerHiddenBadges",(v==0));};b.prototype._placeElements=function(){var $=this.$("arrow");var B=this.getAggregation("tabs")[this.getSelectedTab()];if(B&&(B.$().outerWidth()>8)){var i=parseFloat(B.$()[0].offsetLeft)+parseFloat(B.$().outerWidth()/2)-parseFloat($.width()/2);$.css("left",i+"px");}};b.prototype.onAfterRendering=function(){this.setProperty("expanded",true,true);if(this._bFirstRendering){this._bFirstRendering=false;setTimeout(q.proxy(this._placeElements,this),300);}else{this._placeElements();}};b.prototype.onThemeChanged=function(){this._placeElements();};b.prototype.onTransitionEnded=function(){var $=this.$("container");if(this.getExpanded()){this.$("arrow").show();$.css("display","block");this.$().find(".sapUIMeTabContainerContent").removeClass("sapUIMeTabContainerContentClosed");}else{$.css("display","none");this.$().find(".sapUIMeTabContainerContent").addClass("sapUIMeTabContainerContentClosed");}};b.prototype.toggleExpandCollapse=function(){var e=!this.getExpanded();var $=this.$("container");var c=this.$("arrow");if(e){this.$().find(".sapUIMeTabContainerButtons").children().filter(":eq("+this.getSelectedTab()+")").addClass("sapUIMeTabContainerTabSelected");$.slideDown('400',q.proxy(this.onTransitionEnded,this));this.fireExpand();}else{c.hide();this.$().find(".sapUIMeTabContainerTabSelected").removeClass("sapUIMeTabContainerTabSelected");$.slideUp('400',q.proxy(this.onTransitionEnded,this));this.fireCollapse();}this.setProperty("expanded",e,true);};b.prototype.onButtonTap=function(e){var B=e.getSource();var i=this.indexOfAggregation("tabs",B);if(i==this.getSelectedTab()&&this.getExpandable()){this.toggleExpandCollapse();}else{this.setProperty("expanded",true,true);var o=B.getId();var c=this._getContentForBtn(o);if(c){if(this.fireSelect()){this.setSelectedTab(i);}}}};b.prototype._getContentForBtn=function(B){var i=this.getId()+"-";var c=B.substr(B.indexOf(i)+i.length);return this.getAggregation(c);};b.prototype._getBagdeForBtn=function(B){var i=this.getId()+"-content";var c=B.substr(B.indexOf(i)+i.length);c.charAt(0).toUpperCase();c="badge"+c;return this.getProperty(c);};b.prototype._getScrollContainer=function(c){return new S({content:c});};b.prototype._createButton=function(i){var s=P.get("sapMeTabIcon"+i);var u=I.getIconURI(s);var c=P.get("sapMeTabColor"+i);var B=new a(this.getId()+'-content'+i,{src:u,backgroundColor:c,activeColor:P.get("sapUiIconInverted")});B.addStyleClass("sapUIMeTabContainerBtn");B.addStyleClass("sapUIMeTabContainerBtn"+i);B.attachPress(this.onButtonTap,this);var o=new L(this.getId()+'-badge'+i,{textAlign:"Center"});o.addStyleClass("sapUIMeTabContainerBadge");o.addStyleClass("sapUIMeTabContainerBadge"+i);this.addAggregation("badges",o);return B;};return b;});
