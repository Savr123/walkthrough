(function(){var a=(function(){'use strict';var C=function(e){var o=e;var p=function(){return o;};var q=function(v){o=v;};var u=function(){return C(p());};return{get:p,set:q,clone:u};};var g=tinymce.util.Tools.resolve('tinymce.PluginManager');var b=tinymce.util.Tools.resolve('tinymce.Env');var c=tinymce.util.Tools.resolve('tinymce.util.Delay');var d=function(e){return parseInt(e.getParam('autoresize_min_height',e.getElement().offsetHeight),10);};var f=function(e){return parseInt(e.getParam('autoresize_max_height',0),10);};var h=function(e){return e.getParam('autoresize_overflow_padding',1);};var i=function(e){return e.getParam('autoresize_bottom_margin',50);};var s=function(e){return e.getParam('autoresize_on_init',true);};var $={getAutoResizeMinHeight:d,getAutoResizeMaxHeight:f,getAutoResizeOverflowPadding:h,getAutoResizeBottomMargin:i,shouldAutoResizeOnInit:s};var j=function(e){return e.plugins.fullscreen&&e.plugins.fullscreen.isFullscreen();};var w=function(e,o,p,q,u){c.setEditorTimeout(e,function(){r(e,o);if(p--){w(e,o,p,q,u);}else if(u){u();}},q);};var t=function(e,o){var p=e.getBody();if(p){p.style.overflowY=o?'':'hidden';if(!o){p.scrollTop=0;}}};var r=function(e,o){var p,q,u,v,x;var y,z,A,B,D,E;var F=e.dom;q=e.getDoc();if(!q){return;}if(j(e)){t(e,true);return;}u=q.body;v=$.getAutoResizeMinHeight(e);y=F.getStyle(u,'margin-top',true);z=F.getStyle(u,'margin-bottom',true);A=F.getStyle(u,'padding-top',true);B=F.getStyle(u,'padding-bottom',true);D=F.getStyle(u,'border-top-width',true);E=F.getStyle(u,'border-bottom-width',true);x=u.offsetHeight+parseInt(y,10)+parseInt(z,10)+parseInt(A,10)+parseInt(B,10)+parseInt(D,10)+parseInt(E,10);if(isNaN(x)||x<=0){x=b.ie?u.scrollHeight:b.webkit&&u.clientHeight===0?0:u.offsetHeight;}if(x>$.getAutoResizeMinHeight(e)){v=x;}var G=$.getAutoResizeMaxHeight(e);if(G&&x>G){v=G;t(e,true);}else{t(e,false);}if(v!==o.get()){p=v-o.get();F.setStyle(e.iframeElement,'height',v+'px');o.set(v);if(b.webkit&&p<0){r(e,o);}}};var k=function(o,p){o.on('init',function(){var e,q;var u=o.dom;e=$.getAutoResizeOverflowPadding(o);q=$.getAutoResizeBottomMargin(o);if(e!==false){u.setStyles(o.getBody(),{paddingLeft:e,paddingRight:e});}if(q!==false){u.setStyles(o.getBody(),{paddingBottom:q});}});o.on('nodechange setcontent keyup FullscreenStateChanged',function(e){r(o,p);});if($.shouldAutoResizeOnInit(o)){o.on('init',function(){w(o,p,20,100,function(){w(o,p,5,1000);});});}};var l={setup:k,resize:r};var m=function(e,o){e.addCommand('mceAutoResize',function(){l.resize(e,o);});};var n={register:m};g.add('autoresize',function(e){if(!e.inline){var o=C(0);n.register(e,o);l.setup(e,o);}});function P(){}return P;}());})();
