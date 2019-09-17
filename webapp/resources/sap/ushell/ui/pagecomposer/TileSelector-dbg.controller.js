// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator"
], function (Filter, Sorter, FilterOperator) {
    "use strict";

    /**
     * @returns {object} the list control inside of the tile selector
     * @protected
     */
    function getList () {
        return sap.ui.getCore().byId("sapUshellTileSelector-list");
    }

    /**
     * @returns {object} the tile selector control
     * @protected
     */
    function getTileSelector () {
        return sap.ui.getCore().byId("sapUshellTileSelector");
    }

    var oTileSelectorController = {
        /**
         * Resets the tile selector
         * @param {string} sGroupTitle The group title which gets displayed in the dialog header.
         * @protected
         */
        reset: function (sGroupTitle) {
            var oTileSelectorModel = getTileSelector().getModel();
            oTileSelectorModel.setProperty("/groupTitle", sGroupTitle);
            oTileSelectorModel.setProperty("/searchText", "");

            this._onSearch();

            var oList = getList();
            oList.getSelectedItems().forEach(function (oItem) {
                oList.setSelectedItem(oItem, false);
            });
        },

        /**
         * Closes the tile selector
         * @private
         */
        _closeDialog: function () {
            getTileSelector().close();
        },

        /**
         * Checks what button was pressed to close the dialog and
         * resolves the Promise with an array of selected tiles
         *
         * @param {object} oEvent
         *   information on what triggered the close event
         *
         * @private
         */
        _onAfterClose: function (oEvent) {
            var aSelectedItems = [];
            var oOrigin = oEvent.getParameter("origin");

            if (oOrigin && oOrigin.getId() === "sapUshellTileSelector-okButton") {
                aSelectedItems = getList().getSelectedItems().map(function (oItem) {
                    return oItem.data("tileId");
                });
            }

            getTileSelector()._resolveSelectedItemsPromise(aSelectedItems);
        },

        /**
         * Searches tiles for the given search text
         *
         * @private
         */
        _onSearch: function () {
            var oTileSelector = getTileSelector();
            var sSearchText = oTileSelector.getModel().getProperty("/searchText");

            getList().getBinding("items").filter([
                new Filter([
                    new Filter("title", FilterOperator.Contains, sSearchText),
                    new Filter("info", FilterOperator.Contains, sSearchText)
                ], false)
            ]).sort(new Sorter("title"));
        }
    };

    return oTileSelectorController;
});
