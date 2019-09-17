// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/strings/formatMessage","sap/ui/base/ManagedObject","sap/ui/core/Fragment","sap/ushell/resources"],function(f,M,F,r){"use strict";return M.extend("sap.ushell.applications.PageComposer.controller.CopyDialog",{constructor:function(v){this._oView=v;},exit:function(){delete this._oView;},open:function(m,R){var v=this._oView;var o={id:v.getId(),name:"sap.ushell.applications.PageComposer.view.CopyDialog",controller:{formatMessage:f,onAfterClose:function(){v.byId("pageDetailCopyDialog").destroy();},onCancel:function(){v.byId("pageDetailCopyDialog").close();},onCopyInputChange:function(e){var t=e.getParameter("value");var p=e.getSource().getParent().getParent();p.getBeginButton().setEnabled(t.length>0);},onConfirm:R}};F.load(o).then(function(a){a.setModel(m);a.setModel(r.i18nModel,"i18n");v.addDependent(a);a.open();});}});});