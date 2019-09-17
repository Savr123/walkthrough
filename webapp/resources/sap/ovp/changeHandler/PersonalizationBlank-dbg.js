/**
 * This is a dummy change handler for personalization changes.
 * As all the personalization changes are bieng merged by the OVP libabry code
 * and changes are fetched directly via API
 */
/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([], function () {
    "use strict";

    /**
     * Change handler for hiding of a componentContainer control.
     * @alias sap.ui.fl.changeHandler.HideCardContainer
     * @author SAP SE
     * @version 1.69.0
     * @experimental Since 1.27.0
     */
    return {
        "changeHandler": {
            applyChange: function (oChange, oPanel, mPropertyBag) {
                return true;
            },
            completeChangeContent: function (oChange, oSpecificChangeInfo, mPropertyBag) {
                return;
            },
            revertChange : function(oChange, oControl, mPropertyBag) {
                return;
            }
        },
        "layers": {
            "CUSTOMER_BASE": true,
            "CUSTOMER": true,
            "USER": true
        }
    };
},
/* bExport= */true);
