/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */

// Provides the base implementation for all model implementations
sap.ui.define([
	'sap/ui/model/SimpleType',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	'sap/ui/model/type/String',
	'sap/ui/mdc/library',
	'sap/ui/mdc/base/FilterOperatorConfig',
	'sap/ui/mdc/base/Condition',
	'sap/base/util/merge'
],
	function(
		SimpleType,
		FormatException,
		ParseException,
		ValidateException,
		StringType,
		library,
		FilterOperatorConfig,
		Condition,
		merge
		) {
	"use strict";

	var FieldDisplay = library.FieldDisplay;

	/**
	 * Constructor for a Condition type.
	 *
	 * @class
	 * This class represents condition types.
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
	 * @alias sap.ui.mdc.base.type.ConditionType
	 * @since 1.62.0
	 */
	var ConditionType = SimpleType.extend("sap.ui.mdc.base.type.ConditionType", /** @lends sap.ui.mdc.base.type.ConditionType.prototype */ {

		constructor : function (oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "Condition";
			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		}

	});

	ConditionType.prototype.destroy = function() {

		SimpleType.prototype.destroy.apply(this, arguments);

		if (this._oDefaultType) {
			this._oDefaultType.destroy();
			delete this._oDefaultType;
		}

		if (this._oFilterOperatorConfig) {
			this._oFilterOperatorConfig.destroy();
			delete this._oFilterOperatorConfig;
		}

	};

	ConditionType.prototype.formatValue = function(oCondition, sInternalType) {

		if (oCondition == undefined || oCondition == null) {
			return null;
		}

		if (typeof oCondition !== "object" || !oCondition.operator || !oCondition.values ||
				!Array.isArray(oCondition.values)) {
			throw new FormatException("No valid condition provided");
		}

		if (!sInternalType) {
			sInternalType = "string";
		}

		var oType = _getValueType.call(this);
		var bIsUnit = this.oFormatOptions.isUnit;

		if (bIsUnit) {
			// only use unit in condition
			oCondition = merge({}, oCondition);
			if (oCondition.values[0] && Array.isArray(oCondition.values[0])) {
				oCondition.values[0] = oCondition.values[0][1];
			}
			if (oCondition.operator !== "EQ" && oCondition.operator !== "EEQ") {
				// in the moment only single value supported
				oCondition.operator = "EQ";
				if (oCondition.values[1]) {
					oCondition.values.splice(1,1);
				}
			}
		}

		_attachCurrentValueAtType.call(this, oCondition, oType);


		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
			case "any":
				if (this.oFormatOptions.onlyEEQ && oCondition.operator === "EQ") {
					// use EEQ to display description
					oCondition = merge({}, oCondition); // do not manipulate original object
					oCondition.operator = "EEQ";
				}

				var sDisplay = _getDisplay.call(this);
				var oFieldHelp = _getFieldHelp.call(this);

				if (oCondition.operator === "EEQ" && sDisplay !== FieldDisplay.Value && !oCondition.values[1] && oFieldHelp) {
					var oBindingContext = this.oFormatOptions.bindingContext;
					var sDescription = oFieldHelp.getTextForKey(oCondition.values[0], oCondition.inParameters, oCondition.outParameters, oBindingContext);
					if (sDescription instanceof Promise) {
						// description needs to be requested -> return if it is resolved
						return sDescription.then(function(sDescription) {
							oCondition = merge({}, oCondition); // do not manipulate original object
							if (oCondition.values.length == 1) {
								oCondition.values.push(sDescription);
							} else {
								oCondition.values[1] = sDescription;
							}
							return _formatToString.call(this, oCondition);
						}.bind(this)).catch(function(oException) {
							if (!oFieldHelp.getValidateInput()) {
								// if "invalid" input is allows don't fire an exception
								return _formatToString.call(this, oCondition);
							} else {
								throw oException;
							}
						}.bind(this));
					} else if (sDescription) {
						oCondition = merge({}, oCondition); // do not manipulate original object
						if (oCondition.values.length == 1) {
							oCondition.values.push(sDescription);
						} else {
							oCondition.values[1] = sDescription;
						}
					} else if (oFieldHelp.getValidateInput()) {
						// key cannot be validated -> error
						throw new FormatException(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [oCondition.values[0]])); // use original value in message
					}
				}

				return _formatToString.call(this, oCondition);
			default:
				// operators can only be formatted to string. But other controls (like Slider) might just use the value
				if (oType && oCondition.values.length >= 1) {
					return oType.formatValue(oCondition.values[0], sInternalType);
				}

				throw new FormatException("Don't know how to format Condition to " + sInternalType);
		}

	};

	function _formatToString(oCondition) {

		var sDisplay = _getDisplay.call(this);
		var oType = _getValueType.call(this);
		var oFilterOperatorConfig = _getFilterOperatorConfig.call(this);

		if (this.oFormatOptions.hideOperator && oCondition.values.length >= 1) {
			return oType.formatValue(oCondition.values[0], "string");
		}

		var oOperator = oFilterOperatorConfig.getOperator(oCondition.operator);
		return oOperator.format(oCondition.values, oCondition, oType, sDisplay);

	}

	ConditionType.prototype.parseValue = function(vValue, sInternalType) {

		if (!sInternalType) {
			sInternalType = "string";
		} else if (sInternalType === "any" && typeof vValue === "string") {
			sInternalType = "string";
		}

		var sDisplay = _getDisplay.call(this);
		var oFieldHelp = _getFieldHelp.call(this);
		var oType = _getValueType.call(this);
		var oOriginalDateType = _getOriginalDateType.call(this);
		var sType = oType.getMetadata().getName();
		var oFilterOperatorConfig = _getFilterOperatorConfig.call(this);

		if (!vValue) {
			if (!_isCompositeType.call(this, oType)) {
				return null; // TODO: for all types???
			}
		}

		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				var sValue = vValue;
				var oOperator;
				var bCheckForDefault = false;

				if (this.oFormatOptions.onlyEEQ) {
					oOperator = oFilterOperatorConfig.getOperator("EEQ");

					if (!oOperator.test(vValue, oType)) {
						sValue = "==" + vValue; // TODO better way to parse
					}
				} else {
					var aOperators = oFilterOperatorConfig.getMatchingOperators(sType, sValue);

					// use default operator if nothing found
					if (aOperators.length === 0) {
						if (oFieldHelp && !_isCompositeType.call(this, oType)) {
							// try first to use EEQ and find it in FieldHelp. If not found try later with default operator
							oOperator = oFilterOperatorConfig.getOperator("EEQ");

							if (!oOperator.test(vValue, oType)) {
								sValue = "==" + vValue; // TODO better way to parse
							}
							bCheckForDefault = true;
						} else {
							// use default operation
							sDefaultOperator = oFilterOperatorConfig.getDefaultOperator(sType);
							oOperator = oFilterOperatorConfig.getOperator(sDefaultOperator);
							sValue = oOperator ? oOperator.format([vValue]) : vValue;
						}
					} else {
						oOperator = aOperators[0]; // TODO: multiple matches?
					}
				}

				if (oOperator) {
					var oCondition;
					try {
						oCondition = oOperator.getCondition(sValue, oType, sDisplay);
					} catch (oException) {
						if (oException instanceof ParseException && oOriginalDateType) {
							// As internal yyyy-MM-dd is used as pattern for dates (times similar) the
							// parse exception might contain this as pattern. The user should see the pattern thats shown
							// So try to parse date with the original type to get parseException with right pattern.
							oOriginalDateType.parseValue(vValue, "string");
						}
						throw oException;
					}

					if (!oCondition) {
						throw new ParseException("Cannot parse value " + vValue); // use original value in message
					}

					// TODO better logic
					if (oOperator.name === "EEQ" && oFieldHelp && !_isCompositeType.call(this, oType)) {
						var bKeyChecked = false;
						if (oCondition.values[0] !== null && oCondition.values[0] !== undefined) {
							// as description can be wrong, get it always
							oCondition = _parseDetermineDescription.call(this, oCondition, oType, oFieldHelp, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay);
							if (oCondition instanceof Promise) {
								if (this.oFormatOptions.asyncParsing) {
									this.oFormatOptions.asyncParsing(oCondition);
								}
								return oCondition;
							}
							bKeyChecked = true;
						}
						if ((oCondition.values[0] === null || oCondition.values[0] === undefined) && oCondition.values[1]) {
							// only description entered -> determine key
							oCondition = _parseDetermineKey.call(this, oCondition, oType, oFieldHelp, !bKeyChecked, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay);
							if (oCondition instanceof Promise) {
								if (this.oFormatOptions.asyncParsing) {
									this.oFormatOptions.asyncParsing(oCondition);
								}
								return oCondition;
							}
						}
					}

					return _finishParseFromString.call(this, oCondition, oType);
				}

				throw new ParseException("Cannot parse value " + vValue); // use original value in message

			default:
				// operators can only be formatted from string. But other controls (like Slider) might just use the value
				if (oType) {
					// TODO: other operator?
					var sDefaultOperator;
					if (this.oFormatOptions.onlyEEQ) {
						sDefaultOperator = "EEQ";
					} else {
						sDefaultOperator = oFilterOperatorConfig.getDefaultOperator(sType);
					}
					return Condition.createCondition(sDefaultOperator, [oType.parseValue(vValue, sInternalType)]);
				}
				throw new ParseException("Don't know how to parse Condition from " + sInternalType);
		}

	};

	function _finishParseFromString(oCondition, oType) {

		if (oCondition) {
			var bIsUnit = this.oFormatOptions.isUnit;

			if (bIsUnit) {
				if (oCondition.operator !== "EEQ" && oCondition.operator !== "EQ") {
					throw new ParseException("unsupported operator");
				}
				var oOriginalDateType = _getOriginalDateType.call(this);
				var sUnit = oCondition.values[0]; // use key of unit
				var vMeasure;
				if (oOriginalDateType._aCurrentValue) {
					var vMeasure = oOriginalDateType._aCurrentValue[0];
				}
				oCondition.values = [[vMeasure, sUnit], undefined];
				_attachCurrentValueAtType.call(this, oCondition, oOriginalDateType);
			} else {
				var sName = oType.getMetadata().getName();
				if ((sName === "sap.ui.model.odata.type.Unit" ||
						sName === "sap.ui.model.odata.type.Currency" ||
						sName === "sap.ui.model.type.Unit" ||
						sName === "sap.ui.model.type.Currency") &&
						!oCondition.values[0][1] && oType._aCurrentValue) {
					// TODO: if no unit provided use last one
					oCondition.values[0][1] = oType._aCurrentValue[1];
					if (oCondition.operator === "BT") {
						oCondition.values[1][1] = oType._aCurrentValue[1];
					}
				}

				_attachCurrentValueAtType.call(this, oCondition, oType);
			}

			return oCondition;
		}

	}

	function _parseDetermineDescription(oCondition, oType, oFieldHelp, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay) {

		// as description can be wrong, get it always
		var oBindingContext = this.oFormatOptions.bindingContext;
		var sDescription = oFieldHelp.getTextForKey(oCondition.values[0], undefined, undefined, oBindingContext);
		if (sDescription instanceof Promise) {
			// description needs to be requested -> return if it is resolved
			return sDescription.then(function(sDescription) {
				oCondition.values[1] = sDescription;
				return _finishParseFromString.call(this, oCondition, oType);
			}.bind(this)).catch(function(oException) {
				if (sDisplay === FieldDisplay.Value) {
					if (bCheckForDefault) {
						oCondition = _parseUseDefaultOperator.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
						return _finishParseFromString.call(this, oCondition, oType);
					} else if (!oFieldHelp.getValidateInput()) {
						return _returnUserInput.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
					} else {
						throw new ParseException(oException.message); // to have ParseException
					}
				} else {
					// Maybe Description entered -> try to determine key
					oCondition.values[1] = oCondition.values[0];
					oCondition.values[0] = null;
					return _parseDetermineKey.call(this, oCondition, oType, oFieldHelp, false, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay);
				}
			}.bind(this));
		} else if (sDescription) {
			oCondition.values[1] = sDescription;
		} else if (sDisplay !== FieldDisplay.Value) {
			// Maybe Description entered -> try to determine key
			oCondition.values[1] = oCondition.values[0];
			oCondition.values[0] = null;
		}

		return oCondition;

	}

	function _parseDetermineKey(oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay) {

		// only description entered -> determine key
		var oBindingContext = this.oFormatOptions.bindingContext;
		var vKey = oFieldHelp.getKeyForText(oCondition.values[1], oBindingContext);
		if (vKey instanceof Promise) {
			// key needs to be requested -> return if it is resolved
			return vKey.then(function(vKey) {
				oCondition.values[0] = vKey;
				return _finishParseFromString.call(this, oCondition, oType);
			}.bind(this)).catch(function(oException) {
				// only try to find description of nothing is found. If more than one key is found fire exception
				if (oException._bNotUnique) { // TODO: better solution?
					if (!oFieldHelp.getValidateInput()) {
						return _returnUserInput.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
					} else {
						throw oException;
					}
				} else {
					return _parseNoKeyFound.call(this, oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay, oException);
				}
			}.bind(this));
		} else if (vKey !== undefined && vKey !== null) {
			oCondition.values[0] = vKey;
		} else {
			return _parseNoKeyFound.call(this, oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay);
		}

		return oCondition;

	}

	function _parseNoKeyFound(oCondition, oType, oFieldHelp, bCheckDescription, bCheckForDefault, oFilterOperatorConfig, vValue, sDisplay, oException) {

		oCondition.values[0] = oCondition.values[1];
		var sDescription = null;
		if (bCheckDescription) {
			// Maybe key is entered -> get Description
			var oBindingContext = this.oFormatOptions.bindingContext;
			sDescription = oFieldHelp.getTextForKey(oCondition.values[0], undefined, undefined, oBindingContext);
			if (sDescription instanceof Promise) {
				// description needs to be requested -> return if it is resolved
				return sDescription.then(function(sDescription) {
					oCondition.values[1] = sDescription;
					return _finishParseFromString.call(this, oCondition, oType);
				}.bind(this)).catch(function(oException) {
					oCondition.values[1] = null;
					if (bCheckForDefault) {
						oCondition = _parseUseDefaultOperator.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
						return _finishParseFromString.call(this, oCondition, oType);
					} else if (!oFieldHelp.getValidateInput()) {
						return _returnUserInput.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
					}
					throw new ParseException(oException.message); // use ParseException because normally here a FormatException is returned
				}.bind(this));
			}
		}

		if (sDescription) {
			oCondition.values[1] = sDescription;
		} else {
			oCondition.values[1] = null;
			// not found in help
			if (bCheckForDefault) {
				// use default operator
				return _parseUseDefaultOperator.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
			} else if (!oFieldHelp.getValidateInput()) {
				return _returnUserInput.call(this, oType, oFilterOperatorConfig, vValue, sDisplay);
			}

			// TODO: fire exception in every case? (whats about "ComboBox" behaviour?)
			if (oException) {
				// exception given -> use this one
				throw oException;
			} else {
				throw new ParseException(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [vValue])); // use original value in message
			}
		}

		return oCondition;

	}

	function _parseUseDefaultOperator(oType, oFilterOperatorConfig, vValue, sDisplay) {

		var sType = oType.getMetadata().getName();
		var sDefaultOperator = oFilterOperatorConfig.getDefaultOperator(sType);
		var oOperator = oFilterOperatorConfig.getOperator(sDefaultOperator);
		var sValue = oOperator ? oOperator.format([vValue]) : vValue;
		var oCondition = oOperator.getCondition(sValue, oType, sDisplay);

		return oCondition;

	}

	function _returnUserInput(oType, oFilterOperatorConfig, vValue, sDisplay) {

		// Field accepts values that are not found -> must be checked by caller
		// if user input fits to the type, let the caller validate it
		var sOperator;
		if (this.oFormatOptions.onlyEEQ) {
			sOperator = "EEQ";
		} else {
			// use EQ operator as EEQ is only for values from help.
			sOperator = "EQ";
		}
		var sValue = oType.parseValue(vValue, "string");
		return Condition.createCondition(sOperator, [sValue]);

	}

	ConditionType.prototype.validateValue = function(oCondition) {

		var oType = _getValueType.call(this);

		if (oCondition === undefined) {
			return null;
		} else if (oCondition === null) {
			// check if type allows to be null
			if (this.oFormatOptions.onlyEEQ) {
				// TODO: also for FilterField case?
				try {
					oType.validateValue(null);
				} catch (oError) {
					if (oError instanceof ValidateException) {
						throw oError;
					} else {
						//validation breaks with runtime error -> just ignore
						//TODO: is this the right way?
						return null;
					}
				}
			}
			return null;
		}

		if (typeof oCondition !== "object" || !oCondition.operator || !oCondition.values ||
				!Array.isArray(oCondition.values)) {
			throw new ValidateException(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));
		}

		var oFilterOperatorConfig = _getFilterOperatorConfig.call(this);

		var oOperator = oFilterOperatorConfig.getOperator(oCondition.operator);
		oOperator.validate(oCondition.values, oType);

	};

	function _getDisplay() {

		var sDisplay = this.oFormatOptions.display;
		if (!sDisplay) {
			sDisplay = FieldDisplay.Value;
		}

		return sDisplay;

	}

	function _getValueType() {

		var oType = this.oFormatOptions.valueType;
		if (!oType) {
			// no type provided -> use string type as default
			if (!this._oDefaultType) {
				this._oDefaultType = new StringType();
			}
			oType = this._oDefaultType;
		}

		return oType;

	}

	function _getOriginalDateType() {

		return this.oFormatOptions.originalDateType;

	}

	function _getFilterOperatorConfig() {

		var oFilterOperatorConfig = this.oFormatOptions.filterOperatorConfig;
		if (!oFilterOperatorConfig) {
			if (!this._oFilterOperatorConfig) {
				this._oFilterOperatorConfig = new FilterOperatorConfig();
			}
			oFilterOperatorConfig = this._oFilterOperatorConfig;
		}

		return oFilterOperatorConfig;

	}

	function _getFieldHelp() {

		var sID = this.oFormatOptions.fieldHelpID;
		if (sID) {
			return sap.ui.getCore().byId(sID);
		}

		return null;

	}

	function _isCompositeType(oType) {
		return oType && oType.isA("sap.ui.model.CompositeType");
	}

	function _attachCurrentValueAtType(oCondition, oType) {
		if (_isCompositeType.call(this, oType) && oCondition && oCondition.values[0]) {
				oType._aCurrentValue = oCondition.values[0];
		}
	}

	return ConditionType;

});
