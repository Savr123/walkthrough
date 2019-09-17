// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The UserInfo adapter for the demo platform.
 *
 * @version 1.69.1
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/ushell/services/Container",
    "sap/ushell/services/Personalization",
    "sap/base/util/ObjectPath"
], function (jQuery, Container, Personalization, ObjectPath) {
    "use strict";

    /**
     * This demo adapter reads its configuration from the demo config, where the target applications are defined.
     *
     * @param oSystem
     * @returns {sap.ushell.adapters.local.UserInfoAdapter}
     */
    var UserInfoAdapter = function (oUnused, sParameter, oAdapterConfiguration) {

        var oUserThemeConfiguration;

        /**
         * Generates the theme configuration for the user based on the external configuration
         * provided in window['sap-ushell-config'].
         *
         * @param {object}
         *     the configuration specified by the user externally
         *
         * @returns {object}
         *     the theme configuration array for getThemeList method
         *
         * @private
         */
        function generateThemeConfiguration (oAdapterThemesConfiguration) {
            var defaultConfig = [
                    { id: "sap_belize", name: "SAP Belize" }
                ],
                externalConfig = ObjectPath.get("config.themes", oAdapterThemesConfiguration);

            return externalConfig === undefined ? defaultConfig : externalConfig;
        }

        this.updateUserPreferences = function (oUser) {
            var oDeferred = new jQuery.Deferred();

            function logError (vError) {
                var sError = "Failed to update user preferences: " + (vError && vError.message ? vError.message : vError);
                jQuery.sap.log.error(sError, vError && vError.stack, "com.sap.ushell.adapters.local.UserInfo");
            }

            sap.ushell.Container.getServiceAsync("Personalization").then(function (oPersonalizationService) {
                var oScope = {
                    keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                    writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                    clientStorageAllowed: true
                };

                function setChangedPropertiesInContainer (oContainer, oUser) {
                    var aChangedProperties = oUser.getChangedProperties() || [];

                    aChangedProperties.forEach(function (oChange) {
                        oContainer.setItemValue(oChange.propertyName, oChange.newValue);
                    });
                }

                oPersonalizationService.getContainer("sap.ushell.UserProfile", oScope, undefined)
                    .done(function (oContainer) {
                        setChangedPropertiesInContainer(oContainer, oUser);
                        oContainer.save()
                            .fail(function (vError) {
                                logError(vError);
                                oDeferred.reject(vError);
                            })
                            .done(function () {
                                oDeferred.resolve();
                            });
                    })
                    .fail(function (vError) {
                        logError(vError);
                        oDeferred.reject(vError);
                    });
            });

            return oDeferred.promise();

        };

        this.getThemeList = function () {
            var oDeferred = new jQuery.Deferred();

            // make sure a configuration is available
            if (oUserThemeConfiguration === undefined) {
                oUserThemeConfiguration = generateThemeConfiguration(oAdapterConfiguration);
            }

            // we need to have at least one theme
            if (oUserThemeConfiguration.length === 0) {
                oDeferred.reject("no themes were configured");
            } else {
                oDeferred.resolve({
                    options: oUserThemeConfiguration
                });
            }


            return oDeferred.promise();
        };

        this.getLanguageList = function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(
                [
                    {
                        "text": "Browser Language",
                        "key": "default"
                    },
                    {
                        "text": "English (United States)",
                        "key": "en-US"
                    },
                    {
                        "text": "English (United Kingdom)",
                        "key": "en-GB"
                    },
                    {
                        "text": "English",
                        "key": "en"
                    },
                    {
                        "text": "German (Germany)",
                        "key": "de-DE"
                    },
                    {
                        "text": "Hebrew (Israel)",
                        "key": "he-IL"
                    },
                    {
                        "text": "Russian (Russia)",
                        "key": "ru-RU"
                    },
                    {
                        "text": "Russian",
                        "key": "ru"
                    }
                ]
            );

            return oDeferred.promise();
        };

    };


    return UserInfoAdapter;

}, /* bExport= */ true);
