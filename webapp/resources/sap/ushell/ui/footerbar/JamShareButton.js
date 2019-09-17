/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/m/Button","sap/ushell/library","sap/ushell/resources","sap/collaboration/components/fiori/sharing/dialog/Component","sap/base/Log","./JamShareButtonRenderer"],function(B,l,r,C,L){"use strict";var J=B.extend("sap.ushell.ui.footerbar.JamShareButton",{metadata:{library:"sap.ushell",properties:{beforePressHandler:{type:"any",group:"Misc",defaultValue:null},afterPressHandler:{type:"any",group:"Misc",defaultValue:null},jamData:{type:"object",group:"Misc",defaultValue:null}}}});J.prototype.init=function(){var t=this;this.setEnabled();this.setIcon("sap-icon://share-2");this.setText(r.i18n.getText("shareBtn"));this.attachPress(function(){if(t.getBeforePressHandler()){t.getBeforePressHandler()();}this.showShareDialog(t.getAfterPressHandler());});if(B.prototype.init){B.prototype.init.apply(this,arguments);}};J.prototype.showShareDialog=function(c){if(!this.shareComponent){this.shareComponent=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog"});}this.shareComponent.setSettings(this.getJamData());this.shareComponent.open();if(c){c();}};J.prototype.exit=function(){if(this.shareComponent){this.shareComponent.destroy();}if(B.prototype.exit){B.prototype.exit.apply(this,arguments);}};J.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){L.warning("Disabling JamShareButton: unified shell container not initialized",null,"sap.ushell.ui.footerbar.JamShareButton");}e=false;}else{var u=sap.ushell.Container.getUser();if(!(u&&u.isJamActive())){if(this.getEnabled()){L.info("Disabling JamShareButton: user not logged in or Jam not active",null,"sap.ushell.ui.footerbar.JamShareButton");}e=false;this.setVisible(false);}}B.prototype.setEnabled.call(this,e);};return J;},true);
