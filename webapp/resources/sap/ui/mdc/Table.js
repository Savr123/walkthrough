/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Control','./library','./ActionToolbar','sap/m/Text','sap/m/Title','sap/ui/core/format/NumberFormat','sap/ui/model/Sorter','sap/ui/core/dnd/DragDropInfo',"./TableSettings","./GridTableType","./ResponsiveTableType","sap/m/ColumnHeaderPopover","sap/ui/core/Item","sap/m/ColumnPopoverSortItem"],function(C,l,A,T,a,N,S,D,b,G,R,c,I,d){"use strict";var e=l.SelectionMode;var f=l.TableType;var g=l.RowAction;function s(t,v){sap.ui.require(["sap/m/MessageToast"],function(M){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");M.show(r.getText(t,v));});}var h=C.extend("sap.ui.mdc.Table",{library:"sap.ui.mdc",metadata:{designtime:"sap/ui/mdc/designtime/Table.designtime",specialSettings:{metadataContexts:{defaultValue:"{path:'',  name: 'collection'}"}},defaultAggregation:"columns",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},rowAction:{type:"sap.ui.mdc.RowAction[]"},p13nMode:{type:"sap.ui.mdc.TableP13nMode[]"},metadataDelegate:{type:"string",defaultValue:"sap/ui/mdc/TableDelegate"},metadataInfo:{type:"object",defaultValue:null},rowsBindingInfo:{type:"object",defaultValue:null},autoBindOnInit:{type:"boolean",group:"Misc",defaultValue:true},header:{type:"string",group:"Misc",defaultValue:null},headerVisible:{type:"boolean",group:"Misc",defaultValue:true},initiallyVisibleFields:{type:"string[]"},selectionMode:{type:"sap.ui.mdc.SelectionMode",defaultValue:e.None},showRowCount:{type:"boolean",group:"Misc",defaultValue:true},threshold:{type:"int",group:"Appearance",defaultValue:-1},noDataText:{type:"string"}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},type:{type:"sap.ui.mdc.TableTypeBase",altTypes:["sap.ui.mdc.TableType"],multiple:false},columns:{type:"sap.ui.mdc.Column",multiple:true},creationRow:{type:"sap.ui.mdc.CreationRow",multiple:false},actions:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_createToolbar",aggregation:"actions"}}},events:{rowPress:{parameters:{bindingContext:{type:"sap.ui.model.Context"}}},selectionChange:{parameters:{bindingContext:{type:"sap.ui.model.Context"},selected:{type:"boolean"},selectAll:{type:"boolean"}}}}},constructor:function(){this._oTableReady=new Promise(this._resolveTable.bind(this));C.apply(this,arguments);this.bCreated=true;this._iPendingColumnTemplate=0;this._doOneTimeOperations();this._initializeContent();},renderer:{apiVersion:2,render:function(r,o){r.openStart("div",o);r.class("sapUiMdcTable");r.style("height",o.getHeight());r.style("width",o.getWidth());r.openEnd();r.renderControl(o.getAggregation("_content"));r.close("div");}}});h.prototype.done=function(){return this._oTableReady;};h.prototype._resolveTable=function(r,i){this._fResolve=r;this._fReject=i;};h.prototype._getStringType=function(t){var i,o=i=t||this.getType();if(!o){i=f.Table;}else if(typeof o==="object"){i=o.isA("sap.ui.mdc.ResponsiveTableType")?f.ResponsiveTable:f.Table;}return i;};h.prototype._updateTypeSettings=function(){var t=this.getType();if(t&&typeof t==="object"){t.updateTableSettings();}else{t=t==="ResponsiveTable"?R:G;t.updateDefault(this._oTable);}};h.prototype.setType=function(t){var i=this._getStringType(t);var o=this._getStringType();this.setAggregation("type",t,true);if(i===o&&this._oTable){this._updateTypeSettings();return this;}if(this.bCreated){if(this._oTable){if(o==="ResponsiveTable"){this._oTable.setHeaderToolbar();}else{this._oTable.removeExtension(this._oToolbar);}this._oTable.destroy("KeepDom");this._oTable=null;this._bTableExists=false;}else{this._onAfterTableCreated();}if(this._oTemplate){this._oTemplate.destroy();this._oTemplate=null;}this._oTableReady=new Promise(this._resolveTable.bind(this));this._initializeContent();}return this;};h.prototype.setSelectionMode=function(m){var o=this.getSelectionMode();this.setProperty("selectionMode",m,true);if(this._oTable&&o!=this.getSelectionMode()){this._updateSelectionBehavior();}return this;};h.prototype.setRowAction=function(i){var o=this.getRowAction();this.setProperty("rowAction",i,true);if(((i&&i.length)!=(o&&o.length))||o[0]!=i[0]){this._updateRowAction();}return this;};h.prototype.setCreationRow=function(o){this.setAggregation("creationRow",o,true);if(o){o.update();}return this;};h.prototype.setP13nMode=function(m){var o=this.getP13nMode();this.setProperty("p13nMode",m,true);this._updatep13nSettings(o,m);return this;};h.prototype.setThreshold=function(t){this.setProperty("threshold",t,true);if(!this._oTable){return this;}t=this.getThreshold()>-1?this.getThreshold():undefined;if(this._bMobileTable){this._oTable.setGrowingThreshold(t);}else{this._oTable.setThreshold(t);}return this;};h.prototype.setNoDataText=function(n){this.setProperty("noDataText",n,true);if(!this._oTable){return this;}var i=this._getNoDataText();if(this._bMobileTable){this._oTable.setNoDataText(i);}else{this._oTable.setNoData(i);}return this;};h.prototype._getNoDataText=function(){if(!this._sFallbackNoData){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");this._sFallbackNoData=r.getText("table.NO_DATA","No items available.");}return this.getNoDataText()||this._sFallbackNoData;};h.prototype._updateRowAction=function(){if(!this._oTable){return;}var n=(this.getRowAction()||[]).indexOf(g.Navigation)>-1;var t=this._bMobileTable?R:G;t.updateRowAction(this,n,this._bMobileTable?undefined:this._onRowActionPress);};h.prototype._initializeContent=function(){var t=this._getStringType();var o=t==="ResponsiveTable"?R:G;Promise.all([this.oTableDelegateLoaded,o.loadTableModules()]).then(function(){if(this.bIsDestroyed){return;}if(!this._bTableExists&&t===this._getStringType()){this._bMobileTable=t==="ResponsiveTable";this._createContent();this._bTableExists=true;}}.bind(this));};h.prototype._doOneTimeOperations=function(){if(!this.oTableDelegateLoaded){this.oTableDelegateLoaded=new Promise(function(r,i){var t=this.getMetadataDelegate();sap.ui.require([t],function(j){this.oTableDelegate=j;r();}.bind(this),function(){i("Faled to load delegate");});}.bind(this));}if(!this.bColumnsOrdered){this.bColumnsOrdered=true;this._orderColumns();}};h.prototype._onAfterTableCreated=function(r){if(r&&this._fResolve){this._fResolve(this);}else if(this._fReject){this._fReject(this);}delete this._fResolve;delete this._fReject;};h.prototype._createContent=function(){this._createToolbar();this._createTable();this._updateRowAction();var o=this.getCreationRow();if(o){o.update();}var m=this.getColumns();m.forEach(this._insertInnerColumn,this);this.setAggregation("_content",this._oTable);if(this.getAutoBindOnInit()){this.rebindTable();}this._onAfterTableCreated(true);};h.prototype.setHeader=function(t){this.setProperty("header",t,true);this._updateHeaderText();return this;};h.prototype.setHeaderVisible=function(v){this.setProperty("headerVisible",v,true);if(this._oTitle){this._oTitle.toggleStyleClass("sapMdcTableHeaderHidden",!this.getHeaderVisible());}return this;};h.prototype._createToolbar=function(){if(!this._oToolbar){this._oTitle=new a(this.getId()+"-title",{text:this.getHeader()});if(!this.getHeaderVisible()){this._oTitle.addStyleClass("sapMdcTableHeaderHidden");}this._oToolbar=new A(this.getId()+"-toolbar",{design:"Transparent",begin:[this._oTitle],end:this._getP13nButtons()});}return this._oToolbar;};h.prototype._getP13nButtons=function(){var p=this.getP13nMode()||[],B=[];if(p.length>0){if(p.indexOf("Sort")>-1){B.push(b.createSortButton(this.getId(),[this._showSort,this]));}if(p.indexOf("Column")>-1){B.push(b.createColumnsButton(this.getId(),[this._showSettings,this]));}}return B;};h.prototype._updatep13nSettings=function(o,m){if(this._oToolbar){this._oToolbar.destroyEnd();var B=this._getP13nButtons();B.forEach(function(j){this._oToolbar.addEnd(j);},this);}if(this._oTable){var i=this._oTable.getDragDropConfig()[0];if(i){i.setEnabled((m||[]).indexOf("Column")>-1);}}};h.prototype._createTable=function(){var t=this.getThreshold()>-1?this.getThreshold():undefined;if(this._bMobileTable){this._oTable=R.createTable(this.getId()+"-innerTable",{growing:true,sticky:["ColumnHeaders","HeaderToolbar"],itemPress:[this._onItemPress,this],selectionChange:[this._onSelectionChange,this],growingThreshold:t,noDataText:this._getNoDataText(),headerToolbar:this._oToolbar,ariaLabelledBy:[this._oTitle]});this._oTemplate=R.createTemplate(this.getId()+"-innerTableRow");this._createColumn=h.prototype._createMobileColumn;this._sAggregation="items";this._oTable.bindRows=this._oTable.bindItems;this._oTable.bActiveHeaders=true;this._oTable.attachEvent("columnPress",this._onResponsiveTableColumnPress,this);}else{this._oTable=G.createTable(this.getId()+"-innerTable",{enableBusyIndicator:true,enableColumnReordering:false,threshold:t,cellClick:[this._onCellClick,this],noData:this._getNoDataText(),extension:[this._oToolbar],ariaLabelledBy:[this._oTitle]});this._createColumn=h.prototype._createColumn;this._sAggregation="rows";}this._updateTypeSettings();this._updateSelectionBehavior();var o=new D({sourceAggregation:"columns",targetAggregation:"columns",dropPosition:"Between",enabled:(this.getP13nMode()||[]).indexOf("Column")>-1,drop:[this._onColumnRearrange,this]});o.bIgnoreMetadataCheck=true;this._oTable.addDragDropConfig(o);};h.prototype._updateSelectionBehavior=function(){var t=this._bMobileTable?R:G;t.updateSelection(this,this._bMobileTable?undefined:this._onRowSelectionChange);};h.prototype._onColumnRearrange=function(E){var o=E.getParameter("draggedControl");var i=E.getParameter("droppedControl");if(o===i){return;}var j=E.getParameter("dropPosition");var k=this._oTable.indexOfColumn(o);var m=this._oTable.indexOfColumn(i);var n=m+(j=="Before"?0:1)+(k<m?-1:0);b.moveColumn(this,k,n);};h.prototype._onColumnPress=function(o){var p=this.getP13nMode()||[];if(p.indexOf("Sort")<0){return;}var j;if(o.getParent()){j=o.getParent().indexOfColumn(o);}var k=this.getColumns()[j].getDataProperties();if(!k.length){return;}var m,n=[];for(var i=0;i<k.length;i++){m=new I({text:k[i],key:k[i]});n.push(m);}if(n.length>0){this._oPopover=new c({items:[new d({sortChildren:n,sort:[this._onCustomSort,this]})]});this._oPopover.openBy(o);o.addDependent(this._oPopover);}};h.prototype._onCustomSort=function(E){var i=E.getParameter("property");b.createSort(this,i,true);};h.prototype._insertInnerColumn=function(m,i){if(!this._oTable){return;}var o=this._createColumn(m);this._setColumnTemplate(m,o,i);if(i===undefined){this._oTable.addColumn(o);}else{this._oTable.insertColumn(o,i);}this._updatePopinDelayed();};h.prototype._orderColumns=function(){var i,j=[],m=this.getColumns();m.forEach(function(o){i=o.getInitialIndex();if(i>-1){j.push({index:i,column:this.removeColumn(o)});}},this);j.sort(function(o,k){return o-k;});j.forEach(function(o){this.insertColumn(o.column,o.index);},this);};h.prototype._setColumnTemplate=function(m,o,i){var t=m.getTemplate();this._iPendingColumnTemplate++;if(t){this._setInnerColumnTemplate(m,o,i);}else if(this.oTableDelegate){this.oTableDelegate.createColumnTemplate({name:m.getDataProperties()[0]}).then(function(t){m.setTemplate(t);this._setInnerColumnTemplate(m,o,i);}.bind(this));}};h.prototype._setInnerColumnTemplate=function(m,o,i){var j=m.getTemplate(true),k;if(!this._bMobileTable){k=m.getCreationTemplate(true);[j,k].forEach(function(t){if(!t){return;}if(t.setWrapping){t.setWrapping(false);}if(t.setRenderWhitespace){t.setRenderWhitespace(false);}});o.setTemplate(j);o.setCreationTemplate(k);}else if(i>=0){this._oTemplate.insertCell(j,i);}else{this._oTemplate.addCell(j);}this._iPendingColumnTemplate--;if(this._bRebindPending&&this._iPendingColumnTemplate===0){this.rebindTable();}};h.prototype._createColumn=function(m){return G.createColumn(m.getId()+"-innerColumn",{width:m.getWidth(),hAlign:m.getHAlign(),label:m.getHeader(),showSortMenuEntry:false,showFilterMenuEntry:false,sortProperty:m.getDataProperties()[0],filterProperty:m.getDataProperties()[0],columnMenuOpen:[this._onGridTableColumnPress,this]});};h.prototype._createMobileColumn=function(m){return R.createColumn(m.getId()+"-innerColumn",{width:m.getWidth(),hAlign:m.getHAlign(),header:new T(m.getId()+"-innerColumnHeader",{textAlign:m.getHAlign(),text:m.getHeader(),wrappingType:"Hyphenated"})});};h.prototype.removeColumn=function(m){m=this.removeAggregation("columns",m,true);if(this._oTable){var o=this._oTable.removeColumn(m.getId()+"-innerColumn");if(this._oTemplate){this._oTemplate.removeCell(m.getTemplate(true));}o.destroy();this._updatePopinDelayed();}return m;};h.prototype.addColumn=function(m){this.addAggregation("columns",m,true);this._insertInnerColumn(m);return this;};h.prototype.insertColumn=function(m,i){this.insertAggregation("columns",m,i,true);this._insertInnerColumn(m,i);return this;};h.prototype._updatePopinDelayed=function(){if(this._bMobileTable){if(this._iPopinTimeout){clearTimeout(this._iPopinTimeout);}this._iPopinTimeout=setTimeout(this._updatePopin.bind(this),0);}};h.prototype._updatePopin=function(){delete this._iPopinTimeout;var j,m=0,k,n;if(this._bMobileTable&&this._oTable){j=this._oTable.getColumns();j.forEach(function(o,i){k=o.getWidth();if(k&&k.endsWith("em")){n=parseFloat(k);}else{n=10;}m+=n;o.setDemandPopin(!(i<2));o.setPopinDisplay("Inline");o.setMinScreenWidth(m+"rem");});}};h.prototype._onItemPress=function(E){this.fireRowPress({bindingContext:E.getParameter("listItem").getBindingContext()});};h.prototype._onSelectionChange=function(E){var i=E.getParameter("selectAll");this.fireSelectionChange({bindingContext:E.getParameter("listItem").getBindingContext(),selected:E.getParameter("selected"),selectAll:i});if(i){var r=this._getRowBinding();if(r&&this._oTable){var B=r.getLength();var t=this._oTable.getItems().length;var j=r.isLengthFinal();if(t!=B||!j){s("table.SELECTION_LIMIT_MESSAGE",[t]);}}}};h.prototype._onResponsiveTableColumnPress=function(E){this._onColumnPress(E.getParameter("column"));};h.prototype._onCellClick=function(E){this.fireRowPress({bindingContext:E.getParameter("rowBindingContext")});};h.prototype._onRowActionPress=function(E){var r=E.getParameter("row");this.fireRowPress({bindingContext:r.getBindingContext()});};h.prototype._onRowSelectionChange=function(E){if(!this._bSelectionChangedByAPI){if(E.getParameters().limitReached){s("table.SELECTION_LIMIT_MESSAGE",[E.getSource().getLimit()]);}this.fireSelectionChange({bindingContext:E.getParameter("rowContext"),selected:E.getSource().isIndexSelected(E.getParameter("rowIndex")),selectAll:E.getParameter("selectAll")});}};h.prototype._onGridTableColumnPress=function(E){E.preventDefault();this._onColumnPress(E.getSource());};h.prototype.getSelectedContexts=function(){if(this._oTable){if(this._bMobileTable){return this._oTable.getSelectedContexts();}var p=this._oTable.getPlugins();var i=(p[0]||this._oTable).getSelectedIndices();return i.map(function(j){return this._oTable.getContextByIndex(j);},this);}return[];};h.prototype.clearSelection=function(){if(this._oTable){if(this._bMobileTable){this._oTable.removeSelections(true);}else{this._bSelectionChangedByAPI=true;var p=this._oTable.getPlugins();(p[0]||this._oTable).clearSelection();this._bSelectionChangedByAPI=false;}}};h.prototype.bindRows=function(B){if(this.oTableDelegate){this.oTableDelegate.updateBindingInfo(this.getMetadataInfo(),B);}this._oBindingInfo=B;if(this._oTable&&B.path){if(this._bMobileTable&&this._oTemplate){B.template=this._oTemplate;}else{delete B.template;}this._oBindingInfo.sorter=this._getSorters();if(!B.parameters){B.parameters={};}if(this.getShowRowCount()){h._addBindingListener(B,"dataReceived",this._onDataReceived.bind(this));h._addBindingListener(B,"change",this._updateHeaderText.bind(this));}this._updateColumnsBeforeBinding(B);this._oTable.bindRows(B);}return this;};h.prototype._onDataReceived=function(E){if(E&&E.getParameter&&E.getParameter("__simulateAsyncAnalyticalBinding")){return;}this._updateHeaderText();};h.prototype._updateHeaderText=function(){var H,r;if(this._oTitle&&this.getHeader()){H=this.getHeader();if(this.getShowRowCount()){r=this._getRowCount();if(r){H+=" ("+r+")";}}this._oTitle.setText(H);}};h.prototype._updateColumnsBeforeBinding=function(B){var i=[].concat(B.sorter||[]);var m=this.getColumns();var M=this._bMobileTable;m.forEach(function(o){var j=sap.ui.getCore().byId(o.getId()+"-innerColumn");if(M){j.setSortIndicator("None");}else{j.setSorted(false);}});i.forEach(function(o){var j=(o.bDescending)?"Descending":"Ascending";m.some(function(k){var n=sap.ui.getCore().byId(k.getId()+"-innerColumn");if(k.getDataProperties().indexOf(o.sPath)>-1){if(M){n.setSortIndicator(j);}else{n.setSorted(true).setSortOrder(j);}return true;}});});};h.prototype._getRowCount=function(){var r=this._getRowBinding(),i,v="";if(r){i=r.getLength();if(!this._oNumberFormatInstance){this._oNumberFormatInstance=N.getFloatInstance();}if(r.isLengthFinal()){v=this._oNumberFormatInstance.format(i);}}return v;};h.prototype._getRowBinding=function(){if(this._oTable){return this._oTable.getBinding(this._sAggregation);}};h._addBindingListener=function(B,E,H){if(!B.events){B.events={};}if(!B.events[E]){B.events[E]=H;}else{var o=B.events[E];B.events[E]=function(){H.apply(this,arguments);o.apply(this,arguments);};}};h.prototype.rebindTable=function(){this._oBindingInfo=this.getRowsBindingInfo()||{};if(this._iPendingColumnTemplate>0){this._bRebindPending=true;return;}this._bRebindPending=false;this.bindRows(this._oBindingInfo);};h.prototype._showSettings=function(E){this._showPanel("Columns",E.getSource());};h.prototype._showSort=function(E){this._showPanel("Sort",E.getSource());};h.prototype._showPanel=function(p,o){if(!this._settingsTriggered){this._settingsTriggered=true;b.showPanel(this,p,o).then(this._afterSettingsDone.bind(this));}};h.prototype._afterSettingsDone=function(){delete this._settingsTriggered;};h.prototype._getSorters=function(){if(!this.oTableDelegate){return[];}var i=this.oTableDelegate.getCurrentState(this).sorters;return i.map(function(o){return new S(o.name,o.sortOrder==="Descending");});};h.prototype.exit=function(){if(this._oTemplate){this._oTemplate.destroy();}this._oTemplate=null;this._oTable=null;this._oToolbar=null;this._oTitle=null;this._oNumberFormatInstance=null;this._oTableReady=null;this.oTableDelegateLoaded=null;this._fReject=null;this._fResolve=null;};return h;},true);