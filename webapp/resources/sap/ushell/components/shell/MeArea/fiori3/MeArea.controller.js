// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/Device","sap/ui/model/json/JSONModel","sap/m/StandardListItem","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/resources","sap/ushell/ui/footerbar/AboutButton","sap/ushell/ui/footerbar/ContactSupportButton","sap/ushell/ui/footerbar/EndUserFeedback","sap/ushell/ui/launchpad/ActionItem","sap/ushell/ui/fiori3/QuickAccess","sap/ushell/EventHub","sap/m/library","sap/base/Log","sap/ui/performance/Measurement","sap/ui/core/ElementMetadata"],function(C,D,J,S,A,a,r,b,c,E,d,Q,f,l,L,M,g){"use strict";var h=l.ListType;var B=l.ButtonType;var _;function i(){if(!_){_=sap.ushell.Container.getRenderer("fiori2");}return _;}function j(){return i().getShellConfig();}function k(){return A.getElementsModel().getModel();}function m(s){if(!sap.ui.getCore().byId(s)){L.debug("Could not render ActionItem because it was not created: "+s);return false;}return true;}return C.extend("sap.ushell.components.shell.MeArea.fiori3.MeArea",{_aDanglingControl:[],_aDoables:[],onInit:function(){var t=this;var o=j();this._createActionButtons(o);var e=a.last("/core/shell/model/currentState/actions").filter(m);this.oModel=new J({actions:e,userName:sap.ushell.Container.getUser().getFullName()});this._aDoables.push(a.on("/core/shell/model/currentState/actions").do(function(n){var F=n.filter(m);t.getModel().setProperty("/actions",F);}));this._aDoables.push(f.on("showMeArea").do(function(s){var p=sap.ui.getCore().byId("sapUshellMeAreaPopover");if(p&&p.isOpen()||!s){t._toggleMeAreaPopover(false);}else{t._toggleMeAreaPopover(true);}}));},onExit:function(){this._destroyDanglingControls();this._aDoables.forEach(function(o){o.off();});this._aDanglingControl=[];this._aDoables=[];var p=sap.ui.getCore().byId("sapUshellMeAreaPopover");if(p){p.destroy();}},getModel:function(){return this.oModel;},_createActionButtons:function(o){var e=a.last("/core/extension/enableHelp");this._createAboutButton(e);if(o.enablePersonalization!==false&&!o.moveAppFinderActionToShellHeader){this._createAppFinderButton(o,e);}if(!o.moveUserSettingsActionToShellHeader){this._createSettingsButton(e);}if(!o.moveContactSupportActionToShellHeader){this._createSupportTicketButton(e);}this._createEndUserFeedbackButton(o,e);if(o.enableRecentActivity&&a.last("/core/shell/model/currentState/showRecentActivity")){this._createRecentActivitiesButton();this._createFrequentActivitiesButton();}if(!o.disableSignOut){this._createLogoutButton();}},_createAppFinderButton:function(o,e){if(sap.ui.getCore().byId("openCatalogBtn")){return;}var p=function(){sap.ushell.Container.getServiceAsync("URLParsing").then(function(u){var H;var s="#Shell-home&/appFinder/catalog";if(u){H=u.parseShellHash(window.hasher.getHash());H.action="appfinder";H.semanticObject="Shell";s="#"+u.constructShellHash(H);}setTimeout(function(){sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(n){n.toExternal({target:{shellHash:s}});});},D.system.desktop?0:500);});};var O=new d("openCatalogBtn",{text:r.i18n.getText("open_appFinderBtn"),icon:"sap-icon://sys-find",visible:!o.disableAppFinder,press:p,actionType:"action"});if(e){O.addStyleClass("help-id-openCatalogActionItem");}this._addDanglingControl(O);},_createAboutButton:function(e){var I="aboutBtn";if(!sap.ui.getCore().byId(I)){var o=new b(I);if(e){o.addStyleClass("help-id-aboutBtn");}this._addDanglingControl(o);i().showActionButton(I,false);}},_createSettingsButton:function(e){var I="userSettingsBtn";if(!sap.ui.getCore().byId(I)){var u=new d(I,{text:r.i18n.getText("userSettings"),icon:"sap-icon://action-settings",press:function(){f.emit("openUserSettings",Date.now());}});if(e){u.addStyleClass("help-id-loginDetails");}this._addDanglingControl(u);}},_createSupportTicketButton:function(e){var t=this;a.on("/core/extension/SupportTicket").do(function(n){var I="ContactSupportBtn";var o=sap.ui.getCore().byId(I);if(n&&!o){o=new c(I);t._addDanglingControl(o);if(e){o.addStyleClass("help-id-contactSupportBtn");}}if(n){i().showActionButton(I);}else{i().hideActionButton(I);}});},_createEndUserFeedbackButton:function(o,e){var t=this;a.on("/core/extension/EndUserFeedback").do(function(n){if(n){var I="EndUserFeedbackBtn";var p=sap.ui.getCore().byId(I);if(!p){var q=i().getEndUserFeedbackConfiguration();p=new E(I,{showAnonymous:q.showAnonymous,anonymousByDefault:q.anonymousByDefault,showLegalAgreement:q.showLegalAgreement,showCustomUIContent:q.showCustomUIContent,feedbackDialogTitle:q.feedbackDialogTitle,textAreaPlaceholder:q.textAreaPlaceholder,customUIContent:q.customUIContent});if(e){p.addStyleClass("help-id-EndUserFeedbackBtn");}p.setModel(k());t._addDanglingControl(p);}sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function(s){a.emit("/core/shell/model/showEndUserFeedback",true);t._setupEndUserFeedbackButton(s,p,o);});}else{a.emit("/core/shell/model/showEndUserFeedback",false);}});},_setupEndUserFeedbackButton:function(o,n,p){try{o.isEnabled().done(function(){var q=i().getEndUserFeedbackConfiguration();if(p.moveGiveFeedbackActionToShellHeader){M.start("FLP:Shell.controller._createActionButtons","create give feedback as shell head end item","FLP");var t=sap.ui.getCore().byId("EndUserFeedbackHandlerBtn");if(t){t.setModel(k());t.setShowAnonymous(q.showAnonymous);t.setAnonymousByDefault(q.anonymousByDefault);t.setShowLegalAgreement(q.showLegalAgreement);t.setShowCustomUIContent(q.showCustomUIContent);t.setFeedbackDialogTitle(q.feedbackDialogTitle);t.setTextAreaPlaceholder(q.textAreaPlaceholder);t.setAggregation("customUIContent",q.customUIContent,false);n.attachPress(function(){t.firePress();});}M.end("FLP:Shell.controller._createActionButtons");}n.setVisible(true);i().showActionButton(n.getId());}).fail(function(){i().hideActionButton(n.getId());});}catch(e){L.error("EndUserFeedback adapter is not found",e.message||e);}},_createRecentActivitiesButton:function(){var t=this,I="recentActivitiesBtn";a.on("/core/shell/model/enableTrackingActivity").do(function(e){if(e){var R=sap.ui.getCore().byId(I);if(!R){R=new d(I,{text:r.i18n.getText("recentActivities"),icon:"sap-icon://customer-history",press:function(){Q.openQuickAccessDialog("recentActivityFilter","meAreaHeaderButton");}});t._addDanglingControl(R);}i().showActionButton(I,false);}else{i().hideActionButton(I,false);}});},_createFrequentActivitiesButton:function(){var t=this,I="frequentActivitiesBtn";a.on("/core/shell/model/enableTrackingActivity").do(function(e){if(e){var F=sap.ui.getCore().byId(I);if(!F){F=new d(I,{text:r.i18n.getText("frequentActivities"),icon:"sap-icon://activity-individual",tooltip:r.i18n.getText("frequentActivitiesTooltip"),press:function(){Q.openQuickAccessDialog("frequentlyUsedFilter","meAreaHeaderButton");}});t._addDanglingControl(F);}i().showActionButton(I,false);}else{i().hideActionButton(I,false);}});},_createLogoutButton:function(){var I="logoutBtn";if(sap.ui.getCore().byId(I)){return;}var o=new d(I,{visible:true,type:B.Transparent,icon:"sap-icon://log",text:r.i18n.getText("signoutBtn_title"),press:this.logout});this._addDanglingControl(o);i().showActionButton(I,false);},logout:function(){sap.ui.require(["sap/m/MessageBox","sap/ushell/ui/launchpad/LoadingDialog"],function(e,n){var o=new n({text:""}),s=true,I=false,p={};sap.ushell.Container.getGlobalDirty().done(function(q){s=false;if(I===true){o.exit();o=new n({text:""});}var t=function(){var R=r.i18n;if(q===sap.ushell.Container.DirtyState.DIRTY){p.message=R.getText("unsaved_data_warning_popup_message");p.icon=e.Icon.WARNING;p.messageTitle=R.getText("unsaved_data_warning_popup_title");}else{p.message=R.getText("signoutConfirmationMsg");p.icon=e.Icon.QUESTION;p.messageTitle=R.getText("signoutMsgTitle");}return p;};p=t(q);e.show(p.message,p.icon,p.messageTitle,[e.Action.OK,e.Action.CANCEL],function(u){if(u===e.Action.OK){o.openLoadingScreen();o.showAppInfo(r.i18n.getText("beforeLogoutMsg"),null);sap.ushell.Container.logout();}else if(window.document.activeElement&&window.document.activeElement.tagName==="BODY"){window.document.getElementById("meAreaHeaderButton").focus();}},g.uid("confirm"));});if(s===true){o.openLoadingScreen();I=true;}});},_addDanglingControl:function(o){this._aDanglingControl.push(o);},_destroyDanglingControls:function(){if(this._aDanglingControl){this._aDanglingControl.forEach(function(o){if(o.destroyContent){o.destroyContent();}o.destroy();});}},_toggleMeAreaPopover:function(s){var p=sap.ui.getCore().byId("sapUshellMeAreaPopover");if(!p){p=sap.ui.xmlfragment("sap.ushell.components.shell.MeArea.fiori3.MeAreaPopover",this);p.setModel(this.getModel());}else if(s){p.getModel().refresh(true);}if(s){p.openBy(sap.ui.getCore().byId("meAreaHeaderButton"));}else{p.close();}},meAreaPopoverItemFactory:function(I,o){var e=sap.ui.getCore().byId(o.getObject()),n;var p=function(){if(e){e.firePress();f.emit("showMeArea",false);}};n=new S({id:I+"-"+e.getId(),icon:e.getIcon(),iconInset:true,title:e.getText(),visible:e.getVisible(),type:h.Active,customData:[{key:"actionItemId",value:e.getId()}],press:p});n.addStyleClass("sapUshellMeAreaActionItem");n.addEventDelegate({onkeydown:function(q){if(q.keyCode===32){p();}}});return n;}});});
