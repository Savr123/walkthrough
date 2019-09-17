sap.ui.define(["sap/m/HeaderContainer","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/ui/comp/odata/ODataModelUtil","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider","sap/ui/comp/smartvariants/PersonalizableInfo","sap/ui/comp/smartvariants/SmartVariantManagement","sap/ui/model/Filter","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/comp/odata/MetadataAnalyser","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms","sap/m/VBox","sap/m/Button","sap/m/Title","sap/suite/ui/generic/template/AnalyticalListPage/controller/DropDownController","sap/suite/ui/generic/template/AnalyticalListPage/controller/DatePickerController","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroBar","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroLine","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroDonut","sap/ui/model/json/JSONModel","sap/ui/core/CustomData","sap/m/Text","sap/m/OverflowToolbarLayoutData","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/model/SimpleType","sap/ui/core/library","sap/m/library","sap/m/DatePicker","sap/base/Log","sap/ui/core/InvisibleText"],function(H,V,O,a,P,S,F,b,T,M,c,d,f,B,g,D,h,k,l,m,J,C,n,o,p,q,r,s,t,u,L,I){"use strict";var v="Donut";var w="Line";var x="Bar";var y=r.extend("sap.ui.model.DimensionFilterType",{formatValue:function(e){return e;},parseValue:function(e){return e;},validateValue:function(e){}});var z=H.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",{metadata:{designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},config:{type:"object",group:"Misc",defaultValue:null},persistencyKey:{type:"string",group:"Misc",defaultValue:null},lazyLoadVisualFilter:{type:"boolean",group:"Misc",defaultValue:false},displayCurrency:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null}},associations:{smartVariant:{type:"sap.ui.core.Control",multiple:false}},events:{filterChange:{},Initialized:{},onFilterItemAdded:{}}},renderer:{}});z.prototype.init=function(){if(H.prototype.init){H.prototype.init.apply(this,arguments);}var i=jQuery(document.body).hasClass("sapUiSizeCozy");this._cellItemHeightNorth=i?"3rem":"2rem";this._cellItemHeightSouth=i?"9.9rem":"7.5rem";q.system.phone?this._cellItemHeightSouth="9rem":"";this._cellHeight=i?"12rem":"11rem";this._cellWidth="20rem";this.labelHeight=2.0;this.compHeight=i?9.9:7.9;this.cellHeightPadding=1;this.cellHeight=(this.labelHeight+this.compHeight+this.cellHeightPadding)+"rem";this.cellWidth=320;this._dialogFilters={};this._compactFilters={};this._oVariantConfig={};this._smartFilterContext;this._oMetadataAnalyser;this.setModel(new J(),'_visualFilterConfigModel');if(i){if(q.system.phone){this.setOrientation("Vertical");this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozyPhone");}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozy");}}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBar");}};z.prototype.propagateProperties=function(){H.prototype.propagateProperties.apply(this,arguments);this._initMetadata();};z.prototype._initMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInit);}};z.prototype._onMetadataInit=function(){if(this._smartFilterContext.isInitialised()){this._initiateVisualFilterLoad();}else{this._smartFilterContext.attachInitialized(this._initiateVisualFilterLoad,this);}};z.prototype._initiateVisualFilterLoad=function(){if(this.bIsInitialised){return;}this._annoProvider=this._createVisualFilterProvider();if(!this._annoProvider){return;}this._oMetadataAnalyser=this._annoProvider.getMetadataAnalyser();this.bIsInitialised=true;this._updateFilterBar();};z.prototype._createVisualFilterProvider=function(){var e=this.getModel();var i=this.getEntitySet();if(!e||!i){return null;}return new a(this);};z.prototype._getBasicGroupTitle=function(){return this.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");};z.prototype._getFieldGroupForProperty=function(e,i){return this._annoProvider?this._annoProvider._getFieldGroupForProperty(e,i):undefined;};z.prototype._getGroupList=function(){return this._annoProvider?this._annoProvider.getGroupList():[];};z.prototype._getGroupMap=function(){return this._annoProvider?this._annoProvider.getGroupMap():{};};z.prototype._getMeasureMap=function(){return this._annoProvider?this._annoProvider.getMeasureMap():{};};z.prototype._getDimensionMap=function(){return this._annoProvider?this._annoProvider.getDimensionMap():{};};z.prototype.setSmartFilterContext=function(e){this._smartFilterContext=e;};z.prototype._updateFilterBar=function(){var e=this._getAnnotationSettings();if(e&&e.filterList){var i=this._convertSettingsToConfig(e);}else{i={filterCompList:[]};this.getModel('_visualFilterConfigModel').setData(i);return;}var j=this._getVariantConfig();if(j&&j.config){i.filterCompList.forEach(function(A){if(j.config[A.component.properties.parentProperty]){jQuery.extend(true,A,j.config[A.component.properties.parentProperty]);}});this._oVariantConfig=i;}this.unbindAggregation('content',true);this.getModel('_visualFilterConfigModel').setData(i);this.bindAggregation('content',{path:"_visualFilterConfigModel>/filterCompList",factory:function(A,E){var G=E.getProperty('component'),K=G?G.properties:undefined,N=this._resolveChartType(G?G.type:undefined);return this._createHeaderItems(E.sPath,N,K);}.bind(this),filters:new F("shownInFilterBar",p.EQ,true)});this.fireInitialized();};z.prototype._createHeaderItems=function(j,A,E){var G=this._createFilterItemOfType(A,E);G.data("isDialogFilterItem","false");var K=E.selectFilters&&E.selectFilters.SelectOptions,N=G.getInParameters(),Q=[],R=this;if(N&&N.length>0){N.forEach(function(e){Q.push({path:'_filter>/'+e.localDataProperty});});}G.addCustomData(new C({key:'sPath',value:j}));if(E.stringdate){G.addCustomData(new C({key:'stringdate',value:E.stringdate}));}if(R.getEntitySet()===G.getEntitySet()){var U=R._smartFilterContext.determineMandatoryFilterItems();if(U&&U.length>0){U.forEach(function(e){if(!e.data("isCustomField")){Q.push({path:'_filter>/'+e.getName()});}});}}G.bindProperty('dimensionFilter',{path:'_filter>/'+G.getParentProperty(),type:new y()});G.bindProperty('measureField',{path:'_visualFilterConfigModel>'+j+'/component/properties/measureField'});G.bindProperty('sortOrder',{path:'_visualFilterConfigModel>'+j+'/component/properties/sortOrder'});G.bindProperty('unitField',{path:'_visualFilterConfigModel>'+j+'/component/properties/measureField',formatter:function(){var e=R._getMeasureMap();var d1=e[this.getEntitySet()][this.getMeasureField()];return d1?d1.fieldInfo.unit:"";}});if(Q&&Q.length>0){G.bindProperty('dimensionFilterExternal',{parts:Q,formatter:function(){var N=this.getInParameters()||[];var d1=this.getParentProperty();var e1,f1;if(R.getEntitySet()===this.getEntitySet()){var U=R._smartFilterContext.determineMandatoryFilterItems();U.forEach(function(u1){var v1=u1.getName();var w1=N&&N.some(function(e){return e.localDataProperty===v1;});if(v1.indexOf("$Parameter")===-1&&!w1){N.push({localDataProperty:v1,valueListProperty:v1});}});}if(!(R.getEntitySet()===this.getEntitySet()&&R._smartFilterContext.getAnalyticBindingPath()!=="")&&(R._smartFilterContext.getAnalyticBindingPath()===""||R._smartFilterContext.getAnalyticBindingPath().indexOf("P_DisplayCurrency")!=-1)){var g1=this.getMeasureField();var h1=R.getModel();var i1=h1.getMetaModel();var j1=i1.getODataEntityType(R._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet()));var k1=i1.getODataEntitySet(this.getEntitySet());var l1=i1.getODataProperty(j1,g1);var m1=R.getProperty("displayCurrency");var n1=l1&&l1[d.ISOCurrency];if(m1&&n1){var o1=n1.Path;for(var p1=(N.length-1);p1>-1;p1--){var q1=N[p1].valueListProperty;var r1=N[p1].localDataProperty;if(q1===o1){var s1=R._smartFilterContext.getFilterData();if(!s1[r1]){f1=i1.getODataProperty(j1,o1);var t1=f1&&c.isPropertyNonFilterable(k1,f1.name);if(!t1){e1=new F({aFilters:[new F({path:o1,operator:"EQ",value1:m1,value2:undefined})],and:false});}}break;}}}}if(this.getId().indexOf("donut")!==-1){this._inParameterFilterList=new F({aFilters:[],bAnd:true});}return R._getFiltersForFilterItem(N,d1,e1,o1,K,this._inParameterFilterList);}});}else if(K&&K.length>0){var W=new F({aFilters:[],bAnd:true});for(var i in K){var X=K[i];W=this.fnAddSelectOptionsToFilters(X,W);}G.setProperty('dimensionFilterExternal',W);}if(G.attachFilterChange){G.attachFilterChange(this._onFilterChange,this);}if(G.attachTitleChange){G.attachTitleChange(this._onTitleChange,this);}var Y=this._createTitleToolbar(E,G),Z=new f({height:this._cellItemHeightNorth,items:[Y]});var $=new f({width:"100%",height:this._cellItemHeightSouth,items:[new n({width:this.cellWidth+"px",textAlign:s.TextAlign.Center,text:{path:'_visualFilterConfigModel>'+j+'/overlayMessage',formatter:function(e){return e&&this.getModel("i18n").getResourceBundle().getText(e);}}})],visible:{path:'_visualFilterConfigModel>'+j+'/showChartOverlay',formatter:function(e){return e;}}});$.addStyleClass("sapUiOverlay");$.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflow");$.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflowCozy");var _=new f({height:this._cellItemHeightSouth,items:[G],visible:{path:"_visualFilterConfigModel>"+j+"/showChartOverlay",formatter:function(e){return!e;}}});var a1="visualFilterBarInvisibleText"+G.getParentProperty();var b1=new I({id:a1});if(this.getAriaLabelledBy().indexOf(a1)===-1){this.addAriaLabelledBy(a1);}var c1=new f({fieldGroupIds:["headerBar"],height:this._cellHeight,width:this.cellWidth+"px",items:[Z,$,_,b1]});Z.addStyleClass("sapSmartTemplatesAnalyticalListPageVFTitle");$.addStyleClass("sapSmartTemplatesAnalyticalListPageVFChart");_.addStyleClass("sapSmartTemplatesAnalyticalListPageVFChart");this.fireOnFilterItemAdded(G);return c1;};z.prototype.fnAddSelectOptionsToFilters=function(e,i){var j=new F({aFilters:[],bAnd:false});var A=this,E=e.PropertyName&&e.PropertyName.PropertyPath;e.Ranges.forEach(function(R){var G=R.Low&&R.Low.String,K=R.Sign&&R.Sign.EnumMember&&R.Sign.EnumMember.split("/")[1],N=R.Option&&R.Option.EnumMember&&R.Option.EnumMember.split("/")[1],Q=R.High&&R.High.String;var U=A._getSelectOptionFilters(E,G,Q,N,K);j.aFilters.push(U);});i.aFilters.push(j);return i;};z.prototype._getAnnotationSettings=function(){return this._annoProvider?this._annoProvider.getVisualFilterConfig():null;};z.prototype._convertSettingsToConfig=function(e,A){var E={filterCompList:[]};var G=this._getGroupList();var K={};for(var i=0;i<G.length;i++){var N=G[i];for(var j=0;j<N.fieldList.length;j++){var Q=N.fieldList[j];K[Q.name]={name:N.name,label:N.label};}}var R=this._getGroupMap();var U=R["_BASIC"];var W=[];if(U&&U.fieldList){for(var i=0;i<U.fieldList.length;i++){W.push(U.fieldList[i].name);}}var X=this._getMeasureMap(),Y=e.filterList,Z={};for(var i=0;i<Y.length;i++){var $=Y[i];var _=$.dimension.field;var a1=X[$.collectionPath][$.measure.field];var b1=false;if(a1.fieldInfo[d.ISOCurrency]){b1=true;}var c1={shownInFilterBar:$.selected,component:{type:$.type,properties:{sortOrder:$.sortOrder,measureField:$.measure.field,parentProperty:$.parentProperty?$.parentProperty:undefined,stringdate:$.stringdate}}};if(!A){var d1={shownInFilterDialog:$.selected||W.indexOf(_)!=-1,group:K[$.parentProperty],component:{properties:{selectFilters:$.selectionVariant?$.selectionVariant:undefined,scaleFactor:$.scaleFactor,numberOfFractionalDigits:$.numberOfFractionalDigits,filterRestriction:$.filterRestriction,lazyLoadVisualFilter:this.getLazyLoadVisualFilter(),width:this.cellWidth+"px",height:this.compHeight+"rem",entitySet:$.collectionPath?$.collectionPath:this.getEntitySet(),dimensionField:_,dimensionFieldDisplay:$.dimension.fieldDisplay,dimensionFilter:$.dimensionFilter,unitField:a1?a1.fieldInfo.unit:"",isCurrency:b1,isDropDown:$.isDropDown,isMandatory:$.isMandatory,outParameter:$.outParameter?$.outParameter:undefined,inParameters:$.inParameters?$.inParameters:undefined,textArrangement:$.displayBehaviour,chartQualifier:$.chartQualifier?$.chartQualifier:undefined,dimensionFieldIsDateTime:$.dimensionFieldIsDateTime,dimensionFieldIsDateTimeOffset:$.dimensionFieldIsDateTimeOffset}}};jQuery.extend(true,c1,d1);E.filterCompList.push(c1);}else{Z[$.parentProperty]=c1;}}return A?Z:E;};z.prototype._setVariantModified=function(){if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(true);}};z.prototype._checkMandatoryFilters=function(){var e=this._smartFilterContext.getFilterData();var j=this._smartFilterContext.determineMandatoryFilterItems();var A=false;for(var i=0;i<j.length;i++){if(e[j[i].getName()]===undefined){if(e._CUSTOM["sap.suite.ui.generic.template.customData"][j[i].getName()]===undefined){A=true;break;}}}if(A){this._smartFilterContext.showFilterDialog();}};z.prototype._onFilterChange=function(e){this._setVariantModified();this.fireFilterChange();this._checkMandatoryFilters();};z.prototype._getFiltersForFilterItem=function(e,j,A,E,G,K){var N={},Q=[],R=[],U=new F({aFilters:[],bAnd:true});if(e&&e.length>0){var W=function(c1){c1.sPath=Z;};for(var X=(e.length-1);X>-1;X--){var Y=e[X].localDataProperty,Z=e[X].valueListProperty;if(G){for(var i=0;i<G.length;i++){var $=G[i];var _=$.PropertyName&&$.PropertyName.PropertyPath;if(R.indexOf(_)===-1){if(_===j){U=this.fnAddSelectOptionsToFilters($,U);R.push(_);}else{var a1=this._smartFilterContext.determineFilterItemByName(_);if(a1&&(a1.getVisibleInFilterBar()||a1.getPartOfCurrentVariant())){var b1=this._smartFilterContext.getFilters([_]);if((b1&&b1.length)||(Q.indexOf(_)!==-1)){continue;}else{U=this.fnAddSelectOptionsToFilters($,U);R.push(_);}}else{U=this.fnAddSelectOptionsToFilters($,U);R.push(_);}}}}}if(Y!==j&&Q.indexOf(Y)===-1){var a1=this._smartFilterContext.determineFilterItemByName(Y);if(a1&&(a1.getVisibleInFilterBar()||a1.getPartOfCurrentVariant())){N=this._smartFilterContext.getFilters([Y]);if(N&&N.length>0){if(N[0].aFilters){N[0].aFilters.forEach(W.bind(this));}else{W(N[0]);}Q.push(Y);U.aFilters.push(N[0]);if(K){K.aFilters.push(N[0]);}}}}}if(A){U.aFilters.push(A);}}else{if(G&&G.length){for(var i=0;i<G.length;i++){var $=G[i];U=this.fnAddSelectOptionsToFilters($,U);}}}return U;};z.prototype._getSelectOptionFilters=function(e,i,j,A,E){if(E==="E"){if(A!==p.EQ){L.error("Exclude sign is supported only with EQ operator");return;}else{A=p.NE;E="I";}}if(A==="CP"){A=p.Contains;if(i.indexOf("*")!==-1){var G=i.indexOf('*');var K=i.lastIndexOf('*');if(G>-1){if((G===0)&&(K!==(i.length-1))){A=p.EndsWith;i=i.substring(1,i.length);}else if((G!==0)&&(K===(i.length-1))){A=p.StartsWith;i=i.substring(0,i.length-1);}else{i=i.substring(1,i.length-1);}}}}var N=new F({path:e,sign:E,operator:A,value1:i,value2:j});return N;};z.prototype._createTitleToolbar=function(e,i){var A=this.getModel("@i18n");var j=i.getTitle(A);var E=new g({text:j.titleMD,titleStyle:s.TitleLevel.H6});if(i.getProperty("isMandatory")){E.addStyleClass("sapMLabelRequired");}var G=new g({text:j.titleUnitCurr.length>1?"| "+j.titleUnitCurr:"",titleStyle:s.TitleLevel.H6,width:"4.15rem"});E.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleText");G.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleText");var K=this._smartFilterContext.getControlByKey(e.parentProperty);this._smartFilterContext.ensureLoadedValueHelp(e.parentProperty);if(K){var N=c.getPropertyNameDisplay(this.getModel(),i.getEntitySet(),i.getDimensionField(),A),Q=this.getModel("i18n").getResourceBundle(),R=K.getShowValueHelp&&K.getShowValueHelp()&&!e.dimensionFieldIsDateTimeOffset,U=K.getMetadata().getName()==="sap.m.DateTimePicker",W=K instanceof u,X=(W&&!U)?"sap-icon://appointment-2":"",Y=(e.isDropDown)?"sap-icon://slim-arrow-down":"",Z=R?"sap-icon://value-help":X||Y,$,_=new B({text:{path:"_filter>/"+i.getParentProperty(),formatter:function(b1){var c1=i.getFilterRestriction();$=0;if(b1){if(c1==='single'){$=1;}else{if(typeof b1==="object"){if(b1.value){$++;}if(b1.items&&b1.items.length){$+=b1.items.length;}if(b1.ranges&&b1.ranges.length){$+=b1.ranges.length;}}else{$++;}}}return $?"("+$+")":"";}},icon:(R||e.isDropDown||W)?Z:"",visible:{path:"_filter>/"+i.getParentProperty(),formatter:function(b1){if(R||e.isDropDown||(W&&!U)){return true;}else{if(!b1){return false;}if(typeof b1==="object"){if(b1 instanceof Date){return true;}return(b1.value||(b1.items&&b1.items.length)||(b1.ranges&&b1.ranges.length))?true:false;}return true;}}},enabled:{path:'_visualFilterConfigModel>'+i.data("sPath")+'/showChartOverlay',formatter:function(b1){return!b1;}},press:function(b1){if(R){if(K.getParent().getParent()===null){this._smartFilterContext.addAggregation('dependents',K.getParent());}K.fireValueHelpRequest.call(K);}else if(e.isDropDown){var c1=this._isDimensionFieldFilterable(this.getModel(),e.entitySet,e.dimensionField),d1=this.getModel("visualFilter")||this.getModel();D.createDropdown(b1.getSource(),i,d1,N,e,c1);}else if(W&&!U){h._createDatePicker(b1.getSource(),i);}else{V.launchAllFiltersPopup(_,i,b1.getSource().getModel('i18n'));}}.bind(this),layoutData:new o({priority:t.OverflowToolbarPriority.NeverOverflow}),tooltip:{path:"_filter>/"+i.getParentProperty(),formatter:function(){return c.getTooltipForValueHelp(R,N,Q,$,W);}}});}var a1=new b({design:t.ToolbarDesign.Transparent,width:this.cellWidth+"px",content:[E,G,new T(),_]});a1.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleToolbar");return a1;};z.prototype._isDimensionFieldFilterable=function(e,E,i){var j=e.getMetaModel(),A=j.getODataEntitySet(E),G=j.getODataEntityType(A.entityType),K=j.getODataProperty(G,i);return(K["sap:filterable"]===undefined)?true:K["sap:filterable"];};z.prototype.getTitleByFilterItemConfig=function(e,i,j){var A=e.component.properties;var E=A.entitySet;var G=this.getModel();var K=this.getModel("@i18n");if(!G){return"";}var N=c.getPropertyNameDisplay(G,E,A.measureField,K);var Q=c.getPropertyNameDisplay(G,E,A.dimensionField,K);if(!i){i="";}if(!j){j="";}var R=this.getModel("i18n").getResourceBundle();var U=R.getText("VIS_FILTER_TITLE_MD",[N,Q]);var W=j+" "+i;W=W.trim();var X={titleMD:U,titleUnitCurr:W};return X;};z.prototype._updateVisualFilterAria=function(e,i,j){var A=e.getItems();var R=this.getModel("i18n").getResourceBundle();var E=R.getText("VIS_FILTER_ITEM_ARIA");var G=i.getParentProperty();if(i.getProperty("isMandatory")){E+=" "+R.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA",G);}var K=A[0].getItems()[0].getContent()[0];var N=A[0].getItems()[0].getContent()[1];E+=" "+(N.getText().length>0?K.getText()+N.getText():K.getText());if(j==="true"){E+=" "+A[1].getItems()[0].getText();E+=" "+R.getText("VIS_FILTER_BAR_NAVIGATE_ARIA");}else{E+=" "+R.getText("VIS_FILTER_BAR_NAVIGATE_ARIA")+" "+R.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");}A[A.length-1].setText(E);};z.prototype._onTitleChange=function(e){var i=e.getSource().getParent().getParent();var j=i.getItems()[i.getItems().length-2].getItems()[0];if(j.data("sOverlay")!=="true"){var A=i.getItems()[0].getItems()[0].getContent()[0];var E=i.getItems()[0].getItems()[0].getContent()[1];var G=this.getModel("i18n");var K=this.getModel("@i18n");if(!G){return"";}var N=G.getResourceBundle();if(e.getSource().getProperty("isMandatory")){A.addStyleClass("sapMLabelRequired");}var Q=e.getSource().getTitle(K);A.setText(Q.titleMD);var R=Q.titleUnitCurr==""?Q.titleMD:N.getText("VIS_FILTER_TITLE_MD_WITH_UNIT_CURR",[Q.titleMD,Q.titleUnitCurr]);A.setTooltip(R);E.setText(Q.titleUnitCurr.length>0?"| "+Q.titleUnitCurr:"");E.setTooltip("");var U=Q.titleUnitCurr.split(" ");if(Q.titleUnitCurr==""){E.setVisible(false);}else{E.setVisible(true);var W=U.length>1?"4.15rem":"2.4rem";E.setWidth(W);}}this._updateVisualFilterAria(i,j,j.data("sOverlay"));};z.prototype._getSupportedFilterItemList=function(){if(!this._supportedFilterItemList){this._supportedFilterItemList=[{type:"Bar",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroBar",iconLink:"sap-icon://horizontal-bar-chart",textKey:"VISUAL_FILTER_CHART_TYPE_BAR"},{type:"Donut",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroDonut",iconLink:"sap-icon://donut-chart",textKey:"VISUAL_FILTER_CHART_TYPE_Donut"},{type:"Line",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine",iconLink:"sap-icon://line-charts",textKey:"VISUAL_FILTER_CHART_TYPE_Line"}];}return this._supportedFilterItemList;};z.prototype._getSupportedFilterItemMap=function(){if(!this._supportedFilterItemMap){this._supportedFilterItemMap={};var e=this._getSupportedFilterItemList();for(var i=0;i<e.length;i++){var j=e[i];this._supportedFilterItemMap[j.type]=j;}}return this._supportedFilterItemMap;};z.prototype._resolveChartType=function(e){var i=this._getSupportedFilterItemMap();var j=i[e];if(!j){var A;for(A in i){j=i[A];break;}L.error("Could not resolve the filter component type: \""+e+"\", falling back to "+A);e=A;}return e;};z.prototype._createFilterItemOfType=function(e,i){var j;if(e===x){j=new k(i);}else if(e===w){j=new l(i);}else if(e===v){j=new m(i);}j.setSmartFilterId(this.getSmartFilterId());j.setModel(this.getModel('i18n'),'i18n');j.setModel(this.getModel("_templPriv"),"_templPriv");if(!this._smartFilterContext.isDialogOpen()){j.setModel(this.getModel('_filter'),'_filter');j.setModel(this.getModel('_visualFilterConfigModel'),"_visualFilterConfigModel");}j.setModel(this.getModel());var A=this.getModel("visualFilter");if(A){j.setModel(A,"visualFilter");}return j;};z.prototype.getConfig=function(e){var j=this.getModel('_visualFilterConfigModel').getData(),A={};if(!j){return{filterCompList:[]};}var E=0;var G=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<j.filterCompList.length;i++){var K=j.filterCompList[i];if(e){A[K.component.properties.parentProperty]={shownInFilterBar:K.shownInFilterBar,shownInFilterDialog:K.shownInFilterDialog,component:{type:K.component.type,properties:{measureField:K.component.properties.measureField,sortOrder:K.component.properties.sortOrder,parentProperty:K.component.properties.parentProperty}}};}else{if(!K.shownInFilterBar){continue;}var N=G[E];if(!N){L.error("The configured selected filter bar items do not correspond to the actual filter bar items.  Could be an error during initialization, e.g. a chart class not found");return{filterCompList:[]};}E++;if(N._chart){var Q=N;K.component.properties=Q.getP13NConfig();}}}return e?A:j;};z.prototype.setSmartVariant=function(e){this.setAssociation("smartVariant",e);if(e){var i=new P({type:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",keyName:"persistencyKey"});i.setControl(this);}this._oVariantManagement=this._getVariantManagementControl(e);if(this._oVariantManagement){this._oVariantManagement.addPersonalizableControl(i);this._oVariantManagement.initialise(this._variantInitialised,this);this._oVariantManagement.attachSave(this._onVariantSave,this);}else if(e){if(typeof e==="string"){L.error("Variant with id="+e+" cannot be found");}else if(e instanceof sap.ui.core.Control){L.error("Variant with id="+e.getId()+" cannot be found");}}else{L.error("Missing SmartVariant");}};z.prototype._getVariantManagementControl=function(e){var i=null;if(e){i=typeof e=="string"?sap.ui.getCore().byId(e):e;if(i&&!(i instanceof S)){L.error("Control with the id="+e.getId?e.getId():e+" not of expected type");return null;}}return i;};z.prototype._variantInitialised=function(){if(!this._oCurrentVariant){this._oCurrentVariant="STANDARD";}};z.prototype._onVariantSave=function(){if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant={config:this.getConfig(true)};}};z.prototype.applyVariant=function(e,i){this._oCurrentVariant=e;if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config&&this._oCurrentVariant.config.filterCompList){this._oCurrentVariant.config=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config==null){var j=this._getAnnotationSettings();if(j&&j.filterList){this._oCurrentVariant.config=this._convertSettingsToConfig(j,true);}}this._updateFilterBar();if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(false);}};z.prototype._getVariantConfig=function(){return this._oCurrentVariant;};z.prototype.fetchVariant=function(){if(!this._oCurrentVariant||this._oCurrentVariant=="STANDARD"){var e=this._getAnnotationSettings();if(e&&e.filterList){this._oCurrentVariant={config:this._convertSettingsToConfig(e,true)};return this._oCurrentVariant;}else{return{config:null};}}return{config:this.getConfig(true)};};z.prototype._getStandardVariantConfig=function(){var e=this._getAnnotationSettings();var i=this._convertSettingsToConfig(e);return i;};z.prototype.updateVisualFilterBindings=function(A,U){if(U){for(var i in this.filterChartList){var e=this.filterChartList[i];if(e._chart){e._updateBinding();e._bAllowBindingUpdateOnPropertyChange=A===true;}}}else{var j=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<j.length;i++){if(j[i]._chart){j[i]._updateBinding();j[i]._bAllowBindingUpdateOnPropertyChange=A===true;}}}};z.prototype.addVisualFiltersToBasicArea=function(e){var j=jQuery.extend(true,{},this.getModel('_visualFilterConfigModel').getData()),A=(e&&e.constructor===Array&&e.length)?e.length:0,E=0;if(!j){L.error("Could not add filter to basic area. No config found!");return false;}else if(!A){L.error("Improper parameter passed. Pass an array of properties.");return false;}else{for(var i=0;i<j.filterCompList.length;i++){var G=j.filterCompList[i];if(e.indexOf(c.readProperty(G.component.properties.parentProperty))!==-1&&!G.shownInFilterBar){G.shownInFilterBar=true;G.shownInFilterDialog=true;E++;}}if(E){this.getModel('_visualFilterConfigModel').setData(j);return true;}else{L.info("Filters already present in visual filter basic area");return false;}}};return z;},true);
