/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/json/JSONModel","./ODataMetaModelUtil"],function(J,u){"use strict";function f(o){if(!o){return undefined;}var s=JSON.stringify(o);s=s.replace(new RegExp("\{","g"),"\\{");s=s.replace(new RegExp("\}","g"),"\\}");return s;}function g(a){var A=a.getPath(),i=A.lastIndexOf("@com.sap.vocabularies.UI.v1.Chart"),p=A.substr(0,i);return p;}var C={};var c={"com.sap.vocabularies.UI.v1.ChartType/Column":"column","com.sap.vocabularies.UI.v1.ChartType/ColumnStacked":"stacked_column","com.sap.vocabularies.UI.v1.ChartType/ColumnDual":"dual_column","com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual":"dual_stacked_column","com.sap.vocabularies.UI.v1.ChartType/ColumnStacked100":"100_stacked_column","com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual100":"100_dual_stacked_column","com.sap.vocabularies.UI.v1.ChartType/Bar":"bar","com.sap.vocabularies.UI.v1.ChartType/BarStacked":"stacked_bar","com.sap.vocabularies.UI.v1.ChartType/BarDual":"dual_bar","com.sap.vocabularies.UI.v1.ChartType/BarStackedDual":"dual_stacked_bar","com.sap.vocabularies.UI.v1.ChartType/BarStacked100":"100_stacked_bar","com.sap.vocabularies.UI.v1.ChartType/BarStackedDual100":"100_dual_stacked_bar","com.sap.vocabularies.UI.v1.ChartType/Area":"area","com.sap.vocabularies.UI.v1.ChartType/AreaStacked":"stacked_column","com.sap.vocabularies.UI.v1.ChartType/AreaStacked100":"100_stacked_column","com.sap.vocabularies.UI.v1.ChartType/HorizontalArea":"bar","com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked":"stacked_bar","com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked100":"100_stacked_bar","com.sap.vocabularies.UI.v1.ChartType/Line":"line","com.sap.vocabularies.UI.v1.ChartType/LineDual":"dual_line","com.sap.vocabularies.UI.v1.ChartType/Combination":"combination","com.sap.vocabularies.UI.v1.ChartType/CombinationStacked":"stacked_combination","com.sap.vocabularies.UI.v1.ChartType/CombinationDual":"dual_combination","com.sap.vocabularies.UI.v1.ChartType/CombinationStackedDual":"dual_stacked_combination","com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStacked":"horizontal_stacked_combination","com.sap.vocabularies.UI.v1.ChartType/Pie":"pie","com.sap.vocabularies.UI.v1.ChartType/Donut":"donut","com.sap.vocabularies.UI.v1.ChartType/Scatter":"scatter","com.sap.vocabularies.UI.v1.ChartType/Bubble":"bubble","com.sap.vocabularies.UI.v1.ChartType/Radar":"line","com.sap.vocabularies.UI.v1.ChartType/HeatMap":"heatmap","com.sap.vocabularies.UI.v1.ChartType/TreeMap":"treemap","com.sap.vocabularies.UI.v1.ChartType/Waterfall":"waterfall","com.sap.vocabularies.UI.v1.ChartType/Bullet":"bullet","com.sap.vocabularies.UI.v1.ChartType/VerticalBullet":"vertical_bullet","com.sap.vocabularies.UI.v1.ChartType/HorizontalWaterfall":"horizontal_waterfall","com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationDual":"dual_horizontal_combination","com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStackedDual":"dual_horizontal_stacked_combination"};var m={"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1":"axis1","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2":"axis2","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3":"axis3","com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis4":"axis4"};var d={"com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category":"category","com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series":"series","com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category2":"category2"};C.formatChartType=function(o){return c[o.$EnumMember];};C.formatDimensions=function(a){var A=a.getObject(""),M=a.getModel(),e=g(a),D=[],i,j;A.DimensionAttributes=A.DimensionAttributes||[];for(i=0;i<A.Dimensions.length;i++){var k=A.Dimensions[i].$PropertyPath;var o={key:k,label:M.getObject(e+k+"@com.sap.vocabularies.Common.v1.Label"),role:"category"};for(j=0;j<A.DimensionAttributes.length;j++){var b=A.DimensionAttributes[j];if(o.key===b.Dimension.$PropertyPath){o.role=d[b.Role.$EnumMember]||o.role;break;}}o.criticality=u.fetchCriticality(M,M.createBindingContext(e+k)).then(f);D.push(o);}var h=new J(D);h.$$valueAsPromise=true;return h.createBindingContext("/");};C.formatMeasures=function(a){var A=a.getObject(""),M=a.getModel(),e=g(a),b=[],i,j,D,o;var h=M.getObject(e+"@com.sap.vocabularies.Analytics.v1.AggregatedProperties")||[],k={};for(i=0;i<h.length;i++){k[h[i].Value]=h[i];}A.MeasureAttributes=A.MeasureAttributes||[];for(i=0;i<A.Measures.length;i++){var K=A.Measures[i].$PropertyPath;var l={key:K,label:M.getObject(e+K+"@com.sap.vocabularies.Common.v1.Label"),role:"axis1"};var n=k[K];if(n){l.propertyPath=n.AggregatableProperty.$PropertyPath;l.aggregationMethod=n.AggregationMethod;l.label=n["@com.sap.vocabularies.Common.v1.Label"]||l.label;}for(j=0;j<A.MeasureAttributes.length;j++){var p=A.MeasureAttributes[j];if(l.key===p.Measure.$PropertyPath){l.role=m[p.Role.$EnumMember]||l.role;D=p.DataPoint?p.DataPoint.$AnnotationPath:null;if(D!=null){o=M.getObject(e+D);if(o.Value.$Path==l.key){l.dataPoint=f(u.createDataPointProperty(o));}}continue;}}b.push(l);}var q=new J(b);return q.createBindingContext("/");};return C;},false);
