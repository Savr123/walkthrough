// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Layout","sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ushell/ui/launchpad/Tile","sap/ushell/ui/launchpad/DashboardGroupsContainer","sap/ushell/Config","sap/ushell/EventHub","sap/ushell/utils","sap/ui/core/Component","sap/m/GenericTile","sap/ui/Device","sap/ushell/ui/launchpad/PlusTile","sap/ushell/resources","sap/ushell/renderers/fiori2/AccessKeysHandler","sap/ushell/components/homepage/ComponentKeysHandler","sap/ushell/ui/launchpad/TileContainer","sap/ushell/ui/launchpad/LinkTileWrapper","sap/m/Button","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/ui/launchpad/GroupHeaderActions","sap/base/util/isEmptyObject","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement"],function(L,b,F,a,c,D,C,E,u,d,G,e,P,r,A,f,T,g,B,h,j,k,q,M){"use strict";var l=b.extend("sap.ushell.components.homepage.DashboardGroupsBox",{metadata:{publicMethods:["createGroupsBox"]},constructor:function(){if(sap.ushell.components.homepage.getDashboardGroupsBox&&sap.ushell.components.homepage.getDashboardGroupsBox()){return sap.ushell.components.homepage.getDashboardGroupsBox();}sap.ushell.components.homepage.getDashboardGroupsBox=(function(v){return function(){return v;};}(this.getInterface()));this.oController=undefined;this.oGroupsContainer=undefined;this.isLinkPersonalizationSupported=sap.ushell.Container.getService("LaunchPage").isLinkPersonalizationSupported();sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);},destroy:function(){sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeInactive",this._handleActionModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","GroupHeaderVisibility",this._updateGroupHeaderVisibility,this);sap.ushell.components.homepage.getDashboardGroupsBox=undefined;},calculateFilter:function(){var i=[];var o;var s=this.oModel.getProperty("/homePageGroupDisplay"),m=this.oModel.getProperty("/tileActionModeActive");if(!m){if(s&&s==="tabs"){o=new F("isGroupSelected",a.EQ,true);}else{o=new F("isGroupVisible",a.EQ,true);}i.push(o);}return i;},createGroupsBox:function(o,m){this.oController=o;var t=this,i,n,p=function(w){var x,y;if(w&&(x=w.getDomRef())){y=x.querySelector(".sapUshellPlusTile");if(y){return y;}}return null;},s=function(w){var x=p(w.currentGroup),y=p(w.endGroup),z=(w.tiles[w.tiles.length-2]===w.item)||(w.endGroup.getTiles().length===0);if(z){t._hidePlusTile(y);}else{t._showPlusTile(y);}if(w.currentGroup!==w.endGroup){t._showPlusTile(x);}};i=function(){L.getLayoutEngine().setExcludedControl(P);L.getLayoutEngine().setReorderTilesCallback.call(L.layoutEngine,s);};n=function(){if(!L.isInited){L.init({getGroups:this.getGroups.bind(this),getAllGroups:t.getAllGroupsFromModel.bind(t),isTabBarActive:t.isTabBarActive.bind(t)}).done(i);e.media.attachHandler(function(){if(!this.bIsDestroyed){L.reRenderGroupsLayout(null);}},this,e.media.RANGESETS.SAP_STANDARD);var w=this.getDomRef();o.getView().sDashboardGroupsWrapperId=!k(w)&&w.parentNode?w.parentNode.id:"";}L.reRenderGroupsLayout(null);if(this.getGroups().length){if(o.bModelInitialized){o._initializeUIActions();}u.recalculateBottomSpace();if(this.getModel().getProperty("/enableTilesOpacity")){u.handleTilesOpacity(this.getModel());}}E.emit("CenterViewPointContentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRendered");sap.ui.getCore().getEventBus().publish("launchpad","contentRefresh");this.getBinding("groups").filter(t.calculateFilter());};this.isTabBarActive=function(){return this.oModel.getProperty("/homePageGroupDisplay")==="tabs";};this.oModel=m;var v=this.calculateFilter(),U=C.last("/core/home/gridContainer");this.oGroupsContainer=new D("dashboardGroups",{accessibilityLabel:r.i18n.getText("DashboardGroups_label"),displayMode:"{/homePageGroupDisplay}",afterRendering:n});if(U){sap.ui.require(["sap/ushell/ui/launchpad/GridContainer"],function(){t.oGroupsContainer.bindAggregation("groups",{filters:v,path:"/groups",factory:function(){return t._createGridContainer(o,m);}});});}else{this.oGroupsContainer.bindAggregation("groups",{filters:v,path:"/groups",factory:function(){return t._createTileContainer(o,m);}});}this.oGroupsContainer.addEventDelegate({onsapskipback:function(w){w.preventDefault();A.setIsFocusHandledByAnotherHandler(true);if(q(".sapUshellAnchorItem").is(":visible")){f.goToSelectedAnchorNavigationItem();}else{A.sendFocusBackToShell(w);}},onsapskipforward:function(w){w.preventDefault();var x=window.document.getElementById("sapUshellDashboardFooterDoneBtn");if(x){x.focus();}else if(q("#sapUshellFloatingContainerWrapper").is(":visible")&&w.originalEvent.srcElement.id!==""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{A.setIsFocusHandledByAnotherHandler(true);A.sendFocusBackToShell(w);}},onsaptabnext:function(w){if(t.oModel.getProperty("/tileActionModeActive")){if(q(document.activeElement).closest(".sapUshellTileContainerHeader").length){var x=q(document.activeElement).closest(".sapUshellTileContainer");var y=q(document.activeElement).hasClass("sapUshellContainerTitle");var z=x.find(".sapUshellHeaderActionButton");if(y&&!z.length||document.activeElement.id===z.last()[0].id){if(x.find(".sapUshellTile, .sapUshellLink, .sapFCard").is(":visible")){w.preventDefault();f.goToLastVisitedTile(x,true);return;}}if(z.length&&document.activeElement.id!==z.last()[0].id){return;}}var H=window.document.getElementById("sapUshellDashboardFooterDoneBtn");if(H){w.preventDefault();H.focus();return;}}w.preventDefault();if(q("#sapUshellFloatingContainerWrapper").is(":visible")&&(w.originalEvent.srcElement.id)!==""){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsAccessible");}else{A.setIsFocusHandledByAnotherHandler(true);A.sendFocusBackToShell(w);}},onsaptabprevious:function(w){A.setIsFocusHandledByAnotherHandler(true);var x=q(":focus");if(t.oModel.getProperty("/tileActionModeActive")&&!x.hasClass("sapUshellTileContainerHeader")){var y=q(document.activeElement);if(y.hasClass("sapUshellTile")){w.preventDefault();var z=y.closest(".sapUshellTileContainer");var H=z.find(".sapUshellHeaderActionButton").filter(":visible").last();if(H.length>0){H.focus();}else{z.find(".sapUshellContainerTitle").focus();}}}}});return this.oGroupsContainer;},getAllGroupsFromModel:function(){return this.oModel.getProperty("/groups");},_createTileContainer:function(o){var t=this,i=new F("isTileIntentSupported",a.EQ,true),m=new T({headerText:"{title}",showEmptyLinksArea:{parts:["/tileActionModeActive","links/length","isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(n,p,s,I,v){if(p){return true;}else if(s){return false;}return n||I&&v==="tabs";}},showMobileActions:{parts:["/tileActionModeActive"],formatter:function(I){return I&&!this.getDefaultGroup();}},showIcon:{parts:["/isInDrag","/tileActionModeActive"],formatter:function(I,n){return(this.getIsGroupLocked()&&(I||n));}},deluminate:{parts:["/isInDrag"],formatter:function(I){return this.getIsGroupLocked()&&I;}},transformationError:{parts:["/isInDrag","/draggedTileLinkPersonalizationSupported"],formatter:function(I,n){return I&&!n;}},showBackground:"{/tileActionModeActive}",tooltip:"{title}",tileActionModeActive:"{/tileActionModeActive}",ieHtml5DnD:o.getView().ieHtml5DnD,enableHelp:"{/enableHelp}",groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",showHeader:true,showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",editMode:"{editMode}",supportLinkPersonalization:this.isLinkPersonalizationSupported,titleChange:function(n){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:n.getSource().getGroupId(),newTitle:n.getParameter("newTitle")});},showEmptyLinksAreaPlaceHolder:{parts:["links/length","/isInDrag","/homePageGroupDisplay"],formatter:function(n,I,s){return I&&s==="tabs"&&!n;}},showPlaceholder:{parts:["/tileActionModeActive","tiles/length"],formatter:function(n){return n&&!this.getIsGroupLocked();}},visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(n,p,v){if(!v[n?1:0]){return false;}return p||n;}},hidden:{parts:["/tileActionModeActive","isGroupVisible"],formatter:function(I,n){return I&&!n;}},links:this._getLinkTemplate(),tiles:{path:"tiles",factory:this._itemFactory.bind(this),filters:[i]},add:function(n){t._handleAddTileToGroup(n);}});return m;},_createGridContainer:function(o){var i=sap.ui.require("sap/ushell/ui/launchpad/GridContainer"),m=new F("isTileIntentSupported",a.EQ,true);return new i({groupId:"{groupId}",showHeader:true,defaultGroup:"{isDefaultGroup}",isLastGroup:"{isLastGroup}",headerText:"{title}",showGroupHeader:"{showGroupHeader}",homePageGroupDisplay:"{/homePageGroupDisplay}",visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(t,n,v){if(!v[t?1:0]){return false;}return n||t;}},isGroupLocked:"{isGroupLocked}",isGroupSelected:"{isGroupSelected}",editMode:"{editMode}",showBackground:"{/tileActionModeActive}",showIcon:{parts:["/isInDrag","/tileActionModeActive"],formatter:function(I,n){return(this.getIsGroupLocked()&&(I||n));}},tileActionModeActive:"{/tileActionModeActive}",supportLinkPersonalization:this.isLinkPersonalizationSupported,ieHtml5DnD:o.getView().ieHtml5DnD,enableHelp:"{/enableHelp}",showEmptyLinksAreaPlaceHolder:{parts:["links/length","/isInDrag","/homePageGroupDisplay"],formatter:function(n,I,s){return I&&s==="tabs"&&!n;}},showEmptyLinksArea:{parts:["/tileActionModeActive","links/length","isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(t,n,p,I,s){if(n){return true;}else if(p){return false;}return t||I&&s==="tabs";}},titleChange:function(n){sap.ui.getCore().getEventBus().publish("launchpad","changeGroupTitle",{groupId:n.getSource().getGroupId(),newTitle:n.getParameter("newTitle")});},tooltip:"{title}",links:this._getLinkTemplate(),tiles:{path:"tiles",factory:this._itemFactory.bind(this),filters:[m]}});},_getLinkTemplate:function(){var o=new F("isTileIntentSupported",a.EQ,true);if(!this.isLinkPersonalizationSupported){return{path:"links",templateShareable:true,template:new g({uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",target:"{target}",isLocked:"{isLocked}",tileActionModeActive:"{/tileActionModeActive}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,m){return m.getObject();}},afterRendering:function(i){var m=q(this.getDomRef().getElementsByTagName("a"));m.attr("tabindex",-1);}}),filters:[o]};}return{path:"links",factory:function(i,m){var n=m.getObject().content[0];if(n&&n.bIsDestroyed){n=n.clone();m.getModel().setProperty(m.getPath()+"/content/0",n);}return n;},filters:[o]};},_itemFactory:function(i,o){var t=o.getProperty(o.sPath),m,n,p,s;if(t){if(t.isCard){m=t&&t.content;n=m&&m.length&&m[0];if(n&&n["sap.card"]){s=n;}else if(t.manifest){s={"sap.flp":t.manifest&&t.manifest["sap.flp"],"sap.card":{"type":"List"}};}else{return this._createErrorTile();}sap.ui.getCore().loadLibrary("sap.ui.integration");var v=sap.ui.requireSync("sap/ui/integration/widgets/Card");p=new v({manifest:s});}else{p=this._createTile();}t.controlId=p&&p.getId&&p.getId();}return p;},_createErrorTile:function(){return new c({tileViews:{path:"content",factory:function(){return new G({state:"Failed"});}}});},_createTile:function(){var t=new c({"long":"{long}",isDraggedInTabBarToSourceGroup:"{draggedInTabBarToSourceGroup}",uuid:"{uuid}",tileCatalogId:"{tileCatalogId}",isCustomTile:"{isCustomTile}",target:"{target}",isLocked:"{isLocked}",navigationMode:"{navigationMode}",tileActionModeActive:"{/tileActionModeActive}",showActionsIcon:"{showActionsIcon}",rgba:"{rgba}",animationRendered:false,debugInfo:"{debugInfo}",ieHtml5DnD:this.oController.getView().ieHtml5DnD,tileViews:{path:"content",factory:function(i,o){return o.getObject();}},coverDivPress:function(o){if(!o.oSource.getBindingContext().getObject().tileIsBeingMoved&&sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(o);}},showActions:function(o){if(sap.ushell.components.homepage.ActionMode){sap.ushell.components.homepage.ActionMode._openActionsMenu(o);}},deletePress:[this.oController._dashboardDeleteTileHandler,this.oController],press:[this.oController.dashboardTilePress,this.oController]});var v=sap.ui.getCore().byId("viewPortContainer");t.addEventDelegate({onclick:function(){M.start("FLP:DashboardGroupsBox.onclick","Click on tile","FLP");M.start("FLP:OpenApplicationonClick","Open Application","FLP");function i(){M.end("FLP:DashboardGroupsBox.onclick");v.detachAfterNavigate(i);}v.attachAfterNavigate(i);}});return t;},_updateGroupHeaderVisibility:function(o,i,m){this._updateFirstGroupHeaderVisibility(m.group.getModel().getProperty("/tileActionModeActive"),this.oModel.getProperty("/homePageGroupDisplay")!=="tabs");},_updateFirstGroupHeaderVisibility:function(I,m){var n=this.oGroupsContainer.getGroups(),o=undefined,v=0;for(var i=0;i<n.length;i++){if(n[i].getProperty("visible")){v++;if(o===undefined){o=i;}else{n[i].setShowGroupHeader(I||m);}}}if(o!==undefined){var s=this.oModel.getProperty("/homePageGroupDisplay"),V=I||(v==1&&m),p=n.length>1||s==="tabs";n[o].setShowGroupHeader(V,p);}},_handleActionModeChange:function(){var i=this.oModel.getProperty("/tileActionModeActive");if(i){this._addTileContainersContent();}else{L.reRenderGroupsLayout(null);}},_addTileContainersContent:function(){var m=this.oGroupsContainer.getGroups();for(var i=0;i<m.length;i++){var o=m[i];if(!o.getBeforeContent().length){o.addBeforeContent(this._getBeforeContent());}if(!o.getAfterContent().length){o.addAfterContent(this._getAfterContent());}if(!o.getHeaderActions().length){o.addHeaderAction(this._getGroupHeaderAction());}}},_handleAddGroupButtonPress:function(o){this.oController._addGroupHandler(o);this._addTileContainersContent();},_getBeforeContent:function(){var o=new B({icon:"sap-icon://add",text:r.i18n.getText("add_group_at"),visible:"{= !${isGroupLocked} && !${isDefaultGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]});o.addStyleClass("sapUshellAddGroupButton");o.addCustomData(new h({key:"tabindex",value:"-1",writeToDom:true}));return o;},_getAfterContent:function(){var o=new B({icon:"sap-icon://add",text:r.i18n.getText("add_group_at"),visible:"{= ${isLastGroup} && ${/tileActionModeActive}}",enabled:"{= !${/editTitle}}",press:[this._handleAddGroupButtonPress.bind(this)]}).addStyleClass("sapUshellAddGroupButton");o.addStyleClass("sapUshellAddGroupButton");o.addCustomData(new h({key:"tabindex",value:"-1",writeToDom:true}));return o;},_getGroupHeaderAction:function(){return new j({content:this._getHeaderActions(),tileActionModeActive:"{/tileActionModeActive}",isOverflow:"{/isPhoneWidth}"}).addStyleClass("sapUshellOverlayGroupActionPanel");},_getHeaderActions:function(){var H=[];if(C.last("/core/home/gridContainer")){var o=new B({text:r.i18n.getText("AddTileBtn"),visible:"{= !${isGroupLocked}}",enabled:"{= !${/editTitle}}",press:this._handleAddTileToGroup.bind(this)}).addStyleClass("sapUshellHeaderActionButton");if(e.system.phone){o.setIcon("sap-icon://add");}H.push(o);}H.push(new B({text:{path:"isGroupVisible",formatter:function(i){return r.i18n.getText(i?"HideGroupBtn":"ShowGroupBtn");}},icon:{path:"isGroupVisible",formatter:function(i){if(e.system.phone){return i?"sap-icon://hide":"sap-icon://show";}return"";}},visible:"{= ${/enableHideGroups} && !${isGroupLocked} && !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(i){var s=i.getSource(),m=s.getBindingContext();this.oController._changeGroupVisibility(m);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));H.push(new B({text:{path:"removable",formatter:function(i){return r.i18n.getText(i?"DeleteGroupBtn":"ResetGroupBtn");}},icon:{path:"removable",formatter:function(i){if(e.system.phone){return i?"sap-icon://delete":"sap-icon://refresh";}return"";}},visible:"{= !${isDefaultGroup}}",enabled:"{= !${/editTitle}}",press:function(i){var s=i.getSource(),m=s.getBindingContext();this.oController._handleGroupDeletion(m);}.bind(this)}).addStyleClass("sapUshellHeaderActionButton"));return H;},_handleAddTileToGroup:function(o){if(document.toDetail){document.toDetail();}d.getOwnerComponentFor(this.oController.getView().parentComponent).getRouter().navTo("appfinder",{"innerHash*":"catalog/"+JSON.stringify({targetGroup:encodeURIComponent(o.getSource().getBindingContext().sPath)})});},_hidePlusTile:function(p){if(p){p.classList.add("sapUshellHidePlusTile");}},_showPlusTile:function(p){if(p){p.classList.remove("sapUshellHidePlusTile");}}});return l;});