(function(){var l=(function(){'use strict';var g=tinymce.util.Tools.resolve('tinymce.PluginManager');var a=tinymce.util.Tools.resolve('tinymce.dom.RangeUtils');var b=tinymce.util.Tools.resolve('tinymce.dom.TreeWalker');var c=tinymce.util.Tools.resolve('tinymce.util.VK');var d=tinymce.util.Tools.resolve('tinymce.dom.BookmarkManager');var f=tinymce.util.Tools.resolve('tinymce.util.Tools');var h=tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');var j=function(e){return e&&e.nodeType===3;};var k=function(e){return e&&/^(OL|UL|DL)$/.test(e.nodeName);};var m=function(e){return e&&/^(LI|DT|DD)$/.test(e.nodeName);};var n=function(e){return e&&/^(TH|TD)$/.test(e.nodeName);};var o=function(e){return e&&e.nodeName==='BR';};var p=function(e){return e.parentNode.firstChild===e;};var q=function(e){return e.parentNode.lastChild===e;};var r=function(e,i){return i&&!!e.schema.getTextBlockElements()[i.nodeName];};var s=function(e,i){return e&&e.nodeName in i;};var t=function(e,i){if(!o(i)){return false;}if(e.isBlock(i.nextSibling)&&!o(i.previousSibling)){return true;}return false;};var u=function(e,i,y){var g2=e.isEmpty(i);if(y&&e.select('span[data-mce-type=bookmark]',i).length>0){return false;}return g2;};var v=function(e,i){return e.isChildOf(i,e.getRoot());};var $={isTextNode:j,isListNode:k,isListItemNode:m,isTableCellNode:n,isBr:o,isFirstChild:p,isLastChild:q,isTextBlock:r,isBlock:s,isBogusBr:t,isEmpty:u,isChildOfBody:v};var w=function(e,i){var y=a.getNode(e,i);if($.isListItemNode(e)&&$.isTextNode(y)){var g2=i>=e.childNodes.length?y.data.length:0;return{container:y,offset:g2};}return{container:e,offset:i};};var x=function(e){var i=e.cloneRange();var y=w(e.startContainer,e.startOffset);i.setStart(y.container,y.offset);var g2=w(e.endContainer,e.endOffset);i.setEnd(g2.container,g2.offset);return i;};var z={getNormalizedEndPoint:w,normalizeRange:x};var D=h.DOM;var A=function(e){var i={};var y=function(g2){var h2,i2,j2;i2=e[g2?'startContainer':'endContainer'];j2=e[g2?'startOffset':'endOffset'];if(i2.nodeType===1){h2=D.create('span',{'data-mce-type':'bookmark'});if(i2.hasChildNodes()){j2=Math.min(j2,i2.childNodes.length-1);if(g2){i2.insertBefore(h2,i2.childNodes[j2]);}else{D.insertAfter(h2,i2.childNodes[j2]);}}else{i2.appendChild(h2);}i2=h2;j2=0;}i[g2?'startContainer':'endContainer']=i2;i[g2?'startOffset':'endOffset']=j2;};y(true);if(!e.collapsed){y();}return i;};var B=function(e){function i(g2){var h2,i2,j2;var k2=function(h2){var j2=h2.parentNode.firstChild,l2=0;while(j2){if(j2===h2){return l2;}if(j2.nodeType!==1||j2.getAttribute('data-mce-type')!=='bookmark'){l2++;}j2=j2.nextSibling;}return-1;};h2=j2=e[g2?'startContainer':'endContainer'];i2=e[g2?'startOffset':'endOffset'];if(!h2){return;}if(h2.nodeType===1){i2=k2(h2);h2=h2.parentNode;D.remove(j2);if(!h2.hasChildNodes()&&D.isBlock(h2)){h2.appendChild(D.create('br'));}}e[g2?'startContainer':'endContainer']=h2;e[g2?'startOffset':'endOffset']=i2;}i(true);i();var y=D.createRng();y.setStart(e.startContainer,e.startOffset);if(e.endContainer){y.setEnd(e.endContainer,e.endOffset);}return z.normalizeRange(y);};var C={createBookmark:A,resolveBookmark:B};var E=h.DOM;var F=function(e,i){var y;var g2=i.parentNode;if(g2.nodeName==='LI'&&g2.firstChild===i){y=g2.previousSibling;if(y&&y.nodeName==='LI'){y.appendChild(i);if($.isEmpty(e,g2)){E.remove(g2);}}else{E.setStyle(g2,'listStyleType','none');}}if($.isListNode(g2)){y=g2.previousSibling;if(y&&y.nodeName==='LI'){y.appendChild(i);}}};var G=function(e,i){f.each(f.grep(e.select('ol,ul',i)),function(y){F(e,y);});};var H={normalizeList:F,normalizeLists:G};var I=tinymce.util.Tools.resolve('tinymce.dom.DomQuery');var J=function(e){var i=e.selection.getStart(true);return e.dom.getParent(i,'OL,UL,DL',P(e,i));};var K=function(e,i){return e&&i.length===1&&i[0]===e;};var L=function(e){return f.grep(e.querySelectorAll('ol,ul,dl'),function(i){return $.isListNode(i);});};var M=function(e){var i=J(e);var y=e.selection.getSelectedBlocks();if(K(i,y)){return L(i);}else{return f.grep(y,function(g2){return $.isListNode(g2)&&i!==g2;});}};var N=function(e,i){var y=f.map(i,function(g2){var h2=e.dom.getParent(g2,'li,dd,dt',P(e,g2));return h2?h2:g2;});return I.unique(y);};var O=function(e){var i=e.selection.getSelectedBlocks();return f.grep(N(e,i),function(y){return $.isListItemNode(y);});};var P=function(e,i){var y=e.dom.getParents(i,'TD,TH');var g2=y.length>0?y[0]:e.getBody();return g2;};var Q={getParentList:J,getSelectedSubLists:M,getSelectedListItems:O,getClosestListRootElm:P};var R=tinymce.util.Tools.resolve('tinymce.Env');var S=h.DOM;var T=function(e,i,y){var g2,h2;var i2=S.createFragment();var j2;var k2=e.schema.getBlockElements();if(e.settings.forced_root_block){y=y||e.settings.forced_root_block;}if(y){h2=S.create(y);if(h2.tagName===e.settings.forced_root_block){S.setAttribs(h2,e.settings.forced_root_block_attrs);}if(!$.isBlock(i.firstChild,k2)){i2.appendChild(h2);}}if(i){while(g2=i.firstChild){var l2=g2.nodeName;if(!j2&&(l2!=='SPAN'||g2.getAttribute('data-mce-type')!=='bookmark')){j2=true;}if($.isBlock(g2,k2)){i2.appendChild(g2);h2=null;}else{if(y){if(!h2){h2=S.create(y);i2.appendChild(h2);}h2.appendChild(g2);}else{i2.appendChild(g2);}}}}if(!e.settings.forced_root_block){i2.appendChild(S.create('br'));}else{if(!j2&&(!R.ie||R.ie>10)){h2.appendChild(S.create('br',{'data-mce-bogus':'1'}));}}return i2;};var U={createNewTextBlock:T};var V=h.DOM;var W=function(e,i,y,g2){var h2,i2,j2,k2;var l2=function(m2){f.each(j2,function(k2){m2.parentNode.insertBefore(k2,y.parentNode);});V.remove(m2);};j2=V.select('span[data-mce-type="bookmark"]',i);g2=g2||U.createNewTextBlock(e,y);h2=V.createRng();h2.setStartAfter(y);h2.setEndAfter(i);i2=h2.extractContents();for(k2=i2.firstChild;k2;k2=k2.firstChild){if(k2.nodeName==='LI'&&e.dom.isEmpty(k2)){V.remove(k2);break;}}if(!e.dom.isEmpty(i2)){V.insertAfter(i2,i);}V.insertAfter(g2,i);if($.isEmpty(e.dom,y.parentNode)){l2(y.parentNode);}V.remove(y);if($.isEmpty(e.dom,i)){V.remove(i);}};var X={splitList:W};var Y=h.DOM;var Z=function(e,i){if($.isEmpty(e,i)){Y.remove(i);}};var _=function(e,i){var y=i.parentNode;var g2,h2;if(y){g2=y.parentNode;}else{Z(e.dom,i);return true;}if(y===e.getBody()){return true;}if(i.nodeName==='DD'){Y.rename(i,'DT');return true;}if($.isFirstChild(i)&&$.isLastChild(i)){if(g2.nodeName==='LI'){Y.insertAfter(i,g2);Z(e.dom,g2);Y.remove(y);}else if($.isListNode(g2)){Y.remove(y,true);}else{g2.insertBefore(U.createNewTextBlock(e,i),y);Y.remove(y);}return true;}else if($.isFirstChild(i)){if(g2.nodeName==='LI'){Y.insertAfter(i,g2);i.appendChild(y);Z(e.dom,g2);}else if($.isListNode(g2)){g2.insertBefore(i,y);}else{g2.insertBefore(U.createNewTextBlock(e,i),y);Y.remove(i);}return true;}else if($.isLastChild(i)){if(g2.nodeName==='LI'){Y.insertAfter(i,g2);}else if($.isListNode(g2)){Y.insertAfter(i,y);}else{Y.insertAfter(U.createNewTextBlock(e,i),y);Y.remove(i);}return true;}if(g2.nodeName==='LI'){y=g2;h2=U.createNewTextBlock(e,i,'LI');}else if($.isListNode(g2)){h2=U.createNewTextBlock(e,i,'LI');}else{h2=U.createNewTextBlock(e,i);}X.splitList(e,y,i,h2);H.normalizeLists(e.dom,y.parentNode);return true;};var a1=function(e){var g2=Q.getSelectedListItems(e);if(g2.length){var h2=C.createBookmark(e.selection.getRng());var i=void 0,y=void 0;var i2=Q.getClosestListRootElm(e,e.selection.getStart(true));i=g2.length;while(i--){var j2=g2[i].parentNode;while(j2&&j2!==i2){y=g2.length;while(y--){if(g2[y]===j2){g2.splice(i,1);break;}}j2=j2.parentNode;}}for(i=0;i<g2.length;i++){if(!_(e,g2[i])&&i===0){break;}}e.selection.setRng(C.resolveBookmark(h2));e.nodeChanged();return true;}};var b1={outdent:_,outdentSelection:a1};var c1=function(e,i,y){var g2=y['list-style-type']?y['list-style-type']:null;e.setStyle(i,'list-style-type',g2);};var d1=function(e,i){f.each(i,function(y,g2){e.setAttribute(g2,y);});};var e1=function(e,i,y){d1(i,y['list-attributes']);f.each(e.select('li',i),function(li){d1(li,y['list-item-attributes']);});};var f1=function(e,i,y){c1(e,i,y);e1(e,i,y);};var g1=function(e,i,y){f.each(y,function(g2){return e.setStyle(i,(_a={},_a[g2]='',_a));var _a;});};var h1=function(e,i,y,g2){var h2,i2;h2=i[y?'startContainer':'endContainer'];i2=i[y?'startOffset':'endOffset'];if(h2.nodeType===1){h2=h2.childNodes[Math.min(i2,h2.childNodes.length-1)]||h2;}if(!y&&$.isBr(h2.nextSibling)){h2=h2.nextSibling;}while(h2.parentNode!==g2){if($.isTextBlock(e,h2)){return h2;}if(/^(TD|TH)$/.test(h2.parentNode.nodeName)){return h2;}h2=h2.parentNode;}return h2;};var i1=function(e,i,y){var g2=[],h2=e.dom;var i2=h1(e,i,true,y);var j2=h1(e,i,false,y);var k2;var l2=[];for(var m2=i2;m2;m2=m2.nextSibling){l2.push(m2);if(m2===j2){break;}}f.each(l2,function(m2){if($.isTextBlock(e,m2)){g2.push(m2);k2=null;return;}if(h2.isBlock(m2)||$.isBr(m2)){if($.isBr(m2)){h2.remove(m2);}k2=null;return;}var n2=m2.nextSibling;if(d.isBookmarkNode(m2)){if($.isTextBlock(e,n2)||!n2&&m2.parentNode===y){k2=null;return;}}if(!k2){k2=h2.create('p');m2.parentNode.insertBefore(k2,m2);g2.push(k2);}k2.appendChild(m2);});return g2;};var j1=function(e,i,y){var g2=e.getStyle(i,'list-style-type');var h2=y?y['list-style-type']:'';h2=h2===null?'':h2;return g2===h2;};var k1=function(e,i,y){if(y===void 0){y={};}var g2=e.selection.getRng(true);var h2;var i2='LI';var j2=Q.getClosestListRootElm(e,e.selection.getStart(true));var k2=e.dom;if(k2.getContentEditable(e.selection.getNode())==='false'){return;}i=i.toUpperCase();if(i==='DL'){i2='DT';}h2=C.createBookmark(g2);f.each(i1(e,g2,j2),function(l2){var m2,n2;n2=l2.previousSibling;if(n2&&$.isListNode(n2)&&n2.nodeName===i&&j1(k2,n2,y)){m2=n2;l2=k2.rename(l2,i2);n2.appendChild(l2);}else{m2=k2.create(i);l2.parentNode.insertBefore(m2,l2);m2.appendChild(l2);l2=k2.rename(l2,i2);}g1(k2,l2,['margin','margin-right','margin-bottom','margin-left','margin-top','padding','padding-right','padding-bottom','padding-left','padding-top']);f1(k2,m2,y);q1(e.dom,m2);});e.selection.setRng(C.resolveBookmark(h2));};var l1=function(e){var i=C.createBookmark(e.selection.getRng(true));var y=Q.getClosestListRootElm(e,e.selection.getStart(true));var g2=Q.getSelectedListItems(e);var h2=f.grep(g2,function(li){return e.dom.isEmpty(li);});g2=f.grep(g2,function(li){return!e.dom.isEmpty(li);});f.each(h2,function(li){if($.isEmpty(e.dom,li)){b1.outdent(e,li);return;}});f.each(g2,function(li){var i2,j2;if(li.parentNode===e.getBody()){return;}for(i2=li;i2&&i2!==y;i2=i2.parentNode){if($.isListNode(i2)){j2=i2;}}X.splitList(e,j2,li);H.normalizeLists(e.dom,j2.parentNode);});e.selection.setRng(C.resolveBookmark(i));};var m1=function(e,i){return e&&i&&$.isListNode(e)&&e.nodeName===i.nodeName;};var n1=function(e,i,y){var g2=e.getStyle(i,'list-style-type',true);var h2=e.getStyle(y,'list-style-type',true);return g2===h2;};var o1=function(e,i){return e.className===i.className;};var p1=function(e,i,y){return m1(i,y)&&n1(e,i,y)&&o1(i,y);};var q1=function(e,i){var y,g2;y=i.nextSibling;if(p1(e,i,y)){while(g2=y.firstChild){i.appendChild(g2);}e.remove(y);}y=i.previousSibling;if(p1(e,i,y)){while(g2=y.lastChild){i.insertBefore(g2,i.firstChild);}e.remove(y);}};var r1=function(e,i,y,g2){if(i.nodeName!==y){var h2=e.rename(i,y);f1(e,h2,g2);}else{f1(e,i,g2);}};var s1=function(e,i,l,y,g2){if(i.nodeName===y&&!t1(g2)){l1(e);}else{var h2=C.createBookmark(e.selection.getRng(true));f.each([i].concat(l),function(i2){r1(e.dom,i2,y,g2);});e.selection.setRng(C.resolveBookmark(h2));}};var t1=function(e){return'list-style-type'in e;};var u1=function(e,i,y,g2){if(i===e.getBody()){return;}if(i){if(i.nodeName===y&&!t1(g2)){l1(e);}else{var h2=C.createBookmark(e.selection.getRng(true));f1(e.dom,i,g2);q1(e.dom,e.dom.rename(i,y));e.selection.setRng(C.resolveBookmark(h2));}}else{k1(e,y,g2);}};var v1=function(e,i,y){var g2=Q.getParentList(e);var h2=Q.getSelectedSubLists(e);y=y?y:{};if(g2&&h2.length>0){s1(e,g2,h2,i,y);}else{u1(e,g2,i,y);}};var w1={toggleList:v1,removeList:l1,mergeWithAdjacentLists:q1};var x1=function(e,i,y,g2){var h2=i.startContainer;var i2=i.startOffset;var j2,k2;if(h2.nodeType===3&&(y?i2<h2.data.length:i2>0)){return h2;}j2=e.schema.getNonEmptyElements();if(h2.nodeType===1){h2=a.getNode(h2,i2);}k2=new b(h2,g2);if(y){if($.isBogusBr(e.dom,h2)){k2.next();}}while(h2=k2[y?'next':'prev2']()){if(h2.nodeName==='LI'&&!h2.hasChildNodes()){return h2;}if(j2[h2.nodeName]){return h2;}if(h2.nodeType===3&&h2.data.length>0){return h2;}}};var y1=function(e,i){var y=i.childNodes;return y.length===1&&!$.isListNode(y[0])&&e.isBlock(y[0]);};var z1=function(e,i){if(y1(e,i)){e.remove(i.firstChild,true);}};var A1=function(e,i,y){var g2,h2;h2=y1(e,y)?y.firstChild:y;z1(e,i);if(!$.isEmpty(e,i,true)){while(g2=i.firstChild){h2.appendChild(g2);}}};var B1=function(e,i,y){var g2,h2;var ul=i.parentNode;if(!$.isChildOfBody(e,i)||!$.isChildOfBody(e,y)){return;}if($.isListNode(y.lastChild)){h2=y.lastChild;}if(ul===y.lastChild){if($.isBr(ul.previousSibling)){e.remove(ul.previousSibling);}}g2=y.lastChild;if(g2&&$.isBr(g2)&&i.hasChildNodes()){e.remove(g2);}if($.isEmpty(e,y,true)){e.$(y).empty();}A1(e,i,y);if(h2){y.appendChild(h2);}e.remove(i);if($.isEmpty(e,ul)&&ul!==e.getRoot()){e.remove(ul);}};var C1=function(e,i,y){e.dom.$(y).empty();B1(e.dom,i,y);e.selection.setCursorLocation(y);};var D1=function(e,i,y,g2){var h2=e.dom;if(h2.isEmpty(g2)){C1(e,y,g2);}else{var i2=C.createBookmark(i);B1(h2,y,g2);e.selection.setRng(C.resolveBookmark(i2));}};var E1=function(e,i,y,g2){var h2=C.createBookmark(i);B1(e.dom,y,g2);var i2=C.resolveBookmark(h2);e.selection.setRng(i2);};var F1=function(e,i){var y=e.dom,g2=e.selection;var h2=g2.getStart();var i2=Q.getClosestListRootElm(e,h2);var li=y.getParent(g2.getStart(),'LI',i2);var ul,l2,m2;if(li){ul=li.parentNode;if(ul===e.getBody()&&$.isEmpty(y,ul)){return true;}l2=z.normalizeRange(g2.getRng(true));m2=y.getParent(x1(e,l2,i,i2),'LI',i2);if(m2&&m2!==li){if(i){D1(e,l2,m2,li);}else{E1(e,l2,li,m2);}return true;}else if(!m2){if(!i&&w1.removeList(e)){return true;}}}return false;};var G1=function(e,i,y){var g2=e.getParent(i.parentNode,e.isBlock,y);e.remove(i);if(g2&&e.isEmpty(g2)){e.remove(g2);}};var H1=function(e,i){var y=e.dom;var g2=e.selection.getStart();var h2=Q.getClosestListRootElm(e,g2);var i2=y.getParent(g2,y.isBlock,h2);if(i2&&y.isEmpty(i2)){var j2=z.normalizeRange(e.selection.getRng(true));var k2=y.getParent(x1(e,j2,i,h2),'LI',h2);if(k2){e.undoManager.transact(function(){G1(y,i2,h2);w1.mergeWithAdjacentLists(y,k2.parentNode);e.selection.select(k2,true);e.selection.collapse(i);});return true;}}return false;};var I1=function(e,i){return F1(e,i)||H1(e,i);};var J1=function(e){var i=e.selection.getStart();var y=Q.getClosestListRootElm(e,i);var g2=e.dom.getParent(i,'LI,DT,DD',y);if(g2||Q.getSelectedListItems(e).length>0){e.undoManager.transact(function(){e.execCommand('Delete');H.normalizeLists(e.dom,e.getBody());});return true;}return false;};var K1=function(e,i){return e.selection.isCollapsed()?I1(e,i):J1(e);};var L1=function(i){i.on('keydown',function(e){if(e.keyCode===c.BACKSPACE){if(K1(i,false)){e.preventDefault();}}else if(e.keyCode===c.DELETE){if(K1(i,true)){e.preventDefault();}}});};var M1={setup:L1,backspaceDelete:K1};var N1=function(e){return{backspaceDelete:function(i){M1.backspaceDelete(e,i);}};};var O1={get:N1};var P1=h.DOM;var Q1=function(e,i){var y;if($.isListNode(e)){while(y=e.firstChild){i.appendChild(y);}P1.remove(e);}};var R1=function(e){var i,y,g2;if(e.nodeName==='DT'){P1.rename(e,'DD');return true;}i=e.previousSibling;if(i&&$.isListNode(i)){i.appendChild(e);return true;}if(i&&i.nodeName==='LI'&&$.isListNode(i.lastChild)){i.lastChild.appendChild(e);Q1(e.lastChild,i.lastChild);return true;}i=e.nextSibling;if(i&&$.isListNode(i)){i.insertBefore(e,i.firstChild);return true;}i=e.previousSibling;if(i&&i.nodeName==='LI'){y=P1.create(e.parentNode.nodeName);g2=P1.getStyle(e.parentNode,'listStyleType');if(g2){P1.setStyle(y,'listStyleType',g2);}i.appendChild(y);y.appendChild(e);Q1(e.lastChild,y);return true;}return false;};var S1=function(e){var y=Q.getSelectedListItems(e);if(y.length){var g2=C.createBookmark(e.selection.getRng(true));for(var i=0;i<y.length;i++){if(!R1(y[i])&&i===0){break;}}e.selection.setRng(C.resolveBookmark(g2));e.nodeChanged();return true;}};var T1={indentSelection:S1};var U1=function(e,i){return function(){var y=e.dom.getParent(e.selection.getStart(),'UL,OL,DL');return y&&y.nodeName===i;};};var V1=function(i){i.on('BeforeExecCommand',function(e){var y=e.command.toLowerCase();var g2;if(y==='indent'){if(T1.indentSelection(i)){g2=true;}}else if(y==='outdent'){if(b1.outdentSelection(i)){g2=true;}}if(g2){i.fire('ExecCommand',{command:e.command});e.preventDefault();return true;}});i.addCommand('InsertUnorderedList',function(e,y){w1.toggleList(i,'UL',y);});i.addCommand('InsertOrderedList',function(e,y){w1.toggleList(i,'OL',y);});i.addCommand('InsertDefinitionList',function(e,y){w1.toggleList(i,'DL',y);});i.addQueryStateHandler('InsertUnorderedList',U1(i,'UL'));i.addQueryStateHandler('InsertOrderedList',U1(i,'OL'));i.addQueryStateHandler('InsertDefinitionList',U1(i,'DL'));};var W1={register:V1};var X1=function(e){return e.getParam('lists_indent_on_tab',true);};var Y1={shouldIndentOnTab:X1};var Z1=function(i){i.on('keydown',function(e){if(e.keyCode!==c.TAB||c.metaKeyPressed(e)){return;}if(i.dom.getParent(i.selection.getStart(),'LI,DT,DD')){e.preventDefault();if(e.shiftKey){b1.outdentSelection(i);}else{T1.indentSelection(i);}}});};var $1=function(e){if(Y1.shouldIndentOnTab(e)){Z1(e);}M1.setup(e);};var _1={setup:$1};var a2=function(e,i){for(var y=0;y<e.length;y++){var g2=e[y];if(i(g2)){return y;}}return-1;};var b2=function(i,y){return function(e){var g2=e.control;i.on('NodeChange',function(e){var h2=a2(e.parents,$.isTableCellNode);var i2=h2!==-1?e.parents.slice(0,h2):e.parents;var l=f.grep(i2,$.isListNode);g2.active(l.length>0&&l[0].nodeName===y);});};};var c2=function(i){return function(e){var y=e.control;i.on('nodechange',function(){var g2=Q.getSelectedListItems(i);var h2=g2.length>0&&$.isFirstChild(g2[0]);y.disabled(h2);});};};var d2=function(e){var i=function(e,y){var g2=e.settings.plugins?e.settings.plugins:'';return f.inArray(g2.split(/[ ,]/),y)!==-1;};if(!i(e,'advlist')){e.addButton('numlist',{active:false,title:'Numbered list',cmd:'InsertOrderedList',onPostRender:b2(e,'OL')});e.addButton('bullist',{active:false,title:'Bullet list',cmd:'InsertUnorderedList',onPostRender:b2(e,'UL')});}e.addButton('indent',{icon:'indent',title:'Increase indent',cmd:'Indent',onPostRender:c2(e)});};var e2={register:d2};g.add('lists',function(e){_1.setup(e);e2.register(e);W1.register(e);return O1.get(e);});function f2(){}return f2;}());})();