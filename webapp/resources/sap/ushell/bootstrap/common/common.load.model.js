// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ui/model/json/JSONModel","sap/ui/thirdparty/jquery","sap/ui/Device"],function(C,J,q,D){"use strict";var _;function a(){var s=C.last("/core"),i={groups:[],rtl:sap.ui.getCore().getConfiguration().getRTL(),personalization:s.shell.enablePersonalization,tagList:[],selectedTags:[],userPreferences:{entries:[]},enableHelp:s.extension.enableHelp,enableTileActionsIcon:D.system.desktop?s.home.enableTileActionsIcon:false};i=q.extend({},s.catalog,s.home,i);_=new J(i);_.setSizeLimit(10000);}function b(m){_.setProperty("/isPhoneWidth",!m.matches);}function c(){var m=window.matchMedia("(min-width: 800px)");if(m.addListener){m.addListener(b);b(m);}}return{getModel:function(){if(!_){a();c();}return _;}};});