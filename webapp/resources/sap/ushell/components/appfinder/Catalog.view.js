// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/HTML","sap/ushell/ui/appfinder/AppBox","sap/ushell/ui/appfinder/PinButton","sap/ushell/ui/launchpad/CatalogEntryContainer","sap/ushell/ui/launchpad/CatalogsContainer","sap/ushell/ui/launchpad/Panel","sap/ushell/ui/launchpad/Tile","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/m/List","sap/m/StandardListItem","sap/ushell/renderers/fiori2/AccessKeysHandler","sap/ushell/components/homepage/ComponentKeysHandler","sap/ui/Device","sap/m/MessagePage","sap/m/Page","sap/m/BusyIndicator","sap/m/SplitApp"],function(H,A,P,C,a,b,T,q,M,r,c,L,S,d,f,D,g,h,B,i){"use strict";sap.ui.jsview("sap.ushell.components.appfinder.Catalog",{oController:null,createContent:function(o){var t=this;this.oViewData=this.getViewData();this.parentComponent=this.oViewData.parentComponent;var m=this.parentComponent.getModel();this.setModel(m);this.setModel(this.oViewData.subHeaderModel,"subHeaderModel");this.oController=o;function j(e){return((e!==null)&&(e==="1x2"||e==="2x2"))||false;}function k(v){return parseInt(v,10)||0;}function l(e,v,I,J,K,N){var O;if(J){var R=r.i18n,Q=I?Array.prototype.indexOf.call(I,K):-1;O=R.getText(Q!==-1?"removeAssociatedTileFromContextGroup":"addAssociatedTileToContextGroup",N);}else{O=I&&I.length?v:e;}return O;}var n=new P({icon:"sap-icon://pushpin-off",selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:function(e,v,I,J){if(I){var K=e?Array.prototype.indexOf.call(e,J):-1;return K!==-1;}return!!v;}},tooltip:{parts:["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip","i18n>EasyAccessMenu_PinButton_Toggled_Tooltip","associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id","/groupContext/title"],formatter:function(e,v,I,J,K,N,O){return l(e,v,I,K,N,O);}},press:[o.onTilePinButtonClick,o]});var p=new P({icon:"sap-icon://pushpin-off",selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:function(e,v,I,J){if(I){var K=e?Array.prototype.indexOf.call(e,J):-1;return K!==-1;}return!!v;}},tooltip:{parts:["i18n>EasyAccessMenu_PinButton_UnToggled_Tooltip","i18n>EasyAccessMenu_PinButton_Toggled_Tooltip","associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id","/groupContext/title"],formatter:function(e,v,I,J,K,N,O){return l(e,v,I,K,N,O);}},press:[o.onTilePinButtonClick,o]});this.oAppBoxesTemplate=new A({title:"{title}",icon:"{icon}",subtitle:"{subtitle}",url:"{url}",navigationMode:"{navigationMode}",pinButton:p,press:[o.onAppBoxPressed,o]});p.addCustomData(new c({key:"tabindex",value:"-1",writeToDom:true}));p.addStyleClass("sapUshellPinButton");n.addCustomData(new c({key:"tabindex",value:"-1",writeToDom:true}));n.addStyleClass("sapUshellPinButton");this.oTileTemplate=new T({tileViews:{path:"content",factory:function(I,e){return e.getObject();}},"long":{path:"size",formatter:j},index:{path:"id",formatter:k},tileCatalogId:"{id}",pinButton:n,press:[o.catalogTilePress,o],afterRendering:o.onTileAfterRendering});this.oCatalogSelect=new L("catalogSelect",{visible:"{/enableCatalogSelection}",name:"Browse",rememberSelections:true,mode:"SingleSelectMaster",items:{path:"/masterCatalogs",template:new S({type:"Active",title:"{title}",tooltip:"{title}"})},showNoData:false,itemPress:[o._handleCatalogListItemPress,o],selectionChange:[o._handleCatalogListItemPress,o]});this.getCatalogSelect=function(){return this.oCatalogSelect;};var s=this.oCatalogSelect.onAfterRendering;this.oCatalogSelect.addEventDelegate({onsaptabnext:function(v){try{v.preventDefault();d.setIsFocusHandledByAnotherHandler(true);f.setFocusOnCatalogTile();}catch(e){}},onsapskipforward:function(v){try{v.preventDefault();d.setIsFocusHandledByAnotherHandler(true);f.setFocusOnCatalogTile();}catch(e){}},onsapskipback:function(v){try{v.preventDefault();d.setIsFocusHandledByAnotherHandler(true);var I=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(I.getVisible()){I.focus();}else{f.appFinderFocusMenuButtons(v);}}catch(e){}}});if(m.getProperty("/enableHelp")){this.oCatalogSelect.addStyleClass("help-id-catalogCategorySelect");}this.setCategoryFilterSelection=function(e,v){var I=t.getCatalogSelect(),J=I.getItems(),K=e,N=0;if(!K||K===""){K=r.i18n.getText("all");}J.forEach(function(O,Q){if(O.getTitle()===K){N=Q;I.setSelectedItem(O);}});if(J.length!==0&&v){J[N].focus();}};this.oCatalogSelect.onAfterRendering=function(){var e=t.oController.categoryFilter||r.i18n.getText("all");t.setCategoryFilterSelection(e);if(s){s.apply(this,arguments);}if(!this.getSelectedItem()){this.setSelectedItem(this.getItems()[0]);}setTimeout(function(){var v=q("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");if(v.length){v.eq(0).focus();}else{q("#catalog-button").focus();}},0);};var u=this.oCatalogSelect._onAfterRenderingPopover;this.oCatalogSelect._onAfterRenderingPopover=function(){if(this._oPopover){this._oPopover.setFollowOf(false);}if(u){u.apply(this,arguments);}};var E=sap.ui.getCore().getEventBus(),w,U=function(){this.splitApp.toMaster("catalogSelect","show");if(!D.system.phone){w=this._calculateDetailPageId();if(w!==this.splitApp.getCurrentDetailPage().getId()){this.splitApp.toDetail(w);}}};E.subscribe("launchpad","catalogContentLoaded",function(){setTimeout(U.bind(this),500);},this);E.subscribe("launchpad","afterCatalogSegment",U,this);var x=new H("sapUshellCatalogAccessibilityTileText",{content:"<div style='height: 0px; width: 0px; overflow: hidden; float: left;'>"+r.i18n.getText("tile")+"</div>"});var y=new C({header:"{title}",customTilesContainer:{path:"customTiles",template:this.oTileTemplate,templateShareable:true},appBoxesContainer:{path:"appBoxes",template:this.oAppBoxesTemplate,templateShareable:true}});this.oMessagePage=new g({visible:true,showHeader:false,text:r.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),description:""});this.oCatalogsContainer=new a("catalogTiles",{categoryFilter:"{/categoryFilter}",catalogs:{path:"/catalogs",templateShareable:true,template:y},busy:true});this.oCatalogsContainer.addStyleClass("sapUshellCatalogTileContainer");this.oCatalogsContainer.addEventDelegate({onsaptabprevious:function(e){var v=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader"),I=q(e.srcControl.getDomRef());if(v.getVisible()&&!v.getPressed()&&!I.hasClass("sapUshellPinButton")){e.preventDefault();var J=sap.ui.getCore().byId("appFinderSearch");J.focus();}},onsapskipback:function(e){var v=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(v.getVisible()&&!v.getPressed()){e.preventDefault();v.focus();}}});this.oCatalogsContainer.onAfterRendering=function(){var e=sap.ui.getCore().byId("catalogTilesDetailedPage");if(!this.getBusy()){e.setBusy(false);M.end("FLP:AppFinderLoadingStartToEnd");}else{e.setBusy(true);}q("#catalogTilesDetailedPage-cont").scroll(function(){var v=sap.ui.getCore().byId("catalogTilesDetailedPage"),I=v.getScrollDelegate(),J=I.getScrollTop(),K=I.getMaxScrollTop();if(K-J<=30+3*t.oController.PagingManager.getTileHeight()&&t.oController.bIsInProcess===false){t.oController.bIsInProcess=true;t.oController.allocateNextPage();setTimeout(function(){t.oController.bIsInProcess=false;},0);}});};this.wrapCatalogsContainerInDetailPage=function(e,I){var v=new h(I,{showHeader:false,showFooter:false,showNavButton:false,content:[new b({translucent:true,content:e}).addStyleClass("sapUshellCatalogPage")]});return v;};this.getCatalogContainer=function(){return this.oCatalogsContainer;};new h({showHeader:false,showFooter:false,showNavButton:false,content:[new b({translucent:true,content:[x,this.getCatalogContainer()]}).addStyleClass("sapUshellCatalogPage")]});var z=this.wrapCatalogsContainerInDetailPage([x,this.getCatalogContainer()],"catalogTilesDetailedPage"),F=new h("catalogMessagePage",{showHeader:false,showFooter:false,showNavButton:false,content:[this.oMessagePage]});var G=new B("catalogSelectBusyIndicator",{size:"1rem"});this.splitApp=new i("catalogViewMasterDetail",{masterPages:[G,this.oCatalogSelect],detailPages:[z,F]});document.toSearch=function(){this.splitApp.toDetail("catalogTilesSearchPage");}.bind(this);document.toDetail=function(){this.splitApp.toDetail("catalogTilesDetailedPage");}.bind(this);document.toMessage=function(){this.splitApp.toDetail("catalogMessagePage");}.bind(this);return this.splitApp;},_calculateDetailPageId:function(){var s=this.getModel("subHeaderModel");var e=s.getProperty("/search/searchMode");var t=s.getProperty("/tag/tagMode");var n=!!this.getModel().getProperty("/catalogsNoDataText");var I;if(e||t){I=this.getController().bSearchResults?"catalogTilesDetailedPage":"catalogMessagePage";}else if(n){I="catalogMessagePage";}else{I="catalogTilesDetailedPage";}return I;},getControllerName:function(){return"sap.ushell.components.appfinder.Catalog";}});});