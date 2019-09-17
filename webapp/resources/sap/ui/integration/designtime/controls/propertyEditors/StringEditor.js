/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/integration/designtime/controls/PropertyEditor'],function(P){"use strict";var S=P.extend("sap.ui.integration.designtime.controls.propertyEditors.StringEditor",{init:function(){this._oInput=new sap.m.Input({value:"{value}"});this._oInput.attachLiveChange(function(e){this.firePropertyChanged(e.getParameter("value"));}.bind(this));this.addContent(this._oInput);},renderer:P.getMetadata().getRenderer().render});return S;});
