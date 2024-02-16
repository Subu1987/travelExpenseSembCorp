sap.ui.define([
	"com/TitagarhTravel_Expence_Management/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Input",
	"sap/ui/core/Fragment"
], function(BaseController, History, Dialog, Button, Input, Fragment) {
	"use strict";

	return BaseController.extend("com.TitagarhTravel_Expence_Management.controller.tilePages.AlreadyCompletedTrip", {
		onInit: function() {
		    this.oRouter = this.getOwnerComponent().getRouter();	

		},
		onProfilePopUp: function(oEvent) {
			if (!this._oPopover) {
				var oController = this; // Store the controller reference

				// Load the XML fragment directly using sap.ui.xmlfragment
				var oPopover = sap.ui.xmlfragment(this.getView().getId(), "com.TitagarhTravel_Expence_Management.view.fragments.ProfilePopUp",
					this);

				oController._oPopover = oPopover; // Use the stored controller reference
				oController.getView().addDependent(oController._oPopover);
				oController._oPopover.openBy(oEvent.getSource());
			} else {
				this._oPopover.openBy(oEvent.getSource());
			}
		},
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("home", {}, true);
			}
		},
		onPressToCreateTrip: function() {
			this.oRouter = this.getOwnerComponent().getRouter();

			this.oRouter.navTo("createtrip", {
                directReload: true
            });
		}
	});
});