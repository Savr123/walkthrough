/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/InvisibleRenderer"],function(c,I){"use strict";var T=c.TextDirection;var S={apiVersion:2};S.render=function(r,C){var b=C.getButtons(),v=b.filter(function(B){return B.getVisible();}),V=0,s=C.getSelectedButton(),B,t,a,d;if(v.length){v[v.length-1].addStyleClass("sapMSegBtnLastVisibleButton");}if(C._bInOverflow){r.openStart("div",C);r.openEnd();r.renderControl(C.getAggregation("_select"));r.close("div");return;}r.openStart("ul",C);if(S._addAllIconsClass(b)){r.class("sapMSegBIcons");}r.class("sapMSegB");if(C.getWidth()&&C.getWidth()!==''){r.style('width',C.getWidth());}t=C.getTooltip_AsString();if(t){r.attr("title",t);}r.accessibilityState(C,{role:"radiogroup"});r.openEnd();for(var i=0;i<b.length;i++){B=b[i];if(B.getVisible()){var e=B.getText(),o=B.getIcon(),f="",g;++V;if(o){g=B._getImage((B.getId()+"-img"),o);if(g instanceof sap.m.Image){C._overwriteImageOnload(g);}else if(!B.getTooltip()){f=C._getIconAriaLabel(g);}}r.openStart("li",B);r.attr("aria-posinset",V);r.attr("aria-setsize",v.length);r.class("sapMSegBBtn");if(B.aCustomStyleClasses!==undefined&&B.aCustomStyleClasses instanceof Array){for(var j=0;j<B.aCustomStyleClasses.length;j++){r.class(B.aCustomStyleClasses[j]);}}if(B.getEnabled()){r.class("sapMSegBBtnFocusable");}else{r.class("sapMSegBBtnDis");}if(s===B.getId()){r.class("sapMSegBBtnSel");}if(o&&e!==''){r.class("sapMSegBBtnMixed");}a=B.getWidth();if(a){r.style('width',a);}t=B.getTooltip_AsString();if(t){r.attr("title",t);}r.attr("tabindex",B.getEnabled()?"0":"-1");d=B.getTextDirection();if(d!==T.Inherit){r.attr("dir",d.toLowerCase());}r.accessibilityState(B,{role:"radio",checked:s===B.getId()});if(g&&f!==""){if(e!==""){f+=" "+e;}else{r.attr("title",f);}r.attr("aria-label",f);}r.openEnd();r.openStart("div");r.class("sapMSegBBtnInner");r.openEnd();if(o&&g){r.renderControl(g);}if(e!==''){r.text(e,false);}r.close("div");r.close("li");}else{I.render(r,B,"li");}}r.close("ul");};S._addAllIconsClass=function(b){for(var i=0;i<b.length;i++){if(!b[i].getIcon()){return false;}}return true;};return S;},true);
