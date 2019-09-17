// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Fragment","sap/ushell/resources"],function(F,r){"use strict";var U={};U.setupXMLFragment=function(f,m,c){return new Promise(function(a,b){F.load({name:f,controller:c,type:"XML"}).then(function(d){d.setModel(m);d.setModel(r.i18nModel,"i18n");a(d);}).catch(b);});};return U;},false);
