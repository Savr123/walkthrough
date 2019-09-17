/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/core/XMLTemplateProcessor','sap/ui/core/util/XMLPreprocessor','sap/ui/core/Fragment','sap/fe/macros/ResourceModel','sap/base/Log'],function(X,a,F,R,L){"use strict";function _(s,S){var B=s.getBindingContext(),m=B.getModel().getMetaModel(),M=m.getMetaPath(B.getPath()),e=m.getObject(M)['$Type'],C=B,d;if(B.getBinding().getMetadata().getName()==='sap.ui.model.odata.v4.ODataListBinding'&&(S===e||!S)){return C;}C=b(s).getBindingContext();d=C.getBinding().getDependentBindings();return(d&&d[0].isPatchWithoutSideEffects()&&d[0].getBoundContext())||C;}function b(C){while(C&&!(C.getMetadata().getName()==="sap.ui.core.mvc.XMLView")){C=C.getParent();}return C;}var c={formatDraftOwnerText:function(h,d,D,s,e,i){var f='';if(h){var u=D||d||e||s;if(!i){f+=d?R.getText('draft.GENERIC_LOCKED_OBJECT_POPOVER_TEXT')+' ':R.getText('draft.LAST_CHANGE_USER_TEXT')+' ';}f+=u?R.getText('draft.OWNER',[u]):R.getText('draft.ANOTHER_USER');}return f;},formatDraftOwnerTextInline:function(h,d,D,s,e){return c.formatDraftOwnerText(h,d,s,D,e,true);},formatDraftOwnerTextInPopover:function(h,d,D,s,e){return c.formatDraftOwnerText(h,d,s,D,e,false);},onDraftLinkPressed:function(e,E){var t=this,s=e.getSource(),v=b(s),B=s.getBindingContext(),m=B.getModel().getMetaModel(),V=v.getId(),d;this.mDraftPopovers=this.mDraftPopovers||{};this.mDraftPopovers[V]=this.mDraftPopovers[V]||{};d=this.mDraftPopovers[V][E];if(d){d.setBindingContext(B);d.openBy(s);}else{var f='sap.fe.macros.field.DraftPopOverAdminData',p=X.loadTemplate(f,'fragment');Promise.resolve(a.process(p,{},{bindingContexts:{entitySet:m.createBindingContext("/"+E)},models:{entitySet:m}})).then(function(o){return F.load({definition:o,controller:t});}).then(function(P){d=t.mDraftPopovers[V][E]=P;d.setModel(R.getModel(),"i18n");v.addDependent(d);d.setBindingContext(B);d.openBy(s);});}},closeDraftAdminPopover:function(e){e.getSource().getParent().getParent().close();},prepareForSideEffects:function(f,s){var t=this,p=[],A=[],w=f.indexOf('#')>-1,S=(w&&f.split('#')[0])||f,q=(w&&f.split('#')[1])||'',d='/'+S+'@com.sap.vocabularies.Common.v1.SideEffects',B=s.getBindingContext(),m=B.getModel().getMetaModel(),C,e,P,Q,E,g,o,G=function(i){return i['$PropertyPath'];},h=function(i){return i['$NavigationPropertyPath'];};d=(w&&(d+'#'+q))||d;o=m.getObject(d);if(o&&t.aPendingSideEffects.indexOf(f)>-1){C=_(s,S);e=C.getPath();p=p.concat(o.TargetProperties||[]).concat(o.TargetEntities||[]);p.forEach(function(i){if(i['$PropertyPath']){var T=m.getObject('/'+S+'/'+i['$PropertyPath']+'@com.sap.vocabularies.Common.v1.Text');if(T&&T['$Path']){A.push({'$PropertyPath':T['$Path']});}}});p=p.concat(A);if(p.length){t.sideEffectsRequestsQueue=t.sideEffectsRequestsQueue||{};t.sideEffectsRequestsQueue[e]=t.sideEffectsRequestsQueue[e]||{};t.sideEffectsRequestsQueue[e]['context']=t.sideEffectsRequestsQueue[e]['context']||C;t.sideEffectsRequestsQueue[e]['pathExpressions']=t.sideEffectsRequestsQueue[e]['pathExpressions']||[];Q=t.sideEffectsRequestsQueue[e]['pathExpressions'].filter(G).map(G);g=t.sideEffectsRequestsQueue[e]['pathExpressions'].filter(h).map(h);P=p.map(G).filter(function(i){return i&&Q.indexOf(i)<0;}).map(function(i){return{'$PropertyPath':i};});E=p.map(h).filter(function(i){return i&&g.indexOf(i)<0;}).map(function(i){return{'$NavigationPropertyPath':i};});p=P.concat(E);t.sideEffectsRequestsQueue[e]['pathExpressions']=t.sideEffectsRequestsQueue[e]['pathExpressions'].concat(p);t.aPendingSideEffects.splice(t.aPendingSideEffects.indexOf(f),1);}}return Promise.resolve();},requestSideEffects:function(){if(!this.sideEffectsRequestsQueue){return;}var t=this;Object.keys(this.sideEffectsRequestsQueue).forEach(function(p){var s=t.sideEffectsRequestsQueue[p];s['context'].requestSideEffects(s['pathExpressions']).then(function(){},function(){L.info('FieldRuntime: Failed to request side effect - '+p,'sap.fe.macros.field.FieldRuntime','requestSideEffects');});});this.sideEffectsRequestsQueue=null;},requestTextIfRequired:function(s){var A=s.getBindingInfo('additionalValue');if(!A){return;}var p=A.parts.map(function(P){return{'$PropertyPath':P.path};}),C;if(p.length){C=_(s);C.requestSideEffects(p).then(function(){},function(){L.info('FieldRuntime: Failed to request Text association - '+(p[0]&&p[0]['$PropertyPath']),'sap.fe.macros.field.FieldRuntime','requestTextIfRequired');});}},handleChange:function(e){var t=this,s=e.getSource(),i=s&&s.getBindingContext().isTransient(),p=e.getParameter('promise')||Promise.resolve(),d=p,A=false;if(i){return;}this.aPendingSideEffects=this.aPendingSideEffects||[];this.mFieldGroupResolves=this.mFieldGroupResolves||{};p.then(function(){t.requestTextIfRequired(s);});if(s.getFieldGroupIds()){s.getFieldGroupIds().forEach(function(f){var I=f.indexOf('$$ImmediateRequest')>-1;if(I){A=true;f=f.substr(0,f.indexOf('$$ImmediateRequest'));}if(t.aPendingSideEffects.indexOf(f)===-1){t.aPendingSideEffects.push(f);}if(t.mFieldGroupResolves.hasOwnProperty(f)){t.mFieldGroupResolves[f].push(p);}else{t.mFieldGroupResolves[f]=[p];}if(I){d=d.then(function(){return t.prepareForSideEffects(f,s);});}});if(A){d.then(this.requestSideEffects.bind(this));}}},handleSideEffect:function(e){if(!this.aPendingSideEffects||this.aPendingSideEffects.length===0){return;}var t=this,f=e.getParameter('fieldGroupIds'),s=e.getSource(),p=Promise.resolve();f=f||[];this.mFieldGroupResolves=this.mFieldGroupResolves||{};f.forEach(function(d){t.mFieldGroupResolves[d]=t.mFieldGroupResolves[d]||[Promise.resolve()];p=p.then(function(){return Promise.all(t.mFieldGroupResolves[d]).then(t.prepareForSideEffects.bind(t,d,s));});});p.then(this.requestSideEffects.bind(this));}};return c;},true);
