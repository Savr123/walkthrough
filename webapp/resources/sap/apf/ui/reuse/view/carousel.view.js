/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/ui/utils/constants","sap/m/CustomListItem","sap/m/List","sap/m/ListType","sap/m/Button","sap/m/ScrollContainer"],function(C,a,l,L,b,s){'use strict';var v=sap.ui.jsview("sap.apf.ui.reuse.view.carousel",{onListItemPressed:function(e){this.getController().listItemPressed(e);},createCustomListItem:function(c){var o=new a({content:c,type:L.Active,press:this.onListItemPressed.bind(this)});o.addEventDelegate({onAfterRendering:function(){var S=this.getViewData().analysisPath.oCarousel.getContent()[0];var n=this.getViewData().analysisPath.oCarousel.getCustomItemList().length;var d=this.getViewData().analysisPath.oCarousel.getCustomItemList()[n-1];S.scrollToElement(d.getDomRef());}},this);return o;},addCustomListItem:function(c){this.oCustomItemList.addItem(c);},onDeleteCustomListItem:function(e){this.getController().deleteCustomListItem(e.getParameters().listItem.sId);},getCustomItemList:function(){return this.oCustomItemList.getItems();},removeCustomItem:function(i){return this.oCustomItemList.removeItem(i);},insertCustomItem:function(c,i){return this.oCustomItemList.insertItem(c,i);},getStepGallery:function(){return this.stepGalleryView;},oldCarouselContent:function(c){},getAddStepButton:function(){return this.addStepButton;},createCarouselContent:function(c){var t=this;this.addStepButton=new b({id:c.createId("idAddAnalysisStepButtonInFooter"),text:t.oCoreApi.getTextNotHtmlEncoded("add-step"),tooltip:t.oCoreApi.getTextNotHtmlEncoded("add-step"),icon:"sap-icon://add",press:function(e){c.showStepGallery();}});this.moveUpButton=new b({id:c.createId("idMoveStepUpButtonInFooter"),icon:"sap-icon://arrow-top",tooltip:t.oCoreApi.getTextNotHtmlEncoded("moveStepUp"),press:function(e){c.handleMove({down:false});}});this.moveDownButton=new b({id:c.createId("idMoveStepDownButtonInFooter"),icon:"sap-icon://arrow-bottom",tooltip:t.oCoreApi.getTextNotHtmlEncoded("moveStepDown"),press:function(e){c.handleMove({down:true});}});this.oCustomItemList=new l({id:"stepList",mode:"Delete",delete:function(e){t.onDeleteCustomListItem(e);}});this.oCarousel=new s({content:this.oCustomItemList,horizontal:false,vertical:true}).addStyleClass("scrollContainerEle");this.stepGalleryView=t.oUiApi.getStepGallery();return this.oCarousel;},getControllerName:function(){return"sap.apf.ui.reuse.controller.carousel";},createContent:function(c){var V=this.getViewData().oInject;this.oController=c;this.oCoreApi=V.oCoreApi;this.oUiApi=V.uiApi;return this.createCarouselContent(c);}});return v;});
