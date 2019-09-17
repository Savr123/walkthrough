// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Button","sap/m/FlexBox","sap/ushell/extensions/_PageComposition/Factory/PageOverview","sap/ushell/extensions/_PageComposition/Factory/PageSaveDialog","sap/ui/model/json/JSONModel","sap/ushell/Config","sap/ushell/resources","sap/m/library","sap/m/FlexAlignItems","sap/m/FlexJustifyContent"],function(B,F,P,a,J,C,r,l,b,c){"use strict";var f=C.createModel("/core/pageComposition",J);var d=function(s){return function(k){return k===s;};};function e(p){var o=new B({text:r.i18n.getText("pageComposerCloseBtn"),visible:{parts:["/composerState"],formatter:d("composing")},press:p});o.setModel(f);return o;}function g(o,s){var k=new B({text:r.i18n.getText("pageComposerSaveBtn"),type:l.ButtonType.Emphasized,visible:{parts:["/composerState"],formatter:d("composing")},press:function(){o();}});k.setModel(f);return k;}function h(o){var k=new B({text:r.i18n.getText("pageComposerCreateBtn"),type:l.ButtonType.Emphasized,enabled:{parts:["/composerState"],formatter:d("initial")},press:function(){o();}});k.setModel(f);return k;}function i(L,p){var o=new B({text:r.i18n.getText("pageComposerOpenBtn"),type:l.ButtonType.Emphasized,enabled:{parts:["/composerState"],formatter:d("initial")},press:function(){P.create(L).selectPage().then(p);}});o.setModel(f);return o;}function j(p,m){var o=new B("sapUshellAddGroupBtn",{icon:"sap-icon://add",text:r.i18n.getText("add_group_at"),press:p});o.addStyleClass("sapUshellAddGroupButton");var k=new F({alignItems:b.Center,justifyContent:c.Center,items:[o],visible:{parts:[{path:"groupsModel>/groups/length"},{path:"composerStateModel>/composerState"}],formatter:function(G,s){return G===0&&s==="composing";}}});k.setModel(m,"groupsModel");k.setModel(f,"composerStateModel");return k;}return{createFooterCloseButton:e,createFooterSaveButton:g,createFooterCreateButton:h,createFooterOpenButton:i,createAddGroupButton:j};});
