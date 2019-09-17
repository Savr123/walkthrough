// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/ushell/ui/launchpad/ActionItem","sap/ushell/services/AppConfiguration","sap/ui/thirdparty/jquery","sap/base/Log","sap/ushell/utils","sap/ui/model/json/JSONModel","sap/ui/Device","sap/ui/core/IconPool","sap/ui/core/Icon","./EndUserFeedbackRenderer"],function(r,A,a,b,q,L,u,J,D,I,c){"use strict";var E=a.extend("sap.ushell.ui.footerbar.EndUserFeedback",{metadata:{library:"sap.ushell",properties:{showAnonymous:{type:"boolean",group:"Misc",defaultValue:true},anonymousByDefault:{type:"boolean",group:"Misc",defaultValue:true},showLegalAgreement:{type:"boolean",group:"Misc",defaultValue:true},showCustomUIContent:{type:"boolean",group:"Misc",defaultValue:true},feedbackDialogTitle:{type:"string",group:"Misc",defaultValue:null},textAreaPlaceholder:{type:"string",group:"Misc",defaultValue:null}},aggregations:{customUIContent:{type:"sap.ui.core.Control",multiple:true,singularName:"customUIContent"}}}});E.prototype.init=function(){if(a.prototype.init){a.prototype.init.apply(this,arguments);}var d=sap.ushell.Container.getUser(),f=u.getFormFactor();this.oUserDetails={userId:d.getId(),eMail:d.getEmail()};this.translationBundle=r.i18n;this.oEndUserFeedbackService=sap.ushell.Container.getService("EndUserFeedback");this.appConfiguration=b;this.oEndUserFeedbackModel=new J();this.oEndUserFeedbackModel.setData({feedbackViewTitle:this.translationBundle.getText("userFeedback_title"),legalAgreementViewTitle:this.translationBundle.getText("userFeedbackLegal_title"),textAreaPlaceholderText:this.translationBundle.getText("feedbackPlaceHolderHeader"),presentationStates:{showAnonymous:this.getShowAnonymous(),showLegalAgreement:this.getShowLegalAgreement(),showCustomUIContent:this.getShowCustomUIContent()},clientContext:{userDetails:q.extend(true,{},this.oUserDetails),navigationData:{formFactor:f,applicationInformation:{},navigationHash:null}},isAnonymous:this.getAnonymousByDefault(),applicationIconPath:"",leftButton:{feedbackView:this.translationBundle.getText("sendBtn"),legalAgreementView:this.translationBundle.getText("approveBtn")},rightButton:{feedbackView:this.translationBundle.getText("cancelBtn"),legalAgreementView:this.translationBundle.getText("declineBtn")},states:{isLegalAgreementChecked:false,isRatingSelected:false,isInFeedbackView:true},technicalLink:{state:0,title:[this.translationBundle.getText("technicalDataLink"),this.translationBundle.getText("technicalDataLinkHide")]},textArea:{inputText:""},contextText:"",ratingButtons:[{text:r.i18n.getText("ratingExcellentText"),color:"sapUshellRatingLabelFeedbackPositiveText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-very-happy",id:"rateBtn1",index:1},{text:r.i18n.getText("ratingGoodText"),color:"sapUshellRatingLabelFeedbackPositiveText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-happy",id:"rateBtn2",index:2},{text:r.i18n.getText("ratingAverageText"),color:"sapUshellRatingLabelFeedbackNeutralText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-neutral",id:"rateBtn3",index:3},{text:r.i18n.getText("ratingPoorText"),color:"sapUshellRatingLabelFeedbackCriticalText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-bad",id:"rateBtn4",index:4},{text:r.i18n.getText("ratingVeyPoorText"),color:"sapUshellRatingLabelFeedbackNegativeText",iconSymbol:"sap-icon://BusinessSuiteInAppSymbols/icon-face-very-bad",id:"rateBtn5",index:5}],selectedRating:{text:"",color:"",index:0}});this.setIcon("sap-icon://marketing-campaign");this.setText(r.i18n.getText("endUserFeedbackBtn"));this.attachPress(this.ShowEndUserFeedbackDialog);this.setEnabled();};E.prototype.ShowEndUserFeedbackDialog=function(){sap.ui.require(["sap/ui/layout/form/SimpleForm","sap/ui/layout/form/SimpleFormLayout","sap/ui/layout/HorizontalLayout","sap/ui/layout/VerticalLayout","sap/m/TextArea","sap/m/Link","sap/m/Label","sap/m/Text","sap/m/Dialog","sap/m/Button","sap/m/Image","sap/m/Bar","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/CheckBox"],function(S,d,H,V,T,e,f,g,h,B,i,j,k,l,C){var m,n,s,o,p,M,t,v;m=function(){var F=[],x=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/formFactor"),U=this.oEndUserFeedbackModel.getProperty("/clientContext/userDetails/userId"),y=this.oEndUserFeedbackModel.getProperty("/clientContext/userDetails/eMail"),z=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/url"),G=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/applicationType"),K=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/applicationInformation/additionalInformation"),N=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/navigationHash"),O=this.getModel().getProperty("/currentState/stateName"),P=!(O==="home"||O==="catalog");F.push(new g({text:this.translationBundle.getText("loginDetails")}).addStyleClass("sapUshellContactSupportHeaderInfoText"));F.push(U?new f({text:this.translationBundle.getText("userFld")}):null);F.push(U?new g("technicalInfoUserIdTxt",{text:"{/clientContext/userDetails/userId}"}):null);F.push(y?new f({text:this.translationBundle.getText("eMailFld")}):null);F.push(y?new g({text:"{/clientContext/userDetails/eMail}"}):null);F.push(x?new f({text:this.translationBundle.getText("formFactorFld")}):null);F.push(x?new g({text:"{/clientContext/navigationData/formFactor}"}):null);F.push(new g({text:""}));F.push(new g({text:this.translationBundle.getText(this.currentApp?"applicationInformationFld":"feedbackHeaderText")}).addStyleClass("sapUshellEndUserFeedbackHeaderInfoText").addStyleClass("sapUshellEndUserFeedbackInfoTextSpacing"));F.push(z&&P?new f({text:this.translationBundle.getText("urlFld")}):null);F.push(z&&P?new g({text:"{/clientContext/navigationData/applicationInformation/url}"}):null);F.push(G?new f({text:this.translationBundle.getText("applicationTypeFld")}):null);F.push(G?new g({text:"{/clientContext/navigationData/applicationInformation/applicationType}"}):null);F.push(K?new f({text:this.translationBundle.getText("additionalInfoFld")}):null);F.push(K?new g({text:"{/clientContext/navigationData/applicationInformation/additionalInformation}"}):null);F.push(N&&P?new f({text:this.translationBundle.getText("hashFld")}):null);F.push(N&&P?new g({text:"{/clientContext/navigationData/navigationHash}"}):null);return F.filter(Boolean);}.bind(this);n=function(){this.oTechnicalInfoBox=new S("feedbackTechnicalInfoBox",{layout:d.ResponsiveLayout,content:m()});if(D.os.ios&&D.system.phone){this.oTechnicalInfoBox.addStyleClass("sapUshellContactSupportFixWidth");}var x=this.oTechnicalInfoBox.onAfterRendering;this.oTechnicalInfoBox.onAfterRendering=function(){x.apply(this,arguments);var y=q(this.getDomRef());y.attr("tabIndex",0);setTimeout(function(){this.focus();}.bind(y),700);};return new H("technicalInfoBoxLayout",{visible:{path:"/technicalLink/state",formatter:function(y){return y===1;}},content:[this.oTechnicalInfoBox]});}.bind(this);p=function(){this.oTechnicalInfoBox.destroyContent();this.oTechnicalInfoBox.removeAllContent();var x=m(),y;for(y in x){this.oTechnicalInfoBox.addContent(x[y]);}this.oRatingButtons.setSelectedButton("none");}.bind(this);M=sap.ui.require.toUrl("sap/ushell");t=M+"/themes/base/img/launchpadDefaultIcon.jpg";v=this.oEndUserFeedbackModel.getProperty("/clientContext/navigationData/formFactor")==="desktop";this.updateModelContext();if(this.oDialog){p();this.oDialog.open();return;}this.oLegalAgreementInfoLayout=null;this.oBackButton=new B("endUserFeedbackBackBtn",{visible:{path:"/states/isInFeedbackView",formatter:function(x){return!x;}},icon:I.getIconURI("nav-back"),press:function(){this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);}.bind(this),tooltip:r.i18n.getText("feedbackGoBackBtn_tooltip")});this.oPopoverTitle=new g("PopoverTitle",{text:{parts:[{path:"/states/isInFeedbackView"},{path:"/feedbackViewTitle"}],formatter:function(x){return this.oEndUserFeedbackModel.getProperty(x?"/feedbackViewTitle":"/legalAgreementViewTitle");}.bind(this)}});this.oHeadBar=new j({contentLeft:[this.oBackButton],contentMiddle:[this.oPopoverTitle]});this.oLogoImg=new i("sapFeedbackLogo",{src:t,width:"4.5rem",height:"4.5rem",visible:{path:"/applicationIconPath",formatter:function(x){return!x;}}});this.oAppIcon=new c("sapFeedbackAppIcon",{src:"{/applicationIconPath}",width:"4.5rem",height:"4.5rem",visible:{path:"/applicationIconPath",formatter:function(x){return!!x;}}}).addStyleClass("sapUshellFeedbackAppIcon");this.oContextName=new g("contextName",{text:"{/contextText}"});this.oContextLayout=new H("contextLayout",{allowWrapping:true,content:[this.oLogoImg,this.oAppIcon,this.oContextName]});this.oRatingLabel=new f("ratingLabel",{required:true,text:r.i18n.getText("ratingLabelText")});this.oRatingSelectionText=new g("ratingSelectionText",{text:{path:"/selectedRating",formatter:function(x){if(this.lastSelectedColor){this.removeStyleClass(this.lastSelectedColor);}if(x.color){this.addStyleClass(x.color);}this.lastSelectedColor=x.color;return x.text;}}});this.oRatingButtonTemplate=new l({icon:"{iconSymbol}",height:"100%",width:"20%",tooltip:"{text}"});this.oRatingButtonTemplate.addCustomData(new A({key:"aria-label",value:"{text}",writeToDom:true}));this.oRatingButtons=new k("ratingButton",{items:{path:"/ratingButtons",template:this.oRatingButtonTemplate},selectionChange:function(x){var P=x.getParameters().item.getBindingContext().getPath(),y=this.oEndUserFeedbackModel.getProperty(P);this.oEndUserFeedbackModel.setProperty("/selectedRating",{text:y.text,color:y.color,index:y.index});this.oEndUserFeedbackModel.setProperty("/states/isRatingSelected",true);}.bind(this),width:"100%"});this.oRatingButtons.setSelectedButton("none");this.oRatingButtons.addAriaLabelledBy("ratingLabel");this.oRatingButtons.addCustomData(new A({key:"aria-required",value:"true",writeToDom:true}));if(v){this.oRatingIndicationLayout=new H("ratingIndicationLayout",{content:[this.oRatingLabel,this.oRatingSelectionText]});}else{this.oRatingIndicationLayout=new V("ratingIndicationLayoutMob",{content:[this.oRatingLabel,this.oRatingSelectionText]});}this.oRatingLayout=new V("ratingLayout",{width:"100%",content:[this.oRatingIndicationLayout,this.oRatingButtons]});this.oAnonymousCheckbox=new C("anonymousCheckbox",{name:"anonymousCheckbox",visible:"{/presentationStates/showAnonymous}",text:r.i18n.getText("feedbackSendAnonymousText"),selected:!this.oEndUserFeedbackModel.getProperty("/isAnonymous"),select:function(x){var y=x.getParameter("selected");this._handleAnonymousSelection(!y);}.bind(this)});var w=(!this.oEndUserFeedbackModel.getProperty("/presentationStates/showAnonymous")||this.oEndUserFeedbackModel.getProperty("/isAnonymous"));this._handleAnonymousSelection(w);this.oLegalAgrementCheckbox=new C("legalAgreement",{name:"legalAgreement",visible:"{/presentationStates/showLegalAgreement}",selected:"{/states/isLegalAgreementChecked}",text:this.translationBundle.getText("agreementAcceptanceText")});this.oLegalAgreeementLink=new e("legalAgreementLink",{text:this.translationBundle.getText("legalAgreementLinkText"),visible:"{/presentationStates/showLegalAgreement}",press:function(){var P=this.oEndUserFeedbackService.getLegalText();P.done(s.bind(this));}.bind(this)});this.aCustomUIContent=q.extend([],this.getCustomUIContent());this.oCustomUILayout=new V("customUILayout",{visible:{path:"/presentationStates/showCustomUIContent",formatter:function(x){return!(x&&this.aCustomUIContent.length);}.bind(this)},content:this.getCustomUIContent(),width:"100%"});this.oLegalLayout=new V("legalLayout",{content:[this.oAnonymousCheckbox,this.oLegalAgrementCheckbox,this.oLegalAgreeementLink]});this.oTechnicalDataLink=new e("technicalDataLink",{text:{path:"/technicalLink/state",formatter:function(x){return this.getModel().getProperty("/technicalLink/title/"+x);}},press:function(){var _=this.oEndUserFeedbackModel.getProperty("/technicalLink/state");this.oEndUserFeedbackModel.setProperty("/technicalLink/state",Math.abs(_-1));this.oDialog.rerender();}.bind(this)});this.oTechnicalDataLayout=new H("technicalDataLayout",{content:[this.oTechnicalDataLink]});this.leftButton=new B("EndUserFeedbackLeftBtn",{text:{path:"/states/isInFeedbackView",formatter:function(x){return this.getModel().getProperty("/leftButton/"+(x?"feedbackView":"legalAgreementView"));}},enabled:{parts:[{path:"/states/isInFeedbackView"},{path:"/states/isLegalAgreementChecked"},{path:"/states/isRatingSelected"},{path:"/presentationStates/showLegalAgreement"}],formatter:function(x,y,z,F){return!x||(z&&(y||!F));}},press:function(){var x=this.oEndUserFeedbackModel.getProperty("/states/isInFeedbackView");if(x){var F={feedbackText:this.oEndUserFeedbackModel.getProperty("/textArea/inputText"),ratings:[{questionId:"Q10",value:this.oEndUserFeedbackModel.getProperty("/selectedRating/index")}],clientContext:this.oEndUserFeedbackModel.getProperty("/clientContext"),isAnonymous:this.oEndUserFeedbackModel.getProperty("/isAnonymous")},y=this.oEndUserFeedbackService.sendFeedback(F);y.done(function(){sap.ushell.Container.getService("Message").info(this.translationBundle.getText("feedbackSendToastTxt"));}.bind(this));y.fail(function(){sap.ushell.Container.getService("Message").error(this.translationBundle.getText("feedbackFailedToastTxt"));}.bind(this));this.oDialog.close();}else{this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",true);}}.bind(this)});this.rightButton=new B("EndUserFeedbackRightBtn",{text:{path:"/states/isInFeedbackView",formatter:function(x){return this.getModel().getProperty("/rightButton/"+(x?"feedbackView":"legalAgreementView"));}},press:function(){var x=this.oEndUserFeedbackModel.getProperty("/states/isInFeedbackView");if(x){this.oDialog.close();}else{this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",true);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",false);}}.bind(this)});this.oTextArea=new T("feedbackTextArea",{rows:6,value:"{/textArea/inputText}",placeholder:"{/textAreaPlaceholderText}"});this.oDialog=new h({id:"UserFeedbackDialog",contentWidth:"25rem",leftButton:this.leftButton,rightButton:this.rightButton,stretch:D.system.phone,initialFocus:"textArea",afterOpen:function(){q("#textArea").on("focusout",function(){window.scrollTo(0,0);});},afterClose:function(){if(window.document.activeElement&&window.document.activeElement.tagName==="BODY"){window.document.getElementById("meAreaHeaderButton").focus();}}}).addStyleClass("sapUshellEndUserFeedbackDialog");this.oDialog.setModel(this.oEndUserFeedbackModel);this.oDialog.setCustomHeader(this.oHeadBar);this.oDialog.addCustomData(new A({key:"aria-label",value:this.translationBundle.getText("endUserFeedbackAreaLabel"),writeToDom:true}));this.oTechnicalInfoBoxLayout=n();this.oFeedbackLayout=new V("feedbackLayout",{visible:"{/states/isInFeedbackView}",content:[this.oContextLayout,this.oRatingLayout,this.oTextArea,this.oTechnicalDataLayout,this.oTechnicalInfoBoxLayout,this.oLegalLayout,this.oCustomUILayout]}).addStyleClass("sapUshellFeedbackLayout");this.oMainLayout=new V("mainLayout",{editable:false,content:[this.oFeedbackLayout]});this.oDialog.addContent(this.oMainLayout);this.oDialog.open();s=function(x){this.oEndUserFeedbackModel.setProperty("/states/isInFeedbackView",false);if(!this.oLegalAgreementInfoLayout){o(x);}};o=function(x){this.oLegalText=new T("legalText",{cols:50,rows:22});this.oLegalText.setValue([x]);this.oLegalText.setEditable(false);var y=this.oLegalText.onAfterRendering;this.oLegalText.onAfterRendering=function(){if(y){y.apply(this,arguments);}var z=q(this.getDomRef());z.find("textarea").attr("tabindex","0");};this.oLegalAgreementInfoLayout=new V("legalAgreementInfoLayout",{visible:{path:"/states/isInFeedbackView",formatter:function(z){return!z;}},content:[this.oLegalText]});this.oMainLayout.addContent(this.oLegalAgreementInfoLayout);}.bind(this);}.bind(this));};E.prototype._handleAnonymousSelection=function(i){var d=this.translationBundle.getText("feedbackAnonymousTechFld");this.oEndUserFeedbackModel.setProperty("/isAnonymous",i);this.oEndUserFeedbackModel.setProperty("/clientContext/userDetails/eMail",i?d:this.oUserDetails.eMail);this.oEndUserFeedbackModel.setProperty("/clientContext/userDetails/userId",i?d:this.oUserDetails.userId);};E.prototype.addCustomUIContent=function(C){var i=C&&C.getMetadata&&C.getMetadata().getStereotype&&C.getMetadata().getStereotype()==="control";if(i){if(this.getShowCustomUIContent()){this.oEndUserFeedbackModel.setProperty("/presentationStates/showCustomUIContent",true);}this.addAggregation("customUIContent",C);}};E.prototype.setShowAnonymous=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showAnonymous",v);this.setProperty("showAnonymous",v,true);}};E.prototype.setAnonymousByDefault=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/isAnonymous",v);this.setProperty("anonymousByDefault",v,true);}};E.prototype.setShowLegalAgreement=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showLegalAgreement",v);this.setProperty("showLegalAgreement",v,true);}};E.prototype.setShowCustomUIContent=function(v){if(typeof v==="boolean"){this.oEndUserFeedbackModel.setProperty("/presentationStates/showCustomUIContent",v);this.setProperty("showCustomUIContent",v,true);}};E.prototype.setFeedbackDialogTitle=function(v){if(typeof v==="string"){this.oEndUserFeedbackModel.setProperty("/feedbackViewTitle",v);this.setProperty("feedbackDialogTitle",v,true);}};E.prototype.setTextAreaPlaceholder=function(v){if(typeof v==="string"){this.oEndUserFeedbackModel.setProperty("/textAreaPlaceholderText",v);this.setProperty("textAreaPlaceholder",v,true);}};E.prototype.updateModelContext=function(){var U=sap.ushell.Container.getService("URLParsing"),h,p,i,d,s,e;h=U.getShellHash(window.location);p=U.parseShellHash(h);i=(p!==undefined)?p.semanticObject+"-"+p.action:"";d=this.getModel().getProperty("/currentState/stateName");if(d==="home"||d==="catalog"){s=this.translationBundle.getText(d+"_title");}this.currentApp=this.appConfiguration.getCurrentApplication();this.bHasAppName=(this.currentApp&&this.appConfiguration.getMetadata(this.currentApp)&&this.appConfiguration.getMetadata(this.currentApp).title);this.sAppIconPath=(this.currentApp&&this.appConfiguration.getMetadata(this.currentApp)&&this.appConfiguration.getMetadata(this.currentApp).icon);this.oEndUserFeedbackModel.setProperty("/contextText",this.bHasAppName?this.appConfiguration.getMetadata(this.currentApp).title:this.translationBundle.getText("feedbackHeaderText"));e=null;if(this.currentApp&&this.currentApp.url){e=this.currentApp.url.split("?")[0];}else if(d){e=this.translationBundle.getText("flp_page_name");}this.oEndUserFeedbackModel.setProperty("/clientContext/navigationData/applicationInformation",{url:e,additionalInformation:(this.currentApp&&this.currentApp.additionalInformation)?this.currentApp.additionalInformation:null,applicationType:(this.currentApp&&this.currentApp.applicationType)?this.currentApp.applicationType:null});this.oEndUserFeedbackModel.setProperty("/clientContext/navigationData/navigationHash",s||i);this.oEndUserFeedbackModel.setProperty("/selectedRating",{text:"",color:"",index:0});this.oEndUserFeedbackModel.setProperty("/states/isRatingSelected",false);this.oEndUserFeedbackModel.setProperty("/states/isLegalAgreementChecked",false);this.oEndUserFeedbackModel.setProperty("/technicalLink/state",0);this.oEndUserFeedbackModel.setProperty("/textArea/inputText","");this.oEndUserFeedbackModel.setProperty("/applicationIconPath",this.sAppIconPath);this._handleAnonymousSelection(this.oEndUserFeedbackModel.getProperty("/isAnonymous"));};E.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){L.warning("Disabling 'End User Feedback' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.EndUserFeedback");}e=false;}a.prototype.setEnabled.call(this,e);};return E;});
