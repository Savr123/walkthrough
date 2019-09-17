/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.HorizontalLayout.
sap.ui.define(['sap/ui/core/Control', './library', "./HorizontalLayoutRenderer"],
	function(Control, library, HorizontalLayoutRenderer) {
	"use strict";



	/**
	 * Constructor for a new HorizontalLayout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A layout that provides support for horizontal alignment of controls
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.69.1
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.HorizontalLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HorizontalLayout = Control.extend("sap.ui.layout.HorizontalLayout", /** @lends sap.ui.layout.HorizontalLayout.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * Specifies whether the content inside the Layout shall be line-wrapped in the case that there is less horizontal space available than required.
			 */
			allowWrapping : {type : "boolean", group : "Misc", defaultValue : false}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * The controls inside this layout
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		},
		designtime: "sap/ui/layout/designtime/HorizontalLayout.designtime",
		dnd: { draggable: false, droppable: true }
	}});

	/**
	 * @see sap.ui.core.Control#getAccessibilityInfo
	 * @returns {object} Current accessibility state of the control
	 * @protected
	 */
	HorizontalLayout.prototype.getAccessibilityInfo = function() {
		return {children: this.getContent()};

	};

	return HorizontalLayout;

});
