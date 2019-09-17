!function(){"use strict";var r=function(e){var t=e,n=function(){return t};return{get:n,set:function(e){t=e},clone:function(){return r(n())}}},e=tinymce.util.Tools.resolve("tinymce.PluginManager"),p=tinymce.util.Tools.resolve("tinymce.util.Tools");function h(e){return e&&1===e.nodeType&&"false"===e.contentEditable}var u={findAndReplaceDOMText:function(t,n,r,a,i){var o,d,v,f,p,g,c=[],l=0;function s(e,t){if(t=t||0,!e[0])throw new Error("findAndReplaceDOMText cannot handle zero-length matches");var n=e.index;if(0<t){var r=e[t];if(!r)throw new Error("Invalid capture group");n+=e[0].indexOf(r),e[0]=r}return[n,n+e[0].length,[e[0]]]}if(v=n.ownerDocument,f=i.getBlockElements(),p=i.getWhiteSpaceElements(),g=i.getShortEndedElements(),d=function e(t){var n;if(3===t.nodeType)return t.data;if(p[t.nodeName]&&!f[t.nodeName])return"";if(n="",h(t))return"\n";if((f[t.nodeName]||g[t.nodeName])&&(n+="\n"),t=t.firstChild)for(;n+=e(t),t=t.nextSibling;);return n}(n)){if(t.global)for(;o=t.exec(d);)c.push(s(o,a));else o=d.match(t),c.push(s(o,a));return c.length&&(l=c.length,function(e,t,n){var r,a,i,o,d=[],c=0,l=e,s=t.shift(),u=0;e:for(;;){if((f[l.nodeName]||g[l.nodeName]||h(l))&&c++,3===l.nodeType&&(!a&&l.length+c>=s[1]?(a=l,o=s[1]-c):r&&d.push(l),!r&&l.length+c>s[0]&&(r=l,i=s[0]-c),c+=l.length),r&&a){if(l=n({startNode:r,startNodeIndex:i,endNode:a,endNodeIndex:o,innerNodes:d,match:s[2],matchIndex:u}),c-=a.length-o,a=r=null,d=[],u++,!(s=t.shift()))break}else if(p[l.nodeName]&&!f[l.nodeName]||!l.firstChild){if(l.nextSibling){l=l.nextSibling;continue}}else if(!h(l)){l=l.firstChild;continue}for(;;){if(l.nextSibling){l=l.nextSibling;break}if(l.parentNode===e)break e;l=l.parentNode}}}(n,c,function(e){var m;if("function"!=typeof e){var r=e.nodeType?e:v.createElement(e);m=function(e,t){var n=r.cloneNode(!1);return n.setAttribute("data-mce-index",t),e&&n.appendChild(v.createTextNode(e)),n}}else m=e;return function(e){var t,n,r,a=e.startNode,i=e.endNode,o=e.matchIndex;if(a===i){var d=a;r=d.parentNode,0<e.startNodeIndex&&(t=v.createTextNode(d.data.substring(0,e.startNodeIndex)),r.insertBefore(t,d));var c=m(e.match[0],o);return r.insertBefore(c,d),e.endNodeIndex<d.length&&(n=v.createTextNode(d.data.substring(e.endNodeIndex)),r.insertBefore(n,d)),d.parentNode.removeChild(d),c}t=v.createTextNode(a.data.substring(0,e.startNodeIndex)),n=v.createTextNode(i.data.substring(e.endNodeIndex));for(var l=m(a.data.substring(e.startNodeIndex),o),s=[],u=0,f=e.innerNodes.length;u<f;++u){var p=e.innerNodes[u],g=m(p.data,o);p.parentNode.replaceChild(g,p),s.push(g)}var h=m(i.data.substring(0,e.endNodeIndex),o);return(r=a.parentNode).insertBefore(t,a),r.insertBefore(l,a),r.removeChild(a),(r=i.parentNode).insertBefore(h,i),r.insertBefore(n,i),r.removeChild(i),h}}(r))),l}}},g=function(e){var t=e.getAttribute("data-mce-index");return"number"==typeof t?""+t:t},m=function(e){var t=e.parentNode;e.firstChild&&t.insertBefore(e.firstChild,e),e.parentNode.removeChild(e)},o=function(e,t){var n,r=[];if((n=p.toArray(e.getBody().getElementsByTagName("span"))).length)for(var a=0;a<n.length;a++){var i=g(n[a]);null!==i&&i.length&&i===t.toString()&&r.push(n[a])}return r},f=function(e,t,n){var r=t.get(),a=e.dom;(n=!1!==n)?r++:r--,a.removeClass(o(e,t.get()),"mce-match-marker-selected");var i=o(e,r);return i.length?(a.addClass(o(e,r),"mce-match-marker-selected"),e.selection.scrollIntoView(i[0]),r):-1},v=function(e,t){var n=t.parentNode;e.remove(t),e.isEmpty(n)&&e.remove(n)},x=function(e,t){var n=f(e,t,!0);-1!==n&&t.set(n)},b=function(e,t){var n=f(e,t,!1);-1!==n&&t.set(n)},N=function(e){var t=g(e);return null!==t&&0<t.length},y=function(e,t,n){var r,a,i,o;for(a=p.toArray(e.getBody().getElementsByTagName("span")),r=0;r<a.length;r++){var d=g(a[r]);null!==d&&d.length&&(d===t.get().toString()&&(i||(i=a[r].firstChild),o=a[r].firstChild),m(a[r]))}if(i&&o){var c=e.dom.createRng();return c.setStart(i,0),c.setEnd(o,o.data.length),!1!==n&&e.selection.setRng(c),c}},k=function(e,t){return 0<o(e,t.get()+1).length},C=function(e,t){return 0<o(e,t.get()-1).length},T={done:y,find:function(e,t,n,r,a){n=(n=n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")).replace(/\s/g,"\\s"),n=a?"\\b"+n+"\\b":n;var i,o,d,c,l,s=(i=e,o=t,d=new RegExp(n,r?"g":"gi"),(l=i.dom.create("span",{"data-mce-bogus":1})).className="mce-match-marker",c=i.getBody(),y(i,o,!1),u.findAndReplaceDOMText(d,c,l,!1,i.schema));return s&&(t.set(-1),t.set(f(e,t,!0))),s},next:x,prev:b,replace:function(e,t,n,r,a){var i,o,d,c,l,s,u=t.get();for(r=!1!==r,d=e.getBody(),o=p.grep(p.toArray(d.getElementsByTagName("span")),N),i=0;i<o.length;i++){var f=g(o[i]);if(c=l=parseInt(f,10),a||c===t.get()){for(n.length?(o[i].firstChild.nodeValue=n,m(o[i])):v(e.dom,o[i]);o[++i];){if((c=parseInt(g(o[i]),10))!==l){i--;break}v(e.dom,o[i])}r&&u--}else l>t.get()&&o[i].setAttribute("data-mce-index",l-1)}return t.set(u),r?(s=k(e,t),x(e,t)):(s=C(e,t),b(e,t)),!a&&s},hasNext:k,hasPrev:C},n=function(r,a){return{done:function(e){return T.done(r,a,e)},find:function(e,t,n){return T.find(r,a,e,t,n)},next:function(){return T.next(r,a)},prev:function(){return T.prev(r,a)},replace:function(e,t,n){return T.replace(r,a,e,t,n)}}},a=function(i,o){var e,d={};function c(){s.statusbar.find("#next").disabled(!1===T.hasNext(i,o)),s.statusbar.find("#prev").disabled(!1===T.hasPrev(i,o))}function l(){i.windowManager.alert("Could not find the specified string.",function(){s.find("#find")[0].focus()})}i.undoManager.add(),e=p.trim(i.selection.getContent({format:"text"}));var s=i.windowManager.open({layout:"flex",pack:"center",align:"center",onClose:function(){i.focus(),T.done(i,o),i.undoManager.add()},onSubmit:function(e){var t,n,r,a;return e.preventDefault(),n=s.find("#case").checked(),a=s.find("#words").checked(),(r=s.find("#find").value()).length?d.text===r&&d.caseState===n&&d.wholeWord===a?T.hasNext(i,o)?(T.next(i,o),void c()):void l():((t=T.find(i,o,r,n,a))||l(),s.statusbar.items().slice(1).disabled(0===t),c(),void(d={text:r,caseState:n,wholeWord:a})):(T.done(i,o,!1),void s.statusbar.items().slice(1).disabled(!0))},buttons:[{text:"Find",subtype:"primary",onclick:function(){s.submit()}},{text:"Replace",disabled:!0,onclick:function(){T.replace(i,o,s.find("#replace").value())||(s.statusbar.items().slice(1).disabled(!0),o.set(-1),d={})}},{text:"Replace all",disabled:!0,onclick:function(){T.replace(i,o,s.find("#replace").value(),!0,!0),s.statusbar.items().slice(1).disabled(!0),d={}}},{type:"spacer",flex:1},{text:"Prev",name:"prev",disabled:!0,onclick:function(){T.prev(i,o),c()}},{text:"Next",name:"next",disabled:!0,onclick:function(){T.next(i,o),c()}}],title:"Find and replace",items:{type:"form",padding:20,labelGap:30,spacing:10,items:[{type:"textbox",name:"find",size:40,label:"Find",value:e},{type:"textbox",name:"replace",size:40,label:"Replace with"},{type:"checkbox",name:"case",text:"Match case",label:" "},{type:"checkbox",name:"words",text:"Whole words",label:" "}]}})},i=function(e,t){e.addCommand("SearchReplace",function(){a(e,t)})},d=function(e,t){return function(){a(e,t)}},c=function(e,t){e.addMenuItem("searchreplace",{text:"Find and replace",shortcut:"Meta+F",onclick:d(e,t),separator:"before",context:"edit"}),e.addButton("searchreplace",{tooltip:"Find and replace",onclick:d(e,t)}),e.shortcuts.add("Meta+F","",d(e,t))};e.add("searchreplace",function(e){var t=r(-1);return i(e,t),c(e,t),n(e,t)})}();