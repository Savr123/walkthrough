/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element','sap/ui/model/Context','./TableUtils',"sap/ui/thirdparty/jquery"],function(E,C,T,q){"use strict";var R=E.extend("sap.ui.table.Row",{metadata:{library:"sap.ui.table",defaultAggregation:"cells",aggregations:{cells:{type:"sap.ui.core.Control",multiple:true,singularName:"cell"},_rowAction:{type:"sap.ui.table.RowAction",multiple:false,visibility:"hidden"},_settings:{type:"sap.ui.table.RowSettings",multiple:false,visibility:"hidden"}}}});R.prototype.init=function(){this.initDomRefs();};R.prototype.exit=function(){this.initDomRefs();};R.prototype.getFocusInfo=function(){var t=this.getParent();return t?t.getFocusInfo():E.prototype.getFocusInfo.apply(this,arguments);};R.prototype.applyFocusInfo=function(f){var t=this.getParent();if(t){t.applyFocusInfo(f);}else{E.prototype.applyFocusInfo.apply(this,arguments);}return this;};R.prototype.addStyleClass=function(s){this.getDomRefs(true).row.addClass(s);};R.prototype.removeStyleClass=function(s){this.getDomRefs(true).row.removeClass(s);};R.prototype.initDomRefs=function(){this._mDomRefs={};};R.prototype.getIndex=function(){var t=this.getParent();if(!t){return-1;}var r=t.indexOfRow(this);var m=t._getRowCounts();if(m.fixedTop>0&&r<m.fixedTop){return r;}if(m.fixedBottom>0&&r>=m.count-m.fixedBottom){var i=t._getTotalRowCount();if(i>=m.count){return i-(m.count-r);}else{return r;}}return t._getFirstRenderedRowIndex()+r;};R.prototype.getDomRefs=function(j,c){j=j===true;c=c===true;var k=j?"jQuery":"dom";var d=this._mDomRefs;if(!d[k]){var t=this.getParent();var g=function(i){var e=document.getElementById(i);if(e){return j?q(e):e;}return null;};var G=function(e){if(e){return j?e.parent():e.parentNode;}return null;};d[k]={};if(t){var r=t.indexOfRow(this);d[k].rowSelector=g(t.getId()+"-rowsel"+r);d[k].rowAction=g(t.getId()+"-rowact"+r);}d[k].rowHeaderPart=G(d[k].rowSelector);d[k].rowFixedPart=g(this.getId()+"-fixed");d[k].rowScrollPart=g(this.getId());d[k].rowActionPart=G(d[k].rowAction);d[k].rowSelectorText=g(this.getId()+"-rowselecttext");if(j){d[k].row=q().add(d[k].rowHeaderPart).add(d[k].rowFixedPart).add(d[k].rowScrollPart).add(d[k].rowActionPart);}}var K=d[k];if(c){return Object.keys(K).map(function(k){return K[k];}).filter(Boolean);}return K;};R.prototype._updateSelection=function(t,m){var i=t.isIndexSelected(this.getIndex());var d=this.getDomRefs(true);if(!d.rowScrollPart){return;}var s="rowSelect";if(i){s="rowDeselect";}if(d.rowSelector&&!this._bHidden&&t._getShowStandardTooltips()&&T.isRowSelectorSelectionAllowed(t)){d.rowSelector.attr("title",m.mouse[s]);}if(d.rowSelectorText){var a="";if(!this._bHidden&&!T.Grouping.isInSumRow(d.rowSelector)&&!T.Grouping.isInGroupingRow(d.rowSelector)){a=m.keyboard[s];}d.rowSelectorText.text(a);}var r=d.rowScrollPart.add(d.rowFixedPart);if(!this._bHidden&&t._getShowStandardTooltips()&&T.isRowSelectionAllowed(t)){r.attr("title",m.mouse[s]);}else{r.removeAttr("title");}this._setSelected(i);t._getAccExtension().updateAriaStateOfRow(this,d,i);};R.prototype.setRowBindingContext=function(c,m,b){var n;if(c&&!(c instanceof C)){n=c;c=c.context;}var $=this.getDomRefs(true).row;this._bHidden=!c;$.toggleClass("sapUiTableRowHidden",this._bHidden);this._collectRenderingInformation(c,n,b);this.setBindingContext(c,m);};R.prototype.setBindingContext=function(c,m){var r=E.prototype.setBindingContext.call(this,c||null,m);this._updateTableCells(c);return r;};R.prototype._updateTableCells=function(c){var t=this.getParent();if(!t){return;}var a=this.getCells(),A=this.getIndex(),h=!!t._updateTableCell,o,$,H;for(var i=0;i<a.length;i++){o=a[i];H=!!o._updateTableCell;$=H||h?o.$().closest("td"):null;if(H){o._updateTableCell(o,c,$,A);}if(h){t._updateTableCell(o,c,$,A);}}};R.prototype._collectRenderingInformation=function(c,n,b){this._oNodeState=undefined;this._iLevel=0;this._bIsExpanded=false;this._bHasChildren=false;if(n){this._oNodeState=n.nodeState;this._iLevel=n.level;if(b){if(b.getLevel){this._bIsExpanded=b.isExpanded(this.getIndex());}else if(b.findNode){this._bIsExpanded=this&&this._oNodeState?this._oNodeState.expanded:false;}if(b.nodeHasChildren){if(this._oNodeState){this._bHasChildren=b.nodeHasChildren(n);}}else if(b.hasChildren){this._bHasChildren=b.hasChildren(c);}}}};R.prototype.destroy=function(){this.removeAllCells();return E.prototype.destroy.apply(this,arguments);};R.prototype.invalidate=function(){return this;};R.prototype.getDragGhost=function(){var t=this.getParent();var o=t.getDomRef();var r=this.getDomRefs();var g;var G;var a;var s=t._getSelectedIndicesCount();function b(e){e.removeAttribute("id");e.removeAttribute("data-sap-ui");e.removeAttribute("data-sap-ui-related");var f=e.children.length;for(var i=0;i<f;i++){b(e.children[i]);}}function c(o,e){var f=o.cloneNode();var h=o.querySelector("thead").cloneNode(true);var i=o.querySelector("tbody").cloneNode();var j=e.cloneNode(true);i.appendChild(j);f.appendChild(h);f.appendChild(i);return f;}g=o.cloneNode();g.classList.add("sapUiTableRowGhost");g.classList.remove("sapUiTableVScr");g.classList.remove("sapUiTableHScr");g.style.width=o.getBoundingClientRect().width+"px";if(r.rowSelector){G=t.getDomRef("sapUiTableRowHdrScr").cloneNode();a=r.rowSelector.cloneNode(true);G.appendChild(a);g.appendChild(G);}if(r.rowFixedPart){G=t.getDomRef("sapUiTableCtrlScrFixed").cloneNode();a=c(t.getDomRef("table-fixed"),r.rowFixedPart);G.appendChild(a);g.appendChild(G);}if(r.rowScrollPart){var S=t.getDomRef("sapUiTableCtrlScr");G=S.cloneNode();a=c(t.getDomRef("table"),r.rowScrollPart);G.appendChild(t.getDomRef("tableCtrlCnt").cloneNode());G.firstChild.appendChild(a);g.appendChild(G);}if(r.rowAction){G=t.getDomRef("sapUiTableRowActionScr").cloneNode();a=r.rowAction.cloneNode(true);G.appendChild(a);g.appendChild(G);}if(s>1){G=document.createElement("div");G.classList.add("sapUiTableRowGhostCount");var d=document.createElement("div");d.textContent=s;G.appendChild(d);g.appendChild(G);}b(g);return g;};R.prototype._setSelected=function(s){var t=this.getParent();if(s){this.addStyleClass("sapUiTableRowSel");}else{this.removeStyleClass("sapUiTableRowSel");}if(t){T.dynamicCall(t._getSyncExtension,function(S){S.syncRowSelection(t.indexOfRow(this),s);},this);}};R.prototype._setHovered=function(h){var t=this.getParent();if(h){this.addStyleClass("sapUiTableRowHvr");}else{this.removeStyleClass("sapUiTableRowHvr");}if(t){T.dynamicCall(t._getSyncExtension,function(s){s.syncRowHover(t.indexOfRow(this),h);},this);}};R.prototype.getRowAction=function(){return this.getAggregation("_rowAction");};return R;});