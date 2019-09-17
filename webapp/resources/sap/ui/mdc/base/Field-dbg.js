/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/library',
	'sap/ui/base/ManagedObjectObserver',
	'./FieldBase',
	'./FieldBaseRenderer',
	'./Condition',
	'sap/base/util/deepEqual'
], function(
		library,
		ManagedObjectObserver,
		FieldBase,
		FieldBaseRenderer,
		Condition,
		deepEqual
	) {
	"use strict";

	var FieldDisplay = library.FieldDisplay;

	/**
	 * Constructor for a new Field.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A Field can be used to bind its value to data of certain data type. Based on the data type settings, a default
	 * visualization is done by the Field.
	 *
	 * @extends sap.ui.mdc.base.FieldBase
	 * @implements sap.ui.core.IFormContent
	 *
	 * @author SAP SE
	 * @version 1.69.1
	 *
	 * @constructor
	 * @alias sap.ui.mdc.base.Field
	 * @author SAP SE
	 * @version 1.69.1
	 * @since 1.54.0
	 *
	 * @private
	 * @experimental
	 */
	var Field = FieldBase.extend("sap.ui.mdc.base.Field", /* @lends sap.ui.mdc.base.Field.prototype */ {
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The value of the field
				 *
				 */
				value: {
					type: "any",
					defaultValue: null
				},

				/**
				 * the additional value of the field.
				 *
				 * Depending on the dataType this could be an description.
				 */
				additionalValue: {
					type: "any",
					defaultValue: null
				}
			},
			events: {
				/**
				 * This event is fired when the value property of the field is changed
				 *
				 * <b>Note</b> This event is only triggered if the used content control has a change event
				 */
				change: {
					parameters: {

						/**
						 * The new <code>value</code> of the <code>control</code>.
						 */
						value: { type: "string" },

						/**
						 * Flag indicates if the entered <code>value</code> is valid.
						 */
						valid: { type: "boolean" },

						/**
						 * Returns a Promise for the change. The Promise will return the value if it is resolved.
						 * If the change event is syncronous the promise is already resolved. But if it is asyncrounous
						 * it will be resolved after the value is updated.
						 *
						 * The Field should be set to busy during the parsing to prevent user input.
						 * As there might to be a whole group needs to be busy this cannot be done automatically.
						 *
						 * @since 1.69.0
						 */
						promise: { type: "Promise" }
					}
				}
			},
			defaultProperty: "value"
		},
		renderer: FieldBaseRenderer
	});

	Field.prototype.init = function() {

		FieldBase.prototype.init.apply(this, arguments);

		this.setMaxConditions(1);
		this.setProperty("_onlyEEQ", true, true);

		this._oObserver.observe(this, {
			properties: ["value", "additionalValue"]
		});

	};

	Field.prototype.exit = function() {

		FieldBase.prototype.exit.apply(this, arguments);

		if (this._iConditionUpdateTimer) {
			clearTimeout(this._iConditionUpdateTimer);
			delete this._iConditionUpdateTimer;
		}

	};

	Field.prototype.bindProperty = function(sName, oBindingInfo) {

		if (sName === "value" && !oBindingInfo.formatter) { // not if a formatter is used, as this needs to be executed
			oBindingInfo.targetType = "raw"; // provide internal value to inner control
			if (!this._oDataType && oBindingInfo.type) {
				this._oDataType = oBindingInfo.type;
			}
		}

		FieldBase.prototype.bindProperty.apply(this, arguments);

	};

	Field.prototype._handleModelContextChange = function(oEvent) {

		FieldBase.prototype._handleModelContextChange.apply(this, arguments);

		if (!this._oDataType) {
			var oBinding = this.getBinding("value");
			if (oBinding) {
				this._oDataType = oBinding.getType();
			}
		}

	};

	Field.prototype._initDataType = function() {

		FieldBase.prototype._initDataType.apply(this, arguments);

		var oBinding = this.getBinding("value");
		if (oBinding) {
			this._oDataType = oBinding.getType();
		}

	};

	/**
	 * This property must not be set for the <code>Field</code>
	 *
	 * @param {int} iMaxConditions only 1 condition allowed in <code>Field</code>
	 * @returns {sap.ui.mdc.base.Field} <code>this</code> to allow method chaining.
	 * @private
	 */
	Field.prototype.setMaxConditions = function(iMaxConditions) {

		if (iMaxConditions !== 1) {
			throw new Error("Only one condition allowed for Field " + this);
		}

		return this.setProperty("maxConditions", iMaxConditions, true);

	};

	Field.prototype._observeChanges = function(oChanges) {

		FieldBase.prototype._observeChanges.apply(this, arguments);

		if (oChanges.name === "value") {
			this._vValue = oChanges.current;
			_initializeType.call(this, oChanges.current);
			_triggerConditionUpdate.call(this);
		}

		if (oChanges.name === "additionalValue") {
			this._vAdditionalValue = oChanges.current;
			_triggerConditionUpdate.call(this);
		}

		if (oChanges.name === "conditions") {
			// keep value/additionalValue and conditions in sync
			// (value must be updated if conditions are changed in async parsing too, so not in change event)
			_updateValue.call(this, oChanges.current);
		}

	};

	function _getValue() {

		// as on update value and additional value are set both, but properties can only be handled one after the other
		// store here to have them independent of the order.
		return this._vValue;

	}

	function _getAdditionalValue() {

		// as on update value and additional value are set both, but properties can only be handled one after the other
		// store here to have them independent of the order.
		return this._vAdditionalValue;

	}

	function _triggerConditionUpdate() {

		if (this.getDisplay() === FieldDisplay.Value) {
			// only value displayed -> no need to wait
			_updateCondition.call(this, _getValue.call(this), _getAdditionalValue.call(this));
		} else if (!this._iConditionUpdateTimer) {
			// call async. to update condition once if value and additionalValue set at same time
			this._iConditionUpdateTimer = setTimeout(function() {
				_updateCondition.call(this, _getValue.call(this), _getAdditionalValue.call(this));
				this._iConditionUpdateTimer = undefined;
			}.bind(this), 0);
		}

	}

	function _updateCondition(vValue, vAdditionalValue) {

		if (this._checkValueInitial(vValue) && !vAdditionalValue) {
			// if empty -> no condition
			this.setConditions([]);
		} else {
			var oCondition = Condition.createItemCondition(vValue, vAdditionalValue);
			var aConditions = this.getConditions();
			var vOldValue = aConditions[0] && aConditions[0].values[0];
			var sOldAdditionalValue = aConditions[0] && aConditions[0].values[1];
			if (!aConditions[0] || aConditions[0].operator !== "EEQ" || !_compareValues.call(this, vOldValue, vValue) ||
					sOldAdditionalValue !== vAdditionalValue) {
				// update conditions only if changed (keep out-parameter)
				this.setConditions([oCondition]);
			}
		}

	}

	function _compareValues(vValue1, vValue2) {

		var bEqual = vValue1 === vValue2;

		if (!bEqual && this._oDataType
				&& (this._oDataType.isA("sap.ui.model.odata.type.Unit") || this._oDataType.isA("sap.ui.model.odata.type.Currency"))
				&& Array.isArray(vValue1) && Array.isArray(vValue2)) {
			// in unit type the unit table is in there setting the value but not after parsing
			// units must be set at least once. so if not set compare too
			if (vValue1[0] === vValue2[0] && vValue1[1] === vValue2[1]
					&& ((this._bUnitSet && (!vValue1[2] || !vValue2[2])) || (!vValue1[2] && !vValue2[2]) || deepEqual(vValue1[2], vValue2[2]))) {
				bEqual = true;
			}
			if (vValue1[2] || vValue2[2]) {
				this._bUnitSet = true;
			}
		}

		return bEqual;

	}

	function _initializeType(vValue) {

		if (!this._bTypeInitialized) {
			if (this._oDataType && (this._oDataType.isA("sap.ui.model.odata.type.Unit") || this._oDataType.isA("sap.ui.model.odata.type.Currency"))
					&& Array.isArray(vValue) && vValue[2]) {
				// format once to set internal customizing
				this._oDataType.formatValue(vValue, "string");
				this._bTypeInitialized = true;
			}
		}

	}

	Field.prototype._fireChange = function(aConditions, bValid, vWrongValue, oPromise) {

		var vValue;

		if (aConditions) { // even if empty and error is returned, only in async case it is really empty
			if (bValid) {
				vValue = this._getResultForPromise(aConditions);
			} else {
				vValue = vWrongValue;
			}
		}

		this.fireChange({ value: vValue, valid: bValid, promise: oPromise }); // TODO: format value in change event to external format?

	};

	Field.prototype._getResultForPromise = function(aConditions) {

		var vValue;
		if (aConditions.length === 0 && this._oDataType) {
			// parse "" to get type specific initial value
			vValue = this._oDataType.parseValue("", "string");
		} else if (aConditions.length === 1) {
			vValue = aConditions[0].values[0];
		}

		return vValue;

	};

	function _updateValue(aConditions) {

		var vValue = null; // use default of property for empty to avoid updates from null to undefined
		var vAdditionalValue = null; // use default of property for empty to avoid updates from null to undefined
		var vOldValue = this.getValue();
		var vOldAdditionalValue = this.getAdditionalValue();

		if (aConditions.length === 0 && vOldValue === null && vOldAdditionalValue === null) {
			// Field initialized from setter -> cannot have a condition -> no update needed
			return;
		}

		vValue = this._getResultForPromise(aConditions);
		if (aConditions.length === 0 && !vOldAdditionalValue) {
			vAdditionalValue = vOldAdditionalValue; // to not update old initial value
		} else if (aConditions.length === 1 && aConditions[0].values.length > 1) {
			vAdditionalValue = aConditions[0].values[1];
		}

		// save internal as observer is called for each property and so might have the old value in getProperty.
		this._vValue = vValue;
		this._vAdditionalValue = vAdditionalValue;

		if (vValue !== vOldValue) {
			// to run not in V4 update issues if data not already loaded
			this.setProperty("value", vValue, true);
		}
		if (vAdditionalValue !== vOldAdditionalValue) {
			// to run not in V4 update issues if data not already loaded
			this.setProperty("additionalValue", vAdditionalValue, true);
		}

	}

	/**
	 * Sets conditions to the property <code>conditions</code>.
	 *
	 * Do not use the <code>conditions</code> property, use the <code>value</code> property instead.
	 *
	 * @param {object[]} aConditions conditions to be set
	 * @return {sap.ui.mdc.base.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.base.Field#setConditions
	 * @function
	 */

	/**
	 * Gets conditions of the property <code>conditions</code>.
	 *
	 * Do not use the <code>conditions</code> property, use the <code>value</code> property instead.
	 *
	 * @return {object[]} conditions of the field
	 * @private
	 * @name sap.ui.mdc.base.Field#getConditions
	 * @function
	 */

	/**
	 * The type of the data handles by the field. this type is used to parse, format and validate the value.
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property is ignored
	 *
	 * @param {string} sDataType dataType to be set
	 * @return {sap.ui.mdc.base.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.base.Field#setDataType
	 * @function
	 */

	/**
	 * The constraints of the type specified in <code>dataType</code>
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property and <code>dataTypeConstraints</code> property is ignored
	 *
	 * @param {string} oDataTypeConstraints Constraints to be set
	 * @return {sap.ui.mdc.base.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.base.Field#setDataTypeConstraints
	 * @function
	 */

	/**
	 * The format options of the type specified in <code>dataType</code>
	 *
	 * <b>Note:</b> If the <code>value</code> property is bound to a model using a type this type is used.
	 * In this case the value of the <code>dataType</code> property and <code>dataTypeFormatOptions</code> property is ignored
	 *
	 * @param {string} oDataTypeFormatOptions FormatOptions to be set
	 * @return {sap.ui.mdc.base.Field} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @name sap.ui.mdc.base.Field#setDataTypeFormatOptions
	 * @function
	 */

	return Field;

}, /* bExport= */ true);
