/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Definitions","sap/ui/core/Core","sap/gantt/misc/Format"],function(D,C,F){"use strict";var T=D.extend("sap.gantt.shape.ext.TextRepeat",{metadata:{properties:{childTagName:{type:"string",defaultValue:"pattern"},x:{type:"float"},y:{type:"float"},width:{type:"float"},height:{type:"float",defaultValue:15},dx:{type:"string"},dy:{type:"string"},text:{type:"string"},fontSize:{type:"int"},fontFamily:{type:"string"}}}});T.prototype.getChildTagName=function(d,r){if(this.mShapeConfig.hasShapeProperty("childTagName")){return this._configFirst("childTagName",d);}return'pattern';};T.prototype.getX=function(d,r){if(this.mShapeConfig.hasShapeProperty("x")){return this._configFirst("x",d);}var n;var a=this.getAxisTime();if(C.getConfiguration().getRTL()){n=a.timeToView(F.abapTimestampToDate(this.getEndTime(d,r)));}else{n=a.timeToView(F.abapTimestampToDate(this.getTime(d,r)));}if(!jQuery.isNumeric(n)){return 0;}return n;};T.prototype.getY=function(d,r){if(this.mShapeConfig.hasShapeProperty("y")){return this._configFirst("y",d);}return 0;};T.prototype.getWidth=function(d,r){if(this.mShapeConfig.hasShapeProperty("width")){return this._configFirst("width",d);}return 0;};T.prototype.getHeight=function(d,r){if(this.mShapeConfig.hasShapeProperty("height")){return this._configFirst("height",d);}return 0;};T.prototype.getDx=function(d,r){if(this.mShapeConfig.hasShapeProperty("dx")){return this._configFirst("dx",d);}return"0";};T.prototype.getDy=function(d,r){if(this.mShapeConfig.hasShapeProperty("dy")){return this._configFirst("dy",d);}return"0";};T.prototype.getText=function(d,r){if(this.mShapeConfig.hasShapeProperty("text")){return this._configFirst("text",d);}return"";};T.prototype.getContent=function(d,r){if(this.mShapeConfig.hasShapeProperty("content")){return this._configFirst("content",d);}var c=this.getChildTagName(d,r);return"<"+c+" id='"+this.getReferenceId(d,r)+"' patternUnits='userSpaceOnUse'"+" width="+this.getWidth(d,r)+" height="+this.getHeight(d,r)+" x="+this.getX(d,r)+" y="+this.getY(d,r)+"><text dx="+this.getDx(d,r)+" dy="+this.getDy(d,r)+" font-size="+this.getFontSize(d,r)+" font-family='"+this.getFontFamily(d,r)+"'>"+this.getText(d,r)+"</text></"+c+">";};T.prototype.getFontSize=function(d,r){if(this.mShapeConfig.hasShapeProperty("fontSize")){return this._configFirst("fontSize",d,true);}return 12;};T.prototype.getFontFamily=function(d,r){if(this.mShapeConfig.hasShapeProperty("fontFamily")){return this._configFirst("fontFamily",d,true);}return"";};return T;},true);