// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ushell/services/Container","sap/ushell/services/Personalization","sap/base/util/ObjectPath"],function(q,C,P,O){"use strict";var U=function(u,p,a){var o;function g(A){var d=[{id:"sap_belize",name:"SAP Belize"}],e=O.get("config.themes",A);return e===undefined?d:e;}this.updateUserPreferences=function(b){var d=new q.Deferred();function l(e){var E="Failed to update user preferences: "+(e&&e.message?e.message:e);q.sap.log.error(E,e&&e.stack,"com.sap.ushell.adapters.local.UserInfo");}sap.ushell.Container.getServiceAsync("Personalization").then(function(c){var s={keyCategory:c.constants.keyCategory.FIXED_KEY,writeFrequency:c.constants.writeFrequency.LOW,clientStorageAllowed:true};function e(f,b){var h=b.getChangedProperties()||[];h.forEach(function(i){f.setItemValue(i.propertyName,i.newValue);});}c.getContainer("sap.ushell.UserProfile",s,undefined).done(function(f){e(f,b);f.save().fail(function(E){l(E);d.reject(E);}).done(function(){d.resolve();});}).fail(function(E){l(E);d.reject(E);});});return d.promise();};this.getThemeList=function(){var d=new q.Deferred();if(o===undefined){o=g(a);}if(o.length===0){d.reject("no themes were configured");}else{d.resolve({options:o});}return d.promise();};this.getLanguageList=function(){var d=new q.Deferred();d.resolve([{"text":"Browser Language","key":"default"},{"text":"English (United States)","key":"en-US"},{"text":"English (United Kingdom)","key":"en-GB"},{"text":"English","key":"en"},{"text":"German (Germany)","key":"de-DE"},{"text":"Hebrew (Israel)","key":"he-IL"},{"text":"Russian (Russia)","key":"ru-RU"},{"text":"Russian","key":"ru"}]);return d.promise();};};return U;},true);
