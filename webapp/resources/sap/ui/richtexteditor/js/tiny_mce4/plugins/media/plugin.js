(function(){var m=(function(){'use strict';var g=tinymce.util.Tools.resolve('tinymce.PluginManager');var a=tinymce.util.Tools.resolve('tinymce.Env');var b=tinymce.util.Tools.resolve('tinymce.util.Tools');var c=function(e){return e.getParam('media_scripts');};var d=function(e){return e.getParam('audio_template_callback');};var h=function(e){return e.getParam('video_template_callback');};var j=function(e){return e.getParam('media_live_embeds',true);};var s=function(e){return e.getParam('media_filter_html',true);};var k=function(e){return e.getParam('media_url_resolver');};var l=function(e){return e.getParam('media_alt_source',true);};var n=function(e){return e.getParam('media_poster',true);};var o=function(e){return e.getParam('media_dimensions',true);};var $={getScripts:c,getAudioTemplateCallback:d,getVideoTemplateCallback:h,hasLiveEmbeds:j,shouldFilterHtml:s,getUrlResolver:k,hasAltSource:l,hasPoster:n,hasDimensions:o};var p=tinymce.util.Tools.resolve('tinymce.html.SaxParser');var q=tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');var r=function(e,f){if(e){for(var i=0;i<e.length;i++){if(f.indexOf(e[i].filter)!==-1){return e[i];}}}};var t={getVideoScriptMatch:r};var u=function(e){return e.replace(/px$/,'');};var v=function(e){return/^[0-9.]+$/.test(e)?e+'px':e;};var w=function(e){return function(f){return f?u(f.style[e]):'';};};var x=function(e){return function(f,i){if(f){f.style[e]=v(i);}};};var z={getMaxWidth:w('maxWidth'),getMaxHeight:w('maxHeight'),setMaxWidth:x('maxWidth'),setMaxHeight:x('maxHeight')};var D=q.DOM;var A=function(e){return D.getAttrib(e,'data-ephox-embed-iri');};var B=function(e){var f=D.createFragment(e);return A(f.firstChild)!=='';};var C=function(e,f){var i={};p({validate:false,allow_conditional_comments:true,special:'script,noscript',start:function(y,Y1){if(!i.source1&&y==='param'){i.source1=Y1.map.movie;}if(y==='iframe'||y==='object'||y==='embed'||y==='video'||y==='audio'){if(!i.type){i.type=y;}i=b.extend(Y1.map,i);}if(y==='script'){var Z1=t.getVideoScriptMatch(e,Y1.map.src);if(!Z1){return;}i={type:'script',source1:Y1.map.src,width:Z1.width,height:Z1.height};}if(y==='source'){if(!i.source1){i.source1=Y1.map.src;}else if(!i.source2){i.source2=Y1.map.src;}}if(y==='img'&&!i.poster){i.poster=Y1.map.src;}}}).parse(f);i.source1=i.source1||i.src||i.data;i.source2=i.source2||'';i.poster=i.poster||'';return i;};var E=function(e){var f=D.createFragment(e);var i=f.firstChild;return{type:'ephox-embed-iri',source1:A(i),source2:'',poster:'',width:z.getMaxWidth(i),height:z.getMaxHeight(i)};};var F=function(e,f){return B(f)?E(f):C(e,f);};var G={htmlToData:F};var H=tinymce.util.Tools.resolve('tinymce.util.Promise');var I=function(e){var f={mp3:'audio/mpeg',wav:'audio/wav',mp4:'video/mp4',webm:'video/webm',ogg:'video/ogg',swf:'application/x-shockwave-flash'};var i=e.toLowerCase().split('.').pop();var y=f[i];return y?y:'';};var J={guess:I};var K=tinymce.util.Tools.resolve('tinymce.html.Writer');var L=tinymce.util.Tools.resolve('tinymce.html.Schema');var M=q.DOM;var N=function(e,f){var y;var i;var Y1;var Z1;for(y in f){Y1=''+f[y];if(e.map[y]){i=e.length;while(i--){Z1=e[i];if(Z1.name===y){if(Y1){e.map[y]=Y1;Z1.value=Y1;}else{delete e.map[y];e.splice(i,1);}}}}else if(Y1){e.push({name:y,value:Y1});e.map[y]=Y1;}}};var O=function(e){var f=K();var i=p(f);i.parse(e);return f.getContent();};var P=function(e,f,i){var y=K();var Y1=0;var Z1;p({validate:false,allow_conditional_comments:true,special:'script,noscript',comment:function($1){y.comment($1);},cdata:function($1){y.cdata($1);},text:function($1,_1){y.text($1,_1);},start:function($1,_1,a2){switch($1){case'video':case'object':case'embed':case'img':case'iframe':if(f.height!==undefined&&f.width!==undefined){N(_1,{width:f.width,height:f.height});}break;}if(i){switch($1){case'video':N(_1,{poster:f.poster,src:''});if(f.source2){N(_1,{src:''});}break;case'iframe':N(_1,{src:f.source1});break;case'source':Y1++;if(Y1<=2){N(_1,{src:f['source'+Y1],type:f['source'+Y1+'mime']});if(!f['source'+Y1]){return;}}break;case'img':if(!f.poster){return;}Z1=true;break;}}y.start($1,_1,a2);},end:function($1){if($1==='video'&&i){for(var _1=1;_1<=2;_1++){if(f['source'+_1]){var a2=[];a2.map={};if(Y1<_1){N(a2,{src:f['source'+_1],type:f['source'+_1+'mime']});y.start('source',a2,true);}}}}if(f.poster&&$1==='object'&&i&&!Z1){var b2=[];b2.map={};N(b2,{src:f.poster,width:f.width,height:f.height});y.start('img',b2,true);}y.end($1);}},L({})).parse(e);return y.getContent();};var Q=function(e){var f=M.createFragment(e);return M.getAttrib(f.firstChild,'data-ephox-embed-iri')!=='';};var R=function(e,f){var i=M.createFragment(e);var y=i.firstChild;z.setMaxWidth(y,f.width);z.setMaxHeight(y,f.height);return O(y.outerHTML);};var S=function(e,f,i){return Q(e)?R(e,f):P(e,f,i);};var T={updateHtml:S};var U=[{regex:/youtu\.be\/([\w\-_\?&=.]+)/i,type:'iframe',w:560,h:314,url:'//www.youtube.com/embed/$1',allowFullscreen:true},{regex:/youtube\.com(.+)v=([^&]+)(&([a-z0-9&=\-_]+))?/i,type:'iframe',w:560,h:314,url:'//www.youtube.com/embed/$2?$4',allowFullscreen:true},{regex:/youtube.com\/embed\/([a-z0-9\?&=\-_]+)/i,type:'iframe',w:560,h:314,url:'//www.youtube.com/embed/$1',allowFullscreen:true},{regex:/vimeo\.com\/([0-9]+)/,type:'iframe',w:425,h:350,url:'//player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc',allowFullscreen:true},{regex:/vimeo\.com\/(.*)\/([0-9]+)/,type:'iframe',w:425,h:350,url:'//player.vimeo.com/video/$2?title=0&amp;byline=0',allowFullscreen:true},{regex:/maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,type:'iframe',w:425,h:350,url:'//maps.google.com/maps/ms?msid=$2&output=embed"',allowFullscreen:false},{regex:/dailymotion\.com\/video\/([^_]+)/,type:'iframe',w:480,h:270,url:'//www.dailymotion.com/embed/video/$1',allowFullscreen:true},{regex:/dai\.ly\/([^_]+)/,type:'iframe',w:480,h:270,url:'//www.dailymotion.com/embed/video/$1',allowFullscreen:true}];var V=function(e,f){var y=e.regex.exec(f);var Y1=e.url;var Z1=function(i){Y1=Y1.replace('$'+i,function(){return y[i]?y[i]:'';});};for(var i=0;i<y.length;i++){Z1(i);}return Y1.replace(/\?$/,'');};var W=function(e){var f=U.filter(function(f){return f.regex.test(e);});if(f.length>0){return b.extend({},f[0],{url:V(f[0],e)});}else{return null;}};var X=function(e){var f=e.allowFullscreen?' allowFullscreen="1"':'';return'<iframe src="'+e.source1+'" width="'+e.width+'" height="'+e.height+'"'+f+'></iframe>';};var Y=function(e){var f='<object data="'+e.source1+'" width="'+e.width+'" height="'+e.height+'" type="application/x-shockwave-flash">';if(e.poster){f+='<img src="'+e.poster+'" width="'+e.width+'" height="'+e.height+'" />';}f+='</object>';return f;};var Z=function(e,f){if(f){return f(e);}else{return'<audio controls="controls" src="'+e.source1+'">'+(e.source2?'\n<source src="'+e.source2+'"'+(e.source2mime?' type="'+e.source2mime+'"':'')+' />\n':'')+'</audio>';}};var _=function(e,f){if(f){return f(e);}else{return'<video width="'+e.width+'" height="'+e.height+'"'+(e.poster?' poster="'+e.poster+'"':'')+' controls="controls">\n'+'<source src="'+e.source1+'"'+(e.source1mime?' type="'+e.source1mime+'"':'')+' />\n'+(e.source2?'<source src="'+e.source2+'"'+(e.source2mime?' type="'+e.source2mime+'"':'')+' />\n':'')+'</video>';}};var a1=function(e){return'<script src="'+e.source1+'"></script>';};var b1=function(e,f){var i=b.extend({},f);if(!i.source1){b.extend(i,G.htmlToData($.getScripts(e),i.embed));if(!i.source1){return'';}}if(!i.source2){i.source2='';}if(!i.poster){i.poster='';}i.source1=e.convertURL(i.source1,'source');i.source2=e.convertURL(i.source2,'source');i.source1mime=J.guess(i.source1);i.source2mime=J.guess(i.source2);i.poster=e.convertURL(i.poster,'poster');var y=W(i.source1);if(y){i.source1=y.url;i.type=y.type;i.allowFullscreen=y.allowFullscreen;i.width=i.width||y.w;i.height=i.height||y.h;}if(i.embed){return T.updateHtml(i.embed,i,true);}else{var Y1=t.getVideoScriptMatch($.getScripts(e),i.source1);if(Y1){i.type='script';i.width=Y1.width;i.height=Y1.height;}var Z1=$.getAudioTemplateCallback(e);var $1=$.getVideoTemplateCallback(e);i.width=i.width||300;i.height=i.height||150;b.each(i,function(_1,a2){i[a2]=e.dom.encode(_1);});if(i.type==='iframe'){return X(i);}else if(i.source1mime==='application/x-shockwave-flash'){return Y(i);}else if(i.source1mime.indexOf('audio')!==-1){return Z(i,Z1);}else if(i.type==='script'){return a1(i);}else{return _(i,$1);}}};var c1={dataToHtml:b1};var d1={};var e1=function(e,b1,f){return new H(function(i,y){var Y1=function(Z1){if(Z1.html){d1[e.source1]=Z1;}return i({url:e.source1,html:Z1.html?Z1.html:b1(e)});};if(d1[e.source1]){Y1(d1[e.source1]);}else{f({url:e.source1},Y1,y);}});};var f1=function(e,b1){return new H(function(f){f({html:b1(e),url:e.source1});});};var g1=function(e){return function(f){return c1.dataToHtml(e,f);};};var h1=function(e,f){var i=$.getUrlResolver(e);return i?e1(f,g1(e),i):f1(f,g1(e));};var i1=function(e){return d1.hasOwnProperty(e);};var j1={getEmbedHtml:h1,isCached:i1};var k1=function(e,f){e.state.set('oldVal',e.value());f.state.set('oldVal',f.value());};var l1=function(e,f){var i=e.find('#width')[0];var y=e.find('#height')[0];var Y1=e.find('#constrain')[0];if(i&&y&&Y1){f(i,y,Y1.checked());}};var m1=function(e,f,i){var y=e.state.get('oldVal');var Y1=f.state.get('oldVal');var Z1=e.value();var $1=f.value();if(i&&y&&Y1&&Z1&&$1){if(Z1!==y){$1=Math.round(Z1/y*$1);if(!isNaN($1)){f.value($1);}}else{Z1=Math.round($1/Y1*Z1);if(!isNaN(Z1)){e.value(Z1);}}}k1(e,f);};var n1=function(e){l1(e,k1);};var o1=function(e){l1(e,m1);};var p1=function(e){var f=function(){e(function(i){o1(i);});};return{type:'container',label:'Dimensions',layout:'flex',align:'center',spacing:5,items:[{name:'width',type:'textbox',maxLength:5,size:5,onchange:f,ariaLabel:'Width'},{type:'label',text:'x'},{name:'height',type:'textbox',maxLength:5,size:5,onchange:f,ariaLabel:'Height'},{name:'constrain',type:'checkbox',checked:true,text:'Constrain proportions'}]};};var q1={createUi:p1,syncSize:n1,updateSize:o1};var r1=a.ie&&a.ie<=8?'onChange':'onInput';var s1=function(e){return function(f){var i=f&&f.msg?'Media embed handler error: '+f.msg:'Media embed handler threw unknown error.';e.notificationManager.open({type:'error',text:i});};};var t1=function(e){var f=e.selection.getNode();var i=f.getAttribute('data-ephox-embed-iri');if(i){return{'source1':i,'data-ephox-embed-iri':i,'width':z.getMaxWidth(f),'height':z.getMaxHeight(f)};}return f.getAttribute('data-mce-object')?G.htmlToData($.getScripts(e),e.serializer.serialize(f,{selection:true})):{};};var u1=function(e){var f=e.selection.getNode();if(f.getAttribute('data-mce-object')||f.getAttribute('data-ephox-embed-iri')){return e.selection.getContent();}};var v1=function(e,f){return function(i){var y=i.html;var Y1=e.find('#embed')[0];var Z1=b.extend(G.htmlToData($.getScripts(f),y),{source1:i.url});e.fromJSON(Z1);if(Y1){Y1.value(y);q1.updateSize(e);}};};var w1=function(e,f){var i;var y;var Y1=e.dom.select('img[data-mce-object]');for(i=0;i<f.length;i++){for(y=Y1.length-1;y>=0;y--){if(f[i]===Y1[y]){Y1.splice(y,1);}}}e.selection.select(Y1[0]);};var x1=function(e,f){var i=e.dom.select('img[data-mce-object]');e.insertContent(f);w1(e,i);e.nodeChanged();};var y1=function(e,f){var i=e.toJSON();i.embed=T.updateHtml(i.embed,i);if(i.embed&&j1.isCached(i.source1)){x1(f,i.embed);}else{j1.getEmbedHtml(f,i).then(function(y){x1(f,y.html);}).catch(s1(f));}};var z1=function(e,f){b.each(f,function(i,y){e.find('#'+y).value(i);});};var A1=function(f){var i;var y;var Y1=[{name:'source1',type:'filepicker',filetype:'media',size:40,autofocus:true,label:'Source',onpaste:function(){setTimeout(function(){j1.getEmbedHtml(f,i.toJSON()).then(v1(i,f)).catch(s1(f));},1);},onchange:function(e){j1.getEmbedHtml(f,i.toJSON()).then(v1(i,f)).catch(s1(f));z1(i,e.meta);},onbeforecall:function(e){e.meta=i.toJSON();}}];var Z1=[];var $1=function(e){e(i);y=i.toJSON();i.find('#embed').value(T.updateHtml(y.embed,y));};if($.hasAltSource(f)){Z1.push({name:'source2',type:'filepicker',filetype:'media',size:40,label:'Alternative source'});}if($.hasPoster(f)){Z1.push({name:'poster',type:'filepicker',filetype:'image',size:40,label:'Poster'});}if($.hasDimensions(f)){var _1=q1.createUi($1);Y1.push(_1);}y=t1(f);var a2={id:'mcemediasource',type:'textbox',flex:1,name:'embed',value:u1(f),multiline:true,rows:5,label:'Source'};var b2=function(){y=b.extend({},G.htmlToData($.getScripts(f),this.value()));this.parent().parent().fromJSON(y);};a2[r1]=b2;var c2=[{title:'General',type:'form',items:Y1},{title:'Embed',type:'container',layout:'flex',direction:'column',align:'stretch',padding:10,spacing:10,items:[{type:'label',text:'Paste your embed code below:',forId:'mcemediasource'},a2]}];if(Z1.length>0){c2.push({title:'Advanced',type:'form',items:Z1});}i=f.windowManager.open({title:'Insert/edit media',data:y,bodyType:'tabpanel',body:c2,onSubmit:function(){q1.updateSize(i);y1(i,f);}});q1.syncSize(i);};var B1={showDialog:A1};var C1=function(e){var A1=function(){B1.showDialog(e);};return{showDialog:A1};};var D1={get:C1};var E1=function(e){var A1=function(){B1.showDialog(e);};e.addCommand('mceMedia',A1);};var F1={register:E1};var G1=tinymce.util.Tools.resolve('tinymce.html.Node');var H1=function(e,f){if($.shouldFilterHtml(e)===false){return f;}var y=K();var Y1;p({validate:false,allow_conditional_comments:false,special:'script,noscript',comment:function(i){y.comment(i);},cdata:function(i){y.cdata(i);},text:function(i,Z1){y.text(i,Z1);},start:function(Z1,$1,_1){Y1=true;if(Z1==='script'||Z1==='noscript'){return;}for(var i=0;i<$1.length;i++){if($1[i].name.indexOf('on')===0){return;}if($1[i].name==='style'){$1[i].value=e.dom.serializeStyle(e.dom.parseStyle($1[i].value),Z1);}}y.start(Z1,$1,_1);Y1=false;},end:function(i){if(Y1){return;}y.end(i);}},L({})).parse(f);return y.getContent();};var I1={sanitize:H1};var J1=function(e,f){var i;var y=f.name;i=new G1('img',1);i.shortEnded=true;L1(e,f,i);i.attr({'width':f.attr('width')||'300','height':f.attr('height')||(y==='audio'?'30':'150'),'style':f.attr('style'),'src':a.transparentSrc,'data-mce-object':y,'class':'mce-object mce-object-'+y});return i;};var K1=function(e,f){var i;var y;var Y1;var Z1=f.name;i=new G1('span',1);i.attr({'contentEditable':'false','style':f.attr('style'),'data-mce-object':Z1,'class':'mce-preview-object mce-object-'+Z1});L1(e,f,i);y=new G1(Z1,1);y.attr({src:f.attr('src'),allowfullscreen:f.attr('allowfullscreen'),style:f.attr('style'),class:f.attr('class'),width:f.attr('width'),height:f.attr('height'),frameborder:'0'});Y1=new G1('span',1);Y1.attr('class','mce-shim');i.append(y);i.append(Y1);return i;};var L1=function(e,f,i){var y;var Y1;var Z1;var ai;var _1;Z1=f.attributes;ai=Z1.length;while(ai--){y=Z1[ai].name;Y1=Z1[ai].value;if(y!=='width'&&y!=='height'&&y!=='style'){if(y==='data'||y==='src'){Y1=e.convertURL(Y1,y);}i.attr('data-mce-p-'+y,Y1);}}_1=f.firstChild&&f.firstChild.value;if(_1){i.attr('data-mce-html',escape(I1.sanitize(e,_1)));i.firstChild=null;}};var M1=function(e){while(e=e.parent){if(e.attr('data-ephox-embed-iri')){return true;}}return false;};var N1=function(e){return function(f){var i=f.length;var y;var Y1;while(i--){y=f[i];if(!y.parent){continue;}if(y.parent.attr('data-mce-object')){continue;}if(y.name==='script'){Y1=t.getVideoScriptMatch($.getScripts(e),y.attr('src'));if(!Y1){continue;}}if(Y1){if(Y1.width){y.attr('width',Y1.width.toString());}if(Y1.height){y.attr('height',Y1.height.toString());}}if(y.name==='iframe'&&$.hasLiveEmbeds(e)&&a.ceFalse){if(!M1(y)){y.replace(K1(e,y));}}else{if(!M1(y)){y.replace(J1(e,y));}}}};};var O1={createPreviewIframeNode:K1,createPlaceholderNode:J1,placeHolderConverter:N1};var P1=function(e){e.on('preInit',function(){var f=e.schema.getSpecialElements();b.each('video audio iframe object'.split(' '),function(i){f[i]=new RegExp('</'+i+'[^>]*>','gi');});var y=e.schema.getBoolAttrs();b.each('webkitallowfullscreen mozallowfullscreen allowfullscreen'.split(' '),function(i){y[i]={};});e.parser.addNodeFilter('iframe,video,audio,object,embed,script',O1.placeHolderConverter(e));e.serializer.addAttributeFilter('data-mce-object',function(Y1,Z1){var i=Y1.length;var $1;var _1;var ai;var b2;var c2;var d2;var e2;var f2;while(i--){$1=Y1[i];if(!$1.parent){continue;}e2=$1.attr(Z1);_1=new G1(e2,1);if(e2!=='audio'&&e2!=='script'){f2=$1.attr('class');if(f2&&f2.indexOf('mce-preview-object')!==-1){_1.attr({width:$1.firstChild.attr('width'),height:$1.firstChild.attr('height')});}else{_1.attr({width:$1.attr('width'),height:$1.attr('height')});}}_1.attr({style:$1.attr('style')});b2=$1.attributes;ai=b2.length;while(ai--){var g2=b2[ai].name;if(g2.indexOf('data-mce-p-')===0){_1.attr(g2.substr(11),b2[ai].value);}}if(e2==='script'){_1.attr('type','text/javascript');}c2=$1.attr('data-mce-html');if(c2){d2=new G1('#text',3);d2.raw=true;d2.value=I1.sanitize(e,unescape(c2));_1.append(d2);}$1.replace(_1);}});});e.on('setContent',function(){e.$('span.mce-preview-object').each(function(i,f){var y=e.$(f);if(y.find('span.mce-shim',f).length===0){y.append('<span class="mce-shim"></span>');}});});};var Q1={setup:P1};var R1=function(f){f.on('ResolveName',function(e){var i;if(e.target.nodeType===1&&(i=e.target.getAttribute('data-mce-object'))){e.name=i;}});};var S1={setup:R1};var T1=function(f){f.on('click keyup',function(){var e=f.selection.getNode();if(e&&f.dom.hasClass(e,'mce-preview-object')){if(f.dom.getAttrib(e,'data-mce-selected')){e.setAttribute('data-mce-selected','2');}}});f.on('ObjectSelected',function(e){var i=e.target.getAttribute('data-mce-object');if(i==='audio'||i==='script'){e.preventDefault();}});f.on('objectResized',function(e){var i=e.target;var y;if(i.getAttribute('data-mce-object')){y=i.getAttribute('data-mce-html');if(y){y=unescape(y);i.setAttribute('data-mce-html',escape(T.updateHtml(y,{width:e.width,height:e.height})));}}});};var U1={setup:T1};var V1=function(e){e.addButton('media',{tooltip:'Insert/edit media',cmd:'mceMedia',stateSelector:['img[data-mce-object]','span[data-mce-object]','div[data-ephox-embed-iri]']});e.addMenuItem('media',{icon:'media',text:'Media',cmd:'mceMedia',context:'insert',prependToContext:true});};var W1={register:V1};g.add('media',function(e){F1.register(e);W1.register(e);S1.setup(e);Q1.setup(e);U1.setup(e);return D1.get(e);});function X1(){}return X1;}());})();