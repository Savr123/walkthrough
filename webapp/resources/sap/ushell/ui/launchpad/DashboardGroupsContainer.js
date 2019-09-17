// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/core/Control","sap/ui/core/InvisibleText","sap/ui/core/ResizeHandler","sap/ushell/library","sap/ushell/resources","sap/ushell/override","sap/ushell/utils","sap/ushell/Config","sap/ui/Device","./DashboardGroupsContainerRenderer"],function(M,C,I,R,l,r,o,u,a,D){"use strict";var b="UShellTileDeviceSet";var c=C.extend("sap.ushell.ui.launchpad.DashboardGroupsContainer",{metadata:{library:"sap.ushell",properties:{accessibilityLabel:{type:"string",defaultValue:null},displayMode:{type:"string",defaultValue:null}},aggregations:{groups:{type:"sap.ui.core.Control",multiple:true,singularName:"group"}},events:{afterRendering:{}}}});c.prototype.init=function(){this._getDynamicStyleElement();if(!D.media.hasRangeSet(b)){D.media.initRangeSet(b,[374],"px",["Small","Responsive"],true);}this._iContainerWidth=null;this._oTileDimensions=null;this._bRangeSetSmall=false;R.register(this,this._handleResize.bind(this));this.addInvisibleAccessabilityTexts();this._oConfigChange=a.on("/core/home/sizeBehavior").do(function(s){this._sSizeBehavior=s;this._updateTileContainer(true);}.bind(this));if(!sap.ui.getCore().isInitialized()){sap.ui.getCore().attachInit(this._handleCoreInitialized.bind(this));}else{this._handleCoreInitialized();}};c.prototype._handleCoreInitialized=function(){sap.ui.getCore().attachThemeChanged(this._handleThemeApplied,this);};c.prototype._handleThemeApplied=function(){sap.ui.getCore().detachThemeChanged(this._handleThemeApplied,this);this._updateTileContainer(true);};c.prototype.exit=function(){if(this._oStyleElement){document.head.removeChild(this._oStyleElement);}delete this._oStyleElement;this._oConfigChange.off();if(this.oTileText){this.oTileText.destroy();}if(this.oTileEditModeText){this.oTileEditModeText.destroy();}D.media.detachHandler(this._handleMediaChange,this,b);C.prototype.exit.apply(this,arguments);};c.prototype._handleResize=function(e){if(e.size.width>0&&e.size.width!==e.oldSize.width){this._updateTileContainer();}};c.prototype._updateTileContainer=function(d){var i=this._getInnerTileContainer();if(!i){return;}var s=this._sSizeBehavior==="Small"||this._bRangeSetSmall;var t=this._getTileDimensions(s,d);var e=this._getElementDimensions(i);var T=t.width+t.marginEnd;var m=Math.floor(e.width/T);var f=T*m-t.marginEnd;var g=this._iContainerWidth!==f;if(g){this._iContainerWidth=f;this._updateTileContainerWidth(f);}};c.prototype._getInnerTileContainer=function(){var d=this.getDomRef();if(!d){return null;}var t,T=d.querySelectorAll(".sapUshellTileContainerContent");for(var i=0;i<T.length;++i){if(!T[i].parentElement.classList.contains("sapUshellHidden")){t=T[i];break;}}if(t){return t.querySelector(".sapUshellInner");}return null;};c.prototype._getDynamicStyleElement=function(){if(!this._oStyleElement){this._oStyleElement=document.createElement("style");document.head.appendChild(this._oStyleElement);}return this._oStyleElement;};c.prototype._updateTileContainerWidth=function(t){var s=this._getDynamicStyleElement();s.innerHTML=".sapUshellLineModeContainer, .sapUshellLinksContainer { width: "+t+"px; }";};c.prototype._getTileDimensions=function(s,d){if(this._oTileDimensions&&!d){return this._oTileDimensions;}var t=document.createElement("div");t.style.visibility="hidden";t.classList.add("sapUshellTile");if(s){t.classList.add("sapUshellSmall");}document.body.appendChild(t);this._oTileDimensions=this._getElementDimensions(t);document.body.removeChild(t);return this._oTileDimensions;};c.prototype._getElementDimensions=function(e){var s=window.getComputedStyle(e);var d=sap.ui.getCore().getConfiguration().getRTL();var m=d?s.marginLeft:s.marginRight;return{width:parseFloat(s.width),marginEnd:parseFloat(m)};};c.prototype.updateGroups=o.updateAggregatesFactory("groups");c.prototype.onAfterRendering=function(){var t=this,d={bUseUniqueMark:true};if(this.onAfterRenderingTimer){clearTimeout(this.onAfterRenderingTimer);}this.onAfterRenderingTimer=setTimeout(function(){t.onAfterRenderingTimer=undefined;u.setPerformanceMark("FLP-TimeToInteractive_tilesLoaded",d);t.fireAfterRendering();},0);D.media.attachHandler(this._handleMediaChange,this,b);};c.prototype.onBeforeRendering=function(){D.media.detachHandler(this._handleMediaChange,this,b);};c.prototype._handleMediaChange=function(e){this._bRangeSetSmall=e.name==="Small";this._updateTileContainer(true);};c.prototype.getGroupControlByGroupId=function(g){try{var d=this.getGroups();for(var i=0;i<d.length;i++){if(d[i].getGroupId()==g){return d[i];}}}catch(e){}return null;};c.prototype.addLinksToUnselectedGroups=function(){var g=this.getGroups();g.forEach(function(G,i){if(!G.getIsGroupSelected()){M.prototype.updateAggregation.call(G,"links");}});};c.prototype.removeLinksFromAllGroups=function(){var g=this.getGroups();g.forEach(function(G,d){var L=G.getLinks();if(L.length){if(L[0].getMetadata().getName()==="sap.m.GenericTile"){G.removeAllLinks();}else{for(var i=0;i<L.length;i++){L[i].destroy();}}}});};c.prototype.removeLinksFromUnselectedGroups=function(){var g=this.getGroups();g.forEach(function(G,d){var L=G.getLinks();if(L.length&&!G.getIsGroupSelected()){if(L[0].getMetadata().getName()==="sap.m.GenericTile"){G.removeAllLinks();}else{for(var i=0;i<L.length;i++){L[i].destroy();}}}});};c.prototype.addInvisibleAccessabilityTexts=function(){this.oTileText=new I("sapUshellDashboardAccessibilityTileText",{text:r.i18n.getText("tile")}).toStatic();var B=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(B){this.oTileEditModeText=new I("sapUshellDashboardAccessibilityTileEditModeText",{text:B.getText("LIST_ITEM_NAVIGATION")}).toStatic();}};return c;});
