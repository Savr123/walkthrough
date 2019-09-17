/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/LayoutData","./NS"],function(L,N){"use strict";var F=L.extend(N.getName("FlexibleControlLayoutData"),{metadata:{library:N.getName(),properties:{size:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},minSize:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"0px"},marginTop:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"0px"},marginBottom:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"0px"}}}});return F;});
