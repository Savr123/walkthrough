/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */

// Provides the base implementation for all model implementations
sap.ui.define([
	'./ConditionType',
	'sap/ui/model/SimpleType',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	'sap/base/util/merge'
],
	function(
		ConditionType,
		SimpleType,
		FormatException,
		ParseException,
		ValidateException,
		merge
		) {
	"use strict";


	/**
	 * Constructor for a Conditions type.
	 *
	 * @class
	 * This class represents conditions types. It is used to map an array of conditions to an Input or Text control
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.69.1
	 *
	 * @public
	 * @param {object} [oFormatOptions] formatting options.
	 * @param {sap.ui.model.Type} [oFormatOptions.valueType] Type of the value of the condition (used for formatting and parsing)
	 * @param {object} [oFormatOptions.filterOperatorConfig] FilterOperatorConfig to be used in the condition
	 * @param {string} [oFormatOptions.display] DisplayFormat
	 * @param {boolean} [oFormatOptions.onlyEEQ] If set parsing creates only EEQ conditions //TODO
	 * @param {string} [oFormatOptions.fieldHelpID] FieldHelp to determine key and description // TODO: async request????
	 * @param {boolean} [oFormatOptions.hideOperator] If set only the value of the condition is shown, no operator //TODO
	 * @param {int} [oFormatOptions.maxConditions] Maximal allowed conditions
	 * @param {object} [oFormatOptions.bindingContext] bindingContext of field. Used to get key or description from value help using in/out-parametes. (In table value help might be connected to different row)
	 * @param {sap.ui.model.Type} [oFormatOptions.originalDateType] Type used on field. E.g. for date types internally an other type is used to have different formatOptions
	 * @param {boolean} [oFormatOptions.isUnit] If set the type is used for the unit part of a field
	 * @param {function} [oFormatOptions.getConditions] Function to get the existing conditions of the field. only used it isUnit is set. TODO: better solution
	 * @param {function} [oFormatOptions.asyncParsing] Callback-function to tell the Field the parsing is asynchronously.
	 * @param {object} [oConstraints] value constraints.
	 * @alias sap.ui.mdc.base.type.ConditionsType
	 * @since 1.62.0
	 */
	var ConditionsType = SimpleType.extend("sap.ui.mdc.base.type.ConditionsType", /** @lends sap.ui.mdc.base.type.ConditionsType.prototype */ {

		constructor : function (oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "Conditions";
			oFormatOptions = _createFormatOptionsForConditionType(oFormatOptions);
//			var oConstraints = merge({}, this.oConstraints);
			this._oConditionType = new ConditionType(oFormatOptions, this.oConstraints);
		}

	});

	ConditionsType.prototype.destroy = function() {

		SimpleType.prototype.destroy.apply(this, arguments);

		if (this._oConditionType) { // to avoid issues in double destroy
			this._oConditionType.destroy();
			this._oConditionType = undefined;
		}

	};

	ConditionsType.prototype.setFormatOptions = function(oFormatOptions) {

		SimpleType.prototype.setFormatOptions.apply(this, arguments);

		oFormatOptions = _createFormatOptionsForConditionType(oFormatOptions);
		if (this._oConditionType) {
			this._oConditionType.setFormatOptions(oFormatOptions);
		}

	};

	function _createFormatOptionsForConditionType(oFormatOptions) {

		oFormatOptions = merge({}, oFormatOptions);
		// remove asyncParsing as this is handled once for all conditions
		if (oFormatOptions.asyncParsing) {
			delete oFormatOptions.asyncParsing;
		}

		return oFormatOptions;

	}

	ConditionsType.prototype.setConstraints = function(oConstraints) {

		SimpleType.prototype.setConstraints.apply(this, arguments);

//		var oConstraints = merge({}, this.oConstraints);
		if (this._oConditionType) {
			this._oConditionType.setConstraints(this.oConstraints);
		}

	};

	ConditionsType.prototype.formatValue = function(aConditions, sInternalType) {

		if (aConditions == undefined || aConditions == null) {
			return null;
		}

		if (!Array.isArray(aConditions)) {
			throw new FormatException("No valid conditions provided");
		}

		var vValue;

		if (!sInternalType || sInternalType === "string" || sInternalType === "any") {
			vValue = ""; // if string requested use string
		} else if (sInternalType === "float" || sInternalType === "int") {
			vValue = 0; // if number requested use number
		}

		var iMaxConditions = _getMaxConditions.call(this);

		var aFormattedValues = [];
		var bPromise = false;
		var i = 0;

		for (i = 0; i < aConditions.length; i++) {
			var oCondition = aConditions[i];
			var vFormattedValue = this._oConditionType.formatValue(oCondition, sInternalType);

			aFormattedValues.push(vFormattedValue);
			if (vFormattedValue instanceof Promise) {
				bPromise = true;
			}

			if (iMaxConditions > 0 && i >= iMaxConditions - 1) {
				break;
			}
		}

		if (bPromise) {
			return Promise.all(aFormattedValues).then(function(aFormattedValues) {
				return _concatenateFormattedValues(aFormattedValues, vValue);
			});
		}

		return _concatenateFormattedValues(aFormattedValues, vValue);

	};

	function _concatenateFormattedValues(aFormattedValues, vValue) {

		for (var i = 0; i < aFormattedValues.length; i++) {
			if (vValue) {
				vValue = vValue + "; " +  aFormattedValues[i];
			} else {
				vValue =  aFormattedValues[i];
			}
		}

		return vValue;

	}

	ConditionsType.prototype.parseValue = function(sValue, sInternalType) {

		if (_getMaxConditions.call(this) !== 1) {
			throw new ParseException("Only one condition supported for parsing");
			// TODO: support multiple conditions (list separated by ";") ?
		}

		var oCondition = this._oConditionType.parseValue(sValue, sInternalType);

		if (oCondition instanceof Promise) {
			var oPromise = oCondition.then(function(oCondition) {
				return _parseConditionToConditions.call(this, oCondition);
			}.bind(this));

			if (this.oFormatOptions.asyncParsing) {
				this.oFormatOptions.asyncParsing(oPromise);
			}

			return oPromise;
		} else {
			return _parseConditionToConditions.call(this, oCondition);
		}

	};

	function _parseConditionToConditions(oCondition) {

		var bIsUnit = this.oFormatOptions.isUnit;

		if (bIsUnit) {
			// update all conditions with unit
			// TODO better solution
			var sUnit = oCondition && oCondition.values[0][1];
			var aConditions = this.oFormatOptions.getConditions();
			for (var i = 0; i < aConditions.length; i++) {
				aConditions[i].values[0][1] = sUnit;
				if (aConditions[i].operator === "BT") {
					aConditions[i].values[1][1] = sUnit;
				}
			}
			if (aConditions.length === 0) {
				aConditions.push(oCondition);
			}
			return aConditions;
		} else if (oCondition) {
			return [oCondition];
		} else {
			return [];
		}

	}

	ConditionsType.prototype.validateValue = function(aConditions) {

		if (aConditions === undefined || aConditions === null) {
			return;
		}

		if (!Array.isArray(aConditions)) {
			throw new ValidateException("No valid conditions provided");
		}

		for (var i = 0; i < aConditions.length; i++) {
			var oCondition = aConditions[i];
			this._oConditionType.validateValue(oCondition);
		}

		if (aConditions.length === 0) {
			// test if type is nullable
			this._oConditionType.validateValue(null);
		}

	};

	function _getMaxConditions() {

		var iMaxConditions = 1;

		if (this.oFormatOptions.hasOwnProperty("maxConditions")) {
			iMaxConditions = this.oFormatOptions.maxConditions;
		}

		return iMaxConditions;

	}

	return ConditionsType;

});
