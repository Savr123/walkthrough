/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/View"],function(V){"use strict";function g(c){while(c&&!(c instanceof V)){c=c.getParent();}return c;}function h(l){var H=false;l.getCurrentContexts().forEach(function(c){if(c&&c.isTransient()){H=true;}});return H;}return{getParentViewOfControl:g,hasTransientContext:h};});
