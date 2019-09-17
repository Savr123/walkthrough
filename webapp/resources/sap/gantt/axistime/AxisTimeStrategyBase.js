/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Element","sap/ui/core/Locale","sap/ui/core/format/DateFormat","sap/base/util/ObjectPath","../misc/Utility","../misc/Format","../misc/RelativeTimeFormatter","../config/TimeHorizon","../misc/AxisTime"],function(l,E,L,D,O,U,F,R,T,A){"use strict";var a=E.extend("sap.gantt.axistime.AxisTimeStrategyBase",{metadata:{"abstract":true,properties:{timeLineOptions:{type:"object"},timeLineOption:{type:"object"},coarsestTimeLineOption:{type:"object"},finestTimeLineOption:{type:"object"},zoomLevels:{type:"int",defaultValue:10},zoomLevel:{type:"int",defaultValue:0},calendarType:{type:"string",defaultValue:sap.ui.core.CalendarType.Gregorian},locale:{type:"object"},mouseWheelZoomType:{type:"sap.gantt.MouseWheelZoomType",defaultValue:l.MouseWheelZoomType.FineGranular}},aggregations:{totalHorizon:{type:"sap.gantt.config.TimeHorizon",multiple:false},visibleHorizon:{type:"sap.gantt.config.TimeHorizon",multiple:false},_axisTime:{type:"sap.gantt.misc.AxisTime",multiple:false,visibility:"hidden"}}}});a.prototype.applySettings=function(s){s=s||{};if(!s.visibleHorizon){s.visibleHorizon=l.config.DEFAULT_INIT_HORIZON.clone();}if(!s.totalHorizon){s.totalHorizon=l.config.DEFAULT_PLAN_HORIZON.clone();}E.prototype.applySettings.call(this,s);this.calZoomBase();return this;};a.prototype.isTimePeriodZoomEnabled=function(){return true;};a.prototype._setVisibleHorizon=function(v){var h=this._completeTimeHorizon(v);var o=this.getAggregation("visibleHorizon");if(o){o.setStartTime(h.getStartTime(),true);o.setEndTime(h.getEndTime(),true);}else{this.setAggregation("visibleHorizon",h,true);}return this;};a.prototype.setVisibleHorizonWithReason=function(v,r,o){this._setVisibleHorizon(v);return this;};a.prototype._completeTimeHorizon=function(v){var o=this.getVisibleHorizon(),b=this.getTotalHorizon();if(o===null||b===null){return v;}var r=new T({startTime:o.getStartTime(),endTime:o.getEndTime()});if(v){var s=v.getStartTime(),e=v.getEndTime(),d,t=F.abapTimestampToDate(b.getStartTime()),c=F.abapTimestampToDate(b.getEndTime());if(!s&&!e){return r;}var i;if(this._oZoom&&this._oZoom.base&&this._oZoom.base.scale!==undefined&&this._nGanttVisibleWidth!==undefined&&this.getAxisTime()){var n=this.getAxisTime().getZoomRate();var f=this._oZoom.base.scale/n;i=this._nGanttVisibleWidth*f;}else{i=F.abapTimestampToDate(r.getEndTime()).getTime()-F.abapTimestampToDate(r.getStartTime()).getTime();}if(!s){d=F.abapTimestampToDate(e);d.setTime(d.getTime()-i);if(d<t){d=t;e=F.dateToAbapTimestamp(new Date(t+i));}s=F.dateToAbapTimestamp(d);}else if(!e){d=F.abapTimestampToDate(s);d.setTime(d.getTime()+i);if(d>c){d=c;s=F.dateToAbapTimestamp(new Date(c-i));}e=F.dateToAbapTimestamp(d);}else{d=F.abapTimestampToDate(s);if(d<t){s=this.getTotalHorizon().getStartTime();}d=F.abapTimestampToDate(e);if(d>c){e=this.getTotalHorizon().getEndTime();}}r.setStartTime(s);r.setEndTime(e);}return r;};a.prototype.createAxisTime=function(o){var t=this.getTimeLineOption(),v=this.getVisibleHorizon(),b=this.getTotalHorizon();if(!U.judgeTimeHorizonValidity(v,b)){this.getVisibleHorizon().setStartTime(b.getStartTime(),true);this.getVisibleHorizon().setEndTime(b.getEndTime(),true);jQuery.sap.log.warning("Visible horizon is not in total horizon, so convert visible horizon to total horizon",null,"sap.gantt.axistime.AxisTimeStrategyBase.createAxisTime()");}var h=F.getTimeStampFormatter().parse(b.getStartTime());var H=F.getTimeStampFormatter().parse(b.getEndTime());var n=H.valueOf()-h.valueOf();var c=O.get(t.innerInterval.unit).offset(h,t.innerInterval.span).valueOf()-h.valueOf();var d=new A([h,H],[0,Math.ceil(n*t.innerInterval.range/c)],1,null,null,o,this);this.setAggregation("_axisTime",d,true);};a.prototype.syncContext=function(n){var r={zoomLevel:undefined,axisTimeChanged:false};return r;};a.prototype.updateStopInfo=function(s){return null;};a.prototype._setTotalHorizon=function(t,s){if(typeof s==="undefined"){s=true;}if(t){var o=this.getAggregation("totalHorizon");if(o){o.setStartTime(t.getStartTime(),true);o.setEndTime(t.getEndTime(),true);}else{this.setAggregation("totalHorizon",t,s);}}return this;};a.prototype.getUpperRowFormatter=function(){var t=this.getTimeLineOption();var o=t.largeInterval;var f;if(o.relativeTime){var b=F.abapTimestampToDate(this.getTotalHorizon().getStartTime());f=new R(b,o.unit,o.relativeTimePrefix);}else{var c=this.getCalendarType(),C=this.getLocale()?this.getLocale():new L(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase());f=D.getDateTimeInstance({format:o.format,pattern:o.pattern,style:o.style,calendarType:t.calendarType||c},o.locale?new L(o.locale):C);}return f;};a.prototype.getLowerRowFormatter=function(){var t=this.getTimeLineOption();var s=t.smallInterval;var f;if(s.relativeTime){var o=F.abapTimestampToDate(this.getTotalHorizon().getStartTime());f=new R(o,s.unit,s.relativeTimePrefix);}else{var c=this.getCalendarType(),C=this.getLocale()?this.getLocale():new L(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase());f=D.getDateTimeInstance({format:s.format,pattern:s.pattern,style:s.style,calendarType:c},s.locale?new L(s.locale):C);}return f;};a.prototype.isLowerRowTickHourSensitive=function(){var t=this.getTimeLineOption();var u=t.innerInterval.unit;var s=t.innerInterval.span;var S=F.getTimeStampFormatter().parse("20000101000000");var e=O.get(u).offset(S,s);return(e.getTime()-S.getTime())<=60*60*1000;};a.prototype.getAxisTime=function(){return this.getAggregation("_axisTime");};a.prototype.fireRedrawRequest=function(f,r,v,o){this.fireEvent("_redrawRequest",{forceUpdate:f,reasonCode:r,valueBeforeChange:v,originEvent:o});};a.prototype.updateGanttVisibleWidth=function(n){this._nGanttVisibleWidth=n;};a.prototype.getGanttVisibleWidth=function(){return this._nGanttVisibleWidth;};a.prototype.calZoomScale=function(u,s,r){var S=F.getTimeStampFormatter().parse("20000101000000");var e=O.get(u).offset(S,s);return this.calZoomScaleByDate(S,e,r);};a.prototype.calZoomScaleByDate=function(s,e,r){return(e.valueOf()-s.valueOf())/r;};a.prototype.calZoomBase=function(){var b=this.getTimeLineOption()||this.getFinestTimeLineOption();if(b){var s=this.calZoomScale(b.innerInterval.unit,b.innerInterval.span,b.innerInterval.range);this._oZoom={base:{timeLineOption:b,rate:1,scale:s}};return true;}return false;};a.prototype.updateVisibleHorizonOnMouseWheelZoom=function(t,s,o,S){var z=s<0;var Z=Math.round(Math.abs(s)/100);var m=this.getMouseWheelZoomType();if(m===l.MouseWheelZoomType.FineGranular){this.updateVisibleHorizonOnFineGranularMouseWheelZoom(t,z,Z,o,S);}else if(m===l.MouseWheelZoomType.Stepwise){this.updateVisibleHorizonOnStepWiseMouseWheelZoom(t,z,Z,o,S);}};a.prototype.updateVisibleHorizonOnFineGranularMouseWheelZoom=function(t,z,Z,o,s){var v=this.getVisibleHorizon();var V=F.abapTimestampToDate(v.getStartTime());var b=this.getTimeLineOption();var n=O.get(b.innerInterval.unit).offset(V,Z*b.innerInterval.span).getTime()-V.getTime();var i=z?-1:1;var N=this.calVisibleHorizonByDelta(i*n,t);var r=s?"syncVisibleHorizon":"mouseWheelZoom";this.setVisibleHorizonWithReason(N,r,o);};a.prototype.updateVisibleHorizonOnStepWiseMouseWheelZoom=function(t,z,Z,o,s){var i=z?-1:1;var b=this.getZoomLevel()-i*Z;if(b>-1&&b<this.getZoomLevels()){if(this._aZoomRate[b]&&!U.floatEqual(this._aZoomRate[b],this._oZoom.rate)){this.setZoomLevel(b);}}};a.prototype.calVisibleHorizonByRate=function(n,o){var b=0;if(this._oZoom&&this._oZoom.base&&this._oZoom.base.scale!==undefined&&this._nGanttVisibleWidth!==undefined){var v=F.abapTimestampToDate(this.getVisibleHorizon().getStartTime());var V=F.abapTimestampToDate(this.getVisibleHorizon().getEndTime());var c=V.getTime()-v.getTime();var d=this._oZoom.base.scale/n;var e=this._nGanttVisibleWidth*d;b=e-c;}return this.calVisibleHorizonByDelta(b,o);};a.prototype.calVisibleHorizonByDelta=function(n,o){var v=this.getVisibleHorizon();if(n!==0){var b=F.abapTimestampToDate(v.getStartTime()).getTime();var c=F.abapTimestampToDate(v.getEndTime()).getTime();var d=c-b;var e=0;var f,g;var h=F.abapTimestampToDate(this.getTotalHorizon().getStartTime()).getTime();var i=F.abapTimestampToDate(this.getTotalHorizon().getEndTime()).getTime();if(n>0&&b<=h){f=0;g=1;e=h;}else if(n>0&&c>=i){f=1;g=0;e=i;}else{if(!o){e=b+d/2;}else{e=o.getTime();}f=(e-b)/d;g=1-f;}var j=d+n;var k=e-f*j;var m=e+g*j;var N,p;if(k<=h){N=this.getTotalHorizon().getStartTime();}else{N=new Date();N.setTime(k);}if(m>=i){p=this.getTotalHorizon().getEndTime();}else{p=new Date();p.setTime(m);}return new T({startTime:N,endTime:p});}return v;};a.prototype.calMiddleDate=function(s,e){return new Date(s.getTime()+(e.getTime()-s.getTime())/2);};a.prototype._updateZoomControlType=function(z){return null;};return a;},true);
