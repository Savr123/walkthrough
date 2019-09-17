//@ui5-bundle sap/ui/integration/designtime/library-preload.designtime.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/integration/designtime/controls/BaseEditor',["sap/ui/core/Control","sap/base/util/ObjectPath","./Config","sap/base/util/merge","sap/base/util/deepClone","sap/ui/model/json/JSONModel","sap/ui/model/BindingMode"],function(C,O,a,m,d,J,B){"use strict";
var b=C.extend("sap.ui.integration.designtime.controls.BaseEditor",{
metadata:{properties:{"config":{type:"object"},"json":{type:"object",multiple:false}},aggregations:{"propertyEditors":{type:"sap.ui.core.Control"}},associations:{},events:{jsonChanged:{type:"object"}}},
exit:function(){this._cleanup();if(this._oMergedConfig){this._oMergedConfig.destroy();}},
renderer:function(r,e){r.write("<div");r.writeElementData(e);r.addClass("sapUiIntegrationEditor");r.writeClasses();r.writeStyles();r.write(">");e.getPropertyEditors().forEach(function(p){r.renderControl(p);});r.write("</div>");},
setConfig:function(c){var r=this.setProperty("config",c,false);this._initialize();return r;},
setJson:function(j){if(typeof j==="string"){j=JSON.parse(j);}var r=this.setProperty("json",j,false);this._initialize();return r;}
});
b.prototype._cleanup=function(c){if(this._oContextModel){this._oContextModel.destroy();}if(this._oPropertiesModel){this._oPropertiesModel.destroy();}this.destroyPropertyEditors();};
b.prototype._initialize=function(){this._cleanup();var M=this._mergeConfig();this._createModels(M);this._createEditors(M);};
b.prototype._mergeConfig=function(){if(this._oMergedConfig){this._oMergedConfig.setData(this.getConfig());}else{this._oMergedConfig=new a({data:this.getConfig()});}return d(this._oMergedConfig.getData());};
b.prototype._syncPropertyValue=function(p){var c=this._oContextModel.getData();if(c&&p.path){p.value=O.get(p.path.split("/"),c);}if(typeof p.value==="undefined"){p.value=p.defaultValue;}};
b.prototype._createModels=function(c){var o=this.getJson();if(c.context){o=O.get(c.context.split("/"),o);}this._oContextModel=new J(o);this._oContextModel.setDefaultBindingMode(B.OneWay);c.properties=Object.keys(c.properties).map(function(p){var P=c.properties[p];P.name=p;if(P.path){this._syncPropertyValue(P);}return P;}.bind(this));this._oPropertiesModel=new J(c.properties);this._oPropertiesModel.setDefaultBindingMode(B.OneWay);};
b.prototype._createEditors=function(c){var t=Object.keys(c.propertyEditors);var M=t.map(function(T){return c.propertyEditors[T];});var e={};sap.ui.require(M,function(){Array.from(arguments).forEach(function(E,i){e[t[i]]=E;});for(var i=0;i<c.properties.length;i++){var p=this._oPropertiesModel.getContext("/"+i);var E=e[p.getObject().type];if(E){this._createPropertyEditor(E,p);}}}.bind(this));};
b.prototype._createPropertyEditor=function(E,p){var P=new E({visible:typeof p.getObject().visible!==undefined?p.getObject().visible:true});P.setModel(this._oPropertiesModel);P.setBindingContext(p);P.setModel(this._oContextModel,"context");P.attachPropertyChanged(this._onPropertyChanged.bind(this));this.addPropertyEditor(P);};
b.prototype._onPropertyChanged=function(e){this._oContextModel.setProperty("/"+e.getParameter("path"),e.getParameter("value"));var p;var i=this._oPropertiesModel.getData().findIndex(function(f){if(f.path===e.getParameter("path")){p=f;return true;}});if(i!==-1){this._syncPropertyValue(p);this._oPropertiesModel.checkUpdate();}this.fireJsonChanged({json:d(this.getJson())});};
return b;});
sap.ui.predefine('sap/ui/integration/designtime/controls/Config',['sap/ui/base/ManagedObject','./DefaultConfig','sap/base/util/merge'],function(M,d,m){"use strict";
var C=M.extend("sap.ui.integration.designtime.controls.Config",{metadata:{properties:{data:{type:"any",defaultValue:d}}}});
C.prototype.getDefaultData=function(){return d;};
C.prototype.setData=function(D){this.setProperty("data",m({},this.getDefaultData(),D||{}));return this;};
return C;},true);
sap.ui.predefine('sap/ui/integration/designtime/controls/PropertyEditor',['sap/ui/core/Control','sap/m/Label'],function(C,L){"use strict";
var P=C.extend("sap.ui.integration.designtime.controls.PropertyEditor",{
metadata:{properties:{"renderLabel":{type:"boolean",defaultValue:true}},aggregations:{"_label":{type:"sap.m.Label",visibility:"hidden",multiple:false},"content":{type:"sap.ui.core.Control"}},events:{propertyChanged:{type:"object"}}},
getPropertyInfo:function(){return this.getBindingContext().getObject();},
getLabel:function(){var l=this.getAggregation("_label");if(!l){l=new L({text:"{label}"});this.setAggregation("_label",l);}return l;},
renderer:function(r,p){r.write("<div");r.writeElementData(p);r.writeClasses();r.writeStyles();r.write(">");if(p.getRenderLabel()){r.write("<div>");r.renderControl(p.getLabel());r.write("</div><div>");}p.getContent().forEach(function(c){r.renderControl(c);});if(p.getRenderLabel()){r.write("</div>");}r.write("</div>");},
firePropertyChanged:function(v){this.fireEvent("propertyChanged",{path:this.getPropertyInfo().path,value:v});}
});
return P;});
sap.ui.predefine('sap/ui/integration/designtime/controls/propertyEditors/StringEditor',['sap/ui/integration/designtime/controls/PropertyEditor'],function(P){"use strict";
var S=P.extend("sap.ui.integration.designtime.controls.propertyEditors.StringEditor",{
init:function(){this._oInput=new sap.m.Input({value:"{value}"});this._oInput.attachLiveChange(function(e){this.firePropertyChanged(e.getParameter("value"));}.bind(this));this.addContent(this._oInput);},
renderer:P.getMetadata().getRenderer().render
});
return S;});
/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 *
 * @constructor
 * @private
 * @experimental
 */
