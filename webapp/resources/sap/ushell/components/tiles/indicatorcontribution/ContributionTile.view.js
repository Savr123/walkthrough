// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/suite/ui/microchart/ComparisonMicroChartData","sap/suite/ui/microchart/ComparisonMicroChart","sap/ushell/components/tiles/sbtilecontent","sap/m/GenericTile","sap/ui/model/json/JSONModel"],function(C,a,s,G,J){"use strict";sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");sap.ui.jsview("sap.ushell.components.tiles.indicatorcontribution.ContributionTile",{getControllerName:function(){return"sap.ushell.components.tiles.indicatorcontribution.ContributionTile";},createContent:function(){this.setHeight("100%");this.setWidth("100%");var t=this;t.oGenericTileData={};t.oCmprsDataTmpl=new C({title:"{title}",value:"{value}",color:"{color}",displayValue:"{displayValue}"});t.oCmprsChrtTmpl=new a({size:"{/size}",scale:"{/scale}",data:{template:t.oCmprsDataTmpl,path:"/data"}});t.oNVConfS=new s({unit:"{/unit}",size:"{/size}",footer:"{/footerComp}",content:t.oCmprsChrtTmpl});t.oGenericTile=new G({subheader:"{/subheader}",frameType:"{/frameType}",size:"{/size}",header:"{/header}",tileContent:[t.oNVConfS]});t.oGenericTileModel=new J();t.oGenericTileModel.setData(t.oGenericTileData);t.oGenericTile.setModel(t.oGenericTileModel);return t.oGenericTile;}});},true);
