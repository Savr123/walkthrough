/*
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"../library",
	"./RowMode",
	"../TableUtils"
], function(
	library,
	RowMode,
	TableUtils
) {
	"use strict";

	/**
	 * Constructor for a new fixed row mode.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @private
	 * @class
	 * TODO: Class description
	 * @extends sap.ui.table.rowmodes.RowMode
	 * @constructor
	 * @alias sap.ui.table.rowmodes.FixedRowMode
	 * @ui5-restricted sap.ui.mdc
	 *
	 * @author SAP SE
	 * @version 1.69.1
	 *
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FixedRowMode = RowMode.extend("sap.ui.table.rowmodes.FixedRowMode", /** @lends sap.ui.table.rowmodes.FixedRowMode.prototype */ {
		metadata: {
			library: "sap.ui.table",
			properties: {
				rowContentHeight: {type: "int", defaultValue: 0, group: "Appearance"},
				hideEmptyRows: {type: "boolean", defaultValue: false, group: "Appearance"}
			}
		},
		constructor: function(sId) {
			Object.defineProperty(this, "bLegacy", {
				value: typeof sId === "boolean" ? sId : false
			});

			if (this.bLegacy) {
				RowMode.call(this);
			} else {
				RowMode.apply(this, arguments);
			}
		}
	});

	var TableDelegate = {};

	FixedRowMode.prototype.init = function() {
		RowMode.prototype.init.call(this, TableDelegate);
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	FixedRowMode.prototype.getRowCount = function() {
		return this.bLegacy ? this.getTable().getVisibleRowCount() : this.getProperty("rowCount");
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	FixedRowMode.prototype.getFixedTopRowCount = function() {
		return this.bLegacy ? this.getTable().getFixedRowCount() : this.getProperty("fixedTopRowCount");
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	FixedRowMode.prototype.getFixedBottomRowCount = function() {
		return this.bLegacy ? this.getTable().getFixedBottomRowCount() : this.getProperty("fixedBottomRowCount");
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	FixedRowMode.prototype.getRowContentHeight = function() {
		return this.bLegacy ? this.getTable().getRowHeight() : this.getProperty("rowContentHeight");
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getMinRequestLength = function() {
		return Math.max(0, this.getRowCount());
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getComputedRowCounts = function() {
		var iRowCount = this.getRowCount();
		var iFixedTopRowCount = this.getFixedTopRowCount();
		var iFixedBottomRowCount = this.getFixedBottomRowCount();

		if (this.getHideEmptyRows()) {
			iRowCount = Math.min(iRowCount, this.getTotalRowCountOfTable());
		}

		return this.sanitizeRowCounts(iRowCount, iFixedTopRowCount, iFixedBottomRowCount);
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getTableStyles = function() {
		return {
			height: "auto"
		};
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getTableBottomPlaceholderStyles = function() {
		if (!this.getHideEmptyRows()) {
			return undefined;
		}

		var iRowCountDelta = Math.max(0, this.getRowCount() - this.getComputedRowCounts().count);

		return {
			height: iRowCountDelta * this.getBaseRowHeightOfTable() + "px"
		};
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getRowContainerStyles = function() {
		var sHeight = this.getComputedRowCounts().count * this.getBaseRowHeightOfTable() + "px";

		if (this.bLegacy && !TableUtils.isVariableRowHeightEnabled(this.getTable())) {
			return {minHeight: sHeight};
		} else {
			return {height: sHeight};
		}
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.renderRowStyles = function(oRM) {
		var iRowContentHeight = this.getRowContentHeight();

		if (iRowContentHeight > 0) {
			oRM.style("height", this.getBaseRowHeightOfTable() + "px");
		}
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.renderCellContentStyles = function(oRM) {
		var iRowContentHeight = this.getRowContentHeight();

		if (this.bLegacy) {
			return;
		}

		if (iRowContentHeight <= 0) {
			iRowContentHeight = this.getDefaultRowContentHeightOfTable();
		}

		if (iRowContentHeight > 0) {
			oRM.style("max-height", iRowContentHeight + "px");
		}
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.getBaseRowContentHeight = function() {
		return Math.max(0, this.getRowContentHeight());
	};

	/**
	 * @inheritDoc
	 */
	FixedRowMode.prototype.refreshRows = function() {
		// The computed row count cannot be used here, because the table's total row count (binding length) is not known yet.
		var iRowCount = this.getRowCount();

		if (iRowCount > 0) {
			this.initTableRowsAfterDataRequested(iRowCount);
			this.getRowContexts(iRowCount, true); // Trigger data request.
		}
	};

	TableDelegate.onBeforeRendering = function(oEvent) {
		var bRenderedRows = oEvent && oEvent.isMarked("renderRows");

		if (!bRenderedRows) {
			this.updateTable(TableUtils.RowsUpdateReason.Render);
		}
	};

	TableDelegate.onAfterRendering = function(oEvent) {
		var oTable = this.getTable();
		var bRenderedRows = oEvent && oEvent.isMarked("renderRows");

		if (!bRenderedRows && oTable.getRows().length > 0) {
			oTable._fireRowsUpdated(TableUtils.RowsUpdateReason.Render);
		}
	};

	return FixedRowMode;
});