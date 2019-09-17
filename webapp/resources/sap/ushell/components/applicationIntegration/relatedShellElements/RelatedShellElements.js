// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log"],function(q,L){"use strict";function R(){var d=[],E,a,c={},s,i=false,C={},A,t=[],b={"home":{"actions":[]},"app":{"actions":["aboutBtn"]},"minimal":{"actions":["aboutBtn"]},"standalone":{"actions":["aboutBtn"]},"embedded":{"actions":["aboutBtn"]},"embedded-home":{"actions":["aboutBtn"]},"lean":{"actions":["aboutBtn"]}},o={home:{NWBC:{headerless:"headerless",default:"minimal"},TR:{headerless:"minimal",default:"minimal"},default:{default:"home"}},app:{NWBC:{headerless:"headerless",default:"minimal"},TR:{headerless:"minimal",default:"minimal"},default:{default:"app"}}};this.init=function(e,f){E=e;if(f&&f.length>0){Object.keys(b).forEach(function(S){b[S].actions=f.concat(b[S].actions);});}};this.processDangling=function(){var D,e;for(D=0;D<d.length;D++){e=d.pop();e.func.apply(this,e.args);}};this.setDangling=function(I){i=I;};this.calculateElementsState=function(n,e,f,g){var N=o[n]?o[n]:o.default,h=N[g?undefined:e]?N[e]:N.default,j=h[f]?h[f]:h.default;return j;};this.createCustomShellState=function(S){var e={"currentState":{"stateName":S,"headEndItems":[],"paneContent":[],"headItems":[],"actions":[],"floatingActions":[],"subHeader":[],"toolAreaItems":[],"RightFloatingContainerItems":[],"application":{},"showRightFloatingContainer":undefined,"headerHeading":undefined}},f=b[S];if(f){q.extend(e.currentState,f);}return e;};this.createExtendedShellState=function(S,f){var B,e=this.createCustomShellState(S);B=a.extendedShellStates;if(B[S]){return false;}s=e;f();if(B[S]){B[S].customState=e;}else{B[S]={managedObjects:[],customState:e};}s=a.customShellState;return true;};this.assignNew=function(S){c=this.createCustomShellState(S);a.customShellState=c;a.aTriggers=[];a.extendedShellStates={};a.oCheckPoints={};this._updateModel();s=a.customShellState;};this._genericSetItem=function(e,v){var f=e.split("/");var l=f.pop();var g=f.reduce(function(h,m){return h[m];},s.currentState);g[l]=v;E._renderShellState();};this._genericAddItems=function(e,I,f){var g=s.currentState[e];if(f){s.currentState[e]=I.concat(g);}else{s.currentState[e]=g.concat(I);}E._renderShellState();};this.genericSetItem=function(e,v){if(i){d.push({func:this._genericSetItem,args:arguments});}else{this._genericSetItem(e,v);}};this.genericAddItems=function(e,I,f){if(i){d.push({func:this.genericAddItems,args:arguments});}else{this._genericAddItems(e,I,f);}};this.setShellModelForApplications=function(e,v){var l=["paneContent","headItems","RightFloatingContainerItems","toolAreaItems","floatingActions","showRightFloatingContainer","headEndItems","headerVisible","subHeader","actions"];if(l.indexOf(e)>-1){this.genericSetItem(e,v);}else{L.error("Not a valid attribute:"+e);}};this.addShellModelForApplications=function(e,I,f){var l=["paneContent","headItems","RightFloatingContainerItems","toolAreaItems","floatingActions","showRightFloatingContainer","headEndItems","headerVisible","subHeader","actions"];if(l.indexOf(e)>-1){this.genericAddItems(e,I,f);}else{L.error("Not a valid attribute:"+e);}};this.setStateModelToUpdate=function(I){s=I;};this.getStateModelToUpdate=function(){return s;};this.model=function(){if(!a){this.create();}A={customShellState:a.customShellState,aTriggers:a.aTriggers,extendedShellStates:a.extendedShellStates,oCheckPoints:a.oCheckPoints};return A;};this._updateModel=function(){if(A){A.customShellState=a.customShellState;A.aTriggers=a.aTriggers;A.extendedShellStates=a.extendedShellStates;A.oCheckPoints=a.oCheckPoints;}};this.getAppRelatedElement=function(){return{customShellState:a.customShellState,aTriggers:a.aTriggers,extendedShellStates:a.extendedShellStates,oCheckPoints:a.oCheckPoints};};this.create=function(){a={extendedShellStates:{},oCheckPoints:C,aTriggers:t,customShellState:{"currentState":{"stateName":"app","headEndItems":[],"paneContent":[],"headItems":[],"actions":["aboutBtn"],"floatingActions":[],"subHeader":[],"toolAreaItems":[],"RightFloatingContainerItems":[],"application":{},"showRightFloatingContainer":undefined,"headerHeading":undefined}}};s=a.customShellState;this._updateModel();return a;};this.restore=function(S){if(S&&S.appRelatedElements){var e=S.appRelatedElements;a.aTriggers=e.aTriggers;a.extendedShellStates=e.extendedShellStates;a.oCheckPoints=e.oCheckPoints;a.customShellState=e.customShellState;}this._updateModel();s=a.customShellState;};this.store=function(m){};this.clean=function(){a=undefined;};this.destroy=function(m){};}return new R();},true);
