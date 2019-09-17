/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/chart/library',['sap/viz/ui5/format/ChartFormatter','sap/ui/core/library','sap/viz/library','sap/chart/utils/RoleFitter','sap/chart/utils/ChartTypeAdapterUtils','sap/chart/ChartType','sap/chart/data/Dimension','sap/chart/data/Measure','sap/chart/AutoScaleMode','sap/chart/ScaleBehavior','sap/chart/data/MeasureSemantics','sap/chart/coloring/CriticalityType','sap/chart/ColoringType','sap/chart/data/DimensionRoleType','sap/chart/data/MeasureRoleType'],function(C,c,v,R,a,b,D,M,A,S,d){"use strict";sap.ui.getCore().initLibrary({name:"sap.chart",dependencies:["sap.ui.core","sap.viz"],types:["sap.chart.data.MeasureSemantics"],interfaces:[],controls:["sap.chart.Chart"],elements:["sap.chart.data.Dimension","sap.chart.data.TimeDimension","sap.chart.data.HierarchyDimension","sap.chart.data.Measure"],noLibraryCSS:true,version:"1.69.1"});sap.chart.SelectionMode={Multi:"MULTIPLE",Single:"SINGLE",None:"NONE"};sap.chart.SelectionBehavior={DataPoint:"DATAPOINT",Category:"CATEGORY",Series:"SERIES"};sap.chart.MessageId={NoData:"NO_DATA",MultipleUnits:"MULTIPLE_UNITS"};sap.chart.api={};sap.chart.api.getChartTypes=function(){var B=sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");return Object.keys(sap.chart.ChartType).reduce(function(m,s){var f=sap.chart.ChartType[s];m[f]=B.getText("info/"+f);return m;},{});};sap.chart.data=sap.chart.data||{};sap.chart.coloring=sap.chart.coloring||{};sap.chart.coloring.ImprovementDirectionType={Minimize:"Minimize",Target:"Target",Maximize:"Maximize"};sap.chart.coloring.GradationSingleColorScheme={NoSemantics:"NoSemantics",Positive:"Positive",Negative:"Negative"};sap.chart.coloring.GradationDivergingColorScheme={NoSemantics:"NoSemantics",PositiveToNegative:"PositiveToNegative",NegativeToPositive:"NegativeToPositive",ColdToHot:"ColdToHot",HotToCold:"HotToCold"};sap.chart.coloring.GradationTargetColorScheme={PositiveTarget:"PositiveTarget"};sap.chart.coloring.GradationSaturation={LightToDark:"LightToDark",DarkToLight:"DarkToLight"};sap.chart.api.getChartTypeLayout=function(s,f,m){var g,h;if(!s){throw new Error("Invalid chart type: "+String(s));}if(f){g=f.map(function(k,i){if(k instanceof D){return k;}else if(k&&(k.name)){return{getName:function(){return k.name;},getRole:function(){return k.role||"category";}};}else{throw new Error("Invalid Dimension at ["+i+"]: "+String(k)+". Dimension should be an object of the format{name:'name'} or an instance of sap.chart.data.Dimension.");}});}else{g=[];}if(m){h=m.map(function(k,i){if(k instanceof M){return k;}else if(k&&k.name){return{getName:function(){return k.name;},getRole:function(){return k.role||"axis1";}};}else{throw new Error("Invalid Measure at ["+i+"]: "+String(k)+". Measure should be an object of the format{name:'name'} or an instance of sap.chart.data.Measure.");}});}else{h=[];}var j=a.adaptChartType(s,g);var o=R.compatible(j,g,h);return{dimensions:o.used.Dimension||[],measures:o.used.Measure||[],errors:Object.keys(o.error||{}).reduce(function(E,i){return E.concat({cause:i,detail:o.error[i]});},[])};};var e=C.getInstance();if(!(sap.viz.api.env.Format.numericFormatter()instanceof C)){sap.viz.api.env.Format.numericFormatter(e);}return sap.chart;});sap.ui.require.preload({"sap/chart/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.chart","type":"library","embeds":[],"applicationVersion":{"version":"1.69.1"},"title":"Smart viz control based on Vizframe","description":"Smart viz control based on Vizframe","ach":"BI-CVM","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.69","libs":{"sap.ui.core":{"minVersion":"1.69.1"},"sap.viz":{"minVersion":"1.69.1"}}},"library":{"i18n":false,"css":false,"content":{"controls":["sap.chart.Chart"],"elements":["sap.chart.data.Dimension","sap.chart.data.TimeDimension","sap.chart.data.HierarchyDimension","sap.chart.data.Measure"],"types":["sap.chart.data.MeasureSemantics"],"interfaces":[]}}}}'},"sap/chart/library-h2-preload");sap.ui.loader.config({depCacheUI5:{"sap/chart/Chart.js":["sap/base/Log.js","sap/chart/AutoScaleMode.js","sap/chart/ChartLog.js","sap/chart/ScaleBehavior.js","sap/chart/SeriesColorTracker.js","sap/chart/TimeUnitType.js","sap/chart/coloring/Colorings.js","sap/chart/data/Dimension.js","sap/chart/data/HierarchyDimension.js","sap/chart/data/Measure.js","sap/chart/data/TimeDimension.js","sap/chart/library.js","sap/chart/pagination/PagingController.js","sap/chart/utils/ChartTypeAdapterUtils.js","sap/chart/utils/ChartUtils.js","sap/chart/utils/DataSourceUtils.js","sap/chart/utils/DateFormatUtil.js","sap/chart/utils/MeasureSemanticsUtils.js","sap/chart/utils/RoleFitter.js","sap/chart/utils/SelectionAPIUtils.js","sap/chart/utils/ValueAxisScaleUtils.js","sap/ui/Device.js","sap/ui/core/BusyIndicatorUtils.js","sap/ui/core/Control.js","sap/ui/core/LocaleData.js","sap/ui/core/theming/Parameters.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/FilterType.js","sap/ui/model/analytics/ODataModelAdapter.js","sap/ui/model/analytics/odata4analytics.js","sap/ui/thirdparty/jquery.js","sap/viz/ui5/controls/VizFrame.js","sap/viz/ui5/controls/common/BaseControl.js","sap/viz/ui5/controls/common/feeds/FeedItem.js","sap/viz/ui5/data/Dataset.js","sap/viz/ui5/data/DimensionDefinition.js","sap/viz/ui5/data/FlattenedDataset.js","sap/viz/ui5/data/MeasureDefinition.js","sap/viz/ui5/format/ChartFormatter.js","sap/viz/ui5/utils/CommonUtil.js"],"sap/chart/ChartLog.js":["sap/base/Log.js"],"sap/chart/SeriesColorTracker.js":["sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/ColoringUtils.js":["sap/chart/ChartLog.js","sap/chart/data/TimeDimension.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/Colorings.js":["sap/chart/ChartLog.js","sap/chart/coloring/criticality/Criticality.js","sap/chart/coloring/emphasis/Emphasis.js","sap/chart/coloring/gradation/Gradation.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/criticality/Criticality.js":["sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/CriticalityType.js","sap/chart/coloring/criticality/DimensionValues.js","sap/chart/coloring/criticality/measureValues/MeasureValues.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/criticality/DimensionValues.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/CriticalityType.js","sap/chart/data/TimeDimension.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/criticality/measureValues/MeasureUtils.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/CriticalityType.js","sap/chart/coloring/criticality/measureValues/ThresholdsUtils.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/criticality/measureValues/MeasureValues.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/criticality/measureValues/MeasureUtils.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/criticality/measureValues/ThresholdsUtils.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/CriticalityType.js"],"sap/chart/coloring/emphasis/DimensionValues.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/criticality/DimensionValues.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/emphasis/Emphasis.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/emphasis/DimensionValues.js","sap/chart/data/TimeDimension.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/gradation/DelineatedDimensionValues.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureUtils.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/gradation/DelineatedMeasures.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureUtils.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/gradation/Gradation.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/gradation/DelineatedDimensionValues.js","sap/chart/coloring/gradation/DelineatedMeasures.js","sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureValues.js","sap/chart/data/MeasureSemantics.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureUtils.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/ui/thirdparty/jquery.js"],"sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureValues.js":["sap/chart/ChartLog.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/gradation/rankedMeasureValues/RankedMeasureUtils.js","sap/ui/thirdparty/jquery.js"],"sap/chart/data/Dimension.js":["sap/chart/utils/ChartUtils.js","sap/ui/core/Element.js","sap/ui/thirdparty/jquery.js"],"sap/chart/data/HierarchyDimension.js":["sap/chart/data/Dimension.js","sap/chart/utils/ChartUtils.js"],"sap/chart/data/Measure.js":["sap/chart/data/MeasureSemantics.js","sap/chart/utils/ChartUtils.js","sap/ui/core/Element.js","sap/ui/thirdparty/jquery.js"],"sap/chart/data/TimeDimension.js":["sap/chart/data/Dimension.js","sap/chart/utils/ChartUtils.js"],"sap/chart/library.js":["sap/chart/AutoScaleMode.js","sap/chart/ChartType.js","sap/chart/ColoringType.js","sap/chart/ScaleBehavior.js","sap/chart/coloring/CriticalityType.js","sap/chart/data/Dimension.js","sap/chart/data/DimensionRoleType.js","sap/chart/data/Measure.js","sap/chart/data/MeasureRoleType.js","sap/chart/data/MeasureSemantics.js","sap/chart/utils/ChartTypeAdapterUtils.js","sap/chart/utils/RoleFitter.js","sap/ui/core/library.js","sap/viz/library.js","sap/viz/ui5/format/ChartFormatter.js"],"sap/chart/pagination/PagingController.js":["sap/ui/model/Sorter.js","sap/ui/thirdparty/jquery.js"],"sap/chart/utils/ChartTypeAdapterUtils.js":["sap/chart/utils/ChartUtils.js"],"sap/chart/utils/ChartUtils.js":["sap/base/util/deepEqual.js","sap/chart/ChartType.js"],"sap/chart/utils/DataSourceUtils.js":["sap/chart/TimeUnitType.js","sap/chart/data/Dimension.js","sap/chart/data/HierarchyDimension.js","sap/chart/data/Measure.js","sap/chart/data/TimeDimension.js","sap/ui/thirdparty/jquery.js"],"sap/chart/utils/DateFormatUtil.js":["sap/chart/TimeUnitType.js","sap/ui/core/format/DateFormat.js"],"sap/chart/utils/MeasureSemanticsUtils.js":["sap/chart/ChartLog.js","sap/chart/ColoringType.js","sap/chart/coloring/ColorPalette.js","sap/chart/coloring/ColoringUtils.js","sap/chart/coloring/CriticalityType.js","sap/chart/coloring/criticality/Criticality.js","sap/chart/data/MeasureSemantics.js","sap/chart/utils/ChartUtils.js","sap/ui/thirdparty/jquery.js"],"sap/chart/utils/RoleFitter.js":["sap/chart/ChartLog.js","sap/chart/TimeUnitType.js","sap/chart/utils/ChartUtils.js","sap/chart/utils/DateFormatUtil.js","sap/chart/utils/RoleMapper.js","sap/ui/thirdparty/jquery.js","sap/viz/ui5/controls/common/feeds/AnalysisObject.js","sap/viz/ui5/controls/common/feeds/FeedItem.js","sap/viz/ui5/data/DimensionDefinition.js","sap/viz/ui5/data/MeasureDefinition.js"],"sap/chart/utils/RoleMapper.js":["sap/chart/ChartLog.js","sap/chart/data/MeasureSemantics.js","sap/chart/data/TimeDimension.js","sap/chart/utils/ChartUtils.js","sap/chart/utils/DateFormatUtil.js","sap/chart/utils/MeasureSemanticsUtils.js","sap/ui/thirdparty/jquery.js"],"sap/chart/utils/SelectionAPIUtils.js":["sap/ui/thirdparty/jquery.js"],"sap/chart/utils/ValueAxisScaleUtils.js":["sap/chart/AutoScaleMode.js","sap/chart/ChartLog.js","sap/chart/ScaleBehavior.js","sap/chart/utils/ChartUtils.js"]}});
