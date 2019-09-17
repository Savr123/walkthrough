// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview UI Factory for creating the Page Overview Dialog.
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/ui/pagecomposer/PageOverview.controller",
    "sap/ushell/extensions/_PageComposition/Factory/utils"
], function (JSONModel, PageOverviewController, utils) {
    "use strict";

    var PageOverview = {};

    /**
     * The page object which the factory expects.
     * @typedef {object} Page
     * @property {string} Id The page id.
     * @property {string} Name The page name.
     * @property {string} Description The page description.
     * @property {string} CreatedBy The page author.
     * @property {string} CreatedAt The page creation date.
     * @property {string} ChangedBy The page author who made the last change.
     * @property {string} ChangedAt The page last changed date.
     */

    /**
     * Opens the dialog and sets the selection resolve handler of the controller.
     * @returns {Promise<Page>} A promise which contains the selected page.
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview._selectPage = function () {
        return new Promise(function (resolve, reject) {
            this.oPageOverviewLoadPromise.then(function (oPageOverview) {
                PageOverviewController._setResolveSelectedPagePromise(resolve);
                oPageOverview.open();
            }).catch(reject);
        }.bind(this));
    };

    /**
     * The factory object of the page overview.
     * @typedef {object} PageOverviewFactory
     * @property {function} selectPage The function to select a page. {@link #_selectPage}
     */

    /**
     * Prepares the model data and creates the Page Overview Dialog if it is not created
     * yet. If it has been created before, it is simply returned.
     *
     * @param {function} loadPages
     *      Function which returns a promise containing an array of pages ({@link Page})
     *      which is needed for the UI fragment.
     * @returns {PageOverviewFactory} A Promise which resolves to the Page Overview.
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview.create = function (loadPages) {
        if (!this.oPageOverviewLoadPromise) {
            var oModel = new JSONModel();
            this.oPageOverviewLoadPromise = utils.setupXMLFragment(
                "sap.ushell.ui.pagecomposer.PageOverview",
                oModel,
                PageOverviewController
            );
        }

        Promise.all([
            this.oPageOverviewLoadPromise,
            loadPages()
        ]).then(function (aResults) {
            var oPageOverviewFragment = aResults[0];
            var oPages = aResults[1];
            oPageOverviewFragment.getModel().setData(oPages);
        });

        return {
            selectPage: this._selectPage.bind(this)
        };
    };

    return PageOverview;

}, false /* bExport */);
