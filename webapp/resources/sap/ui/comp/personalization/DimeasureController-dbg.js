/* eslint-disable strict */

/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */

// Provides DimeasureController
sap.ui.define([
	'./BaseController', 'sap/m/library', 'sap/ui/comp/library', './ChartWrapper', './Util', 'sap/ui/comp/odata/ChartMetadata'
], function(BaseController, MLibrary, CompLibrary, ChartWrapper, Util, ChartMetadata) {
	"use strict";

	/**
	 * The DimeasureController can be used to...
	 *
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP SE
	 * @version 1.69.1
	 * @private
	 * @since 1.34.0
	 * @alias sap.ui.comp.DimeasureController
	 */
	var DimeasureController = BaseController.extend("sap.ui.comp.personalization.DimeasureController", /** @lends sap.ui.comp.personalization.DimeasureController */

	{
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType(MLibrary.P13nPanelType.dimeasure);
			this.setItemType(MLibrary.P13nPanelType.dimeasure + "Items");
		},
		metadata: {
			events: {
				afterDimeasureModelDataChange: {}
			}
		}
	});

	DimeasureController.prototype.setTable = function(oTable) {
		BaseController.prototype.setTable.apply(this, arguments);

		if (this.getTableType() !== CompLibrary.personalization.TableType.ChartWrapper) {
			throw "The provided object is incorrect. 'oTable' has to be an instance of sap.ui.comp.personalization.ChartWrapper. ";
		}

		var oChart = oTable.getChartObject();
		oChart.detachDrilledDown(this._onDrilledDown, this);
		oChart.attachDrilledDown(this._onDrilledDown, this);
		oChart.detachDrilledUp(this._onDrilledUp, this);
		oChart.attachDrilledUp(this._onDrilledUp, this);

		this._monkeyPatchTable(oChart);
	};

	DimeasureController.prototype._monkeyPatchTable = function(oChart) {
		var that = this;
		var fSetChartTypeOrigin = oChart.setChartType.bind(oChart);
		var fSetChartTypeOverwritten = function(sChartType) {
			fSetChartTypeOrigin(sChartType);
			that._onSetChartType(sChartType);
		};
		if (oChart.setChartType.toString() === fSetChartTypeOverwritten.toString()) {
			// Do nothing if due to recursion the method is already overwritten.
			return;
		}
		oChart.setChartType = fSetChartTypeOverwritten;
	};
	DimeasureController.prototype._onSetChartType = function(sChartType) {
		var oControlData = this.getControlData();

		if (!sChartType || sChartType === oControlData.dimeasure.chartTypeKey) {
			return;
		}
		this.fireBeforePotentialTableChange();

		// 1. update 'controlData'
		oControlData.dimeasure.chartTypeKey = sChartType;

		// 2. update 'controlDataBase'
		this.updateControlDataBaseFromJson(oControlData);

		this.fireAfterPotentialTableChange();
		this.fireAfterDimeasureModelDataChange();
	};

	DimeasureController.prototype._onDrilledDown = function(oEvent) {
		this.fireBeforePotentialTableChange();

		this._addVisibleDimensions(oEvent.getParameter("dimensions") || []);

		this.fireAfterPotentialTableChange();
		this.fireAfterDimeasureModelDataChange();
	};
	DimeasureController.prototype._addVisibleDimensions = function(aDimensions) {
		if (!aDimensions.length) {
			return;
		}
		var oControlData = this.getControlData();
		// Determine the last visible dimension ignoring the passed ones. Assumption: that the dimeasureItems are sorted by index.
		var sColumnKeyOfLastVisibleDimension = oControlData.dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.visible && oMItem.aggregationRole === CompLibrary.personalization.AggregationRole.Dimension && aDimensions.indexOf(oMItem.columnKey) < 0;
		}).reduce(function(sColumnKey, oMItem) {
			return oMItem.columnKey;
		}, "");
		aDimensions.forEach(function(sColumnKey) {
			var iIndexTo = Util.getIndexByKey("columnKey", sColumnKeyOfLastVisibleDimension, oControlData.dimeasure.dimeasureItems) + 1;
			var iIndexFrom = Util.getIndexByKey("columnKey", sColumnKey, oControlData.dimeasure.dimeasureItems);

			sColumnKeyOfLastVisibleDimension = sColumnKey;

			if (iIndexFrom < 0 || iIndexTo < 0 || iIndexFrom > oControlData.dimeasure.dimeasureItems.length - 1 || iIndexTo > oControlData.dimeasure.dimeasureItems.length - 1) {
				return;
			}

			// 1. update 'controlData'
			var aMItem = oControlData.dimeasure.dimeasureItems.splice(iIndexFrom, 1);
			aMItem[0].visible = true;
			oControlData.dimeasure.dimeasureItems.splice(iIndexTo, 0, aMItem[0]);

			var iItemIndex = -1;
			oControlData.dimeasure.dimeasureItems.forEach(function(oMItem) {
				if (oMItem.index !== undefined) {
					oMItem.index = ++iItemIndex;
				}
			});

			// 2. update 'controlDataBase'
			this.updateControlDataBaseFromJson(oControlData);
		}, this);
	};
	DimeasureController.prototype._onDrilledUp = function(oEvent) {
		this.fireBeforePotentialTableChange();

		var oControlData = this.getControlData();
		var aInvisibleDimensions = oEvent.getParameter("dimensions") || [];
		aInvisibleDimensions.forEach(function(sColumnKey) {
			// 1. update dimeasureItem in 'controlData'
			var oMItem = Util.getArrayElementByKey("columnKey", sColumnKey, oControlData.dimeasure.dimeasureItems);
			if (!oMItem) {
				throw "No entry found in 'controlDataBase' for columnKey '" + sColumnKey + "'";
			}
			oMItem.visible = false;

			// 2. update 'controlDataBase'
			this.updateControlDataBaseFromJson(oControlData);
		}, this);

		this.fireAfterPotentialTableChange();
		this.fireAfterDimeasureModelDataChange();
	};

	DimeasureController.prototype.getColumn2Json = function(oColumn, sColumnKey, iIndex) {
		if (!Util.isAggregatable(oColumn)) {
			return null;
		}
		return {
			columnKey: sColumnKey,
			index: iIndex,
			visible: oColumn.getVisible(),
			role: oColumn.getRole(),
			aggregationRole: oColumn.getAggregationRole()
		// this transient data we only keep in order to recognise internally in DimeasureController whether this is a dimension or measure
		};
	};
	DimeasureController.prototype.getAdditionalData2Json = function(oJsonData, oTable) {
		var oChart = oTable.getChartObject();
		oJsonData.dimeasure.chartTypeKey = oChart.getChartType();
	};
	DimeasureController.prototype.getColumn2JsonTransient = function(oColumn, sColumnKey, sText, sTooltip) {
		if (!Util.isAggregatable(oColumn)) {
			return null;
		}
		return {
			columnKey: sColumnKey,
			text: sText,
			tooltip: sTooltip,
			aggregationRole: oColumn.getAggregationRole()
		};
	};
	DimeasureController.prototype.handleIgnore = function(oJson, iIndex) {
		oJson.dimeasure.dimeasureItems[iIndex].visible = false;
	};
	DimeasureController.prototype.syncJson2Table = function(oJson) {
		var oChart = this.getTable().getChartObject();
		var fUpdateSelectedEntities = function(aDimeasureItems, aSelectedEntitiesOld, fSetSelectedEntities, fGetDimeasureByName) {
			var aDimeasureItemsCopy = Util.copy(aDimeasureItems);
			aDimeasureItemsCopy.sort(DimeasureController._sortByIndex);
			var aSelectedEntitiesNew = [];
			aDimeasureItemsCopy.forEach(function(oDimeasureItem) {
				if (oDimeasureItem.visible === true) {
					aSelectedEntitiesNew.push(oDimeasureItem.columnKey);
					var oDimeasure = fGetDimeasureByName(oDimeasureItem.columnKey);
					if (oDimeasure) {
						oDimeasure.setRole(oDimeasureItem.role);
					}
				}
			});
			if (JSON.stringify(aSelectedEntitiesNew) !== JSON.stringify(aSelectedEntitiesOld)) {
				fSetSelectedEntities(aSelectedEntitiesNew);
			}
		};

		// Apply changes to the Chart
		this.fireBeforePotentialTableChange();

		var aDimensionItems = oJson.dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.aggregationRole === CompLibrary.personalization.AggregationRole.Dimension;
		});
		var aMeasureItems = oJson.dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.aggregationRole === CompLibrary.personalization.AggregationRole.Measure;
		});

		var aVisibleDimensions = oChart.getVisibleDimensions();
		fUpdateSelectedEntities(aDimensionItems, aVisibleDimensions, oChart.setVisibleDimensions.bind(oChart), oChart.getDimensionByName.bind(oChart));
		var aVisibleMeasures = oChart.getVisibleMeasures();
		fUpdateSelectedEntities(aMeasureItems, aVisibleMeasures, oChart.setVisibleMeasures.bind(oChart), oChart.getMeasureByName.bind(oChart));

		oChart.setChartType(oJson.dimeasure.chartTypeKey);

		this.fireAfterPotentialTableChange();
	};

	/**
	 * Similar to 'getTable2Json'
	 */
	DimeasureController.prototype.getDataSuiteFormat2Json = function(oDataSuiteFormat) {
		var oJson = this.createControlDataStructure();
		var fnAddItemProperty = function(sColumnKey, sPropertyName, oPropertyValue) {
			var iIndex = Util.getIndexByKey("columnKey", sColumnKey, oJson.dimeasure.dimeasureItems);
			if (iIndex < 0) {
				iIndex = oJson.dimeasure.dimeasureItems.length;
				oJson.dimeasure.dimeasureItems.splice(iIndex, 0, {
					columnKey: sColumnKey
				});
			}
			oJson.dimeasure.dimeasureItems[iIndex][sPropertyName] = oPropertyValue;
		};

		// Based on 'controlDataInitial' set all 'visible' dimeasures as 'invisible'
		this.getControlDataInitial().dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.visible === true;
		}).forEach(function(oMItem) {
			fnAddItemProperty(oMItem.columnKey, "visible", false);
		});

		// Take over 'Visualizations'
		if (oDataSuiteFormat.Visualizations && oDataSuiteFormat.Visualizations.length) {
			var aChartVisualizations = oDataSuiteFormat.Visualizations.filter(function(oVisualization) {
				return oVisualization.Type === "Chart";
			});
			if (aChartVisualizations.length) {
				var iVisibleDimensionsLength = 0;
				if (aChartVisualizations[0].Content.Dimensions.length) {
					iVisibleDimensionsLength = aChartVisualizations[0].Content.Dimensions.length;
					aChartVisualizations[0].Content.Dimensions.forEach(function(sName, iIndex) {
						var oAttribute = Util.getArrayElementByKey("Dimension", sName, aChartVisualizations[0].Content.DimensionAttributes);
						fnAddItemProperty(sName, "visible", true);
						fnAddItemProperty(sName, "index", iIndex);
						if (oAttribute && oAttribute.Role) {
							fnAddItemProperty(sName, "role", ChartMetadata.getDimensionRole(oAttribute.Role));
						}
						fnAddItemProperty(sName, "aggregationRole", CompLibrary.personalization.AggregationRole.Dimension);
					}, this);
				}
				if (aChartVisualizations[0].Content.Measures.length) {
					aChartVisualizations[0].Content.Measures.forEach(function(sName, iIndex) {
						var oAttribute = Util.getArrayElementByKey("Measure", sName, aChartVisualizations[0].Content.MeasureAttributes);
						fnAddItemProperty(sName, "visible", true);
						fnAddItemProperty(sName, "index", iVisibleDimensionsLength + iIndex);
						if (oAttribute && oAttribute.Role) {
							fnAddItemProperty(sName, "role", ChartMetadata.getMeasureRole(oAttribute.Role));
						}
						fnAddItemProperty(sName, "aggregationRole", CompLibrary.personalization.AggregationRole.Measure);
					}, this);
				}
			}
			// Note: if runtime error occurs because sap.chart library has not been loaded (there is dependency to sap.chart inside of sap.ui.comp.odata.ChartMetadata) then the caller of DimeasureController has to load the sap.chart library.
			oJson.dimeasure.chartTypeKey = ChartMetadata.getChartType(aChartVisualizations[0].Content.ChartType);
		}
		return oJson;
	};
	/**
	 * Creates, if not already exists, property <code>Visualizations</code> in <code>oDataSuiteFormat</code> object if at least one dimeasure item exists. Adds an object of the current PersistentData snapshot into <code>Visualizations</code> array.
	 * @param {object} oDataSuiteFormat Structure of Data Suite Format
	 */
	DimeasureController.prototype.getDataSuiteFormatSnapshot = function(oDataSuiteFormat) {
		var oControlDataTotal = this.getUnionData(this.getControlDataInitial(), this.getControlData());
		if (!oControlDataTotal.dimeasure || !oControlDataTotal.dimeasure.dimeasureItems || !oControlDataTotal.dimeasure.dimeasureItems.length) {
			return;
		}

		// Fill 'Visualizations'
		var aDimensionItemsVisible = oControlDataTotal.dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.aggregationRole === CompLibrary.personalization.AggregationRole.Dimension;
		}).filter(function(oMItem) {
			return oMItem.visible === true;
		});
		var aMeasureItemsVisible = oControlDataTotal.dimeasure.dimeasureItems.filter(function(oMItem) {
			return oMItem.aggregationRole === CompLibrary.personalization.AggregationRole.Measure;
		}).filter(function(oMItem) {
			return oMItem.visible === true;
		});
		if (aDimensionItemsVisible.length || aMeasureItemsVisible.length) {
			if (!oDataSuiteFormat.Visualizations) {
				oDataSuiteFormat.Visualizations = [];
			}
			oDataSuiteFormat.Visualizations.push({
				Type: "Chart",
				Content: {
					// Note: if runtime error occurs because sap.chart library has not been loaded (there is dependency to sap.chart inside of sap.ui.comp.odata.ChartMetadata) then the caller of DimeasureController has to load the sap.chart library.
					ChartType: ChartMetadata.getAnnotationChartType(oControlDataTotal.dimeasure.chartTypeKey),
					Dimensions: aDimensionItemsVisible.map(function(oDimensionItem) {
						return oDimensionItem.columnKey;
					}),
					DimensionAttributes: aDimensionItemsVisible.map(function(oDimensionItem) {
						return {
							Dimension: oDimensionItem.columnKey,
							Role: ChartMetadata.getAnnotationDimensionRole(oDimensionItem.role)
						};
					}),
					Measures: aMeasureItemsVisible.map(function(oMeasureItem) {
						return oMeasureItem.columnKey;
					}),
					MeasureAttributes: aMeasureItemsVisible.map(function(oMeasureItem) {
						return {
							Measure: oMeasureItem.columnKey,
							Role: ChartMetadata.getAnnotationMeasureRole(oMeasureItem.role)
						};
					})
				}
			});
		}
	};

	/**
	 * Returns a ColumnsPanel control
	 *
	 * @param {object} oPayload Payload
	 * @returns {Promise} A <code>Promise</code> for asynchronous execution with parameter of type {sap.m.P13nDimMeasurePanel}
	 */
	DimeasureController.prototype.getPanel = function(oPayload) {
		// Note: in the time where controller gets the panel all table dimeasure are present (also missing dimeasure).
		// Note: in case that all aggregatable dimeasure are excluded we nevertheless have to create the panel for the case that some aggregatable dimeasure will be included.
		if (!Util.hasAggregatableColumns(this.getColumnMap())) {
			return null;
		}
		var aAvailableChartTypes = (oPayload && oPayload.availableChartTypes) ? oPayload.availableChartTypes : [];

		return new Promise(function(resolve) {
			// Dynamically load panel once it is needed
			sap.ui.require([
				'sap/m/P13nDimMeasurePanel', 'sap/m/P13nItem', 'sap/m/P13nDimMeasureItem'
			], function(P13nDimMeasurePanel, P13nItem, P13nDimMeasureItem) {
				return resolve(new P13nDimMeasurePanel({
					availableChartTypes: aAvailableChartTypes,
					chartTypeKey: "{$sapmP13nPanel>/controlDataReduce/dimeasure/chartTypeKey}",
					items: {
						path: '$sapmP13nPanel>/transientData/dimeasure/dimeasureItems',
						template: new P13nItem({
							columnKey: '{$sapmP13nPanel>columnKey}',
							text: '{$sapmP13nPanel>text}',
							tooltip: '{$sapmP13nPanel>tooltip}',
							aggregationRole: '{$sapmP13nPanel>aggregationRole}'
						})
					},
					dimMeasureItems: {
						path: "$sapmP13nPanel>/controlDataReduce/dimeasure/dimeasureItems",
						template: new P13nDimMeasureItem({
							columnKey: "{$sapmP13nPanel>columnKey}",
							index: "{$sapmP13nPanel>index}",
							visible: "{$sapmP13nPanel>visible}",
							role: "{$sapmP13nPanel>role}"
						})
					},
					beforeNavigationTo: this.setModelFunction(),
					changeChartType: function(oEvent) {
						var oControlDataReduce = this.getControlDataReduce();
						oControlDataReduce.dimeasure.chartTypeKey = oEvent.getParameter("chartTypeKey");
						this.setControlDataReduce2Model(oControlDataReduce);
						this.fireAfterPotentialModelChange({
							json: oControlDataReduce
						});
					}.bind(this),
					changeDimMeasureItems: function(oEvent) {
						if (!oEvent.getParameter("items")) {
							return;
						}
						var aItemsChanged = oEvent.getParameter("items");
						var oControlDataReduce = this.getControlDataReduce();
						oControlDataReduce.dimeasure.dimeasureItems.forEach(function(oMItemReduce) {
							var oMItemChanged = Util.getArrayElementByKey("columnKey", oMItemReduce.columnKey, aItemsChanged);
							if (!oMItemChanged) {
								return;
							}
							// We can not just take over the 'items' from P13nDimMeasurePanel and overwrite the 'controlDataReduce' because
							// the 'items' structure does not contain all parameters of 'controlDataReduce' (e.g. 'aggregationRole')
							oMItemReduce.index = oMItemChanged.index;
							oMItemReduce.visible = oMItemChanged.visible;
							oMItemReduce.role = oMItemChanged.role;
						});
						this.setControlDataReduce2Model(oControlDataReduce);
						this.fireAfterPotentialModelChange({
							json: oControlDataReduce
						});
					}.bind(this)
				}));
			}.bind(this));
		}.bind(this));
	};

	DimeasureController.prototype._isDimMeasureItemEqual = function(oDimMeasureItemA, oDimMeasureItemB) {
		if (!oDimMeasureItemA && !oDimMeasureItemB) {
			return true;
		}
		if (oDimMeasureItemA && !oDimMeasureItemB) {
			if (oDimMeasureItemA.index === -1 && oDimMeasureItemA.visible === false) {
				return true;
			}
			return false;
		}
		if (oDimMeasureItemB && !oDimMeasureItemA) {
			if (oDimMeasureItemB.index === -1 && oDimMeasureItemB.visible === false) {
				return true;
			}
			return false;
		}
		for ( var property in oDimMeasureItemA) {
			if (oDimMeasureItemB[property] === undefined || oDimMeasureItemA[property] !== oDimMeasureItemB[property]) {
				return false;
			}
		}
		return true;
	};

	DimeasureController.prototype._isSemanticEqual = function(oPersistentDataBase, oPersistentData) {
		if (oPersistentDataBase.dimeasure.chartTypeKey !== oPersistentData.dimeasure.chartTypeKey) {
			return false;
		}
		var fSort = function(a, b) {
			if (a.visible === true && (b.visible === false || b.visible === undefined)) {
				return -1;
			} else if ((a.visible === false || a.visible === undefined) && b.visible === true) {
				return 1;
			} else if (a.visible === true && b.visible === true) {
				if (a.index < b.index) {
					return -1;
				} else if (a.index > b.index) {
					return 1;
				} else {
					return 0;
				}
			} else if ((a.visible === false || a.visible === undefined) && (b.visible === false || b.visible === undefined)) {
				if (a.columnKey < b.columnKey) {
					return -1;
				} else if (a.columnKey > b.columnKey) {
					return 1;
				} else {
					return 0;
				}
			}
		};
		var aDimeasureItemsBase = Util.copy(oPersistentDataBase.dimeasure.dimeasureItems).sort(fSort);
		var aDimeasureItems = Util.copy(oPersistentData.dimeasure.dimeasureItems).sort(fSort);
		// if (aDimeasureItems.length !== aDimeasureItemsBase.length) {
		// return false;
		// }
		var bIsEqual = true;
		aDimeasureItemsBase.some(function(oDimeasureItem, iIndex) {
			if (!this._isDimMeasureItemEqual(oDimeasureItem, aDimeasureItems[iIndex])) {
				bIsEqual = false;
				return true;
			}
		}, this);
		return bIsEqual;
	};

	/**
	 * Operations on dimeasure are processed every time directly at the table. In case that something has been changed via Personalization Dialog or via
	 * user interaction at table, change is applied to the table.
	 *
	 * @param {object} oPersistentDataBase (new) JSON object
	 * @param {object} oPersistentDataCompare (old) JSON object
	 * @returns {object} that represents the change type, like: Unchanged || TableChanged || ModelChanged
	 */
	DimeasureController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.dimeasure || !oPersistentDataCompare.dimeasure.dimeasureItems) {
			return CompLibrary.personalization.ChangeType.Unchanged;
		}
		return this._isSemanticEqual(oPersistentDataBase, oPersistentDataCompare) ? CompLibrary.personalization.ChangeType.Unchanged : CompLibrary.personalization.ChangeType.TableChanged;
	};

	/**
	 * Result is XOR based difference = oPersistentDataBase - oPersistentDataCompare (new - old)
	 *
	 * @param {object} oPersistentDataBase (new) JSON object which represents the current model state (Restore+PersistentData)
	 * @param {object} oPersistentDataCompare (old) JSON object which represents AlreadyKnown || Restore
	 * @returns {object} JSON object or null
	 */
	DimeasureController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {

		if (!oPersistentDataBase || !oPersistentDataBase.dimeasure || !oPersistentDataBase.dimeasure.dimeasureItems) {
			return this.createControlDataStructure();
		}

		if (!oPersistentDataCompare || !oPersistentDataCompare.dimeasure || !oPersistentDataCompare.dimeasure.dimeasureItems) {
			return {
				chartTypeKey: oPersistentDataBase.dimeasure.chartTypeKey,
				dimeasure: Util.copy(oPersistentDataBase.dimeasure)
			};
		}
		if (!this._isSemanticEqual(oPersistentDataBase, oPersistentDataCompare)) {
			return {
				chartTypeKey: oPersistentDataBase.dimeasure.chartTypeKey,
				dimeasure: Util.copy(oPersistentDataBase.dimeasure)
			};
		}
		return null;
	};

	/**
	 * @param {object} oJsonBase: JSON object to which different properties from oDataNew are added. E.g. Restore
	 * @param {object} oJson: JSON object from where the different properties are added to oDataOld. E.g. CurrentVariant || PersistentData
	 * @returns {object} new JSON object as union result of oDataOld and oPersistentDataCompare
	 */
	DimeasureController.prototype.getUnionData = function(oJsonBase, oJson) {
		if (!oJson || !oJson.dimeasure || !oJson.dimeasure.dimeasureItems) {
			return Util.copy(oJsonBase);
		}
		var oUnion = Util.copy(oJson);

		Object.keys(oJsonBase.dimeasure).forEach(function(sAttribute) {
			if (Array.isArray(oJsonBase.dimeasure[sAttribute])) {
				oJsonBase.dimeasure[sAttribute].forEach(function(oMItemBase) {
					var oMItemUnion = Util.getArrayElementByKey("columnKey", oMItemBase.columnKey, oUnion.dimeasure[sAttribute]);
					if (!oMItemUnion) {
						oUnion.dimeasure[sAttribute].push(oMItemBase);
						return;
					}
					if (oMItemUnion.visible === undefined && oMItemBase.visible !== undefined) {
						oMItemUnion.visible = oMItemBase.visible;
					}
					if (oMItemUnion.role === undefined && oMItemBase.role !== undefined) {
						oMItemUnion.role = oMItemBase.role;
					}
					if (oMItemUnion.index === undefined && oMItemBase.index !== undefined) {
						oMItemUnion.index = oMItemBase.index;
					}
					if (oMItemUnion.aggregationRole === undefined && oMItemBase.aggregationRole !== undefined) {
						oMItemUnion.aggregationRole = oMItemBase.aggregationRole;
					}
				});
				return;
			}
			if (oUnion.dimeasure[sAttribute] === undefined && oJsonBase.dimeasure[sAttribute] !== undefined) {
				oUnion.dimeasure[sAttribute] = oJsonBase.dimeasure[sAttribute];
			}
		}, this);

		return oUnion;
	};

	/**
	 * Note: Attribute <code>index</code> can be undefined.
	 */
	DimeasureController._sortByIndex = function(a, b) {
		if (a.index !== undefined && b.index === undefined) {
			return -1;
		}
		if (b.index !== undefined && a.index === undefined) {
			return 1;
		}
		if (a.index < b.index) {
			return -1;
		}
		if (a.index > b.index) {
			return 1;
		}
		return 0;
	};

	DimeasureController.prototype.isChartConsistent = function(oControlDataReduce) {
		var oTable = this.getTable();
		if (!oTable) {
			return true;
		}
		var oChart = oTable.getChartObject();
		if (!oChart) {
			return true;
		}
		sap.ui.getCore().loadLibrary("sap.chart");
		try {
			var oResult = sap.chart.api.getChartTypeLayout(oControlDataReduce.dimeasure.chartTypeKey, oChart.getDimensions(), oChart.getMeasures());
			return oResult.errors.length === 0;
		} catch (oException) {
			return false;
		}
	};
	/**
	 * Cleans up before destruction.
	 *
	 * @private
	 */
	DimeasureController.prototype.exit = function() {
		BaseController.prototype.exit.apply(this, arguments);

		var oTable = this.getTable();
		if (oTable) {
			var oChart = oTable.getChartObject();
			if (oChart) {
				oChart.detachDrilledDown(this._onDrilledDown, this);
				oChart.detachDrilledUp(this._onDrilledUp, this);
			}
		}
	};

	/* eslint-enable strict */

	return DimeasureController;

}, /* bExport= */true);
