// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/Service",
    "../../../ui5service/_UserStatus/userstatus.class.factory"
],function (ServiceFactoryRegistry, ServiceFactory, Service, fnDefineClass) {
    "use strict";

    var oService =  fnDefineClass({
        serviceRegistry: ServiceFactoryRegistry,
        serviceFactory: ServiceFactory,
        service: Service
    });

    var NewService = oService.extend("sap.ushell.appRuntime.services.UserStatus", {

    });

    return NewService;
}, true);
