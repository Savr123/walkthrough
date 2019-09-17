/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.threejs.Viewport.
sap.ui.define([
	"jquery.sap.global",
	"../NS",
	"../ViewportBase",
	"sap/ui/core/ResizeHandler",
	"../Loco",
	"./thirdparty/three",
	"../ContentConnector",
	"../ViewStateManager",
	"./ViewportGestureHandler",
	"./OrthographicCamera",
	"./PerspectiveCamera",
	"./NodesTransitionHelper",
	"../Messages",
	"sap/ui/base/ManagedObjectObserver",
	"./ViewportRenderer",
	"../CameraProjectionType",
	"../CameraFOVBindingType",
	"../VisibilityMode",
	"../ZoomTo",
	"../SelectionMode",
	"../RenderMode",
	"../getResourceBundle",
	"../cssColorToColor",
	"../ViewStateManager",
	"./ViewStateManager",
	"./Scene",
	"./ContentDeliveryService",
	"./AnimationTimeController",
	"./AnimationHelper",
	"../AnimationTrackType"
], function(
	jQuery,
	NS,
	ViewportBase,
	ResizeHandler,
	Loco,
	threeJs,
	ContentConnector,
	ViewStateManager,
	ViewportGestureHandler,
	OrthographicCamera,
	PerspectiveCamera,
	NodesTransitionHelper,
	Messages,
	ManagedObjectObserver,
	ViewportRenderer,
	CameraProjectionType,
	CameraFOVBindingType,
	VisibilityMode,
	ZoomTo,
	SelectionMode,
	RenderMode,
	getResourceBundle,
	cssColorToColor,
	VkViewStateManager,
	ThreeJSViewStateManager,
	Scene,
	ContentDeliveryService,
	AnimationTimeController,
	AnimationHelper,
	AnimationTrackType
) {
		"use strict";

		/**
		 *  Constructor for a ThreeJs viewport.
		 *
		 * @class Provides a base class control for three js canvas.
		 *
		 * @public
		 * @author SAP SE
		 * @version 1.69.0
		 * @extends sap.ui.vk.ViewportBase
		 * @alias sap.ui.vk.threejs.Viewport
		 */
		var Viewport = ViewportBase.extend(NS.getName("threejs.Viewport"), /** @lends sap.ui.vk.threejs.Viewport.prototype  */ {
			metadata: {
				library: NS.getName(),

				events: {
					cameraChanged: {
						parameters: {
							/**
							 * Returns a new camera position.
							 */
							position: "float[]",
							/**
							 * Returns a new camera rotation quaternion.
							 */
							quaternion: "float[]",
							/**
							 * Returns a new camera orthographic zoom factor.
							 */
							zoom: "float"
						},
						enableEventBubbling: true
					},
					frameRenderingFinished: {
					}
				}
			}
		});

		var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

		// Bug in three.js, original code: buffer[ offset ] = this.node[ this.propertyName ]
		THREE.PropertyBinding.prototype.GetterByBindingType[0] = function(buffer, offset) {

			buffer[ offset ] = this.targetObject[ this.propertyName ];
		};

		// When there more than one animationSequences contain tracks that animate same properties
		// threejs AnimationMixer interpolate the values from different tracks if the corresponding
		// sequences are active or completed.
		// This function modifies threejs AnimationMixer's update function to avoid mixing tracks
		THREE.AnimationMixer.prototype.updateWithoutMixing = function(deltaTime) {

			deltaTime *= this.timeScale;

			var actions = this._actions,
				nActions = this._nActiveActions,

				time = this.time += deltaTime,
				timeDirection = Math.sign(deltaTime),

				accuIndex = this._accuIndex ^= 1;

			var bindings = this._bindings,
			nBindings = this._nActiveBindings;
			var i;
			for (i = 0; i !== nBindings; ++i) {
				bindings[ i ].realCumulativeWeight = 0;
			}

			// run active actions

			for (i = 0; i !== nActions; ++i) {

				var action = actions[ i ];

				// added code *********************************************
				var propertyMixers = action._propertyBindings;
				var j, m;
				if (propertyMixers) {
					for (j = 0, m = propertyMixers.length; j !== m; ++j) {
						propertyMixers[ j ].cumulativeWeight = 0;
					}
				}
				// ********************************************************

				action._update(time, deltaTime, timeDirection, accuIndex);

				// added code *********************************************
				if (propertyMixers) {
					for (j = 0, m = propertyMixers.length; j !== m; ++j) {
						propertyMixers[ j ].realCumulativeWeight += propertyMixers[ j ].cumulativeWeight;
					}
				}
				// *********************************************************
			}

			// update scene graph
			for (i = 0; i !== nBindings; ++i) {
				if (bindings[ i ].realCumulativeWeight) {
					bindings[ i ].cumulativeWeight = 1;
				}
				bindings[ i ].apply(accuIndex);
			}

			return this;
		};

		Viewport.prototype.init = function() {

			if (basePrototype.init) {
				basePrototype.init.call(this);
			}

			this._resizeListenerId = null;
			this._renderLoopRequestId = 0;
			this._renderLoopFunction = this._renderLoop.bind(this);
			this._shouldRenderFrame = true;
			this._clippingPlanes = [];

			this._animationMixer = null;

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			this._renderer.setPixelRatio(window.devicePixelRatio);
			this._renderer.setSize(1, 1); // set dummy size, resize event will correct this later
			this._renderer.shadowMap.enabled = true;

			this._camera = new PerspectiveCamera();

			var backgroundVertexShader = [
				"varying float vPos;",
				"void main() {",
				"	gl_Position = vec4(position, 1.0);",
				"	vPos = position.y * -0.5 + 0.5;",
				"}"
			].join("\n");

			var backgroundFragmentShader = [
				"uniform vec4 topColor;",
				"uniform vec4 bottomColor;",
				"varying float vPos;",
				"void main() {",
				"	gl_FragColor = mix(topColor, bottomColor, vPos);",
				"}"
			].join("\n");

			var backgroundColorTop = new THREE.Vector4();
			var backgroundColorBottom = new THREE.Vector4();
			this._updateColor(backgroundColorTop, this.getBackgroundColorTop());
			this._updateColor(backgroundColorBottom, this.getBackgroundColorBottom());
			this._checkBackgroundColor();

			this._backgroundMaterial = new THREE.ShaderMaterial({
				uniforms: {
					topColor: { value: backgroundColorTop },
					bottomColor: { value: backgroundColorBottom }
				},
				vertexShader: backgroundVertexShader,
				fragmentShader: backgroundFragmentShader,
				side: THREE.DoubleSide,
				depthTest: false,
				depthWrite: false,
				blending: THREE.NoBlending
			});

			var backgroundGeometry = new THREE.Geometry();
			backgroundGeometry.vertices.push(
				new THREE.Vector3(-1, 1, 0),
				new THREE.Vector3(1, 1, 0),
				new THREE.Vector3(-1, -1, 0),
				new THREE.Vector3(1, -1, 0)
			);
			backgroundGeometry.faces.push(new THREE.Face3(0, 2, 1), new THREE.Face3(1, 2, 3));

			this._backgroundCamera = new THREE.Camera();
			this._backgroundScene = new THREE.Scene();
			this._backgroundScene.add(new THREE.Mesh(backgroundGeometry, this._backgroundMaterial));

			var xrayVertexShader = [
				"#include <clipping_planes_pars_vertex>",
				"varying vec3 vNormal;",
				"void main() {",
				"#include <begin_vertex>",
				"#include <project_vertex>",
				"#include <clipping_planes_vertex>",
				"#include <beginnormal_vertex>",
				"#include <defaultnormal_vertex>",
				"	vNormal = normalize( transformedNormal );",
				"}"
			].join("\n");

			var xrayFragmentShader = [
				"#include <clipping_planes_pars_fragment>",
				"uniform vec4 color1;",
				"uniform vec4 color2;",
				"varying vec3 vNormal;",
				"void main() {",
				"#include <clipping_planes_fragment>",
				"	gl_FragColor = mix(color1, color2, abs(normalize(vNormal).z));",
				"}"
			].join("\n");

			this._xrayColor1 = new THREE.Vector4(0, 0.75, 1, 0.45);
			this._xrayColor2 = new THREE.Vector4(0, 0, 1, 0);
			this._xrayMaterial = new THREE.ShaderMaterial({
				uniforms: {
					color1: { value: this._xrayColor1 },
					color2: { value: this._xrayColor2 }
				},
				vertexShader: xrayVertexShader,
				fragmentShader: xrayFragmentShader,
				side: THREE.DoubleSide,
				// depthTest: false,
				depthWrite: false,
				depthFunc: THREE.LessDepth,
				blending: THREE.NormalBlending,
				clipping: true,
				transparent: true
			});

			this._viewportGestureHandler = new ViewportGestureHandler(this);

			this._loco = new Loco(this);
			this._loco.addHandler(this._viewportGestureHandler, -1);

			this._zoomedObject = null;
			this._nodesTransitionHelper = new NodesTransitionHelper();
			this._nodesTransitionHelper.setViewport(this);

			this._cdsLoader = null;

			this._animationTimeController = new AnimationTimeController();
			this._animationHelper = new AnimationHelper();

			this.attachCameraChanged(function(event) {
				this.setShouldRenderFrame();
			});

			// We'll use observer to detect scene changes in order to refresh screen
			this._sceneObserver = new ManagedObjectObserver(this.setShouldRenderFrame.bind(this));

			this._currentViews = null;
			this._currentViewIndex = 0;
			this._currentView = null;
			this._playingProcedure = false;
			this._playingPlaybacks = false;
			this._totalTimeOfPlaybacks = 0;
			this._startTimeOfPlaybacks = 0;
			this._notPlayingAnimations = false;
			this._currentAnimationActions = [];
		};

		Viewport.prototype.cameraUpdateCompleted = function(params) {
			var animation = function(vp) {
				var playbacks;
				if (vp._currentView) {
					playbacks = vp._currentView.getPlaybacks();
				}
				if (playbacks && playbacks.length && !vp._notPlayingAnimations) {
					vp._startAnimation();
				} else if (!playbacks || vp._notPlayingAnimations) {
					vp.fireViewFinished({ viewIndex: this._currentViewIndex });
					vp._playNextStep();
				} else {
					vp._playNextStep();
				}
			};
			if (this._playingPlaybacks) {
				setTimeout(animation, 10, this);
			} else {
				this.fireViewFinished({ viewIndex: this._currentViewIndex });
			}
			this._playingPlaybacks = false;
		};

		Viewport.prototype.exit = function() {
			this._loco.removeHandler(this._viewportGestureHandler);
			this._viewportGestureHandler.destroy();

			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();

			this.setScene(null);
			this.setCamera(null);
			this._renderer = null;
			this._backgroundCamera = null;
			this._backgroundMaterial = null;
			this._backgroundScene = null;
			this._loco = null;
			this._viewportGestureHandler = null;

			if (this._cdsLoader) {
				this._cdsLoader.detachSceneUpdated(this._handleCdsSceneUpdate, this);
			}

			if (basePrototype.exit) {
				basePrototype.exit.call(this);
			}
		};

		/**
		 * Starts the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._startRenderLoop = function() {
			if (!this._renderLoopRequestId) {
				this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction);
			}
			return this;
		};

		/**
		 * Stops the render loop.
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @private
		 */
		Viewport.prototype._stopRenderLoop = function() {
			if (this._renderLoopRequestId) {
				window.cancelAnimationFrame(this._renderLoopRequestId);
				this._renderLoopRequestId = 0;
			}
			return this;
		};



		Viewport.prototype.setBackgroundColorTop = function(value) {
			basePrototype.setBackgroundColorTop.call(this, value);

			if (this._backgroundMaterial !== null){
				this._updateColor(this._backgroundMaterial.uniforms.topColor.value, value);
				this._checkBackgroundColor();
			}

			return this;
		};

		/**
		 * Pause animation
		 *
		 * @returns {void}
		 * @private
		 */
		Viewport.prototype.pauseAnimation = function() {
			this._animationTimeController.pause();
			this.setShouldRenderFrame();
		};

		/**
		 * Resume animation playing
		 *
		 * @returns {void}
		 * @private
		 */
		Viewport.prototype.resumeAnimation = function() {
			this._animationTimeController.resume();
			this.setShouldRenderFrame();
		};

		/**
		 * Hanle the event for dragging animation to a progress value
		 *
		 * @param {object} event contains a property "value" between 0 and 100
		 *
		 * @private
		 */
		Viewport.prototype.handleDragAnimation = function(event) {
			var progress = event.getParameter("value");

			if (this._animationTimeController.isAnimationStopped() || !this._animationMixer) {
				if (!this._startAnimation(true)) {
					// this.stopAnimation();
					return;
				}
			}

			this._animationTimeController.drag(progress);

			this.setShouldRenderFrame();
		};

		/**
		 * Handle the event for completing draging animation to a progress value
		 *
		 * @param {object} event contains a property "value" between 0 and 100
		 *
		 * @private
		 */
		Viewport.prototype.handleCompleteDraggingAnimation = function(event) {
			var progress = event.getParameter("value");
			if (!this._animationTimeController.isAnimationStopped()) {
				this._animationTimeController.completeDragging(progress);
			}
			this.setShouldRenderFrame();
		};

		var getNodesWithMaterialColor = function(pnode, nodes) {
			if (pnode && pnode.material && pnode.material.color){
				nodes.push(pnode);
			}
			for (var cni = 0; pnode.children && cni < pnode.children.length; cni++) {
				var child = pnode.children[cni];
				getNodesWithMaterialColor(child, nodes);
			}
		};

		var getNodesWithMaterialOpacity = function(pnode, nodes) {
			if (pnode && pnode.material && pnode.material.opacity){
				nodes.push(pnode);
			}
			for (var cni = 0; pnode.children && cni < pnode.children.length; cni++) {
				var child = pnode.children[cni];
				getNodesWithMaterialOpacity(child, nodes);
			}
		};

		/**
		 * Handle the event for adding key frame to an animation sequence
		 *
		 * @param {object} event contains data on key frame and animation sequence
		 *
		 * @private
		 */
		Viewport.prototype.handleKeyFrameAdded = function(event) {
			var data = event.getParameters();
			var children, ci;
			if (data.trackType === AnimationTrackType.rotate) {
				data.targetNodeRef.quaternion.copy(new THREE.Quaternion(data.keyFrameValue[0], data.keyFrameValue[1], data.keyFrameValue[2], data.keyFrameValue[3]));
			} else if (data.trackType === AnimationTrackType.translate) {
				data.targetNodeRef.position.copy(new THREE.Vector3(data.keyFrameValue[0], data.keyFrameValue[1], data.keyFrameValue[2]));
			} else if (data.trackType === AnimationTrackType.scale) {
				data.targetNodeRef.scale.copy(new THREE.Vector3(data.keyFrameValue[0], data.keyFrameValue[1], data.keyFrameValue[2]));
			} else if (data.trackType === AnimationTrackType.opacity) {
				children = [];
				getNodesWithMaterialOpacity(data.targetNodeRef, children);
				for (ci = 0; ci < children.length; ci++) {
					children[ci].material.opacity = data.keyFrameValue[0];
				}
			} else if (data.trackType === AnimationTrackType.color) {
				children = [];
				getNodesWithMaterialColor(data.targetNodeRef, children);
				for (ci = 0; ci < children.length; ci++) {
					children[ci].material.color.copy(new THREE.Color(data.keyFrameValue[0], data.keyFrameValue[1], data.keyFrameValue[2]));
				}
			}
			this.setShouldRenderFrame();
		};

		/**
		 * Handle the event for updating key frame in an animation sequence
		 *
		 * @param {object} event contains data on key frame and animation sequence
		 *
		 * @private
		 */
		Viewport.prototype.handleKeyFrameUpdated = function(event) {
			this.handleKeyFrameAdded(event);
			this.setShouldRenderFrame();
		};

		/**
		 * Handle the event for deleting key frame from an animation sequence
		 *
		 * @param {object} event contains data on key frame and animation sequence
		 *
		 * @private
		 */
		Viewport.prototype.handleKeyFrameDeleted = function(event) {
			var data = event.getParameters();
			var animationSequence = this._scene.getAnimationSequence(data.sequenceId);
			if (!animationSequence) {
				return;
			}
			var keyFrame = animationSequence.getNearestKeyFrame(data.targetNodeRef, data.trackType, data.keyFrameTime);
			if (keyFrame) {
				var children, ci;
				if (data.trackType === AnimationTrackType.rotate) {
					var value = animationSequence.getRotateKeyFrameInQuaternion(data.targetNodeRef, keyFrame.index);
					if (value) {
						data.targetNodeRef.quaternion.copy(new THREE.Quaternion(value[0], value[1], value[2], value[3]));
					}
				} else if (data.trackType === AnimationTrackType.translate) {
					data.targetNodeRef.position.copy(new THREE.Vector3(keyFrame.value[0], keyFrame.value[1], keyFrame.value[2]));
				} else if (data.trackType === AnimationTrackType.scale) {
					data.targetNodeRef.scale.copy(new THREE.Vector3(keyFrame.value[0], keyFrame.value[1], keyFrame.value[2]));
				} else if (data.trackType === AnimationTrackType.opacity) {
					children = [];
					getNodesWithMaterialOpacity(data.targetNodeRef, children);
					for (ci = 0; ci < children.length; ci++) {
						children[ci].material.opacity = keyFrame.value[0];
					}
				} else if (data.trackType === AnimationTrackType.color) {
					children = [];
					getNodesWithMaterialColor(data.targetNodeRef, children);
					for (ci = 0; ci < children.length; ci++) {
						children[ci].material.color.copy(new THREE.Color(keyFrame.value[0], keyFrame.value[1], keyFrame.value[2]));
					}
				}
			} else {
				var positionData;
				if (data.trackType === AnimationTrackType.rotate || data.trackType === AnimationTrackType.translate || data.trackType === AnimationTrackType.scale) {
					positionData = this._animationHelper.getNodePositionFromNearestPlayback(this._scene, this._currentView, data.sequenceId, data.targetNodeRef);
					if (!positionData) {
						positionData = this._animationHelper.getNodePositionByView(this._currentView, data.targetNodeRef);
					}
				}
				if (positionData) {
					if (data.trackType === AnimationTrackType.rotate) {
						data.targetNodeRef.quaternion.copy(positionData.quaternion);
						var q = [ positionData.quaternion.x, positionData.quaternion.y, positionData.quaternion.z, positionData.quaternion.w ];
						animationSequence.resetOriginalPosition(data.targetNodeRef, q, null, null);
					} else if (data.trackType === AnimationTrackType.translate) {
						data.targetNodeRef.position.copy(positionData.position);
						var p = [ positionData.position.x, positionData.position.y, positionData.position.z ];
						animationSequence.resetOriginalPosition(data.targetNodeRef, null, p, null);
					} else if (data.trackType === AnimationTrackType.scale) {
						data.targetNodeRef.scale.copy(positionData.scale);
						var s = [ positionData.scale.x, positionData.scale.y, positionData.scale.z ];
						animationSequence.resetOriginalPosition(data.targetNodeRef, null, null, s);
					}
				}
			}

			this.setShouldRenderFrame();
		};

		/**
		 * Add Handlers to events fired by animation sequences
		 *
		 * @param {sap.ui.vk.threejs.AnimationSequence} animationSequence animation sequence
		 *
		 * @private
		 */
		Viewport.prototype.AddHandlersToAnimationSequenceEvents = function(animationSequence) {
			animationSequence.detachKeyFrameAdded(this.handleKeyFrameAdded, this);
			animationSequence.detachKeyFrameUpdated(this.handleKeyFrameUpdated, this);
			animationSequence.detachKeyFrameDeleted(this.handleKeyFrameDeleted, this);
			animationSequence.attachKeyFrameAdded(this.handleKeyFrameAdded, this);
			animationSequence.attachKeyFrameUpdated(this.handleKeyFrameUpdated, this);
			animationSequence.attachKeyFrameDeleted(this.handleKeyFrameDeleted, this);
		};

		Viewport.prototype.setBackgroundColorBottom = function(value) {
			basePrototype.setBackgroundColorBottom.call(this, value);

			if (this._backgroundMaterial !== null){
				this._updateColor(this._backgroundMaterial.uniforms.bottomColor.value, value);
				this._checkBackgroundColor();
			}
			return this;
		};

		Viewport.prototype.setClippingPlanes = function(clippingPlanes) {
			this._clippingPlanes = clippingPlanes;
			return this;
		};

		Viewport.prototype.onBeforeRendering = function() {
			if (this._resizeListenerId) {
				ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}

			this._stopRenderLoop();
		};

		Viewport.prototype.onAfterRendering = function() {
			var domRef = this.getDomRef();
			domRef.appendChild(this._renderer.domElement);

			this._resizeListenerId = ResizeHandler.register(this, this._handleResize.bind(this));

			this._handleResize({
				size: {
					width: domRef.clientWidth,
					height: domRef.clientHeight
				}
			});

			this._startRenderLoop();
		};

		Viewport.prototype._handleResize = function(event) {

			if (!this._camera || !this._renderer) {
				// nothing to do
				return false;
			}

			var width = event.size.width;
			var height = event.size.height;

			if (this._camera) {
				this._camera.update(width, height);
			}

			this._renderer.setSize(width, height);

			this.fireResize({
				size: {
					width: width,
					height: height
				}
			});

			this.setShouldRenderFrame();

			return true;

		};

		/**
		* Attaches the scene to the Viewport for rendering.
		* @param {sap.ui.vk.threejs.Scene} scene The scene to attach to the Viewport.
		* @returns {sap.ui.vk.threejs.Viewport}<code>this</code> to allow method chaining.
		* @deprecated Since version 1.50.0.
		* @public
		*/
		Viewport.prototype.setScene = function(scene) {
			this._scene = scene;
			this._homeCamera = null;    // remove previous home camera

			this._sceneObserver.disconnect();

			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			if (nativeScene) {
				// When doubleSided property in scene changes we want to refresh screen
				this._sceneObserver.observe(this._scene, { properties: [ "doubleSided" ] });

				// we create the scene and assume we have lights. Grab 1st one so we do 'CAD optimize light'
				// Basically light at your eye position
				var group;
				for (var i = 0; i < nativeScene.children.length; i++) {
					group = nativeScene.children[ i ];
					if (group.private && group.name === "DefaultLights" && group.children.length) {
						if (group.children[0] instanceof THREE.PointLight) {
							this._eyePointLight = group.children[0];
						}
					}
				}
			}
			this._animationTimeController.reset();
			this.fireAnimationUpdated({ value: 0 }); // only to make sure animation time slider set to zero

			this.setShouldRenderFrame();

			return this;
		};

		/**
		* Gets the Viewport Scene
		* @returns {sap.ui.vk.threejs.Scene} returns Scene
		* @public
		*/
		Viewport.prototype.getScene = function() {
			return this._scene;
		};

		/**
		* Sets the camera for the Viewport
		* @param {sap.ui.vk.Camera} camera parameter
		* @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		* @public
		*/
		Viewport.prototype.setCamera = function(camera) {

			if (basePrototype.setCamera) {
				basePrototype.setCamera.call(this, camera);
			}

			var cam = this.getCamera();
			if (cam && this._renderer) {
				var size = this._renderer.getSize();
				cam.update(size.width, size.height);

				if (!this._homeCamera && cam.getCameraRef()) {
					this._homeCamera = cam.getCameraRef().clone(); // set home camera
				}
			}

			this.setShouldRenderFrame();

			return this;
		};

		Viewport.prototype.getRenderer = function() {
			return this._renderer;
		};

		Viewport.prototype._getViewStateManagerThreeJS = function() {
			if (this._viewStateManager) {
				if (this._viewStateManager instanceof ThreeJSViewStateManager) {
					return this._viewStateManager;
				}
				if (this._viewStateManager instanceof VkViewStateManager &&
					this._viewStateManager._implementation instanceof ThreeJSViewStateManager) {
					return this._viewStateManager._implementation;
				}
			}
			return null;
		};

		Viewport.prototype._updateBoundingBoxesIfNeeded = function() {
			var vsm = this._getViewStateManagerThreeJS();
			if (vsm) {
				vsm._updateBoundingBoxesIfNeeded();
			}
		};

		/**
		 * @param {THREE.Vector4} destColor The destination color object.
		 * @param {number} cssColor The sap.ui.core.CSSColor color to be decomposed into RGBA.
		 * @private
		 */
		Viewport.prototype._updateColor = function(destColor, cssColor) {
			var color = cssColorToColor(cssColor);
			destColor.color = new THREE.Color(color.red / 255, color.green / 255, color.blue / 255);
			destColor.alpha = color.alpha;
			destColor.x = destColor.color.r * destColor.alpha;
			destColor.y = destColor.color.g * destColor.alpha;
			destColor.z = destColor.color.b * destColor.alpha;
			destColor.w = destColor.alpha;
		};

		Viewport.prototype._checkBackgroundColor = function() {
			var colorTop = this.getBackgroundColorTop();
			if (colorTop === this.getBackgroundColorBottom()) {
				if (this._backgroundColor === null) {
					this._backgroundColor = new THREE.Vector4();
				}

				this._updateColor(this._backgroundColor, colorTop);
			} else {
				this._backgroundColor = null;
			}

			this.setShouldRenderFrame();
		};

		Viewport.prototype._handleCdsSceneUpdate = function() {
			this.setShouldRenderFrame();
		};

		/**
		 * @returns {sap.ui.vk.threejs.Viewport} <code>this</code> to allow method chaining.
		 * @protected
		 */
		Viewport.prototype.setShouldRenderFrame = function() {
			this._shouldRenderFrame = true;
			return this;
		};

		/**
		 * @returns {bool} It returns <code>true</code> or <code>false</code> whether the frame should be rendered or not.
		*/
		Viewport.prototype.shouldRenderFrame = function() {
			return this._shouldRenderFrame;
		};

		// Override the generated method to suppress invalidation.
		Viewport.prototype.setRenderMode = function(renderMode) {
			this.setProperty("renderMode", renderMode, true);

			if (this._scene) {
				switch (renderMode) {
					case RenderMode.LineIllustration:
					case RenderMode.ShadedIllustration:
					case RenderMode.SolidOutline:
						this._scene._createOutlineGeometry(renderMode);
						break;
					default:
						this._scene._hideOutlineGeometry();
						break;
				}
			}

			this.setShouldRenderFrame();
			return this;
		};

		/**
		* Performs a screen-space hit test and gets the hit node reference, it must be called between beginGesture() and endGesture()
		*
		* @param {int} x: x coordinate in viewport to perform hit test
		* @param {int} y: y coordinate in viewport to perform hit test
		* @returns {object} object under the viewport coordinates (x, y).
		*/
		Viewport.prototype.hitTest = function(x, y) {
			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			var nativeCamera = this._camera ? this._camera.getCameraRef() : undefined;
			if (!nativeCamera || !nativeScene) {
				return null;
			}

			var element = this._renderer.domElement;
			var mouse = new THREE.Vector2((x  - element.clientLeft) / element.clientWidth * 2 - 1,
				(element.clientTop - y) / element.clientHeight * 2 + 1);
			var raycaster = new THREE.Raycaster();

			raycaster.setFromCamera(mouse, nativeCamera);

			if (this._clippingPlanes) {
				for (var pi in this._clippingPlanes) {
					var plane = this._clippingPlanes[ pi ];
					var dist = plane.distanceToPoint(raycaster.ray.origin),
						t = -dist / plane.normal.dot(raycaster.ray.direction);
					if (t > 0) {
						if (dist < 0) {
							raycaster.near = Math.max(raycaster.near, t);
						} else {
							raycaster.far = Math.min(raycaster.far, t);
						}
					} else if (dist < 0) {
						return null;
					}
				}
			}

			var intersects = raycaster.intersectObjects(nativeScene.children, true);
			if (intersects) {
				for (var i in intersects) {
					var result = intersects[ i ];
					var object = result.object;

					// search for the first closed parent node
					var parent = object.parent;
					while (parent) {
						if (parent.userData.closed) {
							object = parent;
						}
						parent = parent.parent;
					}

					// skip "skipIt" and unnamed nodes
					while (object.parent && (object.userData.skipIt || (!object.name && object.children.length === 0))) {
						object = object.parent;
					}

					if (!object.isBillboard && !object.isDetailView) {
						result.object = object;
						return result;
					}
				}
			}

			return null;
		};

		/**
		 * Executes a click or tap gesture.
		 *
		 * @param {int} x The tap gesture's x-coordinate.
		 * @param {int} y The tap gesture's y-coordinate.
		 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
		 * @returns {sap.ui.vk.threejs.Viewport} this
		 */
		Viewport.prototype.tap = function(x, y, isDoubleClick) {

			if (!isDoubleClick) {
				if (this._viewStateManager) {
					var hit = this.hitTest(x, y); // NB: pass (x, y) in CSS pixels, hitTest will convert them to device pixels.

					var node = hit && hit.object;

					// if (node && node.userData.billboard) {
					// 	var link = node.userData.billboard.getLink();
					// 	if (link) {
					// 		window.open(link);
					// 		return this;
					// 	}
					// }

					var parameters = {
						picked: node ? [ node ] : []
					};
					this.fireNodesPicked(parameters);

					if (this.getSelectionMode() === SelectionMode.Exclusive) {
						this.exclusiveSelectionHandler(parameters.picked);
					} else if (this.getSelectionMode() === SelectionMode.Sticky) {
						this.stickySelectionHandler(parameters.picked);
					}

					if (node !== null) {
						this.fireNodeClicked({ nodeRef: node, x: x, y: y }, true, true);
					}
				}
			} else if (!this.getFreezeCamera()){
				var hitForDB = this.hitTest(x, y);

				if (hitForDB && (this._zoomedObject === null || this._zoomedObject !== hitForDB.object)) {// doubleclick on new object
					this._zoomedObject = hitForDB.object;
					this._viewportGestureHandler.zoomObject(this._zoomedObject, true);
				} else { // doubleclick on previously doubleclicked object, or on empty space
					this._viewportGestureHandler.zoomObject(this._zoomedObject, false);
					this._zoomedObject = null;
				}
			}
			return this;
		};

		////////////////////////////////////////////////////////////////////////
		// Keyboard handling begins.

		var offscreenPosition = { x: -2, y: -2 };
		var rotateDelta = 2;
		var panDelta = 5;

		[
			{ key: "left", dx: -rotateDelta, dy: 0 },
			{ key: "right", dx: +rotateDelta, dy: 0 },
			{ key: "up", dx: 0, dy: -rotateDelta },
			{ key: "down", dx: 0, dy: +rotateDelta }
		].forEach(function(item) {
			Viewport.prototype[ "onsap" + item.key ] = function(event) {
				if (!event.isMarked()) {
					var cameraController = this._viewportGestureHandler._cameraController;
					cameraController.beginGesture(offscreenPosition.x, offscreenPosition.y);
					cameraController.rotate(item.dx, item.dy, true);
					cameraController.endGesture();
					this.setShouldRenderFrame();
					event.preventDefault();
					event.stopPropagation();
				}
			};
		});

		[
			{ key: "left", dx: -panDelta, dy: 0 },
			{ key: "right", dx: +panDelta, dy: 0 },
			{ key: "up", dx: 0, dy: -panDelta },
			{ key: "down", dx: 0, dy: +panDelta }
		].forEach(function(item) {
			Viewport.prototype[ "onsap" + item.key + "modifiers" ] = function(event) {
				if (!event.isMarked() && event.shiftKey && !(event.ctrlKey || event.altKey || event.metaKey)) {
					var cameraController = this._viewportGestureHandler._cameraController;
					cameraController.beginGesture(offscreenPosition.x, offscreenPosition.y);
					cameraController.pan(item.dx, item.dy);
					cameraController.endGesture();
					this.setShouldRenderFrame();
					event.preventDefault();
					event.stopPropagation();
				}
			};
		});

		[
			{ key: "minus", d: 0.98 },
			{ key: "plus", d: 1.02 }
		].forEach(function(item) {
			Viewport.prototype[ "onsap" + item.key ] = function(event) {
				if (!event.isMarked()) {
					var cameraController = this._viewportGestureHandler._cameraController;
					cameraController.beginGesture(this.$().width() / 2, this.$().height() / 2);
					cameraController.zoom(item.d);
					cameraController.endGesture();
					this.setShouldRenderFrame();
					event.preventDefault();
					event.stopPropagation();
				}
			};
		});

		// Keyboard handling ends.
		////////////////////////////////////////////////////////////////////////

		Viewport.prototype._handleVisibilityChanged =
		Viewport.prototype._handleOpacityChanged =
		Viewport.prototype._handleTintColorChanged =
		Viewport.prototype._handleHighlightColorChanged =
			function(event) {
				this.setShouldRenderFrame();
			};

		Viewport.prototype._handleSelectionChanged =
			function(event) {
				var tools = this.getTools();
				for (var i = 0; i < tools.length; i++) { // loop over all oTools
					var tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
					var gizmo = tool.getGizmoForContainer(this);
					if (gizmo && gizmo.handleSelectionChanged) {
						gizmo.handleSelectionChanged(event);
					}
				}
				this.setShouldRenderFrame();
			};

		Viewport.prototype.setSelectionRect = function(rect) {
			this.setShouldRenderFrame();

			if (!rect) {
				this._selectionRect = null;
				return;
			}

			var size = this._renderer.getSize();
			var x1 = (rect.x1 / size.width) * 2 - 1,
				y1 = (rect.y1 / size.height) * -2 + 1,
				x2 = (rect.x2 / size.width) * 2 - 1,
				y2 = (rect.y2 / size.height) * -2 + 1;

			if (!this._selectionRect) {
				var geom = new THREE.Geometry();
				geom.vertices.push(
					new THREE.Vector3(x1, y2, -1),
					new THREE.Vector3(x2, y2, -1),
					new THREE.Vector3(x2, y1, -1),
					new THREE.Vector3(x1, y1, -1)
				);
				this._selectionRect = new THREE.LineLoop(geom, new THREE.LineBasicMaterial({ color: 0xC0C000, linewidth: window.devicePixelRatio }));
			} else {
				var vertices = this._selectionRect.geometry.vertices;
				vertices[ 0 ].set(x1, y2, -1);
				vertices[ 1 ].set(x2, y2, -1);
				vertices[ 2 ].set(x2, y1, -1);
				vertices[ 3 ].set(x1, y1, -1);
				this._selectionRect.geometry.verticesNeedUpdate = true;
			}
		};

		Viewport.prototype._renderLoop = function() {
			if (!this._renderer || !this.getDomRef()) {// break render loop
				this._renderLoopRequestId = 0;
				return;
			}

			if (this._viewportGestureHandler) {
				this._viewportGestureHandler.animateCameraUpdate();
			}

			if (this._nodesTransitionHelper){
				this._nodesTransitionHelper.displayNodesMoving();
			}

			// move light to eye position
			if (this.getCamera()) {
				var nativeCamera =  this.getCamera().getCameraRef();
				if (this._eyePointLight && nativeCamera) {
					this._eyePointLight.position.copy(nativeCamera.position);
				}
				if (this.getCamera().getIsModified()) {
					this.getCamera().setIsModified(false);
					this._shouldRenderFrame = true;
				}
			}

			// onBefore Rendering callback?

			if (this._shouldRenderFrame) {
				this._shouldRenderFrame = false;
				this.render();
			}

			this._renderLoopRequestId = window.requestAnimationFrame(this._renderLoopFunction); // request next frame
		};

		function _updateDynamicObjects(renderer, camera, scene) {
			// update billboars, callouts, lock to viewport nodes, etc
			scene.children.forEach(function(root) {
				if (root.userData._vkDynamicObjects) {
					root.userData._vkDynamicObjects.forEach(function(object) {
						if (object.visible) {
							object._vkUpdate(renderer, camera);
						}
					});
				}
			});
		}

		function _renderDetailViews(renderer, camera, scene, boundingBox) {
			scene.children.forEach(function(root) {
				if (root.userData._vkDetailViews) {
					root.userData._vkDetailViews.sort(function(a, b) {
						return a.renderOrder - b.renderOrder;
					});
					root.userData._vkDetailViews.forEach(function(detailView) {
						if (detailView.node.visible) {
							detailView.detailView._render(renderer, camera, scene, boundingBox);
						}
					});
				}
			});
		}

		Viewport.prototype.render = function() {
			var renderer = this._renderer;
			if (!renderer) {
				return;
			}

			var nativeScene = this._scene ? this._scene.getSceneRef() : null;
			var nativeCamera = this._camera ? this._camera.getCameraRef() : null;

			if (!nativeScene || !nativeCamera) {
				return;
			}

			if (this._animationMixer) {
				var currentAnimationStatus = this._animationTimeController.getCurrentStatus();
				if (currentAnimationStatus.progress < 0) {
					this._animationMixer.dispatchEvent({
						type: "restart"
					});

					// Since we are going back in time we have to restart animation mixer and NOT render this frame to avoid flicker
					// Next frame request will set mixer to correct time, reposition animated objects and then render frame
					this._shouldRenderFrame = false;
					return;

				} else if (currentAnimationStatus.delta > 0) {
					for (var ai = 0; ai < this._currentAnimationActions.length; ai++) {
						var action = this._currentAnimationActions[ai];
						if (!action.enabled || action.paused) {
							action.enabled = true;
							action.paused = false;
						}
					}

					this._animationMixer.updateWithoutMixing(currentAnimationStatus.delta);
					this.setShouldRenderFrame();
					this.fireAnimationUpdated({ value: currentAnimationStatus.progress });
					if (currentAnimationStatus.progress >= 100 && !this._animationTimeController.getInfinite()) {
						this._animationMixer.dispatchEvent({
							type: "complete"
						});
						this.fireAnimationFinished();
					}
				} else if (currentAnimationStatus.progress >= 100) {
					this._shouldRenderFrame = false;
				}
			}

			var tools = this.getTools();
			var vsm = this._getViewStateManagerThreeJS();
			var i, tool, gizmo, boundingBox;

			// Re-calculate clipping planes if necessary
			if (this._camera.getUsingDefaultClipPlanes() || (nativeCamera.isOrthographicCamera && this._camera.getZoomNeedRecalculate())) {
				boundingBox = this._scene._computeBoundingBox(true, false);
				if (!boundingBox.isEmpty()) {
					if (nativeCamera.isOrthographicCamera && this._camera.getZoomNeedRecalculate()) {
						this._camera.adjustZoom(boundingBox);
					}

					if (this._camera.getUsingDefaultClipPlanes()) {
						for (i = 0; i < tools.length; i++) { // loop over all oTools
							tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
							gizmo = tool.getGizmoForContainer(this);
							if (gizmo && gizmo.expandBoundingBox) {
								gizmo.expandBoundingBox(boundingBox);
							}
						}

						this._camera.adjustClipPlanes(boundingBox);
					}
				}
			}

			_updateDynamicObjects(renderer, nativeCamera, nativeScene);
			renderer.clippingPlanes = this._clippingPlanes;

			switch (this.getRenderMode()) {
				case RenderMode.XRay:
					if (vsm) {
						var lightNode = nativeScene.children[ nativeScene.children.length - 1 ].clone();
						vsm._selectedNodes.forEach(function(node) {
							if (node.visible) {
								node.add(lightNode);
								renderer.render(node, nativeCamera);
								renderer.autoClear = false;
								node.remove(lightNode);
							}
						});
					}

					nativeScene.overrideMaterial = this._xrayMaterial;
					break;
				case RenderMode.LineIllustration:
				case RenderMode.ShadedIllustration:
				case RenderMode.SolidOutline:
					this._scene._outlineMaterial.linewidth = this._renderer.getPixelRatio();
					break;
				default: break;
			}

			// Apply background
			renderer.autoClear = this._backgroundColor != null;
			if (renderer.autoClear) {
				renderer.setClearColor(this._backgroundColor.color, this._backgroundColor.alpha);
			} else {
				renderer.render(this._backgroundScene, this._backgroundCamera);
			}

			renderer.render(nativeScene, nativeCamera);
			renderer.autoClear = false;
			renderer.clippingPlanes = [];
			nativeScene.overrideMaterial = null;

			_renderDetailViews(renderer, nativeCamera, nativeScene, boundingBox);

			if (vsm) {
				var boundingBoxesScene = vsm._boundingBoxesScene;
				if (boundingBoxesScene) {
					renderer.render(boundingBoxesScene, nativeCamera);
				}
			}

			for (i = 0; i < tools.length; i++) { // loop over all oTools
				tool = sap.ui.getCore().byId(tools[ i ]); // get control for associated control
				gizmo = tool.getGizmoForContainer(this);
				if (gizmo && gizmo.render) {
					gizmo.render(this);
				}
			}

			if (this._selectionRect) {
				renderer.render(this._selectionRect, this._backgroundCamera);
			}

			this.fireFrameRenderingFinished();
		};

		/**
		 * Returns viewport content as an image of desired size.
		 *
		 * @param {int} width Requested image width in pixels. Allowed values are 8 to 2048, default is 16
		 * @param {int} height Requested image height in pixels. Allowed values are 8 to 2048, default is 16
		 * @param {string} topColor The sap.ui.core.CSSColor to be used for top background color
		 * @param {string} bottomColor The sap.ui.core.CSSColor to be used for bottom background color
		 * @param {boolean} includeSelection Include selected nodes
		 * @returns {string} Base64 encoded PNG image
		 * @public
		 */
		Viewport.prototype.getImage = function(width, height, topColor, bottomColor, includeSelection) {
			if (this._scene === null) {
				return null;
			}

			width = Math.min(width || 16, 2048);
			height = Math.min(height || 16, 2048);

			var renderer = new THREE.WebGLRenderer({
				preserveDrawingBuffer: true,
				antialias: true,
				alpha: true
			});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(width, height);

			// Remember background colors
			var currentBKTop = this.getBackgroundColorTop();
			var currentBKBottom = this.getBackgroundColorBottom();

			if (topColor && !bottomColor) {
				// If only top color is provided use it as a solid color
				renderer.setClearColor(topColor, 1);
			} else if (!topColor && bottomColor) {
				// If only bottom color is provided use it as a solid color
				renderer.setClearColor(bottomColor, 1);
			} else {
				if (topColor && bottomColor) {
					this.setBackgroundColorTop(topColor);
					this.setBackgroundColorBottom(bottomColor);
				}

				renderer.render(this._backgroundScene, this._backgroundCamera);
				renderer.autoClear = false;
			}

			document.body.appendChild(renderer.domElement);

			// Don't mess with existing camera, create a clone
			var camera = this.getCamera().getCameraRef().clone();
			var aspect = width / height;
			if (camera.isOrthographicCamera) {
				var w = camera.right - camera.left;
				var h = camera.top - camera.bottom;
				if (w > h) {
					camera.top = w / aspect / 2;
					camera.bottom = -w / aspect / 2;
				} else {
					camera.left = -h * aspect / 2;
					camera.right = h * aspect / 2;
				}
			} else {
				// Calculate current horizontal FOV in degrees
				var hFovRad = 2 * Math.atan(camera.aspect * Math.tan(camera.fov * Math.PI / 360));

				// Compare horizontal with vertical FOV in degrees
				if (camera.fov < hFovRad * 180 / Math.PI) {
					// If horizontal FOV is greater then calculate new vertical FOV based on it and new aspect ratio
					camera.fov = 360 * Math.atan(Math.tan(hFovRad * 0.5) / aspect) / Math.PI;
				}
				camera.aspect = aspect;
			}
			camera.updateProjectionMatrix();

			// remove selection for snapshot
			var selectedNodes = [];
			var vsm = this._getViewStateManagerThreeJS();
			if (!includeSelection){
				if (vsm !== null) {
					// make copy of current nodes selected
					vsm.enumerateSelection(function(node) {
						selectedNodes.push(node);
					});

					// unselect selected nodes
					vsm.setSelectionState(selectedNodes, false, false, true);
				}
			}

			// capture snapshot
			renderer.render(this._scene.getSceneRef(), camera);
			var imageData = renderer.getContext().canvas.toDataURL();

			if (vsm !== null && selectedNodes.length > 0) {
				// add selection back for nodes that were originally selected
				vsm.setSelectionState(selectedNodes, true, false, true);
			}

			renderer.forceContextLoss();
			document.body.removeChild(renderer.domElement);

			if (currentBKBottom && topColor) {
				this.setBackgroundColorBottom(currentBKBottom);
			}
			if (currentBKTop && bottomColor) {
				this.setBackgroundColorTop(currentBKTop);
			}
			return imageData;
		};

		Viewport.prototype._setContent = function(content) {
			var scene;
			var camera;

			if (content) {
				scene = content;
				if (!(scene instanceof Scene)) {
					scene = null;
				}
				camera = content.camera;
				if (!(camera instanceof OrthographicCamera || camera instanceof PerspectiveCamera)) {
					camera = new PerspectiveCamera();
				}

				if (camera instanceof OrthographicCamera) {
					// if camera is behind centre, move it to the front, so light can be placed properly
					var boundingBox = new THREE.Box3().setFromObject(scene.getSceneRef());
					var centre = boundingBox.getCenter();
					var dir = camera.getTargetDirection();
					var pos = camera.getPosition();
					var dir1 = [ centre.x - pos[0], centre.y - pos[1], centre.z - pos[2] ];

					var projection = dir1[0] * dir[0] + dir1[1] * dir[1] + dir1[2] * dir[2];
					if (projection < 0) {
						var scale = boundingBox.getSize().length() / 2;
						scale -= projection;

						pos[0] -= dir[0] * scale;
						pos[1] -= dir[1] * scale;
						pos[2] -= dir[2] * scale;
						camera.setPosition(pos);
					}
				}

				var i;
				// if cds loaded this content, we need to attach some event for refreshing
				// this is because cds can update content after the scene is loaded
				// as cds streaming information from the server
				if (content.loaders) {
					for (i = 0; i < content.loaders.length; i++) {
						if (content.loaders[i] instanceof ContentDeliveryService) {
							this._cdsLoader = content.loaders[i]; // grab 1st one as we can only have one cds with scene atm
							this._cdsLoader.attachSceneUpdated(this._handleCdsSceneUpdate, this);
							break;
						}
					}
				}

				if (content.builders) {
					for (i = 0; i < content.builders.length; i++) {
						content.builders[i]._fireSceneUpdated = this.setShouldRenderFrame.bind(this);
						content.builders[i]._fireLoadingFinished = function(event) {
							this.setRenderMode(this.getRenderMode());
						}.bind(this);
					}
				}
			}

			if (this._animationMixer) {
				this._animationMixer.stopAllAction();
				this._animationMixer = null;
			}

			this.setScene(scene);

			if (scene) {
				var initialView = scene.getInitialView();
				if (initialView) {
					this._currentView = initialView;
					this._resetNodesMaterialAndOpacityByCurrenView();
					var playbacks = this._currentView.getPlaybacks();
					if (playbacks) {
						for (var pi = 0; pi < playbacks.length; pi++) {
							var currentPlayback = playbacks[pi];
							var animationSequence = scene.getAnimationSequence(currentPlayback.getSequenceId());
							if (animationSequence) {
								this.AddHandlersToAnimationSequenceEvents(animationSequence);
							}
						}
					}
				}
			}

			if (camera) { // camera is optional so only set it if exist
				this.setCamera(camera);
			}

			if (content) {
				if (content.backgroundTopColor !== undefined) { // hex color
					this.setBackgroundColorTop(new THREE.Color(content.backgroundTopColor).getStyle());
				}

				if (content.backgroundBottomColor !== undefined) { // hex color
					this.setBackgroundColorBottom(new THREE.Color(content.backgroundBottomColor).getStyle());
				}

				if (content.renderMode !== undefined) { // sap.ui.vk.RenderMode
					this.setRenderMode(content.renderMode);
				}
			}
		};

		Viewport.prototype._onAfterUpdateContentConnector = function() {
			this._setContent(this._contentConnector.getContent());
		};

		Viewport.prototype._onBeforeClearContentConnector = function() {

			if (basePrototype._onBeforeClearContentConnector) {
				basePrototype._onBeforeClearContentConnector.call(this);
			}
			this.setScene(null);
		};

		Viewport.prototype._handleContentReplaced = function(event) {
			var content = event.getParameter("newContent");
			this._setContent(content);
		};

		Viewport.prototype._onAfterUpdateViewStateManager = function() {
		};

		Viewport.prototype._onBeforeClearViewStateManager = function() {
		};

		ContentConnector.injectMethodsIntoClass(Viewport);
		ViewStateManager.injectMethodsIntoClass(Viewport);

		Viewport.prototype._restoreOriginalValueAfterAnimation = function() {

			var playbacks;
			if (this._currentView) {
				playbacks = this._currentView.getPlaybacks();
			}
			if (!playbacks || !playbacks.length) {
				return;
			}

			for (var pi = 0; pi < playbacks.length; pi++){
				var animationSequence = this._scene.getAnimationSequence(playbacks[pi].getSequenceId());
				var animationClip;
				if (animationSequence) {
					animationClip = animationSequence.getNativeAnimationClip();
				}

				if (animationClip){
					if (animationClip && animationClip.tracks) {
						for (var ti = 0; ti < animationClip.tracks.length; ti++) {
							var keyframeTrack = animationClip.tracks[ti];
							var keyframeUserData = keyframeTrack.userData;
							if (!keyframeUserData) {
								continue;
							}

							var originalValue = keyframeUserData.originalValue;
							if (!originalValue) {
								continue;
							}

							var targetNode = keyframeUserData.targetNode;
							if (!targetNode) {
								continue;
							}

							if (keyframeUserData.type === "SCALE") {
								targetNode.scale.copy(originalValue);
							} else if (keyframeUserData.type === "TRANSLATE") {
								targetNode.position.copy(originalValue);
							} else if (keyframeUserData.type === "ROTATE") {
								targetNode.quaternion.copy(originalValue);
							}
						}
					}
				}
			}
		};

		Viewport.prototype._resetNodePositionsForAnimation = function() {
			var nodeValues;

			if (this._currentView && this._currentView.userData && this._currentView.userData.nodeStartDataByAnimation) {
				nodeValues = this._currentView.userData.nodeStartDataByAnimation.entries();
			}
			if (nodeValues) {
				var nextValue = nodeValues.next();
				while (!nextValue.done) {
					var node = nextValue.value[0];
					var data = nextValue.value[1];
					nextValue = nodeValues.next();

					if (!data) {
						continue;
					}

					if (data.scale) {
						node.scale.copy(data.scale);
					}

					if (data.position) {
						node.position.copy(data.position);
					}

					if (data.quaternion) {
						node.quaternion.copy(data.quaternion);
					}

					if (data.opacity !== undefined) {
						node.material.opacity = data.opacity;
						node.material.needsUpdate = true;
					}

					if (data.color) {
						node.material.color = data.color.clone();
						node.material.needsUpdate = true;
					}
				}
			}

			return;
		};

		/**
		 * run the animation
		 *
		 * @param {boolean} dragging true if for handling dragging animation
		 *
		 * @return {boolean} true if started, false otherwise
		 * @private
		 */
		Viewport.prototype._runAnimation = function(dragging) {

			var playbacks;
			if (this._currentView) {
				playbacks = this._currentView.getPlaybacks();
			}
			if (!playbacks || !playbacks.length) {
				return false;
			}

			this.fireAnimationStarted();
			this._animationTimeController.setInfinite(false);
			var duration = 0;
			this._currentAnimationActions = [];
			var times = [];
			for (var pi = 0; pi < playbacks.length; pi++) {
				var currentPlayback = playbacks[pi];
				var animationSequence = this._scene.getAnimationSequence(currentPlayback.getSequenceId());
				var animationClip;
				if (animationSequence) {
					animationClip = animationSequence.getNativeAnimationClip();
					this.AddHandlersToAnimationSequenceEvents(animationSequence);
				}
				/*
				if (animationClip && !animationClip.hasOptimized) {
					animationClip.resetDuration();
					animationClip.optimize();
					animationClip.hasOptimized = true;
				}
				*/
				if (animationClip) {
					var clipAction = this._animationMixer.clipAction(animationClip);
					var repeat = 1;
					if (currentPlayback.getInfinite()) {
						if (this._playingProcedure) {
							repeat = Math.round(10 / animationSequence.getDuration());
							if (repeat < 10) {
								repeat = 10;
							}
							clipAction.setLoop(THREE.LoopRepeat, repeat);
						} else {
							clipAction.setLoop(THREE.LoopRepeat, Infinity);
							this._animationTimeController.setInfinite(true);
						}
					} else if (currentPlayback.getRepeat() > 0) {
						clipAction.setLoop(THREE.LoopRepeat, currentPlayback.getRepeat());
						repeat = currentPlayback.getRepeat();
					} else {
						clipAction.setLoop(THREE.LoopOnce, 1);
					}

					var playbackTimeScale = currentPlayback.getTimeScale();
					if (playbackTimeScale <= 0) {
						playbackTimeScale = 1;
					}

					if (currentPlayback.getReversed()) {
						clipAction.timeScale = -1;
						clipAction.time = animationClip.duration / playbackTimeScale;
					}
					clipAction.clampWhenFinished = true;

					clipAction.timeScale *= playbackTimeScale;
					this._currentAnimationActions.push(clipAction);
					times.push(currentPlayback.getStartTime() + currentPlayback.getPreDelay());

					var time = currentPlayback.getStartTime() +
									currentPlayback.getPreDelay() +
									repeat * animationSequence.getDuration() / playbackTimeScale +
									currentPlayback.getPostDelay();
					if (time > duration) {
						duration = time;
					}
				}
			}

			if (duration == 0) {
				this._animationMixer = null;
				this.fireViewFinished({ viewIndex: this._currentViewIndex });
				this._playNextStep();
				return false;
			}

			this._animationTimeController.startAnimation(duration, dragging);
			for (var ai = 0; ai < this._currentAnimationActions.length; ai++) {
				this._currentAnimationActions[ai].play().startAt(times[ai]);
			}
			this.setShouldRenderFrame();


			/*
			if (!currentPlayback.getInfinite() || this._playingProcedure) {
				this._currentPlaybackIndex++;
			}
			*/

			return true;
		};

		/**
		* Starts the animation
		* @private
		*/
		Viewport.prototype.startAnimation = function() {
			this.resumeAnimation();
			this._startAnimation();
		};

		/**
		 * Starts the animation
		 *
		 * @param {boolean} dragging true if for handling dragging animation
		 *
		 * @return {boolean} true if started, false otherwise
		 * @private
		 */
		Viewport.prototype._startAnimation = function(dragging) {
			if (this._animationMixer) {
				this._animationMixer.stopAllAction();
				this._animationMixer = null;
			}

			var playbacks;
			if (this._currentView) {
				playbacks = this._currentView.getPlaybacks();
			}
			if (!playbacks || !playbacks.length) {
				this._playingPlaybacks = false;
				return false;
			}

			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
			if (!nativeScene) {
				return false;
			}

			this._resetNodesStatusByCurrenView();  // for streaming
			this._resetNodePositionsForAnimation(); // for matai.js

			this._animationMixer = new THREE.AnimationMixer(nativeScene);
			if (!this._animationMixer.userData) {
				this._animationMixer.userData = {};
			}
			this._animationMixer.userData.completed = false;

			this._animationMixer.userData.viewport = this;
			this._animationMixer.addEventListener("complete", function(e) {
				if (this.userData.viewport) {
					this.userData.completed = true;
					if (this.userData.viewport._currentView) {
						this.userData.viewport._currentView.animationCompleted = true;
					}
					var play = function(vp) {
						vp.fireViewFinished({ viewIndex: this._currentViewIndex });
						vp._playNextStep();
					};
					setTimeout(play, 10, this.userData.viewport);
					jQuery.sap.log.debug("Animation completed");
				}
			}, false);

			this._animationMixer.addEventListener("restart", function(e) {
				if (this.userData.viewport) {
					this.userData.completed = true;
					if (this.userData.viewport._currentView) {
						this.userData.viewport._currentView.animationCompleted = true;
					}
					var play = function(vp) {
						var playbacks;
						if (vp._currentView) {
							playbacks = vp._currentView.getPlaybacks();
						}
						if (playbacks && playbacks.length) {
							vp._startAnimation();
						}
					};
					setTimeout(play, 10, this.userData.viewport);
					jQuery.sap.log.debug("Animation restart");
				}
			}, false);

			return this._runAnimation(dragging);
		};

		/**
		 * Stops the animation
		 * @private
		 */
		Viewport.prototype.stopAnimation = function() {
			if (this._animationMixer) {
				this._animationMixer.stopAllAction();
				this._animationMixer = null;
			}
			this._resetNodesStatusByCurrenView(); // for streaming
			this._resetNodePositionsForAnimation(); // for matai.js
			this._animationTimeController.stopAnimation();
			this.fireAnimationUpdated({ value: 0 });
			this._playingProcedure = false;
			this.setShouldRenderFrame();
		};

		/**
		* Get current view -  remembered when activateView function is called
		*
		* @returns {sap.ui.vk.view} current view
		* @public
		*/
		Viewport.prototype.getCurrentView = function() {
			return this._currentView;
		};

		Viewport.prototype._activateSingleView = function(view) {
			if (this._animationMixer) {
				this._animationMixer.stopAllAction();
				this._animationMixer = null;
			}

			if (this._scene._scene.userData.viewportGroups){
				var viewGroups = this._scene._scene.userData.viewportGroups;
				var that = this;

				viewGroups.forEach(function(viewGroup){
					viewGroup.modelViews.forEach(function(modelView){
						if (modelView === view){
							that._currentViewIndex = viewGroup.modelViews.indexOf(modelView);
						}
					});
				});
			}

			this.fireViewActivated({ viewIndex: this._currentViewIndex, view: view });

			this._animationTimeController.reset();
			this.fireAnimationUpdated({ value: 0 });

			this._currentView = view;

			if (view.topColor !== undefined) { // hex color
				this.setBackgroundColorTop(new THREE.Color(view.topColor).getStyle());
			}

			if (view.bottomColor !== undefined) { // hex color
				this.setBackgroundColorBottom(new THREE.Color(view.bottomColor).getStyle());
			}

			if (view.renderMode !== undefined) { // sap.ui.vk.RenderMode
				this.setRenderMode(view.renderMode);
			}

			var camera = view.camera;
			if (!camera && view.getCameraInfo()) {
				var cameraInfo = view.getCameraInfo();
				if (cameraInfo.type === "PerspectiveCamera") {
					camera = new PerspectiveCamera();
					camera.setFov(cameraInfo.fov);
				}
				if (cameraInfo.type === "OrthographicCamera") {
					camera = new OrthographicCamera();
					camera.setZoomFactor(cameraInfo.zoomFactor);
					if (cameraInfo.zoomNeedRecalculate){
						camera.setZoomNeedRecalculate(true);
					}
				}
				camera.setPosition(cameraInfo.position);
				camera.setNearClipPlane(cameraInfo.nearClipPlane);
				camera.setFarClipPlane(cameraInfo.farClipPlane);
				camera.setUpDirection(cameraInfo.upDirection);
				camera.setTargetDirection(cameraInfo.targetDirection);
				camera.setUsingDefaultClipPlanes(cameraInfo.usingDefaultClipPlanes);
				view.camera = camera;
			}

			var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;

			if (camera) {
				var nativeCamera = camera.getCameraRef();
				if (nativeCamera.type === "OrthographicCamera" && nativeScene) {
					// if camera is behind centre, move it to the front, so light can be placed properly
					var pos = camera.getPosition();
					var scene = this.getScene();
					if (scene) {
						var boundingBox = new THREE.Box3().setFromObject(nativeScene);
						var centre = boundingBox.getCenter();
						var dir = camera.getTargetDirection();
						var dir1 = [ centre.x - pos[0], centre.y - pos[1], centre.z - pos[2] ];

						var projection = dir1[0] * dir[0] + dir1[1] * dir[1] + dir1[2] * dir[2];
						if (projection < 0) {
							var scale = boundingBox.getSize().length() / 2;
							scale -= projection;

							pos[0] -= dir[0] * scale;
							pos[1] -= dir[1] * scale;
							pos[2] -= dir[2] * scale;
						}
					}
					camera.setPosition(pos);
				}
			}

			this._resetNodesMaterialAndOpacityByCurrenView();
			this._animationHelper.setInitialNodePositionsOnView(this._currentView, this._scene);
			this._resetNodesStatusByCurrenView(true, true, true);
			this._resetNodePositionsForAnimation(); // for matai.js

			var playbacks = this._currentView.getPlaybacks();
			if (playbacks) {
				for (var pi = 0; pi < playbacks.length; pi++) {
					var currentPlayback = playbacks[pi];
					var animationSequence = this._scene.getAnimationSequence(currentPlayback.getSequenceId());
					if (animationSequence) {
						this.AddHandlersToAnimationSequenceEvents(animationSequence);
						animationSequence.setInitialStatusToTargetNodesValues();
					}
				}
			}

			if (camera) {
				var timeInterval = 2000;
				if (view.flyToTime != null) {
					timeInterval = view.flyToTime;
				}

				this._playingPlaybacks = true;
				this._viewportGestureHandler.activateCamera(camera.getCameraRef(), timeInterval);
			} else {
				this.fireViewFinished();
			}
		};

		Viewport.prototype._updateMaterialInNode = function(nodeInfo) {

			var node = nodeInfo.target;

			var i, child;
			if (node && node.children) {
				for (i = 0; i < node.children.length; i++) {
					child = node.children[i];
					if (child.userData && (child.userData.animatedOpacity || child.userData.animatedColor)) {
						child._vkUpdateMaterialColor();
						child._vkUpdateMaterialOpacity();
						if (child.userData.animatedOpacity) {
							child.material.transparent = true;
						}
					}
				}
			}

			var oldMaterialId = node.userData.materialId;
			var oldOpacity = node.userData.opacity;

			node.userData.materialId = nodeInfo.materialId;
			node.userData.opacity = nodeInfo.opacity;

			var reAssignMaterial = false;
			if (oldMaterialId === undefined) {
				if (node.userData.materialId !== undefined) {
					reAssignMaterial = true;
				}
			} else if (oldMaterialId !== node.userData.materialId) {
				reAssignMaterial = true;
			}

			var resetOpacity = false;
			if (oldOpacity === undefined) {
				if (node.userData.opacity !== undefined || node.userData.animatedOpacity) {
					resetOpacity = true;
				}
			} else if (oldOpacity !== node.userData.opacity) {
				resetOpacity = true;
			}

			if (!reAssignMaterial && !resetOpacity) {
				 return;
			}

			var nodeMaterial  = null;
			if (node.userData.materialId) {
				var vkMaterial = this._scene.getMaterial(node.userData.materialId);
				if (vkMaterial) {
					nodeMaterial = vkMaterial.getMaterialRef();
				}
			}

			if (node && node.children) {
				for (i = 0; i < node.children.length; i++) {
					child = node.children[i];
					if (nodeMaterial) {
						child.material = nodeMaterial;
						child.userData.materialId = nodeInfo.materialId;
					} else if (child.userData && child.userData.initialMaterialId){
						var vkMeshMaterial = this._scene.getMaterial(child.userData.initialMaterialId);
						if (vkMeshMaterial) {
							var meshMaterial = vkMeshMaterial.getMaterialRef();
							child.material = meshMaterial;
							child.userData.materialId = child.userData.initialMaterialId;
						}
					}

					if (child.material && child.material.userData) {
						child.userData.originalMaterial = child.material;
						child.material = child.material.clone();
						if (node.userData.opacity !== undefined) {
							child.userData.opacity = node.userData.opacity;
							child.material.opacity *= child.userData.opacity;
							child.material.transparent = child.material.opacity < 0.99;
						}

						if (child.userData.animatedOpacity) {
							child.material.transparent = true;
						}
					}
				}
			}
		};

		Viewport.prototype._resetNodesMaterialAndOpacityByCurrenView = function() {

			if (!this._currentView) {
				return;
			}

			var nodeInfo;
			if (this._currentView.getNodeInfos) {
				nodeInfo = this._currentView.getNodeInfos();
			}

			if (nodeInfo) {  // for totaraLoader
				nodeInfo.forEach(function(node) {
					if (node.target === null) {
						return;
					}

					this._updateMaterialInNode(node);
				}.bind(this));
			}
		};


		Viewport.prototype._resetNodesStatusByCurrenView = function(includeAnimation, setVisibility, animationNodeTransition) {


			if (!this._currentView) {
				return;
			}

			function arrayToMatrixThree(array) {
				return new THREE.Matrix4().set(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9], array[10], array[11], 0, 0, 0, 1);
			}

			if (this._viewStateManager) {
				var nodeHierarchy = this._viewStateManager.getNodeHierarchy();
				if (nodeHierarchy) {

					var playbacks;
					if (this._currentView) {
						playbacks = this._currentView.getPlaybacks();
					}

					var nodeValueMap;

					if (includeAnimation && this._currentView.userData && this._currentView.userData.nodeStartDataByAnimation) {
						nodeValueMap = this._currentView.userData.nodeStartDataByAnimation;
					}

					var nodeInfo;
					if (this._currentView.getNodeInfos) {
						nodeInfo = this._currentView.getNodeInfos();
					}

					if (nodeInfo) {  // for totaraLoader
						// this._nodesTransitionHelper.clear();
						nodeInfo.forEach(function(node) {
							if (node.target === null) {
								return;
							}

							function equalMatrices(matrix1, matrix2, error){
								for (var ei = 0; ei < matrix1.elements.length; ei++){
									if (Math.abs(matrix1.elements[ei] - matrix2.elements[ei]) > error){
										return false;
									}
								}
								return true;
							}

							if (node.transform) {
								var newMatrix = arrayToMatrixThree(node.transform);
								if (!equalMatrices(newMatrix, node.target.matrix, 1e-6)){
									// Transition node to its view position as it differs from original node position
									if (!playbacks && animationNodeTransition) {
										// If view does not have animations then we will perform an interpolation animation for node transform
										var nodeProxy = nodeHierarchy.createNodeProxy(node.target);
										this._nodesTransitionHelper.setNodeForDisplay(nodeProxy);
									}

									newMatrix.decompose(node.target.position, node.target.quaternion, node.target.scale);
									node.target.updateMatrix();

									var data;
									if (nodeValueMap) {
										data = nodeValueMap.get(node.target);
									}
									if (data) {
										if (data.scale) {
											node.target.scale.copy(data.scale);
										}

										if (data.position) {
											node.target.position.copy(data.position);
										}

										if (data.quaternion) {
											node.target.quaternion.copy(data.quaternion);
										}

										if (data.opacity !== undefined) {
											node.material.opacity = data.opacity;
											node.material.needsUpdate = true;
										}

										if (data.color) {
											node.material.color = data.color.clone();
											node.material.needsUpdate = true;
										}
										node.target.updateMatrix();
									}
								}
							}
						}.bind(this));
					}

					if (setVisibility) {
						// Hide all root nodes. The roots that have visible nodes will be made visible when these nodes visibility changes.
						this._viewStateManager.setVisibilityState(nodeHierarchy.getChildren()[0].children, false, false);
						if (nodeInfo) { // for totaraLoader
							// Apply nodes visibility for the current view
							var nodeVisible = [];
							var nodeInvisible = [];

							for (var nfc = 0; nfc < nodeInfo.length; nfc++){
								if (nodeInfo[nfc].visible) {
									nodeVisible.push(nodeInfo[nfc].target);
								} else {
									nodeInvisible.push(nodeInfo[nfc].target);
								}
							}
							this._viewStateManager.setVisibilityState(nodeVisible, true, false);
							this._viewStateManager.setVisibilityState(nodeInvisible, false, false);
							this._nodesTransitionHelper.startDisplay(500);
						} else if (this._currentView.visibleNodes) {  // for mataiLoader
							var nativeScene = this._scene ? this._scene.getSceneRef() : undefined;
							if (nativeScene) {
								this._viewStateManager.setVisibilityState(nativeScene.children[ 0 ], false, true);
								this._viewStateManager.setVisibilityState(nativeScene.children[ 0 ], true, false);
								this._viewStateManager.setVisibilityState(this._currentView.visibleNodes, true, false);
							}
						}
					}
				}
			}
		};

		/**
		* Reset current view to its inital status
		*
		* @param {boolean} includeAnimation if true, convert to values of aimation starting points, if false, convert to the values defined by viewInfo
		* @returns {sap.ui.vk.threejs.Viewport} returns this
		* @private
		* @since 1.67.0
		*/
		Viewport.prototype.resetCurrentView = function(includeAnimation) {

			if (!this._currentView) {
				return this;
			}

			if (this._animationMixer) {
				this._animationMixer.stopAllAction();
				this._animationMixer = null;
			}

			this.fireAnimationUpdated({ value: 0 });

			this._resetNodesMaterialAndOpacityByCurrenView();

			if (includeAnimation) {
				// this._animationHelper.setInitialNodePositionsFromSubsequentViews(this._currentViews, this._scene);
				// this._animationHelper.setInitialNodePositionsFromPreviousViews(this._currentViews, this._scene);
				// this._animationHelper.setInitialNodePositionsFromCurrenetViews(this._currentViews, this._scene);
				this._animationHelper.setInitialNodePositionsOnView(this._currentView, this._scene);
			}

			this._resetNodesStatusByCurrenView(includeAnimation, false, false);

			if (includeAnimation) {
				this._resetNodePositionsForAnimation();
			}

			this.setShouldRenderFrame();

			return this;
		};

		/**
		* Activates the view based on view object passed
		* @param {sap.ui.vk.View} view View object definition
		* @param {boolean} notPlayingAnimations Whether or not to play animations
		* @returns {sap.ui.vk.threejs.Viewport} returns this
		* @public
		* @since 1.52.0
		*/
		Viewport.prototype.activateView = function(view, notPlayingAnimations) {
			this._playingProcedure = false;
			if (this._notPlayingAnimations == undefined){
				this._notPlayingAnimations = false;
			} else {
				this._notPlayingAnimations = notPlayingAnimations;
			}
			this._activateSingleView(view);
			return this;
		};

		/**
		* Update node information in current view with the current node transformation
		* @param {object} nodeRef node reference
		* @param {float} opacity optional, opacity for the node
		*
		* @private
		* @since 1.67.0
		*/
		Viewport.prototype.updateNodeInfoInCurrentView = function(nodeRef, opacity) {

			if (!this._currentView) {
				return;
			}

			var nodeInfos;
			if (this._currentView.getNodeInfos) {
				nodeInfos = this._currentView.getNodeInfos();
			}

			if (nodeInfos) {
				var nodeInfo;
				for (var ni = 0; ni < nodeInfos.length; ni++) {
					var info = nodeInfos[ni];
					if (info.target === null || info.target !== nodeRef) {
						continue;
					}
					nodeInfo = info;
					break;
				}

				if (!nodeInfo) {
					nodeInfo = {};
					nodeInfos.push(nodeInfo);
				}

				var transformMatrix = new THREE.Matrix4();
				transformMatrix.compose(nodeRef.position, nodeRef.quaternion, nodeRef.scale);
				var array = transformMatrix.toArray();
				nodeInfo.transform = [ array[0], array[4], array[8], array[12], array[1], array[5], array[9], array[13], array[2], array[6], array[10], array[14] ];
				if (opacity !== undefined) {
					nodeInfo.opacity = opacity;
				}
			}
		};


		Viewport.prototype._playNextStep = function() {
			if (!this._playingProcedure) {
				return;
			}

			this._currentViewIndex++;
			if (this._currentViews.length <= this._currentViewIndex) {
				// No more views to play
				this._playingProcedure = false;
				this.fireProcedureFinished();
			} else {
				// Play next view
				var view = this._currentViews[this._currentViewIndex];
				this._activateSingleView(view);
			}
		};

		/**
		* Play procedure define in a view group
		* @param {sap.ui.vk.View[]} views Array of view object definitions
		* @param {number} viewIndex Index of view to play procedure from
		* @param {boolean} notPlayingAnimations Whether or not to play animations
		* @returns {sap.ui.vk.threejs.Viewport} returns this
		* @private
		* @since 1.65.0
		*/
		Viewport.prototype.playProcedure = function(views, viewIndex, notPlayingAnimations) {

			if (views) {
				this._currentViews = views;
			}

			if (viewIndex == null){
				viewIndex = 0;
			}

			if (!this._currentViews || this._currentViews.length <= viewIndex) {
				return this;
			}

			this._currentViewIndex = viewIndex;
			if (this._notPlayingAnimations == undefined){
				this._notPlayingAnimations = false;
			} else {
				this._notPlayingAnimations = notPlayingAnimations;
			}

			if (this._playingProcedure && this._animationMixer) {
				this.resumeAnimation();
			} else {
				this._playingProcedure = true;

				var view = this._currentViews[viewIndex];
				this._activateSingleView(view);
			}

			return this;
		};

		/**
		 * Zooms the scene to a bounding box created from a particular set of nodes.
		 * @param {sap.ui.vk.ZoomTo|sap.ui.vk.ZoomTo[]} what What set of nodes to zoom to.
		 * @param {any} nodeRef Is used if what == (sap.ui.vk.ZoomTo.Node || ZoomTo.NodeSetIsolation)
		 * @param {float} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
		 * @param {float} margin Margin. Set to 0 to zoom to the entire screen.
		 * @returns {sap.ui.vk.Viewport} this
		 * @public
		 */
		Viewport.prototype.zoomTo = function(what, nodeRef, crossFadeSeconds, margin) {
			var nativeScene = this._scene ? this._scene.getSceneRef() : null;
			var nativeCamera = this._camera ? this._camera.getCameraRef() : null;
			if (!nativeCamera || !nativeScene) {
				return this;
			}

			margin = margin || 0;
			var boundingBox = new THREE.Box3();
			var quaternion = null;
			var node = null;
			(Array.isArray(what) ? what : [ what ]).forEach(function(what) {
				switch (what) {
					case ZoomTo.All:
						nativeScene._expandBoundingBox(boundingBox, false, true);
						break;
					case ZoomTo.Visible:
						nativeScene._expandBoundingBox(boundingBox, true, true);
						break;
					case ZoomTo.Selected:
						var vsm = this._getViewStateManagerThreeJS();
						if (vsm) {
							vsm.enumerateSelection(function(nodeRef) {
								nodeRef._expandBoundingBox(boundingBox, false, true);
							});
						}
						break;
					case ZoomTo.Node:
						if (!nodeRef) {
							return this;
						}
						node = nodeRef;
						if (Array.isArray(nodeRef)) {
							nodeRef.forEach(function(nodeRef) {
								nodeRef._expandBoundingBox(boundingBox, false, true);
							});
						} else {
							nodeRef._expandBoundingBox(boundingBox, false, true);
						}
						break;
					case ZoomTo.Restore:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTORENOTIMPLEMENTED"));
						return this;
					case ZoomTo.NodeSetIsolation:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_NODESETISOLATIONNOTIMPLEMENTED"));
						return this;
					case ZoomTo.RestoreRemoveIsolation:
						jQuery.sap.log.error(getResourceBundle().getText("VIEWPORT_MSG_RESTOREREMOVEISOLATIONNOTIMPLEMENTED"));
						return this;
					case ZoomTo.ViewLeft:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
						break;
					case ZoomTo.ViewRight:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
						break;
					case ZoomTo.ViewTop:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
						break;
					case ZoomTo.ViewBottom:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
						break;
					case ZoomTo.ViewBack:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
						break;
					case ZoomTo.ViewFront:
						quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
						break;
					default:
						break;
				}
			}.bind(this));

			if (!boundingBox.isEmpty()) {
				this._viewportGestureHandler.zoomTo(boundingBox, quaternion, margin, crossFadeSeconds * 1000, node, node !== null);
			}
			return this;
		};

		Viewport.prototype.pan = function(dx, dy) {
			this._viewportGestureHandler._cameraController.pan(dx, dy);
		};

		Viewport.prototype.rotate = function(dx, dy){
			this._viewportGestureHandler._cameraController.rotate(dx, dy);
		};

		Viewport.prototype.zoom = function(dy) {
			this._viewportGestureHandler._cameraController.zoom(dy);
		};

		/**
		 * Retrieves information about the current camera view in the scene, and saves the information in a JSON-like object.
		 * The information can then be used at a later time to restore the scene to the same camera view using the
		 * {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} method.<br/>
		 * @param {object}         [query]                       Query object which indicates what information to be retrieved.
		 * @param {boolean|object} [query.camera=true]           Indicator to retrieve camera information.
		 * @param {boolean}        [query.camera.matrices=false] Indicator to retrieve camera view and projection matrices.
		 * @param {boolean}        [query.camera.useTransitionCamera=false] Indicator to retrieve the transition camera properties instead of regular one's.
		 * @param {boolean|object} [query.visibility=false]      Indicator to retrieve visibility information.
		 * @param {sap.ui.vk.VisibilityMode} [query.visibility.mode=sap.ui.vk.VisibilityMode.Complete]
		 *                                                       Indicator to retrieve the complete visibility definition or just the difference.
		 * @returns {object} JSON-like object which holds the current view information. See {@link sap.ui.vk.Viewport#setViewInfo setViewInfo}.
		 *                   In addition to properties defined in {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} the output from
		 *                   {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} contains camera view and projection matrices
		 * <pre>
		 *   {
		 *     ...
		 *     camera: {
		 *       ...
		 *       matrices: {
		 *         view:       [number, ...],
		 *         projection: [number, ...],
		 *       }
		 *       ...
		 *     },
		 *     ...
		 *   }
		 * </pre>
		 * @public
		 */
		Viewport.prototype.getViewInfo = function(query) {
			var viewInfo = {};

			if (query == null) {
				query = {};
			}

			if (query.camera == null) {
				query.camera = true;
			}

			var nativeCamera = this._camera ? this._camera.getCameraRef() : null;

			if (query.camera && nativeCamera) {
				var rotation = nativeCamera.rotation.clone();
				rotation.reorder("YXZ");

				viewInfo.camera = {
					rotation: {
						yaw:   THREE.Math.radToDeg(rotation.y),
						pitch: THREE.Math.radToDeg(rotation.x),
						roll:  THREE.Math.radToDeg(rotation.z)
					},
					position: {
						x: nativeCamera.position.x,
						y: nativeCamera.position.y,
						z: nativeCamera.position.z
					},
					projectionType: nativeCamera.isOrthographicCamera ? CameraProjectionType.Orthographic : CameraProjectionType.Perspective,
					bindingType: CameraFOVBindingType.Vertical
				};

				if (viewInfo.camera.projectionType === CameraProjectionType.Perspective) {
					viewInfo.camera.fieldOfView = nativeCamera.fov; // perspective camera defines Field of View
				} else if (viewInfo.camera.projectionType === CameraProjectionType.Orthographic) {
					viewInfo.camera.zoomFactor = nativeCamera.zoom; // orthographic defines Zoom Factor
				}

				if (query.camera.matrices) {
					viewInfo.camera.matrices = {
						view: nativeCamera.matrixWorldInverse.elements.slice(),
						projection: nativeCamera.projectionMatrix.elements.slice()
					};
				}
			}

			if (query.visibility && this._viewStateManager) {
				var visibilityMode = query.visibility.mode == null ? VisibilityMode.Complete : query.visibility.mode;
				viewInfo.visibility = {
					mode: visibilityMode
				};
				if (visibilityMode === VisibilityMode.Complete) {
					var allVisibility = this._viewStateManager.getVisibilityComplete();
					viewInfo.visibility.visible = allVisibility.visible;
					viewInfo.visibility.hidden = allVisibility.hidden;
				} else if (this._viewStateManager.getShouldTrackVisibilityChanges()) {
					viewInfo.visibility.changes = this._viewStateManager.getVisibilityChanges();
				} else {
					jQuery.sap.log.warning(getResourceBundle().getText(Messages.VIT32.summary), Messages.VIT32.code, "sap.ui.vk.threejs.Viewport");
				}
			}

			return viewInfo;
		};

		/**
		 * Sets the current scene to use the camera view information acquired from the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
		 * Internally, the <code>setViewInfo</code> method activates certain steps at certain animation times,
		 * and then changes the camera position, rotation and field of view (FOV) / zoom factor.
		 * @param {object}   viewInfo                             A JSON-like object containing view information acquired using
		 *                                                        the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
		 * @param {object}   [viewInfo.camera]                    A JSON-like object containing the camera information.
		 * @param {object}   viewInfo.camera.rotation             Rotation defined in {@link https://en.wikipedia.org/wiki/Aircraft_principal_axes Aircraft principal axes}.
		 * @param {float}    viewInfo.camera.rotation.yaw         Angle around the vertical axis in degrees.
		 * @param {float}    viewInfo.camera.rotation.pitch       Angle around the lateral axis in degrees.
		 * @param {float}    viewInfo.camera.rotation.roll        Angle around the longitudinal axis in degrees.
		 * @param {object}   viewInfo.camera.position             Position defined in 3-dimensional space.
		 * @param {float}    viewInfo.camera.position.x           X coordinate.
		 * @param {float}    viewInfo.camera.position.y           Y coordinate.
		 * @param {float}    viewInfo.camera.position.z           Z coordinate.
		 * @param {sap.ui.vk.CameraFOVBindingType} viewInfo.camera.bindingType Camera field of view binding type.
		 * @param {sap.ui.vk.CameraProjectionType} viewInfo.camera.projectionType Camera projection type.
		 * @param {float}    viewInfo.camera.fieldOfView          Camera field of view in degrees. Applicable only to perspective cameras.
		 * @param {float}    viewInfo.camera.zoomFactor           Camera zoom factor. Applicable only to orthographic cameras.
		 * @param {object}   [viewInfo.animation]                 A JSON-like object containing the animation information.
		 * @param {string}   [viewInfo.animation.stepVeId]        Step VE ID. If it is omitted then procedure and step indices are used.
		 * @param {int}      [viewInfo.animation.procedureIndex]  Procedure index in the list of procedures.
		 * @param {int}      [viewInfo.animation.stepIndex]       Step index in the list of steps in the procedure.
		 * @param {float}    [viewInfo.animation.animationTime=0] Time at which to activate the step.
		 * @param {object}   [viewInfo.visibility]                A JSON-like object containing the visibility information.
		 * @param {sap.ui.vk.VisibilityMode} viewInfo.visibility.mode If the mode equals to {@link sap.ui.vk.VisibilityMode.Complete complete}
		 *                                                        then the visible and hidden fields are defined. If the mode
		 *                                                        equals {@link sap.ui.vk.VisibilityMode.Differences differences} then
		 *                                                        the changes field is defined.
		 * @param {string[]} viewInfo.visibility.visible          List of Ids of visible nodes.
		 * @param {string[]} viewInfo.visibility.hidden           List of Ids of hidden nodes.
		 * @param {string[]} viewInfo.visibility.changes          List of Ids of nodes with inverted visibility.
		 * @param {float}    [flyToDuration=0]                    Fly-to animation duration in seconds.
		 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
		 * @public
		 */
		Viewport.prototype.setViewInfo = function(viewInfo, flyToDuration) {
			var nativeCamera = this._camera ? this._camera.getCameraRef() : null;

			if (viewInfo.camera && nativeCamera) {
				var viCamera = viewInfo.camera;
				var newCamera = viCamera.projectionType === CameraProjectionType.Orthographic ? new THREE.OrthographicCamera() : new THREE.PerspectiveCamera();
				newCamera.userData = nativeCamera.userData;
				newCamera.aspect = nativeCamera.aspect;
				newCamera.position.copy(viCamera.position);
				var rotation = viCamera.rotation;
				newCamera.quaternion.setFromEuler(new THREE.Euler(THREE.Math.degToRad(rotation.pitch), THREE.Math.degToRad(rotation.yaw), THREE.Math.degToRad(rotation.roll), "YXZ"));
				newCamera.fov = viCamera.fieldOfView || newCamera.fov;
				newCamera.zoom = viCamera.zoomFactor || newCamera.zoom;

				this._viewportGestureHandler.activateCamera(newCamera, (flyToDuration || 0) * 1000);
			}

			// restoring the visibility state
			if (viewInfo.visibility) {
				var nodeHierarchy = this._viewStateManager.getNodeHierarchy(),
					veIdToNodeRefMap = new Map(),
					allNodeRefs = nodeHierarchy.findNodesByName();

				allNodeRefs.forEach(function(nodeRef) {
					// create node proxy based on dynamic node reference
					var nodeProxy = nodeHierarchy.createNodeProxy(nodeRef);
					var veId = nodeProxy.getVeId();
					// destroy the node proxy
					nodeHierarchy.destroyNodeProxy(nodeProxy);
					if (veId) {
						// push the ve id to either visible/hidden array
						veIdToNodeRefMap.set(veId, nodeRef);
					}
				});

				switch (viewInfo.visibility.mode) {
					case VisibilityMode.Complete:
						var visibleVeIds = viewInfo.visibility.visible,
							hiddenVeIds = viewInfo.visibility.hidden;

						visibleVeIds.forEach(function(veId) {
							this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), true, false);
						}, this);

						hiddenVeIds.forEach(function(veId) {
							this._viewStateManager.setVisibilityState(veIdToNodeRefMap.get(veId), false, false);
						}, this);
						break;

					case VisibilityMode.Differences:
						this._viewStateManager.resetVisibility();
						viewInfo.visibility.changes.forEach(function(veId) {
							var nodeRef = veIdToNodeRefMap.get(veId);
							// reverting the visibility for this particular node
							if (nodeRef) {
								this._viewStateManager.setVisibilityState(nodeRef, !this._viewStateManager.getVisibilityState(nodeRef), false);
							}
						}, this);
						break;

					default:
						jQuery.sap.log.error(getResourceBundle().getText(Messages.VIT28.summary), Messages.VIT28.code, "sap.ui.vk.threejs.Viewport");
						break;
				}
			}

			return this;
		};

		/**
		 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
		 *
		 * @param {function} command The command to be executed.
		 * @returns {sap.ui.vk.threejs.Viewport} returns this
		 * @public
		 */
		Viewport.prototype.queueCommand = function(command) {
			if (this instanceof Viewport) {
				command();
			}
			return this;
		};

		/**
		 * Gets position and size of the viewport square.
		 * The information can be used for making calculations when restoring Redlining elements.
		 * @returns {object} The information in this object:
		 *   <ul>
		 *     <li><b>left</b> - The x coordinate of the top-left corner of the square.</li>
		 *     <li><b>top</b> - The y coordinate of the top-left corner of the square.</li>
		 *     <li><b>sideLength</b> - The length of the square.</li>
		 *   </ul>
		 * @public
		 */
		Viewport.prototype.getOutputSize = function() {
			var boundingClientRect = this.getDomRef().getBoundingClientRect();
			var viewportWidth = boundingClientRect.width;
			var viewportHeight = boundingClientRect.height;
			var relevantDimension;

			relevantDimension = Math.min(viewportWidth, viewportHeight);

			return {
				 left: (viewportWidth - relevantDimension) / 2,
				 top: (viewportHeight - relevantDimension) / 2,
				 sideLength: relevantDimension
			};
		};

		return Viewport;
});