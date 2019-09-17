/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

/* global escape */

/**
 * Initialization Code and shared classes of library sap.ui.vk.
 *
 * For backward compatibility all enums and standalone functions are pulled in via sap.ui.define in order
 * to be available in legacy applications via sap.ui.vk.*.
 */
sap.ui.define([
	"./NS",
	"./BillboardBorderLineStyle",
	"./BillboardCoordinateSpace",
	"./BillboardHorizontalAlignment",
	"./BillboardStyle",
	"./BillboardTextEncoding",
	"./CameraFOVBindingType",
	"./CameraProjectionType",
	"./ContentResourceSourceCategory",
	"./ContentResourceSourceTypeToCategoryMap",
	"./DetailViewShape",
	"./DetailViewType",
	"./DvlException",
	"./LeaderLineMarkStyle",
	"./MapContainerButtonType",
	"./Redline",
	"./RenderMode",
	"./SelectionMode",
	"./TransformationMatrix",
	"./VisibilityMode",
	"./ZoomTo",
	"./abgrToColor",
	"./colorToABGR",
	"./cssColorToColor",
	"./colorToCSSColor",
	"./getResourceBundle",
	"./utf8ArrayBufferToString",
	"./dvl/GraphicsCoreApi",
	"./dvl/checkResult",
	"./dvl/getJSONObject",
	"./dvl/getPointer",
	"./tools/AxisColours",
	"./tools/CoordinateSystem",
	"./tools/HitTestClickType",
	"./tools/HitTestIdMode",
	"./tools/PredefinedView"
], function(
	NS
) {
	"use strict";

	/**
	 * SAPUI5 library with controls for displaying 3D models.
	 *
	 * @namespace
	 * @name sap.ui.vk
	 * @author SAP SE
	 * @version 1.69.0
	 * @public
	 */

	// Delegate further initialization of this library to the Core.
	sap.ui.getCore().initLibrary({
		name: NS.getName(),
		dependencies: [
			"sap.ui.core"
		],
		interfaces: [
			NS.getName("AuthorizationHandler"),
			NS.getName("DecryptionHandler")
		],
		types: [
			// The `types` list is empty as we put all enums into separate modules. So there is no need
			// list them here, otherwise they will not be available due to how the `types` is processed in
			// the SAPUI core.
		],
		controls: [
			NS.getName("AnimationTimeSlider"),
			NS.getName("ContainerBase"),
			NS.getName("ContainerContent"),
			NS.getName("DrawerToolbar"),
			NS.getName("FlexibleControl"),
			NS.getName("LegendItem"),
			NS.getName("ListPanel"),
			NS.getName("ListPanelStack"),
			NS.getName("MapContainer"),
			NS.getName("NativeViewport"),
			NS.getName("Notifications"),
			NS.getName("Overlay"),
			NS.getName("ProgressIndicator"),
			NS.getName("RedlineDesign"),
			NS.getName("RedlineSurface"),
			NS.getName("SceneTree"),
			NS.getName("StepNavigation"),
			NS.getName("Toolbar"),
			NS.getName("Viewer"),
			NS.getName("ViewGallery"),
			NS.getName("Viewport"),
			NS.getName("ViewportBase"),
			NS.getName("dvl.Viewport"),
			NS.getName("threejs.Viewport"),
			NS.getName("tools.AnchorPointToolGizmo"),
			NS.getName("tools.CrossSectionToolGizmo"),
			NS.getName("tools.Gizmo"),
			NS.getName("tools.MoveToolGizmo"),
			NS.getName("tools.RotateToolGizmo"),
			NS.getName("tools.ScaleToolGizmo"),
			NS.getName("tools.SceneOrientationToolGizmo"),
			NS.getName("tools.TooltipToolGizmo")
		],
		elements: [
			NS.getName("ContentConnector"),
			NS.getName("FlexibleControlLayoutData"),
			NS.getName("OverlayArea"),
			NS.getName("RedlineElement"),
			NS.getName("RedlineElementEllipse"),
			NS.getName("RedlineElementFreehand"),
			NS.getName("RedlineElementLine"),
			NS.getName("RedlineElementRectangle"),
			NS.getName("RedlineElementText"),
			NS.getName("ViewStateManager"),
			NS.getName("ViewStateManagerBase"),
			NS.getName("dvl.ViewStateManager"),
			NS.getName("threejs.NodesTransitionHelper"),
			NS.getName("threejs.ViewStateManager"),
			NS.getName("tools.AnchorPointTool"),
			NS.getName("tools.CrossSectionTool"),
			NS.getName("tools.HitTestTool"),
			NS.getName("tools.MoveTool"),
			NS.getName("tools.RectSelectTool"),
			NS.getName("tools.RotateOrbitTool"),
			NS.getName("tools.RotateTool"),
			NS.getName("tools.RotateTurntableTool"),
			NS.getName("tools.ScaleTool"),
			NS.getName("tools.SceneOrientationTool"),
			NS.getName("tools.Tool"),
			NS.getName("tools.TooltipTool")
		],
		noLibraryCSS: false,
		version: "1.69.0",
		designtime: NS.getPath("designtime/library.designtime")
	});

	var shims = {};
	shims[NS.getPath("threejs/thirdparty/three")] = {
		exports: "THREE",
		amd: true
	};
	shims[NS.getPath("ve/thirdparty/html2canvas")] = {
		exports: "html2canvas",
		amd: true
	};
	shims[NS.getPath("threejs/thirdparty/totara")] = {
		exports: "Totara",
		amd: true
	};

	sap.ui.loader.config({ shim: shims });

	// sap.ui.getCore().initLibrary() creates lazy stubs for controls and elements.
	// Create lazy stubs for non-Element-derived classes or extend Element-derived classed with static methods.
	var lazy = function(localClassName, staticMethods) {
		var methods = "new extend getMetadata";
		if (staticMethods) {
			methods += " " + staticMethods;
		}
		sap.ui.lazyRequire(NS.getName(localClassName), methods);
	};
	lazy("AnimationPlayback");
	lazy("AnimationSequence");
	lazy("BaseNodeProxy");
	lazy("Camera");
	lazy("ContentConnector", "registerSourceType"); // extend the lazy stub with the static method
	lazy("ContentManager");
	lazy("ContentResource");
	lazy("Core");
	lazy("DownloadManager");
	lazy("ImageContentManager");
	lazy("LayerProxy");
	lazy("Loco");
	lazy("Material");
	lazy("NodeHierarchy");
	lazy("NodeProxy");
	lazy("OrthographicCamera");
	lazy("PerspectiveCamera");
	lazy("RedlineDesignHandler");
	lazy("RedlineGesturesHandler");
	lazy("Scene");
	lazy("Smart2DHandler");
	lazy("Texture");
	lazy("View");
	lazy("ViewportHandler");
	lazy("dvl.BaseNodeProxy");
	lazy("dvl.ContentManager", "getRuntimeSettings setRuntimeSettings getWebGLContextAttributes setWebGLContextAttributes getDecryptionHandler setDecryptionHandler");
	lazy("dvl.GraphicsCore");
	lazy("dvl.LayerProxy");
	lazy("dvl.NodeHierarchy");
	lazy("dvl.NodeProxy");
	lazy("dvl.Scene");
	lazy("helpers.RotateOrbitHelperDvl");
	lazy("helpers.RotateOrbitHelperThree");
	lazy("helpers.RotateTurntableHelperDvl");
	lazy("helpers.RotateTurntableHelperThree");
	lazy("threejs.AnimationSequence");
	lazy("threejs.BaseNodeProxy");
	lazy("threejs.Billboard");
	lazy("threejs.Callout");
	lazy("threejs.ContentDeliveryService");
	lazy("threejs.ContentManager", "registerLoader");
	lazy("threejs.DetailView");
	lazy("threejs.LayerProxy");
	lazy("threejs.Material");
	lazy("threejs.NodeHierarchy");
	lazy("threejs.NodeProxy");
	lazy("threejs.OrthographicCamera");
	lazy("threejs.PerspectiveCamera");
	lazy("threejs.Scene");
	lazy("threejs.Texture");
	lazy("threejs.Thrustline");
	lazy("threejs.ViewportGestureHandler");
	lazy("tools.AnchorPointToolHandler");
	lazy("tools.CrossSectionToolHandler");
	lazy("tools.HitTestToolHandler");
	lazy("tools.MoveToolHandler");
	lazy("tools.RectSelectToolHandler");
	lazy("tools.RotateToolHandler");
	lazy("tools.ScaleToolHandler");
	lazy("tools.TooltipToolHandler");

	return NS.getObject();
});
