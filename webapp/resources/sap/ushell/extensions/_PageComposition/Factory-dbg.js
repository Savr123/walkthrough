// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/m/Button",
    "sap/m/FlexBox",
    "sap/ushell/extensions/_PageComposition/Factory/PageOverview",
    "sap/ushell/extensions/_PageComposition/Factory/PageSaveDialog",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/m/library",
    "sap/m/FlexAlignItems",
    "sap/m/FlexJustifyContent"
], function (
    Button,
    FlexBox,
    PageOverviewFactory,
    PageSaveDialogFactory,
    JSONModel,
    Config,
    oResources,
    mLibrary,
    FlexAlignItems,
    FlexJustifyContent
) {
    "use strict";

    var oFooterButtonModel = Config.createModel("/core/pageComposition", JSONModel);

    /**
     * Returns a function that compares the given state string to the value of the formatter parameter
     *
     * @param {String} sState the string to compare with
     * @returns {function(*): boolean} The compare function
     */
    var createFooterButtonFormatter = function (sState) {
        return function (sComposerState) {
            return sComposerState === sState;
        };
    };

    /**
     * Creates a button to reset the changes made to a page
     *
     * @param {function} fnPressCallback The function to be called if the button is pressed
     * @returns {Object} The created button
     */
    function createFooterCloseButton (fnPressCallback) {
        var oButton = new Button({
            text: oResources.i18n.getText("pageComposerCloseBtn"),
            visible: {
                parts: ["/composerState"],
                formatter: createFooterButtonFormatter("composing")
            },
            press: fnPressCallback
        });

        oButton.setModel(oFooterButtonModel);

        return oButton;
    }

    /**
     * Creates a button to save the changes made to a page
     *
     * @param {function} fnOnSaveCallback The function to be called if save dialog is submitted
     * @param {function} fnSaveReject The function to be called if the save is rejected
     * @returns {Object} The created button
     */
    function createFooterSaveButton (fnOnSaveCallback, fnSaveReject) {
        var oButton = new Button({
            text: oResources.i18n.getText("pageComposerSaveBtn"),
            type: mLibrary.ButtonType.Emphasized,
            visible: {
                parts: ["/composerState"],
                formatter: createFooterButtonFormatter("composing")
            },
            press: function () {
                fnOnSaveCallback();
            }
        });

        oButton.setModel(oFooterButtonModel);

        return oButton;
    }

    /**
     * Create a button to open a dialog for the creation of a new page
     * @param {function} fnOnCreateCallback The function to be called if create dialog is submitted
     *
     * @returns {Object} The created button
     */
    function createFooterCreateButton (fnOnCreateCallback) {
        var oButton = new Button({
            text: oResources.i18n.getText("pageComposerCreateBtn"),
            type: mLibrary.ButtonType.Emphasized,
            enabled: {
                parts: ["/composerState"],
                formatter: createFooterButtonFormatter("initial")
            },
            press: function () {
                fnOnCreateCallback();
            }
        });

        oButton.setModel(oFooterButtonModel);

        return oButton;
    }

    /**
     * JSONModel which is expected by the load function of the page overview factory.
     * @typedef {object} PageOverviewModel
     * @property {object} object.pages An array of page objects. (@see sap.ushell.extensions._PageComposition.Factory.PageOverview#Page)
     */

    /**
     * Callback for loading pages
     *
     * @callback loadPages
     * @returns Promise<PageOverviewModel>
     */

    /**
     * Callback if a page has been selected
     *
     * @callback pageSelected
     * @param {string} sPageId - The page id
     */

    /**
     * Creates a button to open the page selector
     *
     * @param {loadPages} fnLoad
     *      The function to load available pages. Should return a promise that resolves to {"pages": [...]}
     * @param {pageSelected} fnPageSelectedCallback
     *      The callback function which is called when a page has been selected
     *
     * @returns {Object} The created button
     */
    function createFooterOpenButton (fnLoad, fnPageSelectedCallback) {
        var oButton = new Button({
            text: oResources.i18n.getText("pageComposerOpenBtn"),
            type: mLibrary.ButtonType.Emphasized,
            enabled: {
                parts: ["/composerState"],
                formatter: createFooterButtonFormatter("initial")
            },
            press: function () {
                PageOverviewFactory.create(fnLoad).selectPage().then(fnPageSelectedCallback);
            }
        });

        oButton.setModel(oFooterButtonModel);

        return oButton;
    }


    /**
     * Creates a flexbox layout containing a button which is displayed in composing mode
     * if no groups are on the dashboard
     *
     * @param {function} fnPressHandler Called if the button is pressed
     * @param {sap.ui.model.Model} oModel The model which contains the "/groups" property
     * @returns {sap.m.FlexBox} A flexbox control containing the button
     */
    function createAddGroupButton (fnPressHandler, oModel) {
        var oButton = new Button("sapUshellAddGroupBtn", {
            icon: "sap-icon://add",
            text: oResources.i18n.getText("add_group_at"),
            press: fnPressHandler
        });

        oButton.addStyleClass("sapUshellAddGroupButton");

        var oFlex = new FlexBox({
            alignItems: FlexAlignItems.Center,
            justifyContent: FlexJustifyContent.Center,
            items: [oButton],
            visible: {
                parts: [
                    {path: "groupsModel>/groups/length"},
                    {path: "composerStateModel>/composerState"}
                ],
                formatter: function (iGroupsLength, sComposerState) {
                    return iGroupsLength === 0 && sComposerState === "composing";
                }
            }
        });

        oFlex.setModel(oModel, "groupsModel");
        oFlex.setModel(oFooterButtonModel, "composerStateModel");

        return oFlex;
    }

    return {
        createFooterCloseButton: createFooterCloseButton,
        createFooterSaveButton: createFooterSaveButton,
        createFooterCreateButton: createFooterCreateButton,
        createFooterOpenButton: createFooterOpenButton,
        createAddGroupButton: createAddGroupButton
    };
});
