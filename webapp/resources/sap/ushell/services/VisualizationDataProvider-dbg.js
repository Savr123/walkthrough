// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 *
 * <p>This module deals with the retrieval of visualization data in a platform independent way.</p>
 *
 * @version 1.69.1
 */

sap.ui.define([], function () {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("VisualizationDataProvider")</code>.
     * Constructs a new instance of the visualization data provider service.
     *
     * @namespace sap.ushell.services.VisualizationDataProvider
     *
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @experimental Since 1.68.0
     *
     * @private
     */
    function VisualizationDataProvider () {
        this._init.apply(this, arguments);
    }

    /**
     * Private initializer.
     *
     * @param {object} launchPageAdapter The LaunchPageAdapter for the specific platform.
     * @experimental Since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype._init = function (launchPageAdapter) {
        this.oLaunchPageAdapter = launchPageAdapter;
    };

    /**
     * An object representing a visualization in a format which is independent of the adapter.
     * @typedef {object} VisualizationData
     * @property {string} object.title The title.
     * @property {string} object.subTitle The subtitle.
     * @property {string} object.icon The icon.
     * @property {string} object.info The info.
     * @property {string} object.size The size.
     */

    /**
     * Retrieves and returns all visualization data.
     *
     * @returns {Promise<Object.<string,VisualizationData>>} The visualization data.
     * @experimental Since 1.68.0
     *
     * @private
     */
    VisualizationDataProvider.prototype.getVisualizationData = function () {
        var oLaunchPageAdapter = this.oLaunchPageAdapter;
        return new Promise(function (resolve, reject) {
            oLaunchPageAdapter.getCatalogs().then(function (catalogs) {
                var aDeferreds = [];
                var aCatalogTiles = [];
                var aFlattenedCatalogTiles = [];
                var oCatalogTiles = {};

                for (var i = 0; i < catalogs.length; i++) {
                    aDeferreds.push(oLaunchPageAdapter.getCatalogTiles(catalogs[i]).then(function (catalogTile) {
                        aCatalogTiles.push(catalogTile);
                    }));
                }

                jQuery.when.apply(null, aDeferreds).done(function () {
                    // Convert a two-dimensional array into a flat array
                    aFlattenedCatalogTiles = [].concat.apply([], aCatalogTiles);
                    for (var y = 0; y < aFlattenedCatalogTiles.length; y++) {
                        oCatalogTiles[oLaunchPageAdapter.getCatalogTileId(aFlattenedCatalogTiles[y])] = {
                            title: oLaunchPageAdapter.getCatalogTilePreviewTitle(aFlattenedCatalogTiles[y]),
                            subTitle: oLaunchPageAdapter.getCatalogTilePreviewSubtitle(aFlattenedCatalogTiles[y]),
                            icon: oLaunchPageAdapter.getCatalogTilePreviewIcon(aFlattenedCatalogTiles[y]),
                            info: oLaunchPageAdapter.getCatalogTilePreviewInfo(aFlattenedCatalogTiles[y]),
                            size: oLaunchPageAdapter.getCatalogTileSize(aFlattenedCatalogTiles[y]),
                            // The special custom tile logic is not needed on all the platforms so it doesn't have to be implemented
                            isCustomTile: oLaunchPageAdapter.isCustomTile && oLaunchPageAdapter.isCustomTile(aFlattenedCatalogTiles[y])
                        };
                    }
                    resolve(oCatalogTiles);
                }).fail(reject);
            }).fail(reject);
        });
    };

    VisualizationDataProvider.hasNoAdapter = false;
    return VisualizationDataProvider;
});