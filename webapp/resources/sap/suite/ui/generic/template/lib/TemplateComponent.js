sap.ui.define(["sap/ui/core/CustomizingConfiguration","sap/ui/core/library","sap/ui/core/Component","sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/ui/Device","sap/suite/ui/generic/template/lib/reuseComponentHelper","sap/ui/core/CustomData","sap/suite/ui/generic/template/lib/StableIdDefinition","sap/suite/ui/generic/template/js/StableIdHelper","sap/base/Log","sap/suite/ui/generic/template/js/AnnotationHelper","sap/ushell/Config"],function(C,c,a,U,J,R,D,r,b,S,d,L,A,e){"use strict";var V=c.mvc.ViewType;var s=e.last("/core/shell");var E=true;if(s.enableFiori3===false){E=s.enableFiori3;}function g(O){var i=O&&typeof O==="string"?O:(O&&a.getOwnerIdFor(O));var v=i&&sap.ui.component(i);if(v instanceof T){v=v.getAppComponent();}return v;}var G=C.getViewExtension;C.getViewExtension=function(v,i,O){var w=g(O),x=w&&w.getId(),y=G.call(C,v,i,x);return y;};var f=C.getControllerExtension;C.getControllerExtension=function(i,O){var v=g(O),w=v&&v.getId(),x=f.call(C,i,w);return x;};function h(v){var I=new R({bundleName:"sap/suite/ui/generic/template/lib/i18n/i18n"});var w=[];var M=v.getAppComponent().getModel("i18n|"+v.getMetadata().getComponentName()+"|"+v.getEntitySet());if(M){w.push(M);}var x=v.getModel("i18n");if(x){w.push(x);}var y=v.getModel("@i18n");if(y){w.push(y);}var z=true;for(var B="i18n";z;){B=B+"||Parent";z=v.getModel(B);if(z){w.push(z);}}for(var i=w.length-1;i>=0;i--){I.enhance(w[i].getResourceBundle());}v.setModel(I,"i18n");}function j(i,M){var v=i.getAppComponent().getManifestEntry("sap.ui5");var w=v.extends&&v.extends.extensions&&v.extends.extensions["sap.ui.controllerExtensions"];var x=i.getTemplateName();var y=w&&w[x]&&w[x]["sap.ui.generic.app"];var z=i.getEntitySet();var B=y&&y[z]&&y[z].Actions;var F={};var H=k(i);if(B){if(H){l(F,B,H);}else{m(F,B);}}else{var I=y&&y[z]&&y[z]["Sections"];for(var K in I){B=I[K]["Actions"];if(B){m(F,B);}}}i.getModel("_templPriv").setProperty("/generic/listCommons/breakoutActionsEnabled",F);}function k(i){var v;var w=i.getAppComponent().getConfig();var x=w&&w.pages[0]&&w.pages[0].component&&w.pages[0].component.settings;if(x&&x.quickVariantSelectionX){v=x.quickVariantSelectionX.variants;}return v;}function l(B,v,w){var x;for(var y in v){x=true;if(v[y].requiresSelection){x=false;}for(var i in w){var z=v[y].id;var F=w[i];var H=A.getSuffixFromIconTabFilterKey(F);if(H){z=z.concat(H);}B[z]={enabled:x};}}}function m(B,i){var v;for(var w in i){v=true;if(i[w].requiresSelection){v=false;}B[i[w].id]={enabled:v};}}function n(i){if(i.getAppComponent().getMetadata().getComponentName()===""||i.getTemplateName()===""||i.getEntitySet()===""){}return i.getAppComponent().getMetadata().getComponentName()+"::"+i.getTemplateName()+"::"+i.getEntitySet();}function o(i,v,M,w){var x=v.oComponent;var y=x.getAppComponent();var z=v.oTemplateContract.mRoutingTree[v.route];var B=x.getEntitySet();var F=v.utils.isDraftEnabled();var H=null;var I=x.getComponentContainer().getSettings();H=jQuery.extend({},I);delete H.appComponent;delete H.entitySet;delete H.navigationProperty;H.subPages=v.routeConfig.pages;H.routeConfig=v.routeConfig;return new J({entitySet:B,entityType:i,treeNode:z,routingSpec:v.routingSpec,"sap-ui-debug":window["sap-ui-debug"],isDraftEnabled:F,settings:H,manifest:y.getInternalManifest(),metaModel:M,templateSpecific:w&&w(),appComponentName:x.getAppComponent().getMetadata().getComponentName(),stableId:{definition:S,aParameter:[],getStableId:d.getStableId},isFiori3Enabled:E,variables:[]});}function p(i,v){var w=i.oComponent,x=i.createViewController,y=i.methods&&i.methods.getTemplateSpecificParameters,M=w.getModel(),z,B,F,H,I,N=i.routingSpec&&i.routingSpec.noOData;if(N){z=new J({entitySet:{},entityType:{}});H=z.createBindingContext("/entitySet");I=z.createBindingContext("/entityType");}else{z=M&&M.getMetaModel();B=M&&w.getEntitySet();var K=B&&z.getODataEntitySet(B);F=K&&K.entityType;if(!F){return{loaded:function(){return Promise.reject(new Error("Unknown entityset "+B));}};}H=z.createBindingContext(z.getODataEntitySet(B,true));I=z.createBindingContext(z.getODataEntityType(F,true));}h(w);j(w,M);var O=n(w);var Q=sap.ui.getCore().byId(O);if(Q){L.warning("View with ID: "+O+" already exists - old view is getting destroyed now!");try{Q.destroy();}catch(W){L.warning("Error destroying view: "+W);}Q=null;}var X=new J(D);X.setDefaultBindingMode("OneWay");i.oParameterModel=o(F,i,z,y);w.runAsOwner(function(){var Y=i.preprocessorsData;var Z={async:true,preprocessors:{xml:{bindingContexts:{entitySet:H,entityType:I},models:{device:X,entitySet:z,entityType:z,parameter:i.oParameterModel},preprocessorsData:Y}},id:O,type:V.XML,viewName:w.getTemplateName(),height:"100%",cache:{keys:v,additionalData:[Y]}};if(w.getDesigntimePath||w.getFlexibilityPath){var $={key:"sap-ui-custom-settings",value:{}};if(w.getDesigntimePath){$.value["sap.ui.dt"]={"designtime":w.getDesigntimePath()};}if(w.getFlexibilityPath){$.value["sap.ui.fl"]={"flexibility":w.getFlexibilityPath()};}Z.customData=[new b($)];}Z.controller=x();Q=sap.ui.view(Z);});return Q;}function q(i,v,w){var x=i.oController.extensionAPI;var y=jQuery.extend({},x);if(x.getNavigationController){var N=jQuery.extend({},x.getNavigationController());var z=N.navigateInternal;N.navigateInternal=function(B,F){var H=F&&F.routeName;if(H){i.utils.navigateRoute(H,B,v,F&&F.replaceInHistory);}else{z(B,F);}};y.getNavigationController=function(){return N;};}y.getCommunicationObject=function(B){return B===1?w.communicationObject:i.utils.getCommunicationObject(B);};(i.methods.enhanceExtensionAPI4Reuse||jQuery.noop)(y,w);return y;}function P(i,v,w,x,y){x.extensionAPI=q(i,w,x);r.transferEmbeddedComponentProxy(i,v,w,x,y);var z=i.oController.byId(x.containerId);var B=z&&z.getSettings();var F=y.getMetadata().getAllProperties();for(var H in B){if((H==="uiMode"||H==="semanticObject"||H.startsWith("st"))&&!F[H]){delete B[H];}}y.applySettings(B);z.setComponent(y);}function t(i,v,w){return w.componentUsage?i.createComponent({usage:w.componentUsage,id:v}):i.runAsOwner(function(){return a.create({name:w.componentName,id:v});});}function u(i){i.reuseComponentsReady=new Promise(function(v,w){var x=Object.create(null);var y=v.bind(null,x);if(i.viewLevel>0){var z=i.oTemplateContract.mEntityTree[i.routeConfig.entitySet];if(z){var B=function(F,H){L.error("Failed to load reuse component for key "+F,H instanceof Error?H.message:"","sap.suite.ui.generic.template.lib.TemplateComponent");};i.viewRegistered.then(function(){var F=[];for(var H in z.embeddedComponents){var I=z.embeddedComponents[H];var K=I.sectionId&&i.oController.byId(I.sectionId);if(K&&K.getStashed()){delete z.embeddedComponents[H];}else{var M=i.oController.createId(I.containerId+"Content");var N=t(i.oAppComponent,M,I);F.push(N);N.catch(B.bind(null,H));N.then(P.bind(null,i,x,H,I));i.oTemplateContract.oBusyHelper.setBusy(N);}}Promise.all(F).then(y,function(O){var Q=i.oAppComponent.getNavigationController();Q.navigateToMessagePage({text:i.oTemplateContract.getText("ST_ERROR"),description:O instanceof Error?O.message:""});w();});});return;}}y();});}var T=U.extend("sap.suite.ui.generic.template.lib.TemplateComponent",{metadata:{properties:{templateName:{type:"string",defaultValue:null},entitySet:{type:"string",defaultValue:null},navigationProperty:{type:"string",defaultValue:null},appComponent:{type:"object",defaultValue:null},isRefreshRequired:{type:"boolean",defaultValue:false},isLeaf:{type:"boolean"}},library:"sap.suite.ui.generic.template"},init:function(){(U.prototype.init||jQuery.noop).apply(this);var i=new J({editable:false,enabled:false,bEnableFiori3:E});this.setModel(i,"ui");var v=this.getComponentData();var w=v.registryEntry;var x=Object.create(null);var y=(w.routeConfig&&w.routeConfig.embeddedComponents)||{};for(var K in y){var z=y[K];var B={hidden:!!z.hiddenByDefault};x[K]=B;}var F=new J({generic:{isActive:false,listCommons:{},viewLevel:w.viewLevel,controlProperties:{},supportedIntents:{},embeddedComponents:x}});F.setDefaultBindingMode("TwoWay");this.setModel(F,"_templPriv");u(w);},getManifestEntry:function(K){var v=U.prototype.getManifestEntry.apply(this,arguments);if(/^\/sap\.ui5\/componentUsages(\/.+)?$/.test(K)){v=jQuery.extend(true,{},v,U.prototype.getManifestEntry.apply(this.getAppComponent(),arguments));}return v;},getComponentContainer:function(){return this.oContainer;},onBeforeRendering:function(v){if(v){var w=v.oComponent.getComponentContainer();var M=!v.createViewStarted&&w&&w.getModel();if(M){M.getMetaModel().loaded().then(function(){if(!v.createViewStarted){var x=[];var y=M.metadataLoaded().then(function(i){var B;if(i&&i.lastModified){B=new Date(i.lastModified).getTime()+"";}else{L.error("TemplateComponent: no valid cache key segment last modification date provided by the OData Model");B=new Date().getTime()+"";}return B;});x.push(y);var z=M.annotationsLoaded().then(function(B){var F=0;if(B){for(var i=0;i<B.length;i++){if(B[i].lastModified){var H=new Date(B[i].lastModified).getTime();if(H>F){F=H;}}else{L.error("TemplateComponent: no valid cache key segment last modification date provided by OData annotations");F=new Date().getTime()+"";}}}if(F===0){L.error("TemplateComponent: no valid cache key segment last modification date provided by OData annotations");F=new Date().getTime();}return F+"";});x.push(z);v.createViewStarted=true;p(v,x).loaded().then(function(i){v.oComponent.setAggregation("rootControl",i);v.fnViewRegisteredResolve();w.invalidate();},function(i){v.fnViewRegisteredResolve(i||{});});}});}}},getRouter:function(){if(this.getAppComponent()){return this.getAppComponent().getRouter();}return U.prototype.getRouter.apply(this,arguments);}});return T;});
