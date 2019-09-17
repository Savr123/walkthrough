// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PagePersistenceAdapter for the local platform.
 *
 * The PagePersistenceAdapter must perform the following two tasks:
 * <ul>
 * <li>foo</li>
 * <li>bar</li>
 * </ul>
 *
 * @version 1.69.1
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ui/util/Storage",
    "sap/base/util/ObjectPath"
], function (utils, Storage, ObjectPath) {
    "use strict";

    /**
    * Constructs a new instance of the PagePersistenceAdapter for the local
    * platform
    *
    * @constructor
    * @experimental Since 1.67.0
    *
    * @param {object} system The system information. In a local environment this is not used
    * @param {string} parameter The Adapter parameter
    * @param {object} adapterConfiguration The Adapter configuration
    *
    * @private
    */
    var PagePersistenceAdapter = function (system, parameter, adapterConfiguration) {
        var sStorageType = ObjectPath.get("config.storageType", adapterConfiguration) || Storage.Type.local;
        if (sStorageType !== Storage.Type.local && sStorageType !== Storage.Type.session) {
            throw new utils.Error("PagePersistence Adapter Local Platform: unsupported storage type: '" + sStorageType + "'");
        }
        this._oStorage = new Storage(sStorageType, "com.sap.ushell.adapters.local.PagePersistence");
    };

    PagePersistenceAdapter.prototype.getPages = function () {
        var that = this;
        return new Promise(function (resolve) {
            var aPages = that._oStorage.get("pages") || [];
            resolve(aPages);
        });
    };

    PagePersistenceAdapter.prototype.getPage = function (id) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var aPages = that._oStorage.get("pages") || [];
            aPages.forEach(function (page) {
                if (page.content.id === id) {
                    resolve(page);
                }
            });
            reject({ error: "No page with id '" + id + "' was found." });
        });
    };

    PagePersistenceAdapter.prototype.createPage = function (pageToCreate) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (!pageToCreate.content) {
                reject("Wrong page format. Content is required ({ content: { //page data }).");
            }
            var aPages = that._oStorage.get("pages") || [];
            aPages.forEach(function (page) {
                if (page.content.id === pageToCreate.content.id) {
                    reject({ error: "A page with ID '" + pageToCreate.content.id + "' does already exist" });
                }
            });
            aPages.push(pageToCreate);
            that._oStorage.put("pages", aPages);
            resolve();
        });
    };

    PagePersistenceAdapter.prototype.updatePage = function (pageToUpdate) {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (!pageToUpdate.content) {
                reject("Wrong page format. Content is required ({ content: { //page data }).");
            }
            var aPages = that._oStorage.get("pages") || [];
            aPages = aPages.filter(function (page) {
                return page.content.id !== pageToUpdate.content.id;
            });
            aPages.push(pageToUpdate);
            that._oStorage.put("pages", aPages);
            resolve();
        });
    };

    PagePersistenceAdapter.prototype.deletePage = function (id) {
        var that = this;
        return new Promise(function (resolve) {
            var aPages = that._oStorage.get("pages") || [];
            aPages = aPages.filter(function (page) {
                return page.content.id !== id;
            });
            that._oStorage.put("pages", aPages);
            resolve();
        });
    };

    return PagePersistenceAdapter;
}, true /* bExport */);