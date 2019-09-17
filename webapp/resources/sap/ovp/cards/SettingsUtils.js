sap.ui.define(["jquery.sap.global","sap/m/Dialog","sap/m/Button","sap/ovp/cards/PayLoadUtils","sap/ovp/cards/OVPCardAsAPIUtils","sap/ovp/cards/rta/SettingsDialogConstants","sap/ovp/cards/CommonUtils","sap/ui/Device","sap/m/MessagePopover","sap/m/MessagePopoverItem","sap/m/Link","sap/m/MessageBox","sap/ovp/cards/AnnotationHelper","sap/ui/core/mvc/ViewType","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/ovp/app/resources","sap/ovp/app/OVPUtils"],function(Q,D,B,P,O,S,C,a,M,b,L,c,A,V,J,R,d,e){"use strict";var r=d;function f(i,q,g1){var h1=i.getComponentInstance(),i1=h1.getComponentData(),j1=i1.appComponent,k1=i1.mainComponent,l1=(g1)?"":i1.cardId,m1=l1+"Dialog",n1=(g1)?"":i1.modelName,o1=(!n1)?undefined:j1.getModel(n1),p1=q.getModel().getData(),q1={cards:{}};q1.cards[m1]={template:p1.template,settings:p1};if(f1.bNewKPICardFlag){var r1=p1.selectedKPI;o1=new sap.ui.model.odata.v2.ODataModel(r1.ODataURI,{'annotationURI':r1.ModelURI,'defaultCountMode':sap.ui.model.odata.CountMode.None});n1=C._getLayerNamespace()+".kpi_card_model_"+j(r1.ODataURI);}if(o1&&!!n1){q1.cards[m1].model=n1;q.setModel(o1,n1);}q1.cards[m1]=k1._getTemplateForChart(q1.cards[m1]);q.getController()._oManifest=q1;if(f1.bNewKPICardFlag){o1.getMetaModel().loaded().then(function(){var s1=O.createCardComponent(q,q1,"dialogCard");s1.then(function(){q.setBusy(false);}).catch(function(){l(q1.cards[m1].settings,"OVP_KEYUSER_ANNOTATION_FAILURE");k(q,q1,m1);});},function(s1){Q.sap.log.error(s1);});o1.attachMetadataFailed(function(){l(q1.cards[m1].settings,"OVP_KEYUSER_METADATA_FAILURE");k(q,q1,m1);});}else{O.createCardComponent(q,q1,"dialogCard");}}function s(i,q){if(!this.oNewDataSources[i]){this.oNewDataSources[i]={uri:q};}}function g(i){if(this.oNewDataSources[i]){delete this.oNewDataSources[i];}}function h(i){var q=this.oAppComponent.getMetadata(),g1=q.getManifestEntry("sap.app").dataSources;if(this.oNewDataSources[i]){return this.oNewDataSources;}return g1;}function j(i){var q=i.split("/");return q[q.length-1]?q[q.length-1]:q[q.length-2];}function k(i,q,g1){q.cards[g1].template="sap.ovp.cards.error";q.cards[g1].model=undefined;var h1=O.createCardComponent(i,q,"dialogCard");var i1=i.getController();h1.then(function(){i.setBusy(false);i1.setBusy(false);}).catch(function(){i.setBusy(false);i1.setBusy(false);});}function l(i,q){if(i){i.errorStatusText=d.getText(q);}}function m(i){if(i.indexOf('#')!==-1){return i.split('#')[1];}else{return"Default";}}function n(i,q){if(i){var g1,h1,i1;if(i.indexOf("{")===0&&i.indexOf("}")===i.length-1){i=i.slice(1,-1);if(i.indexOf(">")!=-1){g1=i.split(">");i1=g1[0];h1=g1[1];}else if(i.indexOf("&gt;")!=-1){g1=i.split("&gt;");i1=g1[0];h1=g1[1];}if(!!h1&&i1==="@i18n"&&f1.oi18nModel){return f1.oi18nModel.getProperty(h1);}else{return i;}}else{return i;}}else{return q;}}function o(i,q,g1,h1){if(q[i]&&q[i][g1]){return n(q[i][g1].String,h1);}else{return h1;}}function p(i,q){var g1=m(q),h1=d.getText("OVP_KEYUSER_LABEL_DEFAULT_LABEL_WITH_QUALIFIER",[g1]);h1=(h1)?h1:g1;if(q.indexOf(",")!==-1){q=q.split(",")[0];}if(q.indexOf(".Identification")!==-1){if(i[q]){var i1=A.sortCollectionByImportance(i[q]);for(var j1=0;j1<i1.length;j1++){var k1=i1[j1];if(k1.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){if(k1&&k1["Label"]){return n(k1["Label"].String,h1);}else{return k1["SemanticObject"].String+"-"+k1["Action"].String;}}if(k1.RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){if(k1&&k1["Label"]){return n(k1["Label"].String,h1);}else{return k1["Url"].String;}}}}return d.getText("OVP_KEYUSER_LABEL_NO_NAVIGATION");}else if(q.indexOf(".LineItem")!==-1){var l1=A.sortCollectionByImportance(i[q]);l1.forEach(function(o1,j1){if(o1["RecordType"]&&o1["RecordType"].indexOf(".DataField")!==-1&&o1["Label"]){l1[j1]["Label"]={String:n(o1["Label"].String,h1)};}});return l1;}else if(q.indexOf(".HeaderInfo")!==-1){if(i[q]&&i[q]["Description"]&&i[q]["Description"].Label){return n(i[q]["Description"].Label.String,h1);}else{return h1;}}else if(q.indexOf(".PresentationVariant")!==-1||q.indexOf(".SelectionVariant")!==-1||q.indexOf(".SelectionPresentationVariant")!==-1){return o(q,i,"Text",h1);}else if(q.indexOf(".DataPoint")!==-1){return o(q,i,"Title",h1);}else if(q.indexOf(".Chart")!==-1){return o(q,i,"Description",h1);}else if(q.indexOf(".FieldGroup")!==-1){return o(q,i,"Label",h1);}else{var m1="";if(g1!=="Default"){m1="#"+g1;}var n1="com.sap.vocabularies.Common.v1.Label"+m1;if(i[q]&&i[q][n1]){return n(i[q][n1].String,h1);}else{return h1;}}}function t(i,q,g1){switch(q){case"cardPreview":return(O.getSupportedCardTypes().indexOf(i)!==-1);case"noOfRows":case"noOfColumns":case"stopResizing":var h1=["sap.ovp.cards.stack"];return(h1.indexOf(i)===-1);case"listType":case"listFlavor":var i1=["sap.ovp.cards.list"];return(i1.indexOf(i)!==-1);case"listFlavorForLinkList":var j1=["sap.ovp.cards.linklist"];return(j1.indexOf(i)!==-1);case"isViewSwitchSupportedCard":case"showViewSwitch":case"kpiHeader":var k1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.charts.analytical","sap.ovp.cards.charts.smart.chart","sap.ovp.cards.charts.bubble","sap.ovp.cards.charts.donut","sap.ovp.cards.charts.line"];return(k1.indexOf(i)!==-1);case"chartSPVorKPI":case"chart":var l1=["sap.ovp.cards.charts.analytical","sap.ovp.cards.charts.smart.chart","sap.ovp.cards.charts.bubble","sap.ovp.cards.charts.donut","sap.ovp.cards.charts.line"];return(l1.indexOf(i)!==-1);case"sortOrder":case"sortBy":case"lineItem":if(!g1){var m1=["sap.ovp.cards.list","sap.ovp.cards.table"];return(m1.indexOf(i)!==-1);}else{var m1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.charts.analytical","sap.ovp.cards.linklist","sap.ovp.cards.stack"];return(m1.indexOf(i)!==-1);}break;case"identification":var n1=["sap.ovp.cards.stack"];return(n1.indexOf(i)!==-1);case"addViewSwitch":var o1=["sap.ovp.cards.list","sap.ovp.cards.table"];return(o1.indexOf(i)!==-1);case"addKPIHeader":var o1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.charts.analytical"];return(o1.indexOf(i)!==-1);case"selecionOrPresentation":var p1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.linklist"];return(p1.indexOf(i)!==-1);case"addODataSelect":var q1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.stack"];return(q1.indexOf(i)!==-1);case"addCustomActions":var q1=["sap.ovp.cards.stack"];return(q1.indexOf(i)!==-1);case"setCardProperties":if(g1){var m1=["sap.ovp.cards.list","sap.ovp.cards.table","sap.ovp.cards.linklist","sap.ovp.cards.stack"];return(m1.indexOf(i)!==-1);}break;default:break;}}function u(i){return!!i.kpiAnnotationPath;}function v(i){return!!i.selectionPresentationAnnotationPath;}function w(i){return v(i)||u(i);}function x(i){return i.substring(i.lastIndexOf("_")+1,i.length).indexOf("C")!==-1;}function y(i){if(i.NewKPICard){return i.NewKPICard;}else if(i.selectedKPICardID){return i.selectedKPICardID.indexOf("newKPICard")!==-1;}else{return false;}}function z(i,q,g1,h1,i1){var j1=true;var k1=true;var l1=false;var m1=false;var n1=false;if(g1){if(i.mainViewSelected){k1=false;}else{j1=false;}}if(i.addNewCard&&i.model){var m1=true;if(i.template){n1=true;if(i.entitySet){l1=true;}}}var o1;switch(q){case"cardPreview":o1=t(i.template,"cardPreview");break;case"noOfRows":case"noOfColumns":case"stopResizing":o1=j1&&t(i.template,q);break;case"title":o1=j1;break;case"dynamicSwitchSubTitle":o1=j1&&!!i.dynamicSubTitle;break;case"dynamicSwitchStateSubTitle":o1=!!i.dynamicSubtitleAnnotationPath;break;case"subTitle":if(!i.addNewCard){if(!i.subTitle){i.subTitle=" ";o1=true;}else{o1=j1&&!i.dynamicSubtitleAnnotationPath;}}else{o1=j1;}break;case"dynamicSubTitle":o1=j1&&!!i.dynamicSubtitleAnnotationPath;break;case"valueSelectionInfo":if(!i.addNewCard){if(!i.valueSelectionInfo){i.valueSelectionInfo=" ";}o1=j1&&(t(i.template,"kpiHeader")&&!!i.dataPointAnnotationPath)&&!y(i);}else{o1=j1&&m1&&n1&&l1&&i.addKPIHeaderCheckBox&&t(i.template,"addKPIHeader");}break;case"dataPoint":if(!i.addNewCard){o1=k1&&!u(i)&&(t(i.template,"kpiHeader")&&!!i.dataPointAnnotationPath);}else{o1=k1&&m1&&n1&&l1&&i.addKPIHeaderCheckBox&&t(i.template,"addKPIHeader");}break;case"listType":case"listFlavor":case"listFlavorForLinkList":if(!i.addNewCard){o1=j1&&t(i.template,q);}else{o1=j1&&m1&&n1&&l1&&t(i.template,q);}break;case"identification":if(!i.addNewCard){o1=k1&&(!i.staticContent)&&!t(i.template,q);}else{o1=k1&&m1&&n1&&l1&&!t(i.template,q);}break;case"selectionPresentationVariant":if(!i.addNewCard){o1=k1&&v(i)&&!u(i)&&t(i.template,"kpiHeader");}else{o1=k1&&m1&&n1&&l1&&t(i.template,"selecionOrPresentation")&&!!(Q.isArray(i.selectionPresentationVariant)&&i.selectionPresentationVariant.length);}break;case"KPI":case"dataPointSelectionMode":if(!i.addNewCard){o1=k1&&u(i)&&!v(i)&&t(i.template,"chart")&&!y(i);}else{o1=k1&&m1&&n1&&l1&&t(i.template,"chart");}break;case"presentationVariant":case"selectionVariant":if(!i.addNewCard){o1=k1&&!w(i)&&(!i.staticContent)&&t(i.template,"kpiHeader");}else{o1=k1&&m1&&n1&&l1&&!(Q.isArray(i.selectionPresentationVariant)&&i.selectionPresentationVariant.length)&&t(i.template,"selecionOrPresentation");}break;case"kpiHeader":o1=j1&&!u(i)&&t(i.template,q);break;case"lineItem":case"chart":if(!i.addNewCard){o1=k1&&!w(i)&&t(i.template,q);}else{o1=k1&&m1&&n1&&l1&&t(i.template,q,i.addNewCard);}break;case"chartSPVorKPI":o1=k1&&w(i)&&!y(i)&&t(i.template,q);break;case"presentationVariantSPVorKPI":case"selectionVariantSPVorKPI":o1=k1&&w(i)&&!y(i)&&(!i.staticContent)&&t(i.template,"kpiHeader");break;case"showViewName":o1=g1&&k1;break;case"showDefaultView":if(g1&&k1){if(i.defaultViewSelected!=i.selectedKey){o1=true;}}else{o1=false;}break;case"showEntitySet":if(g1&&k1){if(i.selectedKey>0&&i.tabs[i.selectedKey-1].entitySet){o1=true;}else{o1=false;}}else{o1=false;}break;case"showMore":case"removeVisual":case"lineItemSubTitle":case"lineItemTitle":case"staticLink":case"links":var p1=(i.template==="sap.ovp.cards.linklist"&&!!i.staticContent);if(q==="staticLink"){o1=(p1&&!!i.staticContent[h1].targetUri);}else if(q==="links"){o1=(p1&&!!i.staticContent[h1].semanticObject);}else if(q==="removeVisual"){o1=(p1&&(!!i.staticContent[h1].targetUri||!!i.staticContent[h1].semanticObject));}else{o1=p1;}break;case"selectCardType":o1=j1&&m1;break;case"addKPIHeader":o1=j1&&m1&&n1&&t(i.template,q);break;case"setEntitySet":o1=k1&&m1&&n1;break;case"setCardProperties":o1=j1&&m1&&n1&&l1&&t(i.template,q,i.addNewCard);break;case"setGeneralCardProperties":o1=j1&&m1&&n1&&l1;break;case"setAnnotationCardProperties":o1=k1&&m1&&n1&&l1;break;case"subTitleRequired":o1=m1&&n1&&l1&&i.addKPIHeaderCheckBox;break;case"addODataSelect":if(!i.addNewCard){o1=k1&&t(i.template,q);}else{o1=k1&&m1&&n1&&l1&&t(i.template,q);}break;case"isViewSwitchSupportedCard":case"showViewSwitch":o1=m1&&n1&&(l1||!!i.showViewSwitchButton)&&t(i.template,q);break;case"dataSource":o1=j1;break;case"addCustomActions":o1=j1&&t(i.template,q);break;default:break;}return o1;}function E(i){var q=false;this.oVisibility.viewSwitchEnabled=false;this.oVisibility.showViewSwitch=false;if(!this.bAddNewCardFlag){if(t(i.template,"isViewSwitchSupportedCard")&&!y(i)){if(i.tabs&&i.tabs.length){q=true;this.oVisibility.showViewSwitch=true;}this.oVisibility.viewSwitchEnabled=true;}}else{if(i.tabs&&i.tabs.length){q=true;this.oVisibility.showViewSwitch=z(i,"showViewSwitch");}this.oVisibility.viewSwitchEnabled=z(i,"isViewSwitchSupportedCard");}this.oVisibility.cardPreview=z(i,"cardPreview");this.oVisibility.stopResizing=z(i,"stopResizing",q);this.oVisibility.noOfRows=z(i,"noOfRows",q);this.oVisibility.noOfColumns=z(i,"noOfColumns",q);this.oVisibility.title=z(i,"title",q);this.oVisibility.subTitle=z(i,"subTitle",q);this.oVisibility.valueSelectionInfo=z(i,"valueSelectionInfo",q);this.oVisibility.listType=z(i,"listType",q);this.oVisibility.listFlavor=z(i,"listFlavor",q);this.oVisibility.listFlavorForLinkList=z(i,"listFlavorForLinkList",q);if(i.template==="sap.ovp.cards.linklist"&&!!i.staticContent){var g1=i.staticContent,h1={},i1={},j1={},k1={};for(var l1=0;l1<g1.length;l1++){var m1=g1[l1].index;h1[m1]=z(i,"staticLink",null,l1);i1[m1]=z(i,"links",null,l1);j1[m1]=z(i,"removeVisual",null,l1);k1[m1]=z(i,"showMore",null,l1);}this.oVisibility.staticLink=h1;this.oVisibility.links=i1;this.oVisibility.removeVisual=j1;this.oVisibility.showMore=k1;}this.oVisibility.lineItemTitle=z(i,"lineItemTitle");this.oVisibility.lineItemSubTitle=z(i,"lineItemSubTitle");this.oVisibility.showViewName=z(i,"showViewName",q);this.oVisibility.showDefaultView=z(i,"showDefaultView",q);this.oVisibility.showEntitySet=z(i,"showEntitySet",q);this.aVariantNames.forEach(function(o1){this.oVisibility[o1.sPath]=z(i,o1.sPath,q)&&!!i[o1.sPath]&&!!i[o1.sPath].length;}.bind(this));this.oVisibility.kpiHeader=z(i,"kpiHeader",q)&&!!i["dataPoint"]&&!!i["dataPoint"].length;this.oVisibility.dynamicSwitchSubTitle=z(i,"dynamicSwitchSubTitle",q);this.oVisibility.dynamicSwitchStateSubTitle=z(i,"dynamicSwitchStateSubTitle",q);this.oVisibility.dataSource=z(i,"dataSource",q);this.oVisibility.selectCardType=z(i,"selectCardType",q);this.oVisibility.addKPIHeader=z(i,"addKPIHeader",q);this.oVisibility.setEntitySet=z(i,"setEntitySet",q);this.oVisibility.setCardProperties=z(i,"setCardProperties",q);this.oVisibility.setGeneralCardProperties=z(i,"setGeneralCardProperties",q);this.oVisibility.subTitleRequired=z(i,"subTitleRequired",q);this.oVisibility.dataPointSelectionMode=z(i,"dataPointSelectionMode",q);var n1;for(var l1=0;l1<this.aVisiblePropertiesForAnnotation.length;l1++){if(this.oVisibility[this.aVisiblePropertiesForAnnotation[l1].sProperty]){n1=true;break;}}this.oVisibility.setAnnotationCardProperties=n1?z(i,"setAnnotationCardProperties",q):false;this.oVisibility.addODataSelect=z(i,"addODataSelect",q);this.oVisibility.addCustomActions=z(i,"addCustomActions",q);this.oVisibility.moveToTheTop=false;this.oVisibility.moveUp=false;this.oVisibility.moveDown=false;this.oVisibility.moveToTheBottom=false;this.oVisibility.delete=false;}function F(i){var q=i.getProperty("/staticContent");for(var g1=0;g1<q.length;g1++){q[g1].index="Index--"+(g1+1);}i.setProperty("/staticContent",q);}function G(q){var g1=0;for(var i=q.length-1;i>=0;i--){if(/^\d+$/.test(q[i])){g1=parseInt(q[i],10);break;}}return g1;}function H(i){if(i.lineItem){i.lineItem.forEach(function(g1){if(g1.value===i.annotationPath){i.lineItemQualifier=g1.name;}});}if(i.tabs&&i.tabs.length&&i.selectedKey){i.viewName=i.tabs[i.selectedKey-1].value;i.isDefaultView=false;if(i.selectedKey===i.defaultViewSelected){i.isDefaultView=true;}}var q=i.sortOrder;i.sortOrder="descending";if(q&&q.toLowerCase()!=="descending"){i.sortOrder="ascending";}i.isExtendedList=false;if(i.listType==="extended"){i.isExtendedList=true;}i.isBarList=false;if(i.listFlavor==="bar"){i.isBarList=true;}i.hasKPIHeader=false;if(i.dataPointAnnotationPath){i.hasKPIHeader=true;}return i;}function I(i){var q=i.kpiAnnotationPath;var g1=i.template;var h1=i.entityType;var i1="";if(q&&h1&&g1==="sap.ovp.cards.charts.analytical"){var j1=h1[q];var k1=j1&&j1.Detail;if(k1&&k1.RecordType==="com.sap.vocabularies.UI.v1.KPIDetailType"&&k1.SemanticObject&&k1.Action){i1="#"+k1.SemanticObject.String+"-"+k1.Action.String;}}i["KPINav"]=i1;}function K(i){var q=[],g1=i.metaModel,h1=(!!g1)?g1.getODataEntityContainer().entitySet:[];if(g1){var i1=g1.getODataEntityContainer().namespace+".";}h1.forEach(function(j1){if(!i.addNewCard){var k1=d.getText("OVP_KEYUSER_LABEL_DEFAULT_LABEL_WITH_QUALIFIER",[j1.name]),l1=g1.getODataEntityType(j1.entityType)["sap:label"];q.push({name:n(l1,k1),value:j1.name});}else{var k1=d.getText("OVP_KEYUSER_LABEL_DEFAULT_LABEL_WITH_QUALIFIER",[j1.name]),l1=g1.getODataEntityType(j1.entityType)["sap:label"],m1=j1.entityType.split(i1)[1];q.push({name:n(l1,k1),value:j1.name,entityType:m1});}});if(q.length>0){i["allEntitySet"]=q;}}function N(i){var q=i.metaModel&&i.metaModel.getObject('/dataServices/schema')&&i.metaModel.getObject('/dataServices/schema')[0].entityType;if(q){q.forEach(function(g1){var h1=0;this.aVariantNames.forEach(function(i1){for(var j1 in g1){if(j1.indexOf(i1.sVariant)!==-1){h1++;}}});if(!h1){i.allEntitySet=i.allEntitySet.filter(function(i1){return i1.entityType!==g1.name;});}}.bind(this));}}function T(i){var q=i.entityType;if(!i["allEntitySet"]){K(i);}I(i);if(i.addNewCard){N.call(this,i);}this.aVariantNames.forEach(function(j1){var k1=[],l1=1;for(var m1 in q){if(q.hasOwnProperty(m1)&&m1.indexOf(j1.sVariant)!==-1){if(j1.sVariant===".LineItem"){var n1={name:r.getText("OVP_KEYUSER_LABEL_LINEITEM_OPTIONS",[l1]),value:m1,fields:p(q,m1)};k1.push(n1);l1++;}else{k1.push({name:p(q,m1),value:m1});}}}if(k1.length!==0){i[j1.sPath]=k1;}});if(i.entityType&&i.entityType.property){i["modelProperties"]=i.entityType.property.map(function(j1){return{name:j1.name,value:j1.name};});}if(!!i.tabs&&i.tabs.length){var g1=false,h1=i.tabs[i.tabs.length-1].value,i1=h1.split(' ');i.newViewCounter=G(i1);i.defaultViewSelected=i.selectedKey;i.isViewResetEnabled=false;i.aViews=[{text:r&&r.getText("OVP_KEYUSER_LABEL_MAIN_VIEW"),key:0,isLaterAddedView:false,isViewResetEnabled:false}];g1=i.tabs.some(function(j1){return j1.dataPointAnnotationPath;});i.tabs.forEach(function(j1,k1){var l1=j1.value;if(g1&&!j1.dataPointAnnotationPath&&j1.dataPoint&&j1.dataPoint.length){j1.dataPointAnnotationPath=j1.dataPoint[0].value;}if(k1+1===i.selectedKey){l1=j1.value;if(r){l1+=" ("+r.getText("OVP_KEYUSER_LABEL_DEFAULT_VIEW")+")";}else{l1+=" (Default view)";}}i.aViews.push({text:l1,key:k1+1,initialSelectedKey:k1+1,isLaterAddedView:false,isViewResetEnabled:false});});}else if(t(i.template,"isViewSwitchSupportedCard")){i.newViewCounter=0;i.aViews=[{text:r.getText("OVP_KEYUSER_SHOWS_DIFFERENT_VIEWS"),key:0,initialSelectedKey:0,isLaterAddedView:false,isViewResetEnabled:false}];}return i;}function U(q){var g1=q.getData();if(sap.ushell&&sap.ushell.Container){sap.ushell.Container.getService("CrossApplicationNavigation").getLinks().done(function(h1){var i1=[],j1={};for(var i=0;i<h1.length;i++){i1.push(h1[i].intent);j1[h1[i].intent]=h1[i].text;}sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(i1).done(function(k1){var h1=[];for(var l1 in k1){if(k1.hasOwnProperty(l1)&&k1[l1].supported===true&&j1&&j1[l1]){h1.push({name:j1[l1],value:l1});}}var m1=g1;if(h1.length!==0||h1.length!==0){m1["links"]=h1;}q.refresh();}).fail(function(k1){Q.sap.log.error(k1);});}).fail(function(i){Q.sap.log.error(i);});}}function W(i){this.oResetButton.setEnabled(i);}function X(i){this.oSaveButton.setEnabled(i);var q=this.oMessagePopOver.getModel(),g1=q.getProperty("/Counter/Error");this.bError=(g1>0);}function Y(i){var q=new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?","i");return q.test(i);}function Z(i,q){if(q==="targetUri"){return!Y(i)&&(!!i||i==="");}else{return!(i.trim().length);}}function $(q){var g1=q.getParameter("path"),h1="",i1,i,j1,k1,l1,m1;if(g1==="/title"||g1==="title"||g1==="/viewName"||g1==="targetUri"||g1==="value"){var n1=q.getParameter("value"),o1=Z(n1,g1),p1,q1=q.getParameter("context");if(g1==="/viewName"){p1=q.getSource().getProperty("/selectedKey");h1=d.getText("OVP_KEYUSER_INPUT_ERROR_VIEW_NAME");g1="/tabs/"+(p1-1)+"/value";}if(g1==="value"){h1=d.getText("OVP_KEYUSER_INPUT_ERROR_VIEW_NAME");g1=q1.getPath()+"/"+g1;}if(g1.indexOf("/title")!==-1){h1=d.getText("OVP_KEYUSER_INPUT_ERROR");}if(q1&&q1.getPath().indexOf("staticContent")!==-1){i1=q1.getPath().split("/");if(g1==="title"){h1=d.getText("OVP_KEYUSER_INPUT_ERROR_RECORD_TITLE")+(parseInt(i1[i1.length-1],10)+1);}else if(g1==="targetUri"){h1=d.getText("OVP_KEYUSER_INPUT_ERROR_RECORD_URL")+" "+(parseInt(i1[i1.length-1],10)+1);}g1=q1.getPath()+"/"+g1;}j1=this.oMessagePopOver.getModel();k1=j1.getProperty("/Messages");l1=j1.getProperty("/Counter/All");m1=j1.getProperty("/Counter/Error");if(o1){X.bind(this)(true);for(i=0;i<k1.length;i++){if(k1[i].fieldName===g1){k1.splice(i,1);l1--;m1--;i--;}}k1.push({"type":"Error","title":h1,"fieldName":g1,"counter":m1+1});l1++;m1++;}else{X.bind(this)(true);for(i=0;i<k1.length;i++){if(k1[i].fieldName===g1){k1.splice(i,1);l1--;m1--;i--;}}}j1.setProperty("/Messages",k1);j1.setProperty("/Counter/All",l1);j1.setProperty("/Counter/Error",m1);j1.refresh(true);}else if(g1==="/staticContent,title"||g1==="/staticContent,targetUri"||g1==="/tabs,value"){i1=g1.split(",");j1=this.oMessagePopOver.getModel();k1=j1.getProperty("/Messages");l1=j1.getProperty("/Counter/All");m1=j1.getProperty("/Counter/Error");X.bind(this)(true);for(i=0;i<k1.length;i++){if(k1[i].fieldName.indexOf(i1[0])!==-1&&k1[i].fieldName.indexOf(i1[1])!==-1){k1.splice(i,1);l1--;m1--;i--;}}j1.setProperty("/Messages",k1);j1.setProperty("/Counter/All",l1);j1.setProperty("/Counter/Error",m1);j1.refresh(true);}}function _(){var i=this.oMessagePopOver.getModel();i.setProperty("/Messages",[]);i.setProperty("/Counter/All",0);i.setProperty("/Counter/Error",0);i.setProperty("/Counter/Success",0);i.setProperty("/Counter/Warning",0);i.setProperty("/Counter/Information",0);i.refresh(true);}function a1(){var i=new L({text:"Show more information",href:"",target:"_blank"});var q=new b({type:"{type}",title:"{title}",description:"{description}",subtitle:"{subtitle}",counter:"{counter}",fieldName:"{fieldName}",link:i});this.oMessagePopOver=new M({items:{path:"/Messages",template:q}});var g1={"Counter":{"All":0,"Error":0,"Success":0,"Warning":0,"Information":0},"Messages":[]};var h1=new J(g1);this.oMessagePopOver.setModel(h1);this.oMessagePopOverButton.setModel(h1);}function b1(i,q){var g1=i.byId("sapOvpSettingsForm");if(g1){var h1=g1.getDomRef();if(h1){h1.style.width=q;}}}function c1(i){var q=this.dialogBox.getContent()[0],g1=q.getModel(),h1=q.getModel("deviceMediaProperties");switch(i.name){case"S":case"M":h1.setProperty("/deviceMedia","Column");b1(q,"100%");break;case"L":case"XL":default:h1.setProperty("/deviceMedia","Row");b1(q,"calc(100% - "+(g1.getProperty("/dialogBoxWidth")+1)+"rem)");break;}h1.refresh(true);}function d1(){a.media.detachHandler(c1.bind(this),null,"SettingsViewRangeSet");a.media.removeRangeSet("SettingsViewRangeSet");}function e1(){a.media.initRangeSet("SettingsViewRangeSet",[520,760,960],"px",["S","M","L","XL"]);a.media.attachHandler(c1.bind(this),null,"SettingsViewRangeSet");c1.bind(this)(a.media.getCurrentRange("SettingsViewRangeSet"));}var f1={dialogBox:undefined,oSaveButton:undefined,oResetButton:undefined,oMessagePopOverButton:undefined,oMessagePopOver:undefined,oAppDescriptor:undefined,oOriginalAppDescriptor:undefined,oMainComponent:undefined,oAppComponent:undefined,oNewDataSources:{},sApplicationId:"",oi18nModel:undefined,iContentHeightForDialog:38,iContentHeightForDialogWithViewSwitch:33,aVariantNames:S.aVariantNames,aVisiblePropertiesForAnnotation:S.aVisiblePropertiesForAnnotation,getDataSources:h,removeDataSources:g,setDataSources:s,attachWindowResizeHandler:e1,detachWindowResizeHandler:d1,settingFormWidth:b1,addKPINavApplicationName:I,addManifestSettings:H,setVisibilityForFormElements:E,getVisibilityOfElement:z,checkForEmptyString:n,enableResetButton:W,enableSaveButton:X,checkClonedCard:x,resetErrorHandling:_,createErrorCard:k,setErrorMessage:l,getQualifier:m,getTrimmedDataURIName:j,addSupportingObjects:T,oVisibility:S.oVisibility,bError:false,bNewStaticLinkListCardFlag:false,bNewKPICardFlag:false,bAddNewCardFlag:false,aListType:S.aListType,aListFlavour:S.aListFlavour,aDataPointSelectionMode:S.aDataPointSelectionMode,aSortOrder:S.aSortOrder,aCardType:S.aCardType,aLinkListFlavour:S.aLinkListFlavour,getDialogBox:function(i){return new Promise(function(g1,h1){if(!this.dialogBox){this.oSaveButton=new B("settingsSaveBtn",{text:d.getText("save"),type:"Emphasized"});var i1=new B("settingsCancelBtn",{text:d.getText("cancelBtn")});this.oResetButton=new B("settingsResetBtn",{text:d.getText("resetCardBtn")});this.oMessagePopOverButton=new B("settingsMessagePopOverBtn",{text:"{/Counter/All}",type:"Emphasized",icon:"sap-icon://message-popup",visible:"{= ${/Counter/All} === 0 ? false : true}"}).addStyleClass("sapOvpSettingsMessagePopOverBtn");this.dialogBox=new D("settingsDialog",{title:d.getText("settingsDialogTitle"),buttons:[this.oMessagePopOverButton,this.oSaveButton,i1,this.oResetButton],afterClose:function($1){var Y1=this.dialogBox.getContent()[0],_1=Y1.byId("sapOvpSettingsLineItemTitle"),a2=Y1.byId("sapOvpSettingsLineItemSubTitle");if(_1){_1.destroy();}if(a2){a2.destroy();}this.bNewStaticLinkListCardFlag=false;this.bNewKPICardFlag=false;this.bAddNewCardFlag=false;this.newDataSource=false;this.dialogBox.destroyContent();this.detachWindowResizeHandler();}.bind(this)});this.dialogBox.setBusyIndicatorDelay(0);i1.attachPress(function($1){this.dialogBox.close();}.bind(this));}this.oResetButton.setVisible(!this.bNewKPICardFlag);a1.bind(this)();var j1=this.bNewStaticLinkListCardFlag||this.bNewKPICardFlag||this.bAddNewCardFlag;var k1=i.getComponentInstance(),l1=k1.getRootControl().getModel("ovpCardProperties"),m1;this.oi18nModel=k1.getComponentData().i18n;if(this.bNewStaticLinkListCardFlag){m1={"title":"New Title","subTitle":"New Subtitle","staticContent":[],"listFlavor":"standard","template":"sap.ovp.cards.linklist","layoutDetail":l1.getProperty("/layoutDetail")};}else if(this.bNewKPICardFlag){var n1=k1.getComponentData().mainComponent.getView().getModel("JSONModelForSSB").getProperty("/d/results"),o1=n1[0];m1={"entitySet":o1.ODataEntityset,"kpiAnnotationPath":"com.sap.vocabularies.UI.v1.KPI#"+o1.KPIQualifier,"title":o1.GroupTitle,"subTitle":o1.KPITitle,"template":"sap.ovp.cards.charts.analytical","layoutDetail":l1.getProperty("/layoutDetail"),"selectedKPI":o1,"errorStatusText":undefined,"KPIData":n1};}else if(this.bAddNewCardFlag){m1={"addNewCard":true,"title":"","subTitle":"","cardType":this.aCardType,"aListType":this.aListType,"aListFlavour":this.aListFlavour,"valueSelectionInfo":"","navigation":this.aDataPointSelectionMode,"aLinkListFlavour":this.aLinkListFlavour,"authorization":""};}else{m1=l1.getData();}var p1=Q.extend(true,{},m1);p1=T.call(this,p1);p1=this.addManifestSettings(p1);var q1=new J(p1),r1=i.getDomRef().offsetHeight,s1=new J(a.system),t1=new J({"deviceMedia":"Row"}),u1=k1.getComponentData(),v1=u1.mainComponent,w1=u1.appComponent,x1=(j1)?"":u1.cardId;this.oAppComponent=w1;this.oAppDescriptor=v1._getCardFromManifest(x1);this.sApplicationId=v1._getApplicationId();this.oMainComponent=v1;this.oOriginalAppDescriptor=w1._getOvpCardOriginalConfig(x1);s1.setDefaultBindingMode("OneWay");p1.dialogBoxHeight=r1;p1.dialogBoxWidth=20;var y1=C._getLayer();if(y1===e.Layers.vendor){q1.setProperty("/layer",y1);var z1=[];if(p1.customParams||p1.staticParameters){q1.setProperty("/addCustomParameters",true);if(p1.staticParameters&&Object.keys(p1.staticParameters).length){for(var A1 in p1.staticParameters){z1.push({"key":A1,"value":p1.staticParameters[A1]});}q1.setProperty("/aAllStaticParameters",z1);}}else{q1.setProperty("/addCustomParameters",false);}if(p1.objectStreamCardsSettings&&p1.objectStreamCardsSettings.customActions){q1.setProperty("/addCustomActions",true);}else{q1.setProperty("/addCustomActions",false);}var B1=sap.ui.getCore().byId("mainView").getModel("i18n").oData.bundle.aCustomBundles;if(B1[0]&&B1[0].aPropertyFiles[0]&&B1[0].aPropertyFiles[0].mProperties){var C1=B1[0].aPropertyFiles[0].mProperties;var D1=[];var E1=[];var F1=[];var G1=[];if(!p1.addNewCard){var H1=S.oI18nKeyValueProperty;for(var A1 in H1){if(A1==="title"){E1.push({key:"",value:p1[A1]});}if(A1==="subTitle"){F1.push({key:"",value:p1[A1]});}if(A1==="valueSelectionInfo"){G1.push({key:"",value:p1[A1]});}}for(var A1 in C1){if(C1.hasOwnProperty(A1)){E1.push({key:A1,value:C1[A1]});}}for(var A1 in C1){if(C1.hasOwnProperty(A1)){F1.push({key:A1,value:C1[A1]});}}for(var A1 in C1){if(C1.hasOwnProperty(A1)){G1.push({key:A1,value:C1[A1]});}}q1.setProperty("/ai18nPropertiesAndTitle",E1);q1.setProperty("/ai18nPropertiesAndSubTitle",F1);q1.setProperty("/ai18nPropertiesAndValSelInfo",G1);}for(var A1 in C1){if(C1.hasOwnProperty(A1)){D1.push({key:A1,value:C1[A1]});}}q1.setProperty("/ai18nProperties",D1);}}if(p1.template==="sap.ovp.cards.linklist"){q1.setProperty("/listFlavorName",d.getText("OVP_KEYUSER_CAROUSEL"));}else{q1.setProperty("/listFlavorName",d.getText("OVP_KEYUSER_BARLIST"));}if(p1.layoutDetail==="resizable"){if(!p1.defaultSpan){p1.defaultSpan={};q1.setProperty("/defaultSpan/cols",q1.getProperty("/cardLayout/colSpan"));q1.setProperty("/defaultSpan/rows",p1.template==="sap.ovp.cards.list"||p1.template==="sap.ovp.cards.table"?q1.getProperty("/cardLayout/noOfItems"):q1.getProperty("/cardLayout/rowSpan"));}else{if(!p1.defaultSpan.rows){q1.setProperty("/defaultSpan/rows",p1.template==="sap.ovp.cards.list"||p1.template==="sap.ovp.cards.table"?q1.getProperty("/cardLayout/noOfItems"):q1.getProperty("/cardLayout/rowSpan"));}if(!p1.defaultSpan.cols){q1.setProperty("/defaultSpan/cols",q1.getProperty("/cardLayout/colSpan"));}}p1.NoOfColumns=[];var I1=1,J1=6;for(var q=I1;q<=J1;q++){p1.NoOfColumns.push({value:q});}if(t(p1.template,'chart')||p1.template==='sap.ovp.cards.linklist'){var K1=i.getComponentInstance().getComponentData().mainComponent,L1=K1.getLayout(),M1=L1.getDashboardLayoutUtil(),N1=v1._getCardId(i.getId()),O1=M1.calculateCardProperties(N1),P1=M1._getCardController(N1).getView().byId('bubbleText')?43:0,Q1=O1.headerHeight+O1.dropDownHeight+P1+50,R1=Math.ceil(O1.minCardHeight/M1.getRowHeightPx())+1;p1.NoOfRows=[];p1.NoOfRows.push({name:"None",value:0});p1.NoOfRows.push({name:"Small",value:R1});p1.NoOfRows.push({name:"Standard",value:Math.ceil((Q1+480)/M1.getRowHeightPx())+1});if(this.bNewStaticLinkListCardFlag||this.bNewKPICardFlag){q1.setProperty("/defaultSpan/cols",1);q1.setProperty("/defaultSpan/rows",R1);}}}if(p1.addNewCard){q1.setProperty("/addViewSwitchCheckBox",false);q1.setProperty("/addKPIHeaderCheckBox",false);var S1=[];var T1=v1.oCardsModels;if(T1){for(var A1 in T1){if(A1.indexOf("kpi_card_model_")<0){S1.push(Q.extend({},{Title:A1},T1[A1]));}}q1.setProperty("/datasources",S1);q1.setProperty("/datasourcesFromManifest",S1);}}var U1={};var V1=new J(U1);U(V1);if(p1.template==="sap.ovp.cards.linklist"&&p1.staticContent){F(q1);q1.setProperty("/lineItemId","linkListItem--1");q1.setProperty("/lineItemIdCounter",p1.staticContent.length);}if(p1.template==="sap.ovp.cards.charts.analytical"){var W1=v1._getCardId(i.getId());q1.setProperty("/NewKPICard",this.bNewKPICardFlag);q1.setProperty("/selectedKPICardID",W1);}this.setVisibilityForFormElements(p1);var X1=new J(this.oVisibility);if(!this.bAddNewCardFlag){q1.attachPropertyChange($.bind(this));}var Y1=new sap.ui.view("settingsView",{viewName:"sap.ovp.cards.rta.SettingsDialog",type:V.XML,preprocessors:{xml:{bindingContexts:{ovpCardProperties:q1.createBindingContext("/")},models:{ovpCardProperties:q1,deviceSystemProperties:s1}}}});Y1.setModel(V1,"staticCardProperties");var Z1=d.oResourceModel;Y1.setModel(q1);Y1.setModel(Z1,"ovpResourceModel");Y1.setModel(t1,"deviceMediaProperties");Y1.setModel(X1,"visibility");if(this.oi18nModel){Y1.setModel(this.oi18nModel,"@i18n");}this.dialogBox.addContent(Y1);this.attachWindowResizeHandler();Y1.loaded().then(function($1){if(!this.bAddNewCardFlag){var _1=$1.byId("dialogCard");if(!_1.getVisible()){_1=$1.byId("dialogCardNoPreview");var a2=Y1.getModel().getProperty("/template").split("."),b2=a2[a2.length-1],c2=d.getText("OVP_KEYUSER_NO_CARD_PREVIEW_MSG",[b2]);_1.setText(c2);}else{_1.setWidth(p1.dialogBoxWidth+"rem");}}f(i,$1,j1);this.dialogBox.open();$1.getController().settingsResolve=g1;}.bind(this));}.bind(this));}};f1.fnEditCardHandler=function(i,q){var g1=i.getComponentInstance().getComponentData().mainComponent,h1=g1.getLayout(),i1=g1.getUIModel();return f1.getDialogBox(i).then(function(j1){var k1=[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_changeCard",content:j1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"editCardSettings",content:j1.flexibilityChange}}];if(j1.viewSwitchChange){k1.push({selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{changeType:"viewSwitch",content:j1.viewSwitchChange}});}if(i1.getProperty('/containerLayout')==='resizable'){var l1=h1.getDashboardLayoutModel(),m1=h1.getDashboardLayoutUtil(),n1=g1._getCardId(i.getId()),o1=l1.getCardById(n1),p1=m1.calculateCardProperties(n1),q1=l1.getColCount(),r1='C'+q1,s1=j1.flexibilityChange.newAppDescriptor.settings.defaultSpan,t1,u1=[];if(s1&&s1.cols){k1.forEach(function(v1){if(v1.changeSpecificData.changeType==='editCardSettings'){var w1=v1.changeSpecificData.content.oldAppDescriptor;w1.settings.defaultSpan={rowSpan:o1.dashboardLayout.rowSpan,colSpan:o1.dashboardLayout.colSpan,showOnlyHeader:o1.dashboardLayout.showOnlyHeader};}});if(s1.rows===0){o1.dashboardLayout.autoSpan=false;t1=Math.ceil((p1.headerHeight+2*m1.CARD_BORDER_PX)/m1.getRowHeightPx());}else{o1.dashboardLayout.autoSpan=true;if(o1.template==='sap.ovp.cards.list'||o1.template==='sap.ovp.cards.table'){o1.dashboardLayout.noOfItems=s1.rows;}else{t1=s1.rows;}}l1._arrangeCards(o1,{row:t1,column:s1.cols},'resize',u1);l1._removeSpaceBeforeCard(u1);u1.forEach(function(v1){var w1={};w1.dashboardLayout={};w1.cardId=v1.content.cardId;w1.dashboardLayout[r1]=v1.content.dashboardLayout;k1.push({selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{changeType:"dragOrResize",content:w1}});});}}return k1;});};f1.fnCloneCardHandler=function(i,q){return P.getPayLoadForCloneCard(i).then(function(g1){return[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_addNewCard",content:g1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"newCardSettings",content:g1.flexibilityChange}}];});};f1.fnAddStaticLinkListCardHandler=function(i,q){f1.bNewStaticLinkListCardFlag=true;return f1.getDialogBox(i).then(function(g1){return[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_addNewCard",content:g1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"newCardSettings",content:g1.flexibilityChange}}];});};f1.fnAddKPICardHandler=function(i,q){f1.bNewKPICardFlag=true;return f1.getDialogBox(i).then(function(g1){var h1=[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_addNewCard",content:g1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"newCardSettings",content:g1.flexibilityChange}}];if(g1.addODataAnnotation){h1.push({appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_app_addAnnotationsToOData",content:g1.addODataAnnotation}});}return h1;});};f1.fnAddNewCardHandler=function(i,q){f1.bAddNewCardFlag=true;return f1.getDialogBox(i).then(function(g1){var h1=[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_addNewCard",content:g1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"newCardSettings",content:g1.flexibilityChange}}];if(g1.addODataAnnotation){h1.push({appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_app_addAnnotationsToOData",content:g1.addODataAnnotation}});}return h1;});};f1.fnRemoveCardHandler=function(i,q){return new Promise(function(g1,h1){c.confirm(d.getText("OVP_KEYUSER_MESSAGE_BOX_WARNING_MESSAGE_DELETE"),{actions:[c.Action.DELETE,c.Action.CANCEL],icon:c.Icon.WARNING,title:d.getText("OVP_KEYUSER_MESSAGE_BOX_TITLE_DELETE"),initialFocus:c.Action.CANCEL,onClose:function(i1){if(i1==="DELETE"){g1(P.getPayLoadForRemoveCard(i));}else{h1(null);}}});}).then(function(g1){var h1=[{appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_ovp_removeCard",content:g1.appDescriptorChange}},{selectorControl:i.getComponentInstance().getComponentData().appComponent.getRootControl().getController().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"removeCardContainer",content:g1.flexibilityChange}}];if(g1.removeDataSourceChange){g1.removeDataSourceChange.forEach(function(i1){h1.push({appComponent:i.getComponentInstance().getComponentData().appComponent,changeSpecificData:{appDescriptorChangeType:"appdescr_app_removeDataSource",content:i1}});});}return h1;},function(g1){return[];});};return f1;},true);
