(function(){var s=(function(){'use strict';var C=function(i){var a=i;var M=function(){return a;};var b=function(v){a=v;};var e=function(){return C(M());};return{get:M,set:b,clone:e};};var g=tinymce.util.Tools.resolve('tinymce.PluginManager');var h=function(e){if(/(^|[ ,])tinymcespellchecker([, ]|$)/.test(e.settings.plugins)&&g.get('tinymcespellchecker')){if(typeof window.console!=='undefined'&&window.console.log){window.console.log('Spell Checker Pro is incompatible with Spell Checker plugin! '+'Remove \'spellchecker\' from the \'plugins\' option.');}return true;}else{return false;}};var $={hasProPlugin:h};var c=function(e){var a='English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv';return e.getParam('spellchecker_languages',a);};var d=function(e){var a=e.getParam('language','en');return e.getParam('spellchecker_language',a);};var f=function(e){return e.getParam('spellchecker_rpc_url');};var j=function(e){return e.getParam('spellchecker_callback');};var k=function(e){var a=new RegExp('[^'+'\\s!"#$%&()*+,-./:;<=>?@[\\]^_{|}`'+'\xA7\xA9\xAB\xAE\xB1\xB6\xB7\xB8\xBB'+'\xBC\xBD\xBE\xBF\xD7\xF7\xA4\u201D\u201C\u201E\xA0\u2002\u2003\u2009'+']+','g');return e.getParam('spellchecker_wordchar_pattern',a);};var n={getLanguages:c,getLanguage:d,getRpcUrl:f,getSpellcheckerCallback:j,getSpellcheckerWordcharPattern:k};var o=tinymce.util.Tools.resolve('tinymce.util.Tools');var p=tinymce.util.Tools.resolve('tinymce.util.URI');var q=tinymce.util.Tools.resolve('tinymce.util.XHR');var r=function(e){return e.fire('SpellcheckStart');};var t=function(e){return e.fire('SpellcheckEnd');};var u={fireSpellcheckStart:r,fireSpellcheckEnd:t};function w(a){return a&&a.nodeType===1&&a.contentEditable==='false';}var D=function(e,v){var m,_=[],c1;var d1=v.dom;var e1,f1,g1;e1=v.schema.getBlockElements();f1=v.schema.getWhiteSpaceElements();g1=v.schema.getShortEndedElements();function h1(m,a){if(!m[0]){throw new Error('findAndReplaceDOMText cannot handle zero-length matches');}return{start:m.index,end:m.index+m[0].length,text:m[0],data:a};}function i1(e){var a;if(e.nodeType===3){return e.data;}if(f1[e.nodeName]&&!e1[e.nodeName]){return'';}if(w(e)){return'\n';}a='';if(e1[e.nodeName]||g1[e.nodeName]){a+='\n';}if(e=e.firstChild){do{a+=i1(e);}while(e=e.nextSibling);}return a;}function j1(e,_,i){var l,A1,B1,C1,D1=[],E1=0,F1=e,G1,H1=0;_=_.slice(0);_.sort(function(a,b){return a.start-b.start;});G1=_.shift();out:while(true){if(e1[F1.nodeName]||g1[F1.nodeName]||w(F1)){E1++;}if(F1.nodeType===3){if(!A1&&F1.length+E1>=G1.end){A1=F1;C1=G1.end-E1;}else if(l){D1.push(F1);}if(!l&&F1.length+E1>G1.start){l=F1;B1=G1.start-E1;}E1+=F1.length;}if(l&&A1){F1=i({startNode:l,startNodeIndex:B1,endNode:A1,endNodeIndex:C1,innerNodes:D1,match:G1.text,matchIndex:H1});E1-=A1.length-C1;l=null;A1=null;D1=[];G1=_.shift();H1++;if(!G1){break;}}else if((!f1[F1.nodeName]||e1[F1.nodeName])&&F1.firstChild){if(!w(F1)){F1=F1.firstChild;continue;}}else if(F1.nextSibling){F1=F1.nextSibling;continue;}while(true){if(F1.nextSibling){F1=F1.nextSibling;break;}else if(F1.parentNode!==e){F1=F1.parentNode;}else{break out;}}}}function k1(a){function b(i,l){var A1=_[l];if(!A1.stencil){A1.stencil=a(A1);}var B1=A1.stencil.cloneNode(false);B1.setAttribute('data-mce-index',l);if(i){B1.appendChild(d1.doc.createTextNode(i));}return B1;}return function(A1){var B1;var C1;var D1;var E1=A1.startNode;var F1=A1.endNode;var G1=A1.matchIndex;var H1=d1.doc;if(E1===F1){var I1=E1;D1=I1.parentNode;if(A1.startNodeIndex>0){B1=H1.createTextNode(I1.data.substring(0,A1.startNodeIndex));D1.insertBefore(B1,I1);}var el=b(A1.match,G1);D1.insertBefore(el,I1);if(A1.endNodeIndex<I1.length){C1=H1.createTextNode(I1.data.substring(A1.endNodeIndex));D1.insertBefore(C1,I1);}I1.parentNode.removeChild(I1);return el;}B1=H1.createTextNode(E1.data.substring(0,A1.startNodeIndex));C1=H1.createTextNode(F1.data.substring(A1.endNodeIndex));var K1=b(E1.data.substring(A1.startNodeIndex),G1);var L1=[];for(var i=0,l=A1.innerNodes.length;i<l;++i){var M1=A1.innerNodes[i];var N1=b(M1.data,G1);M1.parentNode.replaceChild(N1,M1);L1.push(N1);}var O1=b(F1.data.substring(0,A1.endNodeIndex),G1);D1=E1.parentNode;D1.insertBefore(B1,E1);D1.insertBefore(K1,E1);D1.removeChild(E1);D1=F1.parentNode;D1.insertBefore(O1,F1);D1.insertBefore(C1,F1);D1.removeChild(F1);return O1;};}function l1(a){var b=a.parentNode;b.insertBefore(a.firstChild,a);a.parentNode.removeChild(a);}function m1(a){return a.className.indexOf('mce-spellchecker-word')!==-1;}function n1(a){var b=e.getElementsByTagName('*'),l=[];a=typeof a==='number'?''+a:null;for(var i=0;i<b.length;i++){var A1=b[i],B1=A1.getAttribute('data-mce-index');if(B1!==null&&B1.length&&m1(A1)){if(B1===a||a===null){l.push(A1);}}}return l;}function o1(a){var i=_.length;while(i--){if(_[i]===a){return i;}}return-1;}function p1(a){var b=[];q1(function(l,i){if(a(l,i)){b.push(l);}});_=b;return this;}function q1(a){for(var i=0,l=_.length;i<l;i++){if(a(_[i],i)===false){break;}}return this;}function r1(a){if(_.length){j1(e,_,k1(a));}return this;}function s1(a,b){if(c1&&a.global){while(m=a.exec(c1)){_.push(h1(m,b));}}return this;}function t1(a){var i;var b=n1(a?o1(a):null);i=b.length;while(i--){l1(b[i]);}return this;}function u1(a){return _[a.getAttribute('data-mce-index')];}function v1(a){return n1(o1(a))[0];}function w1(a,l,b){_.push({start:a,end:a+l,text:c1.substr(a,l),data:b});return this;}function x1(a){var b=n1(o1(a));var i=v.dom.createRng();i.setStartBefore(b[0]);i.setEndAfter(b[b.length-1]);return i;}function y1(a,c1){var b=x1(a);b.deleteContents();if(c1.length>0){b.insertNode(v.dom.doc.createTextNode(c1));}return b;}function z1(){_.splice(0,_.length);t1();return this;}c1=i1(e);return{text:c1,matches:_,each:q1,filter:p1,reset:z1,matchFromElement:u1,elementFromMatch:v1,find:s1,add:w1,wrap:r1,unwrap:t1,replace:y1,rangeFromMatch:x1,indexOf:o1};};var x=function(e,a){if(!a.get()){var b=D(e.getBody(),e);a.set(b);}return a.get();};var y=function(a){for(var _ in a){return false;}return true;};var z=function(e,a,b){return function(m,i,l,v){var _={method:m,lang:b.get()};var c1='';_[m==='addToDictionary'?'word':'text']=i;o.each(_,function(d1,e1){if(c1){c1+='&';}c1+=e1+'='+encodeURIComponent(d1);});q.send({url:new p(a).toAbsolute(n.getRpcUrl(e)),type:'post',content_type:'application/x-www-form-urlencoded',data:c1,success:function(d1){d1=JSON.parse(d1);if(!d1){var e1=e.translate('Server response wasn\'t proper JSON.');v(e1);}else if(d1.error){v(d1.error);}else{l(d1);}},error:function(){var d1=e.translate('The spelling service was not found: (')+n.getRpcUrl(e)+e.translate(')');v(d1);}});};};var A=function(e,a,b,i,l,m,v){var _=n.getSpellcheckerCallback(e);var c1=_?_:z(e,a,b);c1.call(e.plugins.spellchecker,i,l,m,v);};var B=function(e,a,b,i,l,m){if(H(e,b,i)){return;}var v=function(c1){e.notificationManager.open({text:c1,type:'error'});e.setProgressState(false);H(e,b,i);};var _=function(c1){K(e,b,i,l,c1);};e.setProgressState(true);A(e,a,m,'spellcheck',x(e,i).text,_,v);e.focus();};var E=function(e,a,b){if(!e.dom.select('span.mce-spellchecker-word').length){H(e,a,b);}};var F=function(e,a,b,i,l,m,v){e.setProgressState(true);A(e,a,l,'addToDictionary',m,function(){e.setProgressState(false);e.dom.remove(v,true);E(e,b,i);},function(_){e.notificationManager.open({text:_,type:'error'});e.setProgressState(false);});};var G=function(e,a,b,i,l,m){e.selection.collapse();if(m){o.each(e.dom.select('span.mce-spellchecker-word'),function(v){if(v.getAttribute('data-mce-word')===i){e.dom.remove(v,true);}});}else{e.dom.remove(l,true);}E(e,a,b);};var H=function(e,a,b){x(e,b).reset();b.set(null);if(a.get()){a.set(false);u.fireSpellcheckEnd(e);return true;}};var I=function(e){var v=e.getAttribute('data-mce-index');if(typeof v==='number'){return''+v;}return v;};var J=function(e,a){var b;var l=[];b=o.toArray(e.getBody().getElementsByTagName('span'));if(b.length){for(var i=0;i<b.length;i++){var m=I(b[i]);if(m===null||!m.length){continue;}if(m===a.toString()){l.push(b[i]);}}}return l;};var K=function(e,a,b,l,i){var m,v;if(typeof i!=='string'&&i.words){v=!!i.dictionary;m=i.words;}else{m=i;}e.setProgressState(false);if(y(m)){var _=e.translate('No misspellings found.');e.notificationManager.open({text:_,type:'info'});a.set(false);return;}l.set({suggestions:m,hasDictionarySupport:v});x(e,b).find(n.getSpellcheckerWordcharPattern(e)).filter(function(c1){return!!m[c1.text];}).wrap(function(c1){return e.dom.create('span',{'class':'mce-spellchecker-word','data-mce-bogus':1,'data-mce-word':c1.text});});a.set(true);u.fireSpellcheckStart(e);};var L={spellcheck:B,checkIfFinished:E,addToDictionary:F,ignoreWord:G,findSpansByIndex:J,getElmIndex:I,markErrors:K};var M=function(e,a,l,b,i,m){var d=function(){return i.get();};var v=function(){return n.getSpellcheckerWordcharPattern(e);};var K=function(_){L.markErrors(e,a,b,l,_);};var x=function(){return b.get();};return{getTextMatcher:x,getWordCharPattern:v,markErrors:K,getLanguage:d};};var N={get:M};var O=function(e,a,b,i,l,m){e.addCommand('mceSpellCheck',function(){L.spellcheck(e,a,b,i,l,m);});};var P={register:O};var Q=function(l,a){var i=[];o.each(a,function(b){i.push({selectable:true,text:b.name,data:b.value});});return i;};var R=function(a,b){return function(e){var i=b.get();e.control.items().each(function(l){l.active(l.settings.data===i);});};};var S=function(e){return o.map(n.getLanguages(e).split(','),function(l){l=l.split('=');return{name:l[0],value:l[1]};});};var T=function(a,b,i,l,m,v){var _=Q('Language',S(a));var c1=function(){L.spellcheck(a,b,i,l,v,m);};var d1={tooltip:'Spellcheck',onclick:c1,onPostRender:function(e){var e1=e.control;a.on('SpellcheckStart SpellcheckEnd',function(){e1.active(i.get());});}};if(_.length>1){d1.type='splitbutton';d1.menu=_;d1.onshow=R(a,m);d1.onselect=function(e){m.set(e.control.settings.data);};}a.addButton('spellchecker',d1);a.addMenuItem('spellchecker',{text:'Spellcheck',context:'tools',onclick:c1,selectable:true,onPostRender:function(){var e=this;e.active(i.get());a.on('SpellcheckStart SpellcheckEnd',function(){e.active(i.get());});}});};var U={register:T};var V=tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');var W=tinymce.util.Tools.resolve('tinymce.ui.Factory');var X;var Y=function(a,b,l,i,m,v,_,c1){var d1=[],e1=l.get().suggestions[_];o.each(e1,function(e){d1.push({text:e,onclick:function(){a.insertContent(a.dom.encode(e));a.dom.remove(c1);L.checkIfFinished(a,i,m);}});});d1.push({text:'-'});var f1=l.get().hasDictionarySupport;if(f1){d1.push({text:'Add to Dictionary',onclick:function(){L.addToDictionary(a,b,i,m,v,_,c1);}});}d1.push.apply(d1,[{text:'Ignore',onclick:function(){L.ignoreWord(a,i,m,_,c1);}},{text:'Ignore all',onclick:function(){L.ignoreWord(a,i,m,_,c1,true);}}]);X=W.create('menu',{items:d1,context:'contextmenu',onautohide:function(e){if(e.target.className.indexOf('spellchecker')!==-1){e.preventDefault();}},onhide:function(){X.remove();X=null;}});X.renderTo(document.body);var g1=V.DOM.getPos(a.getContentAreaContainer());var h1=a.dom.getPos(c1[0]);var i1=a.dom.getRoot();if(i1.nodeName==='BODY'){h1.x-=i1.ownerDocument.documentElement.scrollLeft||i1.scrollLeft;h1.y-=i1.ownerDocument.documentElement.scrollTop||i1.scrollTop;}else{h1.x-=i1.scrollLeft;h1.y-=i1.scrollTop;}g1.x+=h1.x;g1.y+=h1.y;X.moveTo(g1.x,g1.y+c1[0].offsetHeight);};var Z=function(a,b,l,i,m,v){a.on('click',function(e){var _=e.target;if(_.className==='mce-spellchecker-word'){e.preventDefault();var c1=L.findSpansByIndex(a,L.getElmIndex(_));if(c1.length>0){var d1=a.dom.createRng();d1.setStartBefore(c1[0]);d1.setEndAfter(c1[c1.length-1]);a.selection.setRng(d1);Y(a,b,l,i,m,v,_.getAttribute('data-mce-word'),c1);}}});};var a1={setup:Z};g.add('spellchecker',function(e,a){if($.hasProPlugin(e)===false){var b=C(false);var i=C(n.getLanguage(e));var l=C(null);var m=C(null);U.register(e,a,b,l,i,m);a1.setup(e,a,m,b,l,i);P.register(e,a,b,l,m,i);return N.get(e,b,m,l,i,a);}});function b1(){}return b1;}());})();
