sap.ui.define([
	"../threejs/SceneBuilder",
	"./CallbackHandler",
	"./RequestCommandGenerator",
	"./SceneStateContext"
], function(
	SceneBuilder,
	CallbackHandler,
	RequestCommandGenerator,
	SceneStateContext
) {
	"use strict";

	/**
	 * A class with public properties containing helper structures for the entire 3D model built in memory.
	 * The entire 3D model can consist of multiple 3D scenes downloaded from the storage service.
	 *
	 * The helper structures for comprising 3D scenes are managed by SceneStateContext instances.
	 *
	 * All properties are public without getters/setters.
	 *
	 * @private
	 */
	var SceneState = function() {

		this.currentSceneInfo = {};

		this.sceneBuilder = new SceneBuilder();

		this.contextMap = new Map();       // sceneId -> SceneStateContext. One 3D model can consist of multiple 3D scenes loaded from the (same?) storage service.
		this.viewIdSceneIdMap = new Map(); // viewId -> sceneId

		// texture update related
		// key of texturesToUpdate is imageIdsToRequest
		this.texturesToUpdate = new Map();        // imageId -> array<{ MaterialId, textureType }>
		this.materialIdsToRequest = new Set();    // materialId
		this.materialIdsRequested = new Set();    // materialId
		this.geometryIdMaterialIdMap = new Map(); // geometryId -> materialId
		this.leaderLineMaterialIdMap = new Map(); // materialId -> { sceneId, annotationId, /* leaderLine */{ ... } }
		this.imageNoteMaterialIdMap = new Map();  // materailId -> { sceneId, nodeId, /* annotation */{ ... } }

		this.thumbnailImageIdAndViewIdSceneIdMap = new Map(); // imageId -> { viewId, sceneId }
		this.viewIdAndThumbnailImageIdSceneIdMap = new Map(); // viewId  -> { imageId, sceneId }

		// for requesting shared items such as material, image and geometry
		this.requestCommandGenerator = new RequestCommandGenerator();

		this.trackIds = new Set();
		this.sequenceIds = new Set();
		this.highlightStyleIds = new Set();

		// event related
		this.onErrorCallbacks = new CallbackHandler();
		this.onImageFinishedCallbacks = new CallbackHandler();
		this.onMaterialFinishedCallbacks = new CallbackHandler();
		this.onSetGeometryCallbacks = new CallbackHandler();
		this.onSetSequenceCallbacks = new CallbackHandler();
		this.onSetTrackCallbacks = new CallbackHandler();
		this.onViewGroupFinishedCallbacks = new CallbackHandler();
		this.onViewGroupUpdatedCallbacks = new CallbackHandler();
	};

	SceneState.prototype.getContext = function(sceneId) {
		if (!sceneId) {
			return null;
		}
		return this.contextMap.get(sceneId);
	};

	SceneState.prototype.createContext = function(sceneId, params) {
		var context = new SceneStateContext();
		Object.assign(context, params);
		context.sceneId = sceneId;
		context.requestCommandGenerator.setSceneIdAndContext(sceneId, context);

		// attach callbacks
		if (context.onActiveCamera) {
			context.onActiveCameraCallbacks.attach(context.onActiveCamera);
			delete context.onActiveCamera;
		}

		if (context.onMeshFinished) {
			context.onMeshFinishedCallbacks.attach(context.onMeshFinished);
			delete context.onMeshFinished;
		}

		if (context.onInitialSceneFinished) {
			context.onInitialSceneFinishedCallbacks.attach(context.onInitialSceneFinished);
			delete context.onInitialSceneFinished;
		}

		if (context.onPartialRetrievalFinished) {
			context.onPartialRetrievalFinishedCallbacks.attach(context.onPartialRetrievalFinished);
			delete context.onPartialRetrievalFinished;
		}

		if (context.onViewPartialRetrievalFinished) {
			context.onViewPartialRetrievalFinishedCallbacks.attach(context.onViewPartialRetrievalFinished);
			delete context.onViewPartialRetrievalFinished;
		}

		if (context.onViewFinished) {
			context.onViewFinishedCallbacks.attach(context.onViewFinished);
			delete context.onViewFinished;
		}

		if (context.onSceneCompleted) {
			context.onSceneCompletedCallbacks.attach(context.onSceneCompleted);
			delete context.onSceneCompleted;
		}

		if (context.onProgressChanged) {
			context.setOnProgressChanged(context.onProgressChanged);
			delete context.onProgressChanged;
		}

		this.contextMap.set(sceneId, context);
		return context;
	};

	SceneState.prototype.sidToObject3D = function(sid) {// state of type SceneState
		var contextIterator = this.contextMap.values();
		var contextItem = contextIterator.next();
		var node = null;
		while (!contextItem.done) {
			var ctx = contextItem.value;
			contextItem = contextIterator.next();
			node = this.sceneBuilder.getNode(sid, ctx.sceneId);
			if (node) {
				break;
			}
		}
		return node;
	};

	SceneState.prototype.object3DToSid = function(obj3D) {
		return this.sceneBuilder.getObjectId(obj3D);
	};

	SceneState.prototype.dispose = function() {
		this.currentSceneInfo = null;
		this.contextMap = null;

		this.sceneBuilder.cleanup();
		this.sceneBuilder = null;

		this.texturesToUpdate = null;
		this.materialIdsToRequest = null;
		this.materialIdsRequested = null;
		this.geometryIdMaterialIdMap = null;

		this.thumbnailImageIdAndViewIdSceneIdMap = null;
		this.viewIdAndThumbnailImageIdSceneIdMap = null;

		this.trackIds = null;
		this.sequenceIds = null;
		this.highlightStyleIds = null;

		this.onErrorCallbacks = null;
		this.onMaterialFinishedCallbacks =  null;
		this.onImageFinishedCallbacks =  null;
		this.onSetGeometryCallbacks =  null;
		this.onSetTrackCallbacks = null;
		this.onSetSequenceCallbacks = null;
	};

	SceneState.prototype.cleanup = function() {
		this.currentSceneInfo = {};
		this.contextMap.clear();

		this.sceneBuilder.cleanup();

		this.texturesToUpdate.clear();
		this.materialIdsToRequest.clear();
		this.materialIdsRequested.clear();
		this.geometryIdMaterialIdMap.clear();
		this.viewIdSceneIdMap.clear();
		this.thumbnailImageIdAndViewIdSceneIdMap.clear();
		this.viewIdAndThumbnailImageIdSceneIdMap.clear();
		this.trackIds.clear();
		this.sequenceIds.clear();
		this.highlightStyleIds.clear();

		this.requestCommandGenerator.clearContent();
	};

	return SceneState;
});
