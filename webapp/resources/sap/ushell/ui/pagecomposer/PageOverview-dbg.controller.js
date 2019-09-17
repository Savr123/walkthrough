//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([], function () {
    "use strict";

    var PageOverview = {};

    /**
     * Closes the dialog with id "pageOverview".
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview._closeDialog = function () {
        sap.ui.getCore().byId("pageOverview").close();
    };

    /**
     * Gets called by the close button of the dialog.
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview.onCloseDialog = function () {
        this._selectedPageResolveHandler(null);
        this._closeDialog();
    };

    /**
     * Gets called by the dialog if a page (list item) was selected.
     * @param {sap.ui.base.Event} event The event which triggered the function.
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview.onItemPress = function (event) {
        this._selectedPageResolveHandler(event.getParameter("listItem").getCells()[0].getText());
        this._closeDialog();
    };

    /**
     * Sets the page resolve handler.
     * @param {function} resolve The resolve function of a promise.
     * @experimental Since 1.68.0
     *
     * @private
     */
    PageOverview._setResolveSelectedPagePromise = function (resolve) {
        this._selectedPageResolveHandler = resolve;
    };

    return PageOverview;

}, false /* bExport */);
