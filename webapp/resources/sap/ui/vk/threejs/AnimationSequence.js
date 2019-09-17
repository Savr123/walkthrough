/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../NS","../AnimationSequence","../AnimationTrackType","../AnimationRotateType","../AnimationInterpolationType"],function(Q,N,A,a,b,d){"use strict";var f=A.extend(N.getName("threejs.AnimationSequence"),{metaData:{},constructor:function(i,n,c){A.call(this);var t=[];this._animationClip=new THREE.AnimationClip(n,-1,t);if(c){this._duration=c;this._animationClip.duration=c;}else{this._duration=0;}this._nodesEndData=new Map();this._nodesStartData=new Map();this._nodesPositionTracksMap=new Map();this._nodesOpacityTrackMap=new Map();this._nodesColorTrackMap=new Map();this._hasHighlight=false;this.setName(n);this.setSequenceId(i);}});var M=4;f.prototype._getMatrixFromEulerRotationAngles=function(x,y,z,o){var g=function(j,k){var c=Math.cos(j);var s=Math.sin(j);var l=1;var n=0;var p=0;var q=0;var t=1;var u=0;var v=0;var w=0;var B=1;if(k===0){t=c;u=-s;w=s;B=c;}else if(k===1){l=c;p=s;v=-s;B=c;}else{l=c;n=-s;q=s;t=c;}var m=new THREE.Matrix4();m.set(l,n,p,0,q,t,u,0,v,w,B,0,0,0,0,1);return m;};o=Math.round(o);var r=new THREE.Matrix4();var e;for(var h=0;h<3;h++){var i=(o>>(h*2))&3;var j=z;if(i===0){j=x;}else if(i===1){j=y;}e=g(j,i);r.premultiply(e);}return r;};f.prototype._getRotationMatrix=function(i,c,r,t,e){var x,y,z;var v,g;if(t===b.euler){v=[r[i*4],r[i*4+1],r[i*4+2],r[i*4+3]];if(i===c){return this._getMatrixFromEulerRotationAngles(v[0],v[1],v[2],v[3]);}g=[r[c*4],r[c*4+1],r[c*4+2],r[c*4+3]];var o=v[3];x=v[0]*(1-e)+g[0]*e;y=v[1]*(1-e)+g[1]*e;z=v[2]*(1-e)+g[2]*e;return this._getMatrixFromEulerRotationAngles(x,y,z,o);}else if(t===b.angleAxis){var h=new THREE.Matrix4();var j,k,l;for(var m=0;m<=i;m++){x=r[m*4];y=r[m*4+1];z=r[m*4+2];j=r[m*4+3];k=new THREE.Vector3(x,y,z);l=new THREE.Matrix4();l.makeRotationAxis(k,j);h.premultiply(l);}if(i===c){return h;}x=r[c*4];y=r[c*4+1];z=r[c*4+2];j=r[c*4+3]*e;k=new THREE.Vector3(x,y,z);var n=new THREE.Matrix4();n.makeRotationAxis(k,j);n.multiply(h);return n;}else{var q;v=[r[i*4],r[i*4+1],r[i*4+2],r[i*4+3]];if(i===c){q=new THREE.Quaternion(v[0],v[1],v[2],v[3]);}var p=new THREE.Matrix4();if(q){p.makeRotationFromQuaternion(q);return p;}g=[r[c*4],r[c*4+1],r[c*4+2],r[c*4+3]];var E=0.001;var s;var u;var B;var F;var C=v[0];var D=v[1];var G=v[2];var H=v[3];var I=g[0];var J=g[1];var K=g[2];var L=g[3];var O;var P;O=C*I+D*J+G*K+H*L;if(O<0.0){O=-O;F=true;}else{F=false;}if(O>1.0){O=1.0;}if((1.0-O)<E){s=1.0-e;}else{u=Math.acos(O);B=u;P=Math.sin(u);s=Math.sin(u-e*B)/P;e=Math.sin(e*B)/P;}if(F){e=-e;}x=s*C+e*I;y=s*D+e*J;z=s*G+e*K;var w=s*H+e*L;q=new THREE.Quaternion(x,y,z,w);p.makeRotationFromQuaternion(q);return p;}};f.prototype._getScaleMatrix=function(v,c,e){var x=1,y=1,z=1;if(v&&!c){x=v[0];y=v[1];z=v[2];}else if(!v&&c){x=c[0];y=c[1];z=c[2];}else if(v&&c){x=v[0]*(1-e)+c[0]*e;y=v[1]*(1-e)+c[1]*e;z=v[2]*(1-e)+c[2]*e;}var s=new THREE.Matrix4();s.makeScale(x,y,z);return s;};f.prototype._getTranslateMatrix=function(v,c,e){var x=0,y=0,z=0;if(v&&!c){x=v[0];y=v[1];z=v[2];}else if(!v&&c){x=c[0];y=c[1];z=c[2];}else if(v&&c){x=v[0]*(1-e)+c[0]*e;y=v[1]*(1-e)+c[1]*e;z=v[2]*(1-e)+c[2]*e;}var t=new THREE.Matrix4();t.makeTranslation(x,y,z);return t;};f.prototype.getTrack=function(t,c){var e=this._nodesPositionTracksMap.get(t);var g;if(c===a.scale&&e&&e.scale&&e.scale.times&&e.scale.times.length){g={};g.times=e.scale.times.slice();g.values=e.scale.values.slice();g.interpolation=e.scale.interpolation;g.cyclicEnd=e.scale.cyclicEnd;g.cyclicStart=e.scale.cyclicStart;}else if(c===a.translate&&e&&e.translate&&e.translate.times&&e.translate.times.length){g={};g.times=e.translate.times.slice();g.values=e.translate.values.slice();g.interpolation=e.translate.interpolation;g.cyclicEnd=e.translate.cyclicEnd;g.cyclicStart=e.translate.cyclicStart;}else if(c===a.rotate&&e&&e.rotate&&e.rotate.times&&e.rotate.times.length){g={};g.times=e.rotate.times.slice();g.values=e.rotate.values.slice();g.interpolation=e.rotate.interpolation;g.rotateType=e.rotate.rotateType;g.cyclicEnd=e.rotate.cyclicEnd;g.cyclicStart=e.rotate.cyclicStart;}else if(c===a.opacity){var o=this._nodesOpacityTrackMap.get(t);if(o){g={};g.times=o.times.slice();g.values=o.values.slice();g.interpolation=o.interpolation;g.cyclicEnd=o.cyclicEnd;g.cyclicStart=o.cyclicStart;}}else if(c===a.color){var h=this._nodesColorTrackMap.get(t);if(h){g={};g.times=h.times.slice();g.values=h.values.slice();g.interpolation=h.interpolation;g.cyclicEnd=h.cyclicEnd;g.cyclicStart=h.cyclicStart;}}return g;};f.prototype._resetDuration=function(){this._animationClip.resetDuration();if(this._duration>0){this._animationClip.duration=this._duration;}};f.prototype.setPositionTracks=function(t,c,e,g,r,h,i,s,p,j,k,l,m,n,o){if(!t){return;}var q=this._nodesPositionTracksMap.get(t);if(!q){q={};q.rotate={};q.translate={};q.scale={};}var u=false;if(c&&h&&c.length>0&&c.length*4===h.length){q.rotate.times=c.slice();q.rotate.values=h.slice();q.rotate.rotateType=r;if(j){q.rotate.interpolation=j;}else{q.rotate.interpolation=d.linear;}u=true;if(m){q.rotate.cyclicStart=m.cyclicStart;q.rotate.cyclicEnd=m.cyclicEnd;}}if(e&&i&&e.length>0&&e.length*3===i.length){q.translate.times=e.slice();q.translate.values=i.slice();if(k){q.translate.interpolation=k;}else{q.translate.interpolation=d.linear;}u=true;if(n){q.translate.cyclicStart=n.cyclicStart;q.translate.cyclicEnd=n.cyclicEnd;}}if(g&&s&&g.length>0&&g.length*3===s.length){q.scale.times=g.slice();q.scale.values=s.slice();if(l){q.scale.interpolation=l;}else{q.scale.interpolation=d.linear;}u=true;if(o){q.scale.cyclicStart=o.cyclicStart;q.scale.cyclicEnd=o.cyclicEnd;}}if(!u){return;}if(p){q.pivot=p.slice();}this._nodesPositionTracksMap.set(t,q);this._setNativePositionTracks(t);this._resetDuration();};f.prototype.getPivot=function(t){var p;var c=this._nodesPositionTracksMap.get(t);if(c&&c.pivot){p=c.pivot.slice();}return p;};f.prototype.setPivot=function(t,p){var c=this._nodesPositionTracksMap.get(t);if(!c){return;}c.pivot=p.slice();this._setNativePositionTracks(t);this._resetDuration();};f.prototype.resetOriginalPosition=function(t,q,p,s){var c=this._nodesPositionTracksMap.get(t);if(!c){return;}if(!c.originalData){c.originalData={};}if(q){c.originalData.quaternion=new THREE.Quaternion(q[0],q[1],q[2],q[3]);}else if(!c.originalData.quaternion){c.originalData.quaternion=t.quaternion.clone();}if(p){c.originalData.position=new THREE.Vector3(p[0],p[1],p[2]);}else if(!c.originalData.position){c.originalData.position=t.position.clone();}if(s){c.originalData.scale=new THREE.Vector3(s[0],s[1],s[2]);}else if(!c.originalData.scale){c.originalData.scale=t.scale.clone();}this._setNativePositionTracks(t);};f.prototype._extendTrackForCyclicStart=function(t,v,c,C){if(!t||t.length===0||!v||v.length===0){return;}var i=C.length/c.length;var s=t[0];var k,e;while(s>0){var m=0;for(k=c.length-1;k>=0;--k){var g=0;if(c.length!==1){if(k===c.length-1){g=0;}else{g=c[k+1]-c[k];}s=s-g;if(g>m){m=g;}}else{s=0;}for(e=i-1;e>=0;e--){v.unshift(C[k*i+e]);}if(s>=0){t.unshift(s);}else{t.unshift(0);break;}}if(s>0&&Math.abs(m-0)<1e-6){s=0;t.unshift(s);for(e=i-1;e>=0;e--){v.unshift(C[e]);}}}};f.prototype._extendTrackForCyclicEnd=function(t,v,c,C){if(!t||t.length===0||!v||v.length===0){return;}var i=C.length/c.length;var e=t[t.length-1];var g=this.getDuration();var k,h;while(e<g){var m=0;for(k=0;k<c.length;++k){var j=0;if(c.length!==1){if(k===0){j=0.0;}else{j=c[k]-c[k-1];}e=e+j;if(j>m){m=j;}}else{e=g;}for(h=0;h<i;h++){v.push(C[k*i+h]);}t.push(e);if(e>=g){break;}}if(e<g&&Math.abs(m-0)<1e-6){e=g;t.push(e);for(h=i;h>0;h--){v.push(C[C.length-h]);}}}};f.prototype._resetRotateTimes=function(r,c,e,t,s){var g=[];if(!r||r.length===0){return g;}var m=Math.PI/6;var h,k;g.push(r[0]);for(k=1;k<r.length;k++){var i=r[k-1];var j=r[k];if(e===b.angleAxis){var l=c[k*4+3];h=Math.ceil(l/m);}else if(e===b.euler){var n=0;for(var o=0;o<3;o++){var p=Math.abs(c[(k)*4+o]-c[(k-1)*4+o]);if(n<p){n=p;}}h=Math.ceil(n/m);}else{h=Math.ceil((j-i)/0.25);if(h<M){h=M;}}if(h<2){g.push(j);continue;}var q=(j-i)/h;if(Math.abs(q)<1e-6){g.push(j);continue;}for(var u=1;u<h;u++){g.push(i+u*q);}g.push(j);}var v;var w,x;if(t){w=g[0];x=g[g.length-1];for(v=0;v<t.length;v++){if(t[v]>x+1e-6){g.push(t[v]);}}for(v=t.length-1;v>=0;v--){if(t[v]<w-1e-6){g.unshift(t[v]);}}}if(s){w=g[0];x=g[g.length-1];for(v=0;v<s.length;v++){if(s[v]>x+1e-6){g.push(s[v]);}}for(v=s.length-1;v>=0;v--){if(s[v]<w-1e-6){g.unshift(s[v]);}}}return g;};f.prototype._setNativePositionTracks=function(t){var c=this._nodesPositionTracksMap.get(t);if(!c){return;}if(!c.originalData){c.originalData={};c.originalData.quaternion=t.quaternion.clone();c.originalData.position=t.position.clone();c.originalData.scale=t.scale.clone();}var k,e;if(c.scale.nativeTrack){for(k=0;k<this._animationClip.tracks.length;k++){e=this._animationClip.tracks[k];if(e===c.scale.nativeTrack){this._animationClip.tracks.splice(k,1);break;}}}if(c.rotate.nativeTrack){for(k=0;k<this._animationClip.tracks.length;k++){e=this._animationClip.tracks[k];if(e===c.rotate.nativeTrack){this._animationClip.tracks.splice(k,1);break;}}}if(c.translate.nativeTrack){for(k=0;k<this._animationClip.tracks.length;k++){e=this._animationClip.tracks[k];if(e===c.translate.nativeTrack){this._animationClip.tracks.splice(k,1);break;}}}var n=this._nodesEndData.get(t);var g=this._nodesStartData.get(t);if(n){n.position=null;n.scale=null;n.quaternion=null;}if(g){g.position=null;g.scale=null;g.quaternion=null;}if((!c.rotate.times||c.rotate.times.length===0)&&(!c.scale.times||c.scale.times.length===0)&&(!c.translate.times||c.translate.times.length===0)){this._nodesPositionTracksMap.delete(t);return;}var h=function(m1){var n1=false;var o1=m1.name+" offset geometry";for(var l=0;l<m1.children.length;l++){var o=m1.children[l];if(o.name===o1&&o.type==="Group"){n1=true;break;}var p1=o.name+" offset geometry";for(var q1=0;q1<o.children.length;q1++){var r1=o.children[q1];if(r1.name===p1&&r1.type==="Group"){n1=true;break;}}if(n1){break;}}return n1;};var i=false;var p;if(c.pivot){p=c.pivot.slice();var j=false;if(t.children){j=h(t);if(!j){for(var l=0;l<t.children.length;l++){var o=t.children[l];if(o.isMesh){var q=new THREE.Vector3(p[0],p[1],p[2]);q.applyMatrix4(o.matrix);p[0]=q.x;p[1]=q.y;p[2]=q.z;j=false;break;}}}}if(j){i=true;}}else{i=true;}if(!i){if(Math.abs(p[0]-0.0)<1e-6&&Math.abs(p[1]-0.0)<1e-6&&Math.abs(p[2]-0.0)<1e-6){i=true;}}var r,s;if(c.rotate.times&&c.rotate.times.length>0){r=c.rotate.times.slice(0);s=c.rotate.values.slice(0);}var u,v;if(c.translate.times&&c.translate.times.length>0){u=c.translate.times.slice(0);v=c.translate.values.slice(0);}var w,x;if(c.scale.times&&c.scale.times.length>0){w=c.scale.times.slice(0);x=c.scale.values.slice(0);}var y;if(r){if(y===undefined||y>r[0]){y=r[0];}}if(u&&!i){if(y===undefined||y>u[0]){y=u[0];}}if(w&&!i){if(y===undefined||y>w[0]){y=w[0];}}if(!r){if(!i){r=[y];s=[c.originalData.quaternion.x,c.originalData.quaternion.y,c.originalData.quaternion.z,c.originalData.quaternion.w];c.rotate.rotateType=b.quaternion;c.rotate.interpolation=d.linear;}}if(!u){if(!i){u=[y];v=[c.originalData.position.x,c.originalData.position.y,c.originalData.position.z];c.translate.interpolation=d.linear;}}if(!w){if(!i){w=[y];x=[c.originalData.scale.x,c.originalData.scale.y,c.originalData.scale.z];c.scale.interpolation=d.linear;}}var z=t.uuid;var B=[];if(r){B=this._resetRotateTimes(r,s,c.rotate.rotateType,u,w);}var C=[];var D=[];var E=[];var F=[];var G=[];var H=new THREE.Matrix4();var I=new THREE.Matrix4();if(!i){H.makeTranslation(p[0],p[1],p[2]);I.makeTranslation(-p[0],-p[1],-p[2]);}var J=new THREE.Matrix4();var K=new THREE.Matrix4();var L=new THREE.Matrix4();var O,P,R;for(R=0;R<B.length;R++){var S=B[R];var T=0;var U=0;var V=0;if(r){if(S<=r[0]){T=0;U=0;}else if(S>=r[r.length-1]){if(r.length>1){V=1;}T=r.length-1;U=r.length-1;}else{for(k=0;k<r.length-1;k++){O=r[k];P=r[k+1];if(S>=O&&S<=P){V=(S-O)/(P-O);T=k;U=k+1;break;}}}J=this._getRotationMatrix(T,U,s,c.rotate.rotateType,V);}var W=null;var X=null;V=0;if(w){if(S<=w[0]){W=[x[0],x[1],x[2]];}else if(S>=w[w.length-1]){X=[x[x.length-3],x[x.length-2],x[x.length-1]];}else{for(k=0;k<w.length-1;k++){O=w[k];P=w[k+1];if(S>=O&&S<=P){W=[x[k*3],x[k*3+1],x[k*3+2]];X=[x[k*3+3],x[k*3+4],x[k*3+5]];V=(S-O)/(P-O);break;}}}K=this._getScaleMatrix(W,X,V);}var Y=null;var Z=null;V=0;if(u){if(S<=u[0]){Y=[v[0],v[1],v[2]];}else if(S>=u[u.length-1]){Z=[v[v.length-3],v[v.length-2],v[v.length-1]];}else{for(k=0;k<u.length-1;k++){O=u[k];P=u[k+1];if(S>=O&&S<=P){Y=[v[k*3],v[k*3+1],v[k*3+2]];Z=[v[k*3+3],v[k*3+4],v[k*3+5]];V=(S-O)/(P-O);break;}}}L=this._getTranslateMatrix(Y,Z,V);}var m=new THREE.Matrix4();m.multiply(L);m.multiply(J);m.multiply(K);m.multiply(I);var $=new THREE.Quaternion();var _=new THREE.Vector3();var a1=new THREE.Vector3();m.decompose(_,$,a1);E.push($.x,$.y,$.z,$.w);if(!i){D.push(_.x,_.y,_.z);F.push(a1.x,a1.y,a1.z);C.push(S);G.push(S);}}if(i){D=v;C=u;F=x;G=w;}var b1,c1;if(r&&(c.rotate.cyclicStart||c.rotate.cyclicEnd)){b1=B.slice(0);c1=E.slice(0);if(c.rotate.cyclicStart){this._extendTrackForCyclicStart(B,E,b1,c1);}if(c.rotate.cyclicEnd){this._extendTrackForCyclicEnd(B,E,b1,c1);}}if(u&&(c.translate.cyclicStart||c.translate.cyclicEnd)){b1=C.slice(0);c1=D.slice(0);if(c.translate.cyclicStart){this._extendTrackForCyclicStart(C,D,b1,c1);}if(c.translate.cyclicEnd){this._extendTrackForCyclicEnd(C,D,b1,c1);}}if(w&&(c.scale.cyclicStart||c.scale.cyclicEnd)){b1=G.slice(0);c1=F.slice(0);if(c.scale.cyclicStart){this._extendTrackForCyclicStart(G,F,b1,c1);}if(c.scale.cyclicEnd){this._extendTrackForCyclicEnd(G,F,b1,c1);}}if(!n){n={};}if(!g){g={};}if(w){if(G[0]>0){F.unshift(F[0],F[1],F[2]);G.unshift(G[0]);g.scale=null;}else{var d1=new THREE.Vector3(F[0],F[1],F[2]);g.scale=d1;}var e1=new THREE.Vector3(F[F.length-3],F[F.length-2],F[F.length-1]);n.scale=e1;var f1=z+".scale";c.scale.nativeTrack=new THREE.VectorKeyframeTrack(f1,G,F);c.scale.nativeTrack.userData={};c.scale.nativeTrack.userData.originalValue=t.scale.clone();if(c.scale.interpolation===d.discrete){c.scale.nativeTrack.setInterpolation(THREE.InterpolateDiscrete);}else if(c.scale.interpolation===d.cubic){c.scale.nativeTrack.setInterpolation(THREE.InterpolateSmooth);}else{c.scale.nativeTrack.setInterpolation(THREE.InterpolateLinear);}c.scale.nativeTrack.userData.targetNode=t;this._animationClip.tracks.push(c.scale.nativeTrack);}if(r){if(B[0]>0){E.unshift(E[0],E[1],E[2],E[3]);B.unshift(B[0]);g.quaternion=null;}else{var g1=new THREE.Quaternion(E[0],E[1],E[2],E[3]);g.quaternion=g1;}var h1=new THREE.Quaternion(E[E.length-4],E[E.length-3],E[E.length-2],E[E.length-1]);n.quaternion=h1;var i1=z+".quaternion";c.rotate.nativeTrack=new THREE.QuaternionKeyframeTrack(i1,B,E);c.rotate.nativeTrack.userData={};c.rotate.nativeTrack.userData.originalValue=t.quaternion.clone();if(c.rotate.interpolation===d.discrete){c.rotate.nativeTrack.setInterpolation(THREE.InterpolateDiscrete);}else if(c.rotate.interpolation===d.cubic){c.rotate.nativeTrack.setInterpolation(THREE.InterpolateSmooth);}else{c.rotate.nativeTrack.setInterpolation(THREE.InterpolateLinear);}c.rotate.nativeTrack.userData.targetNode=t;this._animationClip.tracks.push(c.rotate.nativeTrack);}if(u){if(C[0]>0){D.unshift(D[0],D[1],D[2]);C.unshift(C[0]);g.position=null;}else{var j1=new THREE.Vector3(D[0],D[1],D[2]);g.position=j1;}var k1=new THREE.Vector3(D[D.length-3],D[D.length-2],D[D.length-1]);n.position=k1;var l1=z+".position";c.translate.nativeTrack=new THREE.VectorKeyframeTrack(l1,C,D);c.translate.nativeTrack.userData={};c.translate.nativeTrack.userData.originalValue=t.position.clone();if(c.translate.interpolation===d.discrete){c.translate.nativeTrack.setInterpolation(THREE.InterpolateDiscrete);}else if(c.translate.interpolation===d.cubic){c.translate.nativeTrack.setInterpolation(THREE.InterpolateSmooth);}else{c.translate.nativeTrack.setInterpolation(THREE.InterpolateLinear);}c.translate.nativeTrack.userData.targetNode=t;this._animationClip.tracks.push(c.translate.nativeTrack);this._nodesPositionTracksMap.set(t,c);}this._nodesEndData.set(t,n);this._nodesStartData.set(t,g);};f.prototype.setOpacityTrack=function(t,c,v,i,e,g){if(c.length!==v.length){return;}if(i&&i!==d.linear&&i!==d.cubic&&i!==d.discrete){return;}var o=this._nodesOpacityTrackMap.get(t);if(!o){o={};}o.times=c.slice();o.values=v.slice();if(i){o.interpolation=i;}else{o.interpolation=d.linear;}if(e){o.isHighlight=true;this._hasHighlight=true;}else{o.isHighlight=false;}if(g){o.cyclicStart=g.cyclicStart;o.cyclicEnd=g.cyclicEnd;}this._nodesOpacityTrackMap.set(t,o);this._setNativeOpacityTrack(t);this._resetDuration();};f.prototype._getNodesWithMaterialColor=function(p,n){if(p&&p.material&&p.material.color){n.push(p);}for(var c=0;p.children&&c<p.children.length;c++){var e=p.children[c];this._getNodesWithMaterialColor(e,n);}};f.prototype._getNodesWithMaterialOpacity=function(p,n){if(p&&p.material&&p.material.opacity!==undefined){n.push(p);}for(var c=0;p.children&&c<p.children.length;c++){var e=p.children[c];this._getNodesWithMaterialOpacity(e,n);}};f.prototype._resetMaterialTransparentForOpacityTrack=function(){var t=this._nodesOpacityTrackMap.values();var n=t.next();while(!n.done){var o=n.value;if(o.nativeTracks){for(var c=0;c<o.nativeTracks.length;c++){var e=o.nativeTracks[c];if(e.userData&&e.userData.targetNode&&e.userData.targetNode.material){e.userData.targetNode.material.transparent=true;}}}n=t.next();}};f.prototype._setNativeOpacityTrack=function(t){var o=this._nodesOpacityTrackMap.get(t);if(!o){return;}if(o.nativeTracks){for(var c=0;c<o.nativeTracks.length;c++){var e=o.nativeTracks[c];for(var i=0;i<this._animationClip.tracks.length;i++){var g=this._animationClip.tracks[i];if(e===g){this._animationClip.tracks.splice(i,1);break;}}}}o.nativeTracks=[];var n=[];this._getNodesWithMaterialOpacity(t,n);var m,h,j,k;if(!o.times||o.times.length==0){for(h=0;h<n.length;h++){m=n[h];if(m.userData&&m.userData.originalMaterial){if(!m.userData.highlightColor&&!m.userData.animatedColor){m.material.color.copy(m.userData.originalMaterial.color);if(m.material.emissive!==undefined){m.material.emissive.copy(m.userData.originalMaterial.emissive);}if(m.material.specular!==undefined){m.material.specular.copy(m.userData.originalMaterial.specular);}}m.material.opacity=m.userData.originalMaterial.opacity;m.material.transparent=m.userData.originalMaterial.transparent;delete m.userData.animatedOpacity;}j=this._nodesEndData.get(m);if(j&&j.opacity){delete j.opacity;}k=this._nodesStartData.get(m);if(k&&k.opacity){delete k.opacity;}}this._nodesOpacityTrackMap.delete(t);return;}var l=o.times.slice(0);var v=o.values.slice(0);if(l.length===0){return;}if(o.cyclicStart||o.cyclicEnd){var p=o.times.slice(0);var C=o.values.slice(0);if(o.cyclicStart){this._extendTrackForCyclicStart(l,v,p,C);}if(o.cyclicEnd){this._extendTrackForCyclicEnd(l,v,p,C);}}if(l[0]>0){v.unshift(v[0]);l.unshift(l[0]-1e-4);}for(h=0;h<n.length;h++){m=n[h];if(!m.userData){m.userData={};}if(!m.userData.originalMaterial){m.userData.originalMaterial=m.material;m.material=m.material.clone();}if(l[0]>0){if(m.userData.originalMaterial.opacity!==undefined){v[0]=m.userData.originalMaterial.opacity;}else{v[0]=1;}}m.userData.animatedOpacity=true;var q=m.uuid+".material.opacity";var r=m.material.opacity;m.material.transparent=true;j=this._nodesEndData.get(m);if(!j){j={};}k=this._nodesStartData.get(m);if(!k){k={};}if(o.isHighlight){j.opacity=m.material.opacity;}else{j.opacity=v[v.length-1];}this._nodesEndData.set(m,j);if(o.isHighlight){k.opacity=m.material.opacity;}else{k.opacity=v[0];}this._nodesStartData.set(m,k);var s=new THREE.NumberKeyframeTrack(q,l,v);if(o.interpolation===d.discrete){s.setInterpolation(THREE.InterpolateDiscrete);}else if(o.interpolation===d.cubic){s.setInterpolation(THREE.InterpolateSmooth);}else{s.setInterpolation(THREE.InterpolateLinear);}s.userData={};s.userData.targetNode=m;s.userData.originalValue=r;this._animationClip.tracks.push(s);o.nativeTracks.push(s);}};f.prototype.setColorTrack=function(t,c,v,i,e,g){if(c.length*3!==v.length){return;}if(i&&i!==d.linear&&i!==d.cubic&&i!==d.discrete){return;}var h=this._nodesColorTrackMap.get(t);if(!h){h={};}h.times=c.slice();h.values=v.slice();if(i){h.interpolation=i;}else{h.interpolation=d.linear;}if(e){h.isHighlight=true;this._hasHighlight=true;}else{h.isHighlight=false;}if(g){h.cyclicStart=g.cyclicStart;h.cyclicEnd=g.cyclicEnd;}this._nodesColorTrackMap.set(t,h);this._setNativeColorTrack(t);this._resetDuration();};f.prototype._setNativeColorTrack=function(t){var c=this._nodesColorTrackMap.get(t);if(!c){return;}if(c.nativeTracks){for(var o=0;o<c.nativeTracks.length;o++){var e=c.nativeTracks[o];for(var i=0;i<this._animationClip.tracks.length;i++){var g=this._animationClip.tracks[i];if(e===g){this._animationClip.tracks.splice(i,1);break;}}}}c.nativeTracks=[];var n=[];this._getNodesWithMaterialColor(t,n);var h,m,j,k;if(!c.times||c.times.length==0){for(h=0;h<n.length;h++){m=n[h];if(m.userData&&m.userData.originalMaterial){if(!m.userData.highlightColor){m.material.color.copy(m.userData.originalMaterial.color);if(m.material.emissive!==undefined){m.material.emissive.copy(m.userData.originalMaterial.emissive);}if(m.material.specular!==undefined){m.material.specular.copy(m.userData.originalMaterial.specular);}}delete m.userData.animatedColor;}j=this._nodesEndData.get(m);if(j&&j.color){delete j.color;}k=this._nodesStartData.get(m);if(k&&k.color){delete k.color;}}this._nodesColorTrackMap.delete(t);return;}var l=c.times.slice(0);var v=c.values.slice(0);if(l.length===0){return;}if(c.cyclicStart||c.cyclicEnd){var p=c.times.slice(0);var C=c.values.slice(0);if(c.cyclicStart){this._extendTrackForCyclicStart(l,v,p,C);}if(c.cyclicEnd){this._extendTrackForCyclicEnd(l,v,p,C);}}if(l[0]>0){v.unshift(v[0],v[1],v[2]);l.unshift(l[0]-1e-4);}for(h=0;h<n.length;h++){m=n[h];if(!m.userData){m.userData={};}if(!m.userData.originalMaterial){m.userData.originalMaterial=m.material;m.material=m.material.clone();}if(l[0]>0&&m.userData.originalMaterial.color){v[0]=m.userData.originalMaterial.color.r;v[1]=m.userData.originalMaterial.color.g;v[2]=m.userData.originalMaterial.color.b;}m.userData.animatedColor=true;var q=m.uuid+".material.color";var r=m.material.color.clone();j=this._nodesEndData.get(m);if(!j){j={};}k=this._nodesStartData.get(m);if(!k){k={};}if(c.isHighlight){j.color=m.material.color.clone();}else{j.color=new THREE.Color(v[v.length-3],v[v.length-2],v[v.length-1]);}this._nodesEndData.set(m,j);if(c.isHighlight){k.color=m.material.color.clone();}else{k.color=new THREE.Color(v[0],v[1],v[2]);}this._nodesStartData.set(m,k);var s=new THREE.ColorKeyframeTrack(q,l,v);if(c.interpolation===d.discrete){s.setInterpolation(THREE.InterpolateDiscrete);}else if(c.interpolation===d.cubic){s.setInterpolation(THREE.InterpolateSmooth);}else{s.setInterpolation(THREE.InterpolateLinear);}s.userData={};s.userData.targetNode=m;s.userData.originalValue=r;this._animationClip.tracks.push(s);c.nativeTracks.push(s);}};f.prototype.getInterpolation=function(t,c){var i;var e=this._nodesPositionTracksMap.get(t);if(c===a.rotate&&e){i=e.rotate.interpolation;}else if(c===a.translate&&e){i=e.translate.interpolation;}else if(c===a.scale&&e){i=e.scale.interpolation;}else if(c===a.opacity){var o=this._nodesOpacityTrackMap.get(t);if(o){i=o.interpolation;}}else if(c===a.color){var g=this._nodesColorTrackMap.get(t);if(g){i=g.interpolation;}}return i;};f.prototype.setTrackCyclicStyle=function(t,c,e,g){var h=this._nodesPositionTracksMap.get(t);if(c===a.rotate&&h&&h.rotate){h.rotate.cyclicStart=e;h.rotate.cyclicEnd=g;this._setNativePositionTracks(t);}else if(c===a.translate&&h&&h.translate){h.translate.cyclicStart=e;h.translate.cyclicEnd=g;this._setNativePositionTracks(t);}else if(c===a.scale&&h&&h.scale){h.scale.cyclicStart=e;h.scale.cyclicEnd=g;this._setNativePositionTracks(t);}else if(c===a.opacity){var o=this._nodesOpacityTrackMap.get(t);if(o){o.cyclicStart=e;o.cyclicEnd=g;this._setNativeOpacityTrack(t);}}else if(c===a.color){var i=this._nodesColorTrackMap.get(t);if(i){i.cyclicStart=e;i.cyclicEnd=g;this._setNativeColorTrack(t);}}this._resetDuration();};f.prototype.setInterpolation=function(t,c,i){var e=this._nodesPositionTracksMap.get(t);var n=[];if(c===a.rotate&&e&&e.rotate){e.rotate.interpolation=i;n.push(e.rotate.nativeTrack);}else if(c===a.translate&&e&&e.translate){e.translate.interpolation=i;n.push(e.translate.nativeTrack);}else if(c===a.scale&&e&&e.scale){e.scale.interpolation=i;n.push(e.scale.nativeTrack);}else if(c===a.opacity){var o=this._nodesOpacityTrackMap.get(t);if(o){o.interpolation=i;n=o.nativeTracks;}}else if(c===a.color){var g=this._nodesColorTrackMap.get(t);if(g){g.interpolation=i;n=g.nativeTracks;}}for(var h=0;h<n.length;h++){var j=n[h];if(j){if(i===d.discrete){j.setInterpolation(THREE.InterpolateDiscrete);}else if(i===d.cubic){j.setInterpolation(THREE.InterpolateSmooth);}else{j.setInterpolation(THREE.InterpolateLinear);}}}this._resetDuration();};f.prototype.getNearestKeyFrame=function(c,e,g,h){var i,v,r;if(e===a.rotate||e===a.translate||e===a.scale){var j=this._nodesPositionTracksMap.get(c);if(e===a.rotate&&j&&j.rotate.times&&j.rotate.times.length){i=j.rotate.times;v=j.rotate.values;r=j.rotate.rotateType;}else if(e===a.translate&&j&&j.translate.times&&j.translate.times.length){i=j.translate.times;v=j.translate.values;}else if(e===a.scale&&j&&j.scale.times&&j.scale.times.length){i=j.scale.times;v=j.scale.values;}}else if(e===a.opacity){var o=this._nodesOpacityTrackMap.get(c);if(o&&o.times&&o.values){i=o.times;v=o.values;}}else if(e===a.color){var k=this._nodesColorTrackMap.get(c);if(k&&k.times&&k.values){i=k.times;v=k.values;}}var l;if(i&&v){var m=Math.abs(g-i[0]);var n=0;for(var p=1;p<i.length;p++){var t=i[p];if(Math.abs(t-g)<m){m=Math.abs(t-g);n=p;}}if(h!=null){if(m>h){return l;}}l={};l.index=n;l.time=i[n];if(e===a.translate||e===a.scale||e===a.color){l.value=[v[n*3],v[n*3+1],v[n*3+2]];}else if(e===a.rotate){l.value=[v[n*4],v[n*4+1],v[n*4+2],v[n*4+3]];}else{l.value=[v[n]];}if(r){l.rotateType=r;}}return l;};f.prototype.getRotateKeyFrameInQuaternion=function(t,i){var v;var c=this._nodesPositionTracksMap.get(t);if(c&&c.rotate&&c.rotate.times.length>i){var r=[c.rotate.values[i*4],c.rotate.values[i*4+1],c.rotate.values[i*4+2],c.rotate.values[i*4+3]];v=this._convertRotationForm(c.rotate.rotateType,b.quaternion,r);}return v;};f.prototype.addKeyFrame=function(c,e,g,v,r,n){if(v.length!==3&&(e===a.color||e===a.translate||e===a.scale)){return;}else if(v.length!==1&&e===a.opacity){return;}else if(v.length!==4&&e===a.rotate){return;}var h,j;if(e===a.rotate||e===a.translate||e===a.scale){var k=this._nodesPositionTracksMap.get(c);if(!k){k={};k.rotate={};k.translate={};k.scale={};this._nodesPositionTracksMap.set(c,k);}if(e===a.rotate){if(!k.rotate.times){k.rotate.times=[];k.rotate.values=[];}h=k.rotate.times;j=k.rotate.values;if(r){if(!k.rotate.rotateType){k.rotate.rotateType=r;}else if(k.rotate.rotateType!==r){v=this._convertRotationForm(r,k.rotate.rotateType,v);}}}else if(e===a.translate){if(!k.translate.times){k.translate.times=[];k.translate.values=[];}h=k.translate.times;j=k.translate.values;}else if(e===a.scale){if(!k.scale.times){k.scale.times=[];k.scale.values=[];}h=k.scale.times;j=k.scale.values;}}else if(e===a.opacity){var o=this._nodesOpacityTrackMap.get(c);if(!o){o={};o.times=[];o.values=[];this._nodesOpacityTrackMap.set(c,o);}h=o.times;j=o.values;}else if(e===a.color){var l=this._nodesColorTrackMap.get(c);if(!l){l={};l.times=[];l.values=[];this._nodesColorTrackMap.set(c,l);}h=l.times;j=l.values;}var m;if(h&&j){if(g<=h[0]||h.length===0){h.unshift(g);for(m=v.length-1;m>=0;m--){j.unshift(v[m]);}}else if(g>=h[h.length-1]){h.push(g);for(m=0;m<v.length;m++){j.push(v[m]);}}else{for(var p=1;p<h.length;p++){if(g<h[p]){h.splice(p,0,g);if(e===a.translate||e===a.scale||e===a.color){j.splice(p*3,0,v[0],v[1],v[2]);}else if(e===a.rotate){j.splice(p*4,0,v[0],v[1],v[2],v[3]);}else{j.splice(p,0,v[0]);}break;}}}}if(e===a.rotate||e===a.translate||e===a.scale){this._setNativePositionTracks(c);}else if(e===a.opacity){this._setNativeOpacityTrack(c);}else if(e===a.color){this._setNativeColorTrack(c);}this._resetDuration();if(e===a.rotate&&r!==b.quaternion){var q=this._nodesPositionTracksMap.get(c);if(q&&q.rotate.nativeTrack){for(var i=0;i<q.rotate.nativeTrack.times.length;i++){var t=q.rotate.nativeTrack.times[i];if(Math.abs(t-g)<1e-9){v=[q.rotate.nativeTrack.values[i*4],q.rotate.nativeTrack.values[i*4+1],q.rotate.nativeTrack.values[i*4+2],q.rotate.nativeTrack.values[i*4+3]];}}}}if(!n){this.fireKeyFrameAdded({sequenceId:this.getSequenceId(),targetNodeRef:c,trackType:e,keyFrameValue:v,keyFrameTime:g});}};f.prototype.deleteKeyFrame=function(t,c,i,n){var e,v,g;if(c===a.rotate||c===a.translate||c===a.scale){g=this._nodesPositionTracksMap.get(t);if(!g){return;}if(c===a.rotate&&g&&g.rotate.times&&g.rotate.times.length){e=g.rotate.times;v=g.rotate.values;}else if(c===a.translate&&g&&g.translate.times&&g.translate.times.length){e=g.translate.times;v=g.translate.values;}else if(c===a.scale&&g&&g.scale.times&&g.scale.times.length){e=g.scale.times;v=g.scale.values;}}else if(c===a.opacity){var o=this._nodesOpacityTrackMap.get(t);if(!o){return;}e=o.times;v=o.values;}else if(c===a.color){var h=this._nodesColorTrackMap.get(t);if(!h){return;}e=h.times;v=h.values;}var j,k;if(e&&v){if(i<0||i>=e.length){return;}k=e[i];e.splice(i,1);if(c===a.translate||c===a.scale||c===a.color){j=[v[i*3],v[i*3+1],v[i*3+2]];v.splice(i*3,3);}else if(c===a.rotate){var r=[v[i*4],v[i*4+1],v[i*4+2],v[i*4+3]];j=this._convertRotationForm(g.rotate.rotateType,b.quaternion,r);v.splice(i*4,4);}else{j=[v[i]];v.splice(i,1);}}var l=true;if(c===a.rotate||c===a.translate||c===a.scale){this._setNativePositionTracks(t);var p=this._nodesPositionTracksMap.get(t);if(p){if(c===a.rotate&&p.rotate.times&&p.rotate.times.length>0){l=false;}else if(c===a.translate&&p.translate.times&&p.translate.times.length>0){l=false;}else if(c===a.scale&&p.scale.times&&p.scale.times.length>0){l=false;}}}else if(c===a.opacity){this._setNativeOpacityTrack(t);var T=this._nodesOpacityTrackMap.get(t);if(T){l=false;}}else if(c===a.color){this._setNativeColorTrack(t);var m=this._nodesColorTrackMap.get(t);if(m){l=false;}}this._resetDuration();if(!n){this.fireKeyFrameDeleted({sequenceId:this.getSequenceId(),targetNodeRef:t,trackType:c,keyFrameValue:j,keyFrameTime:k,keyFrameIndex:i,lastTrack:l});}};f.prototype.updateKeyFrame=function(c,e,g,h,v,r,n){this.deleteKeyFrame(c,e,g,true);this.addKeyFrame(c,e,h,v,r,true);if(e===a.rotate&&r!==b.quaternion){var j=this._nodesPositionTracksMap.get(c);if(j.rotate.nativeTrack){for(var i=0;i<j.rotate.nativeTrack.times.length;i++){var t=j.rotate.nativeTrack.times[i];if(Math.abs(t-h)<1e-9){v=[j.rotate.nativeTrack.values[i*4],j.rotate.nativeTrack.values[i*4+1],j.rotate.nativeTrack.values[i*4+2],j.rotate.nativeTrack.values[i*4+3]];}}}}if(!n){this.fireKeyFrameUpdated({sequenceId:this.getSequenceId(),targetNodeRef:c,trackType:e,keyFrameValue:v,keyFrameTime:h,keyFrameIndex:g});}};f.prototype._getAngleAxisFromQuaternion=function(c,e,g,h){var q=new THREE.Quaternion(c,e,g,h);if(q.w>1){q.normalise();}var i=2*Math.acos(q.w);var s=Math.sqrt(1-q.w*q.w);var x,y,z;if(s<0.001){x=q.x;y=q.y;z=q.z;}else{x=q.x/s;y=q.y/s;z=q.z/s;}return[x,y,z,i];};f.prototype._getEnulerFromQuaternion=function(c,e,g,h){var q=new THREE.Quaternion(c,e,g,h);if(q.w>1){q.normalise();}var o=26;var t=q.x*q.y+q.z*q.w;var i,j,k;if(t>0.499){i=2*Math.atan2(q.x,q.w);j=Math.PI/2;k=0;}if(t<-0.499){i=-2*Math.atan2(q.x,q.w);j=-Math.PI/2;k=0;}else{var s=q.x*q.x;var l=q.y*q.y;var m=q.z*q.z;i=Math.atan2(2*q.y*q.w-2*q.x*q.z,1-2*l-2*m);j=Math.asin(2*t);k=Math.atan2(2*q.x*q.w-2*q.y*q.z,1-2*s-2*m);}return[i,j,k,o];};f.prototype._convertRotationForm=function(s,c,g){var h;var q,e,o,i,j,k;if(c===b.quaternion){q=new THREE.Quaternion();if(s===b.angleAxis){j=new THREE.Vector3(g[0],g[1],g[2]);j.normalize();q.setFromAxisAngle(j,g[3]);h=[q.x,q.y,q.z,q.w];}else if(s===b.euler){o=Math.round(g[3]);i="";for(k=0;k<3;k++){if((o>>(k*2)&3)===0){i.push("X");}else if((o>>(k*2)&3)===1){i.push("Y");}else if((o>>(k*2)&3)===2){i.push("Z");}}e=new THREE.Euler(g[0],g[1],g[2],i);q.setFromEuler(e);h=[q.x,q.y,q.z,q.w];}else{h=g.slice();}}else if(c===b.angleAxis){if(s===b.quaternion){h=this._getAngleAxisFromQuaternion(g);}else if(s===b.euler){o=Math.round(g[3]);i="";for(k=0;k<3;k++){if((o>>(k*2)&3)===0){i.push("X");}else if((o>>(k*2)&3)===1){i.push("Y");}else if((o>>(k*2)&3)===2){i.push("Z");}}e=new THREE.Euler(g[0],g[1],g[2],i);q.setFromEuler(e);h=this._getAngleAxisFromQuaternion(g);}else{h=g.slice();}}else if(c===b.euler){if(s===b.quaternion){h=this._getEnulerFromQuaternion(g);}else if(s===b.angleAxis){q=new THREE.Quaternion();j=new THREE.Vector3(g[0],g[1],g[2]);j.normalize();q.setFromAxisAngle(j,g[3]);h=this._getAngleAxisFromQuaternion(q);}else{h=g.slice();}}return h;};f.prototype.addKeyFrameByNodeProperty=function(t,c,e,n){var v;var m;var r;if(c===a.rotate){v=[t.quaternion.x,t.quaternion.y,t.quaternion.z,t.quaternion.w];r=b.quaternion;}else if(c===a.translate){v=[t.position.x,t.position.y,t.position.z];}else if(c===a.scale){v=[t.scale.x,t.scale.y,t.scale.z];}else if(c===a.opacity){if(t){m=t.material;if(m&&m.opacity!==undefined){v=[m.opacity];}}}else if(c===a.color){if(t){m=t.material;if(m&&m.color){v=[m.color.r,m.color.g,m.color.b];}}}if(v){this.addKeyFrame(t,c,e,v,r,n);}return v;};f.prototype.updateKeyFrameByNodeProperty=function(t,c,e,i,n){this.deleteKeyFrame(t,c,i,true);var v=this.addKeyFrameByNodeProperty(t,c,e,true);if(!n){this.fireKeyFrameUpdated({sequenceId:this.getSequenceId(),targetNodeRef:t,trackType:c,keyFrameValue:v,keyFrameTime:e,keyFrameIndex:i});}};f.prototype.getNodesEndValues=function(){return this._nodesEndData;};f.prototype.getNodesStartValues=function(){return this._nodesStartData;};f.prototype.hasHighlight=function(){return this._hasHighlight;};f.prototype.setHasHighlight=function(h){this._hasHighlight=h;};f.prototype._cloneKeyFrameTrack=function(t){var c=THREE.AnimationUtils.arraySlice(t.times,0);var v=THREE.AnimationUtils.arraySlice(t.values,0);var T=t.constructor;var e=new T(t.name,c,v);e.createInterpolant=t.createInterpolant;return e;};f.prototype._cloneAnimationClip=function(c){var t=[];for(var i=0;c.tracks&&i<c.tracks.length;i++){t.push(this._cloneKeyFrameTrack(c.tracks[i]));}return new THREE.AnimationClip(c.name,c.duration,t);};f.prototype.clone=function(s,i){this.setName(s.getName());this._hasHighlight=s._hasHighlight;var e,n,m,c;this._nodesEndData=new Map();e=s._nodesEndData.entries();n=e.next();while(!n.done){m=n.value[0];c=n.value[1];this._nodesEndData.set(m,c);n=e.next();}this._nodesStartData=new Map();e=s._nodesStartData.entries();n=e.next();while(!n.done){m=n.value[0];c=n.value[1];this._nodesStartData.set(m,c);n=e.next();}var t;this._nodesPositionTracksMap=new Map();e=s._nodesPositionTracksMap.entries();n=e.next();while(!n.done){t=n.value[0];var g=n.value[1];n=e.next();this.setPositionTracks(t,g.rotate.times,g.translate.times,g.scale.times,g.rotate.rotateType,g.rotate.values,g.translate.values,g.scale.values,g.pivot,g.rotate.interpolation,g.translate.interpolation,g.scale.interpolation);}this._nodesOpacityTrackMap=new Map();e=s._nodesOpacityTrackMap.entries();n=e.next();while(!n.done){t=n.value[0];var o=n.value[1];n=e.next();if(!o.isHighlight||(o.isHighlight&&i)){this.setOpacityTrack(t,o.times,o.values,o.interpolation,o.isHighlight);}}this._nodesColorTrackMap=new Map();e=s._nodesColorTrackMap.entries();n=e.next();while(!n.done){t=n.value[0];var h=n.value[1];n=e.next();if(!h.isHighlight||(h.isHighlight&&i)){this.setColorTrack(t,h.times,h.values,h.interpolation,h.isHighlight);}}this._resetDuration();};f.prototype.getDuration=function(){if(this._duration===0){return this._animationClip.duration;}else{return this._duration;}};f.prototype.setInitialStatusToTargetNodesValues=function(){var k,t,n,c,e;k=this._nodesOpacityTrackMap.keys();n=k.next();while(!n.done){t=n.value;var o=this._nodesOpacityTrackMap.get(t);if(o&&o.nativeTracks){for(var i=0;i<o.nativeTracks.length;i++){c=o.nativeTracks[i];e=c.userData.targetNode;if(c.times[0]>0){if(e&&e.material&&e.material.opacity!==undefined){c.values[0]=e.material.opacity;}else{c.values[0]=1;}}}}n=k.next();}k=this._nodesColorTrackMap.keys();n=k.next();while(!n.done){t=n.value;var g=this._nodesColorTrackMap.get(t);if(g&&g.nativeTracks){for(var h=0;h<g.nativeTracks.length;h++){c=g.nativeTracks[h];e=c.userData.targetNode;if(c.times[0]>0&&e&&e.material&&e.material.color){c.values[0]=e.material.color.r;c.values[1]=e.material.color.g;c.values[2]=e.material.color.b;}}}n=k.next();}k=this._nodesPositionTracksMap.keys();n=k.next();while(!n.done){t=n.value;var j=this._nodesPositionTracksMap.get(t);if(j&&j.scale.nativeTrack){if(j.scale.nativeTrack.times[0]>0){j.scale.nativeTrack.values[0]=t.scale.x;j.scale.nativeTrack.values[1]=t.scale.y;j.scale.nativeTrack.values[2]=t.scale.z;}}if(j&&j.rotate.nativeTrack){if(j.rotate.nativeTrack.times[0]>0){j.rotate.nativeTrack.values[0]=t.quaternion.x;j.rotate.nativeTrack.values[1]=t.quaternion.y;j.rotate.nativeTrack.values[2]=t.quaternion.z;j.rotate.nativeTrack.values[3]=t.quaternion.w;}}if(j.translate.nativeTrack){if(j.translate.nativeTrack.times[0]>0){j.translate.nativeTrack.values[0]=t.position.x;j.translate.nativeTrack.values[1]=t.position.y;j.translate.nativeTrack.values[2]=t.position.z;}}n=k.next();}};f.prototype._resetNativeTracks=function(){var e,t,c,n;e=this._nodesOpacityTrackMap.entries();n=e.next();while(!n.done){t=n.value[0];c=n.value[1];if(c.cyclicEnd||c.cyclicStart){this._setNativeOpacityTrack(t);}n=e.next();}e=this._nodesColorTrackMap.entries();n=e.next();while(!n.done){t=n.value[0];c=n.value[1];if(c.cyclicEnd||c.cyclicStart){this._setNativeColorTrack(t);}n=e.next();}e=this._nodesPositionTracksMap.entries();n=e.next();while(!n.done){t=n.value[0];var g=n.value[1];if((g.rotate&&(g.rotate.cyclicEnd||g.rotate.cyclicStart))||(g.translate&&(g.translate.cyclicEnd||g.translate.cyclicStart))||(g.scale&&(g.scale.cyclicEnd||g.scale.cyclicStart))){this._setNativePositionTracks(t);}n=e.next();}this._resetDuration();};f.prototype.setDuration=function(c){this._duration=c;if(c>0){this._animationClip.duration=c;}else{this._animationClip.resetDuration();}this._resetNativeTracks();};f.prototype.getNativeAnimationClip=function(){this._resetMaterialTransparentForOpacityTrack();return this._animationClip;};return f;});
