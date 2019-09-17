// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    /**
     * Formats the given date string to a language-specific format
     *
     * @param {string} sDate The date string
     * @returns {string} The formatted date string
     */
    var _formatDate = function (sDate) {
        var oDate = new Date(sDate);

        if (isNaN(oDate.getTime())) {
            return sDate;
        }

        var oFormat = DateFormat.getInstance({
            format: "yMMMd"
        });
        return oFormat.format(oDate);
    };

    /**
     * Returns the given string wrapped in strong tags
     *
     * @param {string} sText The text to format
     * @returns {string} The resulting string
     */
    var _formatBold = function (sText) {
        return "<strong>" + sText + "</strong>";
    };

    /**
     * Combines the date and bold formatters
     *
     * @param {string} sDate The date string
     * @returns {string} The formatted result
     */
    var _formatBoldDate = function (sDate) {
        return _formatBold(_formatDate(sDate));
    };


    /**
     * Creates the text for the delete modal
     *
     * @param {array} aItemsToDelete The page objects to delete
     * @returns {string} The formatted string
     * @private
     */
    var _deleteDialogText = function (aItemsToDelete) {
        return aItemsToDelete.map(function (oItemToDelete) {
            return oItemToDelete.content.id;
        }).join("\n");
    };

    return {
        date: _formatDate,
        bold: _formatBold,
        boldDate: _formatBoldDate,
        deleteDialogText: _deleteDialogText
    };

});

