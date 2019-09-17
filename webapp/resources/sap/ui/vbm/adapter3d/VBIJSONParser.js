/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object","./ObjectFactory","./../library"],function(q,B,O,l){"use strict";var a=q.sap.log;var t="sap.ui.vbm.VBIJSONParser";var V=B.extend("sap.ui.vbm.adapter3d.VBIJSONParser",{constructor:function(e){B.call(this);this._context=e;this._factory=new O();}});V.prototype.loadVBIJSON=function(p){if(p&&p.SAPVB){if(p.SAPVB.Resources){this._processResources(p.SAPVB.Resources);}if(p.SAPVB.DataTypes){this._processDataTypes(p.SAPVB.DataTypes);}if(p.SAPVB.Data){this._processData(p.SAPVB.Data);}if(p.SAPVB.Scenes){this._processScenes(p.SAPVB.Scenes);}if(p.SAPVB.Windows){this._processWindows(p.SAPVB.Windows);}if(p.SAPVB.Actions){this._processActions(p.SAPVB.Actions);}if(p.SAPVB.Automation){this._processAutomation(p.SAPVB.Automation);}if(p.SAPVB.Data||p.SAPVB.Scenes){this._refreshVisualObjects();}}return this;};var b=function(s){return s===undefined?[]:[].concat(s);};var c=function(e,s,f,g){g=b(g);for(var i=0,h=f.length;i<h;++i){var j=f[i];var k=g.length>i?g[i]:j;if(s.hasOwnProperty(j)){e[k]=s[j];}}return e;};V.prototype._processResources=function(r){b(r.Set.Resource).forEach(function(e){this._context.resources.set(e.name,e.value);},this);return this;};V.prototype._processDataTypes=function(e){if(e&&e.Set&&!Array.isArray(e.Set)&&!e.Set.name){this._context.dataTypes.splice(0);var f=function(g){var h=c(this._factory.createDataType(),g,["name","key","minSel","maxSel"]);b(g.A).forEach(function(i){h.attributes.push(c(this._factory.createDataTypeAttribute(),i,["name","alias","type"]));},this);b(g.N).forEach(function(i){h.dataTypes.push(f(i));});return h;}.bind(this);b(e.Set.N).forEach(function(g){this._context.dataTypes.push(f(g));},this);}else{q.sap.log.error("DataTypes: only the Set verb with no type attribute is supported.","",t);}return this;};V.prototype._findDataTypeByPath=function(p){var f=function(e,g){if(g>p.length){return undefined;}var h=p[g-1];for(var i=0,j=e.length;i<j;++i){var k=e[i];if(k.name===h){if(g===p.length){return k;}else{return f(k.dataTypes,g+1);}}}return undefined;};return f(this._context.dataTypes,1);};V.prototype._findDataTypeByDataNodePath=function(e){var f=[];for(var i=0,g=(e.length+1)/2;i<g;++i){f.push(e[i*2]);}return this._findDataTypeByPath(f);};V.prototype._processData=function(e){b(e.Remove).forEach(function(r){if(r.type!=="E"){a.error("Data: the Remove verb is supported for the 'E' type only.",r.type,t);return;}if(!r.name){a.error("Data: the Remove verb must have the non-empty name attribute.","",t);return;}var g=this._findDataTypeByPath(r.name.split("."));if(!g){a.error("Data: the Remove verb is supported for data nodes with data types only.",r.name,t);return;}var k=g.getKeyAttribute();if(!k){a.error("Data: the Remove verb is supported for data types with keys only.",r.name,t);return;}var h=b(r.N.E).map(function(j){return j[k.alias];});var i=this._findDataNodeByPath(r.name.split("."));if(!i){if(h.length>0){a.warning("Data: unknown data node.",r.name,t);}return;}this._removeDataInstancesByKey(i,k.name,h);},this);var f=function(g,n,h){var i=this._findDataTypeByPath(h);var k=i&&i.getKeyAttribute();b(n.E).forEach(function(j,m){var o=k?sap.ui.vbm.findInArray(g,function(o){return o[k.name]===j[k.alias];}):g[m];if(!o){o=this._factory.createDataInstance();if(k){g.push(o);}else{g[m]=o;}}o.isDirty=true;for(var p in j){if(p==="N"){if(j.N.name){f(o[j.N.name]||(o[j.N.name]=this._factory.createDataNode()),j.N,h.concat(j.N.name));}else{a.error("Data: child data nodes must have names.","",t);}}else{var r=i.getAttributeByAlias(p);if(r){o[r.name]=j[p];}else{o[p]=j[p];}}}},this);}.bind(this);var s=b(e.Set);if(s.length===1&&!s[0].name){this._removeAllDataNodes();b(s.N).forEach(function(n){f((this._context.data[n.name]=this._factory.createDataInstance()),n,[n.name]);},this);}else if(s.length>0){if(s.some(function(g){return!g.name;})){a.error("Data: if there are multiple Set verbs then all Set verbs must have the non-empty name attribute.","",t);return this;}if(s.some(function(g){return!g.N||b(g.N).length>1;})){a.error("Data: all Set verbs with the name attribute must have the single N element.","",t);return this;}s.forEach(function(g){var n=g.name.split(".");f(this._findDataNodeByPath(n)||(this._context.data[g.name]=this._factory.createDataNode()),g.N,[n[0]]);},this);}return this;};V.prototype._findDataNodeByPath=function(p){if(p.length>1){a.error("Compound paths for data nodes are not supported yet.",p,t);return undefined;}return this._context.data[p[0]];};V.prototype._getDataValueByPath=function(p){if(p.length%2!==1){a.error("The absolute path to data value must contain an odd number of elements.",p.join("."),t);return undefined;}var e;var f;for(var i=0,g=p.length;i<g;++i){var h=p[i];if(i%2===0){if(i===g-1){return f&&f[h];}else{e=(i==0?this._context.data:f)[h];if(e===undefined){return undefined;}}}else{f=e[h];if(f===undefined){return undefined;}}}return undefined;};V.prototype._removeAllDataNodes=function(){for(var e in this._context.data){this._clearDataNode(this._context.data[e]);delete this._context.data[e];}return this;};V.prototype._clearDataNode=function(e){e.splice(0).forEach(this._clearDataInstance,this);return this;};V.prototype._clearDataInstance=function(e){if(e.visualObject){this._removeVisualObject(e.visualObject);}for(var p in e){if(Array.isArray(e[p])){this._clearDataNode(e[p]);delete e[p];}}return this;};V.prototype._removeDataInstancesByKey=function(e,f,g){for(var i=e.length-1;i>=0&&g.length>0;--i){var h=e[i];var j=h[f];for(var k=g.length-1;k>=0;--k){if(j===g[k]){this._clearDataInstance(h);e.splice(i,1);g.splice(k,1);break;}}}return this;};V.prototype._processScenes=function(e){var f=function(g,h){c(g,h,["id","type","initialStartPosition","initialPitch","initialYaw","initialZoom"],["id","type","position","pitch","yaw","zoom"]);if(g.position||g.zoom||g.pitch||g.yaw){this._context.setupView={position:g.position,zoom:g.zoom,pitch:g.pitch,yaw:g.yaw,home:true,flyTo:false};}b(h.VO).forEach(function(v){var i=g.getVisualObjectGroupById(v.id);if(!i){i=this._factory.createVisualObjectGroup(g);for(var p in v){switch(p){case"id":case"datasource":case"type":i[p]=v[p];break;case"DragSource":case"DropTarget":break;default:if(q.sap.endsWith(p,".bind")){i.isDataBound=true;var j=p.split(".")[0];var k=v[p].split(".");if(v["datasource"]){k.shift();}i.template[j]={path:k};}else{i.template[p]={value:v[p]};}break;}}}else{a.warning("Scenes: cannot modify existing VO group.",v.id,t);}},this);return g;}.bind(this);if(e.Remove){this._removeScenes(b(e.Remove).map(function(r){return r.name;}));}if(e.Set){var s=b(e.Set);if(s.length===1&&!s[0].name){this._removeScenes(this._context.scenes.map(function(g){return g.id;}));}else if(s.length>0){if(s.some(function(g){return!g.name;})){a.error("Scenes: if there are multiple Set verbs then all Set verbs must have the non-empty name attribute.","",t);return this;}if(s.some(function(g){return!g.Scene||b(g.Scene).length>1;})){a.error("Scene: all Set verbs with the name attribute must have the single Scene element.","",t);return this;}if(s.some(function(g){return g.name!==g.Scene.id;})){a.error("Scene: the Set's attribute 'name' must equal the Set.Scene's attribute 'id'.","",t);return this;}this._removeScenes(s.map(function(g){return g.name;}));}s.forEach(function(g){b(g.Scene||g.SceneGeo).forEach(function(h){var i=this._factory.createScene(!!g.SceneGeo);f(i,h);this._context.scenes.push(i);this._context.sceneQueues.toAdd.push(i);},this);},this);}if(e.Merge){var m=b(e.Merge);if(m.length>0){if(m.some(function(g){return!g.name;})){a.error("Scenes: all Merge elements must have the name attribute.","",t);return this;}if(m.some(function(g){return!g.Scene||b(g.Scene).length>1;})){a.error("Scenes: all Merge verbs must have the single Scene element.","",t);return this;}if(m.some(function(g){return g.name!==g.Scene.id;})){a.error("Scenes: the Merge's attribute 'name' must equal the Merge.Scene's attribute 'id'.","",t);return this;}m.forEach(function(g){b(g.Scene||g.SceneGeo).forEach(function(h){var i=this._findSceneById(g.name);if(i){f(i,h);this._context.sceneQueues.toUpdate.push(i);}},this);},this);}}return this;};V.prototype._findSceneById=function(e){for(var i=0,f=this._context.scenes.length;i<f;++i){var s=this._context.scenes[i];if(s.id===e){return s;}}return undefined;};V.prototype._removeScenes=function(e){for(var i=this._context.scenes.length-1;i>=0&&e.length>0;--i){var s=this._context.scenes[i];var f=s.id;for(var k=e.length-1;k>=0;--k){if(e[k]===f){this._context.sceneQueues.toRemove.push(s);this._context.scenes.splice(i,1);e.splice(k,1);s.voGroups.forEach(function(v){for(var i=v.vos.length-1;i>=0;--i){this._removeVisualObject(v.vos[i]);}},this);break;}}}return this;};V.prototype._processVisualObjectGroup=function(v){if(v.isDataBound&&v.datasource){var e=v.datasource.split(".");var f=this._findDataNodeByPath(e);if(f){var g=this._findDataTypeByDataNodePath(e);if(g){v.maxSel=g.maxSel;v.minSel=g.minSel;var k=g.getKeyAttribute();if(k){v.keyAttributeName=k.name;}}f.forEach(function(h){if(h.visualObject){if(h.isDirty||v.isDirty){this._queueVisualObjectToUpdate(v.scene,this._populateVisualObject(h.visualObject,h));}}else{this._queueVisualObjectToAdd(v.scene,this._populateVisualObject(this._factory.createVisualObject(v),h));}},this);}}else if(v.vos.length===0){this._queueVisualObjectToAdd(v.scene,this._populateVisualObject(this._factory.createVisualObject(v)));}else if(v.vos.length===1){this._queueVisualObjectToUpdate(v.scene,this._populateVisualObject(v.vos[0]));}return this;};V.prototype._removeVisualObject=function(v){var g=v.voGroup.vos;var i=g.indexOf(v);if(i>=0){g.splice(i,1);}var e=v.voGroup.selected;var s=e.indexOf(v);if(s>=0){e.splice(s,1);}var f=v.voGroup.scene;v.voGroup=null;if(v.dataInstance){v.dataInstance.visualObject=null;v.dataInstance=null;}this._queueVisualObjectToRemove(f,v);return this;};V.prototype._populateVisualObject=function(v,e){var f=v.voGroup;var g=f.template;for(var h in g){var i=g[h];if("path"in i){if(e){v[h]=e[i.path[0]];}else{var j=this._getDataValueByPath(i.path);if(j!==undefined){v[h]=j;}}}else{v[h]=i.value;}}if(e){if(f.keyAttributeName){v.id=e[f.keyAttributeName];}e.visualObject=v;v.dataInstance=e;var w=v["VB:s"]&&v["VB:s"]!=="false"?true:false;var k=e["VB:s"]&&e["VB:s"]!=="false"?true:false;if(w!==k){var s;var m=[];var n=[];if(w){if(f.minSel==="0"||f.selected.length>1){s=f.selected.indexOf(v);n=f.selected.splice(s,1);}}else if(f.maxSel!=="0"){if(f.maxSel==="1"){n=f.selected.splice(0);}f.selected.push(v);m=[v];}m.forEach(function(o){o["VB:s"]="true";});n.forEach(function(o){o["VB:s"]="false";this._queueVisualObjectToUpdate(f.scene,o);},this);}}return v;};var d=function(e,s,v){if(e.has(s)){e.get(s).push(v);}else{e.set(s,[v]);}return v;};V.prototype._queueVisualObjectToAdd=function(s,v){d(this._context.voQueues.toAdd,s,v);return this;};V.prototype._queueVisualObjectToUpdate=function(s,v){d(this._context.voQueues.toUpdate,s,v);return this;};V.prototype._queueVisualObjectToRemove=function(s,v){d(this._context.voQueues.toRemove,s,v);return this;};V.prototype._refreshVisualObjects=function(){this._context.scenes.forEach(function(s){s.voGroups.forEach(this._processVisualObjectGroup,this);},this);this._resetDirtyFlag();return this;};V.prototype._processWindows=function(e){var f=function(g){for(var i=0,h=this._context.windows.length;i<h;++i){var w=this._context.windows[i];if(w.id===g){return{window:w,index:i};}}return{};}.bind(this);if(e.Remove){b(e.Remove).forEach(function(r){var g=f(r.name);if(g.window){this._context.windows.splice(g.index,1);this._context.windowQueues.toRemove.push(g.window);}},this);}if(e.Set){var s=b(e.Set);if(s.length===1&&!s[0].name){this._context.windows.splice(0).forEach(function(w){this._context.windowQueues.toRemove.push(w);},this);}else if(s.length>0){if(s.some(function(g){return!g.name;})){a.error("Windows: if there are multiple Set verbs then all Set verbs must have the non-empty name attribute.","",t);return this;}if(s.some(function(g){return!g.Window||b(g.Window).length>1;})){a.error("Window: all Set verbs with the name attribute must have the single Window element.","",t);return this;}if(s.some(function(g){return g.name!==g.Window.id;})){a.error("Window: the Set's attribute 'name' must equal the Set.Window's attribute 'id'.","",t);return this;}}s.forEach(function(g){b(g.Window).forEach(function(w){var h=f(w.id).window;if(h){this._context.windowQueues.toUpdate.push(h);}else{h=this._factory.createWindow();this._context.windows.push(h);this._context.windowQueues.toAdd.push(h);}c(h,w,["id","type","caption","refScene","refParent","width","height","modal"]);if("pos.bind"in w){h.pos=this._getDataValueByPath(w["pos.bind"]);}else if("pos"in w){h.pos=w.pos;}},this);},this);}return this;};V.prototype._processActions=function(e){if(e&&e.Set&&e.Set.Action){Array.prototype.push.apply(this._context.actions,b(e.Set.Action));}return this;};V.prototype._processAutomation=function(e){if(e&&e.Call){b(e.Call).forEach(function(f){switch(f.handler){case"FLYTOHANDLER":var g=b(f.Param);var h=sap.ui.vbm.findInArray(this._context.scenes,function(s){return s.id===(sap.ui.vbm.findInArray(g,function(p){return p.name==="scene";})||{})["#"]||"";});if(h){var i=(sap.ui.vbm.findInArray(g,function(p){return p.name==="x";})||{})["#"]||"0";var o=(sap.ui.vbm.findInArray(g,function(p){return p.name==="y";})||{})["#"]||"0";var j=(sap.ui.vbm.findInArray(g,function(p){return p.name==="z";})||{})["#"]||"0";h.position=i+";"+o+";"+j;h.zoom=(sap.ui.vbm.findInArray(g,function(p){return p.name==="lod";})||{})["#"]||"0";h.pitch=(sap.ui.vbm.findInArray(g,function(p){return p.name==="pitch";})||{})["#"]||"0";h.yaw=(sap.ui.vbm.findInArray(g,function(p){return p.name==="yaw";})||{})["#"]||"0";this._context.setupView={position:h.position,zoom:h.zoom,pitch:h.pitch,yaw:h.yaw,flyTo:true};}break;default:break;}},this);}return this;};V.prototype._resetDirtyFlag=function(){for(var p in this._context.data){(function traverseDataNode(n){n.forEach(function(i){i.isDirty=false;for(var p in i){if(Array.isArray(i[p])){traverseDataNode(i[p]);}}});})(this._context.data[p]);}this._context.scenes.forEach(function(s){s.voGroups.forEach(function(v){v.isDirty=false;});});return this;};return V;});
