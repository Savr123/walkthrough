/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['./ConditionType','sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/ValidateException','sap/base/util/merge'],function(C,S,F,P,V,m){"use strict";var a=S.extend("sap.ui.mdc.base.type.ConditionsType",{constructor:function(f,o){S.apply(this,arguments);this.sName="Conditions";f=_(f);this._oConditionType=new C(f,this.oConstraints);}});a.prototype.destroy=function(){S.prototype.destroy.apply(this,arguments);if(this._oConditionType){this._oConditionType.destroy();this._oConditionType=undefined;}};a.prototype.setFormatOptions=function(f){S.prototype.setFormatOptions.apply(this,arguments);f=_(f);if(this._oConditionType){this._oConditionType.setFormatOptions(f);}};function _(f){f=m({},f);if(f.asyncParsing){delete f.asyncParsing;}return f;}a.prototype.setConstraints=function(o){S.prototype.setConstraints.apply(this,arguments);if(this._oConditionType){this._oConditionType.setConstraints(this.oConstraints);}};a.prototype.formatValue=function(e,I){if(e==undefined||e==null){return null;}if(!Array.isArray(e)){throw new F("No valid conditions provided");}var v;if(!I||I==="string"||I==="any"){v="";}else if(I==="float"||I==="int"){v=0;}var M=d.call(this);var f=[];var p=false;var i=0;for(i=0;i<e.length;i++){var o=e[i];var g=this._oConditionType.formatValue(o,I);f.push(g);if(g instanceof Promise){p=true;}if(M>0&&i>=M-1){break;}}if(p){return Promise.all(f).then(function(f){return b(f,v);});}return b(f,v);};function b(f,v){for(var i=0;i<f.length;i++){if(v){v=v+"; "+f[i];}else{v=f[i];}}return v;}a.prototype.parseValue=function(v,i){if(d.call(this)!==1){throw new P("Only one condition supported for parsing");}var o=this._oConditionType.parseValue(v,i);if(o instanceof Promise){var p=o.then(function(o){return c.call(this,o);}.bind(this));if(this.oFormatOptions.asyncParsing){this.oFormatOptions.asyncParsing(p);}return p;}else{return c.call(this,o);}};function c(o){var I=this.oFormatOptions.isUnit;if(I){var u=o&&o.values[0][1];var e=this.oFormatOptions.getConditions();for(var i=0;i<e.length;i++){e[i].values[0][1]=u;if(e[i].operator==="BT"){e[i].values[1][1]=u;}}if(e.length===0){e.push(o);}return e;}else if(o){return[o];}else{return[];}}a.prototype.validateValue=function(e){if(e===undefined||e===null){return;}if(!Array.isArray(e)){throw new V("No valid conditions provided");}for(var i=0;i<e.length;i++){var o=e[i];this._oConditionType.validateValue(o);}if(e.length===0){this._oConditionType.validateValue(null);}};function d(){var M=1;if(this.oFormatOptions.hasOwnProperty("maxConditions")){M=this.oFormatOptions.maxConditions;}return M;}return a;});
