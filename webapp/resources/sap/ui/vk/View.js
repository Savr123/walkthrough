/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./NS"],function(M,N){"use strict";var V=M.extend(N.getName("View"),{metadata:{library:N.getName(),properties:{name:{type:"string"},description:{type:"string"},cameraInfo:{type:"object"},nodeInfos:{type:"object[]"},playbacks:{type:"object[]"}}}});return V;});
