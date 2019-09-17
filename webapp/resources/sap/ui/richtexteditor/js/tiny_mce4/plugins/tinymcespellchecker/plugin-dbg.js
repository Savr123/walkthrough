/* Ephox Spell Checker Pro
 *
 * Copyright 2010-2016 Ephox Corporation.  All rights reserved.
 *
 * Version: 0.10.0-61
 */

!function(){"use strict";var e=function(e,n){return function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];var o=e.console;o&&n in o&&o[n].apply(o,arguments)}},n={log:e(window,"log"),error:e(window,"error"),warn:e(window,"warm")},t=function(e){return parseInt(e,10)},r=function(e){return function(){return e}},o=function(e,n,t){return{major:r(e),minor:r(n),patch:r(t)}},i=function(e,n){var t=e-n;return 0===t?0:t>0?1:-1},a=function(e){var n=/([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);return n?o(t(n[1]),t(n[2]),t(n[3])):o(0,0,0)},c=function(e,n){var t=i(e.major(),n.major());if(0!==t)return t;var r=i(e.minor(),n.minor());if(0!==r)return r;var o=i(e.patch(),n.patch());return 0!==o?o:0},s=function(e){return e?a([(n=e).majorVersion,n.minorVersion].join(".").split(".").slice(0,3).join(".")):null;var n},l=function(e,n){return c(s(e),a(n))<0},u=tinymce.util.JSON,d="tinyMCESpellingCache",f={supported:function(){function e(){var e=sessionStorage.getItem(d);return e?u.parse(e):{}}return{read:function(n,t){var r=e()[n];return t(void 0!==r?r:{})},use:function(n,t){var r=e(),o=r[n];void 0===o&&(r[n]={},o=r[n]);var i,a,c=t(o);return i=r,a=u.serialize(i),sessionStorage.setItem(d,a),c}}},unsupported:function(){var e={};return{read:function(n,t){return t(void 0!==e[n]?e[n]:{})},use:function(n,t){var r=void 0!==e[n]?e[n]:{};return e[n]=r,t(r)}}}};function g(e){var n="undefined"!=typeof Storage&&null!==sessionStorage?f.supported():f.unsupported(),t=5;function r(e){return e.replace(/\uFEFF/g,"")}function o(e,t,o,i){n.use(e,function(e){e[r(t)]={misspelled:o,suggestions:i}})}function i(e,o){return n.read(e,function(e){var n,i=e[r(o)];return void 0!==i&&i.suggestions&&i.suggestions.length>t&&((n=i).suggestions=n.suggestions.slice(0,t)),i})}function a(n){for(var t=0;t<n.length;t++)i(e.settings.spellchecker_language,n[t].cleaned)||o(e.settings.spellchecker_language,n[t].cleaned,!1,[])}return{addWordToCache:o,retrieveWordFromCache:i,getCachedCleanedWords:function(n){for(var t={},o=[],a=[],c=0;c<n.length;c++){var s=i(e.settings.spellchecker_language,n[c]);s&&s.misspelled&&(t[n[c]]=s),s||(o.push({original:n[c],cleaned:r(n[c])}),a.push(r(n[c])))}return{cachedData:t,wordsToCheck:o,cleanedWordsForServer:a}},cacheAndCombineResults:function(n,t,r){var i={};for(var c in n)n[c]&&n[c].misspelled&&(i[c]=n[c].suggestions);for(var s in t){o(e.settings.spellchecker_language,s,!0,t[s]);for(var l=0;l<r.length;l++)if(r[l].cleaned===s){i[r[l].original]=t[s];break}}return a(r),i},cacheCorrectlySpelledWords:a}}var h=tinymce.util.Tools,p=tinymce.util.Tools;function m(e,n){function t(e){var n=e.getAttribute("data-mce-index");return"number"==typeof n?""+n:n}function r(e){for(var n=e.parentNode,t=e.childNodes;t.length>0;)n.insertBefore(t[0],e);e.parentNode.removeChild(e)}function o(n,t){for(var o=e.dom.select("span."+t,n),i=0;i<o.length;i++)r(o[i])}return{getElmIndex:t,findSpansByIndex:function(e,n){var r,o=[];if((r=p.toArray(n.getElementsByTagName("span"))).length)for(var i=0;i<r.length;i++){var a=t(r[i]);null!==a&&a.length&&a===e.toString()&&o.push(r[i])}return o},markErrors:function(t,r,i,a){o(r,i);var c=a.find(n,void 0,r);c=a.filter(c,function(e){return!!t[e.text]}),a.wrap(c,function(n){return e.dom.create("span",{class:i,"data-mce-bogus":1,"data-mce-word":n.text})},r)},unwrapWordNode:r,clearWordMarks:o}}var v=tinymce.util,k=v.JSON,x=v.URI,y=v.XHR;function N(e,n){var t,r,o=15e3,i="/1/correction",a=0,c=5,s=function(e,n){var t=(-1===e.indexOf("?")?"?":"&")+"apiKey="+encodeURIComponent(n);return"string"==typeof n?e+t:e};function l(t,r,o){var a={url:new x(n).toAbsolute(s(e.settings.spellchecker_rpc_url+i,u())),type:"post",content_type:"application/json",data:k.serialize(t),success:function(e){var n=k.parse(e);n?r(n):o("Server response wasn't valid json.")},error:function(){o(tinymce.translate(["The spelling service was not found: ({0})",e.settings.spellchecker_rpc_url]))}},c=u();c&&(a.requestheaders=[{key:"tiny-api-key",value:c}]),e.settings.spellchecker_rpc_url?y.send(a):o("You need to specify the spellchecker_rpc_url setting.")}function u(){return e.settings.api_key||e.settings.spellchecker_api_key}return{spellcheck:function(n,i,s,u,d){var f=u.getCachedCleanedWords(d.filter(n));if(!(a>c)){var g,h,p,m,v=function(e){!function(e,n,o,i,a){if(t.push(e),t.length===r){var c=function(e){for(var n={},t=0;t<e.length;t++)for(var r in e[t].spell)n[r]=e[t].spell[r];return n}(t),s=a.cacheAndCombineResults(n.cachedData,c,n.wordsToCheck);i(s,o)}}(e,f,i,s,u)},k=function(n){var t;t=n,e.setProgressState(!1),e.notificationManager.open({text:t,type:"error"}),a++};if(f.wordsToCheck.length>0)for(var x=function(n){for(var i=0,a=0,c=[],s=0;s<n.length;s++)(i+=n[s].length)>o&&(c.push({words:n.slice(a,s+1),language:e.settings.spellchecker_language}),a=s+1,i=0);return a!==n.length&&c.push({words:n.slice(a,n.length),language:e.settings.spellchecker_language}),r=c.length,t=[],c}(f.cleanedWordsForServer),y=0;y<x.length;y++)g=x[y],h=v,p=k,("function"==typeof(m=e.settings.spellchecker_handler)?m:l)(g,h,p);else{var N=u.cacheAndCombineResults(f.cachedData,[],f.wordsToCheck);s(N,i)}}}}}var b={fireIgnore:function(e,n){e.fire("SpellcheckerIgnore",{word:n})},fireIgnoreAll:function(e,n){e.fire("SpellcheckerIgnoreAll",{word:n})}},C=tinymce.util.Tools,w=tinymce.dom.DOMUtils.DOM,I={replace:function(e,n,t){if(n.length>0){var r=document.createTextNode(t);return n[0].parentNode.replaceChild(r,n[0]),o=e,i=C.grep(n).slice(1),C.each(i,function(e){var n=function(e,n){for(var t=[];(e=e.parentNode)&&e!==n;)t.push(e);return t}(e,o);w.remove(e),C.each(n,function(e){w.isEmpty(e)&&w.remove(e,!0)})}),r}var o,i;return null}};function _(e){return e&&1===e.nodeType&&"false"===e.contentEditable}function S(e,n){var t,r,o,i,a=e.dom,c="mce-spellchecker-ignore";function s(e,n){if(!e[0])throw new Error("findAndReplaceDOMText cannot handle zero-length matches");return{start:e.index,end:e.index+e[0].length,text:e[0],data:n}}function l(e){var n;if(3===e.nodeType)return e.data;if(o[e.nodeName]&&!r[e.nodeName])return"";if(_(e))return"\n";if(n="",(r[e.nodeName]||i[e.nodeName])&&(n+="\n"),e=e.firstChild)do{n+=l(e)}while(e=e.nextSibling);return n}function u(e,n){for(var t=0,r=e.length;t<r&&!1!==n(e[t],t);t++);return this}return r=e.schema.getBlockElements(),o=e.schema.getWhiteSpaceElements(),i=e.schema.getShortEndedElements(),{getText:l,getWords:function(e){var t=l(e).match(n);return t?function(e){function n(e,n){for(var t=0;t<e.length;t++)if(e[t]===n)return!0;return!1}for(var t=[],r=0;r<e.length;r++)n(t,e[r])||t.push(e[r]);return t}(t):[]},each:u,filter:function(e,n){var t=[];return u(e,function(e,r){n(e,r)&&t.push(e)}),e=t,t},find:function(e,n,r){var o=[],i=l(r);if(i&&e.global)for(;t=e.exec(i);)o.push(s(t,n));return o},wrap:function(e,n,t){return e.length&&function(e,n,t){var a,s,l,u,d,f=[],g=0,h=e,p=0;(n=n.slice(0)).sort(function(e,n){return e.start-n.start}),d=n.shift();e:for(;;){if((r[h.nodeName]||i[h.nodeName]||_(h))&&g++,3===h.nodeType&&(!s&&h.length+g>=d.end?(s=h,u=d.end-g):a&&f.push(h),!a&&h.length+g>d.start&&(a=h,l=d.start-g),g+=h.length),a&&s){for(var m=!1,v=a;v!==e;v=v.parentNode)v.className===c&&(m=!0);if(m||(h=t({startNode:a,startNodeIndex:l,endNode:s,endNodeIndex:u,innerNodes:f,match:d.text,matchIndex:p}),g-=s.length-u),a=null,s=null,f=[],p++,!(d=n.shift()))break}else if(o[h.nodeName]&&!r[h.nodeName]||!h.firstChild){if(h.nextSibling){h=h.nextSibling;continue}}else if(!_(h)){h=h.firstChild;continue}for(;;){if(h.nextSibling){h=h.nextSibling;break}if(h.parentNode===e)break e;h=h.parentNode}}}(t,e,function(e,n){function t(t,r){var o=e[r];o.stencil||(o.stencil=n(o));var i=o.stencil.cloneNode(!1);return i.setAttribute("data-mce-index",r),t&&i.appendChild(a.doc.createTextNode(t)),i}return function(e){var n,r,o,i=e.startNode,c=e.endNode,s=e.matchIndex,l=a.doc;if(i===c){var u=i;o=u.parentNode,e.startNodeIndex>0&&(n=l.createTextNode(u.data.substring(0,e.startNodeIndex)),o.insertBefore(n,u));var d=t(e.match,s);return o.insertBefore(d,u),e.endNodeIndex<u.length&&(r=l.createTextNode(u.data.substring(e.endNodeIndex)),o.insertBefore(r,u)),u.parentNode.removeChild(u),d}n=l.createTextNode(i.data.substring(0,e.startNodeIndex)),r=l.createTextNode(c.data.substring(e.endNodeIndex));for(var f=t(i.data.substring(e.startNodeIndex),s),g=[],h=0,p=e.innerNodes.length;h<p;++h){var m=e.innerNodes[h],v=t(m.data,s);m.parentNode.replaceChild(v,m),g.push(v)}var k=t(c.data.substring(0,e.endNodeIndex),s);return(o=i.parentNode).insertBefore(n,i),o.insertBefore(f,i),o.removeChild(i),(o=c.parentNode).insertBefore(k,c),o.insertBefore(r,c),o.removeChild(c),k}}(e,n)),this},indexOf:function(e,n){for(var t=e.length;t--;)if(e[t]===n)return t;return-1}}}var B=tinymce.util.Tools,T=tinymce.dom.DOMUtils,E=tinymce.ui.Factory,M=function(e,n){for(var t=e.getBody(),r=t,o=e.schema.getBlockElements();n!==t&&null!==n&&void 0!==n;n=n.parentNode)if(o[n.nodeName]){r=n;break}return r},W=function(e,n,t,r){if(!1===e.selection.isCollapsed())return n;var o,i,a,c=n;return i=t,a=(o=e).getBody(),o.$.contains(a,i)||a===i?c===(n=M(e,t))?n:(c&&r(c),n):n},R=function(e,n,t,r,o){var i,a,c,s,l,u="mce-spellchecker-word",d="mce-spellchecker-ignore",f="data-mce-word",g=m(e,o),h=e.getParam("spellchecker_active"),p=!1!==h||h;function v(n,t){if(e.selection){var r=e.selection.getBookmark();g.markErrors(n,t,u,x()),e.selection.moveToBookmark(r)}}var k=N(e,r);function x(){return l||(l=S(e,o)),l}function y(n,r,o){e.selection.collapse(),o?(t.addWord(n),B.each(e.dom.select("span."+u),function(t){t.getAttribute(f)===n&&e.dom.remove(t,!0)})):B.each(r,function(e){e.className=d}),o?b.fireIgnoreAll(e,n):b.fireIgnore(e,n)}function C(e){k.spellcheck(x().getWords(e),e,v,n,t)}function w(n){C(n),e.focus()}function _(){i&&(i.remove(),i=void 0)}function R(n){if(37!==(n.which||n.keyCode)&&38!==(n.which||n.keyCode)&&39!==(n.which||n.keyCode)&&40!==(n.which||n.keyCode))if("ContextMenu"!==n.code){var t=e.selection.getNode();if(T.DOM.hasClass(t,u)||T.DOM.hasClass(t,d)){var r=M(e,t),o=g.getElmIndex(t),i=g.findSpansByIndex(o,r);if(i.length>0){for(var a=e.selection.getBookmark(),c=0;c<i.length;c++)g.unwrapWordNode(i[c]);e.selection.moveToBookmark(a)}}}else D(e.selection.getStart(),!0)&&(n.preventDefault(),n.stopImmediatePropagation())}function P(n){var t=e.selection.getNode(),r=M(e,t);32===(n.which||n.keyCode)&&w(r)}function D(t,r){if(T.DOM.hasClass(t,u)){var o=g.getElmIndex(t),a=g.findSpansByIndex(o,M(e,t));if(a.length>0){var c=e.dom.createRng();c.setStartBefore(a[0]),c.setEndAfter(a[a.length-1]),e.selection.setRng(c),function(t,r,o){var a=[],c=n.retrieveWordFromCache(e.settings.spellchecker_language,t).suggestions;B.each(c,function(n){a.push({text:n,onclick:function(){e.undoManager.transact(function(){var t,o,i=I.replace(e.getBody(),r,n);i&&(e.focus(),e.selection.setRng((t=i,(o=e.dom.createRng()).setStart(t,0),o.setEnd(t,t.data.length),o)))})}})}),a.push({text:"-"}),a.push.apply(a,[{text:"Ignore",onclick:function(){y(t,r)}},{text:"Ignore all",onclick:function(){y(t,r,!0)}}]),(i=E.create("menu",{items:a,context:"contextmenu",onautohide:function(e){-1!==e.target.className.indexOf("spellchecker")&&e.preventDefault()},onhide:function(){i.remove(),i=null}})).renderTo(document.body);var s=T.DOM.getPos(e.getContentAreaContainer()),l=e.dom.getPos(r[0]),u=e.dom.getRoot();"BODY"===u.nodeName?(l.x-=u.ownerDocument.documentElement.scrollLeft||u.scrollLeft,l.y-=u.ownerDocument.documentElement.scrollTop||u.scrollTop):(l.x-=u.scrollLeft,l.y-=u.scrollTop),s.x+=l.x,s.y+=l.y,i.moveTo(s.x,s.y+r[0].offsetHeight),o&&i.items()[0].focus()}(t.getAttribute(f),a,r)}return!0}return!1}function A(){e.on("remove",_),e.on("keydown",R),e.on("keyup",P),e.on("nodechange",F)}function F(n){n.selectionChange||(a=W(e,a,n.element,w))}return e.on("contextmenu",function(e){D(e.target,!1)&&(e.preventDefault(),e.stopImmediatePropagation())},!0),e.on("init",function(){e.settings.spellchecker_on_load&&setTimeout(function(){var n=e.getBody();n&&C(n)},1e3)}),p&&A(),{languageMenuItemClick:function(n){e.settings.spellchecker_language=n,p&&w(e.getBody())},spellcheck:function(){p?(e.off("remove",_),e.off("keydown",R),e.off("keyup",P),e.off("nodechange",F),g.clearWordMarks(e.getBody(),u)):(A(),w(e.getBody())),p=!p,c&&c.active(p),s&&s.active(p)},spellcheckButtonPostRender:function(e){(c=e.control).active(p)},spellcheckMenuItemPostRender:function(e){s=e.control,e.control.on("show",function(){this.active(p)}),s.active(p)}}},P={open:function(e,n){return e.windowManager.open({layout:"flex",align:"stretch",direction:"column",title:"Spellcheck",spacing:10,padding:10,callbacks:n,minWidth:350,items:[{type:"label",name:"textlabel",text:"Misspelled word"},{type:"textbox",name:"text",ariaLabel:"Misspelled word",spellcheck:!1},{type:"label",name:"suggestionslabel",text:"Suggestions"},{type:"container",layout:"flex",direction:"row",align:"stretch",spacing:10,items:[{type:"selectbox",name:"suggestions",ariaLabel:"Suggestion",minWidth:150,flex:1,size:6,border:1},{type:"container",layout:"flex",flex:1,spacing:5,direction:"column",pack:"center",align:"stretch",items:[{type:"button",subtype:"primary",name:"change",text:"Change",onclick:"change"},{type:"button",name:"ignore",text:"Ignore",onclick:"ignore"},{type:"button",name:"ignoreall",text:"Ignore all",onclick:"ignoreall"}]}]}],onsubmit:function(e){e.preventDefault(),n.submit()},buttons:[{text:"Close",onclick:"close"}]})}},D=tinymce.util.Tools;function A(e,n,t,r,o){var i,a,c,s={},l="mce-match-marker",u="mce-match-marker-selected",d="data-mce-word",f=m(e,o);function g(n,t){f.markErrors(n,t,l,p()),e.setProgressState(!1),function(){var n=w();if(n){a&&a.active(!0),c&&c.active(!0);var t=_(n),r=v(t),o=B(n);e.dom.addClass(o,u),(i=P.open(e,y)).find("#text")[0].value(t),i.find("#suggestions")[0].options(r),i.find("#suggestions")[0].getEl().selectedIndex=0,i.find("#suggestions")[0].getEl().focus(),i.on("close",function(){a&&a.active(!1),c&&c.active(!1),i=void 0,f.clearWordMarks(e.getBody(),l)})}else{var s=tinymce.translate("No misspellings found.");e.notificationManager.open({text:s,type:"info",timeout:3e3})}}()}var h=N(e,r);function p(){return s.textMatcher||(s.textMatcher=S(e,o)),s.textMatcher}function v(t){return n.retrieveWordFromCache(e.settings.spellchecker_language,t).suggestions}function k(){var n,t=w(),r=_(t),o=B(t),a=i.find("#text")[0].value(),c=i.find("#suggestions")[0].getEl().value;a!==r?n=a:c&&(n=c),n&&(I.replace(e.getBody(),o,n),e.undoManager.add(),C())}function x(n){var r=w(),o=_(r),i=B(r);e.selection.collapse(),n?(t.addWord(o),D.each(e.dom.select("span."+l),function(n){n.getAttribute(d)===o&&e.dom.remove(n,!0)})):e.dom.remove(i,!0),n?b.fireIgnoreAll(e,o):b.fireIgnore(e,o),C()}var y={change:k,submit:k,ignore:function(){x(!1)},ignoreall:function(){x(!0)},close:function(){i.close()}};function C(){var n=w();if(n){var t=_(n);i.find("#text").value(t);var r=v(t),o=i.find("#suggestions")[0];o.options(r),o.getEl().selectedIndex=0,o.getEl().focus();var a=B(n);e.dom.addClass(a,u)}else i&&i.close()}function w(){return e.dom.select("span."+l)[0]}function _(e){return e.getAttribute(d)}function B(n){var t=f.getElmIndex(n);return f.findSpansByIndex(t,e.getBody())}return{languageMenuItemClick:function(n){e.settings.spellchecker_language=n},spellcheck:function(){e.setProgressState(!0),h.spellcheck(p().getWords(e.getBody()),e.getBody(),g,n,t)},spellcheckButtonPostRender:function(e){a=e.control},spellcheckMenuItemPostRender:function(e){c=e.control}}}var F=tinymce.PluginManager,O=tinymce.util.Tools;F.requireLangPack("tinymcespellchecker","ar,ca,cs,da,de,el,es,fa,fi,fr_FR,he_IL,hr,hu_HU,it,ja,kk,ko_KR,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,zh_CN,zh_TW"),F.add("tinymcespellchecker",function(e,t){if(l(tinymce,"4.2.8"))return n.error('The "tinymcespellchecker" plugin requires at least 4.2.8 version of TinyMCE.'),function(){};var r=e.getParam("spellchecker_wordchar_pattern")||new RegExp("[\\w'\\-\\u00C0-\\u00FF\\uFEFF\\u2018\\u2019]+","g");e.settings.spellchecker_language=e.settings.spellchecker_language||"en_us";var o,i,a=e.settings.spellchecker_languages||"US English=en_us,UK English=en_gb,Danish=da,Dutch=nl,Finnish=fi,French=fr,German=de,Italian=it,Norwegian=nb,Brazilian Portuguese=pt,Iberian Portuguese=pt_pt,Spanish=es,Swedish=sv",c=g(e),s=(o={},{addWord:i=function(e){o[e.toLowerCase()]=!0},addWords:function(e){h.each(e,i)},filter:function(e){return h.grep(e,function(e){return!o[e.toLowerCase()]})}});s.addWords(e.settings.spellchecker_whitelist);var u=e.getParam("spellchecker_dialog")?A(e,c,s,t,r):R(e,c,s,t,r);function d(n){var t=e.settings.spellchecker_language;O.each(n.control.items(),function(e){e.active(e.data.data===t)})}var f,p=(f=a.split(","),O.map(f,function(e){var n=e.split("=");return{selectable:!0,text:n[0],data:n[1],onclick:function(){u.languageMenuItemClick(n[1])}}})),m={tooltip:"Spellcheck",onclick:u.spellcheck,onPostRender:u.spellcheckButtonPostRender};p.length>1&&(m.type="splitbutton",m.menu=p,m.onshow=d),e.addButton("spellchecker",m),e.addCommand("mceSpellCheck",u.spellcheck),e.addMenuItem("spellchecker",{text:"Spellcheck",context:"tools",onclick:u.spellcheck,onPostRender:u.spellcheckMenuItemPostRender,selectable:!0}),e.addMenuItem("spellcheckerlanguage",{text:"Spellcheck Language",context:"tools",menu:p,onPostRender:function(e){e.control.on("show",function(e){d(e)})}})})}();