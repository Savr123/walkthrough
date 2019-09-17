/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../NS","sap/ui/base/ManagedObject"],function(N,M){"use strict";var A=M.extend(N.getName("AnimationTimeController"),{metadata:{library:N.getName(),associations:{viewport:{type:N.getName("threejs.Viewport")}}}});A.status={playing:1,pausing:2,stopped:3,completed:4,dragging:5,none:6};A.prototype.reset=function(){this._totalDuration=0;this._startTime=0;this._currentStatus=A.status.stopped;this._previousStatus=A.status.none;this._previousProgress=0;this._currentProgress=0;this._justStarted=false;this._infinite=false;};A.prototype.init=function(){if(M.prototype.init){M.prototype.init.call(this);}this.reset();};A.prototype.setInfinite=function(i){this._infinite=i;};A.prototype.getInfinite=function(){return this._infinite;};A.prototype.startAnimation=function(d,a){this._totalDuration=d;this._startTime=Date.now();if(this._currentStatus===A.status.dragging||this._currentStatus===A.status.pausing||a){this._previousProgress=0;}else{this._currentStatus=A.status.playing;this._currentProgress=0;this._previousProgress=0;}this._justStarted=true;};A.prototype.stopAnimation=function(){this._currentStatus=A.status.stopped;this._previousStatus=A.status.none;};A.prototype.isAnimationStopped=function(){return this._currentStatus===A.status.stopped;};A.prototype.getCurrentStatus=function(){if(this._currentStatus===A.status.playing){var c=Date.now();this._currentProgress=(c-this._startTime)/this._totalDuration/10;}else if(this._currentStatus===A.status.stopped){this._currentProgress=0;this._previousProgress=0;}else if(this._currentStatus===A.status.completed){this._currentProgress=100;this._previousProgress=100;}if(this._currentProgress>=100&&!this._infinite){this._currentProgress=100;this._currentStatus=A.status.completed;}var r={};r.delta=this._totalDuration*(this._currentProgress-this._previousProgress)/100;if(r.delta<0){r.progress=-1;}else{r.progress=this._currentProgress;}this._previousProgress=this._currentProgress;if(this._justStarted&&r.delta===0){r.delta=this._totalDuration*0.00001;}if(r.delta>=0){this._justStarted=false;}return r;};A.prototype.pause=function(){if(this._currentStatus===A.status.playing){this._currentStatus=A.status.pausing;var c=Date.now();this._currentProgress=(c-this._startTime)/this._totalDuration/10;}};A.prototype.resume=function(){if(this._currentStatus===A.status.pausing){this._currentStatus=A.status.playing;var c=Date.now();this._startTime=c-this._previousProgress*this._totalDuration*10;}};A.prototype.drag=function(p){if(this._previousStatus===A.status.none){this._previousStatus=this._currentStatus;}this._currentProgress=p;this._currentStatus=A.status.dragging;};A.prototype.completeDragging=function(p){if(this._currentStatus!==A.status.dragging){return;}if(this._previousStatus===A.status.playing){var c=Date.now();this._startTime=c-p*this._totalDuration*10;}else{this._currentProgress=p;}this._currentStatus=this._previousStatus;this._previousStatus=A.status.none;if(this._currentStatus===A.status.stopped||this._currentStatus===A.status.completed){this._currentStatus=A.status.pausing;}};return A;});
