// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/model/FilterOperator","sap/ushell/components/tiles/utils","sap/ui/model/analytics/odata4analytics","sap/ui/core/format/NumberFormat","sap/ui/model/odata/ODataModel","sap/base/Log","sap/ui/thirdparty/jquery","sap/base/util/UriParameters"],function(F,u,o,N,O,L,q,U){"use strict";var P=o.ParameterizationRequest;var Q=o.QueryResultRequest;var R=o.Model.ReferenceByModel;var M=o.Model;sap=sap||{};sap.ushell=sap.ushell||{};sap.ushell.components=sap.ushell.components||{};sap.ushell.components.tiles.indicatorTileUtils=sap.ushell.components.tiles.indicatorTileUtils||{};sap.ushell.components.tiles.indicatorTileUtils.util=sap.ushell.components.tiles.indicatorTileUtils.util||{};sap.ushell.components.tiles.indicatorTileUtils.util=(function(g,$){var c={},t={"ANN":"years","WEE":"weeks","DAY":"days","HUR":"hours","MIN":"minutes"},a={},b={};return{getScheduledJob:function(k){return a[k];},setScheduledJob:function(k,d){a[k]=d;},isCallInProgress:function(k){return b[k];},setUnsetCallInProgress:function(k,v){b[k]=v;},getTimeUnitMap:function(){return t;},getHanaUser:function(){},addSystemToServiceUrl:function(d,s){L.info("Hana Adapter --> Add System to Service Url");if(sap.ushell&&sap.ushell.Container){if(s){d=sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(d,s);}else{d=sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(d);}}return d;},getODataModelByServiceUri:function(s){s=this.addSystemToServiceUrl(s);if(!c[s]){var m=new O(s,{loadMetadataAsync:true,json:true});c[s]=m;}return c[s];},getEdmType:function(s,p){var d=null;if(s instanceof O){d=s;}else{d=this.getODataModelByServiceUri(s);}if(d&&d.getServiceMetadata()){var e=d.getServiceMetadata();var f=e.dataServices.schema[0].entityType;if(f){for(var i=0;i<f.length;i++){var h=f[i];var k=h.property;for(var j=0;j<k.length;j++){var l=k[j];if(l.name===p){return l.type;}}}}}return null;},getMillisecond:function(d,e){var r;switch(e){case"seconds":r=d*1000;break;case"minutes":r=d*60*1000;break;case"hours":r=d*60*60*1000;break;case"days":r=d*24*60*60*1000;break;case"weeks":r=d*7*24*60*60*1000;break;case"months":r=d*4*7*24*60*60*1000;break;case"years":r=d*12*4*7*24*60*60*1000;break;}return r;},getUTCDate:function(){var n=new Date();return n;},isCacheValid:function(d,e,f,h,i){var j=c.getKpivalueById(d);if(!j){return false;}else if(!(f&&Number(f))){return true;}var k=this.getMillisecond(f,t[h]),l;if(q.type(j.CachedTime)==="date"){l=j.CachedTime&&j.CachedTime.getTime();}else{l=j.CachedTime&&parseInt(j.CachedTime.substr(6),10);}var m=this.getUTCDate();return(l>=e&&k>=(m-l)&&!i);},getMantissaLength:function(n){var s=n.toString();var i=0;if(n<0){i=1;}if(s.indexOf(".")===-1){return(n<0?s.length-1:s.length);}return s.substring(i,s.indexOf(".")).length;},getLocaleFormattedValue:function(n,s,d,i,e){q.sap.require("sap.ui.core.format.NumberFormat");i=i||false;e=e||null;if(i){return N.getCurrencyInstance({style:"short",showMeasure:false}).format(n,e);}var D=2;var f={style:"short"};var h;if(!(d===-1||d===null)){f.shortDecimals=Number(d);f.minFractionDigits=Number(d);f.maxFractionDigits=Number(d);}var v=N.getInstance(f);if(s===-2){if(n>9999){h="????";}else if((n>-0.001&&n<0)||(n<0.001&&n>0)){h="0";}else{if(n.toString().indexOf(".")!==-1){h=Number(n).toFixed(4-n.toString().indexOf("."));}else{h=Number(n);}h=v.format(h);}}else if(d===-1||d===null){var m=this.getMantissaLength(n);if(!(m%3)){D=1;}if(m%3===1){D=3;}if(m%3===2){D=2;}if(Math.abs(n)%Math.pow(10,m-1)===0){D=0;}else if((Math.abs(n)%Math.pow(10,m-1))<6*Math.pow(10,m-4)){D=0;}v=N.getInstance({style:"short",shortDecimals:D});h=v.format(n);}else{h=v.format(n);}return h;},getPlatform:function(p){return(new U(window.location.href).get("sb_metadata")||p||"HANA").toUpperCase();},getTileTitleSubtitle:function(C){var d={};if(C.bag&&C.bag.getBagIds()&&C.bag.getBagIds().length){d.title=C.bag.getBag("sb_tileProperties").getText("title")||C.bag.getBag("sb_tileProperties").getProperty("title")||C.preview.getTitle();d.subTitle=C.bag.getBag("sb_tileProperties").getText("description")||C.bag.getBag("sb_tileProperties").getProperty("description")||C.preview.getDescription();}else{d.title=C.preview.getTitle();d.subTitle=C.preview.getDescription();}return d;},scheduleFetchDataJob:function(i){var d;if(this.getView().getViewName().indexOf("DualTile")!==-1){d=this.oKpiTileView.oConfig;}else{d=this.oConfig;}var k=d.TILE_PROPERTIES.id+"data";var r=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(k);if(r){clearTimeout(r);r=undefined;}var t=sap.ushell.components.tiles.indicatorTileUtils.util.getTimeUnitMap(),e=sap.ushell.components.tiles.indicatorTileUtils.util.getCachingTime(d),f=sap.ushell.components.tiles.indicatorTileUtils.util.getCachingTimeUnit(d),h=sap.ushell.components.tiles.indicatorTileUtils.util.getMillisecond(e,t[f]),j;if(q.type(this.cacheTime)==="date"){j=this.cacheTime;}else{j=new Date(parseInt(this.cacheTime.substr(6),10));}var l=h-(sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate()-j);if(l<=0){l=0;}else if(l>2147483646){l=2147483646;}if(!i){l=300000;}if(this.getView().getViewName().indexOf("DualTile")!==-1){r=setTimeout(this.refreshPress.bind(this),l);}else{r=setTimeout(this.refreshHandler.bind(this,false,true),l);sap.ushell.components.tiles.indicatorTileUtils.util.setScheduledJob(k,r);}this.updateDatajobScheduled=true;},scheduleTimeStampJob:function(){var k=this.oConfig.TILE_PROPERTIES.id+"time",r=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(k),d;if(r){clearTimeout(r);r=undefined;}if(q.type(this.cacheTime)==="date"){d=this.cacheTime;}else{d=new Date(parseInt(this.cacheTime.substr(6),10),13);}var e=sap.ushell.components.tiles.indicatorTileUtils.util.getTimeDifference(sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate()-d);r=setTimeout(this.setTimeStamp.bind(this,this.cacheTime),e.timer);sap.ushell.components.tiles.indicatorTileUtils.util.setScheduledJob(k,r);this.updateTimeStampjobScheduled=true;},getBoolValue:function(v){var r=false;if(typeof v==="boolean"&&v){r=true;}return r;},getSeconds:function(d){return(d/1000);},getMinutes:function(d){return(this.getSeconds(d)/60);},getHours:function(d){return(this.getMinutes(d)/60);},getDays:function(d){return(this.getHours(d)/24);},getWeeks:function(d){return(this.getDays(d)/7);},getMonths:function(d){return(this.getWeeks(d)/4);},getYears:function(d){return(this.getMonths(d)/12);},getTimeDifference:function(d){var r={};if(d){var m=this.getMinutes(d);var h=this.getHours(d);var e=this.getDays(d);if(m<5){r.time=0;r.unit="minutes";r.timer=Math.round(this.getMillisecond(5-m,"minutes"));}else if(m>=5&&m<60){if(m<10){r.time=5;}else{r.time=(m-(m%10));}r.unit="minutes";r.timer=Math.round(this.getMillisecond(10-(m%10),"minutes"));}else if(h>=1&&h<24){r.unit="hours";r.time=(h-(h%1));r.timer=Math.round(this.getMillisecond(1-(h%1),"hours"));}else if(e>=1&&e<2){r.unit="days";r.time=(e-(e%1));r.timer=Math.round(this.getMillisecond(1-(e%1),"days"));}else{r.unit="days";r.time=(e-(e%1));r.timer=this.getMillisecond(2,"days");}}else{r.timer=6000;r.unit="days";r.timer=2000;}return r;},getCachingTime:function(C){return((C.CACHINGTIME&&Number(C.CACHINGTIME))||(C.TILE_PROPERTIES.cachingTime&&Number(C.TILE_PROPERTIES.cachingTime)));},getCachingTimeUnit:function(C){return(C.CACHINGUNIT||C.TILE_PROPERTIES.cachingTimeUnit);},getFrontendCacheQuery:function(d,e,p,T){var f;try{var h=T.url.addSystemToServiceUrl("/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV");h=sap.ushell.components.tiles.indicatorTileUtils.util.cacheBustingMechanism(h);f=this.getODataModelByServiceUri(h);h="/CacheParameters(P_CacheType=1)/Results";return{oModel:f,uri:h};}catch(i){L.error("FrontEnd cache Metadata failed");return null;}},isDualTile:function(C){var d=C&&C.TILE_PROPERTIES&&C.TILE_PROPERTIES.tileType;if(d.indexOf("DT-")===-1){return false;}return true;},writeFrontendCacheByChipAndUserId:function(T,d,e,f,h){var s=function(e){L.info("cache write successFully");h(e);};var i=function(){L.error("cache update failed");h(null);};try{var j=T.url.addSystemToServiceUrl("/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV/");j=sap.ushell.components.tiles.indicatorTileUtils.util.cacheBustingMechanism(j);var k=this.getODataModelByServiceUri(j);var l="/CacheData";k.create(l,e,{async:true,success:s,error:i});}catch(m){L.error(m);}},getKpiChipsOnPage:function(d,e){var f=[];var l=sap.ushell.Container.getService("LaunchPage");l.getGroups().done(function(G){if(G&&G instanceof Array&&G.length){L.info("Group Chip fetch");}e(d,f);});},getFrontendCache:function(C,T){var d=this;var e=c.getFrontEndCacheDeferredObject(T.url.getApplicationSystem());var f;if(e){f=e;}else{f=q.Deferred();}var h=C&&C.TILE_PROPERTIES&&C.TILE_PROPERTIES.id;var i=c.getKpivalueById(h);if(i){e.resolve(true);}else if(e){return e.promise();}else{c.setFrontEndCacheDefferedObject(T.url.getApplicationSystem(),f);e=f;this.getKpiChipsOnPage(h,function(h,p){if(p){var j=d.getFrontendCacheQuery(p,sap.ushell.Container.getUser().getId(),p,T);if(j){var k=j.oModel;var l=j.uri;var m=false;k.read(l,null,null,true,function(n){if(n&&n.results&&n.results instanceof Array&&n.results.length){q.each(n.results,function(r,s){c.setKpivalueById(s.ChipId,s);});}if(c.getKpivalueById(h)){m=true;}e.resolve(m);},function(n){if(n&&n.response){L.error(n.message+" : "+n.request.requestUri);}e.reject();});}else{e.reject();}}else{e.resolve(false);}});}return e.promise();},getModelerRuntimeServiceModel:function(){var d="/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";d=sap.ushell.components.tiles.indicatorTileUtils.util.cacheBustingMechanism(d);return this.getODataModelByServiceUri(d);},getSapFontErrorCode:function(){return String.fromCharCode(0xe0b1);},getSapFontBusyCode:function(){return String.fromCharCode(0xe1f2);},prepareFilterStructure:function(f,d){var v=[];if(d){f=f.concat(d);}for(var i=0;i<f.length;i++){var p={};p.comparator=f[i].OPERATOR;p.filterPropertyName=f[i].NAME;if(f[i].ID){p.id=f[i].ID;}p.type=f[i].TYPE;p.value=f[i].VALUE_1;p.valueTo=f[i].VALUE_2;v.push(p);}return v;},getODataModelByServiceUriFromChipAPI:function(s,T){s=T.url.addSystemToServiceUrl(s);if(!c[s]){var m=new O(s,true);c[s]=m;}return c[s];},cacheBustingMechanism:function(s){if(window["sap-ushell-config"].cacheBusting.cacheBusterToken){var d=window["sap-ushell-config"].cacheBusting&&window["sap-ushell-config"].cacheBusting.cacheBusterToken;s=s+"?_="+d;}return s;},getRunTimeUri:function(p){var d="/sap/hba/r/sb/core/odata/runtime/SMART_BUSINESS.xsodata";var e="/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";if(p.toUpperCase()==="HANA"){if(window["sap-ushell-config"].cacheBusting){d=sap.ushell.components.tiles.indicatorTileUtils.util.cacheBustingMechanism(d);}return d;}if(window["sap-ushell-config"].cacheBusting){e=sap.ushell.components.tiles.indicatorTileUtils.util.cacheBustingMechanism(e);}return e;},getFilterFromRunTimeService:function(C,T,s,e){var p=C.TILE_PROPERTIES.sb_metadata;var K=this.getODataModelByServiceUriFromChipAPI(this.getRunTimeUri(p),T);var f="ID eq '#EVALUATIONID'".replace("#EVALUATIONID",C.EVALUATION.ID);var k=K.read("/EVALUATION_FILTERS",null,{"$filter":f},true,function(d){var h=[];if(d.results.length){h=d.results;}s.call(this,h);},e);return k;},_getOData4AnalyticsObject:function(s){var m=null;if(s instanceof O){m=s;}else if(typeof s==="string"){m=this.getODataModelByServiceUri(s);}else{throw new Error("Invalid Input to Create ODataModel Object : "+s);}var d=new M(R(m));return d;},findTextPropertyForDimension:function(s,d,f){try{var h=this._getOData4AnalyticsObject(s);var i=h.findQueryResultByName(d);var D=i.findDimensionByName(f);if(D.getTextProperty()){return D.getTextProperty().name;}return f;}catch(e){L.error("Error Fetching Text Property for "+f+" : "+e.toString());}},getEvalValueMeasureName:function(C,d,r){var e=C.EVALUATION_VALUES;for(var i=0;i<e.length;i++){if(e[i].TYPE===d){if(r==="FIXED"){return e[i].FIXED;}return e[i].COLUMN_NAME;}}},getSemanticColorName:function(d){var s="";if(d==="Error"){s="sb.error";}if(d==="Neutral"){s="sb.neutral";}if(d==="Critical"){s="sb.critical";}if(d==="Good"){s="sb.good";}return s;},setTooltipInTile:function(C,d,v){var e="";var r=u.getResourceBundleModel().getResourceBundle();if(d==="NT"||d==="DT"){if(v.status){e+=r.getText("sb.status")+": "+r.getText(v.status)+"\n";}if(v.actual){e+=r.getText("sb.actual")+": "+v.actual+"\n";}if(v.target){e+=r.getText("sb.target")+": "+v.target+"\n";}if(v.cH){e+=r.getText("sb.ch")+": "+v.cH+"\n";}if(v.wH){e+=r.getText("sb.wh")+": "+v.wH+"\n";}if(v.wL){e+=r.getText("sb.wl")+": "+v.wL+"\n";}if(v.cL){e+=r.getText("sb.cl")+": "+v.cL+"\n";}}if(d==="CONT"||d==="COMP"){if(v.measure&&d==="CONT"){if(v&&v.contributionTile.contributionTile&&v.contributionTile.contributionTile[1]==="asc"){e+=r.getText("sb.bottomn")+": "+v.contributionTile[0]+"\n";}else if(v&&v.contributionTile.contributionTile&&v.contributionTile.contributionTile.length){e+=r.getText("sb.topn")+": "+v.contributionTile[0]+"\n";}}if(v.m1&&((v.v1===undefined||v.v1===null)?false:v.v1.toString())&&v.c1){e+=v.m1+": "+v.v1+" "+r.getText(v.c1)+"\n";}if(v.m2&&((v.v2===undefined||v.v2===null)?false:v.v2.toString())&&v.c2){e+=v.m2+": "+v.v2+" "+r.getText(v.c2)+"\n";}if(v.m3&&((v.v3===undefined||v.v3===null)?false:v.v3.toString())&&v.c3){e+=v.m3+": "+v.v3+" "+r.getText(v.c3)+"\n";}}if(C&&C.setTooltip){C.setTooltip(e);}},_getFormattedTileProperties:function(d){d=d||{};var p=["sb_metadata","sb_navigation","sb_catalog"];var e=false;for(var i=0;!e&&i<p.length;i++){e=e||new U(window.location.href).get(p[i])||d[p[i]];}d.sb_metadata=(new U(window.location.href).get("sb_metadata")||d.sb_metadata||"HANA").toLowerCase();d.sb_navigation=(new U(window.location.href).get("sb_navigation")||d.sb_navigation||"abap").toLowerCase();d.sb_catalog=(new U(window.location.href).get("sb_catalog")||d.sb_catalog||"HANA").toLowerCase();d.isPlatformInfoPresent=e;return d;},getEvaluationDetailsFromRunTimeService:function(e,p,i,d){var K=this.getODataModelByServiceUri(this.getRunTimeUri(p));var f="ID eq '#EVALUATIONID'".replace("#EVALUATIONID",i);K.read(e,null,{"$filter":f},true,function(h){var j=[];if(h.results.length){j=h.results;}d.call(this,j);});},getParsedChip:function(C,i,d){try{var p={};var e=JSON.parse(C);var f=JSON.parse(e.TILE_PROPERTIES).evaluationId||"";if(e.TILE_PROPERTIES){var h=JSON.parse(e.TILE_PROPERTIES);if(h&&(h.instanceId||h.catalogId)){return false;}}var j=this;if(e.blankTile){p.BLANKTILE=e.blankTile;}if(e.cachingTime){p.CACHINGTIME=e.cachingTime;}if(e.cachingTimeUnit){p.CACHINGUNIT=e.cachingTimeUnit;}if(e.TAGS){p.TAGS=JSON.parse(e.TAGS);}if(e.ADDITIONAL_FILTERS){p.ADDITIONAL_FILTERS=JSON.parse(e.ADDITIONAL_FILTERS);}if(e.ADDITIONAL_APP_PARAMETERS){p.ADDITIONAL_APP_PARAMETERS=JSON.parse(e.ADDITIONAL_APP_PARAMETERS);}p.TILE_PROPERTIES=this._getFormattedTileProperties(JSON.parse(e.TILE_PROPERTIES));var s=p.TILE_PROPERTIES.sb_metadata;if(e.EVALUATION_FILTERS){p.EVALUATION_FILTERS=JSON.parse(e.EVALUATION_FILTERS);if(e.EVALUATION_VALUES){p.EVALUATION_VALUES=JSON.parse(e.EVALUATION_VALUES);if(e.EVALUATION){p.EVALUATION=JSON.parse(e.EVALUATION);if(d){d(p);}else{return p;}}else if(!i){j.getEvaluationDetailsFromRunTimeService("/EVALUATIONS",s,f,function(l){p.EVALUATION=l;if(d){d(p);}else{return p;}});}else if(d){d(p);}else{return p;}}else if(!i){j.getEvaluationDetailsFromRunTimeService("/EVALUATION_VALUES",s,f,function(l){p.EVALUATION_VALUES=l;if(e.EVALUATION){p.EVALUATION=JSON.parse(e.EVALUATION);if(d){d(p);}else{return p;}}else{j.getEvaluationDetailsFromRunTimeService("/EVALUATIONS",s,f,function(l){p.EVALUATION=l;if(d){d(p);}else{return p;}});}});}else if(d){d(p);}else{return p;}}else if(i){if(d){d(p);}else{return p;}}else{j.getEvaluationDetailsFromRunTimeService("/EVALUATION_FILTERS",s,f,function(l){p.EVALUATION_FILTERS=l;if(e.EVALUATION_VALUES){p.EVALUATION_VALUES=JSON.parse(e.EVALUATION_VALUES);if(e.EVALUATION){p.EVALUATION=JSON.parse(e.EVALUATION);if(d){d(p);}else{return p;}}else{j.getEvaluationDetailsFromRunTimeService("/EVALUATIONS",s,f,function(l){p.EVALUATION=l;if(d){d(p);}else{return p;}});}}else{j.getEvaluationDetailsFromRunTimeService("/EVALUATION_VALUES",s,f,function(l){p.EVALUATION_VALUES=l;if(e.EVALUATION){p.EVALUATION=JSON.parse(e.EVALUATION);if(d){d(p);}else{return p;}}else{j.getEvaluationDetailsFromRunTimeService("/EVALUATIONS",s,f,function(l){p.EVALUATION=l;if(d){d(p);}else{return p;}});}});}});}}catch(k){return false;}},getNavigationTarget:function(C,s){var f=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService;var d=f&&f("CrossApplicationNavigation");var e;var p={};p.evaluationId=C.EVALUATION.ID;p.chipId=C.TILE_PROPERTIES.id;if(s){p["sap-system"]=s;}p.tileType=C.TILE_PROPERTIES.tileType;if(C.TILE_PROPERTIES.dimension){p.dimension=C.TILE_PROPERTIES.dimension;}if(C.TILE_PROPERTIES.storyId){p.storyId=C.TILE_PROPERTIES.storyId;}if(C.TILE_PROPERTIES.apfConfId){p["sap-apf-configuration-id"]=C.TILE_PROPERTIES.apfConfId;}if(C.TILE_PROPERTIES.isPlatformInfoPresent){p.sb_metadata=C.TILE_PROPERTIES.sb_metadata;p.sb_navigation=C.TILE_PROPERTIES.sb_navigation;p.sb_catalog=C.TILE_PROPERTIES.sb_catalog;}if(C.ADDITIONAL_APP_PARAMETERS){for(e in C.ADDITIONAL_APP_PARAMETERS){if(C.ADDITIONAL_APP_PARAMETERS.hasOwnProperty(e)){if(C.ADDITIONAL_APP_PARAMETERS[e].constructor===Array){var h=C.ADDITIONAL_APP_PARAMETERS[e];for(var i=0;i<h.length;i++){p[e]=h[i];}}else{p[e]=C.ADDITIONAL_APP_PARAMETERS[e];}}}}var k=d&&d.hrefForExternal({target:{semanticObject:C.TILE_PROPERTIES.semanticObject,action:C.TILE_PROPERTIES.semanticAction},params:p})||"";if(C.ADDITIONAL_FILTERS){var l=C.ADDITIONAL_FILTERS;var m="&";for(var j=0;j<l.length;j++){if(l[j].OPERATOR==="EQ"){m=m+"/"+l[j].NAME+"="+l[j].VALUE_1;}}k+=m;}return k;},getChipTitle:function(C){var d="";if(C){var e=C.EVALUATION||{};d=e.INDICATOR_TITLE||"";}return d;},getstringifyTileConfig:function(C){var s={};s.EVALUATION=JSON.stringify(C.EVALUATION);s.EVALUATION_FILTERS=JSON.stringify(C.EVALUATION_FILTERS);s.EVALUATION_VALUES=JSON.stringify(C.EVALUATION_VALUES);s.TILE_PROPERTIES=JSON.stringify(C.TILE_PROPERTIES);return JSON.stringify(s);},getChipSubTitle:function(C){var T="";if(C){var d=C.EVALUATION||{};T=d.TITLE||"";}return T;},getAllMeasures:function(s,d){var m=[];try{var f=this._getOData4AnalyticsObject(s);var h=f.findQueryResultByName(d);m=h.getAllMeasureNames();}catch(e){L.error("Error Fetching All Measures : "+e.toString());}return m;},getFormattingMetadata:function(s,e,p){var f={};f._hasCurrency=false;f._hasSapText=false;var m=null;if(s instanceof O){m=R(s);}else{var d=this.getODataModelByServiceUri(s);m=R(d);}var h=new M(m);var j=h.findQueryResultByName(e);var k=j.getAllMeasures();if(k[p]){var l=(k[p]._oTextProperty&&k[p]._oTextProperty.name)?k[p]._oTextProperty.name:"";if(l!==""){f._hasSapText=true;f._sapTextColumn=l;}else if(k[p].hasOwnProperty("_oUnitProperty")){var n=k[p]._oUnitProperty.extensions;for(var i=0;i<k[p]._oUnitProperty.extensions.length;i++){if(n[i].name==="semantics"&&n[i].value==="currency-code"){f._hasCurrency=true;f._currencyColumn=k[p]._oUnitProperty.name;}}}}return f;},getAllDimensions:function(s,d){function i(m,n){var p=0,r=0;var v=[];while(p<m.length&&r<n.length){if(m[p]<n[r]){p++;}else if(m[p]>n[r]){r++;}else{v.push(m[p]);p++;r++;}}return v;}var f=[];var h=[];try{var j=this._getOData4AnalyticsObject(s);var k=j.findQueryResultByName(d);var l=k.getEntityType();h=l.getFilterablePropertyNames();f=k.getAllDimensionNames();if(h&&h.length){f=i(h.sort(),f.sort());}}catch(e){L.error("Error Fetching All Dimesions : "+e.toString());}return f;},prepareQueryServiceUri:function(s,d,m,f,v,h,n){function _(e1){return e1.replace(/'/g,"''");}var p=null;var r=function(){};var w=function(){};try{var x=null;if(s instanceof O){x=R(s);}else{var A=this.getODataModelByServiceUri(s);x=R(A);}var B=new M(x);var C=B.findQueryResultByName(d);var D=new Q(C);if(m){D.setMeasures(m.split(","));D.includeMeasureRawFormattedValueUnit(null,true,true,true);}if(f){if(typeof f==="string"){p=f;p=p.split(",");}for(var i=0;i<p.length;i++){D.addToAggregationLevel([p[i]]);var E=C.getAllDimensions();if(E[p[i]].getTextProperty()!==null){D.includeDimensionKeyTextAttributes([p[i]],true,true,null);}}}if(v&&v.length){var G=[];var H=[];var l;for(i=0,l=v.length;i<l;i++){var I=v[i];if(I.type==="PA"){H.push(I);}else if(I.type==="FI"){G.push(I);}}r=function(e1){var f1=e1.toJSON();var g1=f1.charAt(f1.length-1).toUpperCase();if(g1.charCodeAt(0)>=65&&g1.charCodeAt(0)<=90){f1=f1.slice(0,-1);}return f1;};w=function(e1){if(e1){try{if(e1===+e1){e1=window.parseInt(e1);}var f1=new Date(e1);var g1=f1.getTime();if(isNaN(g1)){return e1;}return r(f1);}catch(e){}}return e1;};if(G.length){var J=D.getFilterExpression();for(i=0,l=G.length;i<l;i++){I=G[i];if(this.getEdmType(s,I.filterPropertyName)==="Edm.DateTime"){I.value=w(I.value);I.valueTo=w(I.valueTo);}if(I.comparator===F.BT){J.addCondition(I.filterPropertyName,I.comparator,_(I.value),I.valueTo);}else{var K=I.value.split(",");for(var j=0,k=K.length;j<k;j++){J.addCondition(I.filterPropertyName,I.comparator,_(K[j].replace(/\^\|/g,",")),null);}}}}if(H.length){if(C.getParameterization()){var S=new P(C.getParameterization());var T=C.getParameterization();var V,W,X,Y,Z;for(var y=0,z=H.length;y<z;y++){V=H[y];W=T.findParameterByName(V.filterPropertyName);if(W.isIntervalBoundary()===true&&W.isLowerIntervalBoundary()===true){Z=W.getPeerIntervalBoundaryParameter();for(i=0,l=H.length;i<l;i++){if(H[i].filterPropertyName===Z.getName()){Y=_(H[i].value);break;}}X=_(V.value);if(Y){S.setParameterValue(V.filterPropertyName,X,Y);}}else if(W.isIntervalBoundary()===true&&W.isLowerIntervalBoundary()===false){L.info("Future development");}else{S.setParameterValue(V.filterPropertyName,_(V.value));}}D.setParameterizationRequest(S);}}}var a1=D.getURIToQueryResultEntries();if(h&&h.length){a1=a1+"&$orderby=";for(y=0,z=h.length;y<z;y++){var b1=h[y].sortOrder||"asc";if(b1){a1+=h[y].element+" "+b1+",";}}a1=a1.slice(0,a1.length-1);}if(n){a1=a1+"&$top="+n;}var c1=C.getAllMeasures();var d1=[];for(i=0;i<m.split(",").length;i++){d1.push(c1[m.split(",")[i]].getUnitProperty());}return{uri:a1,model:B.getODataModel(),unit:d1};}catch(e){L.error("Error Preparing Query Service Uri using OData4Analytics Library : "+e.toString());if(arguments.length){L.error("Arguments Passed to this function");L.error(arguments[0]+","+arguments[1]+","+arguments[2]+","+arguments[3]);}else{L.error("NO Arguments passed to this function");}return null;}},getAllEntitySet:function(s){var d=[];try{var f=this._getOData4AnalyticsObject(s);d=f.getAllQueryResultNames();}catch(e){L.error("Error fetching Enity Set : "+e.toString());}return d;},getAllMeasuresWithLabelText:function(s,d){var m=[];try{var f=this._getOData4AnalyticsObject(s);var h=f.findQueryResultByName(d);var j=h.getAllMeasureNames();for(var i=0;i<j.length;i++){var k=j[i];g.oMeasure=h.findMeasureByName(k);m.push({key:k,value:oMeasure.getLabelText()});}}catch(e){L.error("Error Fetching All Measures : "+e.toString());}return m;},getAllDimensionsWithLabelText:function(s,d){var f=[];try{var h=this._getOData4AnalyticsObject(s);var j=h.findQueryResultByName(d);var k=j.getAllDimensionNames();for(var i=0;i<k.length;i++){var l=k[i];var D=j.findDimensionByName(l);var m=null;if(D.getTextProperty()!==null){m=D.getTextProperty().name;}f.push({key:l,value:D.getLabelText(),textProperty:m});}}catch(e){L.error("Error Fetching All Dimesions : "+e.toString());}return f;},getAllInputParams:function(s,d){var i=[];try{var f=this._getOData4AnalyticsObject(s);var h=f.findQueryResultByName(d);if(h.getParameterization()){var p=h.getParameterization();i=p.getAllParameterNames();}}catch(e){L.error("Error Fetching Input Params : "+e.toString());}return i;},getAllInputParamsWithFlag:function(s,d){var f=[];try{var h=this._getOData4AnalyticsObject(s);var j=h.findQueryResultByName(d);if(j.getParameterization()){var p=j.getParameterization();var k=p.getAllParameterNames();for(var i=0;i<k.length;i++){var l=k[i];var m=p.findParameterByName(l);f.push({name:l,optional:m.isOptional()});}}}catch(e){L.error("Error Fetching Input Params : "+e.toString());}return f;},formatOdataObjectToString:function(v){if(v&&v.constructor===Object){if(v.__edmType==="Edm.Time"){var m=v.ms;var s=Math.floor((m/1000)%60);var d=Math.floor((m/60000)%60);var h=Math.floor((m/3600000)%24);return h+"H"+d+"M"+s+"S";}}return v;},generateCombinations:function(d){function e(h,s){while(s.length<h){s="0"+s;}return s;}var m=Math.pow(2,d.length);var r=[];var f=0;while(m>1){var s=(m-1).toString(2);s=e(d.length,s);r[f]=[];for(var i=0;i<s.length;i++){if(Number(s[i])){r[f].push(d[i]);}}m--;f++;}return r;},logError:function(e,C){if(e==="no data"&&C){var r=u.getResourceBundleModel().getResourceBundle();C.setFailedText(r.getText("sb.noData"));}L.error(e.toString());},numberOfLeadingZeros:function(n){n=String(n);var d=0;var e=n.indexOf(".");if(e===-1){return 0;}if(Number(n.split(".")[0])!==0){return 0;}var i=e+1;while(n[i++]==="0"){++d;}return d;},formatValue:function(v,s,d){d=d||3;var e={3:"K",6:"M",9:"B",12:"T",0:""};e["-3"]="m";e["-6"]="u";e["-9"]="n";e["-12"]="t";e["-2"]="%";var f,p,h;f=Number(v).toPrecision(d);var z=this.numberOfLeadingZeros(f);if(z>0&&s<0){p=f*Math.pow(10,z+d);h=-(z+d);}else{p=Number(f.split("e")[0]);h=Number(f.split("e")[1])||0;}if(!v&&v!==0){return{value:"",unitPrefix:""};}if(s>=0){if(h%3!==0){if(h%3===2){if(h+1===s){h=h+1;p=p/10;}else{h=h-2;p=p*100;}}else if(h+2===s){h=h+2;p=p/100;}else{h--;p=p*10;}}else if(h===15){p=p*1000;h=12;}}else if(s==="-2"){var x=this.formatValue((v*100),0);}else if(h>=0&&v<10&&s==="-3"){p=v*Math.pow(10,3);h=-3;}else if(h>=0){return this.formatValue(v,0);}else{h=Math.abs(h);s=Math.abs(s);if(s>h){p=p/(Math.pow(10,h%3));h=h-(h%3);}else{var i=h-s;p=p/(Math.pow(10,i));h=h-i;}h=0-h;}p+="";if(s==="-2"){var j=(x.unitPrefix==="")?Number(x.value+"").toFixed(4-(x.value+"").indexOf(".")):Number(x.value+"").toFixed(3-(x.value+"").indexOf("."));return{value:Number(j),unitPrefix:(x.unitPrefix)+e[-2]};}p=Number(p).toFixed(4-p.indexOf("."));return{value:Number(p),unitPrefix:e[h]};},isSmartbusinessChipAndCachable:function(d){var C=this.getParsedChip(d&&d.getConfigurationParameter("tileConfiguration"));return(C&&C.TILE_PROPERTIES&&C.TILE_PROPERTIES.tileType&&this.getCachingTime(C));},getHanaClient:function(){var e;var f=function(d,s,x){e=d.sessionClient;c.setCacheHanaClient(e);sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED.resolve(e);};var h=function(d,k,l){L.error(d.responseText);L.error("session client call failed");c.setCacheHanaClient(null);sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED.reject();};var i=sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED||q.Deferred();var j=c.getCacheHanaClient();if(j!==undefined){e=j;sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED.resolve(e);}else if(sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED){return sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED.promise();}else{sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED=i;q.ajax({type:"GET",async:false,dataType:"json",url:"/sap/hba/r/sb/core/logic/GetSessionClient.xsjs",success:f,error:h});}return sap.ushell.components.tiles.indicatorTileUtils.util.HANA_CLIENT_DEFERRED.promise();},abortPendingODataCalls:function(d){try{if(d){d.abort();}}catch(e){this.logError(e);}}};})(window,q);sap.ushell.components.tiles.indicatorTileUtils.cache=(function(){var B={};var K={};var s="HANA_CLIENT";return{getCacheHanaClient:function(){return B[s];},setCacheHanaClient:function(d){B[s]=d;},getEvaluationByChipId:function(k){if(B[k]){return B[k];}return null;},getEvaluationById:function(k){return this.getEvaluationByChipId(k);},setEvaluationById:function(k,d){B[k]=d;},getFrontEndCacheDeferredObject:function(k){if(B[k]){return B[k];}return null;},setFrontEndCacheDefferedObject:function(k,d){B[k]=d;},getKpivalueById:function(k){if(K[k]){return K[k];}return null;},setKpivalueById:function(k,d){K[k]=d;}};})();return{};},true);
