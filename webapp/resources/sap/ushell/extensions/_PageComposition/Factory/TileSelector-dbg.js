// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/extensions/_PageComposition/Factory/utils",
    "sap/ushell/ui/pagecomposer/TileSelector.controller"
], function (JSONModel, oFactoryUtils, oTileSelectorController) {
    "use strict";

    // Promise used to avoid setting up the XML fragment twice
    var oFragmentPromise = null;

    /**
     * Lazily create and open the tile selector.
     *
     * @param {function} fnLoadData
     *   A function that loads the required data and returns a promise
     *
     * @param {string} sGroupTitle
     *   The title of the group to display in the tile selector dialog.
     *
     * @return {Promise}
     *   A promise that always resolves with the
     *   original ids of the selected tiles, or an empty array if the dialog is
     *   closed and no tiles are selected.
     *
     * @protected
     */
    function selectTiles (fnLoadData, sGroupTitle) {

        function setBusy (bBusy) {
            var oShellControl = sap.ui.getCore().byId("viewPortContainer");
            if (oShellControl) {
                oShellControl.setBusy(bBusy);
            }
        }

        return new Promise(function (fnResolve, fnReject) {
            if (!oFragmentPromise) {
                setBusy(true);

                var oModel = new JSONModel({
                    groupTitle: sGroupTitle,
                    searchText: "",
                    catalogTiles: []
                });
                oFragmentPromise = oFactoryUtils.setupXMLFragment(
                    "sap.ushell.ui.pagecomposer.TileSelector",
                    oModel,
                    oTileSelectorController
                );

                fnLoadData()
                    .then(function (aItems) {
                        oModel.setProperty("/catalogTiles", aItems);
                    })
                    .finally(function () {
                        setBusy(false);
                    });
            }

            return oFragmentPromise.then(function (oFragment) {
                oFragment._resolveSelectedItemsPromise = fnResolve;
                oTileSelectorController.reset(sGroupTitle);

                oFragment.open();
            });
        });
    }

    /**
     * Load and prepare the catalog tile data to be rendered in the tile
     * selector.
     *
     * @return {Promise}
     *  A promise that resolves with an array of catalog tile data to display
     *  in the tile selector.
     *
     * @private
     */
    function loadCatalogTileData () {
        var aCatalogTitles = [];
        var oService = sap.ushell.Container.getService("LaunchPage");

        // get the tiles and save catalog titles for display
        function getTiles (aCatalogs) {
            aCatalogTitles = aCatalogs.map(function (oCatalog) {
                var sCatalogId = oService.getCatalogId(oCatalog) || "";
                return oService.getCatalogTitle(oCatalog) || sCatalogId.split(":").slice(1).join(":");
            });

            // CDM catalogs do not have the tiles[] array, get the tiles in a separate call
            return Promise.all(aCatalogs.map(function (oCatalog) {
                return oService.getCatalogTiles(oCatalog);
            }));
        }

        // create list items data
        function createItems (aData) {
            var aItems = [];
            aData.forEach(function (aTiles, index) {
                aTiles.forEach(function (oTile) {
                    aItems.push({
                        id: oService.getCatalogTileId(oTile),
                        title: oService.getCatalogTilePreviewTitle(oTile),
                        icon: oService.getCatalogTilePreviewIcon(oTile),
                        info: oService.getCatalogTilePreviewSubtitle(oTile) || aCatalogTitles[index]
                    });
                });
            });
            return aItems;
        }

        return Promise.resolve(oService.getCatalogs())
            .then(getTiles)
            .then(createItems);
    }

    /**
     * Create a tile selector.
     *
     * @param {function} fnLoadData
     *   A function that:
     *   - loads the necessary data into the corresponding
     *   <code>sap/ushell/Config</code> configuration entry
     *   - returns a promise that is resolved when the data are emitted in the
     *   configuration.
     *
     * @return {object} a blackbox with the following methods:
     *
     * - selectTiles(sGroupName) : Promise
     *
     * @protected
     */
    function create (fnLoadData) {
        //
        // Tile selector is created lazily on API call
        //
        return {
            selectTiles: selectTiles.bind(null, fnLoadData)
        };
    }

    return {
        create: create,
        loadCatalogTileData: loadCatalogTileData
    };

});
