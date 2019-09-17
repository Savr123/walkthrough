sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","sap/suite/ui/generic/template/designtime/virtualProperties/SectionType","./library.designtime"],function(U,A,D,S){"use strict";var F="com.sap.vocabularies.UI.v1.Facets";var C="com.sap.vocabularies.UI.v1.CollectionFacet";var R="com.sap.vocabularies.UI.v1.ReferenceFacet";var a="Contact";var b="Address";var c={};c.getSectionProperties=function(s){var p=D.ignoreAllProperties(s),P={sectionType:{name:"Section Type",virtual:true,ignore:false,type:"EnumType",possibleValues:S.getSectionTypeValues(),get:function(s){return S.getSectionType(s);},set:function(s,v,o){return S.setSectionType(s,v,o);}}};return jQuery.extend(true,{},p,P);};c.getSmartTableProperties=function(s){var p=D.ignoreAllProperties(s);var P={useExportToExcel:{ignore:false}};return jQuery.extend(true,{},p,P);};c.getSectionAnnotationInfo=function(s){var e=U.getODataEntityType(U.getComponent(s));var f,d=e[F];var g=s.getId();g=g.split("--")[1];if(g){g=g.substring(0,g.lastIndexOf("::"));}var i=D.getFacetIndexFromID(g,d);if(i===undefined){return;}f=d[i];var o={};o.RecordType=f.RecordType;o.AnnotationPath=f.Target&&f.Target.AnnotationPath;return o;};c.getDesigntime=function(e){var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();var s={name:{singular:function(){return r.getText("FE_SECTION");},plural:function(){return r.getText("FE_SECTIONS");}},actions:{rename:null},properties:D.ignoreAllProperties(e)};var t=U.getTemplatingInfo(e);if(!t){jQuery.extend(true,s,{actions:"not-adaptable"});return s;}var E={getCommonInstanceData:function(e){var t=U.getTemplatingInfo(e);if(t&&t.path){var T=t.target+'/'+t.path.substr(t.path.indexOf(F));return{target:T,annotation:t.annotation,qualifier:null};}},aggregations:{subSections:{childNames:{plural:function(){return r.getText("FE_SUB_SECTIONS");},singular:function(){return r.getText("FE_SUB_SECTION");}},actions:{move:"moveSubSection",createContainer:{changeType:"addSubSection",isEnabled:true,changeOnRelevantContainer:true,getCreatedContainerId:function(n){return n;}}}}},propagateRelevantContainer:true,propagateMetadata:function(e){switch(e.getMetadata().getElementName()){case"sap.m.ColumnListItem":return{properties:D.ignoreAllProperties(e),aggregations:{cells:{ignore:true}}};case"sap.ui.comp.smarttable.SmartTable":return{name:{singular:function(){return r.getText("FE_SECTION");}},properties:c.getSmartTableProperties(e),aggregations:{semanticKeyAdditionalControl:{ignore:true}}};}},properties:c.getSectionProperties(e),links:{developer:[{href:"/api/sap.uxap.ObjectPageSection",text:function(){return r.getText("FE_SECTIONS");}},{href:"/topic/facfea09018d4376acaceddb7e3f03b6",text:function(){return r.getText("FE_SDK_GUIDE_SECTIONS");}}]},actions:{remove:{changeType:"removeSection",changeOnRelevantContainer:true}},annotations:{referenceFacet:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",defaultValue:null,whiteList:{properties:["Target","Label","ID"],mandatory:["Target"]},ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o&&o.RecordType===R){var d=S.getSectionType(e);return d===b||d===a;}else{return true;}}.bind(this),appliesTo:["ObjectPage/Sections"],group:["Appearance"],links:{developer:[{href:"/topic/facfea09018d4376acaceddb7e3f03b6.html",text:function(){return r.getText("FE_SDK_GUIDE_SECTIONS");}}]}},referenceFacetContact:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",defaultValue:null,whiteList:{properties:["Label","ID","Target"]},ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o&&o.RecordType===R){var d=S.getSectionType(e);return d!==a;}else{return true;}}.bind(this),appliesTo:["ObjectPage/Sections"],group:["Appearance"],links:{developer:[{href:"/topic/a6a8c0c4849b483eb10e87f6fdf9383c.html",text:function(){return r.getText("FE_SDK_GUIDE_SECTIONS_CONTACT");}}]},refersTo:[{annotation:"contact",nullable:false,referredBy:"Target"}]},referenceFacetAddress:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",defaultValue:null,whiteList:{properties:["Label","ID","Target"]},ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o&&o.RecordType===R){var d=S.getSectionType(e);return d!==b;}else{return true;}}.bind(this),appliesTo:["ObjectPage/Sections"],group:["Appearance"],links:{developer:[{href:"/topic/9eb3aaecc09b431ca27f97eb1ee5d861.html",text:function(){return r.getText("FE_SDK_GUIDE_SECTIONS_ADDRESS");}}]},refersTo:[{annotation:"address",nullable:false,referredBy:"Target"}]},contact:{namespace:"com.sap.vocabularies.Communication.v1",annotation:"Contact",ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o&&o.RecordType===R){var d=S.getSectionType(e);return d!==a;}else{return true;}}.bind(this),target:["EntityType"],whiteList:{properties:["fn","n","tel","email","photo","title","org","role"],expressionTypes:{fn:["Path"],photo:["Path"],title:["Path"],org:["Path"],role:["Path"]}},appliesTo:["ObjectPage/Sections"]},address:{namespace:"com.sap.vocabularies.Communication.v1",annotation:"Address",ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o&&o.RecordType===R){var d=S.getSectionType(e);return d!==b;}else{return true;}}.bind(this),target:["EntityType"],appliesTo:["ObjectPage/Sections"]},collectionFacet:{namespace:"com.sap.vocabularies.UI.v1",annotation:"CollectionFacet",defaultValue:null,ignore:function(){var o=this.getSectionAnnotationInfo(e);if(o){return o.RecordType!==C;}}.bind(this),whiteList:{properties:["Label","ID"]},appliesTo:["ObjectPage/Sections"],group:["Appearance"],links:{developer:[{href:"/topic/facfea09018d4376acaceddb7e3f03b6.html",text:"Defining and Adapting Sections"}]}}}};return jQuery.extend(true,s,E);};return c;});
