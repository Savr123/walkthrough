// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/m/Text","sap/base/Log"],function(r,T,L){"use strict";var a={};a.render=function(R,c){var t=null,l,s,m=c.getModel();try{t=c.getTileViews()[0];}catch(e){L.warning("Failed to load tile view: ",e.message);t=new T({text:r.i18n.getText("cannotLoadTile")});}R.write("<div");if(m&&m.getProperty("/enableHelp")){R.writeAttribute("data-help-id",c.getTileCatalogId());}R.writeControlData(c);R.addClass("sapUshellLinkTile");if(!c.getVisible()){R.addClass("sapUshellHidden");}if(c.getIsLocked()){R.addClass("sapUshellLockedTile");}R.writeClasses();if(c.getIeHtml5DnD()){R.writeAttribute("draggable","true");}R.writeAttributeEscaped("tabindex","-1");l=c.data("layoutPosition");if(l){s="-webkit-transform:"+l.translate3D+";-ms-transform:"+l.translate2D+";transform:"+l.translate3D;R.writeAttribute("style",s);}R.write(">");if(this.renderTileView){this.renderTileView(R,t,c.getTarget());}R.write("</div>");};a.renderTileView=function(R,t,s){R.write("<div");R.addClass("sapUshellTileInner");R.writeClasses();R.writeAttribute("title",t&&t.getText?t.getText():"");R.write(">");R.renderControl(t);R.write("</div>");};return a;},true);
