// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/tiles/utils","sap/ushell/components/tiles/utilsRT","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/Config","sap/ushell/services/AppType","sap/m/library","sap/ui/model/json/JSONModel","sap/base/Log","sap/ui/thirdparty/jquery"],function(u,a,A,C,b,l,J,L,q){"use strict";var G=l.GenericTileScope;var c=l.GenericTileMode;sap.ui.getCore().loadLibrary("sap.m");sap.ui.controller("sap.ushell.components.tiles.applauncher.StaticTile",{_aDoableObject:{},onInit:function(){var s=this.getView(),v=s.getViewData(),t=v.chip,o=a.getConfiguration(t,t.configurationUi.isEnabled(),false),m,k,K,d=this,N=o.navigation_target_url,S,U,h;this.oShellModel=A.getElementsModel();S=t.url.getApplicationSystem();if(S){U=sap.ushell.Container.getService("URLParsing");if(U.isIntentUrl(N)){h=U.parseShellHash(N);if(!h.params){h.params={};}h.params["sap-system"]=S;N="#"+U.constructShellHash(h);}else{N+=((N.indexOf("?")<0)?"?":"&")+"sap-system="+S;}}this.navigationTargetUrl=N;m=new J({sizeBehavior:C.last("/core/home/sizeBehavior"),wrappingType:C.last("/core/home/wrappingType"),mode:o.display_mode||c.ContentMode,config:o,nav:{navigation_target_url:(t.configurationUi&&t.configurationUi.isEnabled()?"":N)},search:{display_highlight_terms:[]}});s.setModel(m);this._aDoableObject=C.on("/core/home/sizeBehavior").do(function(g){m.setProperty("/sizeBehavior",g);});if(t.types){t.types.attachSetType(function(T){if(d.tileType!==T){var m=d.getView().getModel();if(T==="link"){m.setProperty("/mode",c.LineMode);}else{m.setProperty("/mode",m.getProperty("/config/display_mode")||c.ContentMode);}d.tileType=T;}});}if(!this.tileType){this.tileType="tile";}if(t.search){k=s.getModel().getProperty("/config/display_search_keywords");K=k.split(/[, ]+/).filter(function(n){return n&&n!=="";});if(o.display_title_text&&o.display_title_text!==""&&K.indexOf(o.display_title_text)===-1){K.push(o.display_title_text);}if(o.display_subtitle_text&&o.display_subtitle_text!==""&&K.indexOf(o.display_subtitle_text)===-1){K.push(o.display_subtitle_text);}if(o.display_info_text&&o.display_info_text!==""&&K.indexOf(o.display_info_text)===-1){K.push(o.display_info_text);}t.search.setKeywords(K);t.search.attachHighlight(function(H){s.getModel().setProperty("/search/display_highlight_terms",H);});}if(t.bag&&t.bag.attachBagsUpdated){t.bag.attachBagsUpdated(function(g){if(g.indexOf("tileProperties")>-1){u._updateTilePropertiesTexts(s,t.bag.getBag("tileProperties"));}});}if(t.configuration&&t.configuration.attachConfigurationUpdated){t.configuration.attachConfigurationUpdated(function(g){if(g.indexOf("tileConfiguration")>-1){u._updateTileConfiguration(s,t.configuration.getParameterValueAsString("tileConfiguration"));}});}if(t.preview){t.preview.setTargetUrl(N);t.preview.setPreviewIcon(o.display_icon_url);t.preview.setPreviewTitle(o.display_title_text);if(t.preview.setPreviewSubtitle&&typeof t.preview.setPreviewSubtitle==="function"){t.preview.setPreviewSubtitle(o.display_subtitle_text);}}if(t.configurationUi.isEnabled()){t.configurationUi.setUiProvider(function(){var g=u.getConfigurationUi(s,"sap.ushell.components.tiles.applauncher.Configuration");t.configurationUi.attachCancel(d.onCancelConfiguration.bind(null,g));t.configurationUi.attachSave(d.onSaveConfiguration.bind(null,g));return g;});this.getView().getContent()[0].setTooltip(u.getResourceBundleModel().getResourceBundle().getText("edit_configuration.tooltip"));}if(t.actions){var e=o.actions,E;if(e){E=e.slice();}else{E=[];}var T=m.getProperty("/mode")===c.LineMode?"link":"tile",f=a.getTileSettingsAction(m,this.onSaveRuntimeSettings.bind(this),T);E.push(f);t.actions.setActionsProvider(function(){return E;});}},onExit:function(){this._aDoableObject.off();},onPress:function(e){var s=this.getView(),v=s.getViewData(),t=v.chip,T=s.getModel().getProperty("/config");if(e.getSource().getScope&&e.getSource().getScope()===G.Display){if(t.configurationUi.isEnabled()){t.configurationUi.display();}else if(this.navigationTargetUrl){if(this.navigationTargetUrl[0]==="#"){hasher.setHash(this.navigationTargetUrl);}else{var d=C.last("/core/shell/enableRecentActivity")&&C.last("/core/shell/enableRecentActivityLogging");if(d){var r={title:T.display_title_text,appType:b.URL,url:T.navigation_target_url,appId:T.navigation_target_url};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(r);}window.open(this.navigationTargetUrl,"_blank");}}}},onSaveRuntimeSettings:function(s){var v=s.getModel(),t=this.getView().getViewData().chip,o=this.getView().getModel().getProperty("/config");o.display_title_text=v.getProperty("/title");o.display_subtitle_text=v.getProperty("/subtitle");o.display_info_text=v.getProperty("/info");o.display_search_keywords=v.getProperty("/keywords");var d=t.bag.getBag("tileProperties");d.setText("display_title_text",o.display_title_text);d.setText("display_subtitle_text",o.display_subtitle_text);d.setText("display_info_text",o.display_info_text);d.setText("display_search_keywords",o.display_search_keywords);function e(E){L.error(E,null,"sap.ushell.components.tiles.applauncher.StaticTile.controller");}d.save(function(){L.debug("property bag 'tileProperties' saved successfully");this.getView().getModel().setProperty("/config/display_title_text",o.display_title_text);this.getView().getModel().setProperty("/config/display_subtitle_text",o.display_subtitle_text);this.getView().getModel().setProperty("/config/display_info_text",o.display_info_text);this.getView().getModel().setProperty("/config/display_search_keywords",o.display_search_keywords);this.getView().getModel().refresh();}.bind(this),e);},onSaveConfiguration:function(o){var d=q.Deferred();var m=o.getModel();var t=m.getProperty("/tileModel");var T=o.getViewData().chip;var e=u.tileActionsRows2TileActionsArray(m.getProperty("/config/tile_actions_rows"));var f={display_icon_url:m.getProperty("/config/display_icon_url"),navigation_use_semantic_object:m.getProperty("/config/navigation_use_semantic_object"),navigation_target_url:m.getProperty("/config/navigation_target_url"),navigation_semantic_object:q.trim(m.getProperty("/config/navigation_semantic_object"))||"",navigation_semantic_action:q.trim(m.getProperty("/config/navigation_semantic_action"))||"",navigation_semantic_parameters:q.trim(m.getProperty("/config/navigation_semantic_parameters")),display_search_keywords:m.getProperty("/config/display_search_keywords")};var r=u.checkInputOnSaveConfig(o);if(!r){r=u.checkTileActions(o);}if(r){d.reject("mandatory_fields_missing");return d.promise();}if(f.navigation_use_semantic_object){f.navigation_target_url=a.getSemanticNavigationUrl(f);m.setProperty("/config/navigation_target_url",f.navigation_target_url);}var g=T.bag.getBag("tileProperties");g.setText("display_title_text",m.getProperty("/config/display_title_text"));g.setText("display_subtitle_text",m.getProperty("/config/display_subtitle_text"));g.setText("display_info_text",m.getProperty("/config/display_info_text"));g.setText("display_search_keywords",f.display_search_keywords);var h=T.bag.getBag("tileNavigationActions");u.populateTileNavigationActionsBag(h,e);function i(E,j){L.error(E,null,"sap.ushell.components.tiles.applauncher.StaticTile.controller");d.reject(E,j);}T.writeConfiguration.setParameterValues({tileConfiguration:JSON.stringify(f)},function(){var j=a.getConfiguration(T,false,false),k=a.getConfiguration(T,true,false),m=new J({config:j,nav:{navigation_target_url:""},tileModel:t});o.setModel(m);t.setData({config:k,nav:{navigation_target_url:""}},false);if(T.preview){T.preview.setTargetUrl(j.navigation_target_url);T.preview.setPreviewIcon(j.display_icon_url);T.preview.setPreviewTitle(j.display_title_text);if(T.preview.setPreviewSubtitle&&typeof T.preview.setPreviewSubtitle==="function"){T.preview.setPreviewSubtitle(j.display_subtitle_text);}}g.save(function(){L.debug("property bag 'tileProperties' saved successfully");if(T.title){T.title.setTitle(j.display_title_text,function(){d.resolve();},i);}else{d.resolve();}},i);h.save(function(){L.debug("property bag 'navigationProperties' saved successfully");},i);},i);return d.promise();},onCancelConfiguration:function(o){var v=o.getViewData(),m=o.getModel(),t=m.getProperty("/tileModel"),T=v.chip,d=a.getConfiguration(T,T.configurationUi.isEnabled(),false);o.getModel().setData({config:d,nav:{navigation_target_url:""},tileModel:t},false);}});},false);
