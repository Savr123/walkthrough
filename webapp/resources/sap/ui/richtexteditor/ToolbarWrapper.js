/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/core/Control','./library','sap/ui/core/IconPool','sap/ui/core/Item','sap/ui/richtexteditor/RTESplitButton',"sap/base/security/URLWhitelist","sap/base/Log","./ToolbarWrapperRenderer"],function(q,C,l,I,a,R,U,L){"use strict";var T=C.extend("sap.ui.richtexteditor.ToolbarWrapper",{metadata:{interfaces:["sap.ui.richtexteditor.IToolbar"],library:"sap.ui.richtexteditor",aggregations:{_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"},_customInsertImageDialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_customInsertLinkDialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_customTextColorDialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_customBackgroundColorDialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_customInsertTableDialog:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{editor:{type:"sap.ui.richtexteditor.RichTextEditor",multiple:false}}}});T.prototype.init=function(){this._helper=l.RichTextEditorHelper;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.richtexteditor");this._oAccessibilityTexts={};this._sTextColor=l.EditorCommands.TextColor.defaultValue;this._sBackgroundColor=l.EditorCommands.BackgroundColor.defaultValue;};T.prototype.onBeforeRendering=function(){if(!this.getAggregation("_toolbar")){var t=this._createCustomToolbar(),e=this.getEditor();if(e){t.setEnabled(e.getEditable());}this.setAggregation("_toolbar",t);this.setAggregation("_customInsertImageDialog",this._helper.createDialog(this._createInsertImageConfig("InsertImage")));this.setAggregation("_customInsertLinkDialog",this._helper.createDialog(this._createInsertLinkConfig("InsertLink")));this.setAggregation("_customTextColorDialog",this._helper.createColorPalettePopover(this._createColorPalettePopoverConfig("TextColor")));this.setAggregation("_customBackgroundColorDialog",this._helper.createColorPalettePopover(this._createColorPalettePopoverConfig("BackgroundColor")));this.setAggregation("_customInsertTableDialog",this._helper.createDialog(this._createInsertTableConfig("InsertTable")));}};T.prototype.onAfterRendering=function(){var e=this.getEditor();this._initialButtonGroupsState=e&&e.getButtonGroups().map(function(o){return q.extend(true,{},o);});this._syncPopoverOpeningArrows();this._syncColors("TextColor",this._sTextColor);this._syncColors("BackgroundColor",this._sBackgroundColor);};T.prototype.exit=function(){for(var g in this._oAccessibilityTexts){this._destroyAssociatedInvisibleTexts(g);}this._customButtons=null;this._oAccessibilityTexts=null;};T.prototype._syncPopoverOpeningArrows=function(){var f=this._findGroupedControls("font"),t=f[2]&&f[2]._getArrowButton(),b=f[3]&&f[3]._getArrowButton();this.getAggregation("_customTextColorDialog")._ensurePopover().attachAfterOpen(function(){t._activeButton();}).attachAfterClose(function(){t._inactiveButton();});this.getAggregation("_customBackgroundColorDialog")._ensurePopover().attachAfterOpen(function(){b._activeButton();}).attachAfterClose(function(){b._inactiveButton();});};T.prototype._getId=function(e){this._getId.counter=this._getId.counter?this._getId.counter+1:1;var r=this.getEditor()?this.getEditor().getId():"_rte"+this._getId.counter,t=this.getId(),b=[r+t];if(e||e===0){b.push(e);}return b.join("-");};T.prototype.getEditor=function(){var i=this.getAssociation("editor"),e=sap.ui.getCore().byId(i);return e||null;};T.prototype.modifyRTEToolbarConfig=function(c){var t=this;c.toolbar=false;c.setup=function(e){e.on('init',function(){var E=l.EditorCommands;e.execCommand("FormatBlock",false,E["FormatBlock"]["Paragraph"].commandValue);e.execCommand("JustifyLeft",false);e.execCommand("FontName",false,E["FontFamily"]["Verdana"].commandValue);e.execCommand("FontSize",false,"10pt");});e.on('NodeChange',function(){t._syncToolbarStates(this);});};return c;};T.prototype._applyColor=function(c,s,b,d){if(d||this._getColor(c).replace(/,\s/g,',')!==b){this.getEditor().getNativeApi().execCommand(s,false,b);}};T.prototype._syncColors=function(c,s){var b=this._findGroupedControls("font"),t;if(!s){return;}switch(c){case"TextColor":b[2]&&b[2].setIconColor(s);break;case"BackgroundColor":t=b[3]&&b[3]._getTextButton().getDomRef("img");t&&sap.ui.getCore().byId(t.id).setColor(s);break;}};T.prototype._syncToolbarStates=function(n){var e,c,E,o=l.EditorCommands,f=n.formatter,_=function(t,j,c){var A,k;for(A in t){k=I.getIconURI(e[A].icon);if(t.hasOwnProperty(A)&&j.match(t[A].style)&&c.getIcon()!==k){c.setIcon(k);break;}}},b=function(j,F,c){var k,i,m,p=j.getDoc().queryCommandValue("FormatBlock");for(k in F){if(!F.hasOwnProperty(k)){continue;}i=c.getId()+k;m=F[k];if((c.getSelectedItemId()!==i)&&((p===m.commandValue)||(p===m.text))){c.setSelectedItemId(i);break;}}},d=function(j,F,c){var k,s,t,i,m=j.getDoc().queryCommandValue("FontName");for(k in F){if(!F.hasOwnProperty(k)){continue;}i=c.getId()+k;s=F[k].commandValue.match(/\w+/g).join("").toLowerCase();m=m&&m.match(/\w+/g).join("").toLowerCase();t=F[k].text.match(/\w+/g).join("").toLowerCase();if((c.getSelectedItemId()!==i)&&(s===m||m===t)){c.setSelectedItemId(i);break;}}},g=function(j,c){var S=j.selection.getNode(),k=S&&S.tagName.toLowerCase()==="img"||(S.parentElement&&S.parentElement.tagName.toLowerCase()==="img");c.setPressed(!!k);},h=function(j,c,t){var S=j.selection.getNode(),k=S&&S.tagName.toLowerCase()==="a"||(S.parentElement&&S.parentElement.tagName.toLowerCase()==="a");if(t){c.setPressed(!!k);}else{c.setEnabled(!!k);}};for(E in o){if(!o.hasOwnProperty(E)){continue;}e=o[E];c=sap.ui.getCore().byId(this._getId(E));if(!c){continue;}switch(E){case"TextAlign":_(e,f,c);break;case"FontFamily":d(n,e,c);break;case"FormatBlock":b(n,e,c);break;case"InsertImage":g(n,c);break;case"InsertLink":h(n,c,true);break;case"Unlink":h(n,c,false);break;case"FontSize":var s=n.getDoc().queryCommandValue(E),i=c.getId()+s;if(c.getSelectedItemId()!==i&&s){c.setSelectedItemId(i);}break;default:c.getMetadata().getName()==="sap.m.OverflowToolbarToggleButton"&&c.setPressed(f.match(e.style));}}};T.prototype._createButtonConfig=function(c){var e=l.EditorCommands,o=e[c],r=this.getEditor();return{id:this._getId(c),icon:I.getIconURI(o.icon),tooltip:this._oResourceBundle.getText(o.bundleKey),text:this._oResourceBundle.getText(o.bundleKey),press:function(){if(r){r.getNativeApi().execCommand(o.command);}else{L.warning("Cannot execute native command: "+o.command);}}};};T.prototype._createMenuButtonItems=function(c){var e=this._helper,E=l.EditorCommands,i=[],s,o;for(var b in E[c]){if(b==='bundleKey'){continue;}o=E[c][b];s=this._oResourceBundle.getText(o.bundleKey)||o.text;i.push(e.createMenuItem(this._getId(c+b),s,I.getIconURI(o.icon)));}return i;};T.prototype._findTextAlignCommandByIcon=function(i){var e=l.EditorCommands['TextAlign'],c,s;Object.keys(e).forEach(function(k){c=I.getIconURI(e[k].icon);if(k!=='bundleKey'&&c===i){s=k;}});return s;};T.prototype._createFontStyleSelectItems=function(){var e=l.EditorCommands,f=e["FontFamily"],i=[],o;for(var F in f){o={id:this._getId("FontFamily"+F),text:f[F].text};i.push(new a(o));}return i;};T.prototype._getFontStyleCommand=function(i){var e=l.EditorCommands,f=e["FontFamily"];for(var F in f){if(f.hasOwnProperty(F)&&f[F].text===i){return f[F].commandValue;}}};T.prototype._getFormatBlockCommand=function(i){var e=l.EditorCommands,f=e["FormatBlock"];for(var F in f){if(f.hasOwnProperty(F)&&this._oResourceBundle.getText(f[F].bundleKey)===i){return f[F].commandValue;}}};T.prototype._createFontSizeSelectItems=function(){var i=[],n=1,o,e=l.EditorCommands;e["FontSize"].forEach(function(b){o={id:this._getId("FontSize"+n),text:b+" pt"};i.push(new a(o));n++;},this);return i;};T.prototype._createFormatBlockItems=function(){var e=l.EditorCommands,f=e["FormatBlock"],i=[],o;for(var F in f){o={id:this._getId("FormatBlock"+F),text:this._oResourceBundle.getText(f[F].bundleKey)};i.push(new a(o));}return i;};T.prototype._getColor=function(c){var r=this.getEditor(),o=l.EditorCommands[c].style,n=r.getNativeApi().selection.getNode(),N=r.getNativeApi().dom.getParents(n),i,b,s;for(i=0;i<N.length;i++){b=N[i];s=b.style[o];if(s&&s!=""){return s;}}return l.EditorCommands[c].defaultValue;};T.prototype._createSplitButtonForDialog=function(c){var o=l.EditorCommands[c],t=this,d,r;if(!o){return;}r={id:this._getId(c),tooltip:this._oResourceBundle.getText(o.bundleKey),press:function(){switch(c){case"TextColor":t._applyColor(c,o.command,t._sTextColor);break;case"BackgroundColor":t._applyColor(c,o.command,t._sBackgroundColor);break;}},arrowPress:function(){d=t.getAggregation("_custom"+c+"Dialog");this._getArrowButton()._activeButton();if(!d){return;}d.openBy(this);}};if(c==="BackgroundColor"){r.icon=I.getIconURI(o.icon);}return r;};T.prototype._createButtonForDialog=function(c){var o=l.EditorCommands[c],t=this,d;if(!o){return;}return{id:this._getId(c),icon:I.getIconURI(o.icon),tooltip:this._oResourceBundle.getText(o.bundleKey),text:this._oResourceBundle.getText(o.bundleKey),press:function(){d=t.getAggregation("_custom"+c+"Dialog");if(!d){return;}switch(c){case"InsertImage":this.setPressed(true);t._syncImageDialogData(d);break;case"InsertLink":t._syncLinkDialogData(d);break;case"InsertTable":t._resetDialogContent(d);}d.open();}};};T.prototype._syncImageDialogData=function(d){var s=this.getEditor().getNativeApi().selection,S=s&&s.getNode(),D=d&&d.getContent(),o,h,w,b,u,c,W,H,e;if(!D.length){return;}o=D[6];e=D[5];if(e.getMetadata().getName()==="sap.m.HBox"&&e.getAggregation("items").length){h=e.getAggregation("items")[2];w=e.getAggregation("items")[0];}if(S.tagName.toLowerCase()==='img'){b=S;}else{b=S.parentElement;}if(b.tagName.toLowerCase()!=="img"){this._resetDialogContent(d);return;}if(!o.getEnabled()){o.setEnabled(true);}o.setSelected(b.getAttribute('data-sap-ui-rte-image-ratio')==='true'?true:false);u=b.getAttribute('src');c=b.getAttribute('alt');W=parseFloat(b.width);H=parseFloat(b.height);D[1].setValue(u);D[3].setValue(c);h.setValue(H);w.setValue(W);};T.prototype._syncLinkDialogData=function(d){var D=d&&d.getContent(),s,S,u,b,t,c,o,e,f;if(!(D instanceof Array)||!D.length){return;}s=this.getEditor().getNativeApi().selection;o=s.getNode();S=this._getSelectionAnchor(s);if(!S){S=o.parentElement;}e=s.getContent().length!==0&&S.textContent&&s.getContent().length<S.textContent.length&&S.tagName==="A";f=s.getContent().length!==0;if(!f||e){b=S.text;}else{b=(s.getNode()&&s.getNode().tagName.toLowerCase()==='a')?s.getNode().textContent:s.getContent({format:'text'});}u=S.getAttribute('href');t=S.getAttribute('title');c=S.getAttribute('target')==="true";D[1].setValue(u);D[3].setValue(b&&b.replace(/\uFEFF/g,""));D[5].setValue(t);D[6].getAggregation('items')[1].setSelectedIndex(c);};T.prototype._resetDialogContent=function(d){var c=d.findAggregatedObjects(true),s;c.forEach(function(o){s=o.getMetadata().getName();if(s==="sap.m.Input"){o.resetProperty('value');}else if(s==="sap.m.CheckBox"){o.resetProperty('selected').setEnabled(false);}});};T.prototype._createColorPalettePopoverConfig=function(t){var c=l.EditorCommands[t],s=c.defaultValue,o=this;return{defaultColor:s,colorSelect:function(e){var s=e.getParameters().value;o._applyColor(t,c.command,s,e.getParameter("defaultAction"));switch(t){case"TextColor":o._sTextColor=s;o._syncColors("TextColor",s);break;case"BackgroundColor":o._sBackgroundColor=s;o._syncColors("BackgroundColor",s);break;}}};};T.prototype._generateImageHTML=function(u,t,h,w,r){var s=u?' src="'+u+'"':'',A=t?' alt="'+t+'"':'',H=h?' height="'+h+'px"':'',W=w?' width="'+w+'px"':'',d=H+W,b=(r!==undefined)?' data-sap-ui-rte-image-ratio="'+r+'"':'';return'<img'+s+A+d+b+'/>';};T.prototype._createInsertImageConfig=function(){var r,t=this._oResourceBundle.getText(sap.ui.richtexteditor.EditorCommands["InsertImage"].bundleKey),u=this._helper.createInput(),o=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_IMAGE_URL"),labelFor:u}),b=this._helper.createInput(),c=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_IMAGE_DESCRIPTION"),labelFor:b}),d=this._helper.createInput({width:'8rem',fieldWidth:"6rem",description:'px',change:function(){k(false,true);}}),e=this._helper.createText({textAlign:"Center",width:'2rem',text:'x'}),D=this._helper.createInput({fieldWidth:"6rem",width:'8rem',description:'px',change:function(){k(true,false);}}),f=this._helper.createHBox({wrap:"Wrap",alignItems:"Center",justifyContent:"SpaceBetween",items:[d,e,D]}),g=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS")}),h=this._helper.createCheckBox({select:function(){k(true,true);}}),i=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_IMAGE_RATIO"),labelFor:h}),j=this.getEditor(),k=function(n,p){var s=j.getNativeApi().selection,S=s&&s.getNode(),w=parseFloat(d.getValue()),H=parseFloat(D.getValue()),v,x;if(!h.getSelected()){return;}if(S.tagName.toLowerCase()!=='img'&&!(S.parentElement&&S.parentElement.tagName.toLowerCase()==="img")){return;}S=S.tagName.toLowerCase()==="img"?S:S.parentElement;v=parseFloat(S.width);x=parseFloat(S.height);r=v/x;if(n&&(H!==x||H!=D._lastValue)){d.setValue(H*r);}else if(p&&(w!==v||w!=d._lastValue)){D.setValue(w/r);}},m=this,B=[];B.push(this._helper.createButton({id:this._getId("InsertImageButton"),text:this._oResourceBundle.getText("DIALOG_OK_BUTTON"),press:function(){j.getNativeApi().insertContent(m._generateImageHTML(u.getValue(),b.getValue(),D.getValue(),d.getValue(),h.getSelected()));m.getAggregation("_customInsertImageDialog").close();m._syncToolbarStates(j.getNativeApi());}}));B.push(this._helper.createButton({id:this._getId("CancelInsertImageButton"),text:this._oResourceBundle.getText("DIALOG_CANCEL_BUTTON"),press:function(){m.getAggregation("_customInsertImageDialog").close();m._syncToolbarStates(j.getNativeApi());}}));return{contentWidth:'320px',title:t,buttons:B,content:[o,u,c,b,g,f,h,i]};};T.prototype._getSelectionAnchor=function(s){var S,A;if(!s){return;}S=s.getNode();if(s.getStart().tagName=='A'){A=s.getStart();}else if(S.tagName=='A'){A=S;}return A;};T.prototype._generateLinkHTML=function(u,t,b,s){var c={href:u&&U.validate(u)?u:'',target:b?b:null,title:t&&U.validate(t)?t:''},n=this.getEditor().getNativeApi(),S=n.selection,e=false,A,d,f;A=this._getSelectionAnchor(S);if(u===""&&!A){return;}if(u===""&&A){n.execCommand("Unlink");return;}if(!A){d=n.dom.select('a[href="'+c.href+'"]');if(s!==""){n.insertContent(n.dom.createHTML('a',c,n.dom.encode(s)));e=true;}else{n.execCommand('mceInsertLink',false,c);e=true;}f=n.dom.select('a[href="'+c.href+'"]');A=f.filter(function(o){return d.indexOf(o)===-1;})[0];}if("innerText"in A){A.innerText=s!==""?s:u;}else{A.textContent=s!==""?s:u;}n.dom.setAttribs(A,c);n.selection.select(A);if(!e){n.fire("change");}};T.prototype._createInsertLinkConfig=function(){var t=this._oResourceBundle.getText(sap.ui.richtexteditor.EditorCommands["InsertLink"].bundleKey),u=this._helper.createInput(),o=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_LINK_URL"),labelFor:u}),b=this._helper.createInput(),c=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_LINK_DISPLAY_TEXT"),labelFor:b}),d=this._helper.createInput(),e=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_LINK_TITLE"),labelFor:d}),f=this._helper.createSelect({id:this._getId("InsertLinkSelect"),items:[new a({id:this._getId("InsertLinkSelectNone"),text:this._oResourceBundle.getText("INSERT_LINK_TARGET_NONE")}),new a({id:this._getId("InsertLinkSelectNewWindow"),text:this._oResourceBundle.getText("INSERT_LINK_TARGET_NEW_WINDOW")})]}),g=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_LINK_TARGET"),labelFor:f}),h=this._helper.createVBox({direction:"Column",alignItems:"Start",items:[g,f]}),r=this.getEditor(),i=this,B=[];B.push(this._helper.createButton({id:this._getId("InsertLinkButton"),text:this._oResourceBundle.getText("DIALOG_OK_BUTTON"),press:function(){var j=(f.getSelectedItem()===f.getItems()[1]);i._generateLinkHTML(u.getValue(),d.getValue(),j,b.getValue());i.getAggregation("_customInsertLinkDialog").close();i._syncToolbarStates(r.getNativeApi());}}));B.push(this._helper.createButton({id:this._getId("CancelInsertLinkButton"),text:this._oResourceBundle.getText("DIALOG_CANCEL_BUTTON"),press:function(){i.getAggregation("_customInsertLinkDialog").close();i._syncToolbarStates(r.getNativeApi());}}));return{contentWidth:'320px',title:t,buttons:B,content:[o,u,c,b,e,d,h]};};T.prototype._createInsertTableConfig=function(){var t=this._oResourceBundle.getText(sap.ui.richtexteditor.EditorCommands["InsertTable"].bundleKey),r=this._helper.createStepInput({value:2,min:0,width:"50%"}),o=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_TABLE_ROWS"),labelFor:r}),c=this._helper.createStepInput({value:2,min:0,width:"50%"}),b=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_TABLE_COLS"),labelFor:c}),d=this._helper.createLabel({text:this._oResourceBundle.getText("INSERT_CONTENT_DIMENSIONS")}),D=this._helper.createInput({width:'8rem',fieldWidth:"6rem",description:'px',ariaLabelledBy:d}),e=this._helper.createText({textAlign:"Center",width:'2rem',text:'x'}),f=this._helper.createInput({fieldWidth:"6rem",width:'8rem',description:'px',ariaLabelledBy:d}),g=this._helper.createHBox({wrap:"Wrap",alignItems:"Center",justifyContent:"SpaceBetween",items:[D,e,f]}),h=this.getEditor(),i=this,B=[];B.push(this._helper.createButton({id:this._getId("InsertTableButton"),text:this._oResourceBundle.getText("DIALOG_OK_BUTTON"),press:function(){var j=h.getNativeApi().plugins.table.insertTable(c.getValue(),r.getValue()),k=h.getNativeApi().dom;k.setStyle(j,'width',f.getValue()+"px");k.setStyle(j,'height',D.getValue()+"px");i.getAggregation("_customInsertTableDialog").close();}}));B.push(this._helper.createButton({id:this._getId("CancelInsertTableButton"),text:this._oResourceBundle.getText("DIALOG_CANCEL_BUTTON"),press:function(){i.getAggregation("_customInsertTableDialog").close();}}));return{title:t,buttons:B,content:this._helper.createVBox({direction:"Column",alignItems:"Start",items:[o,r,b,c,d,g]})};};T.prototype._createCustomToolbar=function(){var e=this._helper,c=[],b=l.ButtonGroups,g=Object.keys(b),G=[],d=this.getEditor()?this.getEditor().getButtonGroups():[];g.forEach(function(n){d.forEach(function(o){if(o.name===n){G.push(o);}});});G=this._sortToolbarContent(G);G.forEach(function(o){c=c.concat(this.addButtonGroup(o.name));}.bind(this));return e.createOverflowToolbar(this._getId(),c);};T.prototype.setToolbarEnabled=function(e,s){var t=this.getAggregation("_toolbar");if(t&&t.getEnabled()!==e){t.setEnabled(e,s);}};T.prototype.setShowGroup=function(g,s){var o=this._findGroupedControls(g),t=this.getAggregation("_toolbar");o.forEach(function(O){O.setVisible(s);});t&&t.rerender();};T.prototype.addButtonGroup=function(g){var r=this.getEditor(),e=this._helper,c=[],b=l.ButtonGroups,o=l.EditorCommands,A=l.Accessibility,v,V,d,f,h,i,j,k,m,t=this;switch(g){case"font-style":f=r?r.getShowGroupFontStyle():false;b["font-style"].forEach(function(u){c.push(e.createOverflowToolbarToggleButton(this._createButtonConfig(u)).setVisible(f));},this);break;case"font":d=r?r.getShowGroupFont():false;var n=e.createInvisibleText({text:this._oResourceBundle.getText(A["FontFamily"])}).toStatic(),p=e.createInvisibleText({text:this._oResourceBundle.getText(A["FontSize"])}).toStatic();this._registerAssociatedInvisibleTexts("font",n.getId());this._registerAssociatedInvisibleTexts("font",p.getId());c.push(e.createSelect({id:this._getId("FontFamily"),ariaLabelledBy:n,items:this._createFontStyleSelectItems(),change:function(E){var u;if(r){u=E.getSource().getSelectedItem();r.getNativeApi().execCommand('FontName',false,this._getFontStyleCommand(u.getText()));}else{L.warning("Cannot execute native command: "+'FontName');}}.bind(this)}).setVisible(d));c.push(e.createSelect({id:this._getId("FontSize"),ariaLabelledBy:p,items:this._createFontSizeSelectItems(),change:function(E){var u;if(r){u=E.getSource().getSelectedItem();r.getNativeApi().execCommand('FontSize',false,u.getText().replace(/\s/g,""));}else{L.warning("Cannot execute native command: "+'FontSize');}}}).setVisible(d));c.push(new R(this._createSplitButtonForDialog("TextColor")).setVisible(d));c.push(e.createSplitButton(this._createSplitButtonForDialog("BackgroundColor")).setVisible(d));break;case"text-align":i=r?r.getShowGroupTextAlign():false;var M=this._createMenuButtonItems("TextAlign");c.push(e.createMenuButton(this._getId("TextAlign"),M,function(E){var S,u,w;if(r){S=E.getParameter("item");u=r.getNativeApi();w=S.getIcon();if(w===this.getParent().getIcon()){u.execCommand('JustifyLeft');}else{u.execCommand('Justify'+t._findTextAlignCommandByIcon(w));}}else{L.warning("Cannot execute native command: "+'Justify');}},M[0].getIcon(),this._oResourceBundle.getText(o["TextAlign"].bundleKey)).setVisible(i));break;case"formatselect":j=r?(this._isButtonGroupAdded("styleselect")||this._isButtonGroupAdded("formatselect")):false;if(j){var s=e.createInvisibleText({text:this._oResourceBundle.getText(A["FormatBlock"])}).toStatic();this._registerAssociatedInvisibleTexts("formatselect",s.getId());c.push(e.createSelect({id:this._getId("FormatBlock"),ariaLabelledBy:s,items:this._createFormatBlockItems(),change:function(E){var S;if(r){S=E.getSource().getSelectedItem();if(S){var u=r.getAggregation("_toolbarWrapper")._getFormatBlockCommand(S.getText());r.getNativeApi().execCommand('FormatBlock',false,u);}}else{L.warning("Cannot execute native command: "+'FormatBlock');}}}).setVisible(j));}break;case"structure":V=r?r.getShowGroupStructure():false;b["structure"].forEach(function(u){c.push(e.createOverflowToolbarButton(this._createButtonConfig(u)).setVisible(V));},this);break;case"clipboard":v=r?r.getShowGroupClipboard():false;b["clipboard"].forEach(function(u){c.push(e.createOverflowToolbarButton(this._createButtonConfig(u)).setVisible(v));},this);break;case"undo":h=r?r.getShowGroupUndo():false;b["undo"].forEach(function(u){c.push(e.createOverflowToolbarButton(this._createButtonConfig(u)).setVisible(h));},this);break;case"insert":m=r?r.getShowGroupInsert():false;c.push(e.createOverflowToolbarToggleButton(this._createButtonForDialog("InsertImage")).setVisible(m));break;case"link":k=r?r.getShowGroupLink():false;c.push(e.createOverflowToolbarToggleButton(this._createButtonForDialog("InsertLink")).setVisible(k));c.push(e.createOverflowToolbarButton(this._createButtonConfig("Unlink")).setVisible(k));break;case"table":c.push(e.createOverflowToolbarButton(this._createButtonForDialog("InsertTable")));break;}return c;};T.prototype.addButtonGroupToContent=function(g,f){var G;if(!f&&g.buttons[0]==="table"){G=g.buttons[0];sap.ui.richtexteditor.ButtonGroups.custom[g.name]={name:g.buttons[0],controls:["InsertTable"]};}if(f&&g.name==="table"){G=g.name;sap.ui.richtexteditor.ButtonGroups[g.name]=["InsertTable"];}if(f&&(g.name==="formatselect"||g.name==="styleselect")){G="formatselect";sap.ui.richtexteditor.ButtonGroups[g.name]=["FormatBlock"];}if(!sap.ui.richtexteditor.ButtonGroups[g.name]&&!sap.ui.richtexteditor.ButtonGroups.custom[g.name]){return this;}if(!G){G=g.name;}var t=this.getAggregation("_toolbar"),c=this.addButtonGroup(G),b=c.length,i,s;s=this._findGroupPriorityPosition(g);c.reverse();for(i=0;i<b;i++){t.insertContent(c[i],s);}return this;};T.prototype._sortToolbarContent=function(g){g.sort(function(G,o){return G.customToolbarPriority-o.customToolbarPriority;});return g;};T.prototype._findGroupPriorityPosition=function(g){var G=this.getEditor().getButtonGroups(),c=l.ButtonGroups,s=0;if(!q.isNumeric(g.customToolbarPriority)){g.customToolbarPriority=this._getLastGroupPriority(G)+10;}G=this._sortToolbarContent(G);G.forEach(function(o){if(o.customToolbarPriority<g.customToolbarPriority&&o.name!==g.name){s+=c[o.name]?c[o.name].length:0;}});return s;};T.prototype._getLastGroupPriority=function(g){var p=g.map(function(G){return G.customToolbarPriority||0;});return Math.max.apply(null,p);};T.prototype.removeButtonGroup=function(g){var o=this._findGroupedControls(g);this._destroyAssociatedInvisibleTexts(g);o.forEach(function(O){O.destroy();});};T.prototype._destroyAssociatedInvisibleTexts=function(g){var i=this._oAccessibilityTexts[g]||[];i.forEach(function(s){sap.ui.getCore().byId(s).destroy();});this._oAccessibilityTexts[g]=[];};T.prototype._registerAssociatedInvisibleTexts=function(g,i){if(!this._oAccessibilityTexts[g]){this._oAccessibilityTexts[g]=[];}this._oAccessibilityTexts[g].push(i);};T.prototype.setButtonGroups=function(n){var t=this.getAggregation("_toolbar"),g=this._getGroupsForUpdate(n);if(!t){return this;}g.aRemovedGroups.forEach(function(G){this.removeButtonGroup(G.name);}.bind(this));g.aAddedGroups=this._sortToolbarContent(g.aAddedGroups);g.aAddedGroups.forEach(function(G){this.addButtonGroupToContent(G,true);}.bind(this));return this;};T.prototype._getJSONStringForGroups=function(g){var s=[];g.forEach(function(o){s.push(JSON.stringify(o,["name","visible","customToolbarPriority","buttons"]));});return s;};T.prototype._getGroupsForUpdate=function(n){var N=this._getJSONStringForGroups(n),o=this._getJSONStringForGroups(this._initialButtonGroupsState),g={aRemovedGroups:[],aAddedGroups:[]};N.forEach(function(G,i){if(o.indexOf(G)===-1){g.aAddedGroups.push(n[i]);}});o.forEach(function(G,i){if(N.indexOf(G)===-1){g.aRemovedGroups.push(this._initialButtonGroupsState[i]);}}.bind(this));return g;};T.prototype._findGroupedControls=function(g){var b=l.ButtonGroups,t=this.getAggregation("_toolbar"),c=[];if(!t){return[];}if(b[g]){c=b[g];}else if(b.custom[g]){c=b.custom[g].controls;}var i=c.map(function(n){return this._getId(n);},this);return t.findAggregatedObjects(false,function(A){return i.indexOf(A.getId())>-1;})||[];};T.prototype.modifyToolbarContent=function(m){var r,b=Array.prototype.slice.call(arguments);b.shift();switch(m){case"add":r=this._proxyToolbarAdd.apply(this,b);break;case"destroy":r=this._proxyToolbarDestroy.apply(this,b);break;case"get":r=this._proxyToolbarGet.apply(this,b);break;case"indexOf":r=this._proxyToolbarIndexOf.apply(this,b);break;case"insert":r=this._proxyToolbarInsert.apply(this,b);break;case"removeAll":r=this._proxyToolbarRemoveAll.apply(this,b);break;case"remove":r=this._proxyToolbarRemove.apply(this,b);break;}return r;};T.prototype._isButtonGroupAdded=function(g){var G=this.getEditor().getButtonGroups(),r=false,i;for(i=0;i<G.length;i++){if(G[i].name===g){r=true;break;}}return r;};T.prototype._updateCustomToolbarRefIds=function(i,b){var c,d;c=this._customButtons||[];d=c.indexOf(i);if(d>-1){c.splice(d,1);}if(b!==-1){b=b>=0&&b<=c.length?b:c.length;c.splice(b,0,i);}this._customButtons=c;};T.prototype._proxyToolbarAdd=function(i){var t=this.getAggregation("_toolbar"),r=t.addContent(i);t.rerender();if(r){this._updateCustomToolbarRefIds(i.getId());}return r;};T.prototype._proxyToolbarGet=function(){var t=this.getAggregation("_toolbar"),c=this._customButtons||[];return t.findAggregatedObjects(false,function(A){return c.indexOf(A.getId())>-1;})||[];};T.prototype._proxyToolbarDestroy=function(){var i=this._proxyToolbarGet();i.forEach(function(o){o.destroy();});this._customButtons=[];};T.prototype._proxyToolbarIndexOf=function(i){var c=this._customButtons||[],s=typeof i==="object"?i.getId():i;return c.indexOf(s);};T.prototype._proxyToolbarInsert=function(i,b){var r,t=this.getAggregation("_toolbar"),c=t.getContent()||[],d=this._customButtons||[],e=c.length-d.length;if(b<0){b=0;}else if(b>d.length){b=d.length;}else if(!b&&b!==0){b=d.length;}e+=b;r=t.insertContent(i,e);t.rerender();if(r){this._updateCustomToolbarRefIds(i.getId(),b);}return r;};T.prototype._proxyToolbarRemoveAll=function(){var i=this._proxyToolbarGet();i.forEach(this._proxyToolbarRemove,this);return i;};T.prototype._proxyToolbarRemove=function(i){var s,r,t=this.getAggregation("_toolbar");switch(typeof i){case"string":s=i;break;case"object":s=i.getId();break;case"number":s=this._customButtons[i];break;}r=t.removeContent(s);if(r&&s){this._updateCustomToolbarRefIds(s,-1);}return r;};return T;},true);
