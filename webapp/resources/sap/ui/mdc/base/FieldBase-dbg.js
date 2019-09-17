/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/thirdparty/jquery',
	'sap/ui/Device',
	'sap/ui/mdc/library',
	'./FieldBaseRenderer',
	'./FilterOperatorConfig',
	'./Condition',
	'./type/ConditionType',
	'./type/ConditionsType',
	'sap/ui/core/library',
	'sap/ui/core/Control',
	'sap/ui/core/message/MessageMixin',
	'sap/base/util/ObjectPath',
	'sap/base/util/deepEqual',
	'sap/base/util/merge',
	'sap/base/Log',
	'sap/base/util/isEmptyObject',
	'sap/ui/dom/containsOrEquals',
	'sap/ui/model/Filter',
	'sap/ui/model/base/ManagedObjectModel',
	'sap/ui/base/ManagedObjectObserver',
	"sap/ui/base/SyncPromise",
	'sap/ui/events/KeyCodes'
], function(
	jQuery,
	Device,
	library,
	FieldBaseRenderer,
	FilterOperatorConfig,
	Condition,
	ConditionType,
	ConditionsType,
	coreLibrary,
	Control,
	MessageMixin,
	ObjectPath,
	deepEqual,
	merge,
	Log,
	isEmptyObject,
	containsOrEquals,
	Filter,
	ManagedObjectModel,
	ManagedObjectObserver,
	SyncPromise,
	KeyCodes
) {
	"use strict";

	var EditMode = library.EditMode;
	var FieldDisplay = library.FieldDisplay;
	var ValueState = coreLibrary.ValueState;
	var CalendarType = coreLibrary.CalendarType;

	/**
	 * Constructor for a new FieldBase.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A FieldBase is the basic control to be used in Field and FilterField.
	 *
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.IFormContent
	 *
	 * @author SAP SE
	 * @version 1.69.1
	 *
	 * @constructor
	 * @alias sap.ui.mdc.base.FieldBase
	 * @author SAP SE
	 * @version 1.69.1
	 * @since 1.58.0
	 * @abstract
	 *
	 * @private
	 * @experimental
	 */
	var FieldBase = Control.extend("sap.ui.mdc.base.FieldBase", /* @lends sap.ui.mdc.base.FieldBase.prototype */ {
		metadata: {
			interfaces: ["sap.ui.core.IFormContent"],
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The type of the data handles by the field. this type is used to parse, format and validate the value.
				 */
				dataType: {
					type: "string",
					group: "Data",
					defaultValue: 'sap.ui.model.type.String'
				},

				/**
				 * The constraints of the type specified in <code>dataType</code>
				 */
				dataTypeConstraints: {
					type: "object",
					group: "Data",
					defaultValue: null
				},

				/**
				 * The format options of the type specified in <code>dataType</code>
				 */
				dataTypeFormatOptions: {
					type: "object",
					group: "Data",
					defaultValue: null
				},

				/**
				 * Whether the field is editable, read-only or disabled.
				 */
				editMode: {
					type: "sap.ui.mdc.EditMode",
					group: "Data",
					defaultValue: EditMode.Editable
				},

				/**
				 * Indicates that user input is required.
				 */
				required: {
					type: "boolean",
					group: "Data",
					defaultValue: false
				},

//				/**
//				 * Icon to be displayed as graphical element before the field.
//				 * This can be an image or an icon from the icon font.
//				 */
//				icon: {
//					type: "sap.ui.core.URI",
//					group: "Appearance",
//					defaultValue: null
//				},

				/**
				 * Defines whether the value and/or description of the field is shown and in what order it is shown.
				 */
				display: {
					type: "sap.ui.mdc.FieldDisplay",
					defaultValue: FieldDisplay.Value
				},

				/**
				 * Defines the horizontal alignment of the text that is shown inside the input field.
				 */
				textAlign: {
					type: "sap.ui.core.TextAlign",
					group: "Appearance",
					defaultValue: sap.ui.core.TextAlign.Initial
				},

				/**
				 * Defines the text directionality of the input field, e.g. <code>RTL</code>, <code>LTR</code>
				 */
				textDirection: {
					type: "sap.ui.core.TextDirection",
					group: "Appearance",
					defaultValue: sap.ui.core.TextDirection.Inherit
				},

				/**
				 * Defines a short hint intended to aid the user with data entry when the control has no value.
				 * If the value is null no placeholder is shown.
				 */
				placeholder: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Visualizes the validation state of the control, e.g. <code>Error</code>, <code>Warning</code>, <code>Success</code>.
				 *
				 * <b>Note:</b> The visualization of the ValueState is done by the inner rendered control.
				 * If a control is set ( using content, contentEdit or contentDisplay) the control needs to support
				 * valueState behavior, otherwise the valueState is not visualized.
				 */
				valueState: {
					type: "sap.ui.core.ValueState",
					group: "Appearance",
					defaultValue: sap.ui.core.ValueState.None
				},

				/**
				 * Defines the text that appears in the value state message pop-up. If this is not specified, a default text is shown from the resource bundle.
				 */
				valueStateText: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Defines the width of the control.
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: null
				},

				/**
				 * If set, the <code>Field</code> is rendered using a multi line control.
				 *
				 * This property has only effect on type supporting multiple lines
				 */
				multipleLines: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				},

				/**
				 * Sets the maximum amount of conditions that are allowed for this field.
				 *
				 * The default value of -1 indicates that an unlimited amount of conditions can defined.
				 */
				maxConditions: {
					type: "int",
					group: "Behavior",
					defaultValue: -1
				},

				/**
				 * Sets the conditions that represents the values of the field
				 *
				 * This should be bound to a ConditionModel using the fieldPath
				 */
				conditions: {
					type: "object[]",
					group: "Data",
					defaultValue: [],
					byValue: true
				},

				/**
				 * Sets the label text for the field.
				 *
				 * This can be used by FilterBar or Form to create a Label control for the field.
				 *
				 * @experimental
				 * @since 1.62.0 Disclaimer: this property is in a beta state - incompatible API changes may be done before its official public release. Use at your own discretion.
				 */
				label: {
					type: "string",
					group: "Misc",
					defaultValue: ""
				},

				/**
				 * Internal property to bind the <code>showValueHelp</code> property of the internal <code>Input</code> control.
				 */
				_fieldHelpEnabled: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false,
					visibility: "hidden"
				},

				/**
				 * If set only EEQ (strict equal) is allowed as operator for conditions. This is the <code>Field</code> use case.
				 */
				_onlyEEQ: { // TODO: better logic
					type: "boolean",
					group: "Appearance",
					defaultValue: false,
					visibility: "hidden"
				}

			},
			aggregations: {
				/**
				 * optional content to rendered
				 *
				 * <b>Note:</b> Bind the value holding property of the control to '$field>/conditions'
				 * using <code>sap.ui.mdc.base.type.ConditionsType</code> as type.
				 *
				 * If the control should show multiple conditions bind it's aggregation to '$field>/conditions'.
				 * The item controls value property bind using <code>sap.ui.mdc.base.type.ConditionType</code> as type.
				 *
				 * <b>Warning:</b> Only controls allowed in a form are allowed.
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: false
				},

				/**
				 * optional content to be rendered if the <code>editMode</code> property is not set to <code>Display</code>.
				 *
				 * <b>Note:</b> If a control is assigned to the <code>content</code> aggregation this one is ignored.
				 *
				 * <b>Note:</b> Bind the value holding property of the control to '$field>/conditions'
				 * using <code>sap.ui.mdc.base.type.ConditionsType</code> as type.
				 *
				 * If the control should show multiple conditions bind it's aggregation to '$field>/conditions'.
				 * The item controls value property bind using <code>sap.ui.mdc.base.type.ConditionType</code> as type.
				 *
				 * <b>Warning:</b> Only controls allowed in a form are allowed.
				 *
				 * @since 1.61.0
				 */
				contentEdit: {
					type: "sap.ui.core.Control",
					multiple: false
				},

				/**
				 * optional content to be rendered  if the <code>editMode</code> property is set to <code>Display</code>.
				 *
				 * <b>Note:</b> If a control is assigned to the <code>content</code> aggregation this one is ignored.
				 *
				 * <b>Note:</b> Bind the value holding property of the control to '$field>/conditions'
				 * using <code>sap.ui.mdc.base.type.ConditionsType</code> as type.
				 *
				 * If the control should show multiple conditions bind it's aggregation to '$field>/conditions'.
				 * The item controls value property bind using <code>sap.ui.mdc.base.type.ConditionType</code> as type.
				 *
				 * <b>Warning:</b> Only controls allowed in a form are allowed.
				 *
				 * @since 1.61.0
				 */
				contentDisplay: {
					type: "sap.ui.core.Control",
					multiple: false
				},

				/**
				 * internal content if no control given
				 */
				_content: {
					type: "sap.ui.core.Control",
					multiple: true,
					visibility: "hidden"
				},

				/**
				 * optional FieldInfo, used for detail information. This is only active in display mode
				 *
				 * <b>Note:</b> If a special data type is defined or a content control is set this will be ignored.
				 */
				fieldInfo: {
					type: "sap.ui.mdc.base.FieldInfoBase",
					multiple: false
				}
			},
			associations: {
				/**
				 * optional FieldHelp.
				 *
				 * This is an association to allow the usage of one <code>FieldHelp</code> instance on multiple fields
				 */
				fieldHelp: {
					type: "sap.ui.mdc.base.FieldHelpBase",
					multiple: false
				},

				/**
				 * Association to controls / IDs that label this control (see WAI-ARIA attribute aria-labelledby).
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			events: {
				/**
				 * This event is fired when the value of the field is changed - e.g. at each keypress
				 *
				 * <b>Note</b> This event is only triggered if the used content control has a liveChange event
				 */
				liveChange : {
					parameters : {
						/**
						 * The new value of the input.
						 */
						value : {type : "string"},

						/**
						 * Indicate that ESC key triggered the event.
						 */
						escPressed : {type : "boolean"},

						/**
						 * The value of the input before pressing ESC key.
						 */
						previousValue : {type : "string"}
					}
				},
				/**
				 * Fired if the inner control has a press event and this is fired
				 */
				press: {}
			},
			publicMethods: [],
			defaultAggregation: "content"
		},
		_oManagedObjectModel: null
	});

	// apply the message mixin so all message on the input will get the associated label-texts injected
	MessageMixin.call(FieldBase.prototype);

	var mControlTypes = {
			"default": {
				edit: "sap/m/Input",
				editMulti: ["sap/m/MultiInput", "sap/m/Token"],
				editMultiLine: "sap/m/TextArea",
				display: "sap/m/Text",
				createEdit: _createInputControl,
				createEditMulti: _createMultiInputControl,
				createEditMultiLine: _createTextAreaControl,
				createDisplay: _createTextControl
			},
			search: {
				edit: "sap/m/SearchField",
				//editMulti: "sap/m/SearchField", // not used
				display: "sap/m/Text",
				createEdit: _createSearchField,
				//createEditMulti: _createSearchField, // not used
				createDisplay: _createTextControl
			},
			date: {
				edit: "sap/m/DatePicker",
				editMulti: ["sap/m/MultiInput", "sap/m/Token"], // FieldHelp needed to enter date
				display: "sap/m/Text",
				createEdit: _createDatePickerControl,
				createEditMulti: _createMultiInputControl, // FieldHelp needed to enter date
				createDisplay: _createTextControl
			},
			time: {
				edit: "sap/m/TimePicker",
				editMulti: ["sap/m/MultiInput", "sap/m/Token"], // FieldHelp needed to enter date
				display: "sap/m/Text",
				createEdit: _createDatePickerControl, // as same API as DatePicker
				createEditMulti: _createMultiInputControl, // FieldHelp needed to enter date
				createDisplay: _createTextControl
			},
			dateTime: {
				edit: "sap/m/DateTimePicker",
				editMulti: ["sap/m/MultiInput", "sap/m/Token"], // FieldHelp needed to enter date
				display: "sap/m/Text",
				createEdit: _createDatePickerControl, // as same API as DatePicker
				createEditMulti: _createMultiInputControl, // FieldHelp needed to enter date
				createDisplay: _createTextControl
			},
			link: {
				edit: "sap/m/Input",
				editMulti: ["sap/m/MultiInput", "sap/m/Token"],
				editMultiLine: "sap/m/TextArea",
				display: "sap/m/Link",
				createEdit: _createInputControl,
				createEditMulti: _createMultiInputControl,
				createEditMultiLine: _createTextAreaControl,
				createDisplay: _createLinkControl
			},
			bool: {
				edit: "sap/m/Input",
				display: "sap/m/Text",
				createEdit: _createBoolInputControl,
				createDisplay: _createTextControl
			},
			unit: {
				edit: "sap/m/Input",
				editMulti: ["sap/m/MultiInput", "sap/m/Input", "sap/m/Token"],
				display: "sap/m/Text",
				createEdit: _createUnitInputControls,
				createEditMulti: _createUnitMultiInputControls,
				createDisplay: _createTextControl
			}
	};

	var mControls = {};

	var mDefaultHelps = {
			bool: {
				name: "sap/ui/mdc/base/BoolFieldHelp",
				id: "BoolDefaultHelp",
				control: undefined
			}
	};

	FieldBase.prototype.init = function() {

		this._oManagedObjectModel = new ManagedObjectModel(this);

		this._oObserver = new ManagedObjectObserver(this._observeChanges.bind(this));

		this._oObserver.observe(this, {
			properties: ["display", "editMode", "dataType", "dataTypeFormatOptions", "dataTypeConstraints",
			             "multipleLines", "maxConditions", "conditions", "_onlyEEQ"],
			aggregations: ["fieldInfo", "content", "contentEdit", "contentDisplay"],
			associations: ["fieldHelp"]
		});

		this._oDatePickerRequested = {};

		this.attachEvent("modelContextChange", this._handleModelContextChange, this);

		this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

		this._aAsyncChanges = [];

	};

	FieldBase.prototype.exit = function() {

		var oFieldInfo = this.getFieldInfo();
		if (oFieldInfo) {
			// as aggregations are destroyed after exit
			oFieldInfo.detachEvent("dataUpdate", _handleInfoDataUpdate, this);
		}

		var oContent = this.getContent();
		if (oContent) {
			_detachContentHandlers.call(this, oContent);
		}
		var oContentEdit = this.getContentEdit();
		if (oContentEdit) {
			_detachContentHandlers.call(this, oContentEdit);
		}
		var oContentDisplay = this.getContentDisplay();
		if (oContentDisplay) {
			_detachContentHandlers.call(this, oContentDisplay);
		}

		this._oManagedObjectModel.destroy();
		delete this._oManagedObjectModel;

		this._oObserver.disconnect();
		this._oObserver = undefined;

		if (this._oFilterOperatorConfig) {
			this._oFilterOperatorConfig.destroy();
			delete this._oFilterOperatorConfig;
		}

		if (this._oConditionType) {
			this._oConditionType.destroy();
			this._oConditionType = undefined;
		}

		if (this._oConditionsType) {
			this._oConditionsType.destroy();
			this._oConditionsType = undefined;
		}

		var oConditionModel = _getConditionModel.call(this);
		if (oConditionModel) {
			oConditionModel.removeFilterField(this);
		}

		var oFieldHelp = _getFieldHelp.call(this);
		if (oFieldHelp) {
			oFieldHelp.detachEvent("dataUpdate", _handleHelpDataUpdate, this);
			if (this._bConnected) {
				_handleDisconnect.call(this); // remove event listeners
				oFieldHelp.connect(); // disconnect FieldHelp to remove callbacks
			}
		}

		if (this.iLiveChangeTimer) {
			// do not trigger async suggestion
			clearTimeout(this.iLiveChangeTimer);
		}

	};

	FieldBase.prototype.onBeforeRendering = function() {

		_createInternalContent.call(this);

	};

	FieldBase.prototype.onAfterRendering = function() {

// TODO: what if only Input re-renders, but not Field
		if (_getFieldHelp.call(this) && this.getEditMode() != EditMode.Display) {
			// disable browsers autocomplete if field help is available
			var aContent = this.getAggregation("_content", []);
			for (var i = 0; i < aContent.length; i++) {
				var oContent = aContent[i];
				var oDomRef = oContent.getFocusDomRef();
				jQuery(oDomRef).attr("autocomplete", "off");
			}
		}

	};

	FieldBase.prototype.onfocusin = function(oEvent) {

		_connectFieldhelp.call(this);

	};

	FieldBase.prototype.onsapup = function(oEvent) {

		var oFieldHelp = _getFieldHelp.call(this);
		var oSource = oEvent.srcControl;

		if (oFieldHelp && (!this._bIsMeasure || oSource.getShowValueHelp())) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			oFieldHelp.navigate(-1);
		}

	};

	FieldBase.prototype.onsapdown = function(oEvent) {

		var oFieldHelp = _getFieldHelp.call(this);
		var oSource = oEvent.srcControl;

		if (oFieldHelp && (!this._bIsMeasure || oSource.getShowValueHelp())) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
			oFieldHelp.navigate(1);
		}

	};

	FieldBase.prototype.clone = function(sIdSuffix, aLocalIds) {

		// detach event handler before cloning to not have it twice on the clone
		// attach it after clone again
		this.detachEvent("modelContextChange", this._handleModelContextChange, this);

		var oContent = this.getContent();
		if (oContent) {
			_detachContentHandlers.call(this, oContent);
		}
		var oContentEdit = this.getContentEdit();
		if (oContentEdit) {
			_detachContentHandlers.call(this, oContentEdit);
		}
		var oContentDisplay = this.getContentDisplay();
		if (oContentDisplay) {
			_detachContentHandlers.call(this, oContentDisplay);
		}

		var oFieldInfo = this.getFieldInfo();
		if (oFieldInfo) {
			oFieldInfo.detachEvent("dataUpdate", _handleInfoDataUpdate, this);
		}

		var oClone = Control.prototype.clone.apply(this, arguments);

		this.attachEvent("modelContextChange", this._handleModelContextChange, this);

		if (oContent) {
			_attachContentHandlers.call(this, oContent);
		}
		if (oContentEdit) {
			_attachContentHandlers.call(this, oContentEdit);
		}
		if (oContentDisplay) {
			_attachContentHandlers.call(this, oContentDisplay);
		}

		if (oFieldInfo) {
			oFieldInfo.attachEvent("dataUpdate", _handleInfoDataUpdate, this);
		}

		return oClone;

	};

	/**
	 * Gets <code>fieldPath</code>.
	 *
	 * If the conditions are bound to a ConditionModel the FieldPath is determined from this binding
	 *
	 * @return {string} fieldPath of the field
	 * @private
	 */
	FieldBase.prototype.getFieldPath = function() {

		var sBindingPath = this.getBindingPath("conditions");
		if (sBindingPath && sBindingPath.startsWith("/conditions/")) {
			return sBindingPath.slice(12);
		} else {
			return "";
		}

	};

	function _triggerChange(aConditions, bValid, vWrongValue, oPromise) {

		if (!oPromise) {
			// not promise -> change is synchronously -> return resolved SyncPromise
			if (bValid) {
				oPromise = Promise.resolve(this._getResultForPromise(aConditions));
			} else {
				oPromise = Promise.reject(vWrongValue);
			}
		}

		this._fireChange(aConditions, bValid, vWrongValue, oPromise);

	}

	FieldBase.prototype._fireChange = function(aConditions, bValid, vWrongValue, oPromise) {
		// to be implemented by Filed and FilterField
	};

	FieldBase.mapEdmTypes = {
			"Edm.Boolean": "sap.ui.model.odata.type.Boolean",
			"Edm.Byte": "sap.ui.model.odata.type.Byte",
			"Edm.Date": "sap.ui.model.odata.type.Date", // V4 Date
			"Edm.DateTime": "sap.ui.model.odata.type.DateTime", // only for V2  constraints: {displayFormat: 'Date' }
			"Edm.DateTimeOffset": "sap.ui.model.odata.type.DateTimeOffset", //constraints: { V4: true, precision: n }
			"Edm.Decimal": "sap.ui.model.odata.type.Decimal", //constraints: { precision, scale, minimum, maximum, minimumExclusive, maximumExclusive}
			"Edm.Double": "sap.ui.model.odata.type.Double",
			"Edm.Float": "sap.ui.model.odata.type.Single",
			"Edm.Guid": "sap.ui.model.odata.type.Guid",
			"Edm.Int16": "sap.ui.model.odata.type.Int16",
			"Edm.Int32": "sap.ui.model.odata.type.Int32",
			"Edm.Int64": "sap.ui.model.odata.type.Int64",
			//Edm.Raw not supported
			"Edm.SByte": "sap.ui.model.odata.type.SByte",
			"Edm.Single": "sap.ui.model.odata.type.Single",
			"Edm.String": "sap.ui.model.odata.type.String", //constraints: {maxLength, isDigitSequence}
			"Edm.Time": "sap.ui.model.odata.type.Time", // only V2
			"Edm.TimeOfDay": "sap.ui.model.odata.type.TimeOfDay" // V4 constraints: {precision}
	};

	function _createDataType(sType) {

		var oTypeClass = _getDataTypeClass.call(this, sType);

		if (oTypeClass) {
			return new oTypeClass(_getDataTypeFormatOptionsForCreate.call(this, sType, this.getDataTypeFormatOptions(), this.getDataTypeConstraints()), this.getDataTypeConstraints());
		} else {
			return null;
		}

	}

	function _getDataTypeClass(sType) {

		var oTypeClass;

		while (!oTypeClass) {
			oTypeClass = ObjectPath.get(sType || "");
			if (!oTypeClass) {
				sType = FieldBase.mapEdmTypes[sType];
				if (!sType) {
					break;
				}
			}
		}

		return oTypeClass;

	}

	function _getDataType() {

		if (!this._oDataType) {
			this._oDataType = this.getDataType();
			if (typeof this._oDataType === "string") {
				this._oDataType = _createDataType.call(this, this._oDataType);
			}
		}
		return this._oDataType;

	}

	// to be enhanced by Field
	FieldBase.prototype._initDataType = function() {

		if (this._oDataType) {
			this._oDataType.destroy();
			this._oDataType = undefined;
		}

		if (this._oDateOriginalType) {
			this._oDateOriginalType.destroy();
			this._oDateOriginalType = undefined;
		}

		if (this._oUnitOriginalType) {
			this._oUnitOriginalType.destroy();
			this._oUnitOriginalType = undefined;
		}

		delete this._sDisplayFormat;
		delete this._sValueFormat;
		delete this._sCalendarType;

	};

	// TODO: better API to provide data type for field help
	FieldBase.prototype._getDataType = function() {
		return _getDataType.call(this);
	};

	function _getDataTypeName() {

		if (this._oDataType && typeof this._oDataType === "object") {
			return this._oDataType.getMetadata().getName();
		} else {
			return this.getDataType();
		}

	}

	function _getDataTypeConstraints() {

		if (this._oDataType && typeof this._oDataType === "object" && this._oDataType.oConstraints) {
			return this._oDataType.oConstraints;
		} else {
			return this.getDataTypeConstraints();
		}

	}

	function _getDataTypeFormatOptions() {

		if (this._oDataType && typeof this._oDataType === "object" && this._oDataType.oFormatOptions) {
			return this._oDataType.oFormatOptions;
		} else {
			return this.getDataTypeFormatOptions();
		}

	}

	/*
	 * To avoid data loss for DatePicker (e.G. in short Year number foe 1918) use ISO format as ValueFormat in DatePickers
	 */
	function _getDataTypeFormatOptionsForCreate(sType, oFormatOptions, oConstraints) {

		if (this.getMaxConditions() !== 1 || this.getEditMode() === EditMode.Display) {
			// only in DatePicker case. TODO: better logic
			return oFormatOptions;
		}

		switch (sType) {
		case "Edm.Date":
		case "sap.ui.model.type.Date":
		case "sap.ui.model.odata.type.Date":
			this._sValueFormat = "yyyy-MM-dd";
			break;

		case "Edm.DateTime":
		case "sap.ui.model.odata.type.DateTime":
			if (oConstraints && (oConstraints.displayFormat === "Date" || oConstraints.isDateOnly)) {
				this._sValueFormat = "yyyy-MM-dd";
			} else {
				this._sValueFormat = "yyyy-MM-dd'T'HH:mm:ss";
			}
			break;

		case "Edm.DateTimeOffset":
		case "sap.ui.model.type.DateTime":
		case "sap.ui.model.odata.type.DateTimeOffset":
			this._sValueFormat = "yyyy-MM-dd'T'HH:mm:ss";
			break;

		case "Edm.TimeOfDay":
		case "sap.ui.model.type.Time":
		case "sap.ui.model.odata.type.TimeOfDay":
			this._sValueFormat = "HH:mm:ss";
			break;

		default:

			return oFormatOptions;
		}

		this._sDisplayFormat = "medium";
		if (oFormatOptions) {
			oFormatOptions = merge({}, oFormatOptions); // do not manipulate original object
			if (oFormatOptions.style) {
				this._sDisplayFormat = oFormatOptions.style;
				delete oFormatOptions.style;
			} else if (oFormatOptions.pattern) {
				this._sDisplayFormat = oFormatOptions.pattern;
			}
			if (oFormatOptions.calendarType) {
				this._sCalendarType = oFormatOptions.calendarType;
			}
			oFormatOptions.pattern = this._sValueFormat;
			oFormatOptions.calendarType = CalendarType.Gregorian;
		} else {
			oFormatOptions = {pattern: this._sValueFormat, calendarType: CalendarType.Gregorian};
		}
		return oFormatOptions;

	}

	function _adjustDataTypeForDate() {

		var oType = _getDataType.call(this);
		var sName = oType.getMetadata().getName();
		var oFormatOptions = oType.oFormatOptions;
		var oConstraints = oType.oConstraints;

		// if type is used from binding (Field) or format options are not set correctly -> create new type
		if (!oFormatOptions || oFormatOptions.style ||
				!oFormatOptions.pattern || oFormatOptions.pattern !== this._sValueFormat ||
				!oFormatOptions.calendarType || oFormatOptions.calendarType !== CalendarType.Gregorian) {
			if (oConstraints && oConstraints.isDateOnly) {
				// TODO, better solution for sap.ui.model.odata.type.Date
				oConstraints = merge({}, oConstraints); // do not manipulate original object
				delete oConstraints.isDateOnly;
				oConstraints.displayFormat = "Date";
			}
			var oTypeClass = ObjectPath.get(sName);
			this._oDateOriginalType = this._oDataType;
			this._oDataType = new oTypeClass(_getDataTypeFormatOptionsForCreate.call(this, sName, oFormatOptions, oConstraints), oConstraints);
			_updateConditionType.call(this);
		}

	}

	function _adjustDataTypeForUnit() {

		var oType = _getDataType.call(this);
		var sName = oType.getMetadata().getName();
		var oFormatOptions = oType.oFormatOptions;
		var oConstraints = isEmptyObject(oType.oConstraints) ? undefined : oType.oConstraints;

		// if type is used from binding (Field) or format options are not set correctly -> create new type
		if (!oFormatOptions || !oFormatOptions.hasOwnProperty("showMeasure") || oFormatOptions.showMeasure) {
			oFormatOptions = merge({}, oFormatOptions); // do not manipulate original object
			oFormatOptions.showMeasure = false;
			if (oFormatOptions.customCurrencies) {
				delete oFormatOptions.customCurrencies; // cannot be set from outside
			}
			if (oFormatOptions.customUnits) {
				delete oFormatOptions.customUnits; // cannot be set from outside
			}
			var oTypeClass = ObjectPath.get(sName);
			this._oUnitOriginalType = this._oDataType;
			this._oDataType = new oTypeClass(oFormatOptions, oConstraints);
			_updateConditionType.call(this);
		}

	}

	function _handleConditionsChange(aConditions, aConditionsOld) {

		var oFieldHelp = _getFieldHelp.call(this);

		if (oFieldHelp && this._bConnected) {
			_setConditionsOnFieldHelp.call(this, aConditions, oFieldHelp);
		}

	}

	FieldBase.prototype._getContent = function() {

		var oContent = this.getContent();

		if (!oContent) {
			if (this.getEditMode() === EditMode.Display) {
				oContent = this.getContentDisplay();
			} else {
				oContent = this.getContentEdit();
			}
		}

		if (oContent) {
			return [oContent];
		} else {
			return this.getAggregation("_content", []);
		}

	};

	function _getEditable(sEditMode) {

		if (sEditMode && sEditMode === EditMode.Editable) {
			return true;
		} else {
			return false;
		}

	}

	function _getEnabled(sEditMode) {

		if (sEditMode && sEditMode !== EditMode.Disabled) {
			return true;
		} else {
			return false;
		}

	}

	function _getDisplayOnly(sEditMode) {

		if (sEditMode && sEditMode !== EditMode.Editable) {
			return true;
		} else {
			return false;
		}

	}

	function _getOnlyEEQ() {

		var sDataType = _getDataTypeName.call(this);

		if (sDataType === "Edm.Boolean" || sDataType === "sap.ui.model.type.Boolean" ||
				sDataType === "sap.ui.model.odata.type.Boolean" || sDataType === "sap.ui.mdc.base.type.Boolean") {
			return true;
		} else {
			return this.getProperty("_onlyEEQ");
		}

	}

	// TODO: better logic to tell FieldValueHelp to hide DefineConditions
	FieldBase.prototype._getOnlyEEQ = function() {

		return _getOnlyEEQ.call(this);

	};

	FieldBase.prototype._handleModelContextChange = function(oEvent) {

		if (!this._bFFAdded) {
			var oConditionModel = _getConditionModel.call(this);
			if (oConditionModel) {
				oConditionModel.addFilterField(this);
				this._bFFAdded = true;
			}
		}

	};

	// TODO: at the End we should not need a ConditionModel - all functions should be available outside
	function _getConditionModel() {

		var oBinding = this.getBinding("conditions");
		if (oBinding) {
			var oModel = oBinding.getModel();
			if (oModel.isA("sap.ui.mdc.base.ConditionModel")) {
				return oModel;
			}
		}

		return undefined;

	}

	FieldBase.prototype._getFilterOperatorConfig = function() {

		var oConditionModel = _getConditionModel.call(this);

		if (oConditionModel) {
			return oConditionModel.getFilterOperatorConfig();
		} else if (this._oFilterOperatorConfig) {
			return this._oFilterOperatorConfig;
		} else {
			this._oFilterOperatorConfig = FilterOperatorConfig.getFor(); // TODO: pass somehow model of Field?
			return this._oFilterOperatorConfig;
		}

	};

	function _setUIMessage(sMsg) {
		var oConditionModel = _getConditionModel.call(this);
		if (oConditionModel) {
			oConditionModel.setUIMessage(this.getFieldPath(), sMsg);
		} else {
			this.setValueState(ValueState.Error);
			this.setValueStateText(sMsg);
		}
	}

	function _removeUIMessage() {
		var oConditionModel = _getConditionModel.call(this);
		if (oConditionModel) {
			oConditionModel.removeUIMessage(this.getFieldPath());
		} else {
			this.setValueState(ValueState.None);
			this.setValueStateText();
		}
	}

	/**
	 * Observes changes
	 *
	 * to be enhanced by Field, FilterField...
	 *
	 * @param {object} oChanges Changes
	 * @protected
	 */
	FieldBase.prototype._observeChanges = function(oChanges) {

		if (oChanges.name === "editMode") {
			if (this.getAggregation("_content")) {
				_createInternalContent.call(this);
			}
		}

		if (oChanges.name === "multipleLines") {
			if (this.getAggregation("_content")) {
				_createInternalContent.call(this);
			}
		}

		if (oChanges.name === "dataType") {
			// check only if different type (in Field type might be already taken from biding)
			if (this._oDataType) {
				var oTypeClass = _getDataTypeClass.call(this, oChanges.current);
				if (!(this._oDataType instanceof oTypeClass)) {
					// TODO: also compare FormatOptions and Constraints
					this._initDataType();
					this.destroyAggregation("_content");
					_updateConditionType.call(this);
				}

			}
		}

		if (oChanges.name === "dataTypeFormatOptions" || oChanges.name === "dataTypeConstraints") {
			// if type is not created right now nothing to do
			if (this._oDataType) {
				this._oDataType.destroy();
				this._oDataType = undefined;
				delete this._sDisplayFormat;
				delete this._sValueFormat;
				delete this._sCalendarType;
				this.destroyAggregation("_content");
				_updateConditionType.call(this);
			}
		}

		if (oChanges.name === "maxConditions") {
			if (this.getAggregation("_content")) {
				_createInternalContent.call(this);
			}
			_updateConditionType.call(this);
		}

		if (oChanges.name === "conditions") {
			this._bParseError = false; // if conditions updated from outside parse error is obsolete. If updated from inside no parse error occurs
			_handleConditionsChange.call(this, oChanges.current, oChanges.old);

			// try to find the corresponding async. change
			var bFound = false;
			var i = 0;
			for (i = 0; i < this._aAsyncChanges.length; i++) {
				var oChange = this._aAsyncChanges[i];
				if (oChange.waitForUpdate && deepEqual(oChange.result, oChanges.current)) {
					_performContentChange.call(this, oChange);
					bFound = true;
					break;
				}
			}
			if (bFound) {
				this._aAsyncChanges.splice(i, 1);
			}
		}

		if (oChanges.name === "display") {
			this.destroyAggregation("_content"); // as bound property can change
			_updateConditionType.call(this);
		}

		if (oChanges.name === "fieldHelp" && oChanges.ids) {
			_fieldHelpChanged.call(this, oChanges.ids, oChanges.mutation);
			_updateConditionType.call(this);
		}

		if (oChanges.name === "fieldInfo" && oChanges.child) {
			_fieldInfoChanged.call(this, oChanges.child, oChanges.mutation);
		}

		if (oChanges.name === "content" && oChanges.child) {
			_contentChanged.call(this, oChanges.child, oChanges.mutation);
		}

		if (oChanges.name === "contentEdit" && oChanges.child) {
			_contentChanged.call(this, oChanges.child, oChanges.mutation);
		}

		if (oChanges.name === "contentDisplay" && oChanges.child) {
			_contentChanged.call(this, oChanges.child, oChanges.mutation);
		}

		if (oChanges.name === "_onlyEEQ") {
			_updateConditionType.call(this);
		}

	};

	FieldBase.prototype.getFocusDomRef = function() {

		var aContent = this._getContent();

		if (aContent.length > 0) {
			return aContent[0].getFocusDomRef();
		} else {
			return this.getDomRef();
		}

	};

	FieldBase.prototype.getIdForLabel = function() {

		var sId;
		var aContent = this._getContent();
		if (aContent.length > 0) {
			sId = aContent[0].getIdForLabel();
		} else {
			sId = this.getId();
		}

		return sId;

	};

	FieldBase.prototype.getControlForSuggestion = function() {

		var aContent = this._getContent();
		if (aContent.length > 0) {
			if (this._bIsMeasure) {
				return aContent[1];
			} else {
				return aContent[0];
			}
		} else {
			return this;
		}

	};

	FieldBase.prototype.getMaxConditionsForHelp = function() {

		if (this._bIsMeasure) {
			return 1; // only one unit allowed in help
		} else {
			return this.getMaxConditions();
		}

	};

	/*
	 * If Field is inside of a Form use Forms aria logic for label
	 */
	FieldBase.prototype.enhanceAccessibilityState = function(oElement, mAriaProps) {

		var oParent = this.getParent();

		if (oParent && oParent.enhanceAccessibilityState) {
			// use Field as control, but aria properties of rendered inner control.
			oParent.enhanceAccessibilityState(this, mAriaProps);
		}

		return mAriaProps;

	};

	/**
	 * Assigns a Label control to the Field or FilterField
	 *
	 * The text of the label is taken from the Field.
	 * The <code>labelFor</code> association is set to the Field.
	 *
	 * @param {sap.ui.core.Label} oLabel Label control
	 * @return {sap.ui.mdc.base.FieldBase} Reference to <code>this</code> to allow method chaining
	 *
	 * @public
	 * @experimental
	 * @since 1.62.0 Disclaimer: this function is in a beta state - incompatible API changes may be done before its official public release. Use at your own discretion.
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldBase.prototype.connectLabel = function(oLabel) {

		_setModelOnContent.call(this, oLabel);
		oLabel.bindProperty("text", { path: "$field>/label" });
		oLabel.setLabelFor(this);

		return this;

	};

	function _contentChanged(oContent, sMutation) {

		if (sMutation === "remove") {
			_detachContentHandlers.call(this, oContent);
			_restoreKeyboardHandler.call(this, oContent);

			// let the internal control be created on rendering
		} else if (sMutation === "insert") {
//			if (!oContent.isA("sap.ui.core.IFormContent")) {
//				// TODO: allow different content than allowed in Form?
//				throw new Error(oContent + " is not a valid content! Only use valid content in " + this);
//			}
			_modifyKeyboardHandler.call(this, oContent);
			_setModelOnContent.call(this, oContent);
			_attachContentHandlers.call(this, oContent);

			if (this.getAggregation("_content")) {
				this.destroyAggregation("_content");
			}

			// find out what is bound to conditions
			var oBindingInfo;
			var sProperty;
			for (sProperty in oContent.getMetadata().getAllProperties()) {
				if (oContent.getBindingPath(sProperty) === "/conditions") {
					oBindingInfo = oContent.getBindingInfo(sProperty);
					if (oBindingInfo && oBindingInfo.type && oBindingInfo.type instanceof ConditionsType) {
						this._oConditionsType = oBindingInfo.type;
						_updateConditionType.call(this);
					}
					this._sBoundProperty = sProperty;
				}
				if (sProperty === "editable" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/editMode", formatter: _getEditable });
				}
				if (sProperty === "enabled" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/editMode", formatter: _getEnabled });
				}
				if (sProperty === "displayOnly" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/editMode", formatter: _getDisplayOnly });
				}
				if (sProperty === "required" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/required" });
				}
				if (sProperty === "textAlign" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/textAlign" });
				}
				if (sProperty === "textDirection" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/textDirection" });
				}
				if (sProperty === "valueState" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/valueState" });
				}
				if (sProperty === "valueStateText" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/valueStateText" });
				}
				if (sProperty === "placeholder" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/placeholder" });
				}
				if (sProperty === "tooltip" && !oContent.getBindingPath(sProperty) && oContent.isPropertyInitial(sProperty)) {
					oContent.bindProperty(sProperty, { path: "$field>/tooltip" });
				}
			}

			for (var sAggregation in oContent.getMetadata().getAllAggregations()) {
				if (oContent.getBindingPath(sAggregation) === "/conditions") {
					oBindingInfo = oContent.getBindingInfo(sAggregation);
					if (oBindingInfo && oBindingInfo.template) {
						for (sProperty in oBindingInfo.template.getMetadata().getAllProperties()) {
							var oTemplateBindingInfo = oBindingInfo.template.getBindingInfo(sProperty);
							if (oTemplateBindingInfo && oTemplateBindingInfo.type && oTemplateBindingInfo.type instanceof ConditionType) {
								this._oConditionType = oTemplateBindingInfo.type;
								_updateConditionType.call(this);
								break;
							}
						}
					}
					break;
				}
			}
		}

	}

	function _attachContentHandlers(oContent) {

		if (oContent.getMetadata().getEvents().change) {
			// content has change event -> attach handler
			oContent.attachEvent("change", _handleContentChange, this);
		}
		if (oContent.getMetadata().getEvents().liveChange) {
			// content has liveChange event -> attach handler
			oContent.attachEvent("liveChange", _handleContentLiveChange, this);
		}
		if (oContent.getMetadata().getEvents().press) {
			// content has press event -> attach handler
			oContent.attachEvent("press", _handleContentPress, this);
		}

	}

	function _detachContentHandlers(oContent) {

		if (oContent.getMetadata().getEvents().change) {
			// oldContent has change event -> detach handler
			oContent.detachEvent("change", _handleContentChange, this);
		}
		if (oContent.getMetadata().getEvents().liveChange) {
			// oldContent has liveChange event -> detach handler
			oContent.detachEvent("liveChange", _handleContentLiveChange, this);
		}
		if (oContent.getMetadata().getEvents().press) {
			// oldContent has press event -> detach handler
			oContent.detachEvent("press", _handleContentPress, this);
		}

	}

	function _createInternalContent() {

		var sEditMode = this.getEditMode();
		if (this.getContent() || this._bIsBeingDestroyed ||
				(sEditMode === EditMode.Display && this.getContentDisplay()) ||
				(sEditMode !== EditMode.Display && this.getContentEdit())) {
			this.destroyAggregation("_content");
			return;
		}

		var sDataType = _getDataTypeName.call(this);
		var oDataTypeConstraints = _getDataTypeConstraints.call(this);
		var oDataTypeFormatOptions = _getDataTypeFormatOptions.call(this);
		var iMaxConditions = this.getMaxConditions();
		var oControlType;
		var sControlName;
		var fnCreate;
		var aContentOld = this.getAggregation("_content", []);
		var oContentOld;
		var sControlNameOld;

		if (aContentOld.length > 0) {
			oContentOld = aContentOld[0];
			sControlNameOld = oContentOld.getMetadata().getName().replace(/\./g, "/");
		}

		switch (sDataType) {
		case "Edm.Date": // V4
		case "sap.ui.model.type.Date":
		case "sap.ui.model.odata.type.Date":
			oControlType = mControlTypes.date;
			break;

		case "Edm.DateTime": // V2
		case "sap.ui.model.odata.type.DateTime":
			if (oDataTypeConstraints && (oDataTypeConstraints.displayFormat === "Date" || oDataTypeConstraints.isDateOnly)) {
				oControlType = mControlTypes.date;
			} else {
				oControlType = mControlTypes.dateTime;
			}
			break;

		case "Edm.DateTimeOffset":
		case "sap.ui.model.type.DateTime":
		case "sap.ui.model.odata.type.DateTimeOffset":
			oControlType = mControlTypes.dateTime;
			break;

		case "Edm.TimeOfDay":
		case "sap.ui.model.type.Time":
		case "sap.ui.model.odata.type.TimeOfDay":
			oControlType = mControlTypes.time;
			break;

		case "Edm.Boolean":
		case "sap.ui.model.type.Boolean":
		case "sap.ui.model.odata.type.Boolean":
		case "sap.ui.mdc.base.type.Boolean":
			oControlType = mControlTypes.bool;
			break;

		case "sap.ui.model.odata.type.Unit":
		case "sap.ui.model.odata.type.Currency":
		case "sap.ui.model.type.Unit":
		case "sap.ui.model.type.Currency":
			if (!oDataTypeFormatOptions || !oDataTypeFormatOptions.hasOwnProperty("showMeasure" || oDataTypeFormatOptions.showMeasure)) {
				oControlType = mControlTypes.unit;
			} else {
				oControlType = mControlTypes.default;
			}
			break;

		default:
			if (this.getFieldInfo() && this._bTriggerable) {
				oControlType = mControlTypes.link;
			} else {
				var regexp = new RegExp("^\\*(.*)\\*|\\$search$");
				if (regexp.test(this.getFieldPath()) && this.getMaxConditions() === 1) {
					oControlType = mControlTypes.search;
				} else {
					oControlType = mControlTypes.default;
				}
			}
		break;
		}

		if (sEditMode === EditMode.Display) {
			sControlName = oControlType.display;
			fnCreate = oControlType.createDisplay;
		} else if (iMaxConditions !== 1) {
			sControlName = oControlType.editMulti;
			fnCreate = oControlType.createEditMulti;
		} else if (this.getMultipleLines()) {
			sControlName = oControlType.editMultiLine;
			fnCreate = oControlType.createEditMultiLine;
		} else {
			sControlName = oControlType.edit;
			fnCreate = oControlType.createEdit;
		}

		if (!sControlName) {
			throw new Error("No control defined for type " + sDataType + " in " + this);
		}

		var aControlNames;
		if (Array.isArray(sControlName)) {
			// multiple controls needed
			aControlNames = sControlName;
			sControlName = aControlNames[0];
		} else {
			aControlNames = [sControlName];
		}

		if (sControlName !== sControlNameOld) {
			this._bHideOperator = false;

			if (oContentOld) {
				this.destroyAggregation("_content");

				if (oContentOld.isA("sap.m.DateTimeField")) {
					// in case of DatePicker remove type with special format options
					this._initDataType();
				}

				_updateConditionType.call(this);
			}

			var MyControl;
			for (var i = 0; i < aControlNames.length; i++) {
				var sName = aControlNames[i];
				if (!mControls[sName]) {
					mControls[sName] = {};
				} else if (!mControls[sName].control) {
					mControls[sName].control = sap.ui.require(sName);
					if (!mControls[sName].control) {
						MyControl = undefined; // at least one control not loaded
					}
				} else if (i === 0) {
					MyControl = mControls[sName].control;
				}
			}
			if (!MyControl) {
				if (mControls[sControlName].promise) {
					mControls[sControlName].promise.then(_createInternalContent.bind(this));
					return;
				} else {
					mControls[sControlName].promise = new Promise(function(fResolve) {
						mControls[sControlName].resolve = fResolve;
						sap.ui.require(aControlNames, _controlLoaded.bind(this));
					}.bind(this)).then(_createInternalContent.bind(this));
					return;
				}
			}

			var sId = this.getId() + "-inner";
			var aControls = fnCreate.call(this, MyControl, sId);
			for (var i = 0; i < aControls.length; i++) {
				var oControl = aControls[i];
				oControl.attachEvent("parseError", _handleParseError, this);
				oControl.attachEvent("validationError", _handleValidationError, this);
				_modifyKeyboardHandler.call(this, oControl);
				_setModelOnContent.call(this, oControl);
				if (this._bConnected && ((i === 0 && !this._bIsMeasure) || (i === 1 && this._bIsMeasure))) {
					_setFocusHandlingForFieldHelp.call(this, oControl);
				}
				this.addAggregation("_content", oControl);
			}
		}
	}

	function _controlLoaded() {

		for (var i = 0; i < arguments.length; i++) {
			var fnControl = arguments[i];
			var sControlName = fnControl.getMetadata().getName();
			sControlName = sControlName.replace(/\./g, "/");
			mControls[sControlName].control = fnControl;
			if (mControls[sControlName].resolve) {
				mControls[sControlName].resolve();
				delete mControls[sControlName].resolve;
			}
		}

	}

	function _setModelOnContent(oContent) {
		oContent.setModel(this._oManagedObjectModel, "$field");
	}

	function _createInputControl(Input, sId) {

		var oConditionsType = _getConditionsType.call(this);
		var oInput = new Input(sId, {
			value: {path: "$field>/conditions", type: oConditionsType},
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: "{$field>/_fieldHelpEnabled}",
			width: "100%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this),
			valueHelpRequest: _handleValueHelpRequest.bind(this),
			showSuggestion: true	//TODO active suggest to not get the browser history displayed for the input field.
		});

		_addFieldHelpIcon.call(this, oInput);
		this._sBoundProperty = "value";

		return [oInput];

	}

	function _createSearchField(SearchField, sId) {

		this._bHideOperator = true;
		var oConditionType = _getConditionType.call(this); // can not bind to conditions directly as SearchField updates "value" while typing

		var oControl = new SearchField(sId, {
			value: {path: "$field>/conditions/0", type: oConditionType, mode: "OneWay"},
			placeholder: "{$field>/placeholder}",
			width: "100%",
			tooltip: "{$field>/tooltip}",
			search:  _handleContentChange.bind(this)
			// liveChange: function(oEvent) {
			// 	var oFF = oEvent.oSource.getParent();
			// 	var sValue = oEvent.getParameter("newValue");

			// 	if (this.iChangeTimer) {
			// 		clearTimeout(this.iChangeTimer);
			// 		delete this.iChangeTimer;
			// 	}
			// 	this.iChangeTimer = setTimeout(function() {
			// 		var oOperator = _getFilterOperatorConfig.call(this).getOperator("Contains");
			// 	}.bind(this), 400);
			// }.bind(this)
		});
		return [oControl];

	}

	function _createMultiInputControl(MultiInput, sId) {

		var Token = sap.ui.require("sap/m/Token"); // is loaded by MultiInput
		var oConditionType = _getConditionType.call(this);
		var oToken = new Token(sId + "-token", {
			text: {
				path: '$field>',
				type: oConditionType }
		});

		var oMultiInput = new MultiInput(sId, {
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: "{$field>/_fieldHelpEnabled}",
			width: "100%",
			tooltip: "{$field>/tooltip}",
			tokens: {path: "$field>/conditions", template: oToken},
			dependents: [oToken], // to destroy it if MultiInput is destroyed
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this),
			tokenUpdate: _handleTokenUpdate.bind(this),
			valueHelpRequest: _handleValueHelpRequest.bind(this)
		});

		_addFieldHelpIcon.call(this, oMultiInput);

		return [oMultiInput];

	}

	function _createTextAreaControl(TextArea, sId) {

		var oConditionsType = _getConditionsType.call(this);
		var oTextArea = new TextArea(sId, {
			value: {path: "$field>/conditions", type: oConditionsType},
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			width: "100%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this)
		});

		this._sBoundProperty = "value";
		return [oTextArea];

	}

	function _createTextControl(Text, sId) {

		var oConditionsType = _getConditionsType.call(this);
		var oText = new Text(sId, {
			text: {path: "$field>/conditions", type: oConditionsType},
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			wrapping: "{$field>/multipleLines}",
			width: "100%",
			tooltip: "{$field>/tooltip}"
		});

		this._sBoundProperty = "text";
		return [oText];
	}

	function _createDatePickerControl(DatePicker, sId) {

		this._bHideOperator = true;
		var oConditionsType = _getConditionsType.call(this);

		_adjustDataTypeForDate.call(this);

		var oDatePicker = new DatePicker(sId, {
			value: {path: "$field>/conditions", type: oConditionsType},
			displayFormat: this._sDisplayFormat,
			valueFormat: this._sValueFormat,
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}", // TODO: own ValueState handling?
			valueStateText: "{$field>/valueStateText}",
			width: "100%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this)
		});

		if (oDatePicker.setDisplayFormatType) {
			// TimePicker has no displayFormatType
			oDatePicker.setDisplayFormatType(this._sCalendarType);
		}

		this._sBoundProperty = "value";
		return [oDatePicker];
	}

	function _createLinkControl(Link, sId) {

		var oConditionsType = _getConditionsType.call(this);
		// do no set width to open the FieldInfo ast the end of the Link
		var oLink = new Link(sId, {
			text: {path: "$field>/conditions", type: oConditionsType},
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			tooltip: "{$field>/tooltip}",
			press: _handleContentPress.bind(this)
		});

		this._sBoundProperty = "text";
		return [oLink];
	}

	function _createBoolInputControl(Input, sId) {

		// use default field help
		if (!this.getFieldHelp()) {
			_createDefaultFieldHelp.call(this, "bool");
		}

		return _createInputControl.call(this, Input, sId);

	}

	function _createUnitInputControls(Input, sId) {

		_adjustDataTypeForUnit.call(this);

		this._bIsMeasure = true; // FieldHelp only on unit field
		var oConditionsType = _getConditionsType.call(this);
		var oInput1 = new Input(sId, {
			value: {path: "$field>/conditions", type: oConditionsType},
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: false,
			width: "70%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this)
		});

		oConditionsType = _getUnitConditionsType.call(this);
		var oInput2 = new Input(sId + "-unit", {
			value: {path: "$field>/conditions", type: oConditionsType},
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: "{$field>/_fieldHelpEnabled}",
			width: "30%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this),
			valueHelpRequest: _handleValueHelpRequest.bind(this)
		});

		_addFieldHelpIcon.call(this, oInput2);
		this._sBoundProperty = "value";

		return [oInput1, oInput2];

	}

	function _createUnitMultiInputControls(MultiInput, sId) {

		_adjustDataTypeForUnit.call(this);
		this._bIsMeasure = true; // FieldHelp only on unit field

		var Token = sap.ui.require("sap/m/Token"); // is loaded by MultiInput
		var Input = sap.ui.require("sap/m/Input");
		var oConditionType = _getConditionType.call(this);
		var oToken = new Token(sId + "-token", {
			text: {
				path: '$field>',
				type: oConditionType }
		});

		var oFilter =   new Filter({
			path: "values",
			test: function(aValues) {
				// do not show tokens for units without measure
				if (!Array.isArray(aValues[0]) || aValues[0][0]) {
					return true;
				} else {
					return false;
				}
			}
		});

		var oMultiInput = new MultiInput(sId, {
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: false,
			width: "70%",
			tooltip: "{$field>/tooltip}",
			tokens: {path: "$field>/conditions", template: oToken, filters: [oFilter]},
			dependents: [oToken], // to destroy it if MultiInput is destroyed
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this),
			tokenUpdate: _handleTokenUpdate.bind(this)
		});

		var oConditionsType = _getUnitConditionsType.call(this);
		var oInput = new Input(sId + "-unit", {
			value: {path: "$field>/conditions", type: oConditionsType},
			placeholder: "{$field>/placeholder}",
			textAlign: "{$field>/textAlign}",
			textDirection: "{$field>/textDirection}",
			required: "{$field>/required}",
			editable: { path: "$field>/editMode", formatter: _getEditable },
			enabled: { path: "$field>/editMode", formatter: _getEnabled },
			valueState: "{$field>/valueState}",
			valueStateText: "{$field>/valueStateText}",
			showValueHelp: "{$field>/_fieldHelpEnabled}",
			width: "30%",
			tooltip: "{$field>/tooltip}",
			change: _handleContentChange.bind(this),
			liveChange: _handleContentLiveChange.bind(this),
			valueHelpRequest: _handleValueHelpRequest.bind(this)
		});

		_addFieldHelpIcon.call(this, oInput);
		this._sBoundProperty = "value";

		return [oMultiInput, oInput];

	}

	function _modifyKeyboardHandler(oControl) {
		// if FieldHelp is open, do not use native arrow handling of control

		if (oControl.onsapprevious) {
			oControl._origOnsapprevious = oControl.onsapprevious;
			oControl.onsapprevious = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this);
				if (oEvent.keyCode !== KeyCodes.ARROW_UP && (!oFieldHelp || !oFieldHelp.isOpen())) {
					var oControl = this._getContent()[0]; // TODO: multiple content controls
					oControl._origOnsapprevious(oEvent);
				}
			}.bind(this);
		}

		if (oControl.onsapnext) {
			oControl._origOnsapnext = oControl.onsapnext;
			oControl.onsapnext = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this);
				if (oEvent.keyCode !== KeyCodes.ARROW_DOWN && (!oFieldHelp || !oFieldHelp.isOpen())) {
					var oControl = this._getContent()[0]; // TODO: multiple content controls
					oControl._origOnsapnext(oEvent);
				}
			}.bind(this);
		}

		if (oControl.onsapup) {
			oControl._origOnsapup = oControl.onsapup;
			oControl.onsapup = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this);
				if (!oFieldHelp || !oFieldHelp.isOpen()) {
					var oControl = this._getContent()[0]; // TODO: multiple content controls
					oControl._origOnsapup(oEvent);
				}
			}.bind(this);
		}

		if (oControl.onsapdown) {
			oControl._origOnsapdown = oControl.onsapdown;
			oControl.onsapdown = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this);
				if (!oFieldHelp || !oFieldHelp.isOpen()) {
					var oControl = this._getContent()[0]; // TODO: multiple content controls
					oControl._origOnsapdown(oEvent);
				}
			}.bind(this);
		}

		if (oControl.onsapbackspace) {
			oControl._origOnsapbackspace = oControl.onsapbackspace;
			oControl.onsapbackspace = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this);
				if (!oFieldHelp || !oFieldHelp.isOpen()) {
					var oControl = this._getContent()[0]; // TODO: multiple content controls
					oControl._origOnsapbackspace(oEvent);
				}
			}.bind(this);
		}

	}

	function _restoreKeyboardHandler(oControl) {

		if (oControl._origOnsapprevious) {
			oControl.onsapprevious = oControl._origOnsapprevious;
			delete oControl._origOnsapprevious;
		}

		if (oControl._origOnsapnext) {
			oControl.onsapnext = oControl._origOnsapnext;
			delete oControl._origOnsapnext;
		}

		if (oControl._origOnsapup) {
			oControl.onsapup = oControl._origOnsapup;
			delete oControl._origOnsapup;
		}

		if (oControl._origOnsapdown) {
			oControl.onsapdown = oControl._origOnsapdown;
			delete oControl._origOnsapdown;
		}

		if (oControl._origOnsapbackspace) {
			oControl.onsapbackspace = oControl._origOnsapbackspace;
			delete oControl._origOnsapbackspace;
		}

	}

	function _createDefaultFieldHelp(sType) {

		this.setProperty("_fieldHelpEnabled", true, true);
		this._sDefaultFieldHelp = mDefaultHelps[sType].id;

		var oFieldHelp = mDefaultHelps[sType].control;
		if (!oFieldHelp) {
			if (mDefaultHelps[sType].promise) {
				mDefaultHelps[sType].promise.then(_defaultFieldHelpUpdate.bind(this));
			}
			var FieldHelp = sap.ui.require(mDefaultHelps[sType].name);
			if (!FieldHelp && !mDefaultHelps[sType].promise) {
				mDefaultHelps[sType].promise = new Promise(function(fResolve) {
					mDefaultHelps[sType].resolve = fResolve;
					sap.ui.require([mDefaultHelps[sType].name], function(fnControl) {
						_createDefaultFieldHelp.call(this, sType);
					}.bind(this));
				}.bind(this)).then(_defaultFieldHelpUpdate.bind(this));
			}
			if (FieldHelp) {
				oFieldHelp = new FieldHelp(mDefaultHelps[sType].id);
				mDefaultHelps[sType].control = oFieldHelp;
//				this.addDependent(oFieldHelp); // TODO: where to add to control tree
				oFieldHelp.connect(this); // to forward dataType
				if (mDefaultHelps[sType].resolve) {
					mDefaultHelps[sType].resolve();
					delete mDefaultHelps[sType].resolve;
				}
				if (!mDefaultHelps[sType].promise) {
					_defaultFieldHelpUpdate.call(this);
				}
			}
		}

	}

	function _defaultFieldHelpUpdate() {

		_fieldHelpChanged.call(this, "BoolDefaultHelp", "insert");
		_addFieldHelpIcon.call(this, this.getAggregation("_content", [])[0]);

	}

	function _handleParseError(oEvent) {

		// as change event if inner control is fired even Input is wrong, check parse exception from binding
		this._bParseError = true;

	}

	function _handleValidationError(oEvent) {

		// as change event if inner control is fired even Input is wrong, check validation exception from binding
		this._bParseError = true;

	}

	function _handleContentChange(oEvent) {

		var oChangeEvent = {parameters: merge({}, oEvent.getParameters()), source: oEvent.getSource()};
		var iLength = this._aAsyncChanges.length;

		if (iLength > 0 && !this._aAsyncChanges[iLength - 1].changeFired) {
			// as change event in Input is diretly fired after setValue this must be the chnage event corresponding to the last async cahnge.
			// as there might be a sync change after it, do not handle it twice.
			this._aAsyncChanges[iLength - 1].changeFired = true;
			this._aAsyncChanges[iLength - 1].changeEvent = oChangeEvent;
			_triggerChange.call(this, undefined, undefined, undefined, this._aAsyncChanges[iLength - 1].promise);
			return;
		}

		var oChange = {changeEvent: oChangeEvent};

		_performContentChange.call(this, oChange);

	}

	function _performContentChange(oChange) {

		var aConditions = this.getConditions();
		var vValue;
		var bValid = true;
		var vWrongValue;
		var oCondition;
		var oSource = oChange.changeEvent.source;
		var bAsync = false;

		if (oChange.changeEvent.parameters.hasOwnProperty("valid")) {
			bValid = oChange.changeEvent.parameters["valid"];
			if (!bValid && oChange.changeEvent.parameters.hasOwnProperty("value")) {
				vWrongValue = oChange.changeEvent.parameters["value"];
			}
		}

		// use parsed value of the condition, if possible
		var bUpdateConditions = false;
		var oBI = this._sBoundProperty && oSource.getBindingInfo(this._sBoundProperty);
		if (oBI && oBI.binding && oBI.binding.sPath === "/conditions" && bValid) {
			oCondition = aConditions[0];
			vValue = aConditions[0] && aConditions[0].values[0];
		} else if (oChange.changeEvent.parameters.hasOwnProperty("value")) {
			vValue = oChange.changeEvent.parameters["value"];
			if (bValid) {
				bUpdateConditions = true;
			}
		} else if (oChange.changeEvent.parameters.hasOwnProperty("query")) {
			vValue = oChange.changeEvent.parameters["query"];
			bUpdateConditions = true;
		} else {
			oCondition = aConditions[0];
			vValue = aConditions[0] && aConditions[0].values[0];
		}

		if (bUpdateConditions) {
			// text typed in MultiInput
			_removeUIMessage.call(this);
			var oConditionType;
			var oMyChange;

			oCondition = SyncPromise.resolve().then(function() {
				if (this._oNavigateCondition) {
					// text entered via navigation -> use this data
					bValid = true;
					return this._oNavigateCondition;
				} else {
					oConditionType = _getConditionType.call(this);
					var vResult = oConditionType.parseValue(vValue);
					var iLength = this._aAsyncChanges.length;

					if (iLength > 0 && !this._aAsyncChanges[iLength - 1].changeFired) {
						oMyChange = this._aAsyncChanges[iLength - 1];
						oMyChange.changeFired = true;
						oMyChange.changeEvent = oChange.changeEvent;
						_triggerChange.call(this, undefined, undefined, undefined, oMyChange.promise);
					}
					return vResult;
				}
			}.bind(this)).then(function(oCondition) {
				_updateConditionsFromChange.call(this, oCondition, aConditions, oConditionType, bValid, vValue, oSource, oMyChange || oChange);
				return oCondition;
			}.bind(this)).catch(function(oException) {
				bValid = false;
				vWrongValue = vValue;
				_setUIMessage.call(this, oException.message);

				if (oMyChange && oMyChange.reject) {
					oMyChange.reject(oException);
				} else if (bAsync) {
					this._fireChange(aConditions, bValid, vWrongValue );
				}
			}.bind(this)).unwrap();

			if (oCondition instanceof Promise) {
				// will be parsed async
				bAsync = true;
			}

		} else if (this._oNavigateCondition) {
			// entry comes from navigation -> parsed value might not have out-parameters
			// TODO: add out-parameter logic to parser
			aConditions[0] = this._oNavigateCondition;
			if (this._bIsMeasure) {
				// update unit in other conditions too
				for (var i = 1; i < aConditions.length; i++) {
					aConditions[i].values[0][1] = this._oNavigateCondition.values[0][1];
					if (aConditions[i].operator === "BT") {
						aConditions[i].values[1][1] = this._oNavigateCondition.values[0][1];
					}
					if (this._oNavigateCondition.inParameters) {
						aConditions[i].inParameters = this._oNavigateCondition.inParameters;
					}
					if (this._oNavigateCondition.outParameters) {
						aConditions[i].outParameters = this._oNavigateCondition.outParameters;
					}
				}
			}
			if (!deepEqual(aConditions, this.getConditions())) {
				this.setProperty("conditions", aConditions, true); // do not invalidate whole field
			}
		} else if (!oChange.changeEvent.parameters.hasOwnProperty("valid") && this._bParseError) {
			// this might be result of a value that cannot be parsed
			vWrongValue = oChange.changeEvent.parameters["value"];
			bValid = false;
		}

		var oFieldHelp = _getFieldHelp.call(this);
		if (oFieldHelp && this._bConnected) {
			if (sap.ui.getCore().getCurrentFocusedControlId() === oSource.getId()) {
				oFieldHelp.close(); // if focus is not in field, Field help closes automatically
			}
			oFieldHelp.setFilterValue("");
			if (!bAsync) {
				_setConditionsOnFieldHelp.call(this, aConditions, oFieldHelp);
			}
			if (this.iLiveChangeTimer) {
				// do not trigger async suggestion
				clearTimeout(this.iLiveChangeTimer);
			}
		}

		if (this._oNavigateCondition) {
			oFieldHelp.onFieldChange();
			this._oNavigateCondition = undefined; // navigation now over
		}

		if (oChange.resolve) {
			// async promise needs to be resolved
			_resolveAsyncChange.call(this, oChange);
		} else if (!bAsync) {
			_triggerChange.call(this, aConditions, bValid, vWrongValue );
		}

	}

	function _updateConditionsFromChange(oCondition, aConditions, oConditionType, bValid, vValue, oSource, oChange) {

		if (oConditionType) {
			// in navigation no validation needed
				oConditionType.validateValue(oCondition);
		}

		var iMaxConditions = this.getMaxConditions();

		if (bValid) {
			if (oCondition) {
				if (this._bIsMeasure && aConditions.length === 1 && aConditions[0].values[0][0] === undefined) {
					// remove empty condition
					aConditions = [];
				}
				if (Condition.indexOfCondition(oCondition, aConditions) >= 0) {
					// condition already exist
					throw new Error(this._oResourceBundle.getText("field.CONDITION_ALREADY_EXIST", [vValue]));
				} else {
					if (iMaxConditions > 0 && iMaxConditions <= aConditions.length) {
						// remove first conditions to meet maxConditions
						aConditions.splice(0, aConditions.length - iMaxConditions + 1);
					}
					aConditions.push(oCondition);
				}
			} else if (iMaxConditions === 1) {
				aConditions = [];
			}

			if (!deepEqual(aConditions, this.getConditions())) {
				this.setProperty("conditions", aConditions, true); // do not invalidate whole field
			}

			if (iMaxConditions !== 1) {
				oSource.setValue(""); // remove typed value of MultiInput
			}

		}

		if (oChange.resolve) {
			var oFieldHelp = _getFieldHelp.call(this);
			if (oFieldHelp && this._bConnected) {
				_setConditionsOnFieldHelp.call(this, aConditions, oFieldHelp);
			}
			oChange.result = aConditions;
			_resolveAsyncChange.call(this, oChange);
		}

	}

	function _handleContentLiveChange(oEvent) {

		var vValue;
		var vPreviousValue;
		var bEscPressed = false;
		var oSource = oEvent.getSource();

		this._oNavigateCondition = undefined; // navigation item is not longer valid

		if ("value" in oEvent.getParameters()) {
			vValue = oEvent.getParameter("value");
		}

		if ("escPressed" in oEvent.getParameters()) {
			bEscPressed = oEvent.getParameter("escPressed");
		}

		if ("previousValue" in oEvent.getParameters()) {
			vPreviousValue = oEvent.getParameter("previousValue");
		} else {
			var aConditions = this.getConditions();
			vPreviousValue = aConditions[0] && aConditions[0].values[0];
		}

		var oFieldHelp = _getFieldHelp.call(this);
		if (oFieldHelp && oFieldHelp.openByTyping() && (!this._bIsMeasure || oSource.getShowValueHelp())) {
			// TODO: better logic
			var vFilter;
			if (vValue[0] === "=" && vValue[1] === "=") {
				vFilter = vValue.slice(2);
			} else if (vValue[0] === "="/* || vValue[0] === ">" || vValue[0] === "<"*/) {
				vFilter = vValue.slice(1);
			} else {
				vFilter = vValue;
			}

			var sDisplay = this.getDisplay();
			if (sDisplay !== FieldDisplay.Value) {
				// remove "(", ")" from serach string
				// TODO: better solution to search in this case?
				var oOperator = this._getFilterOperatorConfig().getOperator("EEQ");
				var aParts = oOperator.splitText(vFilter, sDisplay);
				vFilter = "";
				if (aParts[0]) {
					vFilter = aParts[0];
					if (aParts[1]) {
						vFilter = vFilter + " ";
					}
				}
				if (aParts[1]) {
					vFilter = vFilter + aParts[1];
				}
			}

			if (this.iLiveChangeTimer) {
				clearTimeout(this.iLiveChangeTimer);
				delete this.iLiveChangeTimer;
			}

			this.iLiveChangeTimer = setTimeout(function() {
				if (this._bConnected && this._getContent()[0] &&
						(sap.ui.getCore().getCurrentFocusedControlId() === this._getContent()[0].getId() ||
						(this._getContent()[1] && sap.ui.getCore().getCurrentFocusedControlId() === this._getContent()[1].getId()))) { // only if still connected and focussed
					oFieldHelp.setFilterValue(vFilter);
					if (oFieldHelp.getConditions().length > 0) {
						// While suggestion no item is selected
						oFieldHelp.setConditions([]);
					}
					oFieldHelp.open(true);
				}
			}.bind(this), 300);

		}

		this.fireLiveChange({ value: vValue, escPressed: bEscPressed, previousValue: vPreviousValue});

	}

	function _handleContentPress(oEvent) {

		var oFieldInfo = this.getFieldInfo();
		if (oFieldInfo) {
			oFieldInfo.getTriggerHref().then(function (sHref) {
				if (sHref){
					window.location.href = sHref;
				} else {
					oFieldInfo.open(this._getContent()[0]);
				}
			}.bind(this));
		}

		this.firePress();

	}

	function _handleTokenUpdate(oEvent) {

		if (oEvent.getParameter("type") === "removed") {
			var aRemovedTokens = oEvent.getParameter("removedTokens");
			var aConditions = this.getConditions();
			var sUnit;
			var i;

			for (i = 0; i < aRemovedTokens.length; i++) {
				var oRemovedToken = aRemovedTokens[i];
				var sPath = oRemovedToken.getBindingContext("$field").sPath;
				var iIndex = parseInt(sPath.slice(sPath.lastIndexOf("/") + 1));
				aConditions[iIndex].delete = true;
			}

			for (i = aConditions.length - 1; i >= 0; i--) {
				if (aConditions[i].delete) {
					if (this._bIsMeasure) {
						sUnit = aConditions[i].values[0][1];
					}
					aConditions.splice(i, 1);
				}
			}

			if (this._bIsMeasure && sUnit && aConditions.length === 0) {
				// create dummy condition for unit
				aConditions = [Condition.createItemCondition([undefined, sUnit], undefined)];
			}

			this.setProperty("conditions", aConditions, true); // do not invalidate whole field
			_triggerChange.call(this, aConditions, true );

		}

	}

	function _fieldHelpChanged(sId, sMutation) {

		var oFieldHelp = sap.ui.getCore().byId(sId);

		if (sMutation === "remove") {
			oFieldHelp.detachEvent("select", _handleFieldHelpSelect, this);
			oFieldHelp.detachEvent("navigate", _handleFieldHelpNavigate, this);
			oFieldHelp.detachEvent("dataUpdate", _handleHelpDataUpdate, this);
			oFieldHelp.detachEvent("disconnect", _handleDisconnect, this);
			this.setProperty("_fieldHelpEnabled", false, true);
		} else if (sMutation === "insert") {
			if (oFieldHelp) {
				oFieldHelp.attachEvent("dataUpdate", _handleHelpDataUpdate, this);
				this.setProperty("_fieldHelpEnabled", true, true);
			}
		}

		_handleConditionsChange.call(this, this.getConditions()); // to update descriptions

	}

	function _getFieldHelp() {

		var sId = this.getFieldHelp();
		var oFieldHelp;

		if (!sId && this._sDefaultFieldHelp) {
			sId = this._sDefaultFieldHelp;
		}

		if (sId) {
			oFieldHelp = sap.ui.getCore().byId(sId);
		}

		return oFieldHelp;

	}

	function _setConditionsOnFieldHelp(aConditions, oFieldHelp) {

		if (!oFieldHelp) {
			oFieldHelp = _getFieldHelp.call(this);
		}

		if (this._bIsMeasure) {
			// for unit or curreny add only the unit/currency to FieldHelp
			var aHelpConditions = [];
			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (oCondition.values[0] && oCondition.values[0][1]) {
					var oHelpCondition = Condition.createItemCondition(oCondition.values[0][1], undefined, oCondition.inParameters, oCondition.outParameters);
					aHelpConditions.push(oHelpCondition);
				}
			}
			oFieldHelp.setConditions(aHelpConditions);
		} else {
			oFieldHelp.setConditions(aConditions);
		}

	}

	function _handleValueHelpRequest(oEvent) {

		var oFieldHelp = _getFieldHelp.call(this);

		if (oFieldHelp) {
			oFieldHelp.setFilterValue("");
			var aConditions = this.getConditions();
			_setConditionsOnFieldHelp.call(this, aConditions, oFieldHelp);
			oFieldHelp.toggleOpen(false);
		}

	}

	function _handleFieldHelpSelect(oEvent) {

		var aConditions = this.getConditions();
		var aNewConditions = oEvent.getParameter("conditions");
		var bAdd = oEvent.getParameter("add");
		var oFieldHelp = oEvent.oSource;
		var iMaxConditions = this.getMaxConditions();
		var bOnlyEEQ = _getOnlyEEQ.call(this);
		var oCondition;
		var oContent = this.getControlForSuggestion();
		var sDOMValue;
		var i = 0;

		if (this._bIsMeasure) {
			if (aNewConditions.length > 1) {
				throw new Error("Only one item must be selected! " + this);
			}
			if (aNewConditions[0].operator !== "EEQ") {
				throw new Error("Only EEQ allowed! " + this);
			}

			if (aConditions.length > 0) {
				// TODO: update all conditions?
				for (i = 0; i < aConditions.length; i++) {
					aConditions[i].values[0][1] = aNewConditions[0].values[0];
					if (aConditions[i].operator === "BT") {
						aConditions[i].values[1][1] = aNewConditions[0].values[0];
					}
					if (aNewConditions[0].inParameters) {
						aConditions[i].inParameters = aNewConditions[0].inParameters;
					}
					if (aNewConditions[0].outParameters) {
						aConditions[i].outParameters = aNewConditions[0].outParameters;
					}
				}
			} else {
				oCondition = merge({}, aNewConditions[0]); // use selected condition to keep in/out parameter
				oCondition.values[0] = [undefined, oCondition.values[0]];
				oCondition.values[1] = undefined;
				aConditions.push(oCondition);
				// TODO: format once to update current value in type (as empty condtions are not displayed as token)
				if (this._oConditionType) {
					sDOMValue = this._oConditionType.formatValue(oCondition);
				} else if (this._oConditionsType) {
					sDOMValue = this._oConditionsType.formatValue(aConditions);
				}
			}
		} else {
			if (!bAdd) {
				aConditions = []; // remove all existing conditions
			}

			for (i = 0; i < aNewConditions.length; i++) {
				oCondition = aNewConditions[i];
				if (bOnlyEEQ && oCondition.operator !== "EQ" && oCondition.operator !== "EEQ") {
					continue;
				}

				if (bOnlyEEQ && this._checkValueInitial(oCondition.values[0])) {
					// initial value used and no tokens -> do not add condition
					Log.warning("FieldBase", "Entry with empty key not valid! It is not taken into the field");
					continue;
				}

				if (!bAdd || Condition.indexOfCondition(oCondition, aConditions) === -1) { // check if already exist
					aConditions.push(oCondition);
				}
			}
		}

		if (iMaxConditions > 0 && iMaxConditions < aConditions.length) {
			// remove first conditions to meet maxConditions
			aConditions.splice(0, aConditions.length - iMaxConditions);
		}

		if (deepEqual(aConditions, this.getConditions())) {
			// same condition might be choosen again, but text while typing changed before -> update text
			if (oContent && oContent.setDOMValue && this.getMaxConditionsForHelp() === 1 && aConditions.length > 0) {
				if (this._bIsMeasure && this._oUnitConditionsType) {
					sDOMValue = this._oUnitConditionsType.formatValue(aConditions);
				} else if (this._oConditionType) {
					sDOMValue = this._oConditionType.formatValue(aConditions[0]);
				} else if (this._oConditionsType) {
					sDOMValue = this._oConditionsType.formatValue(aConditions);
				}
				oContent.setDOMValue(sDOMValue);
			}
		} else {
			// remove typed value from MultiInput
			if (oContent && oContent.setDOMValue) {
				if (iMaxConditions !== 1) {
					oContent.setDOMValue("");
				}
			}

			this._oNavigateCondition = undefined;
			this.setProperty("conditions", aConditions, true); // do not invalidate whole field

			// handle out-parameters
			oFieldHelp.onFieldChange();

			_triggerChange.call(this, aConditions, true);
		}

	}

	function _handleFieldHelpNavigate(oEvent) {

		var sValue = oEvent.getParameter("value");
		var vKey = oEvent.getParameter("key");
		var oCondition = oEvent.getParameter("condition");
		var sNewValue;
		var sDOMValue;
		var oContent = this.getControlForSuggestion();
		var bOnlyEEQ = _getOnlyEEQ.call(this);

		if (oCondition) {
			this._oNavigateCondition = merge({}, oCondition);
			vKey = oCondition.values[0];
			sValue = oCondition.values[1];
		} else {
			this._oNavigateCondition = Condition.createItemCondition(vKey, sValue);
		}

		if (bOnlyEEQ && this._checkValueInitial(vKey)) {
			// initial value used and no tokens -> do not add entry
			Log.warning("FieldBase", "Entry with empty key not valid! It is not taken into the field");
			this._oNavigateCondition = undefined;
			sValue = "";
		}

		if (this._bIsMeasure) {
			var aConditions = this.getConditions();
			// use number of first condition. In Multicase all conditions must be updated in change event
			if (aConditions.length > 0) {
				this._oNavigateCondition.operator = aConditions[0].operator;
				this._oNavigateCondition.values[0] = [aConditions[0].values[0][0], this._oNavigateCondition.values[0]];
				if (aConditions[0].operator === "BT") {
					this._oNavigateCondition.values[1] = [aConditions[0].values[1][0], this._oNavigateCondition.values[0][1]];
				} else {
					this._oNavigateCondition.values[1] = undefined;
				}
			} else {
				this._oNavigateCondition.values[0] = [undefined, this._oNavigateCondition.values[0]];
			}
		}

		if (this.getDisplay() !== FieldDisplay.Value) {
			// value is used as key
			sNewValue = vKey;
		} else if (sValue) {
			sNewValue = sValue;
		} else {
			sNewValue = vKey;
		}

		if (oContent && oContent.setDOMValue) {
			if (!sDOMValue) {
				if (this._bIsMeasure && this._oUnitConditionsType && this._oNavigateCondition) {
					sDOMValue = this._oUnitConditionsType.formatValue([this._oNavigateCondition]);
				} else if (this._oConditionType && this._oNavigateCondition) {
					sDOMValue = this._oConditionType.formatValue(this._oNavigateCondition);
				} else if (this._oConditionsType && this._oNavigateCondition) {
					sDOMValue = this._oConditionsType.formatValue([this._oNavigateCondition]);
				} else {
					sDOMValue = sValue || vKey;
				}
			}
			oContent.setDOMValue(sDOMValue);
			oContent._doSelect();
		}

		this.fireLiveChange({value: sNewValue});

	}

	function _handleHelpDataUpdate(oEvent) {

		var isEditing = this.getEditMode() === EditMode.Editable && this._getContent().length > 0 &&
			sap.ui.getCore().getCurrentFocusedControlId() === this._getContent()[0].getId();

//		// also in display mode to get right text
//		_handleConditionsChange.call(this, this.getConditions());
		if (!isEditing && this.getConditions().length > 0 &&
				(this.getMaxConditions() !== 1 || (this.getDisplay() !== FieldDisplay.Value && !this._bParseError))) {
			// update tokens in MultiValue
			// update text/value only if no parse error, otherwise wrong value would be removed
			this._oManagedObjectModel.checkUpdate(true);
		}

	}

	function _handleDisconnect(oEvent) {

		var oFieldHelp = _getFieldHelp.call(this);
		oFieldHelp.detachEvent("select", _handleFieldHelpSelect, this);
		oFieldHelp.detachEvent("navigate", _handleFieldHelpNavigate, this);
		oFieldHelp.detachEvent("disconnect", _handleDisconnect, this);
		this._bConnected = false;

	}

	function _connectFieldhelp() {

		var oFieldHelp = _getFieldHelp.call(this);
		if (oFieldHelp && !this._bConnected) {
			oFieldHelp.connect(this);
			this._bConnected = true;
			oFieldHelp.attachEvent("select", _handleFieldHelpSelect, this);
			oFieldHelp.attachEvent("navigate", _handleFieldHelpNavigate, this);
			oFieldHelp.attachEvent("disconnect", _handleDisconnect, this);
			var aConditions = this.getConditions();
			_setConditionsOnFieldHelp.call(this, aConditions, oFieldHelp);

			var oContent = this.getControlForSuggestion();
			_setFocusHandlingForFieldHelp.call(this, oContent);
		}

	}

	function _setFocusHandlingForFieldHelp(oContent) {

		if (oContent && !oContent.orgOnsapfocusleave && oContent.onsapfocusleave) {
			//TODO: find better solution
			oContent.orgOnsapfocusleave = oContent.onsapfocusleave;
			oContent.onsapfocusleave = function(oEvent) {
				var oFieldHelp = _getFieldHelp.call(this.getParent());

				if (oFieldHelp) {
					var oFocusedControl = sap.ui.getCore().byId(oEvent.relatedControlId);
					if (oFocusedControl
						&& containsOrEquals(oFieldHelp.getDomRef(), oFocusedControl.getFocusDomRef())) {
						oEvent.stopPropagation();
						return;
					}
				}
				this.orgOnsapfocusleave(oEvent);
			};
		}

	}

	// TODO: need API on Input
	function _addFieldHelpIcon(oControl) {

		var oFieldHelp = _getFieldHelp.call(this);

		if (oFieldHelp && oControl && oControl.addEndIcon) {
			var sIconName = oFieldHelp.getIcon();
			var oIcon = oControl.getAggregation("_endIcon", [])[0];

			if (oIcon) {
				oIcon.setSrc(sIconName);
			} else {
				oControl.addEndIcon({
					id: oControl.getId() + "-vhi",
					src: sIconName,
					useIconTooltip: false,
					noTabStop: true,
					press: function (oEvent) {
						// if the property valueHelpOnly is set to true, the event is triggered in the ontap function
						if (!this.getValueHelpOnly()) {
							var $input;

							if (Device.support.touch) {
								// prevent opening the soft keyboard
								$input = this.$('inner');
								$input.attr('readonly', 'readonly');
								this.focus();
								$input.removeAttr('readonly');
							} else {
								this.focus();
							}

							this.bValueHelpRequested = true;
							this.fireValueHelpRequest({ fromSuggestions: false });
						}
					}.bind(oControl)
				});
			}
		}

	}

	function _fieldInfoChanged(oFieldInfo, sMutation) {

		if (sMutation === "remove") {
			oFieldInfo.detachEvent("dataUpdate", _handleInfoDataUpdate, this);
		} else if (sMutation === "insert") {
			oFieldInfo.attachEvent("dataUpdate", _handleInfoDataUpdate, this);
			_handleInfoDataUpdate.call(this); // to set already existing values
		}

	}

	function _handleInfoDataUpdate() {

		var oFieldInfo = this.getFieldInfo();
		var that = this;
		oFieldInfo.isTriggerable().then(function (bTriggerable) {
			that._bTriggerable = bTriggerable;
			if (that.getAggregation("_content") && that.getEditMode() === EditMode.Display) {
				_createInternalContent.call(that);
			}
		});

	}

	// also needed on FieldHelp to format tokens....
	FieldBase.prototype._getFormatOptions = function() {

		return {
				onlyEEQ: _getOnlyEEQ.call(this),
				valueType: _getDataType.call(this),
				originalDateType: this._oDateOriginalType || this._oUnitOriginalType,
				display: this._bIsMeasure ? FieldDisplay.Value : this.getDisplay(),
				fieldHelpID: this._bIsMeasure ? undefined : this.getFieldHelp() || this._sDefaultFieldHelp,
				filterOperatorConfig: this._getFilterOperatorConfig(),
				hideOperator: this._bHideOperator,
				maxConditions: this.getMaxConditions(),
				bindingContext: this.getBindingContext(), // to dertmine text and key usding in/out-parameter using correct bindingContext (In Table FieldHelp might be connected to other row)
				asyncParsing: _asyncParsingCall.bind(this)
			};

	};

	function _updateConditionType() {

		if (this._oConditionType || this._oConditionsType) {
			var oFormatOptions = this._getFormatOptions();
			if (this._oConditionType) {
				this._oConditionType.setFormatOptions(oFormatOptions);
			}
			if (this._oConditionsType) {
				this._oConditionsType.setFormatOptions(oFormatOptions);
			}
		}

	}

	function _getConditionType() {

		if (!this._oConditionType) {
			this._oConditionType = new ConditionType();
			_updateConditionType.call(this);
		}

		return this._oConditionType;

	}

	function _getConditionsType() {

		if (!this._oConditionsType) {
			this._oConditionsType = new ConditionsType();
			_updateConditionType.call(this);
		}

		return this._oConditionsType;

	}

	/*
	 * If the value is the initial value of the type (String types) and
	 * the Field not shows tokens or operator (Field case) no condition
	 * must be set as the field then is empty.
	 */
	FieldBase.prototype._checkValueInitial = function(vValue) {

		if (vValue === null || vValue === undefined) {
			return true;
		}

		if (vValue === "") {
			var oType = _getDataType.call(this);
			var vResult = oType.parseValue(vValue, "string");
			if (vResult === vValue) {
				return true; // it's initial value
			} else {
				try {
					oType.validateValue(vResult);
				} catch (oError) {
					// if type is not nullable empty is invalid, so it is initial
					return true;
				}
			}
		}

		// TODO: other types?

		return false;

	};

	function _getUnitConditionsType() {

		if (!this._oUnitConditionsType) {
			var oFormatOptions = _getUnitFormatOptions.call(this);
			this._oUnitConditionsType = new ConditionsType(oFormatOptions);
		}

		return this._oUnitConditionsType;

	}

	function _getUnitFormatOptions() {

		return {
			onlyEEQ: true, // TODO: only fix units
			valueType: undefined, // use String as default
			originalDateType: _getDataType.call(this), // use type of measure for currentValue
			display: this.getDisplay(),
			fieldHelpID: this.getFieldHelp() || this._sDefaultFieldHelp,
			filterOperatorConfig: this._getFilterOperatorConfig(),
			hideOperator: true, // TODO: no operator for units
			maxConditions: 1, // TODO: only one unit allowed
			bindingContext: this.getBindingContext(), // to dertmine text and key usding in/out-parameter using correct bindingContext (In Table FieldHelp might be connected to other row)
			asyncParsing: _asyncParsingCall.bind(this),
			isUnit: true,
			getConditions: this.getConditions.bind(this) // TODO: better solution to update unit in all conditions
		};

	}

	function _asyncParsingCall(oPromise) {

		// close FieldHelp to prevent action on it during parsing
		var oFieldHelp = _getFieldHelp.call(this);
		if (oFieldHelp && oFieldHelp.isOpen()) {
			oFieldHelp.close();
		}

		// as async parsing can be called again while one is still running we have to map the promises to resolve the right one.
		var oChange = {};
		var oMyPromise = new Promise(function(fResolve, fReject) {
			oChange.resolve = fResolve;
			oChange.reject = fReject;

			oPromise.then(function(vResult) {// vResult can be a condition or an array of conditions
				oChange.result = vResult;
				var aConditions = this.getConditions();
				if (deepEqual(vResult, aConditions)) {
					// parsingResult is same as current value -> no update will happen
					_resolveAsyncChange.call(this, oChange);
				} else {
					oChange.waitForUpdate = true;
				}
			}.bind(this)).catch(function(oException) {
				this._bParseError = true;
				fReject(oException);
			}.bind(this));
		}.bind(this));

		oChange.promise = oMyPromise;
		this._aAsyncChanges.push(oChange);

	}

	FieldBase.prototype._getResultForPromise = function(aConditions) {

		// to be overwritten by Field - per default resolve conditions
		return aConditions;

	};

	function _resolveAsyncChange(oChange) {

		oChange.resolve(this._getResultForPromise(oChange.result));

	}

	return FieldBase;

}, /* bExport= */ true);
