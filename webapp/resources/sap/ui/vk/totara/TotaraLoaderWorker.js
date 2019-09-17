(function(){"use strict";function H(){var a;var b;var o;var d=[];var m=4;var e=0;function h(a){var p=new Promise(function(i,j){var x=new XMLHttpRequest();x.onload=function(){if(this.status>=200&&this.status<300){i(x.response);}else{j({status:this.status,statusText:x.statusText});}};x.onerror=function(){j({status:this.status,statusText:x.statusText});};x.open("GET",a,true);if(b){x.setRequestHeader("Authorization",b);}x.responseType="arraybuffer";x.send();});return p;}this.getUrl=function(){return a;};this.close=function(){};this.send=function(i,j,k){if(!i){return;}d.push({message:i,context:j,onResponse:k||this.onResponse});if(e<m){_();}};function _(){if(!d.length){return;}var i=d.shift();e++;h(encodeURI(a+i.message)).then(function(j){if(i.onResponse){i.onResponse(j);}e--;_();}).catch(function(j){if(o){o({errorText:"Could not connect to server: "+a,error:j.status,reason:j.message?j.message:j,context:i.context});}e--;_();});}this.init=function(s,i){return new Promise(function(j,k){a=s;if(i!=null){i(s).then(function(t){if(t!=null){b=t.token_type+" "+t.access_token;}else{b=null;}j({});}).catch(function(n){return k(n);});}else{j({});}});};this.setOnErrorCallback=function(i){o=i;};this.onResponse=null;}function W(){var a;var t=this;var b;var o;function i(){if(b&&b.readyState===1){return true;}return false;}function d(e,p,q){if(o){o({errorText:e,error:q,context:p});}}this.setOnErrorCallback=function(e){o=e;};this.getUrl=function(){return a;};this.close=function(){if(b){b.close();b=null;}};this.send=function(p,q){if(!p){return;}if(!i()){d("websocket connection lost",q,4);}else{try{b.send(p);}catch(e){d(e,q);}}};var h=0;function k(){var e=60000;if(b==null){clearTimeout(h);return;}if(b.readyState==1){b.send("");}h=setTimeout(k,e);}function j(){if(h){clearTimeout(h);h=0;}}var m=false;var n=function(e){var p=JSON.stringify(e);var q="setStreamingToken"+("["+p.length+"]")+p;return q;};this.init=function(s,p){return new Promise(function(q,v){if(s){a=s;}else{s=a;}b=new WebSocket(s);b.binaryType="arraybuffer";b.onopen=function(){m=true;if(p!=null){p(s).then(function(e){if(e!=null){var w=n({"token":e.access_token});b.send(w);}k();q({});}).catch(function(e){return v(e);});}else{k();q({});}};b.onclose=function(){j();};b.onmessage=function(e){var w=e.data;if(t.onResponse){t.onResponse(w);}};b.onerror=function(e){if(!m){v("error connecting to "+s);}else{d(e);}};});};this.onResponse=null;}function f(a,s,b){for(var i=s;i<b.length;i++){if(b[i]===a){return i;}}return-1;}function g(a){var b=a.split(",");if(b.length<0||b.length>2){throw"invalid content length";}var j=0;var d=0;try{j=parseInt(b[0],10);if(b.length===2){d=parseInt(b[1],10);}}catch(e){throw"invalid content length";}return{jsonContentLength:j,binaryContentLength:d};}if(!Uint8Array.prototype.slice){Object.defineProperty(Uint8Array.prototype,"slice",{value:function(b,e){return new Uint8Array(Array.prototype.slice.call(this,b,e));}});}function c(a){var b="[".charCodeAt(0);var d="]".charCodeAt(0);var h=[];var s=0;var i=0;var j;var k;var m;var n=new Uint8Array(a);while(i<a.byteLength){i=f(b,s,n);if(i===-1){break;}var o=u(a,s,i).replace(/\n|\r|\s/g,"");s=i+1;i=f(d,s,n);if(i===-1){throw"No matching [] for command length. abort";}j=g(u(a,s,i));s=i+1;i=s+j.jsonContentLength;k=u(a,s,i);try{k=JSON.parse(k);}catch(e){var p=o+": "+e;throw p;}if(j.binaryContentLength){s=i;i=s+j.binaryContentLength;m=a.slice(s,i);}else{m=undefined;}s=i;var q={name:o,jsonContent:k};if(m){q.binaryContent=new Uint8Array(m);}h.push(q);}return h;}function u(a,s,b){var d="";var M=0x8000;try{while(s<b){var h=Math.min(M,b-s);var i=new Uint8Array(a,s,h);d+=String.fromCharCode.apply(null,i);s+=h;}}catch(e){return"";}return decodeURIComponent(escape(d));}function L(){this.resolveFunctions=[];this.rejectFunctions=[];this.init=function(a,h,b){this._connection=a;this._connectionHTTP=h;this._sceneBuilderId=b;if(!a){throw"no connection provided for loader!";}this._connection.onResponse=function(d){var e=c(d);p(e);};};function p(a){var d,b;var e=-1;for(var i=0;i<a.length;i++){b=a[i];if(b.name==="notifyFinishedView"){e=i;continue;}if(b.binaryContent){d={name:b.name,jsonContent:b.jsonContent,binaryContent:b.binaryContent};self.postMessage(d,[d.binaryContent.buffer]);}else{d={name:b.name,jsonContent:b.jsonContent};self.postMessage(d);}}if(e!==-1){b=a[e];if(b.binaryContent){d={name:b.name,jsonContent:b.jsonContent,binaryContent:b.binaryContent};self.postMessage(d,[d.binaryContent.buffer]);}else{d={name:b.name,jsonContent:b.jsonContent};self.postMessage(d);}}}this.getConnection=function(){return this._connection;};this._sendGetImage=function(i,a){this._connectionHTTP.send("images/"+i,a,function(b){p([{name:"setImage",jsonContent:{id:i},binaryContent:new Uint8Array(b)}]);});};this._sendGetGeometries=function(a,b){var d="geometry?";for(var i=0;i<a.length;i++){d+=(i>0?"&id=":"id=")+a[i];}this._connectionHTTP.send(d,b,function(e){var h=new DataView(e);var j=h.getUint16(2,true),o=0;var k=[];while(j-->0){var m={id:h.getUint32(o+4,true).toString(),box:[h.getFloat32(o+14,true),h.getFloat32(o+18,true),h.getFloat32(o+22,true),h.getFloat32(o+26,true),h.getFloat32(o+30,true),h.getFloat32(o+34,true)]};var n=h.getUint16(o+8,true);if(n!==3){m.flags=h.getUint16(o+38,true);m.pointCount=h.getUint16(o+46,true);m.elementCount=h.getUint16(o+48,true);}var q=h.getUint32(o+52,true);var s=new Uint8Array(e,o+56,q);k.push({name:"setGeometry",jsonContent:m,binaryContent:s.slice()});o+=52+q;}p(k);});};this.send=function(a){if(this._connectionHTTP&&a.resources){switch(a.method){case"getImage":for(var i=0;i<a.resources.length;i++){this._sendGetImage(a.resources[i],a);}return;case"getGeometry":this._sendGetGeometries(a.resources,a);return;default:break;}}if(this._connection){this._connection.send(a.command);}};this.setSceneBuilderId=function(i){this._sceneBuilderId=i;};this.getSceneBuilderId=function(){return this._sceneBuilderId;};this.authorizationHandler=function(a){var t=this;return new Promise(function(b,d){var e={name:"getAuthorization",jsonContent:{"url":a},sceneId:t.sceneId};t.resolveFunctions.push(b);t.rejectFunctions.push(d);self.postMessage(e);});}.bind(this);}var l=new L();var r=function(e){self.postMessage({name:"notifyError",jsonContent:{error:e}});};self.onmessage=function(e){var d=e.data;switch(d.method){case"initializeConnection":{if(!d.url){break;}if(d.sceneId){l.sceneId=d.sceneId;}var a="";if(d.url[d.url.length-1]!=="/"){d.url+="/";}if(d.url.toLowerCase().startsWith("ws")){a=d.url+"streaming?";}else if(d.url.toLowerCase().startsWith("http")){a=d.url+"streaming-http?request=";}else{a=(d.useSecureConnection?"wss://":"ws://")+d.url+"streaming?";}var b=l.getConnection();if(!b||b.getUrl()!==a){if(b){b.close();}var h;var i=null;if(d.url.toLowerCase().startsWith("ws")){h=new W();}else if(d.url.toLowerCase().startsWith("http")){h=new H();i=d.url;}else{h=new W();i=(d.useSecureConnection?"https://":"http://")+d.url;}h.setOnErrorCallback(function(m){r(m);});h.init(a,l.authorizationHandler).then(function(){var m=function(h,n){l.init(h,n,d.sceneBuilderId);if(d.command){l.send(d);}};if(i){var n=new H();n.init(i,l.authorizationHandler).then(function(){m(h,n);}).catch(function(o){r(o);});}else{m(h,null);}}).catch(function(m){r(m);});}else if(d.command){l.send(d);}break;}case"setAuthorization":{var j=l.resolveFunctions.shift();var k=l.rejectFunctions.shift();if(d.error==null){j(d.authorizationToken);}else{k(d.error);}break;}case"close":{self.close();break;}default:{if(d.command){l.send(d);}break;}}};self.postMessage({ready:true});})();
