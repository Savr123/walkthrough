/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/fl/Utils","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/Change","sap/ui/fl/changeHandler/Base","sap/ui/core/BusyIndicator","sap/ui/fl/variants/util/URLHandler","sap/base/util/merge","sap/base/util/includes","sap/base/util/ObjectPath"],function(J,U,a,C,B,b,c,f,i,O){"use strict";var r=function(){var v=Object.keys(this.oData);v.forEach(function(s){var p={variantManagementReference:s,currentVariantReference:this.oData[s].currentVariant||this.oData[s].defaultVariant,newVariantReference:true};var m=this.oChangePersistence.loadSwitchChangesMapForComponent(p);this._oVariantSwitchPromise=this._oVariantSwitchPromise.then(this.oFlexController.revertChangesOnControl.bind(this.oFlexController,m.changesToBeReverted,this.oAppComponent)).then(function(){delete this.oData[s];delete this.oVariantController.getChangeFileContent()[s];this._ensureStandardVariantExists(s);}.bind(this));}.bind(this));c.initialize.call(this);this.updateEntry({parameters:[],updateHashEntry:true});return this._oVariantSwitchPromise;};var V=J.extend("sap.ui.fl.variants.VariantModel",{constructor:function(d,F,A,o){this.pSequentialImportCompleted=Promise.resolve();J.apply(this,arguments);this.bObserve=o;if(!F){F=sap.ui.requireSync("sap/ui/fl/FlexControllerFactory").createForControl(A);}this.oFlexController=F;this.oChangePersistence=this.oFlexController._oChangePersistence;this.oVariantController=this.oChangePersistence._oVariantController;this.sVariantTechnicalParameterName=this.oVariantController.sVariantTechnicalParameterName;this.oAppComponent=A;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");this._oVariantSwitchPromise=Promise.resolve();this.oVariantController.assignResetMapListener(r.bind(this));c.initialize.call(this);if(d&&typeof d==="object"){Object.keys(d).forEach(function(k){d[k].variants.forEach(function(v){if(!d[k].currentVariant&&(v.key===d[k].defaultVariant)){d[k].currentVariant=v.key;}v.originalTitle=v.title;v.originalFavorite=v.favorite;v.originalVisible=v.visible;});d[k].originalCurrentVariant=d[k].currentVariant;d[k].originalDefaultVariant=d[k].defaultVariant;});this.setData(d);}}});V.prototype.updateCurrentVariant=function(v,n,A){var s;var m;s=this.oData[v].originalCurrentVariant;var p={variantManagementReference:v,currentVariantReference:s,newVariantReference:n};m=this.oChangePersistence.loadSwitchChangesMapForComponent(p);var S=function(){var P={};P.promise=new Promise(function(d){P.resolveFunction=d;});this.oFlexController.setVariantSwitchPromise(P.promise);this.oFlexController.revertChangesOnControl(m.changesToBeReverted,A||this.oAppComponent).then(this.oFlexController.applyVariantChanges.bind(this.oFlexController,m.changesToBeApplied,A||this.oAppComponent)).then(function(){this.oData[v].originalCurrentVariant=n;this.oData[v].currentVariant=n;if(this.oData[v].updateVariantInURL){this._updateVariantInURL(v,n);this.oVariantController.updateCurrentVariantInMap(v,n);}this.checkUpdate();P.resolveFunction();}.bind(this)).catch(function(e){P.resolveFunction();throw e;});return P.promise;}.bind(this);this._oVariantSwitchPromise=this._oVariantSwitchPromise.then(S);return this._oVariantSwitchPromise;};V.prototype._updateVariantInURL=function(v,n){var t=this.getVariantIndexInURL(v);if(!t.parameters){return;}var p=Array.isArray(t.parameters[this.sVariantTechnicalParameterName])?t.parameters[this.sVariantTechnicalParameterName].slice(0):[];var I=t.index;if(n===this.oData[v].defaultVariant){if(I===-1){return;}p.splice(I,1);}else{I===-1?p.push(n):(p[I]=n);}this.updateEntry({parameters:p,updateURL:!this._bDesignTimeMode,updateHashEntry:true});};V.prototype.updateEntry=function(){c.update.apply(this,arguments);};V.prototype.getVariantIndexInURL=function(v){var R={index:-1};var u=U.getParsedURLHash().params;if(u){R.parameters={};if(this._bDesignTimeMode){u[this.sVariantTechnicalParameterName]=c.getCurrentHashParamsFromRegister.call(this);}if(Array.isArray(u[this.sVariantTechnicalParameterName])){R.parameters[this.sVariantTechnicalParameterName]=u[this.sVariantTechnicalParameterName].map(decodeURIComponent);R.parameters[this.sVariantTechnicalParameterName].some(function(p,I){if(this.oVariantController.getVariant(v,p)){R.index=I;return true;}}.bind(this));}}return R;};V.prototype.getCurrentVariantReference=function(v){return this.oData[v].currentVariant;};V.prototype.getVariantManagementReference=function(v){var s="";var I=-1;Object.keys(this.oData).some(function(k){return this.oData[k].variants.some(function(o,d){if(o.key===v){s=k;I=d;return true;}});}.bind(this));return{variantManagementReference:s,variantIndex:I};};V.prototype.getVariant=function(v,s){return this.oVariantController.getVariant(s||this.getVariantManagementReference(v).variantManagementReference,v);};V.prototype.getVariantProperty=function(v,p){return this.getVariant(v).content.content[p];};V.prototype.addChange=function(o){var v=o.getVariantReference();var s=this.getVariantManagementReference(v).variantManagementReference;this.oData[s].modified=!!this.oData[s].variantsEditable;this.checkUpdate(true);return this.oVariantController.addChangeToVariant(o,s,v);};V.prototype.removeChange=function(o){var v=o.getVariantReference();var s=this.getVariantManagementReference(v).variantManagementReference;return this.oVariantController.removeChangeFromVariant(o,s,v);};V.prototype._removeDirtyChanges=function(v,s,d,A){var e=this._getDirtyChangesFromVariantChanges(v);e.forEach(function(o){this.oVariantController.removeChangeFromVariant(o,s,d);this.oFlexController.deleteChange(o,A);}.bind(this));};V.prototype._getVariantTitleCount=function(n,v){var d=this.getData();return d[v].variants.reduce(function(e,o){if(n.toLowerCase()===o.title.toLowerCase()&&o.visible){e++;}return e;},0);};V.prototype._duplicateVariant=function(p){var n=p.newVariantReference;var s=p.sourceVariantReference;var v=p.variantManagementReference;var S=this.getVariant(s);var d=this.oVariantController.getVariantChanges(v,s,true).map(function(h){return h.getDefinition();});var D={content:{},controlChanges:d,variantChanges:{}};var e=U.compareAgainstCurrentLayer(S.content.layer,!this._bDesignTimeMode?"USER":"");Object.keys(S.content).forEach(function(k){if(k==="fileName"){D.content[k]=n;}else if(k==="variantReference"){if(e===0){D.content[k]=S.content["variantReference"];}else if(e===-1){D.content[k]=s;}}else if(k==="content"){D.content[k]=JSON.parse(JSON.stringify(S.content[k]));D.content.content.title=p.title;}else{D.content[k]=S.content[k];}});D.content["layer"]=p.layer;d=D.controlChanges.slice();var o={};var g;D.controlChanges=d.reduce(function(h,j){if(U.compareAgainstCurrentLayer(j.layer,!this._bDesignTimeMode?"USER":"")===0){o=f({},j);o.variantReference=D.content.fileName;if(!o.support){o.support={};}o.support.sourceChangeFileName=j.fileName;o.packageName="$TMP";g=C.createInitialFileContent(o);h.push(new C(g));}return h;}.bind(this),[]);return D;};V.prototype.copyVariant=function(p){var d=this._duplicateVariant(p);var v={key:d.content.fileName,layer:p.layer,title:d.content.content.title,originalTitle:d.content.content.title,favorite:true,originalFavorite:true,rename:true,change:true,remove:true,visible:true,originalVisible:true};var o=this.oFlexController.createVariant(d,p.appComponent);var e=[];[o].concat(o.getControlChanges()).forEach(function(g){e.push(this.oChangePersistence.addDirtyChange(g));}.bind(this));var I=this.oVariantController.addVariantToVariantManagement(f({},o.getDefinitionWithChanges(),{content:{content:{visible:v.visible,favorite:v.favorite}}}),p.variantManagementReference);this.oData[p.variantManagementReference].variants.splice(I,0,v);return this.updateCurrentVariant(p.variantManagementReference,o.getId(),p.appComponent).then(function(){return e;});};V.prototype.removeVariant=function(p){var d=this.oChangePersistence.getDirtyChanges().filter(function(o){return(o.getVariantReference&&o.getVariantReference()===p.variant.getId())||o.getId()===p.variant.getId();});return this.updateCurrentVariant(p.variantManagementReference,p.sourceVariantReference,p.component).then(function(){var I=this.oVariantController.removeVariantFromVariantManagement(p.variant,p.variantManagementReference);this.oData[p.variantManagementReference].variants.splice(I,1);this.checkUpdate();d.forEach(function(o){this.oChangePersistence.deleteChange(o);}.bind(this));}.bind(this));};V.prototype.collectModelChanges=function(v,l){var d=this.getData()[v];var m=d.variants;var e=[];var p={};m.forEach(function(o){if(o.originalTitle!==o.title){p={variantReference:o.key,changeType:"setTitle",title:o.title,originalTitle:o.originalTitle,layer:l};e.push(p);}if(o.originalFavorite!==o.favorite){p={variantReference:o.key,changeType:"setFavorite",favorite:o.favorite,originalFavorite:o.originalFavorite,layer:l};e.push(p);}if(!o.visible&&o.originalVisible){p={variantReference:o.key,changeType:"setVisible",visible:false,layer:l};e.push(p);}});if(d.originalDefaultVariant!==d.defaultVariant){p={variantManagementReference:v,changeType:"setDefault",defaultVariant:d.defaultVariant,originalDefaultVariant:d.originalDefaultVariant,layer:l};e.push(p);}return e;};V.prototype.manageVariants=function(v,s,l){return new Promise(function(d){v.attachEventOnce("manage",{resolve:d,variantManagementReference:s,layer:l},this.fnManageClickRta,this);v.openManagementDialog(true);}.bind(this));};V.prototype.setVariantProperties=function(v,p,A){var d=-1;var o;var e=null;var D=this.getData();if(p.variantReference){d=this.getVariantManagementReference(p.variantReference).variantIndex;o=D[v].variants[d];}var n={};var m={};switch(p.changeType){case"setTitle":m.title=p.title;o.title=p.title;o.originalTitle=o.title;break;case"setFavorite":m.favorite=p.favorite;o.favorite=p.favorite;o.originalFavorite=o.favorite;break;case"setVisible":m.visible=p.visible;m.createdByReset=false;o.visible=p.visible;o.originalVisible=o.visible;break;case"setDefault":m.defaultVariant=p.defaultVariant;D[v].defaultVariant=p.defaultVariant;D[v].originalDefaultVariant=D[v].defaultVariant;var h=c.getCurrentHashParamsFromRegister.call(this);if(h){if(D[v].defaultVariant!==D[v].currentVariant&&h.indexOf(D[v].currentVariant)===-1){this.updateEntry({parameters:h.concat(D[v].currentVariant),updateURL:!this._bDesignTimeMode,updateHashEntry:true});}else if(D[v].defaultVariant===D[v].currentVariant&&h.indexOf(D[v].currentVariant)>-1){h.splice(h.indexOf(D[v].currentVariant),1);this.updateEntry({parameters:h,updateURL:!this._bDesignTimeMode,updateHashEntry:true});}}break;default:break;}if(d>-1){var s=this.oVariantController._setVariantData(m,v,d);D[v].variants.splice(d,1);D[v].variants.splice(s,0,o);}else if(this.oVariantController._mVariantManagement[v]){this.oVariantController._mVariantManagement[v].defaultVariant=p.defaultVariant;}if(A===true){n.changeType=p.changeType;n.layer=p.layer;if(p.changeType==="setDefault"){n.fileType="ctrl_variant_management_change";n.selector=a.getSelector(v,p.appComponent);}else{if(p.changeType==="setTitle"){B.setTextInChange(n,"title",p.title,"XFLD");}n.fileType="ctrl_variant_change";n.selector=a.getSelector(p.variantReference,p.appComponent);}e=this.oFlexController.createBaseChange(n,p.appComponent);e.setContent(m);this.oVariantController._updateChangesForVariantManagementInMap(e.getDefinition(),v,true);this.oChangePersistence.addDirtyChange(e);}else{if(p.change){this.oVariantController._updateChangesForVariantManagementInMap(p.change.getDefinition(),v,false);this.oChangePersistence.deleteChange(p.change);}}this.setData(D);this.checkUpdate(true);return e;};V.prototype._ensureStandardVariantExists=function(v){var d=this.getData();if(!d[v]){d[v]={currentVariant:v,originalCurrentVariant:v,defaultVariant:v,originalDefaultVariant:v,variants:[{key:v,title:this._oResourceBundle.getText("STANDARD_VARIANT_TITLE"),originalTitle:this._oResourceBundle.getText("STANDARD_VARIANT_ORIGINAL_TITLE"),favorite:true,originalFavorite:true,visible:true,originalVisible:true}]};this.setData(d);if(this.oVariantController){var o={changes:{variantSection:{}}};var D={defaultVariant:v,variantManagementChanges:{},variants:[{content:{fileName:v,fileType:"ctrl_variant",variantManagementReference:v,variantReference:"",content:{title:this._oResourceBundle.getText("STANDARD_VARIANT_TITLE")}},controlChanges:[],variantChanges:{}}]};o.changes.variantSection[v]=D;this.oVariantController.setChangeFileContent(o,{});}}};V.prototype.setModelPropertiesForControl=function(v,d,o){var R=function(e,v,d){if((e.layer===U.getCurrentLayer(!d))&&(e.key!==v)){return true;}return false;};this.oData[v].modified=false;this.oData[v].showFavorites=true;if(this._bDesignTimeMode!==d){var p={};if(d){p={parameters:[],updateURL:true,updateHashEntry:false};}else if(this._bDesignTimeMode){p={parameters:c.getCurrentHashParamsFromRegister.call(this),updateURL:true,updateHashEntry:false};}this._bDesignTimeMode=d;this.updateEntry(p);}if(!(typeof this.fnManageClick==="function"&&typeof this.fnManageClickRta==="function")){this._initializeManageVariantsEvents();}o.detachManage(this.fnManageClick,this);if(d){this.oData[v].variantsEditable=false;this.oData[v].variants.forEach(function(e){e.rename=true;e.change=true;e.remove=R(e,v,d);});}else{if(this.oData[v]._isEditable){o.attachManage({variantManagementReference:v},this.fnManageClick,this);this.oData[v].variantsEditable=true;this.oData[v].variants.forEach(function(e){e.remove=R(e,v,d);if(e.layer===U.getCurrentLayer(true)){e.rename=true;e.change=true;}else{e.rename=false;e.change=false;}});}else{this.oData[v].variantsEditable=false;this.oData[v].variants.forEach(function(e){e.remove=false;e.rename=false;e.change=false;});}}};V.prototype._initializeManageVariantsEvents=function(){this.fnManageClickRta=function(e,d){var g=this.collectModelChanges(d.variantManagementReference,d.layer);d.resolve(g);};this.fnManageClick=function(e,d){if(!this.oFlexController||!this.oVariantController){return;}var g=this.collectModelChanges(d.variantManagementReference,U.getCurrentLayer(true));g.forEach(function(o){o.appComponent=this.oAppComponent;this.setVariantProperties(d.variantManagementReference,o,true);}.bind(this));this.oChangePersistence.saveDirtyChanges();};};V.prototype._handleCurrentVariantChange=function(e,o){var p=e.getSource();var v=p.getContext().getPath().replace(/^\//,'');if(O.get([v,"currentVariant"],this.oData)&&this.oData[v].currentVariant!==this.oData[v].originalCurrentVariant){var s=this.oData[v].originalCurrentVariant;this.updateCurrentVariant(v,p.getValue(),U.getAppComponentForControl(o)).then(function(){if(this.oData[v].modified){var S=this.oVariantController.getVariantChanges(v,s,true);this.oData[v].modified=false;this.checkUpdate(true);this._removeDirtyChanges(S,v,s,this.oAppComponent);}}.bind(this));}};V.prototype._handleSave=function(e){var v=e.getSource();var s=e.getParameter("def");var A=U.getAppComponentForControl(v);var d=this.getLocalId(v.getId(),A);var S=this.getCurrentVariantReference(d);var g=this.oVariantController.getVariantChanges(d,S,true);if(e.getParameter("overwrite")){return this.oFlexController.saveSequenceOfDirtyChanges(this._getDirtyChangesFromVariantChanges(g)).then(function(R){this.checkDirtyStateForControlModels([d]);return R;}.bind(this));}var n=U.createDefaultFileName();var p={variantManagementReference:d,appComponent:A,layer:U.getCurrentLayer(true),title:e.getParameter("name"),sourceVariantReference:S,newVariantReference:n};return this.copyVariant(p).then(function(h){if(s){var P={changeType:"setDefault",defaultVariant:n,originalDefaultVariant:this.oData[d].defaultVariant,appComponent:A,layer:U.getCurrentLayer(true),variantManagementReference:d};var o=this.setVariantProperties(d,P,true);h.push(o);}this.oData[d].modified=false;this.checkUpdate(true);return this.oFlexController.saveSequenceOfDirtyChanges(h);}.bind(this)).then(this._removeDirtyChanges.bind(this,g,d,S,p.appComponent));};V.prototype.getLocalId=function(I,A){return a.getSelector(I,A).id;};V.prototype.getVariantManagementReferenceForControl=function(v){var s=v.getId();var A=U.getAppComponentForControl(v);return(A&&A.getLocalId(s))||s;};V.prototype.switchToDefaultForVariantManagement=function(v){if(this.oData[v].currentVariant!==this.oData[v].defaultVariant){b.show(200);this.updateCurrentVariant(v,this.oData[v].defaultVariant).then(function(){b.hide();});}};V.prototype.switchToDefaultForVariant=function(v){Object.keys(this.oData).forEach(function(s){if(!v||this.oData[s].currentVariant===v){this.switchToDefaultForVariantManagement(s);}}.bind(this));};V.prototype.registerToModel=function(v){var s=this.getVariantManagementReferenceForControl(v);this._ensureStandardVariantExists(s);this.oData[s]._isEditable=v.getEditable();v.getTitle().getBinding("text").attachEvent("change",v,this._handleCurrentVariantChange,this);v.attachSave(this._handleSave,this);this.setModelPropertiesForControl(s,false,v);var u=v.getUpdateVariantInURL();this.oData[s].updateVariantInURL=u;c.attachHandlers.call(this,s,!!u);c.handleModelContextChange.call(this,v);};V.prototype._getDirtyChangesFromVariantChanges=function(d){var e=d.map(function(o){return o.getDefinition().fileName;});return this.oChangePersistence.getDirtyChanges().filter(function(o){return i(e,o.getId());});};V.prototype.checkDirtyStateForControlModels=function(v){v.forEach(function(s){var m=this.oData[s];if(m.modified===true){var d=this.getCurrentVariantReference(s);var e=this.oVariantController.getVariantChanges(s,d,true);var D=this._getDirtyChangesFromVariantChanges(e);if(D.length===0){m.modified=false;}}}.bind(this));this.checkUpdate(true);};V.prototype.getCurrentControlVariantIds=function(){return Object.keys(this.oData||{}).reduce(function(d,v){return d.concat([this.oData[v].currentVariant]);}.bind(this),[]);};return V;},true);
