/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/designtime/Column.designtime","sap/suite/ui/generic/template/designtime/Table.designtime","sap/suite/ui/generic/template/designtime/SmartTable.designtime","sap/suite/ui/generic/template/designtime/DynamicPage.designtime","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","sap/suite/ui/generic/template/designtime/library.designtime"],function(C,T,S,D,a){"use strict";var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();return{'default':{controllerExtensionTemplate:"sap/suite/ui/generic/template/designtime/ListReportControllerExtensionTemplate",name:{singular:function(){return r.getText("FE_LIST_REPORT");}},aggregations:{content:{ignore:false,propagateMetadata:function(e){if(e.getMetadata().getElementName){switch(e.getMetadata().getElementName()){case"sap.ui.comp.smarttable.SmartTable":return{name:{singular:function(){return r.getText("FE_SMARTTABLE");}}};default:break;}}}}}},'strict':{name:{singular:function(){return r.getText("FE_LIST_REPORT");}},properties:function(e){return a.ignoreAllProperties(e);},aggregations:{content:{ignore:false,propagateRelevantContainer:true,links:{guidelines:[{href:"/list-report-floorplan-sap-fiori-element/",text:function(){return r.getText("FE_LRP_GUIDE");}}]},propagateMetadata:function(e){if(e.getMetadata().getElementName){switch(e.getMetadata().getElementName()){case"sap.f.DynamicPage":return D.getDesigntime(e);case"sap.m.Table":return T.getDesigntime(e);case"sap.m.Button":return{name:{singular:function(){return r.getText("FE_BUTTON");}},properties:a.getButtonProperties(e),actions:{rename:null}};case"sap.m.OverflowToolbarButton":return{aggregations:{settings:{ignore:true}},name:{singular:function(){return r.getText("FE_BUTTON");}},links:{developer:[{href:"/topic/8ba009d7b8434dc1a4948c9211e30c40.html",text:function(){return r.getText("FE_SDK_LRP_ACTION");}}],guidelines:[{href:"/table-bar/",text:function(){return r.getText("FE_TOOLBAR_GUIDE");}}]},properties:a.getButtonProperties(e),annotations:{importance:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Importance",target:["Record"],appliesTo:["OverflowToolbar/Button/OverflowToolbarLayoutData"]}}};case"sap.ui.comp.smartfilterbar.SmartFilterBar":case"sap.ui.layout.VerticalLayout":case"sap.ui.layout.AlignedFlowLayout":case"sap.m.OverflowToolbar":return;case"sap.m.MultiComboBox":return{aggregations:{items:{ignore:true}}};case"sap.f.DynamicPageHeader":return{name:{singular:function(){return r.getText("FE_DYNAMIC_PAGE_HEADER");}},properties:function(e){return a.ignoreAllProperties(e);},aggregations:{items:{name:{singular:"Item",plural:"Items"}}},actions:null};case"sap.f.DynamicPageTitle":return{name:{singular:function(){return r.getText("FE_DYNAMIC_PAGE_TITLE");}},properties:function(e){return a.ignoreAllProperties(e);},aggregations:{actions:{ignore:true},snappedContent:{ignore:true},content:{ignore:true},heading:{ignore:true}},actions:null};case"sap.ui.comp.smarttable.SmartTable":return S.getDesigntime(e);case"sap.m.Column":return C.getDesigntime(e);default:return{actions:null};}}else{return{actions:null};}}}},actions:{},annotations:{}}};},true);