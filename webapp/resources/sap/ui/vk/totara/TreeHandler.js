sap.ui.define(["./CameraHandler","./TotaraUtils","./TreeBuilder"],function(C,T,a){"use strict";var b=function(){};b.setTree=function(s,c){if(T.checkError(c)){if(c.events&&c.events.length){var e=c.events[0];if(e.values&&e.values.id){var r=s.getContext(e.values.id);c.context=r;}}return c;}var d=s.getContext(c.sceneId);if(!d){c.error="setTree error: no context for scence "+c.sceneId;return c;}var f={};if(c.sid){var g=s.sceneBuilder.getNode(c.sid,d.sceneId);if(!g||g!==d.root){var h=d.root;h.userData.treeNode={sid:c.sid,name:d.root.name?d.root.name:"root",skipIt:!d.root.name};if(d){s.sceneBuilder.setRootNode(h,c.sid,c.sceneId,d.vkScene);d.rootNodeId=c.sid;}}}if(c.camera){c.camera.id="initial";var i=C.setCameraSingle(s,c.camera,c.sceneId);if(i){d.onActiveCameraCallbacks.execute(i);}}return f;};b.setTreeNode=function(s,c){if(T.checkError(c)){return c;}var r={};if(!c.sceneId){r.error="setTreeNode error: no sceneId";}var d=s.getContext(c.sceneId);if(!d){r.error="setTreeNode error: no loading context for scene "+c.sceneId;return r;}d.treeNodes=d.treeNodes.concat(c.nodes);return r;};b.notifyFinishedTree=function(s,c){var r={};if(T.checkError(c)){return c;}if(c.sceneId){r.context=s.getContext(c.sceneId);if(!r.context){r.error="notifyFinishedTree error: no loading context for scene "+c.sceneId;}else{a.buildTree(s,r.context);}}else{r.error="notifyFinishedTree error: no sceneId";}return r;};return b;});
