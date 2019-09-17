// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {
    "use strict";

    var mModifiedModules = {};
    var aOverriddenFunctions = [];
    var aBeforeHooks = [];
    var aAfterHooks = [];
    var aFunctionsToAdd = [];

    var ExtensionHelper = function () {};

    /**
     * Extends the given module's prototype by the given function
     *
     * @param {Object} oOriginalModule The original module
     * @param {string} sMethodName The name of the method to add
     * @param {Function} fnMethod The method
     */
    ExtensionHelper.prototype.add = function (oOriginalModule, sMethodName, fnMethod) {
        var sClassName = oOriginalModule.getMetadata().getName();

        if (oOriginalModule.prototype[sMethodName]) {
            throw Error("Cannot add function to module: Method '"+ sMethodName +"' already exists.");
        }

        if (!aFunctionsToAdd[sClassName]) {
            aFunctionsToAdd[sClassName] = [];
        }

        aFunctionsToAdd[sClassName].push({
            oOriginalModule: oOriginalModule,
            sMethodName: sMethodName,
            fnMethod: fnMethod
        });
    };

    /**
     * Overrides the function in the original module's prototype with the given function
     *
     * @param {Object} oOriginalModule The original module
     * @param {string} sMethodName The name of the method to override
     * @param {Function} fnMethod The method
     */
    ExtensionHelper.prototype.override = function (oOriginalModule, sMethodName, fnMethod) {
        var sClassName = oOriginalModule.getMetadata().getName();

        if (!oOriginalModule.prototype[sMethodName]) {
            throw Error("Cannot register override: Method '"+ sMethodName +"' does not exist in original module.");
        }

        if (!aOverriddenFunctions[sClassName]) {
            aOverriddenFunctions[sClassName] = [];
        }

        aOverriddenFunctions[sClassName].push({
            oOriginalModule: oOriginalModule,
            fnOriginalMethod: oOriginalModule.prototype[sMethodName],
            sMethodName: sMethodName,
            fnMethod: fnMethod
        });
    };

    /**
     * Adds a hook-method that is executed before the given method is executed on the given module
     *
     * @param {Object} oOriginalModule The original module
     * @param {string} sMethodName The name of the method to apply the hook to
     * @param {Function} fnMethod The method
     */
    ExtensionHelper.prototype.addBeforeHook = function (oOriginalModule, sMethodName, fnMethod) {
        var sClassName = oOriginalModule.getMetadata().getName();

        if (!oOriginalModule.prototype[sMethodName]) {
            throw Error("Cannot register beforeHook: Method '"+ sMethodName +"' does not exist in original module.");
        }

        if (!aBeforeHooks[sClassName]) {
            aBeforeHooks[sClassName] = [];
        }

        aBeforeHooks[sClassName].push({
            oOriginalModule: oOriginalModule,
            fnOriginalMethod: oOriginalModule.prototype[sMethodName],
            sMethodName: sMethodName,
            fnMethod: fnMethod
        });
    };

    /**
     * Adds a hook-method that is executed after the given method is executed on the given module
     *
     * @param {Object} oOriginalModule The original module
     * @param {string} sMethodName The name of the method to apply the hook to
     * @param {Function} fnMethod The method
     */
    ExtensionHelper.prototype.addAfterHook = function (oOriginalModule, sMethodName, fnMethod) {
        var sClassName = oOriginalModule.getMetadata().getName();

        if (!oOriginalModule.prototype[sMethodName]) {
            throw Error("Cannot register afterHook: Method '"+ sMethodName +"' does not exist in original module.");
        }

        if (!aAfterHooks[sClassName]) {
            aAfterHooks[sClassName] = [];
        }

        aAfterHooks[sClassName].push({
            oOriginalModule: oOriginalModule,
            fnOriginalMethod: oOriginalModule.prototype[sMethodName],
            sMethodName: sMethodName,
            fnMethod: fnMethod
        });
    };

    /**
     * Activates all adds, overrides and hooks for the given module
     *
     * @param {String} sName The name of the module
     * @param {Object} oModule The module
     */
    ExtensionHelper.prototype.registerExtension = function (sName, oModule) {
        mModifiedModules[sName] = oModule;

        this._applyAdded(oModule);
        this._applyOverrides(oModule);
        this._applyBeforeHooks(oModule);
        this._applyAfterHooks(oModule);
    };

    /**
     * Cleans up all modifications on the module with the given name
     *
     * @param {String} sName The name of the module to restore
     */
    ExtensionHelper.prototype.deRegisterExtension = function (sName) {
        var mModifiedModule = mModifiedModules[sName];

        if (!mModifiedModule) {
            return;
        }

        this._removeAdded(mModifiedModule);
        this._restoreOverrides(mModifiedModule);
        this._removeBeforeHooks(mModifiedModule);
        this._removeAfterHooks(mModifiedModule);
    };

    ExtensionHelper.prototype.reset = function () {
        mModifiedModules = {};
        aOverriddenFunctions = [];
        aBeforeHooks = [];
        aAfterHooks = [];
        aFunctionsToAdd = [];
    };

    /**
     * Applies the added functions to the given module
     *
     * @param {object} oModule The module to which to apply the added functions
     * @private
     */
    ExtensionHelper.prototype._applyAdded = function (oModule) {
        var aFunctions = this._getRelevantFunctions(oModule, aFunctionsToAdd);
        var oSingleExtension, i;

        for (i = 0; i < aFunctions.length; i++) {
            oSingleExtension = aFunctions[i];
            oSingleExtension.oOriginalModule.prototype[oSingleExtension.sMethodName] = oSingleExtension.fnMethod;
        }
    };

    /**
     * Applies all overrides to the given module
     *
     * @param {object} oModule The module to which to apply the overrides
     * @private
     */
    ExtensionHelper.prototype._applyOverrides = function (oModule) {
        var aOverrides = this._getRelevantFunctions(oModule, aOverriddenFunctions);
        var oOverride, i;

        for (i = 0; i < aOverrides.length; i++) {
            oOverride = aOverrides[i];
            oOverride.oOriginalModule.prototype[oOverride.sMethodName] = oOverride.fnMethod;
        }
    };

    /**
     * Applies all before hooks to the given module
     *
     * @param {object} oModule The module to which to apply the before hooks
     * @private
     */
    ExtensionHelper.prototype._applyBeforeHooks = function (oModule) {
        var aHooks = this._getRelevantFunctions(oModule, aBeforeHooks);
        var oHook, i;
        var fnCreateBeforeHook = function createBeforeHook (oExtension) {
            return function beforeHook () {
                oExtension.fnMethod.apply(this, arguments);
                oExtension.fnOriginalMethod.apply(this, arguments);
            };
        };

        for (i = 0; i < aHooks.length; i++) {
            oHook = aHooks[i];
            oHook.oOriginalModule.prototype[oHook.sMethodName] = fnCreateBeforeHook(oHook);
        }
    };

    /**
     * Applies all after hooks to their respective modules
     *
     * @param {object} oModule The module to which to apply the after hooks
     * @private
     */
    ExtensionHelper.prototype._applyAfterHooks = function (oModule) {
        var aHooks = this._getRelevantFunctions(oModule, aAfterHooks);
        var oHook, i;
        var fnCreateAfterHook = function createAfterHook (oExtension) {
            return function afterHook () {
                oExtension.fnOriginalMethod.apply(this, arguments);
                oExtension.fnMethod.apply(this, arguments);
            };
        };

        for (i = 0; i < aHooks.length; i++) {
            oHook = aHooks[i];
            oHook.oOriginalModule.prototype[oHook.sMethodName] = fnCreateAfterHook(oHook);
        }
    };

    /**
     * Remove the functions added to the given module
     *
     * @param {Object} oModifiedModule The module to restore
     * @private
     */
    ExtensionHelper.prototype._removeAdded = function (oModifiedModule) {
        var aFunctions = this._getRelevantFunctions(oModifiedModule, aFunctionsToAdd);
        var oAdd, i;
        for (i = 0; i < aFunctions.length; i++) {
            oAdd = aFunctions[i];
            delete oModifiedModule.prototype[oAdd.sMethodName];
        }
    };

    /**
     * Restore the overrides added to the given module
     *
     * @param {Object} oModifiedModule The module to restore
     * @private
     */
    ExtensionHelper.prototype._restoreOverrides = function (oModifiedModule) {
        var aFunctions = this._getRelevantFunctions(oModifiedModule, aOverriddenFunctions);
        var oOverride, i;
        for (i = 0; i < aFunctions.length; i++) {
            oOverride = aFunctions[i];
            oModifiedModule.prototype[oOverride.sMethodName] = oOverride.fnOriginalMethod;
        }
    };

    /**
     * Remove the beforeHooks for the given module
     *
     * @param {Object} oModifiedModule The module to restore
     * @private
     */
    ExtensionHelper.prototype._removeBeforeHooks = function (oModifiedModule) {
        var aHooks = this._getRelevantFunctions(oModifiedModule, aBeforeHooks);
        var oHook, i;
        for (i = 0; i < aHooks.length; i++) {
            oHook = aHooks[i];
            oModifiedModule.prototype[oHook.sMethodName] = oHook.fnOriginalMethod;
        }
    };

    /**
     * Remove the after hooks for the given module
     *
     * @param {Object} oModifiedModule The module to restore
     * @private
     */
    ExtensionHelper.prototype._removeAfterHooks = function (oModifiedModule) {
        var aHooks = this._getRelevantFunctions(oModifiedModule, aAfterHooks);
        var oHook, i;
        for (i = 0; i < aHooks.length; i++) {
            oHook = aHooks[i];
            oModifiedModule.prototype[oHook.sMethodName] = oHook.fnOriginalMethod;
        }
    };

    ExtensionHelper.prototype._getRelevantFunctions = function (oModule, aFunctions) {
        var sClassName = oModule.getMetadata().getName();
        return aFunctions[sClassName] || [];
    };

    return new ExtensionHelper();
});