sap.ui.predefine('sap/ui/integration/designtime/controls/DefaultConfig',[],function(){"use strict";var D={"context":"sap.card","properties":{"headerType":{"label":"{i18n>headerType}","path":"header/type","type":"string","enum":["Default","Numeric"],"defaultValue":"Default"},"title":{"label":"{i18n>title}","type":"string","path":"header/title"},"subTitle":{"label":"{i18n>subtitle}","type":"string","path":"header/subTitle"},"icon":{"label":"{i18n>icon}","type":"string","path":"header/icon/src","visible":"{= ${context>/header/type} !== 'Numeric' }"},"statusText":{"label":"{i18n>status}","type":"string","path":"header/status/text"},"Number":{"label":"{i18n>kpi}","type":"string","path":"data/json/kpiInfos/kpi/number","visible":"{= ${context>/header/type} === 'Numeric' }"},"listItemTitle":{"label":"{i18n>title}","type":"string","path":"content/item/title"},"listItemDescription":{"label":"{i18n>description}","type":"string","path":"content/item/description"},"listItemHighlight":{"label":"{i18n>highlight}","type":"string","path":"content/item/highlight"}},"propertyEditors":{"string":"sap/ui/integration/designtime/controls/propertyEditors/StringEditor"}};return D;},true);
//# sourceMappingURL=library-preload.designtime.js.map