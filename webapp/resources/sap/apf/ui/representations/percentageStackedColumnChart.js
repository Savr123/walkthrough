/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/ui/representations/BaseVizFrameChartRepresentation','sap/apf/core/constants','sap/apf/ui/utils/constants'],function(B,c,u){"use strict";function p(a,P){B.apply(this,[a,P]);this.type=u.representationTypes.PERCENTAGE_STACKED_COLUMN_CHART;this.chartType=u.vizFrameChartTypes.PERCENTAGE_STACKED_COLUMN;this._addDefaultKind();};p.prototype=Object.create(B.prototype);p.prototype.constructor=p;p.prototype._addDefaultKind=function(){this.parameter.measures.forEach(function(m){if(m.kind===undefined){m.kind=c.representationMetadata.kind.YAXIS;}});this.parameter.dimensions.forEach(function(d,i){if(d.kind===undefined){d.kind=i===0?c.representationMetadata.kind.XAXIS:sap.apf.core.constants.representationMetadata.kind.LEGEND;}});};p.prototype.setFormatString=function(){return;};function _(a){if(!a){return;}a.setVizProperties({plotArea:{animation:{dataLoading:false,dataUpdating:false}}});}p.prototype.setVizPropsForSpecificRepresentation=function(){_(this.chart);};p.prototype.setVizPropsOfThumbnailForSpecificRepresentation=function(){if(!this.thumbnailChart){return;}_(this.thumbnailChart);};p.prototype.getAxisFeedItemId=function(k){var s=c.representationMetadata.kind;var a;switch(k){case s.XAXIS:a=c.vizFrame.feedItemTypes.CATEGORYAXIS;break;case s.YAXIS:a=c.vizFrame.feedItemTypes.VALUEAXIS;break;case s.LEGEND:a=c.vizFrame.feedItemTypes.COLOR;break;default:break;}return a;};sap.apf.ui.representations.percentageStackedColumnChart=p;return p;},true);