// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/controls/SearchLayout','sap/ushell/renderers/fiori2/search/controls/SearchResultListContainer','sap/ushell/renderers/fiori2/search/controls/SearchResultList','sap/ushell/renderers/fiori2/search/controls/SearchResultTable','sap/ushell/renderers/fiori2/search/controls/SearchSpreadsheet','sap/ushell/renderers/fiori2/search/controls/SearchNoResultScreen','sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/controls/SearchLabel','sap/ushell/renderers/fiori2/search/controls/SearchLink','sap/ushell/renderers/fiori2/search/controls/SearchResultMap','sap/ushell/renderers/fiori2/search/controls/SearchResultListItem','sap/ushell/renderers/fiori2/search/controls/CustomSearchResultListItem','sap/ushell/renderers/fiori2/search/controls/SearchFacetFilter','sap/ushell/renderers/fiori2/search/controls/DivContainer','sap/ushell/renderers/fiori2/search/controls/SearchTilesContainer','sap/ushell/renderers/fiori2/search/controls/SearchFilterBar','sap/ushell/services/Personalization','sap/m/TablePersoController','sap/ui/vbm/AnalyticMap','sap/ui/vbm/Spot','sap/m/BusyDialog'],function(S,a,b,c,d,f,g,h,j,k,l,C){"use strict";return sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.Search",{createContent:function(o){var t=this;t.totalCountHiddenElement=t.assembleCountHiddenElement();t.centerArea=t.assembleCenterArea();var r=new a({centerArea:t.centerArea,totalCountBar:t.assembleCountLabel(),noResultScreen:new f({searchBoxTerm:{parts:[{path:'/queryFilter/searchTerm'}],formatter:function(s){return s;}},visible:{parts:[{path:'/count'},{path:'/isBusy'},{path:'/firstSearchWasExecuted'}],formatter:function(e,i,m){return e===0&&!i&&m;}}}),totalCountHiddenElement:t.totalCountHiddenElement});t.searchLayout=new S({resultListContainer:r,busyIndicator:new sap.m.BusyDialog(),isBusy:'{/isBusy}',busyDelay:'{/busyDelay}',showFacets:{parts:[{path:'/count'},{path:'/facetVisibility'},{path:'/uiFilter/rootCondition'},{path:'/isBusy'}],formatter:function(e,i,m,n){if(!i){return false;}var p=m&&m.conditions&&m.conditions.length>0;if(e===0&&!p&&!n){return false;}return true;}},vertical:false,facets:new sap.ushell.renderers.fiori2.search.controls.SearchFacetFilter()});t.searchLayout.addStyleClass('sapUshellSearchLayout');t.searchContainer=new sap.ushell.renderers.fiori2.search.controls.DivContainer({content:[t.searchLayout],cssClass:'sapUshellSearchContainer'});t.oFocusHandler=new g.SearchFocusHandler(t);return t.searchContainer;},assembleFilterButton:function(){var t=this;var e=new sap.m.ToggleButton({icon:sap.ui.core.IconPool.getIconURI("filter"),tooltip:{parts:[{path:'/facetVisibility'}],formatter:function(i){return i?sap.ushell.resources.i18n.getText("hideFacetBtn_tooltip"):sap.ushell.resources.i18n.getText("showFacetBtn_tooltip");}},pressed:'{/facetVisibility}',press:function(){if(this.getPressed()){t.searchLayout.setAnimateFacetTransition(true);t.getModel().setFacetVisibility(true);t.searchLayout.setAnimateFacetTransition(false);}else{t.searchLayout.setAnimateFacetTransition(true);t.getModel().setFacetVisibility(false);t.searchLayout.setAnimateFacetTransition(false);}},visible:{parts:[{path:'/businessObjSearchEnabled'},{path:'/count'}],formatter:function(i,m){if(m===0){return false;}return!sap.ui.Device.system.phone&&i;}}});e.addStyleClass('searchBarFilterButton');return e;},searchToolbarEntryVisibility:{parts:[{path:'/count'}],formatter:function(e){return e!==0&&!sap.ui.Device.system.phone;}},assembleCountLabel:function(){var e=new sap.m.Label({visible:{parts:[{path:'/count'}],formatter:function(i){return i!==0;}},text:{parts:[{path:'/count'},{path:'/nlqSuccess'},{path:'/nlqDescription'}],formatter:function(i,n,m){if(n){return m;}if(typeof i!=='number'){return"";}var o=g.formatInteger(i);return sap.ushell.resources.i18n.getText("results")+' ('+o+')';}}});e.addStyleClass('sapUshellSearchTotalCountSelenium');return e;},assembleCountHiddenElement:function(){var t=new sap.ui.core.InvisibleText({text:{parts:[{path:'/count'},{path:'/nlqSuccess'},{path:'/nlqDescription'}],formatter:function(e,n,i){if(n){return i;}if(typeof e!=='number'){return"";}return sap.ushell.resources.i18n.getText("results_count_for_screenreaders",[e]);}}});return t;},assembleSearchToolbar:function(w){var t=this;var e=t.assembleDisplaySwitchTapStrips();var i=new sap.m.Button({icon:"sap-icon://sort",tooltip:"{i18n>sortTable}",type:sap.m.ButtonType.Transparent,visible:{parts:[{path:'/displaySwitchVisibility'},{path:'/count'},{path:'/tableSortableColumns'}],formatter:function(o,p,q){return o&&p!==0&&q.length>1;}},press:function(o){t.tableSortDialog.open();}});e.addEventDelegate({onAfterRendering:function(E){var D=E.srcControl;if(D.getItems().length===2&&t.determineIfMaps(t)){D.addItem(new sap.m.SegmentedButtonItem({icon:"sap-icon://map",tooltip:sap.ushell.resources.i18n.getText("displayMap"),key:"map"}));}else if(D.getItems().length===3&&!t.determineIfMaps(t)){D.removeItem(D.getItems()[2]);if(t.getModel().getProperty('/resultToDisplay')==="searchResultMap"){t.getModel().setProperty('/resultToDisplay',"searchResultList");}}}});e.addStyleClass("sapUshellSearchResultDisplaySwitch");i.addStyleClass("sapUshellSearchTableSortButton");var m=new sap.m.Button("tablePersonalizeButton",{icon:"sap-icon://action-settings",tooltip:"{i18n>personalizeTable}",type:sap.m.ButtonType.Transparent,visible:{parts:[{path:'/resultToDisplay'}],formatter:function(r){return r==="searchResultTable";}},press:function(o){t.oTablePersoController.openDialog();}});m.addStyleClass("sapUshellSearchTablePersonalizeButton");var n=new sap.m.Button("dataExportButton",{icon:"sap-icon://download",tooltip:"{i18n>exportData}",type:sap.m.ButtonType.Transparent,visible:{parts:[{path:'/displaySwitchVisibility'},{path:'/count'}],formatter:function(o,p){return o&&p!==0;}},press:function(){if(t.searchSpreadsheet===undefined){t.searchSpreadsheet=new d("ushell-search-spreadsheet");}t.searchSpreadsheet.onExport();}});if(!w){var s=this.assembleShareButton();return[n,m,i,s,e];}return[n,m,i,e];},assembleShareButton:function(){var t=this;var B=new sap.ushell.ui.footerbar.AddBookmarkButton({beforePressHandler:function(){var o={url:document.URL,title:t.getModel().getDocumentTitle(),icon:sap.ui.core.IconPool.getIconURI("search")};B.setAppData(o);}});B.setWidth('auto');var e=new sap.m.Button();e.setIcon("sap-icon://email");e.setText(sap.ushell.resources.i18n.getText("eMailFld"));e.attachPress(function(){sap.m.URLHelper.triggerEmail(null,t.getModel().getDocumentTitle(),document.URL);});e.setWidth('auto');var A=new sap.m.ActionSheet({placement:'Bottom',buttons:[B,e]});var s=new sap.m.Button({icon:'sap-icon://action',tooltip:sap.ushell.resources.i18n.getText('shareBtn'),press:function(){A.openBy(s);}});return s;},assembleDataSourceTapStrips:function(){var t=this;var e=new sap.m.OverflowToolbar({design:sap.m.ToolbarDesign.Transparent,visible:{parts:[{path:'/facetVisibility'},{path:'/count'},{path:'/businessObjSearchEnabled'}],formatter:function(i,n,o){return!i&&n>0&&o;}}});e.data("sap-ui-fastnavgroup","false",true);e.addStyleClass('searchTabStrips');t.tabBar=e;var m=new sap.ui.core.InvisibleText({text:"Data Sources"}).toStatic();e.addDependent(m);e.addAriaLabelledBy(m);e.bindAggregation('content','/tabStrips/strips',function(I,o){var n=new sap.m.ToggleButton({text:'{labelPlural}',type:{parts:[{path:'/tabStrips/selected'}],formatter:function(s){var i=this.getBindingContext().getObject();if(i===s){return sap.m.ButtonType.Transparent;}return sap.m.ButtonType.Transparent;}},pressed:{parts:[{path:'/tabStrips/selected'}],formatter:function(s){var i=this.getBindingContext().getObject();return i===s;}},press:function(q){this.setType(sap.m.ButtonType.Transparent);if(this.getBindingContext().getObject()===t.getModel().getProperty('/tabStrips/selected')){this.setPressed(true);return;}var B=t.tabBar.getContent();for(var i=0;i<B.length;i++){if(B[i].getId()!==this.getId()){B[i].setType(sap.m.ButtonType.Transparent);if(B[i].getPressed()===true){B[i].setPressed(false);}}}t.getModel().setDataSource(this.getBindingContext().getObject());}});var p=new sap.ui.core.InvisibleText({text:o.getProperty("labelPlural")+", "+sap.ushell.resources.i18n.getText("dataSource")}).toStatic();n.addAriaLabelledBy(p);n.addDependent(p);return n;});e._setupItemNavigation=function(){if(!this.theItemNavigation){this.theItemNavigation=new sap.ui.core.delegate.ItemNavigation();this.addDelegate(this.theItemNavigation);}this.theItemNavigation.setCycling(false);this.theItemNavigation.setRootDomRef(this.getDomRef());var n=[];var o=this.getContent();for(var i=0;i<o.length;i++){if(!$(o[i].getDomRef()).attr("tabindex")){var p="-1";if(o[i].getPressed&&o[i].getPressed()){p="0";}$(o[i].getDomRef()).attr("tabindex",p);}n.push(o[i].getDomRef());}var q=this.getAggregation("_overflowButton");if(q&&q.getDomRef){var _=q.getDomRef();n.push(_);$(_).attr("tabindex","-1");}this.theItemNavigation.setItemDomRefs(n);};e.addEventDelegate({onAfterRendering:function(E){var t=this;t.getAggregation("_overflowButton").addEventDelegate({onAfterRendering:function(E){t._setupItemNavigation();}},t.getAggregation("_overflowButton"));var i=$(t.getDomRef());i.attr("role","tablist");i.children("button").attr("role","tab");t._setupItemNavigation();}},e);return e;},reorgTabBarSequence:function(){if(!this.tabBar){return;}var e=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.High});var n=new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow});var B=this.tabBar.getContent();for(var i=0;i<B.length;i++){if(this.getModel().getProperty('/tabStrips/selected')===B[i].getBindingContext().getObject()){B[i].setLayoutData(n);}else{B[i].setLayoutData(e);}}},determineIfMaps:function(o){var I=false;if(o.getModel()){var e=o.getModel().getDataSource();if(typeof e!=='undefined'&&e.attributesMetadata){var m=e.attributesMetadata;for(var i=0;i<m.length;i++){var t=m[i].type;if(t==="GeoJson"){I=true;break;}}}if(o.getModel().config.maps===true){I=true;}else if(o.getModel().config.maps===false){I=false;}}return I;},assembleDisplaySwitchTapStrips:function(){var t=this;var i=[new sap.m.SegmentedButtonItem({icon:"sap-icon://list",tooltip:sap.ushell.resources.i18n.getText("displayList"),key:"list"}),new sap.m.SegmentedButtonItem({icon:"sap-icon://table-view",tooltip:sap.ushell.resources.i18n.getText("displayTable"),key:"table"})];if(t.determineIfMaps(t)){i.push(new sap.m.SegmentedButtonItem({icon:"sap-icon://map",tooltip:sap.ushell.resources.i18n.getText("displayMap"),key:"map"}));}var s=new sap.m.SegmentedButton('ResultViewType',{selectedKey:{parts:[{path:'/resultToDisplay'}],formatter:function(r){var e="list";if(r==="searchResultTable"){e="table";}else if(r==="searchResultList"){e="list";}else if(r==="searchResultMap"){e="map";}return e;}},items:i,visible:{parts:[{path:'/displaySwitchVisibility'},{path:'/count'}],formatter:function(e,m){return e&&m!==0;}},select:function(e){var m=e.mParameters.key;var n=t.getModel();switch(m){case"list":n.setProperty('/resultToDisplay',"searchResultList");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());t.searchResultMap.setVisible(false);break;case"table":n.setProperty('/resultToDisplay',"searchResultTable");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());t.searchResultMap.setVisible(false);break;case"map":n.setProperty('/resultToDisplay',"searchResultMap");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());break;default:n.setProperty('/resultToDisplay',"searchResultList");t.showMoreFooter.setVisible(t.isShowMoreFooterVisible());}n.enableOrDisableMultiSelection();}.bind(this)});s.addStyleClass("sapUshellSearchDisplaySwitchTapStrips");return s;},isShowMoreFooterVisible:function(){var m=this.getModel();return m.getProperty("/boCount")>m.getProperty("/boResults").length;},assembleCenterArea:function(){var t=this;t.tableSortDialog=t.assembleSearchResultSortDialog();var s=t.assembleSearchResultList();t.searchResultTable=t.assembleSearchResultTable();t.searchResultTable.addDelegate({onBeforeRendering:function(){t.updateTableLayout();},onAfterRendering:function(){var e=$(t.searchResultTable.getDomRef()).find("table > thead > tr:first");if(e){e.attr("aria-labelledby",t.totalCountHiddenElement.getId());}}});t.searchResultMap=t.assembleSearchResultMap();t.searchResultMap.setVisible(false);t.appSearchResult=t.assembleAppSearch();t.showMoreFooter=t.assembleShowMoreFooter();return[t.tableSortDialog,s,t.searchResultTable,t.searchResultMap,t.appSearchResult,t.showMoreFooter,t.totalCountHiddenElement];},assembleSearchResultSortDialog:function(){var t=this;var e=new sap.m.ViewSettingsDialog({sortDescending:{parts:[{path:"/orderBy"}],formatter:function(o){return jQuery.isEmptyObject(o)||o.sortOrder==="DESC";}},confirm:function(i){var p=[];p=i.getParameters();if(p.sortItem){var o=t.getModel();if(p.sortItem.getKey()==="searchSortableColumnKeyDefault"){o.resetOrderBy();e.setSortDescending(true);}else{o.setOrderBy({orderBy:p.sortItem.getBindingContext().getObject().attributeId,sortOrder:p.sortDescending===true?"DESC":"ASC"});}}},cancel:function(i){var m=t.getModel().getOrderBy().orderBy===undefined?"searchSortableColumnKeyDefault":t.getModel().getOrderBy().orderBy;this.setSelectedSortItem(m);}});e.bindAggregation("sortItems","/tableSortableColumns",function(p,D){return new sap.m.ViewSettingsItem({key:"{key}",text:"{name}",selected:"{selected}"});});return e;},assembleSearchResultTable:function(){var t=this;var r=new c("ushell-search-result-table",{mode:{parts:[{path:'/multiSelectionEnabled'}],formatter:function(m){return m===true?sap.m.ListMode.MultiSelect:sap.m.ListMode.None;}},noDataText:'{i18n>noCloumnsSelected}',visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(e,i){return e==="searchResultTable"&&i!==0;}},popinLayout:sap.m.PopinLayout.GridLarge,rememberSelections:false});r.bindAggregation("columns","/tableColumns",function(p,D){var e=D.getObject();var i=new sap.m.Column(e.key,{header:new sap.m.Label({text:"{name}",tooltip:"{name}"}),visible:{parts:[{path:'index'}],formatter:function(m){return m<6;}}});return i;});r.bindAggregation("items","/tableResults",function(p,D){return t.assembleTableItems(D);});r.addEventDelegate({onAfterRendering:function(){t.updatePersoServiceAndController();}});return r;},assembleTableItems:function(D){var t=this;var o=D.getObject();if(o.type==='footer'){return new sap.m.CustomListItem({visible:false});}return t.assembleTableMainItems(o,D.getPath());},assembleTableMainItems:function(D,p){var s=p+"/cells";var e=new sap.m.ColumnListItem({selected:"{selected}"});e.bindAggregation("cells",s,function(s,m){if(m.getObject().isTitle){var t="";var n;var o=m.getObject().titleNavigation;if(o){t=o.getHref();n=o.getTarget();}var q=!!((t&&t.length>0));var r=new j({text:"{value}",enabled:q,href:t,press:function(){var o=m.getObject().titleNavigation;if(o){o.performNavigation({trackingOnly:true});}}});r.addStyleClass("sapUshellSearchResultListItem-MightOverflow");if(n){r.setTarget(n);}return r;}else if((m.getObject().isRelatedApps)){var u=m.getObject().navigationObjects;var v=[];var w={};var x=function(z,y){y.performNavigation();};for(var i=0;i<u.length;i++){var y=u[i];w=new sap.m.Button({text:y.getText(),tooltip:y.getText()});w.attachPress(y,x);v.push(w);}return new sap.m.Button({icon:"sap-icon://action",press:function(){var z=new sap.m.ActionSheet({buttons:v,placement:sap.m.PlacementType.Auto});z.openBy(this);}});}return new h({text:"{value}"}).addStyleClass("sapUshellSearchResultListItem-MightOverflow");});return e;},onRegionClick:function(e){},onRegionContextMenu:function(e){},assembleSearchResultMap:function(){var s=new k({visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,e){return r==="searchResultMap"&&e!==0;}}});return s;},assembleShowMoreFooter:function(){var t=this;var e=new sap.m.Button({text:"{i18n>showMore}",type:sap.m.ButtonType.Transparent,press:function(){var o=t.getModel();o.setProperty('/focusIndex',o.getTop());var n=o.getTop()+o.pageSize;o.setTop(n);o.eventLogger.logEvent({type:o.eventLogger.SHOW_MORE});}});e.addStyleClass('sapUshellResultListMoreFooter');var i=new sap.m.FlexBox({visible:{parts:[{path:'/boCount'},{path:'/boResults'}],formatter:function(m,n){return n.length<m;}},justifyContent:sap.m.FlexJustifyContent.Center});i.addStyleClass('sapUshellResultListMoreFooterContainer');i.addItem(e);return i;},assembleSearchResultList:function(){var t=this;t.resultList=new b({mode:sap.m.ListMode.None,width:"auto",showNoData:false,visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,e){return r==="searchResultList"&&e!==0;}}});t.resultList.bindAggregation("items","/results",function(p,o){return t.assembleListItem(o);});return t.resultList;},assembleAppSearch:function(){var t=this;var e=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer("AppSearchContainer",{addAccInformation:true,maxRows:99999,totalLength:'{/appCount}',visible:{parts:[{path:'/resultToDisplay'},{path:'/count'}],formatter:function(r,i){return r==="appSearchResult"&&i!==0;}},highlightTerms:'{/uiFilter/searchTerm}',showMore:function(){var m=t.getModel();m.setProperty('/focusIndex',e.getNumberDisplayedTiles()-1);var n=m.getTop()+m.pageSize*e.getTilesPerRow();m.setTop(n);}});e.bindAggregation('tiles','/appResults',function(i,o){if(t.getModel().getResultToDisplay()==="appSearchResult"){return o.getObject().getView();}return new sap.m.Text({text:""});});e.addStyleClass('sapUshellSearchTileResultList');return e;},assembleTitleItem:function(D){var i=new sap.m.CustomListItem();var t=new sap.m.Label({text:"{title}"});t.addStyleClass('bucketTitle');i.addStyleClass('bucketTitleContainer');i.addContent(new sap.m.HBox({items:[t]}));return i;},assembleAppContainerResultListItem:function(D,p){var t=this;var e=new sap.ushell.renderers.fiori2.search.controls.SearchTilesContainer("AppSearchContainerResultListItem",{maxRows:sap.ui.Device.system.phone?2:1,totalLength:'{/appCount}',highlightTerms:'{/uiFilter/searchTerm}',enableKeyHandler:false,resultList:t.resultList,showMore:function(){var m=t.getModel();m.setDataSource(m.appDataSource);}});e.bindAggregation('tiles','tiles',function(I,o){if(t.getModel().getResultToDisplay()!=="appSearchResult"){return o.getObject().getView();}return new sap.m.Text({text:""});});var i=new sap.m.CustomListItem({content:e});i.addStyleClass('sapUshellSearchResultListItem');i.addStyleClass('sapUshellSearchResultListItemApps');i.addEventDelegate({onAfterRendering:function(E){var m=$(i.getDomRef());m.removeAttr("tabindex");m.removeAttr("role");m.attr("aria-hidden","true");}},i);return i;},assembleResultListItem:function(D,p){var t=this;var e=this.getModel().config.getDataSourceConfig(D.dataSource);var s={dataSource:D.dataSource,title:"{title}",titleDescription:"{titleDescription}",titleNavigation:"{titleNavigation}",type:"{dataSourceName}",imageUrl:"{imageUrl}",imageFormat:"{imageFormat}",imageNavigation:"{imageNavigation}",geoJson:"{geoJson}",attributes:"{itemattributes}",navigationObjects:"{navigationObjects}",selected:"{selected}",expanded:"{expanded}",positionInList:"{positionInList}",resultSetId:"{resultSetId}",layoutCache:"{layoutCache}"};var i;if(e.searchResultListItemControl){i=new e.searchResultListItemControl(s);}else if(e.searchResultListItemContentControl){s.content=new e.searchResultListItemContentControl();i=new C(s);}else{i=new l(s);}if(i.setTotalCountHiddenElement){i.setTotalCountHiddenElement(t.totalCountHiddenElement);}var m=new sap.m.CustomListItem({content:i,type:sap.m.ListType.Inactive});m.addStyleClass('sapUshellSearchResultListItem');if(i.setParentListItem){i.setParentListItem(m);}return m;},assembleListItem:function(o){var t=this;var D=o.getObject();if(D.type==='title'){return t.assembleTitleItem(D);}else if(D.type==='footer'){return new sap.m.CustomListItem();}else if(D.type==='appcontainer'){return t.assembleAppContainerResultListItem(D,o.getPath());}return t.assembleResultListItem(D,o.getPath());},onAllSearchStarted:function(){},onAllSearchFinished:function(){var t=this;t.reorgTabBarSequence();t.oFocusHandler.setFocus();var v=sap.ui.getCore().byId('viewPortContainer');if(v&&v.switchState){v.switchState('Center');}},updatePersoServiceAndController:function(){var t=this;var m=t.getModel();var e=m.getDataSource().id;var s='search-result-table-state-'+e;if(!t.oTablePersoController){var p=m.getPersonalizationStorageInstance();t.oTablePersoController=new sap.m.TablePersoController({table:sap.ui.getCore().byId("ushell-search-result-table"),persoService:p.getPersonalizer(s)}).activate();t.oTablePersoController.refresh();}if(t.oTablePersoController&&t.oTablePersoController.getPersoService().getKey()!==s){t.oTablePersoController.setPersoService(m.getPersonalizationStorageInstance().getPersonalizer(s));t.oTablePersoController.refresh();}},updateTableLayout:function(){var t=this;if(t.searchResultTable&&t.oTablePersoController){var e=t.getModel().getDataSource().id;var s='search-result-table-state-'+e;t.oTablePersoController.getPersoService(s).getPersData().then(function(p){if(p&&p.aColumns){var m=p.aColumns;var n=this.searchResultTable.getColumns();var v=0;for(var i=0;i<m.length;i++){var o=m[i].id.split('table-searchColumnKey').pop();var q=n[parseInt(o,10)];if(q){q.setDemandPopin(false);if(m[i].visible){v++;q.setDemandPopin(true);q.setPopinDisplay(sap.m.PopinDisplay.Inline);var r=12*v;q.setMinScreenWidth(r+"rem");}}}if(v<=3){this.searchResultTable.setFixedLayout(false);}else{this.searchResultTable.setFixedLayout(true);}}}.bind(this));}},setAppView:function(A){var t=this;t.oAppView=A;if(t.oTilesContainer){t.oTilesContainer.setAppView(A);}},getControllerName:function(){return"sap.ushell.renderers.fiori2.search.container.Search";}});});
