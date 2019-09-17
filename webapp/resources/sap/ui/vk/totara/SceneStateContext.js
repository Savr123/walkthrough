sap.ui.define(["./CallbackHandler","./ListMap","./ProgressCounter","./RequestCommandGenerator"],function(C,L,P,R){"use strict";var S=function(){this.phase=S.Phase.Started;this.retrievalType=S.RetrievalType.Initial;this.sceneId=null;this.rootNodeId=null;this.root=null;this.requestCommandGenerator=new R();this.meshGroupListMap=new L();this.boundingBoxNodeIdsListMap=new L();this.annotationNodeMap=new Map();this.materialIdNodeListMapForOpacityUpdate=new L();this.progressCount=new P();this.treeNodes=[];this.viewIdTreeNodesMap=new Map();this.nodeSidsForPartialTree=new Set();this.replacedNodes=new Map();this.updatedNodes=new Set();this.viewIds=new Set();this.authorizationHandler=null;this.currentViewId=null;this.onActiveCameraCallbacks=new C();this.onInitialSceneFinishedCallbacks=new C();this.onMeshFinishedCallbacks=new C();this.onPartialRetrievalFinishedCallbacks=new C();this.onSceneCompletedCallbacks=new C();this.onSetPlaybackCallbacks=new C();this.onViewFinishedCallbacks=new C();this.onViewPartialRetrievalFinishedCallbacks=new C();};S.prototype.setOnProgressChanged=function(c){this.progressCount.setOnProgressChanged(c);};S.prototype.isSceneCompleted=function(){return this.meshGroupListMap.size===0&&this.boundingBoxNodeIdsListMap.size===0;};S.prototype.dispose=function(){this.sceneId=null;this.meshGroupListMap=null;this.progressCount=null;this.requestCommandGenerator=null;this.suppressedBoundingBoxListMap=null;this.boundingBoxNodeIdsListMap=null;this.treeNodes=null;this.nodeSidsForPartialTree=null;this.materialIdNodeListMapForOpacityUpdate=null;this.replacedNodes=null;this.updatedNodes=null;this.viewIds=null;this.viewIdTreeNodesMap=null;this.onActiveCameraCallbacks=null;this.onInitialSceneFinishedCallbacks=null;this.onPartialRetrievalFinishedCallbacks=null;this.onViewPartialRetrievalFinishedCallbacks=null;this.onSceneCompletedCallbacks=null;this.onViewFinishedCallbacks=null;this.onMeshFinishedCallbacks=null;this.onSetPlaybackCallbacks=null;};S.Phase={Started:0,FinishedHierarchy:1,FinishedMesh:2,FinishedGeometry:3};S.RetrievalType={Initial:0,Partial:1};return S;});
