/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/m/Label'],function(C,L){"use strict";var P=C.extend("sap.ui.integration.designtime.controls.PropertyEditor",{metadata:{properties:{"renderLabel":{type:"boolean",defaultValue:true}},aggregations:{"_label":{type:"sap.m.Label",visibility:"hidden",multiple:false},"content":{type:"sap.ui.core.Control"}},events:{propertyChanged:{type:"object"}}},getPropertyInfo:function(){return this.getBindingContext().getObject();},getLabel:function(){var l=this.getAggregation("_label");if(!l){l=new L({text:"{label}"});this.setAggregation("_label",l);}return l;},renderer:function(r,p){r.write("<div");r.writeElementData(p);r.writeClasses();r.writeStyles();r.write(">");if(p.getRenderLabel()){r.write("<div>");r.renderControl(p.getLabel());r.write("</div><div>");}p.getContent().forEach(function(c){r.renderControl(c);});if(p.getRenderLabel()){r.write("</div>");}r.write("</div>");},firePropertyChanged:function(v){this.fireEvent("propertyChanged",{path:this.getPropertyInfo().path,value:v});}});return P;});
