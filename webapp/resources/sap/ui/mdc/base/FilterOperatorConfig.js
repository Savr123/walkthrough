/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
*/
sap.ui.define(["sap/ui/base/Object","sap/ui/model/FilterOperator","sap/ui/model/Filter","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/base/Log","sap/base/util/ObjectPath","sap/base/util/merge","./Condition"],function(B,M,F,P,V,L,O,m,C){"use strict";var a=B.extend("sap.ui.mdc.base.FilterOperatorConfig",{constructor:function(){B.apply(this);this.mOperators=m({},a._mOperators);this.mTypes=m({},a._mTypes);this.mOpsForType=m({},a._mOpsForType);}});sap.ui.model.type.String.extend("sap.ui.model.type.Key",{});a._mTypes={"base":undefined,"string":"base","numeric":"base","date":"base","datetime":"base","time":"base","boolean":"base","int":"numeric","float":"numeric","sap.ui.model.type.Boolean":"boolean","sap.ui.model.type.Date":"date","sap.ui.model.type.FileSize":"string","sap.ui.model.type.Float":"float","sap.ui.model.type.Integer":"int","sap.ui.model.type.String":"string","sap.ui.model.type.Time":"time","sap.ui.model.type.Unit":"numeric","sap.ui.model.type.Currency":"numeric","sap.ui.model.odata.type.Boolean":"boolean","sap.ui.model.odata.type.Byte":"int","sap.ui.model.odata.type.Date":"date","sap.ui.model.odata.type.DateTime":"datetime","sap.ui.model.odata.type.DateTimeOffset":"datetime","sap.ui.model.odata.type.Decimal":"float","sap.ui.model.odata.type.Double":"float","sap.ui.model.odata.type.Single":"float","sap.ui.model.odata.type.Guid":"string","sap.ui.model.odata.type.Int16":"int","sap.ui.model.odata.type.Int32":"int","sap.ui.model.odata.type.Int64":"int","sap.ui.model.odata.type.Raw":"string","sap.ui.model.odata.type.SByte":"int","sap.ui.model.odata.type.String":"string","sap.ui.model.odata.type.Time":"time","sap.ui.model.odata.type.TimeOfDay":"time","sap.ui.model.odata.type.Unit":"numeric","sap.ui.model.odata.type.Currency":"numeric","Edm.Boolean":"sap.ui.model.odata.type.Boolean","Edm.Byte":"sap.ui.model.odata.type.Byte","Edm.Date":"sap.ui.model.odata.type.Date","Edm.DateTime":"sap.ui.model.odata.type.DateTime","Edm.DateTimeOffset":"sap.ui.model.odata.type.DateTimeOffset","Edm.Decimal":"sap.ui.model.odata.type.Decimal","Edm.Double":"sap.ui.model.odata.type.Double","Edm.Single":"sap.ui.model.odata.type.Single","Edm.Guid":"sap.ui.model.odata.type.Guid","Edm.Int16":"sap.ui.model.odata.type.Int16","Edm.Int32":"sap.ui.model.odata.type.Int32","Edm.Int64":"sap.ui.model.odata.type.Int64","Edm.SByte":"sap.ui.model.odata.type.SByte","Edm.String":"sap.ui.model.odata.type.String","Edm.Time":"sap.ui.model.odata.type.Time","Edm.TimeOfDay":"sap.ui.model.odata.type.TimeOfDay"};Object.freeze(a._mTypes);a._mOpsForType={"base":{operators:["Contains","EQ","BT","StartsWith","EndsWith","LE","LT","GE","GT","NE"],defaultOperator:"EQ"},"string":{operators:["EEQ","Contains","EQ","BT","StartsWith","EndsWith","Empty","NotEmpty","LE","LT","GE","GT","NE"],defaultOperator:"Contains"},"date":{operators:["EQ","BT","LE","LT","GE","GT","NE"]},"datetime":{operators:["EQ","BT","LE","LT","GE","GT","NE"]},"numeric":{operators:["EQ","BT","LE","LT","GE","GT","NE"]},"time":{operators:["EQ","BT","LE","LT","GE","GT"]},"boolean":{operators:["EQ","NE"]}};Object.freeze(a._mOpsForType);a._mOperators={};var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");sap.ui.getCore().attachLocalizationChanged(function(){o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");});function g(K,T){var i=K+(T?"."+T:""),j;if(o.hasText(i)){j=o.getText(i);}else if(T){j=o.getText(K);}else{j=i;}return j;}a._mInstances={};a._mClasses={undefined:a};a.getFor=function(i){var K=i&&i.getId();var j=a._mInstances[K];if(!j){var l=i&&i.getMetadata();var n=a._mClasses[l&&l.getName()];while(!n){l=l.getParent();n=a._mClasses[l&&l.getName()];}j=new n();a._mInstances[K]=j;}return j;};a.registerFor=function(i,j){a._mClasses[i]=j;};a.prototype._getConfig=function(T,i){var j=this.mOpsForType[T];if(j){return j[i];}};a.prototype._findConfig=function(T,i){if(typeof T==="object"){T=T.getMetadata().getName();}var j;while(T&&!(j=this._getConfig(T,i))){T=this.getParentType(T);}return j;};a.prototype.getOperatorsForType=function(T){return this._findConfig(T,"operators")||[];};a.prototype.getDefaultOperator=function(T){return this._findConfig(T,"defaultOperator")||[];};a.prototype.getMatchingOperators=function(T,v){var i=this.getOperatorsForType(T);return this._getMatchingOperators(i,v);};a.prototype._getMatchingOperators=function(i,v){var r=[],j;i.some(function(l){j=this.getOperator(l);if(j&&j.test(v)){r.push(j);}}.bind(this));return r;};a.prototype.addType=function(T,i){if(this.mTypes[T]){throw new Error("Type already exists: "+T);}else{this.mTypes[T]=i;}};a.prototype.getParentType=function(T){return this.mTypes[T];};a.prototype.addOperatorsToType=function(T,v){var i=T;if(typeof i==="object"){i=i.getMetadata().getName();}var j=this.getOperatorsForType(T);if(!(typeof v==="string")){j=j.concat(v);}else{j.push(v);}this.mOpsForType[i]=this.mOpsForType[i]||{};this.mOpsForType[i].operators=j;};a.prototype.addOperator=function(i){a._addOperatorTo(i,this.mOperators);};a._addOperatorTo=function(i,j){var l=j;if(!i.name){L.warning("Operator configuration expects a name property");}if(!i.filterOperator&&!i.getModelFilter){L.error("Operator configuration for "+i.name+" needs a default filter operator from sap.ui.model.FilterOperator or the function getModelFilter");return;}if(!D){if(l[i.name]&&!l[i.name].custom){L.warning("Duplicate Type Configuration: "+i.name+". A default type cannot be extended or overwritten.");return;}i.custom=true;}else{L.debug("Operator Configuration for "+i.name+" defined as default configuration");}i=e(i);if(D){}j[i.name]=i;};function e(j){var i;var T=j.textKey||"operators."+j.name;j.longText=j.longText||g(T+".longText")||"";j.tokenText=j.tokenText||g(T+".tokenText")||"";if(j.tokenParse){if(j.tokenText){j.tokenParse=j.tokenParse.replace(/#tokenText#/g,j.tokenText);var l=j.valueTypes.length;for(i=0;i<l;i++){var r=j.paramTypes?j.paramTypes[i]:j.valueTypes[i];j.tokenParse=j.tokenParse.replace(new RegExp("\\$"+i,"g"),r);}j.tokenParseRegExp=new RegExp(j.tokenParse,"i");}}else if(j.tokenText){j.tokenParseRegExp=new RegExp(j.tokenText,"i");}if(j.tokenFormat){if(j.tokenText){j.tokenFormat=j.tokenFormat.replace(/\#tokenText\#/g,j.tokenText);}}else if(j.tokenText){j.tokenFormat=j.tokenText;}j.format=j.format||f.bind(j);j.parse=j.parse||p.bind(j);j.validate=j.validate||d.bind(j);j.test=j.test||t.bind(j);j.getCondition=j.getCondition||k.bind(j);j.getModelFilter=j.getModelFilter||b.bind(j);j._setOwner=s.bind(j);j.getTypeText=g.bind(j);j._createLocalType=h.bind(j);j.isEmpty=j.isEmpty||_.bind(j);j.createControl=j.createControl;return j;}function s(i){this.oFilterOperatorConfig=i;return this;}function b(i,j){var l=this.oFilterOperatorConfig.getOperator(i.operator);var v=i.values[0];var n;var q;var r=j.split(",");if(Array.isArray(v)&&r.length>1){v=v[0];j=r[0];q=new F({path:r[1],operator:"EQ",value1:i.values[0][1]});}if(q&&v===undefined){n=q;q=undefined;}else if(l.valueTypes.length==1){n=new F({path:j,operator:l.filterOperator,value1:v});}else{var u=i.values[1];if(Array.isArray(u)&&r.length>1){u=u[0];}n=new F({path:j,operator:l.filterOperator,value1:v,value2:u});}if(q){n=new F({filters:[n,q],and:true});}return n;}function _(j,T){var l=false;for(var i=0;i<this.valueTypes.length;i++){var v=j.values[i];if(v===null||v===undefined||v===""){l=true;break;}}return l;}function f(j,l,T){var n=this.tokenFormat,q=this.valueTypes.length;for(var i=0;i<q;i++){var v=j[i]!==undefined&&j[i]!==null?j[i]:"";if(this.valueTypes[i]!=="self"){T=this._createLocalType(this.valueTypes[i]);}var r=T?T.formatValue(v,"string"):v;n=n.replace(new RegExp("\\$"+i,"g"),r);}return n;}function p(T,j){var l=T.match(this.tokenParseRegExp);var r;if(l){r=[];for(var i=0;i<this.valueTypes.length;i++){if(this.valueTypes[i]!=="self"){j=this._createLocalType(this.valueTypes[i]);}try{var v=l[i+1];var n=c.call(this,v,j);r.push(n);}catch(q){L.warning(q.message);throw q;}}}return r;}function c(v,T){if(v===undefined){return v;}var i;if(T instanceof sap.ui.model.CompositeType&&T._aCurrentValue&&T.getParseWithValues()){i=T._aCurrentValue;}var l=T?T.parseValue(v,"string",i):v;if(i&&Array.isArray(l)){for(var j=0;j<l.length;j++){if(l[j]===undefined){l[j]=i[j];}}}return l;}function d(v,T){var j=this.valueTypes.length;for(var i=0;i<j;i++){var l=v[i]!==undefined&&v[i]!==null?v[i]:"";if(this.valueTypes[i]){if(this.valueTypes[i]!=="self"){T=this._createLocalType(this.valueTypes[i]);}if(T){T.validateValue(l);}}}}function h(T){if(!this._oType){sap.ui.requireSync(T.replace(/\./g,"/"));var i=O.get(T||"");this._oType=new i();}return this._oType;}function t(T){var i=this.tokenParseRegExp.test(T);return i;}function k(T,i,j){if(this.test(T)){var v=this.parse(T,i,j);if(v.length==this.valueTypes.length){return C.createCondition(this.name,v);}else{throw new P("Parsed value don't meet operator");}}return null;}a.prototype.getOperator=function(i){var j=this.mOperators[i];return j?j._setOwner(this):undefined;};var D=true;a._addOperatorTo({name:"EEQ",showInSuggest:false,filterOperator:M.EQ,tokenParse:"^==([\\s\\S]*)$",tokenFormat:"$1 ($0)",valueTypes:["self",null],longText:"EEQ",displayFormats:{DescriptionValue:"$1 ($0)",ValueDescription:"$0 ($1)",Description:"$1",Value:"$0"},format:function(v,j,T,l){l=l||"DescriptionValue";var n=this.valueTypes.length,q=this.displayFormats[l];if(!v[1]){q=this.displayFormats["Value"];n=1;}for(var i=0;i<n;i++){var r,u=v[i]||"";if(i==0&&T&&(typeof T.formatValue==="function")){r=T.formatValue(u,"string");}else{r=u;}q=r==null?null:q.replace(new RegExp("\\$"+i,"g"),r);}return q;},parse:function(T,i,j){j=j||"DescriptionValue";var l=T.match(this.tokenParseRegExp);var r;if(l){try{var v=l[1];r=this.splitText(v,j);if(r.length>0){r[0]=c.call(this,r[0],i);}}catch(n){L.warning(n.message);throw n;}}return r;},splitText:function(T,i){i=i||"DescriptionValue";var j=this.displayFormats[i];var K=j.indexOf("$0");var l=j.indexOf("$1");var n;var q;if(K>=0&&l>=0){if(T.indexOf("(")>0){var E=T.length;if(T[E-1]===")"){E--;}var r=T.substring(0,T.lastIndexOf("("));if(r[r.length-1]===" "){r=r.substring(0,r.length-1);}var u=T.substring(T.lastIndexOf("(")+1,E);if(K<l){n=r;q=u;}else{n=u;q=r;}}else if(K<l){n=T;}else{q=T;}}else if(K>=0){n=T;}else{q=T;}return[n,q];}},a._mOperators);a._addOperatorTo({name:"EQ",filterOperator:M.EQ,tokenParse:"^=([^=].*)$",tokenFormat:"=$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"BT",filterOperator:M.BT,tokenParse:"^(.+)\\.\\.\\.(.+)$",tokenFormat:"$0...$1",valueTypes:["self","self"],validate:function(v,T){if(v.length<2){throw new V("Between must have two values");}if(v[0]===v[1]){throw new V("Between must have two different values");}d.call(this,v,T);}},a._mOperators);a._addOperatorTo({name:"LT",filterOperator:M.LT,tokenParse:"^<(.*)$",tokenFormat:"<$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"GT",filterOperator:M.GT,tokenParse:"^>(.*)$",tokenFormat:">$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"LE",filterOperator:M.LE,tokenParse:"^<=(.*)$",tokenFormat:"<=$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"GE",filterOperator:M.GE,tokenParse:"^>=(.*)$",tokenFormat:">=$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"StartsWith",filterOperator:M.StartsWith,tokenParse:"^([^\*].*)\\*$",tokenFormat:"$0*",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"EndsWith",filterOperator:M.EndsWith,tokenParse:"^\\*(.*[^\*])$",tokenFormat:"*$0",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"Contains",filterOperator:M.Contains,tokenParse:"^\\*(.*)\\*$",tokenFormat:"*$0*",valueTypes:["self"]},a._mOperators);a._addOperatorTo({name:"NE",filterOperator:M.NE,tokenParse:"^!=(.+)$",tokenFormat:"!=$0",valueTypes:["self"],exclude:true},a._mOperators);a._addOperatorTo({name:"Empty",filterOperator:M.EQ,tokenParse:"^<#tokenText#>$",tokenFormat:"<#tokenText#>",valueTypes:[],getModelFilter:function(i,j){var l=this.oFilterOperatorConfig.getOperator(i.operator);return new F({path:j,operator:l.filterOperator,value1:""});}},a._mOperators);a._addOperatorTo({name:"NotEmpty",filterOperator:M.NE,tokenParse:"^!\\(<empty>\\)$",tokenFormat:"!(<empty>)",valueTypes:[],getModelFilter:function(i,j){var l=this.oFilterOperatorConfig.getOperator(i.operator);return new F({path:j,operator:l.filterOperator,value1:""});}},a._mOperators);D=false;Object.freeze(a._mOperators);return a;},true);
