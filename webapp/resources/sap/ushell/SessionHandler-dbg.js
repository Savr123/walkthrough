// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel",
    "sap/m/VBox",
    "sap/ui/core/library",
    "sap/ushell/ui/launchpad/LoadingDialog",
    "sap/ui/thirdparty/jquery"
], function (
    oResources,
    oDialog,
    oButton,
    oText,
    JSONModel,
    VBox,
    coreLibrary,
    LoadingDialog,
    jQuery
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    /**
     * Handling session timeout for FLP.
     * Including announcing user activity to the platform (via USell container service)
     * and maintaining user activity data on local storage to support multi-browser/tab use-cases.
     * The user is announced once the session is about to end, and had the option of renewing the session to avoid session timeout
     * Configuration settings
     *   - sessionTimeoutIntervalInMinutes - What is the timeout period according to platform configuration for session timeout
     *   - keepSessionAliveAlertTimeInMinutes - time before session timeout to display keep alive popup
     *   - enableAutomaticLogout - when it's set to true we don’t want to show the refresh window. Instead we want to perform automatic logoff.
     */
    var SessionHandler = function (AppLifeCycle) {
        var that = this;

        /**
         * Initialization of the sessionHandling logic
         * Steps:
         *   1. Creating the local storage entry for session handling
         *   2. Setting of the local storage property that maintains the time of the last activity
         */
        this.init = function (oConfig) {
            sap.ushell.Container.registerLogout(this.logout);

            jQuery.sap.measure.start("SessionTimeoutInit", "Inititialize Session Timeout", "FLP_SHELL");
            this.config = oConfig;
            this.oModel = new JSONModel();
            // Default is to show the session timeout message box and not doing automatic logout (kiosk mode)
            if (this.config.enableAutomaticSignout === undefined) {
                this.config.enableAutomaticSignout = false;
            }
            if (this.config.sessionTimeoutReminderInMinutes === undefined) {
                this.config.sessionTimeoutReminderInMinutes = 0;
            }
            this.oModel.setProperty("/SessionRemainingTimeInSeconds", this.config.sessionTimeoutReminderInMinutes * 60);
            this.counter = 0;
            this.oKeepAliveDialog = undefined;
            this.oLocalStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local, "com.sap.ushell.adapters.local.session");

            this.registerCommHandlers();
            this.putTimestampInStorage(this._getCurrentDate());
            this.putContinueWorkingVisibilityInStorage(null);
            this.attachUserEvents();
            // Related to sessionTimeoutIntervalInMinutes (e.g., 30 minutes)
            // For updating the server
            this.notifyServer();
            this.notifyUserInactivity();
            jQuery.sap.measure.end("SessionTimeoutInit");
        };

        this.registerCommHandlers = function () {
            AppLifeCycle.registerShellCommunicationHandler({
                "sap.ushell.sessionHandler": {
                    oRequestCalls: {
                        "logout": {
                            isActiveOnly: false,
                            distributionType: ["URL"]
                        },
                        "extendSessionEvent": {
                            isActiveOnly: false,
                            distributionType: ["URL"]
                        }
                    },
                    oServiceCalls: {
                        "notifyUserActive": {
                            executeServiceCallFn: function (/*oServiceParams*/) {
                                that.userActivityHandler();
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });
        };

        this.notifyUserInactivity = function () {
            var timeSinceLastActionInMiliSecond = this._getCurrentDate() - new Date(this.getTimestampFromStorage()),
                timeSinceLastActionInMinutes = timeSinceLastActionInMiliSecond / (1000 * 60), // e.g. 10 minutes
                reminderIntervalInMinutes = this.config.sessionTimeoutIntervalInMinutes - this.config.sessionTimeoutReminderInMinutes; // e.g. 25
            // The goal is to measure 25 minutes from the last user action.
            // For example: if the last user action happened 15 min ago, then now we should wait another 10min (i.e., 25-15=10)
            if (timeSinceLastActionInMinutes < reminderIntervalInMinutes) {
                setTimeout(this.notifyUserInactivity.bind(this), (reminderIntervalInMinutes - timeSinceLastActionInMinutes) * 60 * 1000);
            } else if (this.config.sessionTimeoutReminderInMinutes > 0) {
                // reset the ContinueWorkingVisibility parameter in localstore, if user already click on "continue" button
                this.putContinueWorkingVisibilityInStorage(null);
                // show popup
                this.detachUserEvents();
                // Parameters: iRemainingTime, bRemainingTimeIsInMinutes, bStopTimer
                this.handleSessionRemainingTime(this.config.sessionTimeoutReminderInMinutes * 60, true);

                this.oContinueWorkingDialog = this.createContinueWorkingDialog();
                this.oContinueWorkingDialog.open();

                // "Dialog opened" event saved in localStorage
            } else {
                this.handleSessionOver();
            }
        };

        this.handleSessionOver = function () {
            clearTimeout(this.notifyServerTimer);
            sap.ui.getCore().getEventBus().publish("launchpad", "sessionTimeout");
            if (this.config.enableAutomaticSignout === true) {
                this.logout();
            } else {
                this.createSessionExpiredDialog().open();
            }
        };
        this.notifyServer = function () {
            var timeSinceLastActionInMiliSecond = this._getCurrentDate() - new Date(this.getTimestampFromStorage()),
                timeSinceLastActionInMinutes = timeSinceLastActionInMiliSecond / (1000 * 60);
            // Last user action happened during the last sessionTimeoutIntervalInMinutes (e.g., 30 min)
            if (timeSinceLastActionInMinutes <= this.config.sessionTimeoutIntervalInMinutes) {
                // call service keepAlive to prevent server session time out before client session time
                sap.ushell.Container.sessionKeepAlive();

                //send post to isolated
                AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "extendSessionEvent", {});
            } else {
                // No activity during last server session length - do nothing
            }
            this.notifyServerTimer = setTimeout(this.notifyServer.bind(this), this.config.sessionTimeoutIntervalInMinutes * 60 * 1000);
        };

        this.handleSessionRemainingTime = function (iRemainingTimeInSeconds) {

            // For the use-case of multiple tabs/window (same session):
            // If the user clicked the "Continue working" button in other tab/window -
            // then we should act as if the user clicked the button in the dialog in this tab/window
            var shouldContinueWorkingAppear = this.getContinueWorkingVisibilityFromStorage();
            if (shouldContinueWorkingAppear != undefined && shouldContinueWorkingAppear === false &&
                this.oContinueWorkingDialog && this.oContinueWorkingDialog.isOpen()) {
                this.continueWorkingButtonPressHandler();
            }
            if (iRemainingTimeInSeconds === 0) {
                // Timeout is finished, and the user didn't choose to continue working
                if (this.oSessionKeepAliveDialog) {
                    this.oSessionKeepAliveDialog.close();
                }
                this.handleSessionOver();
            } else {
                iRemainingTimeInSeconds = iRemainingTimeInSeconds - 1;
                this.oModel.setProperty("/SessionRemainingTimeInSeconds", iRemainingTimeInSeconds);
                this.remainingTimer = setTimeout(that.handleSessionRemainingTime.bind(that, iRemainingTimeInSeconds, false), 1000);
            }
        };

        /* ----------------------------------------- User Dialog controls - begin ----------------------------------------- */

        /**
         * Creates and returns a dialog box that announces the user about the remaining time until session timeout
         * and allows the user to renew the session or (depends of configuration) to sign our immediately.
         * The Dialog box structure:
         *   - sap.m.Dialog
         *     - sap.m.VBox (Texts VBox)
         *        - sap.m.Text (Mandatory: Remaining time text)
         *        - sap.m.Text (Optional: Data lost reminder text)
         *     - sap.m.Button (Mandatory: Continue working button)
         *     - sap.m.Button (Optional: Sign Out button)
         */
        this.createContinueWorkingDialog = function () {
            this.oMessageVBox = new VBox();
            this.oSessionKeepAliveLabel = new oText({
                text: {
                    parts: ["/SessionRemainingTimeInSeconds"],
                    formatter: function (iSessionRemainingTimeInSeconds) {
                        var bIsTimeInMinutes = iSessionRemainingTimeInSeconds > 60,
                            sTimeUnits,
                            iSessionRemainingTime,
                            sMessage;

                        sTimeUnits = bIsTimeInMinutes ? oResources.i18n.getText("sessionTimeoutMessage_units_minutes") : oResources.i18n.getText("sessionTimeoutMessage_units_seconds");
                        iSessionRemainingTime = bIsTimeInMinutes ? Math.ceil(iSessionRemainingTimeInSeconds / 60) : iSessionRemainingTimeInSeconds;
                        if (that.config.enableAutomaticSignout) {
                            sMessage = oResources.i18n.getText("sessionTimeoutMessage_kioskMode_main", [iSessionRemainingTime, sTimeUnits]);
                        } else {
                            sMessage = oResources.i18n.getText("sessionTimeoutMessage_main", [iSessionRemainingTime, sTimeUnits]);
                        }
                        return sMessage;
                    }
                }
            });
            this.oMessageVBox.addItem(this.oSessionKeepAliveLabel);

            if (this.config.enableAutomaticSignout === false) {
                this.oLostDataReminder = new oText({
                    text: oResources.i18n.getText("sessionTimeoutMessage_unsavedData")
                });
                this.oMessageVBox.addItem(this.oLostDataReminder);
            }

            this.oSessionKeepAliveLabel.setModel(this.oModel);

            this.oSessionKeepAliveDialog = new oDialog("sapUshellKeepAliveDialog", {
                title: oResources.i18n.getText("sessionTimeoutMessage_title"),
                type: "Message",
                state: ValueState.Warning,
                content: this.oMessageVBox,
                beginButton: this.getContinueWorkingButton(),
                afterClose: function () {
                    this.oSessionKeepAliveDialog.destroy();
                }.bind(this)
            });

            if (this.config.enableAutomaticSignout === true) {
                this.oSignOutButton = new oButton({
                    text: oResources.i18n.getText("logoutBtn_title"),
                    tooltip: oResources.i18n.getText("logoutBtn_tooltip"),
                    press: this.logout.bind(this)
                });
                this.oSessionKeepAliveDialog.setEndButton(this.oSignOutButton);
            }

            return this.oSessionKeepAliveDialog;
        };

        this.getContinueWorkingButton = function () {
            return new oButton({
                text: oResources.i18n.getText("sessionTimeoutMessage_continue_button_title"),
                press: that.continueWorkingButtonPressHandler.bind(that)
            });
        };

        this.continueWorkingButtonPressHandler = function () {
            if (this.oSessionKeepAliveDialog) {
                this.oSessionKeepAliveDialog.close();
            }
            clearTimeout(this.remainingTimer);
            this.putTimestampInStorage(this._getCurrentDate());

            // Start new setTimeout
            this.notifyUserInactivity();

            // Listen to user events (i.e., keyboard and mouse) after they were detached when UserKeepAliveDialog UI was created
            this.attachUserEvents();
            // set Local storage param to false , so other tabs message boxes will be closed
            this.putContinueWorkingVisibilityInStorage(false);

            //send post to isolated
            AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "extendSessionEvent", {});
        };

        this.createSessionExpiredDialog = function () {
            this.oSessionExpiredDialog = new oDialog("sapUshellSessioTimedOutDialog", {
                title: oResources.i18n.getText("sessionExpiredMessage_title"),
                type: "Message",
                state: ValueState.Warning,
                content: new oText({ text: oResources.i18n.getText("sessionExpiredMessage_main") }),
                beginButton: this.getReloadButton(),
                afterClose: function () {
                    this.oSessionExpiredDialog.destroy();
                }.bind(this)
            });
            return this.oSessionExpiredDialog;
        };

        this.getReloadButton = function () {
            return new oButton({
                text: oResources.i18n.getText("sessionExpiredMessage_reloadPage_button_title"),
                press: function () {
                    that.oSessionExpiredDialog.close();
                    location.reload();
                }
            });
        };

        /* ------------------------------------------ User Dialogs controls - end ------------------------------------------ */

        this.attachUserEvents = function () {
            jQuery(document).on("mousedown.sessionTimeout mousemove.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("keyup.sessionTimeout", this.userActivityHandler.bind(this));
            jQuery(document).on("touchstart.sessionTimeout", this.userActivityHandler.bind(this));
            sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded({}, this.userActivityHandler, this);
        };

        this.detachUserEvents = function () {
            jQuery(document).off("mousedown.sessionTimeout mousemove.sessionTimeout");
            jQuery(document).off("keydown.sessionTimeout");
            jQuery(document).off("touchstart.sessionTimeout");
            sap.ushell.Container.getService("AppLifeCycle").detachAppLoaded(this.userActivityHandler, this);
        };

        this.putTimestampInStorage = function (tTimestamp) {
            jQuery.sap.measure.average("SessionTimeoutPutLocalStorage", "Put timestamp in local storage Average", "FLP_SHELL");
            this.oLocalStorage.put("lastActivityTime", tTimestamp);
            jQuery.sap.measure.end("SessionTimeoutPutLocalStorage");
        };

        this.putContinueWorkingVisibilityInStorage = function (bVisible) {
            this.oLocalStorage.put("showContinueWorkingDialog", bVisible);
        };

        this.getContinueWorkingVisibilityFromStorage = function () {
            return this.oLocalStorage.get("showContinueWorkingDialog");
        };

        this.getTimestampFromStorage = function () {
            return this.oLocalStorage.get("lastActivityTime");
        };

        this.userActivityHandler = function (/*oEventData*/) {
            if (this.oUserActivityTimer !== undefined) {
                return;
            }

            this.oUserActivityTimer = setTimeout(function () {
                that.putTimestampInStorage(that._getCurrentDate());
                that.oUserActivityTimer = undefined;
            }, 1000);
        };

        this._getCurrentDate = function () {
            return new Date();
        };

        /**
         * Handle the logout functionality:
         *   1. Detach mouse and keyboard event handlers
         *   2. Clear timeouts
         *   3. Show logout message
         *   4. Perform logout via sap.ushell.Container
         */
        this.logout = function () {
            var oLoading = new LoadingDialog({ text: "" });

            // post the logout event to isolated
            AppLifeCycle.postMessageToIframeApp("sap.ushell.sessionHandler", "logout", {}, true).then(function () {
                that.detachUserEvents();
                clearTimeout(that.oUserActivityTimer);
                clearTimeout(that.remainingTimer);
                clearTimeout(that.notifyServerTimer);
                oLoading.openLoadingScreen();
                oLoading.showAppInfo(oResources.i18n.getText("beforeLogoutMsg"), null);
                sap.ushell.Container.setDirtyFlag(false);
                sap.ushell.Container.defaultLogout();
            });
        };
    };

    return SessionHandler;
}, /* bExport= */ true);