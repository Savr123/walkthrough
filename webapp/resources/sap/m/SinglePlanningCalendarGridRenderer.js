/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/unified/calendar/CalendarDate','sap/ui/unified/calendar/CalendarUtils','sap/ui/core/date/UniversalDate','sap/ui/core/InvisibleText','./PlanningCalendarLegend','sap/ui/unified/library'],function(C,a,U,I,P,u){"use strict";var v=2;var A=2;var b=1;var c=u.CalendarDayType;var S={};S.render=function(r,o){r.write("<div");r.writeControlData(o);r.addClass("sapMSinglePCGrid");r.writeClasses();r.write(">");r.renderControl(o.getAggregation("_columnHeaders"));this.renderBlockersContainer(r,o);r.write("<div");r.writeAttribute("role","grid");r.addClass("sapMSinglePCGridContent");r.writeClasses();r.write(">");this.renderRowHeaders(r,o);this.renderNowMarker(r,o);this.renderColumns(r,o);r.write("</div>");r.write("</div>");};S.renderBlockersContainer=function(r,o){var d=o._getColumns(),m=o._getBlockersToRender().iMaxlevel,s=o.getStartDate(),e=(m+1)*o._getBlockerRowHeight()+3,f=o._getDateFormatter(),g=o.getSpecialDates(),h=C.fromLocalJSDate(s),D=o._getColumnHeaders()._getDateTypes(h),t,l;r.write("<div");r.writeAttribute("role","grid");r.addClass("sapMSinglePCBlockersRow");r.writeClasses();r.write(">");r.write("<div");r.writeAttribute("role","row");r.addClass("sapMSinglePCBlockersColumns");if(g&&o._getColumns()===1){if(D&&D[0]){t=D[0];r.addClass("sapUiCalItem"+t.type);l=P.findLegendItemForItem(sap.ui.getCore().byId(o._sLegendId),t);}r.addClass("sapMSpecialDaysInDayView");}r.addStyle("height",e+"px");r.writeClasses();r.writeStyles();r.write(">");this.renderDndPlaceholders(r,o,o.getAggregation("_blockersPlaceholders"));for(var i=0;i<d;i++){var j=new C(s.getFullYear(),s.getMonth(),s.getDate()+i);r.write("<div");r.writeAttribute("role","gridcell");r.writeAttribute("data-sap-start-date",f.format(j.toLocalJSDate()));r.writeAttribute("data-sap-end-date",f.format(j.toLocalJSDate()));r.writeAttribute("aria-labelledby",I.getStaticId("sap.m","SPC_BLOCKERS")+" "+"fullDay-"+f.format(j.toLocalJSDate())+"-Descr");r.addClass("sapMSinglePCBlockersColumn");r.writeAttribute("tabindex",-1);if(j.isSame(new C())){r.addClass("sapMSinglePCBlockersColumnToday");}if(a._isWeekend(j,o._getCoreLocaleData())){r.addClass("sapMSinglePCBlockersColumnWeekend");}r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.writeAttribute("id","fullDay-"+f.format(j.toLocalJSDate())+"-Descr");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.write(o._getCellStartEndInfo(j.toLocalJSDate()));if(o._sLegendId&&l){r.writeEscaped(l);}r.write("</span>");r.write("</div>");}this.renderBlockers(r,o);r.write("</div>");r.write("</div>");};S.renderBlockers=function(r,o){var t=this,B=o._getBlockersToRender().oBlockersList;r.write("<div");r.writeAttribute("role","grid");r.writeAttribute("aria-labelledby",I.getStaticId("sap.m","SPC_BLOCKERS"));r.addClass("sapMSinglePCBlockers");r.addClass("sapUiCalendarRowVisFilled");r.writeClasses();r.write(">");B.getIterator().forEach(function(d){t.renderBlockerAppointment(r,o,d);});r.write("</div>");};S.renderBlockerAppointment=function(r,o,B){var g=C.fromLocalJSDate(o.getStartDate()),d=B.getData(),e=C.fromLocalJSDate(d.getStartDate()),f=C.fromLocalJSDate(d.getEndDate()),s=a._daysBetween(e,g),E=a._daysBetween(f,g),i=o._getColumns(),R=o._getBlockerRowHeight(),h=B.level,j=B.width,t=d.getTooltip_AsString(),T=d.getType(),k=d.getColor(),l=d.getTitle(),m=d.getText(),n=d.getIcon(),p=d.getId(),q={role:"gridcell",labelledby:{value:I.getStaticId("sap.ui.unified","APPOINTMENT"),append:true},selected:d.getSelected()?true:false},w=o.getAriaLabelledBy(),L=s*(100/i),x=(i-E-1)*(100/i),y=sap.ui.getCore().getConfiguration().getRTL(),z;if(w.length>0){q["labelledby"].value=q["labelledby"].value+" "+w.join(" ");}if(l){q["labelledby"].value=q["labelledby"].value+" "+p+"-Title";}q["labelledby"].value=q["labelledby"].value+" "+p+"-Descr";if(m){q["labelledby"].value=q["labelledby"].value+" "+p+"-Text";}if(d.getTentative()){q["labelledby"].value=q["labelledby"].value+" "+I.getStaticId("sap.ui.unified","APPOINTMENT_TENTATIVE");}r.write("<div");r.writeElementData(d);r.writeAttribute("data-sap-level",h);r.writeAttribute("data-sap-width",j);r.writeAttribute("tabindex",0);if(t){r.writeAttributeEscaped("title",t);}r.writeAccessibilityState(d,q);r.addClass("sapMSinglePCAppointmentWrap");r.addClass("sapUiCalendarRowApps");if(!k&&T!==c.None){r.addClass("sapUiCalendarApp"+T);}if(k){if(sap.ui.getCore().getConfiguration().getRTL()){r.addStyle("border-right-color",k);}else{r.addStyle("border-left-color",k);}}r.addStyle("top",R*h+1+"px");r.addStyle(y?"right":"left",Math.max(L,0)+"%");r.addStyle(y?"left":"right",Math.max(x,0)+"%");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarApp");if(d.getSelected()){r.addClass("sapUiCalendarAppSel");}if(d.getTentative()){r.addClass("sapUiCalendarAppTent");}if(n){r.addClass("sapUiCalendarAppWithIcon");}r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarAppCont");if(k){r.addStyle("background-color",d._getCSSColorForBackground(k));r.writeStyles();}r.writeClasses();r.write(">");if(L<0){z=["sapUiCalendarAppArrowIconLeft","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-left",z,{title:null});}if(n){z=["sapUiCalendarAppIcon"];var D={};D["id"]=p+"-Icon";D["title"]=null;r.writeIcon(n,z,D);}if(l){r.write("<span");r.writeAttribute("id",p+"-Title");r.addClass("sapUiCalendarAppTitle");r.writeClasses();r.write(">");r.writeEscaped(l,true);r.write("</span>");}if(x<0){z=["sapUiCalendarAppArrowIconRight","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-right",z,{title:null});}r.write("<span id=\""+p+"-Descr\" class=\"sapUiInvisibleText\">"+o._getAppointmentAnnouncementInfo(d)+"</span>");r.write("</div>");r.write("</div>");r.write("</div>");};S.renderRowHeaders=function(r,o){var s=o._getVisibleStartHour(),e=o._getVisibleEndHour(),d=new Date(),h=o._getHoursFormat(),f=o._getAMPMFormat();r.write("<div");r.addClass("sapMSinglePCRowHeaders");r.writeClasses();r.write(">");for(var i=s;i<=e;i++){d.setHours(i);r.write("<span");r.addClass("sapMSinglePCRowHeader");r.addClass("sapMSinglePCRowHeader"+i);if(o._shouldHideRowHeader(i)){r.addClass("sapMSinglePCRowHeaderHidden");}r.writeClasses();r.write(">");r.write(h.format(d));if(o._hasAMPM()){r.write("<span");r.addClass("sapMSinglePCRowHeaderAMPM");r.writeClasses();r.write(">");r.write(" "+f.format(d));r.write("</span>");}r.write("</span>");}r.write("</div>");};S.renderColumns=function(r,o){var d=o._getColumns(),s=o.getStartDate(),e=o._getAppointmentsToRender();r.write("<div");r.writeAttribute("role","grid");r.writeAttribute("aria-labelledby",I.getStaticId("sap.m","SPC_APPOINTMENTS"));r.addClass("sapMSinglePCColumns");r.writeClasses();r.write(">");for(var i=0;i<d;i++){var f=new C(s.getFullYear(),s.getMonth(),s.getDate()+i),F=o._getDateFormatter(),D=F.format(f.toLocalJSDate());r.write("<div");r.writeAttribute("data-sap-day",D);r.addClass("sapMSinglePCColumn");if(f.isSame(new C())){r.addClass("sapMSinglePCColumnToday");}if(a._isWeekend(f,o._getCoreLocaleData())){r.addClass("sapMSinglePCColumnWeekend");}r.writeClasses();r.write(">");this.renderDndPlaceholders(r,o,o._dndPlaceholdersMap[f]);this.renderRows(r,o,D);this.renderAppointments(r,o,e[D],f);r.write("</div>");}r.write("</div>");};S.renderDndPlaceholders=function(r,o,p){r.write("<div class=\"sapMSinglePCOverlay\">");p.forEach(r.renderControl);r.write("</div>");};S.renderRows=function(r,o,d){var s=o._getVisibleStartHour(),e=o._getVisibleEndHour(),f=o._getDateFormatter(),g,h;for(var i=s;i<=e;i++){g=o._parseDateStringAndHours(d,i);h=new Date(g.getFullYear(),g.getMonth(),g.getDate(),g.getHours()+1);r.write("<div");r.addClass("sapMSinglePCRow");if(!o._isVisibleHour(i)){r.addClass("sapMSinglePCNonWorkingRow");}r.writeAttribute("data-sap-hour",i);r.writeAttribute("data-sap-start-date",f.format(g));r.writeAttribute("data-sap-end-date",f.format(h));r.writeAttribute("aria-labelledby",f.format(g)+"-Descr");r.writeAttribute("tabindex",-1);r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.writeAttribute("id",f.format(g)+"-Descr");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.write(o._getCellStartEndInfo(g,h));r.write("</span>");r.write("</div>");}};S.renderAppointments=function(r,o,d,e){var t=this;if(d){r.write("<div");r.addClass("sapMSinglePCAppointments");r.addClass("sapUiCalendarRowVisFilled");r.writeClasses();r.write(">");d.oAppointmentsList.getIterator().forEach(function(f){var m=d.iMaxLevel,l=f.level,w=f.width,g=f.getData();t.renderAppointment(r,o,m,l,w,g,e);});r.write("</div>");}};S.renderAppointment=function(r,o,m,i,d,e,f){var g=C.fromLocalJSDate(o.getStartDate()),G=new C(g),R=o._getRowHeight(),h=new U(f.getYear(),f.getMonth(),f.getDate(),o._getVisibleStartHour()),j=new U(f.getYear(),f.getMonth(),f.getDate(),o._getVisibleEndHour(),59,59),k=e.getStartDate(),l=e.getEndDate(),n=C.fromLocalJSDate(k),p=C.fromLocalJSDate(l),t=e.getTooltip_AsString(),T=e.getType(),s=e.getColor(),q=e.getTitle(),w=e.getText(),x=e.getIcon(),y=e.getId(),L=this._getLineClamp(k,l),z={role:"gridcell",labelledby:{value:I.getStaticId("sap.ui.unified","APPOINTMENT"),append:true},selected:e.getSelected()?true:false},B=o.getAriaLabelledBy(),D=h.getTime()>k.getTime(),E=j.getTime()<l.getTime(),F=D?0:o._calculateTopPosition(k),H=E?0:o._calculateBottomPosition(l),J=100/(m+1),K,M,N,O,Q;G.setDate(G.getDate()+o._getColumns()-1);K=a._daysBetween(n,g);M=a._daysBetween(G,p);N=f.isSame(g);O=f.isSame(G);if(B.length>0){z["labelledby"].value=z["labelledby"].value+" "+B.join(" ");}if(q){z["labelledby"].value=z["labelledby"].value+" "+y+"-Title";}z["labelledby"].value=z["labelledby"].value+" "+y+"-Descr";if(w){z["labelledby"].value=z["labelledby"].value+" "+y+"-Text";}if(e.getTentative()){z["labelledby"].value=z["labelledby"].value+" "+I.getStaticId("sap.ui.unified","APPOINTMENT_TENTATIVE");}r.write("<div");r.writeElementData(e);r.writeAttribute("data-sap-level",i);r.writeAttribute("data-sap-width",d);r.writeAttribute("tabindex",0);if(t){r.writeAttributeEscaped("title",t);}r.writeAccessibilityState(e,z);r.addClass("sapMSinglePCAppointmentWrap");r.addClass("sapUiCalendarRowApps");if(!s&&T!==c.None){r.addClass("sapUiCalendarApp"+T);}if(s){if(sap.ui.getCore().getConfiguration().getRTL()){r.addStyle("border-right-color",s);}else{r.addStyle("border-left-color",s);}}r.addStyle("top",F+"px");r.addStyle("bottom",H+"px");r.addStyle(sap.ui.getCore().getConfiguration().getRTL()?"right":"left",J*i+"%");r.addStyle("width",J*d+"%");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarApp");r.addStyle("min-height",(R-(v+A+b))/2+"px");if(e.getSelected()){r.addClass("sapUiCalendarAppSel");}if(e.getTentative()){r.addClass("sapUiCalendarAppTent");}if(x){r.addClass("sapUiCalendarAppWithIcon");}r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarAppCont");if(s){r.addStyle("background-color",e._getCSSColorForBackground(s));r.writeStyles();}r.writeClasses();r.write(">");if(N&&K<0){Q=["sapUiCalendarAppArrowIconLeft","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-left",Q,{title:null});}if(x){Q=["sapUiCalendarAppIcon"];var V={};V["id"]=y+"-Icon";V["title"]=null;r.writeIcon(x,Q,V);}r.write("<div");r.addClass("sapUiCalendarAppTitleWrapper");r.addClass("sapUiSPCAppLineClamp"+L);r.writeClasses();r.write(">");if(q){r.write("<span");r.writeAttribute("id",y+"-Title");r.addClass("sapUiCalendarAppTitle");r.writeClasses();r.write(">");r.writeEscaped(q,true);r.write("</span>");}if(w){r.write("<span");r.writeAttribute("id",y+"-Text");r.addClass("sapUiCalendarAppText");r.writeClasses();r.write(">");r.writeEscaped(w,true);r.write("</span>");}r.write("</div>");if(O&&M<0){Q=["sapUiCalendarAppArrowIconRight","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-right",Q,{title:null});}r.write("<span id=\""+y+"-Descr\" class=\"sapUiInvisibleText\">"+o._getAppointmentAnnouncementInfo(e)+"</span>");r.write("</div>");if(o.getEnableAppointmentsResize()&&!D&&!E){this.renderResizeHandles(r);}r.write("</div>");r.write("</div>");};S.renderNowMarker=function(r,o){var d=new Date();r.write("<div");r.writeAttribute("id",o.getId()+"-nowMarker");r.addStyle("top",o._calculateTopPosition(d)+"px");r.addClass("sapMSinglePCNowMarker");if(o._isOutsideVisibleHours(d.getHours())){r.addClass("sapMSinglePCNowMarkerHidden");}r.writeClasses();r.writeStyles();r.write(">");r.write("<span");r.writeAttribute("id",o.getId()+"-nowMarkerText");r.addClass("sapMSinglePCNowMarkerText");r.writeClasses();r.write(">");r.write(o._formatTimeAsString(d));if(o._hasAMPM()){r.write("<span");r.writeAttribute("id",o.getId()+"-nowMarkerAMPM");r.addClass("sapMSinglePCNowMarkerAMPM");r.writeClasses();r.write(">");r.write(o._addAMPM(d));r.write("</span>");}r.write("</span>");r.write("</div>");};S.renderResizeHandles=function(r){r.write("<span");r.addClass("sapMSinglePCAppResizeHandleBottom");r.writeClasses();r.write(">");r.write("</span>");r.write("<span");r.addClass("sapMSinglePCAppResizeHandleTop");r.writeClasses();r.write(">");r.write("</span>");};S._getLineClamp=function(o,d){var m=a._minutesBetween(o,d);if(m>=51&&m<69){return"2";}else if(m>=69&&m<90){return"3";}else if(m>=90&&m<110){return"4";}else if(m>=110&&m<130){return"5";}else if(m>=130&&m<150){return"6";}else if(m>=150&&m<170){return"7";}else if(m>=170&&m<190){return"8";}else if(m>=190){return"9";}else{return"1";}};return S;},true);