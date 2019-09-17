/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/XMLComposite','sap/ui/model/Filter','sap/ui/model/FilterOperator','sap/ui/base/ManagedObjectObserver','sap/base/Log','sap/ui/Device','sap/ui/model/json/JSONModel','sap/m/MessageBox'],function(X,F,a,M,L,D,J,b){"use strict";var S=X.extend("sap.ui.mdc.base.info.SelectionDialog",{metadata:{library:"sap.ui.mdc",properties:{showItemAsLink:{type:"boolean",defaultValue:true,invalidate:true},showReset:{type:"boolean",defaultValue:false,invalidate:true},showResetEnabled:{type:"boolean",defaultValue:false,invalidate:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.mdc.base.info.SelectionDialogItem",multiple:true,singularName:"item"}},events:{visibilityChanged:{key:{type:"string"},visible:{type:"boolean"}},ok:{},cancel:{},reset:{}}}});S.prototype.init=function(){var d=new J(D);d.setDefaultBindingMode("OneWay");this.setModel(d,"device");};S.prototype.open=function(){this._updateCountOfItems();this._getCompositeAggregation().open();};S.prototype.close=function(){this._getCompositeAggregation().close();};S.prototype.onSelectionChange=function(e){e.getParameter("listItems").forEach(function(t){this._selectTableItem(t);},this);};S.prototype.onSearchFieldLiveChange=function(e){var f=[];var s=e.getSource();var c=s?s.getValue():"";if(c){f.push(new F([new F("text",a.Contains,c),new F("tooltip",a.Contains,c),new F("description",a.Contains,c)],false));}this._getTable().getBinding("items").filter(f);};S.prototype.onPressOk=function(){this.fireOk();};S.prototype.onPressCancel=function(){this.fireCancel();};S.prototype.onPressReset=function(){this.fireReset();};S.prototype.onAfterClose=function(){this.fireCancel();};S.prototype.onPressLink=function(e){var h=e.getParameter("href");if(e.getParameter("target")!=="_blank"){e.preventDefault();b.show(sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("info.SELECTION_DIALOG_LINK_VALIDATION_QUESTION"),{icon:b.Icon.WARNING,title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("info.SELECTION_DIALOG_LINK_VALIDATION_TITLE"),actions:[b.Action.YES,b.Action.NO],onClose:function(A){if(A===b.Action.YES){window.location.href=h;}},styleClass:this.$().closest(".sapUiSizeCompact").length?"sapUiSizeCompact":""});}};S.prototype._selectTableItem=function(t){this._updateCountOfItems();this.fireVisibilityChanged({key:this._getKeyByTableItem(t),visible:t.getSelected()});};S.prototype._getTable=function(){return sap.ui.getCore().byId(this.getId()+"--idList")||null;};S.prototype._getSelectedTableItems=function(){return this._getTable().getItems().filter(function(t){return!!t.getSelected();});};S.prototype._getKeyByTableItem=function(t){var i=this._getTable().indexOfItem(t);return i<0?null:this._getTable().getBinding("items").getContexts()[i].getObject().getKey();};S.prototype._updateCountOfItems=function(){this._getManagedObjectModel().setProperty("/@custom/countOfSelectedItems",this._getSelectedTableItems().length);};return S;},true);
