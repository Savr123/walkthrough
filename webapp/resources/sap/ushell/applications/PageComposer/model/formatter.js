// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/format/DateFormat"],function(D){"use strict";var _=function(d){var o=new Date(d);if(isNaN(o.getTime())){return d;}var f=D.getInstance({format:"yMMMd"});return f.format(o);};var a=function(t){return"<strong>"+t+"</strong>";};var b=function(d){return a(_(d));};var c=function(i){return i.map(function(I){return I.content.id;}).join("\n");};return{date:_,bold:a,boldDate:b,deleteDialogText:c};});
