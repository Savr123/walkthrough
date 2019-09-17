/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var T={getLineItemCollection:function(c){var C,m,e;if(c){C=c.getObject("/collection");if(C){m=C.getModel();}if(m&&m.isA("sap.ui.model.odata.v4.ODataMetaModel")){e=C.getPath();return m.getMetaContext(e+"/@com.sap.vocabularies.UI.v1.LineItem");}}},getCollectionFields:function(e,m){var p=[],o,E;E=m.getObject(e+"/");for(var k in E){o=E[k];if(o&&o.$kind==="Property"){p.push({name:k,label:m.getObject(e+"/"+k+"@com.sap.vocabularies.Common.v1.Label"),type:o.$Type});}}return p;},getRestrictionsPath:function(c,l){var s=', $select: \'';var a=[];l.forEach(function(L){if(L["@com.sap.vocabularies.UI.v1.Hidden"]===true){a.push(L.Value.$Path);}});if(c["@Org.OData.Capabilities.V1.DeleteRestrictions"]&&c["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path){a.push(c["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path);}s=s+a.join(',');return s!==', $select: \''?s+'\'':'';}};return T;},true);
