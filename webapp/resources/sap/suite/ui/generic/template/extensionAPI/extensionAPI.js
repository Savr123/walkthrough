sap.ui.define(["sap/suite/ui/generic/template/lib/TemplateAssembler","sap/base/Log"],function(T,L){"use strict";return{getExtensionAPI:function(c){return T.getExtensionAPI(c);},getExtensionAPIPromise:function(c){return T.getExtensionAPIPromise(c);},registerControllerExtensions:function(c,e){var C={onInit:function(){var s=this.getOwnerComponent().getEntitySet();var i=e[s];var I=(i&&i.onInit)||jQuery.noop;I.call(i,this);}};var m=Object.create(null);var M,E;for(var s in e){var i=e[s];for(M in i){if(M!=="onInit"&&M!=="getMetadata"){var f=i[M];if(typeof f==="function"){E=m[M];if(!E){E=Object.create(null);m[M]=E;}E[s]=f.bind(i);}}}}var a=function(b){var d=m[b];return function(){var g=this.getOwnerComponent().getEntitySet();var I=d[g]||function(){L.error("No implementation for function "+b+" for entity set "+g);};return I.apply(null,arguments);};};for(M in m){C[M]=a(M);}sap.ui.controller(c,C);}};});
