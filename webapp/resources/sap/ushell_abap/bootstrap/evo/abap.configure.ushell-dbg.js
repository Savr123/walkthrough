// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "./abap.constants",
    "sap/ushell/bootstrap/common/common.configure.ushell",
    "sap/base/util/ObjectPath",
    "sap/base/util/UriParameters",
    "sap/base/Log"
], function (oAbapConstants, fnConfigureUshellCommon, ObjectPath, UriParameters, Log) {
    "use strict";

    function logServerSideMessages (config) {
        var sComponent = "sap/ushell_abap/bootstrap/v2/abap.configure.ushell";
        var aMessages = config.messages;
        if (aMessages && aMessages.length > 0) {
            for (var i = 0; i < aMessages.length; i += 1) {
                if (aMessages[i].severity === "error") {
                    Log.error(aMessages[i].text, null, sComponent);
                } else if (aMessages[i].severity === "warning") {
                    Log.warning(aMessages[i].text, null, sComponent);
                }
            }
        }
    }

    function addContainerStartupConfig (config) {
        if (config.startupConfig) {
            var oContainerAdapter = ObjectPath.create("services.Container.adapter", config);
            oContainerAdapter.config = config.startupConfig;
        }
    }

    function addAdapterConfigForFLPPages (config) {
        var sUShellPageId = UriParameters.fromQuery(window.location.search).get("sap-ushell-page");
        if (sUShellPageId) {
            var oLaunchPageAdapterConfig = ObjectPath.create("services.LaunchPage.adapter", config);
            oLaunchPageAdapterConfig.module = "sap.ushell.adapters.cdm.v3.LaunchPageAdapter";

            var oCDMAdapterConfig = ObjectPath.create("services.CommonDataModel.adapter", config);
            oCDMAdapterConfig.module = "sap.ushell.adapters.cdm.PagesCommonDataModelAdapter";
            oCDMAdapterConfig.config = {
                pageId: sUShellPageId
            };

            var oClientSideTargetResolutionAdapterConfig = ObjectPath.create("services.ClientSideTargetResolution.adapter", config);
            oClientSideTargetResolutionAdapterConfig.module = "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter";
        }
    }

    function configureUshell () {
        var oConfig = fnConfigureUshellCommon(oAbapConstants);

        // Write any warnings and errors related to server-side config to console.
        logServerSideMessages(oConfig);

        // Add start_up configuration if provided by server (formerly retrieved by separate round trip to start_up service)
        addContainerStartupConfig(oConfig);

        // Use CDM adapters in case the user views a sap ushell page
        addAdapterConfigForFLPPages(oConfig);

        return oConfig;
    }

    return configureUshell;
});