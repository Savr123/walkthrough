/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/thirdparty/jszip','sap/ui/core/util/File'],function(q,J,F){"use strict";var A=function(){this._mData={};};A.prototype.add=function(n,d,t){if(!n){q.sap.log.error("Archiver: No name was given.");return false;}if(!d){q.sap.log.error("Archiver: No data was given.");return false;}if(typeof d==="string"){this._mData[n]=d;return true;}else if(t){if((t==="json"||t==="har")&&(q.isPlainObject(d)||q.isArray(d))){try{this._mData[n]=JSON.stringify(d);return true;}catch(e){q.sap.log.error("Archiver: JSON data could not be serialized for "+n);}}else{q.sap.log.error("Archiver: JSON data could not be serialized for "+t+". Either the type is unknown or the data has a wrong format.");}}else{q.sap.log.error("Archiver: Data could not be serialized for "+n+". Data is is not a string or has a an invalid type.");return false;}return false;};A.prototype.download=function(f){var z=new J();if(z){for(var n in this._mData){z.file(n,this._mData[n]);}var c=z.generate({type:"blob"});F.save(c,f,"zip","application/zip");}};A.prototype.clear=function(){this._mData={};return true;};A.prototype.hasData=function(n){if(n!==undefined){return this._mData.hasOwnProperty(n);}return Object.keys(this._mData).length>0;};return A;},true);