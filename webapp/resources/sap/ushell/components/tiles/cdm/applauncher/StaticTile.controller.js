// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ushell/Config","sap/ushell/services/AppType","sap/ui/model/json/JSONModel","sap/m/library"],function(C,a,A,J,m){"use strict";var G=m.GenericTileScope;return C.extend("sap.ushell.components.tiles.cdm.applauncher.StaticTile",{_aDoableObject:{},_getConfiguration:function(){var c=this.getView().getViewData();c.properties.sizeBehavior=a.last("/core/home/sizeBehavior");c.properties.wrappingType=a.last("/core/home/wrappingType");return c;},onInit:function(){var v=this.getView();var M=new J();M.setData(this._getConfiguration());v.setModel(M);this._aDoableObject=a.on("/core/home/sizeBehavior").do(function(s){M.setProperty("/properties/sizeBehavior",s);});},onExit:function(){this._aDoableObject.off();},onPress:function(e){var t=this.getView().getViewData().properties;if(e.getSource().getScope&&e.getSource().getScope()===G.Display){var T=this._createTargetUrl();if(!T){return;}if(T[0]==="#"){hasher.setHash(T);}else{var l=a.last("/core/shell/enableRecentActivity")&&a.last("/core/shell/enableRecentActivityLogging");if(l){var r={title:t.title,appType:A.URL,url:t.targetURL,appId:t.targetURL};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(r);}window.open(T,"_blank");}}},updatePropertiesHandler:function(n){var t=this.getView().getContent()[0],T=t.getTileContent()[0];if(typeof n.title!=="undefined"){t.setHeader(n.title);}if(typeof n.subtitle!=="undefined"){t.setSubheader(n.subtitle);}if(typeof n.icon!=="undefined"){T.getContent().setSrc(n.icon);}if(typeof n.info!=="undefined"){T.setFooter(n.info);}},_createTargetUrl:function(){var t=this.getView().getViewData().properties.targetURL,s=this.getView().getViewData().configuration["sap-system"],u,h;if(t&&s){u=sap.ushell.Container.getService("URLParsing");if(u.isIntentUrl(t)){h=u.parseShellHash(t);if(!h.params){h.params={};}h.params["sap-system"]=s;t="#"+u.constructShellHash(h);}else{t+=((t.indexOf("?")<0)?"?":"&")+"sap-system="+s;}}return t;},_getCurrentProperties:function(){var t=this.getView().getContent()[0],T=t.getTileContent()[0],s=a.last("/core/home/sizeBehavior");return{title:t.getHeader(),subtitle:t.getSubheader(),info:T.getFooter(),icon:T.getContent().getSrc(),sizeBehavior:s};}});},true);
