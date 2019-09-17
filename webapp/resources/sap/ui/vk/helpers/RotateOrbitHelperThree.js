/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider","../NS"],function(E,N){"use strict";var R=E.extend(N.getName("helpers.RotateOrbitHelperThree"),{metadata:{publicMethods:["rotate"]},constructor:function(r){this._tool=r;}});R.prototype.destroy=function(){this._tool=null;};R.prototype.activateOrbitMode=function(){this._tool._viewport._viewportGestureHandler._cameraController.isTurnTableMode=false;return this;};R.prototype.deactivateOrbitMode=function(){this._tool._viewport._viewportGestureHandler._cameraController.isTurnTableMode=true;return this;};R.prototype.rotate=function(d,a){this._tool._viewport._viewportGestureHandler._cameraController.rotate(d,a,false);return this;};return R;});
