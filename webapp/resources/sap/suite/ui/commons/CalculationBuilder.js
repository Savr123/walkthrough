sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/core/Control","./CalculationBuilderItem","./CalculationBuilderExpression","./CalculationBuilderInput","./CalculationBuilderFunction","sap/m/OverflowToolbar","sap/m/OverflowToolbarToggleButton","sap/m/OverflowToolbarButton","sap/m/ToolbarSpacer","sap/m/Title","sap/ui/core/Popup","sap/m/MessageBox","sap/base/util/uid","sap/ui/core/library","sap/m/library"],function(q,l,C,a,b,c,d,O,e,f,T,g,P,M,u,h,L){"use strict";var B=L.ButtonType;var j=h.TitleLevel;var I=Object.freeze({SHOW_EXPRESSION:"sap-icon://notification-2",EXPAND_VARIABLE:"sap-icon://disconnected",FULL_SCREEN:"sap-icon://full-screen",EXIT_FULL_SCREEN:"sap-icon://exit-full-screen"});var r=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");var k=l.CalculationBuilderOperatorType,m=l.CalculationBuilderLogicalOperatorType,n=l.CalculationBuilderComparisonOperatorType,o=l.CalculationBuilderItemType,F=l.CalculationBuilderFunctionType,p=l.CalculationBuilderLayoutType,V=l.CalculationBuilderValidationMode;var N=new RegExp(String.fromCharCode(160),"g");var s={abs:{key:"ABS",title:"ABS - Absolute Value",allowed:true},round:{key:"Round",title:"Round",template:["",",",""],allowed:true},roundup:{key:"RoundUp",title:"Round Up",template:["",",",""],allowed:true},rounddown:{key:"RoundDown",title:"Round Down",template:["",",",""],allowed:true},sqrt:{key:"SQRT",title:"SQRT",allowed:true},"case":{key:"Case",title:"Case",description:"CASE ( \"When\" Expression \"Then\" Expression \"Else\" Expression )",template:["",",","",",",""]},ndiv0:{key:"NDIV0",title:"NDIV0"},nodim:{key:"NODIM",title:"NODIM",description:"NODIM ( Variable )"},sumct:{key:"SUMCT",title:"SUMCT",description:"SUMGT ( Variable )"},sumgt:{key:"SUMGT",title:"SUMGT",description:"SUMGT ( Variable )"},sumrt:{key:"SUMRT",title:"SUMRT",description:"SUMRT ( Variable )"}};var t=C.extend("sap.suite.ui.commons.CalculationBuilder",{metadata:{library:"sap.suite.ui.commons",properties:{expression:{type:"string",group:"Misc",defaultValue:null},title:{type:"string",group:"Misc",defaultValue:null},showToolbar:{type:"boolean",group:"Misc",defaultValue:true},wrapItemsInExpression:{type:"boolean",group:"Misc",defaultValue:true},layoutType:{type:"string",group:"Misc",defaultValue:"Default"},showInputToolbar:{type:"boolean",group:"Misc",defaultValue:false},readOnly:{type:"boolean",group:"Misc",defaultValue:false},allowComparisonOperators:{type:"boolean",group:"Misc",defaultValue:true},allowLogicalOperators:{type:"boolean",group:"Misc",defaultValue:true},allowSuggestions:{type:"boolean",group:"Misc",defaultValue:true},allowStringConstants:{type:"boolean",group:"Misc",defaultValue:false},validationMode:{type:"sap.suite.ui.commons.CalculationBuilderValidationMode",group:"Misc",defaultValue:V.LiveChange},disabledDefaultTokens:{type:"string",group:"Misc",defaultValue:""}},defaultAggregation:"items",aggregations:{items:{type:"sap.suite.ui.commons.CalculationBuilderItem",multiple:true,singularName:"item",bindable:"bindable",forwarding:{idSuffix:"-expression",aggregation:"items",forwardBinding:true}},variables:{type:"sap.suite.ui.commons.CalculationBuilderVariable",multiple:true,singularName:"Variable",forwarding:{idSuffix:"-expression",aggregation:"variables",forwardBinding:true}},functions:{type:"sap.suite.ui.commons.CalculationBuilderFunction",multiple:true,singularName:"Function",forwarding:{idSuffix:"-expression",aggregation:"functions",forwardBinding:true}},operators:{type:"sap.ui.core.Item",multiple:true,singularName:"Operator",forwarding:{idSuffix:"-expression",aggregation:"operators",forwardBinding:true}},groups:{type:"sap.suite.ui.commons.CalculationBuilderGroup",multiple:true,singularName:"Group",forwarding:{idSuffix:"-expression",aggregation:"groups",forwardBinding:true}}},events:{validateFunction:{parameters:{definition:"object",customFunction:"object",result:"sap.suite.ui.commons.CalculationBuilderValidationResult"}},change:{},afterValidation:{}}},renderer:function(R,i){var w=i.getWrapItemsInExpression()?" sapCalculationBuilderWrapItems ":"",v=i.getLayoutType()===p.TextualOnly,D=i._bShowInput||v?"":"style=\"display:none\"",x=i._isExpressionVisible(),y=i._isInputVisible(),z=i.getReadOnly();R.write("<div");R.writeControlData(i);R.addClass("sapCalculationBuilder");if(i.getReadOnly()){R.addClass("sapCalculationBuilderReadOnly");}R.writeClasses(i);R.write(">");if(i.getShowToolbar()&&!v){R.renderControl(i.getToolbar());}if(x){i._oExpressionBuilder._bReadOnly=z;R.write("<div class=\"sapCalculationBuilderInsideWrapper"+w+"\">");R.renderControl(i._oExpressionBuilder);R.write("</div>");}if(x&&y){R.write("<div class=\"sapCalculationBuilderDelimiterLine\"></div>");}if(y){i._oInput._bReadOnly=z||(i.getLayoutType()===p.VisualTextualReadOnly);R.write("<div");R.addClass("sapCalculationBuilderInputOuterWrapper");if(i._oInput._bReadOnly){R.addClass("sapCalculationBuilderReadOnly");}if(i.getLayoutType()===p.Default||i.getLayoutType()===p.VisualTextualReadOnly){R.addClass("sapCalculationBuilderInputOuterWrapperMargin");}R.writeClasses();R.write(D+">");R.renderControl(i._oInput);R.write("</div>");}R.write("</div>");}});t.prototype.init=function(){this._mDisabledTokens={};this._bShowInput=true;this._oFullScreenContainer=null;this._bIsFullScreen=false;this._oExpressionBuilder=new b(this.getId()+"-expression",{change:function(){this._expressionChanged();this.fireChange();}.bind(this)});this.addDependent(this._oExpressionBuilder);this._oInput=new c(this.getId()+"-input",{change:function(E){var i=E.getParameter("value"),v=this._oInput._stringToItems(i),w=E.getParameter("position");this._oExpressionBuilder._smartRender(v);this._setExpression(this._oInput._convertEmptyHashes(i));if(this.getValidationMode()!==V.FocusOut){this._validateInput(i,w);}else{this._oInput._recreateText({text:i,position:w,errors:this._oExpressionBuilder._aErrors});}this._enableOrDisableExpandAllButton();this.fireChange();}.bind(this)});this.addDependent(this._oInput);};t.prototype._expressionChanged=function(){var i="";this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();i=this._oInput._itemsToString({items:this._oExpressionBuilder.getItems(),errors:this._oExpressionBuilder._aErrors});this._setExpression(i);this.fireAfterValidation();this._oInput._displayError(this._oExpressionBuilder._aErrors.length!==0);this._oExpressionBuilder._printErrors();this._enableOrDisableExpandAllButton();};t.prototype.onBeforeRendering=function(){this._resetItems();this._createToolbar();this._oExpressionBuilder._createVariablesMap();this._oInput._aVariables=this.getVariables();if(!this._isExpressionVisible()){this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();}this._bRendered=false;};t.prototype.onAfterRendering=function(){this._setExpression(this._oInput._itemsToString({items:this._oExpressionBuilder.getItems(),errors:this._oExpressionBuilder._aErrors}));this._bRendered=true;this._oInput._displayError(this._oExpressionBuilder._aErrors.length>0);};t.prototype.getToolbar=function(){return this._oToolbar;};t.prototype.getInputToolbar=function(){return this._oInput&&this._oInput._oInputToolbar;};t.prototype.validateParts=function(i){i=i||{};return this._oExpressionBuilder._validateSyntax({items:i.items,from:i.from,to:i.to});};t.prototype.appendError=function(E){this._oExpressionBuilder._aErrors.push(E);};t.prototype.getErrors=function(){return this._oExpressionBuilder._aErrors;};t.prototype.validate=function(){this._resetItems();this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();this.updateErrorsDisplay();};t.prototype.updateErrorsDisplay=function(){var E=this._oExpressionBuilder._aErrors;if(this._isInputVisible()){this._oInput._recreateText({errors:E});this._oInput._displayError(E.length>0);}if(this._isExpressionVisible()){this._oExpressionBuilder._printErrors();}};t.prototype.allowFunction=function(i,A){if(!i){return;}var v=s[i.toLowerCase()];if(v){v.allowed=A;}};t.prototype.updateOrCreateItem=function(K){this._oExpressionBuilder._updateOrCreateItem({key:K});};t.prototype.getErrors=function(){return this._oExpressionBuilder&&this._oExpressionBuilder._aErrors;};t.prototype._resetItems=function(){this.getItems().forEach(function(i){i._reset();});};t.prototype._validateInput=function(i,v){this._oExpressionBuilder._aErrors=this._oExpressionBuilder._validateSyntax();this.fireAfterValidation();this._oInput._recreateText({text:i,position:v,errors:this._oExpressionBuilder._aErrors});this._oExpressionBuilder._printErrors();this._oInput._displayError(this._oExpressionBuilder._aErrors.length>0);};t.prototype._findInArray=function(K,i,v){return i.some(function(w){var x=v?w["get"+v]():w;return x.toLowerCase()===K;});};t.prototype._findInItems=function(K,i){K=(K||"").toLowerCase();return i.some(function(v){return v.getKey().toLowerCase()===K;});};t.prototype._createErrorText=function(E,v){E=E||this.getErrors();var w="",x=0,y=5;for(var i=0;i<E.length&&x<y;i++){if((E[i].index<0||!q.isNumeric(E[i].index))||!v){x++;w+=E[i].title+"\n";}}return w;};t.prototype._getFunctionMap=function(){return s;};t.prototype._getFunctionDefinition=function(K){K=(K||"").toLowerCase();return s[K]||q.grep(this.getFunctions(),function(i){return i.getKey().toLowerCase()===K;})[0];};t.prototype._getFunctionDescription=function(i){var E;if(i.description){return i.description;}E=r.getText("CALCULATION_BUILDER_EXPRESSION_TITLE");if(i.template){var D=(i.key||"")+" ( ";i.template.forEach(function(K){D+=(K?K:E)+" ";});return D+")";}return(i.key||"")+" ( "+E+" )";};t.prototype._getFunctionTemplateItems=function(i){if(!i){return[];}var v=(i instanceof d)?o.CustomFunction:o.Function;return v===o.Function?(i.template||[]):this._convertToTemplate(i.getItems());};t.prototype._getFunctionAllowParametersCount=function(K){var i=this._getFunctionTemplateItems(this._getFunctionDefinition(K)),v=i.join("");return(v.match(/,/g)||[]).length+1;};t.prototype._convertToTemplate=function(i){return i.map(function(v){return v.getKey();});};t.prototype._isOperator=function(K,A){A=A!==false;K=(K||"").toLowerCase();if(!this._isTokenAllowed(K)){return false;}return this._findInArray(K,Object.keys(k))||(A&&this.getAllowLogicalOperators()&&this._findInArray(K,Object.keys(m)))||(this.getAllowComparisonOperators()&&this._findInArray(K,Object.keys(n)));};t.prototype._isFunction=function(K){return this._isTokenAllowed(K)&&this._findInArray(K,Object.keys(F));};t.prototype._isCustomOperator=function(K){return this._findInItems(K,this.getOperators());};t.prototype._isStringConstant=function(K){return K&&K.length>=2&&K[0]==="\""&&K[K.length-1]==="\"";};t.prototype._getType=function(K){K=(K||"").toLowerCase();if(!K){return o.Empty;}if(this._isOperator(K)){return o.Operator;}if(this._isCustomOperator(K)){return o.CustomOperator;}if(this._findInArray(K,this.getVariables(),"Key")){return o.Variable;}if(this._isFunction(K)){return o.Function;}if(this._findInArray(K,this.getFunctions(),"Key")){return o.CustomFunction;}if(this.getAllowStringConstants()&&this._isStringConstant(K)){return o.Constant;}if(!isNaN(K)){return o.Constant;}return o.Error;};t.prototype._createToolbar=function(){if(this._oToolbar){this._oShowInputButton&&this._oShowInputButton.setVisible(this._isInputVisible());this._oToolbarTitle.setText(this.getTitle());this._oToolbarTitle.setVisible(!!this.getTitle());return;}this._oToolbarTitle=new g({titleStyle:j.H4,text:this.getTitle(),visible:!!this.getTitle()});this._oToolbar=new O(this.getId()+"-toolbar",{content:[this._oToolbarTitle,new T()]}).addStyleClass("sapCalculationBuilderToolbar");this._oShowInputButton=new e({type:B.Transparent,icon:I.SHOW_EXPRESSION,tooltip:r.getText("CALCULATION_BUILDER_TOGGLE_EXPRESSION_BUTTON"),pressed:true,press:function(){this.$().find(".sapCalculationBuilderInputOuterWrapper").toggle();this._bShowInput=!this._bShowInput;}.bind(this)});this._oToolbar.addContent(this._oShowInputButton);this._oToolbar.addContent(this._getExpandAllVariablesButton());this._oToolbar.addContent(new e({type:B.Transparent,icon:I.FULL_SCREEN,tooltip:r.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"),press:function(E){var i=E.getSource();this._toggleFullScreen();i.setTooltip(this._bIsFullScreen?r.getText("CALCULATION_BUILDER_EXIT_FULL_SCREEN_BUTTON"):r.getText("CALCULATION_BUILDER_ENTER_FULL_SCREEN_BUTTON"));i.setIcon(this._bIsFullScreen?I.EXIT_FULL_SCREEN:I.FULL_SCREEN);this.invalidate();}.bind(this)}));this._oFullScreenPopup=new P({modal:true,shadow:false,autoClose:false});this.addDependent(this._oToolbar);};t.prototype._getExpandAllVariablesButton=function(){if(!this._oExpandAllVariablesButton){this._oExpandAllVariablesButton=new f({type:B.Transparent,icon:I.EXPAND_VARIABLE,tooltip:r.getText("CALCULATION_BUILDER_EXPAND_ALL_BUTTON"),press:function(E){M.show(r.getText("CALCULATION_BUILDER_EXPAND_ALL_MESSAGE_TEXT"),{icon:M.Icon.WARNING,title:r.getText("CALCULATION_BUILDER_EXPAND_ALL_MESSAGE_TITLE"),actions:[M.Action.OK,M.Action.CANCEL],onClose:function(A){if(A===M.Action.OK){this._oExpressionBuilder._expandAllVariables();}}.bind(this)});}.bind(this)});}return this._oExpandAllVariablesButton;};t.prototype._enableOrDisableExpandAllButton=function(){var i=this.getReadOnly()||this.getLayoutType()===p.VisualTextualReadOnly,$=this._getExpandAllVariablesButton().$();if($[0]){this._getExpandAllVariablesButton().setEnabled(!i&&this.getItems().some(function(v){return v._isVariable()&&v.isExpandable();}));}};t.prototype.setExpression=function(v){this.setProperty("expression",v);this._oExpressionBuilder._setItems(this._oInput._stringToItems(v));this._oInput._setupAriaLabel();return this;};t.prototype.getExpression=function(){return this._oInput._itemsToString({createInputText:false,items:this.getItems()});};t.prototype._setExpression=function(v){if(v){v=v.replace(N," ");}this.setProperty("expression",v,true);this._oInput._setupAriaLabel();};t.prototype._toggleFullScreen=function(){var i=function(){this._oFullScreenContainer={};this._oFullScreenContainer.$content=this.$();if(this._oFullScreenContainer.$content){this._oFullScreenContainer.$tempNode=q("<div></div>");this._oFullScreenContainer.$content.before(this._oFullScreenContainer.$tempNode);this._oFullScreenContainer.$overlay=q("<div id='"+u()+"'></div>");this._oFullScreenContainer.$overlay.addClass("sapCalculationBuilderOverlay");this._oFullScreenContainer.$overlay.append(this._oFullScreenContainer.$content);this._oFullScreenPopup.setContent(this._oFullScreenContainer.$overlay);}this._oFullScreenPopup.open(0,P.Dock.BeginTop,P.Dock.BeginTop,q("body"));}.bind(this);var v=function(){this._oFullScreenContainer.$tempNode.replaceWith(this.$());this._oFullScreenPopup.close();this._oFullScreenContainer.$overlay.remove();}.bind(this);this._bIsFullScreen?v():i();this._bIsFullScreen=!this._bIsFullScreen;};t.prototype._getGroupMap=function(){return this._oExpressionBuilder._mGroups;};t.prototype._isExpressionVisible=function(){return this.getLayoutType()!==p.TextualOnly;};t.prototype._isInputVisible=function(){return this.getLayoutType()!==p.VisualOnly;};t.prototype._createFunctionObject=function(i){if(!i){return null;}return i instanceof d?{key:i.getKey(),title:i._getLabel(),description:this._getFunctionDescription({key:i.getKey(),description:i.getDescription(),template:this._convertToTemplate(i.getItems())}),type:o.CustomFunction,functionObject:i}:{key:i.key,title:i.title,description:this._getFunctionDescription(i),type:o.Function,functionObject:i};};t.prototype._getAllFunctions=function(){var i=[];Object.keys(s).forEach(function(K){if(s[K].allowed&&this._isTokenAllowed(K)){i.push(this._createFunctionObject(s[K]));}}.bind(this));this.getFunctions().forEach(function(v){i.push(this._createFunctionObject(v));}.bind(this));return i.sort(function(v,w){return v.title>w.title;});};t.prototype._isTokenAllowed=function(K){return!this._mDisabledTokens[(K||"").toLowerCase()];};t.prototype.setDisabledDefaultTokens=function(v){this._mDisabledTokens={};this.setProperty("disabledDefaultTokens",v);if(v){var i=v.split(";");i.forEach(function(w){if(w){this._mDisabledTokens[w.toLowerCase()]=1;}}.bind(this));}return this;};return t;});
