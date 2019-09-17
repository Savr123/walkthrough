/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/odata/v4/ODataMetaModel",'sap/ui/core/util/XMLPreprocessor','sap/ui/core/XMLTemplateProcessor'],function(O,X,a){"use strict";function t(Q,T,m,f){var s="./test/",r={read:function(){return Promise.resolve(m);},mHeaders:{}},M=new O(r,s+"$metadata",undefined,null);function b(d,D,B,e){var p={models:Object.assign({},e),bindingContexts:{}};Object.keys(B).forEach(function(k){d.ok(typeof M.getObject(B[k])!=="undefined",k+": "+B[k]+" exists");p.bindingContexts[k]=M.createBindingContext(B[k]);p.models[k]=M;});if(p.models["this"]){p.bindingContexts["this"]=p.models["this"].createBindingContext("/");}return X.process(D,{},p);}Q.module("Smoke Tests for "+T);Q.test("Check if metadata is available",function(d){return Promise.all([M.requestObject("/").then(function(e){d.ok(e,"Entity Container found");}),M.requestObject("/$").then(function(o){d.ok(o,"Metadata Document found");})]);});function c(F){Q.module("Tests for "+T+" against fragment "+F.sFragmentName);F.tests.forEach(function(S,i){Q.test("Test fragment scope: "+i,function(d){return M.requestObject("/$").then(function(){return a.loadTemplatePromise(F.sFragmentName,"fragment");}).then(function(D){return b(d,D,S.mBindingContexts,F.mModels);}).then(function(D){var n=document.createNSResolver(D),e=D.ownerDocument.evaluate('//*[@unittest:id]',D.ownerDocument,n,XPathResult.ANY_TYPE,null),E=e.iterateNext(),g,N=0;function h(E,o,g){function j(A){var R=E.getAttribute(A);d.strictEqual(R,o[A],"unittest:id=\""+g+"\": attribute '"+A+"' properly created as "+R);}Object.keys(o).forEach(j);}while(E){g=E.getAttribute("unittest:id");h(E,S.oExpectedResultsPerTest[g],g);N++;E=e.iterateNext();}d.equal(N,Object.keys(S.oExpectedResultsPerTest).length,"All tests have been executed for this test case");});});});}f.forEach(c);}return{testFragments:t};});
