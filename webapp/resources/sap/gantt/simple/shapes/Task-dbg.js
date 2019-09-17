/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./Shape",
	"sap/gantt/library"
], function (Shape, library) {
	"use strict";

	var TaskType = library.simple.shapes.TaskType;

	var COMPLEX_SHAPE_MIN_WIDTH = 10;

	/**
	 * Creates and initializes a new Task class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * A shape representing one task.
	 *
	 * @extends sap.gantt.simple.shapes.Shape
	 *
	 * @author SAP SE
	 * @version 1.69.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.shapes.Task
	 * @since 1.69
	 */
	var Task = Shape.extend("sap.gantt.simple.shapes.Task", {
		metadata: {
			properties: {
				/**
				 * Type of the task.
				 */
				type: {type: "sap.gantt.simple.shapes.TaskType", defaultValue: TaskType.Normal},
				/**
				 * Position of utilisation information.
				 */
				utilizationDown: {type: "boolean", defaultValue: true}
			}
		}
	});

	Task.prototype._generateRectD = function (mSettings) {
		var iCenter = this.getRowYCenter(),
			sD = "";
		sD += "M " + mSettings.iStartX + " " + iCenter;
		var iUp = mSettings.iHeight / 2,
			iLen = mSettings.iEndX - mSettings.iStartX,
			iRadius = this.generateArcRadius(iUp, iLen);
		sD += " l 0 " + (-iUp + iRadius);
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
		iLen -= iRadius;
		var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
		iLen -= iRadius2;
		sD += " l " + iLen + " 0";
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
		sD += " l 0 " + (2 * iUp - iRadius2 - iRadius);
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + (-iRadius2) + " " + iRadius2;
		sD += " l " + (-iLen) + " 0";
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + (-iRadius) + " " + (-iRadius);
		sD += " Z";
		return sD;
	};

	Task.prototype.renderNoramlTask = function (oRm, mSettings) {
		var sD = this._generateRectD(mSettings);
		oRm.write("<path d=\"" + sD + "\" ");
		if (this.getHoverState()) {
			oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
		} else if (this.getSelected()) {
			oRm.write("fill=\"" + this.getSelectedColor() + "\"");
		} else {
			oRm.write("fill=\"" + this.getTranslatedColor() + "\"");
		}
		oRm.write(" />");
	};

	Task.prototype.renderSummaryTaskExpanded = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			var iCenter = this.getRowYCenter(),
				sD = "";
			sD += "M " + mSettings.iStartX + " " + iCenter;
			var iUp = mSettings.iHeight / 2,
				iLen = mSettings.iEndX - mSettings.iStartX,
				iRadius = this.generateArcRadius(iUp, iLen);
			sD += " l 0 " + (-iUp + iRadius);
			sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
			iLen -= iRadius;
			var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
			iLen -= iRadius2;
			sD += " l " + iLen + " 0";
			sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
			sD += " l 0 " + (2 * iUp - iRadius2 - 3);
			sD += " a 3 5 0 0 1 -5 0";
			sD += " l 0 " + (-2 * iUp + iRadius2 + 5);
			sD += " l " + (-iLen + 10 - iRadius - iRadius2) + " 0";
			sD += " l 0 " + (2 * iUp - iRadius - 5);
			sD += " a 3 5 0 0 1 -5 0";
			sD += " Z";
			oRm.write("<path d=\"" + sD + "\"");
			if (this.getHoverState()) {
				oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
			} else if (this.getSelected()) {
				oRm.write(" fill=\"" + this.getSelectedColor() + "\"");
				if (mSettings.bFromCollapsed) {
					oRm.write(" stroke-width=\"1.0001\" stroke=\"white\" shape-rendering=\"crispEdges\"");
				}
			} else {
				oRm.write(" fill=\"" + this.getTranslatedColor() + "\"");
			}
			oRm.write(" />");
		}
	};

	Task.prototype.renderSummaryTaskCollapsed = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			var sD = this._generateRectD(mSettings);
			oRm.write("<path d=\"" + sD + "\"");
			if (this.getHoverState()) {
				oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
			} else if (this.getSelected()) {
				oRm.write(" fill=\"" + this.getSelectedColor() + "\"");
			} else {
				oRm.write(" fill=\"" + this.getTranslatedColor() + "\" fill-opacity=\"0.7\"");
			}
			oRm.write(" />");
			this.renderSummaryTaskExpanded(oRm, Object.assign({}, mSettings, {bFromCollapsed: true}));
		}
	};

	Task.prototype.renderErrorTask = function (oRm, mSettings) {
		var sMaskId = this.getId() + "-mask",
			sPatternMask = this.getGanttChartBase().getId() + "-helperDef-linePattern",
			sD = this._generateRectD(mSettings),
			sStrokeColor,
			sFillColor;
		if (this.getHoverState()) {
			sStrokeColor = this.getHoverColor();
			sFillColor = this.getHoverBackgroundColor();
		} else if (this.getSelected()) {
			sStrokeColor = sFillColor = this.getSelectedColor();
		} else {
			sStrokeColor = sFillColor = this.getTranslatedColor();
		}
		oRm.write("<mask id=\"" + sMaskId + "\">");
		oRm.write("<path d=\"" + sD + "\" stroke=\"white\" stroke-width=\"1\" fill=\"url(#" + sPatternMask + ")\" />");
		oRm.write("</mask>");
		oRm.write("<path d=\"" + sD + "\" stroke=\"" + sStrokeColor + "\" stroke-width=\"1\" fill=\"" + sFillColor + "\" mask=\"url(#"
			+ sMaskId + ")\" />");
	};

	Task.prototype.renderElement = function (oRm) {
		oRm.write("<g");
		this.writeElementData(oRm);
		oRm.write(" pointer-events=\"bounding-box\">");
		var mSettings = {
			iHeight: this.getPixelHeight() - 12,
			iStartX: this.getXStart(),
			iEndX: this.getXEnd()
		};
		switch (this.getType()) {
			case TaskType.Normal:
				this.renderNoramlTask(oRm, mSettings);
				break;
			case TaskType.Error:
				this.renderErrorTask(oRm, mSettings);
				break;
			case TaskType.SummaryCollapsed:
				this.renderSummaryTaskCollapsed(oRm, mSettings);
				break;
			case TaskType.SummaryExpanded:
				this.renderSummaryTaskExpanded(oRm, mSettings);
				break;
			default:
				throw new Error("Unknown type of Task: " + this.getType());
		}
		oRm.write("</g>");
	};

	return Task;
});
