/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
sap.ui.define(["./library","./MakitLib","./Row","sap/ui/core/Element","sap/base/Log","sap/base/assert"],function(m,M,R,E,L,a){"use strict";var C=m.ChartType;var b=E.extend("sap.makit.Layer",{metadata:{deprecated:true,library:"sap.makit",properties:{type:{type:"sap.makit.ChartType",group:"Appearance",defaultValue:C.Column},lineThickness:{type:"float",group:"Appearance",defaultValue:1},primaryColorPalette:{type:"any",group:"Misc",defaultValue:null},drawOnSecondaryAxis:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{rows:{type:"sap.makit.Row",multiple:true,singularName:"row",bindable:"bindable"},columns:{type:"sap.makit.Column",multiple:true,singularName:"column",bindable:"bindable"},series:{type:"sap.makit.Series",multiple:false},values:{type:"sap.makit.Value",multiple:true,singularName:"value"}}}});b.prototype.init=function(){this._datarows=[];this._createRowsCalled=false;this._lineType=null;};b.prototype.addValue=function(v){E.prototype.addAggregation.call(this,"values",v,false);v.attachEvent("_change",{type:"values"},this._onDataRegionPropChanged,this);return this;};b.prototype.addColumn=function(v){E.prototype.addAggregation.call(this,"columns",v,false);v.attachEvent("_change",{type:"columns"},this._onColumnPropChanged,this);return this;};sap.makit.Chart.prototype.insertValue=function(v,i){E.prototype.insertAggregation.call(this,"values",v,i,false);v.attachEvent("_change",{type:"values"},this._onDataRegionPropChanged,this);return this;};sap.makit.Chart.prototype.removeValue=function(v){var r=E.prototype.removeAggregation.call(this,"values",v,false);if(r!=null){r.detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};sap.makit.Chart.prototype.removeAllValues=function(){var r=E.prototype.removeAllAggregation.call(this,"values",false);var l=r.length;var i;for(i=0;i<l;i++){r[i].detachEvent("_change",this._onDataRegionPropChanged,this);}return r;};b.prototype.setSeries=function(s){E.prototype.setAggregation.call(this,"series",s,false);s.attachEvent("_change",{type:"series"},this._onDataRegionPropChanged,this);return this;};b.prototype.bindAggregation=function(n,B){if(n==="rows"){if(typeof B=="string"){B={path:arguments[1],template:arguments[2],sorter:arguments[3],filters:arguments[4]};}B.template=undefined;B.factory=function(){};return E.prototype.bindAggregation.call(this,n,B);}return E.prototype.bindAggregation.apply(this,arguments);};b.prototype.addRow=function(r){L.error("The control manages the rows aggregation. The method \"addRow\" cannot be used programmatically!");};b.prototype.insertRow=function(r,i){L.error("The control manages the rows aggregation. The method \"insertRow\" cannot be used programmatically!");};b.prototype.removeRow=function(r){L.error("The control manages the rows aggregation. The method \"removeRow\" cannot be used programmatically!");};b.prototype.removeAllRows=function(){L.error("The control manages the rows aggregation. The method \"removeAllRows\" cannot be used programmatically!");};b.prototype.destroyRows=function(r){L.error("The control manages the rows aggregation. The method \"destroyRows\" cannot be used programmatically!");};b.prototype.updateRows=function(){this.fireEvent("_startUpdateRows",this);this._createRows();this._createRowsCalled=true;this.fireEvent("rowsUpdated");this.fireEvent("_endUpdateRows",this);};sap.makit.CombinationChart.prototype.setType=function(t){if(t==C.Pie||t==C.Donut||t==C.Bubble){throw new Error("Combination Chart does not support "+t+" chart type");return;}else{E.prototype.setProperty.call(this,"type",t,false);}return this;};b.prototype._onDataRegionPropChanged=function(e,d){a(d,"oData is expected to be set in _onDataRegionPropChanged");var p=e.mParameters;p["type"]=d["type"];if(d["type"]=="values"){var v=e.oSource;var i=this.indexOfValue(v);p["index"]=i;}this.fireEvent("dataRegionChanged",p);};b.prototype._onColumnPropChanged=function(e,d){var p=e.mParameters;if(p["name"]=="name"&&this._createRowsCalled){L.info("Column name property is changed due to name has been binded");this._createRows();}};b.prototype._createRows=function(){var t=new R(this.getId()+"-dummyrows");var c=this.getColumns();for(var i=0,l=c.length;i<l;i++){var o=c[i];if(o){var d=o.clone("col"+i);d.detachEvent("_change",this._onColumnPropChanged,this);for(var p in o.mProperties){if(o.mProperties.hasOwnProperty(p)){d.setProperty(p,o.getProperty(p),false);}}d.data("sap-ui-colindex",i);t.addAggregation("cells",d);d.unbindAggregation("name",true);}}this.destroyAggregation("rows");var e=undefined;var B=this.getBinding("rows");if(B){e=B.getContexts();}var f=B.getLength();this._datarows=[];var g=this.getBindingInfo("rows");var s=undefined;if(g&&g.model){s=g.model;}for(var i=0;i<f;i++){if(e&&e[i]){var d=t.clone("row"+i);d.setBindingContext(e[i],s);this.addAggregation("rows",d);this._datarows.push(d._datarow);}}t.destroy();};b.prototype.setLineType=function(l){this._lineType=l;};b.prototype.getLineType=function(){return this._lineType;};b.prototype.getSyntax=function(p,s){var c=this.getSeries();var d='';if(c){d='<Series Column ="'+c.getColumn()+'"';if(c.getFormat()){d+=' format ="'+c.getFormat()+'"';}if(c.getDisplayName()){d+=' displayname ="'+c.getDisplayName()+'"';}d+='/>';}var e=this.getDrawOnSecondaryAxis();var v='<Values>';var f=e?s:p;if(f){v='<Values';if(e){v+=' SecondaryAxis ="'+e+'"';}v+=' showprimaryline ="'+f.getShowPrimaryLine()+'"';v+=' showgrid ="'+f.getShowGrid()+'"';v+=' showlabel ="'+f.getShowLabel()+'"';v+=' thickness ="'+f.getThickness()+'"';v+=' color ="'+f.getColor()+'"';if(f.getMin()!==""){v+=' min ="'+f.getMin()+'"';}if(f.getMax()!==""){v+=' max ="'+f.getMax()+'"';}v+='>';}var g=this.getValues();var l=g.length;if(l==0){throw new Error("Chart '"+this.getId()+"' needs at least one Value data region");}var h;for(var i=0;i<l;i++){h=g[i];v+='<Value Expression ="'+h.getExpression()+'"';if(h.getFormat()){v+=' format ="'+h.getFormat()+'"';}if(h.getDisplayName()){v+=' displayname ="'+h.getDisplayName()+'"';}if(h.getLocale()!==""){v+=' Locale ="'+h.getLocale()+'"';}v+='/>';}v+='</Values>';var t=this.getType().toLowerCase();var j=this.getLineType();var k=null;if(t==="donut"||t==="pie"){k=t;t="pie";}else if(t==="line"&&j){t=j;}var n='<Layer Name ="'+this.getId()+'" ChartType ="'+t+'"';if(k!==null){n+=' PieStyle ="'+k+'"';}n+=' >';if(c){n+=d;}n+=v;n+='</Layer>';return n;};b.prototype.getDataTable=function(){if(this._datarows&&this._datarows.length>0){var d=this._datarows;var c=new window.$MA.DataTable();var e=this.getColumns();var f=e.length;if(f==0){e=this.getRows()[0].getCells();f=e.length;}for(var i=0;i<f;i++){c.addColumn(e[i].getName(),e[i].getType());}c.addRows(d);return c;}return null;};b.prototype.getSelectedSeries=function(){var p=this.getParent();if(p){return p._getSelectedSeries(this);}};return b;});
