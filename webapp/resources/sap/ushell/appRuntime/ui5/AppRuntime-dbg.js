// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/LoaderExtensions",
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent",
    "sap/ushell/appRuntime/ui5/services/ShellUIService",
    "sap/ushell/appRuntime/ui5/services/UserStatus",
    "sap/ushell/appRuntime/ui5/services/AppConfiguration", //must me included, do not remove
    "sap/ui/core/Popup",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/isEmptyObject",
    "sap/base/Log",
    "sap/ui/core/ComponentContainer",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/RendererExtensions"
], function (
    LoaderExtensions,
    AppRuntimePostMessageAPI,
    AppCommunicationMgr,
    AppRuntimeService,
    URI,
    SessionHandlerAgent,
    AppLifeCycleAgent,
    ShellUIService,
    UserStatus,
    AppConfiguration,
    Popup,
    jQuery,
    isEmptyObject,
    Log,
    ComponentContainer
    // RendererExtensions
) {
    "use strict";

    var oPageUriParams = new URI().search(true),
        oComponentContainer,
        oShellNavigationService,
        DEFAULT_CONFIG_PATH = "sap/ushell/appRuntime/ui5/AppRuntimeDefaultConfiguration.json";

    function AppRuntime () {
        this.main = function () {
            var that = this;

            Promise.all([
                that.getPageConfig(),
                that.getURLParameters()
            ]).then(function (values) {
                var oURLParameters = values[1],
                    sAppId = oURLParameters["sap-ui-app-id"];
                that.setModulePaths();
                AppCommunicationMgr.init();
                that.init();
                Promise.all([
                    that.initServicesContainer(),
                    that.getAppInfo(sAppId)
                ]).then(function (values) {
                    var oAppInfo = values[1];
                    SessionHandlerAgent.init();
                    that.createApplication(sAppId, oURLParameters, oAppInfo)
                        .then(function (oResolutionResult) {
                            that.renderApplication(oResolutionResult);
                        });
                });
            });
        };

        this._getURI = function () {
            return new URI().query(true);
        };

        this.getURLParameters = function () {
            var that = this;

            return new Promise(function (fnResolve, fnReject) {
                var oUrlParameters = that._getURI();

                if (oUrlParameters.hasOwnProperty("sap-intent-param")) {
                    var sAppStateKey = oUrlParameters["sap-intent-param"];
                    sap.ushell.Container.getService("AppState").getAppStateData(sAppStateKey)
                        .then(function (sParameters) {
                            delete oUrlParameters["sap-intent-param"];
                            var oUrlParametersExpanded = jQuery.extend({}, oUrlParameters, (new URI("?" + sParameters)).query(true), true);
                            fnResolve(oUrlParametersExpanded);
                        }, function (sError) {
                            fnResolve(oUrlParameters);
                        });
                } else {
                    fnResolve(oUrlParameters);
                }
            });
        };

        this.init = function () {
            AppRuntimePostMessageAPI.regiterCommHandlers({
                "sap.ushell.appRuntime": {
                    oInboundActions: {
                        "hashChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var sHash = oServiceParams.oMessageData.body.sHash;
                                if (sHash && sHash.length > 0) {
                                    window.hasher.replaceHash(sHash);
                                }
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "setDirtyFlag": {
                            executeServiceCallFn: function (oServiceParams) {
                                var bIsDirty = oServiceParams.oMessageData.body.bIsDirty;
                                if (bIsDirty !== sap.ushell.Container.getDirtyFlag()) {
                                    sap.ushell.Container.setDirtyFlag(bIsDirty);
                                }
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "themeChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var currentThemeId = oServiceParams.oMessageData.body.currentThemeId;
                                sap.ui.getCore().applyTheme(currentThemeId);
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "buttonClick": {
                            executeServiceCallFn: function (oServiceParams) {
                                sap.ushell.renderers.fiori2.Renderer.handleHeaderButtonClick(
                                    oServiceParams.oMessageData.body.buttonId
                                );
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "uiDensityChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var isTouch = oServiceParams.oMessageData.body.isTouch;
                                jQuery("body")
                                    .toggleClass("sapUiSizeCompact", (isTouch === "0"))
                                    .toggleClass("sapUiSizeCozy", (isTouch === "1"));
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });
        };

        this.getPageConfig = function () {
            var metaData,
                shellConfig;

            return new Promise(function (fnResolve) {
                LoaderExtensions.loadResource(DEFAULT_CONFIG_PATH, { async: true }).then(function (defaultShellConfig) {
                    metaData = jQuery("meta[name='sap.ushellConfig.ui5appruntime']")[0];
                    shellConfig = JSON.parse(metaData.content);
                    window["sap-ushell-config"] = jQuery.extend(true, {}, defaultShellConfig, shellConfig);
                    fnResolve();
                });
            });
        };

        this.setModulePaths = function () {
            if (window["sap-ushell-config"].modulePaths) {
                var keys = Object.keys(window["sap-ushell-config"].modulePaths);
                for (var key in keys) {
                    (function () {
                        var paths = {};
                        paths[keys[key].replace(/\./g, "/")] = window["sap-ushell-config"].modulePaths[keys[key]];
                        sap.ui.loader.config({ paths: paths });
                    }());
                }
            }
        };

        this.initServicesContainer = function () {
            return new Promise(function (fnResolve) {
                sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"], function (oContainer) {
                    oContainer.bootstrap("apprt", { apprt: "sap.ushell.appRuntime.ui5.services.adapters" }).then(function () {
                        fnResolve();
                    });
                });
            });
        };

        this._getURIParams = function () {
            return oPageUriParams;
        };

        this.getAppInfo = function (sAppId) {
            var oData = window["sap-ushell-config"].ui5appruntime.config.appIndex.data,
                sModule = window["sap-ushell-config"].ui5appruntime.config.appIndex.module,
                that = this;

            return new Promise(function (fnResolve) {
                if (oData && !isEmptyObject(oData)) {
                    AppLifeCycleAgent.getAppInfo(sModule, that.createApplication.bind(that), that.renderApplication.bind(that));
                    fnResolve(oData);
                } else {
                    sap.ui.require([sModule.replace(/\./g, "/")], function (AppResolution) {
                        AppLifeCycleAgent.init(AppResolution, that.createApplication.bind(that), that.renderApplication.bind(that));
                        AppResolution.getAppInfo(sAppId).then(function (oAppInfo) {
                            fnResolve(oAppInfo);
                        });
                    });
                }
            });
        };

        this.setApplicationParameters = function (oAppInfo, oURLParameters) {
            var oStartupParameters,
                sSapIntentParam,
                sStartupParametersWithoutSapIntentParam,
                oDeferred = new jQuery.Deferred();

            function buildFinalParamsString(sSimpleParams, sIntentParams) {
                var sParams = "";
                if (sSimpleParams && sSimpleParams.length > 0) {
                    sParams = (sSimpleParams.startsWith("?") ? "" : "?") + sSimpleParams;
                }
                if (sIntentParams && sIntentParams.length > 0) {
                    sParams += (sParams.length > 0 ? "&" : "?") + sIntentParams;
                }
                return sParams;
            }

            if (oURLParameters.hasOwnProperty("sap-startup-params")) {
                oStartupParameters = (new URI("?" + oURLParameters["sap-startup-params"])).query(true);
                if (oStartupParameters.hasOwnProperty("sap-intent-param")) {
                    sSapIntentParam = oStartupParameters["sap-intent-param"];
                    delete oStartupParameters["sap-intent-param"];
                }
                sStartupParametersWithoutSapIntentParam = (new URI("?")).query(oStartupParameters).toString();

                //Handle the case when the parameters that were sent to the application were more than 1000 characters and in
                //the URL we see a shorten value of the parameters
                if (sSapIntentParam) {
                    sap.ushell.Container.getService("AppState").getAppStateData(sSapIntentParam)
                        .then(function (sMoreParams) {
                            oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam, sMoreParams);
                            oDeferred.resolve();
                        }, function (sError) {
                            oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam);
                            oDeferred.resolve();
                        });
                } else {
                    oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam);
                    oDeferred.resolve();
                }
            } else {
                oDeferred.resolve();
            }

            return oDeferred.promise();
        };

        this.setHashChangedCallback = function () {
            function treatHashChanged (newHash/*, oldHash*/) {
                if (newHash && typeof newHash === "string" && newHash.length > 0) {
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.appRuntime.hashChange",
                        { "newHash": newHash }
                    );
                }
            }
            window.hasher.changed.add(treatHashChanged.bind(this), this);
        };

        this.createApplication = function (sAppId, oURLParameters, oAppInfo) {
            var that = this,
                fnPopupOpenCloseHandler = function (oEvent) {
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.ShellUIService.showShellUIBlocker",
                        { "bShow": oEvent.getParameters().visible }
                    );
                };

            return new Promise(function (fnResolve) {
                oComponentContainer = new ComponentContainer({
                    id: sAppId + "-content",
                    width: "100%",
                    height: "100%"
                });

                if (!oShellNavigationService) {
                    sap.ushell.renderers.fiori2.utils.init();
                    oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
                    oShellNavigationService.init(function () { });
                    oShellNavigationService.registerNavigationFilter(function (/*newHash, oldHash*/) {
                        if (sap.ushell.Container.getDirtyFlag()) {
                            return oShellNavigationService.NavigationFilterStatus.Abandon;
                        }
                        return oShellNavigationService.NavigationFilterStatus.Continue;
                    });
                }

                AppLifeCycleAgent.setComponent(oComponentContainer);

                new ShellUIService({ scopeObject: oComponentContainer, scopeType: "component" });
                new UserStatus({ scopeObject: oComponentContainer, scopeType: "component" });

                if (Popup.attachBlockLayerStateChange) {
                    Popup.attachBlockLayerStateChange(fnPopupOpenCloseHandler);
                }

                that.setApplicationParameters(oAppInfo, oURLParameters).done(function () {
                    that.setHashChangedCallback();
                    sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function (oUi5ComponentLoader) {
                        oUi5ComponentLoader.createComponent(
                            {
                                ui5ComponentName: sAppId,
                                applicationDependencies: oAppInfo,
                                url: oAppInfo.url
                            },
                            "todo-replaceDummyShellHash",
                            false
                        ).then(function (oResolutionResultWithComponentHandle) {
                            fnResolve(oResolutionResultWithComponentHandle);
                        });
                    });
                });
            });
        };

        this.renderApplication = function (oResolutionResult) {
            oComponentContainer
                .setComponent(oResolutionResult.componentHandle.getInstance())
                .placeAt("content");
        };
    }

    var appRuntime = new AppRuntime();
    appRuntime.main();
    return appRuntime;
});
