// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_AppState/AppStatePersistencyMethod","sap/ui/thirdparty/jquery","sap/base/Log"],function(A,q,L){"use strict";var a=function(s,p,c){this._oConfig=c&&c.config;};a.prototype._getPersonalizationService=function(){return sap.ushell.Container.getService("Personalization");};a.prototype.saveAppState=function(k,s,v,b,c,p,P){var o=this._getPersonalizationService(),d=new q.Deferred();o.createEmptyContainer(k,{keyCategory:o.constants.keyCategory.GENERATED_KEY,writeFrequency:o.constants.writeFrequency.HIGH,clientStorageAllowed:false}).done(function(C){C.setItemValue("appStateData",v);C.setItemValue("persistencyMethod",p);C.setItemValue("persistencySettings",P);C.setItemValue("createdBy",sap.ushell.Container&&sap.ushell.Container.getUser&&sap.ushell.Container.getUser().getId());C.save().done(function(){d.resolve();}).fail(function(m){d.reject(m);L.error(m);});}).fail(function(m){L.error(m);d.reject(m);});return d.promise();};a.prototype.loadAppState=function(k){var p=this._getPersonalizationService(),d=new q.Deferred(),t=this;p.getContainer(k,{keyCategory:p.constants.keyCategory.GENERATED_KEY,writeFrequency:p.constants.writeFrequency.HIGH,clientStorageAllowed:false}).done(function(c){var v=c.getItemValue("appStateData"),P=c.getItemValue("persistencyMethod"),o=c.getItemValue("persistencySettings"),C=c.getItemValue("createdBy");if(P===undefined){d.resolve(k,v);}else if(P===A.PersonalState){if(t.getCurrentUserForTesting()===""||t.getCurrentUserForTesting()===C){d.resolve(k,v,P,o);}else{d.reject("Unauthorized User ID");}}}).fail(function(m){L.error(m);d.reject(m);});return d.promise();};a.prototype.getCurrentUserForTesting=function(){return"";};a.prototype.getSupportedPersistencyMethods=function(){return[A.PersonalState,A.ACLProtectedState,A.PublicState,A.AuthorizationProtectedState];};return a;},true);
