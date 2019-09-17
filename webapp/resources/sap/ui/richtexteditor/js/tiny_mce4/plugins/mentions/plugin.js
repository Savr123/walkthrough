/* Ephox mentions plugin
 *
 * Copyright 2010-2016 Ephox Corporation.  All rights reserved.
 *
 * Version: 1.1.1-55
 */
!function(){"use strict";var t=function(t,e){return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];var o=t.console;o&&e in o&&o[e].apply(o,arguments)}},e={log:t(window,"log"),error:t(window,"error"),warn:t(window,"warm")},n=function(t,e){var n,i;return(i=function(){var i=arguments;clearTimeout(n),n=setTimeout(function(){t.apply(this,i)},e)}).stop=function(){clearTimeout(n)},i},i=function(t){return parseInt(t,10)},o=function(t){return function(){return t}},r=function(t,e,n){return{major:o(t),minor:o(e),patch:o(n)}},c=function(t,e){var n=t-e;return 0===n?0:n>0?1:-1},u=r,l=function(t){var e=/([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(t);return e?r(i(e[1]),i(e[2]),i(e[3])):r(0,0,0)},a=function(t,e){var n=c(t.major(),e.major());if(0!==n)return n;var i=c(t.minor(),e.minor());if(0!==i)return i;var o=c(t.patch(),e.patch());return 0!==o?o:0},s=function(t){return t?l([(e=t).majorVersion,e.minorVersion].join(".").split(".").slice(0,3).join(".")):u(0,0,0);var e},f=function(t,e){return a(s(t),l(e))<0},m=Math.round,d=function(t,e,n){var i,o,r,c,u,l;i=e.x,o=e.y,r=t.w,c=t.h,u=e.w,l=e.h;var a=(n||"").split("");return"b"===a[0]&&(o+=l),"r"===a[1]&&(i+=u),"c"===a[0]&&(o+=m(l/2)),"c"===a[1]&&(i+=m(u/2)),"b"===a[3]&&(o-=c),"r"===a[4]&&(i-=r),"c"===a[3]&&(o-=m(c/2)),"c"===a[4]&&(i-=m(r/2)),v(i,o,r,c)},v=function(t,e,n,i){return{x:t,y:e,w:n,h:i}},y=tinymce.DOM,h=function(t,e,n){var i,o;return(i=y.getViewPort()).w-=30,i.h-=30,o=function(t,e,n,i){var o,r;for(r=0;r<i.length;r++)if((o=d(t,e,i[r])).x>=n.x&&o.x+o.w<=n.w+n.x&&o.y>=n.y&&o.y+o.h<=n.h+n.y)return i[r];return null}(t,e,i,n),t=d(t,e,o)},p=function(t,e,n,i){var o,r,c,u=(c=n,g(r=t,r.dom.getRect(c)));o=y.getRect(e),o=h(o,u,i),y.setStyles(e,{position:"absolute",left:o.x,top:o.y})},g=function(t,e){var n;return t.inline||(n=y.getPos(t.getContentAreaContainer()),e.x+=n.x,e.y+=n.y),e},b=function(t,e,n,i){var o,r,c=-1,u=tinymce.DOM,l=function(t,e){var n,i,o,r,c,l;i=a(((o=(o=t.rng).cloneRange()).setStart(o.startContainer,o.startOffset+1),o)),n=h(u.getRect(e.getEl()),(c=0,l=2,v((r=i).x-c,r.y-l,r.w+2*c,r.h+2*l)),["bl-tl","tl-bl","tl-br","bl-tr"]),e.moveTo(n.x,n.y)},a=function(e){var n;n=e.getClientRects()[0];var i=t.inline?u.getViewPort():{x:0,y:0};return g(t,{x:n.left+i.x,y:n.top+i.y,w:n.width,h:n.height})},s=function(){r&&(u.remove(r),r=null)},f=function(){s(),o&&(o.remove(),o=null)},m=function(){s(),o&&o.hide()},d=function(t){i(t.settings.data,function(e){var n,i,c;t.getEl().parentNode&&0!==o.items().length&&o.visible()&&(u.setStyles(e,{position:"absolute",left:-65535,top:-65535}),u.add(document.body,e),n=e,i=t.getEl(),c=h(u.getRect(n),u.getRect(i),["tr-tl","tl-tr","bl-br","br-bl"]),u.setStyles(n,{left:c.x,top:c.y}),s(),r=e)})},y=function(t){s(),o.items().each(function(e,n){e===t&&c!==n&&(t.hover(),d(t),c=n)})},p=function(){var t;m(),(t=o.items()[c])&&n(t.settings.data)};return{isVisible:function(){return o&&o.visible()},selectNext:function(){y(o.items()[c+1])},selectPrev:function(){y(o.items()[c-1])},showAt:function(n){e(function(e){var i,r,u;0!==e.length?(o=(o||(o=tinymce.ui.Factory.create("menu",{onhide:function(){s()},classes:"contextmenu"}).renderTo(),t.on("remove",f),o)).show(),(i=o).getEl().style.width="",i.getEl("body").style.width="",o.items().remove(),o.add((r=e,u=n.text,tinymce.util.Tools.map(r,function(t){return{text:t.fullName,data:t,match:u,onclick:function(){y(this),p()},onmouseenter:function(){y(this)}}}))),o.renderNew(),o.initLayoutRect(),l(n,o),c=-1,y(o.items()[0])):o&&o.hide()})},hide:m,complete:p}},w=function(t){var e=function(){},n=function(t,e){return"function"==typeof t?t:e},i=function(t,e){var i,o=n(t,e);return function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n={};t=t.map(function(t){var e;return"function"==typeof t&&(e=t,t=function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];n===i&&e.apply(null,t)}),t}),n=i={},o.apply(null,t)}},o=i(t.mentions_menu_hover,e),r=i(t.mentions_fetch,function(t,e){e([])}),c=n(t.mentions_menu_complete,function(t,e){var n;return(n=t.dom.create("span",{class:"mention"})).appendChild(t.dom.doc.createTextNode("@"+e.name)),n}),u=n(t.mentions_menu_cancel,e);return{hover:o,fetch:r,complete:c,select:i(t.mentions_select,e),cancel:u}},x=/[\u00a0 \t\r\n]/,T=function(t){var e,n=(e=t).collapsed&&3===e.startContainer.nodeType?e.startContainer:null;if(null===n)return null;var i=t.startOffset,o=function(t,e){var n;for(n=e-1;n>=0;n--){if(x.test(t.charAt(n)))return null;if("@"===t.charAt(n))break}return-1===n||e-n<2?null:t.substring(n+1,e)}(n.data,i);if(null===o)return null;var r=t.cloneRange();return r.setStart(n,i-o.length-1),r.setEnd(n,i),{text:o,rng:r}};tinymce.PluginManager.add("mentions",function(t){if(f(tinymce,"4.3.13"))return e.error("The mentions plugin requires at least 4.3.13 version of TinyMCE."),function(){};var i,o=w(t.settings),r={},c="data-mce-mentions-id",u=function(t){e.error(t)},l=function(){return t.settings.mentions_selector||".mention"},a=function(){return T(t.selection.getRng())},s=function(t){return t&&"string"==typeof t.id&&"string"==typeof t.name},m=function(t){s(t)||u("mentions_fetch didn't produce a valid list of users.")},d=function(e){return t.dom.is(e,l())},v=function(){i&&(i.parentNode.removeChild(i),i=null)},y=b(t,function(t){var e=a();if(e){var n={term:e.text};o.fetch(n,function(e){tinymce.util.Tools.each(e,m);var n=e.slice(0,10);t(tinymce.util.Tools.grep(n,s))})}},function(e){var n,i;n=o.complete(t,e),void(d(n)||u("mentions_complete needs to produce a element that matches selector: "+l()))||(i=T(t.selection.getRng()),n.contentEditable=!1,n.setAttribute("data-mce-mentions-id",e.id),r[e.id]=e,t.selection.setRng(i.rng),t.insertContent(n.outerHTML))},o.hover),h=function(){y.isVisible()&&o.cancel(),y.hide()},g=function(){if(!t.removed){var e,n=a();(e=n)&&e.text.length>=1?y.showAt(n):h()}},x=function(t,e){t.preventDefault(),e()},C=function(t){if(y.isVisible()&&!tinymce.util.VK.modifierPressed(t))switch(t.keyCode){case 27:x(t,h);break;case tinymce.util.VK.UP:x(t,y.selectPrev);break;case tinymce.util.VK.DOWN:x(t,y.selectNext);break;case tinymce.util.VK.ENTER:case tinymce.util.VK.TAB:x(t,y.complete)}else h()},R=function(t){t.keyCode===tinymce.util.VK.BACKSPACE&&g(),t.keyCode!==tinymce.util.VK.LEFT&&t.keyCode!==tinymce.util.VK.RIGHT||h()},V=function(e){var n=e.element;d(n)&&!1===t.selection.isCollapsed()?o.select(n,function(e){v(),i=e,document.body.appendChild(e),p(t,e,n,["bl-tl","tl-bl","tl-br","bl-tr"])}):v()};return t.on("SetContent",function(){var e;e=!0,t.$(l(),e).prop("contentEditable",!1)}),t.on("PreProcess",function(e){var n,i,o;n=e.node,i=e.source_view,(o=t.$(l(),n)).removeAttr("contenteditable"),i||o.removeAttr("data-mce-mentions-id")}),t.on("ResolveName",function(t){d(t.target)&&(t.name="mention")}),t.on("keypress",n(g,100)),t.on("keydown",C),t.on("keyup",R),t.on("nodechange",V),t.on("remove",v),{getUsers:function(){var e=[],n=tinymce.util.Tools.map(t.dom.select("["+c+"]"),function(t){return t.getAttribute(c)});return tinymce.util.Tools.each(r,function(t){-1!==tinymce.util.Tools.inArray(n,t.id)&&e.push(t)}),e}}})}();