// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PagePersistenceAdapter for the ABAP platform.
 * @version 1.69.1
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/model/odata/v2/ODataModel"
], function (ObjectPath, ODataModel) {
    "use strict";

    /**
    * Constructs a new instance of the PagePersistenceAdapter for the ABAP
    * platform
    *
    * @constructor
    *
    * @param {object} system The system information
    * @param {string} parameter The adapter parameter
    * @param {object} adapterConfiguration The adapter configuration
    *
    * @experimental Since 1.67.0
    * @private
    */
    var PagePersistenceAdapter = function (system, parameter, adapterConfiguration) {
        var sPagePersistenceServiceURL = (ObjectPath.get("config.serviceUrl", adapterConfiguration) || "").replace(/\/?$/, "/");

        this._oODataModel = new ODataModel({
            serviceUrl: sPagePersistenceServiceURL,
            headers: {
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": (system && system.getClient()) || sap.ushell.Container.getLogonSystem().getClient()
            },
            defaultCountMode: "None",
            skipMetadataAnnotationParsing: true,
            useBatch: false
        });

        this._oEtags = {};
    };

    /**
    * Returns a promise which resolves to an array of page headers of all available pages.
    *
    * @returns {Promise} Resolves to an array of page headers
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.getPages = function () {
        var oPromise = this._readPages()
            .then(function (pages) {
                for (var i = 0; i < pages.results.length; i++) {
                    this._storeETag(pages.results[i]);
                }
                return pages;
            }.bind(this))
            .then(this._convertODataToPageList)
            .catch(this._rejectWithErrorMessage);

        return oPromise;
    };

    /**
    * Returns a page
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.getPage = function (pageId) {
        var oPromise = this._readPage(pageId)
            .then(function (page) {
                this._storeETag(page);
                return page;
            }.bind(this))
            .then(this._convertODataToReferencePage)
            .catch(this._rejectWithErrorMessage);

        return oPromise;
    };

    /**
    * Creates a new page
    *
    * @param {object} pageToCreate The new page
    * @returns {Promise} Resolves when the page has been created successfully
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.createPage = function (pageToCreate) {
        var oPageToCreate = this._convertReferencePageToOData(pageToCreate);

        return this._createPage(oPageToCreate).then(this._storeETag.bind(this));
    };

    /**
    * Updates a page. This method expects to get the complete page. Sections and tiles
    * that are left out will be deleted.
    *
    * @param {object} pageToUpdate The updated page data
    * @returns {Promise} Resolves when the page has been updated successfully
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.updatePage = function (pageToUpdate) {
        var oPageToUpdate = this._convertReferencePageToOData(pageToUpdate);

        oPageToUpdate.modifiedOn = this._oEtags[pageToUpdate.content.id].modifiedOn;

        return this._createPage(oPageToUpdate).then(this._storeETag.bind(this));
    };

    /**
    * Deletes a  page
    *
    * @param {object} pageId The ID of the page to be deleted
    * @returns {Promise} Resolves when the page has been deleted successfully
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.deletePage = function (pageId) {
        var oPromise = new Promise(function (resolve, reject) {
            this._oODataModel.remove("/pageSet('" + encodeURIComponent(pageId) +"')", {
                eTag: this._oEtags[pageId].etag,
                success: resolve,
                error: reject
            });
        }.bind(this));

        return oPromise;
    };

    /**
    * Reads the headers of the available pages from the server
    *
    * @returns {Promise} Resolves to the page headers in the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._readPages = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
    * Reads a page from the server
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page in the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._readPage = function (pageId) {
        var oPromise = new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) +"')", {
                urlParameters: {
                    "$expand": "sections/tiles"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));

        return oPromise;
    };

    /**
    * Creates a page on the server
    *
    * @param {object} pageToCreate The page data
    * @returns {Promise} Page the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._createPage = function (pageToCreate) {
        var oPromise = new Promise(function (resolve, reject) {
            this._oODataModel.create("/pageSet", pageToCreate, {
                success: resolve,
                error: reject
            });
        }.bind(this));

        return oPromise;
    };

    /**
    * Converts a list of page headers from the OData format into the FLP internal format
    *
    * @param {array} pages The page headers in the OData format
    * @returns {array} The page headers in the FLP internal format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._convertODataToPageList = function (pages) {
        var aPages;

        aPages = pages.results.map(function (page) {
            return {
                content: {
                    id: page.id,
                    title: page.title,
                    description: page.description,
                    createdBy: page.createdBy,
                    createdOn: page.createdOn,
                    modifiedBy: page.modifiedBy,
                    modifiedOn: page.modifiedOn
                },
                metadata: {
                    devclass: page.devclass,
                    transportId: page.transportId
                }
            };
        });

        return aPages;
    };

    /**
    * Converts a reference page from the OData format to the FLP internal format
    *
    * @param {object} page The page in the OData format
    * @returns {object} The page in the FLP format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._convertODataToReferencePage = function (page) {
        return {
            content: {
                id: page.id,
                title: page.title,
                description: page.description,
                createdBy: page.createdBy,
                createdOn: page.createdOn,
                modifiedBy: page.modifiedBy,
                modifiedOn: page.modifiedOn,
                sections: page.sections.results.map(function (section) {
                    return {
                        id: section.id,
                        title: section.title,
                        visualizations: section.tiles.results.map(function (tile) {
                            return {
                                vizId: tile.catalogTile,
                                inboundPermanentKey: tile.targetMapping
                            };
                        })
                    };
                })
            },
            metadata: {
                transportId: page.transportId,
                devclass: page.devclass
            }
        };
    };

    /**
    * Converts the reference page from the FLP internal format to the OData format
    *
    * @param {object} page The page in the FLP format
    * @returns {object} The page in the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._convertReferencePageToOData = function (page) {
        var oReferencePage = page.content,
            oMetadata = page.metadata;

        var oODataPage = {
            id: oReferencePage.id,
            title: oReferencePage.title,
            description: oReferencePage.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            sections: (oReferencePage.sections || []).map(function (section) {
                return {
                    id: section.id,
                    title: section.title,
                    tiles: (section.visualizations || []).map(function (tile) {
                        return {
                            catalogTile: tile.vizId,
                            targetMapping: tile.inboundPermanentKey
                        };
                    })
                };
            })
        };

        return oODataPage;
    };

    /**
    * Stores the etag for a read page
    *
    * @param {object} page The read page
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._storeETag = function (page) {
        this._oEtags[page.id] = {
            // this is used as an etag for the deep update
            modifiedOn: page.modifiedOn,
            // this etag is used for deletion
            etag: page.__metadata.etag
        };
    };

    /**
    * Extracts the error message from an error object
    *
    * @param {object} error The error object
    * @returns {Promise} A rejected promise containing the error message
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._rejectWithErrorMessage = function (error) {
        return Promise.reject(error.message);
    };

    return PagePersistenceAdapter;
}, true /* bExport */);
