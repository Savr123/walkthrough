// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/Object","sap/ushell/Config","sap/ushell/resources","sap/ushell/components/MessagingHelper","sap/m/GenericTile","sap/base/Log","sap/ui/performance/Measurement","sap/m/library"],function(q,B,C,r,m,G,L,M,a){"use strict";var b=a.GenericTileMode;var c=a.LoadState;var d={PERSONALIZATION:"FLP: Personalization",RENAME_GROUP:"FLP: Rename Group",MOVE_GROUP:"FLP: Move Group",DELETE_GROUP:"FLP: Delete Group",RESET_GROUP:"FLP: Reset Group",DELETE_TILE:"FLP: Delete Tile",ADD_TILE:"FLP: Add Tile",MOVE_TILE:"FLP: Move Tile"};function _(E,p){sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function(u){u.logCustomEvent(d.PERSONALIZATION,E,p);});}var P=B.extend("sap.ushell.components._HomepageManager.PersistentPageOperationAdapter",{constructor:function(){B.call(this);this.oPageBuilderService=sap.ushell.Container.getService("LaunchPage");},_getIsAppBox:function(o){if(!sap.ushell.Container){return false;}var s=this.oPageBuilderService,i=!!(s.getCatalogTileTargetURL(o)&&(s.getCatalogTilePreviewTitle(o)||s.getCatalogTilePreviewSubtitle(o)));return i;},getCurrentHiddenGroupIds:function(o){var g=o.getProperty("/groups"),h=[],s,f,i;for(f=0;f<g.length;f++){i=g[f]?g[f].isGroupVisible:true;if(g[f].object){s=this.oPageBuilderService.getGroupId(g[f].object);}if(!i&&s!==undefined){h.push(s);}}return h;},getPreparedTileModel:function(t,i,T){var s=this.oPageBuilderService,f=q.sap.uid(),o,S=s.getTileSize(t),l=[],g;T=T||s.getTileType(t);if(T==="link"){l=[new G({mode:sap.m.GenericTileMode.LineMode})];}o={"isCustomTile":!this._getIsAppBox(t),"object":t,"originalTileId":s.getTileId(t),"uuid":f,"tileCatalogId":encodeURIComponent(s.getCatalogTileId(t)),"content":l,"long":S==="1x2","target":s.getTileTarget(t)||"","debugInfo":s.getTileDebugInfo(t),"isTileIntentSupported":s.isTileIntentSupported(t),"rgba":"","isLocked":i,"showActionsIcon":C.last("/core/home/enableTileActionsIcon"),"isLinkPersonalizationSupported":s.isLinkPersonalizationSupported(t),"navigationMode":undefined};if(T==="card"){g=s.getCardManifest(t);o.isCard=true;if(g){o.manifest=g;}}return o;},getPreparedGroupModel:function(g,D,l,o){var s=this.oPageBuilderService,f=(g&&s.getGroupTiles(g))||[],h=[],j=[],i,k=C.last("/core/shell/model/personalization");var I=!!(g&&s.isGroupLocked(g)),n=!!(g&&s.isGroupFeatured(g));for(i=0;i<f.length;++i){var t=f[i],T=s.getTileType(t).toLowerCase();if(T==="tile"||T==="card"){h.push(this.getPreparedTileModel(f[i],I,T));}else if(T==="link"){j.push(this.getPreparedTileModel(f[i],I,T));}else{L.error("Unknown tile type: '"+T+"'",undefined,"sap.ushell.components.HomepageManager");}}return{title:(D&&m.getLocalizedText("my_group"))||(g&&s.getGroupTitle(g))||(o&&o.title)||"",object:g,groupId:q.sap.uid(),links:j,pendingLinks:[],tiles:h,isDefaultGroup:!!D,editMode:!g,isGroupLocked:I,isFeatured:n,visibilityModes:[true,true],removable:!g||s.isGroupRemovable(g),sortable:k,isGroupVisible:!g||s.isGroupVisible(g),isEnabled:!D,isLastGroup:l||false,isRendered:!!(o&&o.isRendered),isGroupSelected:false};},getPage:function(){q.sap.flpmeasure.start(0,"Service: Get Data for Dashboard",4);M.start("FLP:DashboardManager.loadPersonalizedGroups","loadPersonalizedGroups","FLP");return this._getGroupsFromServer().then(this.loadGroupsFromArray.bind(this));},_getGroupsFromServer:function(){var t=this;return new Promise(function(f,g){t.oPageBuilderService.getGroups().done(function(h){M.end("FLP:DashboardManager.loadPersonalizedGroups");f(h);}).fail(g);});},loadGroupsFromArray:function(g){var t=this;q.sap.flpmeasure.end(0,"Service: Get Data for Dashboard");q.sap.flpmeasure.start(0,"Process & render the first segment/tiles",4);M.start("FLP:DashboardManager.loadGroupsFromArray","loadGroupsFromArray","FLP");M.start("FLP:DashboardManager.getDefaultGroup","getDefaultGroup","FLP");return new Promise(function(f,h){t.oPageBuilderService.getDefaultGroup().done(function(D){M.end("FLP:DashboardManager.getDefaultGroup");if(g.length===0&&D===undefined){f([]);return;}var i=0,n,N=[],j,k;g=t._sortGroups(D,g);k=g.indexOf(D);j=g.length;M.start("FLP:DashboardManager._getGroupModel","_getGroupModel","FLP");for(i=0;i<j;++i){n=t.getPreparedGroupModel(g[i],i===k,i===j-1);n.index=i;N.push(n);}M.end("FLP:DashboardManager._getGroupModel");M.end("FLP:DashboardManager.loadGroupsFromArray");q.sap.flpmeasure.end(0,"Process & render the first segment/tiles");f(N);}).fail(h);});},_sortGroups:function(D,g){var i=0,t=this,f=g.indexOf(D),l=[],h,o,j;g.splice(f,1);while(i<g.length){o=g[i];j=this.oPageBuilderService.isGroupLocked(o);if(j){l.push(o);g.splice(i,1);}else{i++;}}if(!C.last("/core/home/disableSortedLockedGroups")){l.sort(function(x,y){var k=t.oPageBuilderService.getGroupTitle(x).toLowerCase(),n=t.oPageBuilderService.getGroupTitle(y).toLowerCase();return k<n?-1:1;});}l.sort(function(x,y){var I=t.oPageBuilderService.isGroupFeatured(x),k=t.oPageBuilderService.isGroupFeatured(y);if(I===k){return 0;}else if(I>k){return-1;}return 1;});h=l;h.push(D);h.push.apply(h,g);return h;},addGroupAt:function(g,i,I){var t=this;return new Promise(function(f,h){try{if(i===undefined){t.oPageBuilderService.addGroup(g.title).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(d.RENAME_GROUP,[null,g.title,s]);f(t.getPreparedGroupModel(n,I,g.isLastGroup,undefined));}).fail(h);}else{t.oPageBuilderService.addGroupAt(g.title,i).done(function(n){var s=t.oPageBuilderService.getGroupId(n);_(d.RENAME_GROUP,[null,g.title,s]);f(t.getPreparedGroupModel(n,I,g.isLastGroup,undefined));}).fail(h);}}catch(j){h();}});},renameGroup:function(g,n,o){var t=this;return new Promise(function(f,h){try{t.oPageBuilderService.setGroupTitle(g.object,n).done(function(){var s=t.oPageBuilderService.getGroupId(g.object);_(d.RENAME_GROUP,[o,n,s]);f();}).fail(h);}catch(E){h();}});},deleteGroup:function(g){var t=this,s=g.object,f=this.oPageBuilderService.getGroupId(s),h=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(i,j){try{t.oPageBuilderService.removeGroup(s).done(function(){_(d.DELETE_GROUP,[h,f]);i();}).fail(j);}catch(k){j();}});},moveGroup:function(g,t,i){var f=this;return new Promise(function(h,j){try{f.oPageBuilderService.moveGroup(g.object,t).done(function(){var s=f.oPageBuilderService.getGroupId(g.object);_(d.MOVE_GROUP,[g.title,i.iFromIndex,i.iToIndex,s]);h();}).fail(j);}catch(k){j();}});},resetGroup:function(g,i){var t=this,s=g.object,f=this.oPageBuilderService.getGroupId(s),h=this.oPageBuilderService.getGroupTitle(s);return new Promise(function(j,k){try{t.oPageBuilderService.resetGroup(s).done(function(R){_(d.RESET_GROUP,[h,f]);j(t.getPreparedGroupModel(R,i,g.isLastGroup,undefined));}).fail(k);}catch(l){k();}});},refreshGroup:function(g){var t=this,E="Failed to refresh group with id:"+g+" in the model";return new Promise(function(f){t.oPageBuilderService.getGroups().fail(function(){L.error(E,null,"sap.ushell.components.HomepageManager");f(null);}).done(function(h){var s=null;for(var i=0;i<h.length;i++){if(t.oPageBuilderService.getGroupId(h[i])===g){s=h[i];break;}}if(s){t.oPageBuilderService.getDefaultGroup().done(function(D){var I=g===D.getId(),o=t.getPreparedGroupModel(s,I,false,{isRendered:true});f(o);});}else{f(null);}});});},getIndexOfGroup:function(g,s){var n=-1,t=this,f=this.oPageBuilderService.getGroupId(s);g.every(function(o,h){var i=t.oPageBuilderService.getGroupId(o.object);if(i===f){n=h;return false;}return true;});return n;},getOriginalGroupIndex:function(g){var s=this.oPageBuilderService,S=g.object,o=this.oPageBuilderService.getGroups();return new Promise(function(f,h){o.done(function(j){var n;for(var i=0;i<j.length;i++){if(s.getGroupId(j[i])===s.getGroupId(S)){n=i;break;}}f(n);}).fail(h);});},moveTile:function(t,i,s,T,f){var g=this,S,p=new Promise(function(h,j){try{var R=g.oPageBuilderService.moveTile(t.object,i.tileIndex,i.newTileIndex,s.object,T.object,f);R.done(function(o){var u=[g.oPageBuilderService.getTileTitle(t.object),g.oPageBuilderService.getGroupTitle(s.object),g.oPageBuilderService.getGroupTitle(T.object),t.uuid];_(d.MOVE_TILE,u);S=o;h(o);});R.fail(j);}catch(k){j();}});return p.then(this._getTileViewAsPromise.bind(this)).then(function(v){return Promise.resolve({content:v,originalTileId:g.oPageBuilderService.getTileId(S),object:S});});},removeTile:function(g,t){var f=this,s=t.object,T=f.oPageBuilderService.getTileTitle(s),h=f.oPageBuilderService.getCatalogTileId(s),i=f.oPageBuilderService.getCatalogTileTitle(s),j=f.oPageBuilderService.getTileId(s),p;p=new Promise(function(k,l){try{f.oPageBuilderService.removeTile(g.object,s).done(function(){m.showLocalizedMessage("tile_deleted_msg",[T,g.title]);_(d.DELETE_TILE,[T||j,h,i,g.title]);k();}).fail(l);}catch(n){l();}});return p;},_getTileViewAsPromise:function(t){var f=this,p=new Promise(function(g,h){var i=f.oPageBuilderService.getTileView(t);i.done(g);i.fail(h);});return p;},refreshTile:function(s){this.oPageBuilderService.refreshTile(s);},setTileVisible:function(s,v){this.oPageBuilderService.setTileVisible(s,v);},getTileType:function(s){return this.oPageBuilderService.getTileType(s);},getTileSize:function(s){return this.oPageBuilderService.getTileSize(s);},getTileTitle:function(t){return this.oPageBuilderService.getTileTitle(t.object);},getTileId:function(s){return this.oPageBuilderService.getTileId(s);},isLinkPersonalizationSupported:function(s){return this.oPageBuilderService.isLinkPersonalizationSupported(s);},getTileTarget:function(t){return this.oPageBuilderService.getTileTarget(t.object);},getTileView:function(t){return this.oPageBuilderService.getTileView(t.object);},getTileActions:function(t){return this.oPageBuilderService.getTileActions(t);},getFailedLinkView:function(t){var s=this.oPageBuilderService.getCatalogTilePreviewSubtitle(t.object);var h=this.oPageBuilderService.getCatalogTilePreviewTitle(t.object);if(!h&&!s){h=r.i18n.getText("cannotLoadLinkInformation");}return new G({mode:b.LineMode,state:c.Failed,header:h,subheader:s});},getTileModelByCatalogTileId:function(s){L.error("Cannot get tile with id "+s+": Method is not supported");},transformGroupModel:function(){return;}});var e=null;return{getInstance:function(){if(!e){e=new P();}return e;},destroy:function(){e=null;}};});