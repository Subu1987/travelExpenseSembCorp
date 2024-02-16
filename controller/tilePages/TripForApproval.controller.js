sap.ui.define([
	"com/TitagarhTravel_Expence_Management/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Input",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function(BaseController, History, JSONModel, MessageToast, Dialog, Button, Input, Fragment, Filter, FilterOperator, Export,
	ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.TitagarhTravel_Expence_Management.controller.tilePages.TripForApproval", {
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			var oModel = this.getOwnerComponent().getModel();

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

			this.oRouter.navTo("createtrip",{
		    	directReload: true
		    });
		},
		onSearch: function(oEvent) {
			var searchTerm = oEvent.getParameter("query").toString();
			var oTable = this.getView().byId("tripListTable");
			var oBinding = oTable.getBinding("items");

			var oFilter = new Filter([
				new Filter("tripNo", FilterOperator.EQ, searchTerm),
				new Filter("travellerName", FilterOperator.Contains, searchTerm),
				new Filter("startDate", FilterOperator.Contains, searchTerm),
				new Filter("endData", FilterOperator.Contains, searchTerm),
				new Filter("from", FilterOperator.Contains, searchTerm),
				new Filter("to", FilterOperator.Contains, searchTerm),
				new Filter("status/0", FilterOperator.Contains, searchTerm)
			], false);

			oBinding.filter(oFilter);
		},
		handleSortButtonPressed: function(oEvent) {
			var buttonValue = oEvent.getParameters().id.split("--")[1];
			var oTable = this.getView().byId("tripListTable");
			var oBinding = oTable.getBinding("items");
			var oSorter;

			if (oBinding.aSorters.length === 0 || oBinding.aSorters[0].sPath !== buttonValue) {
				// If no sorting applied or sorting applied on a different column
				oSorter = new sap.ui.model.Sorter(buttonValue, false); // Sort by tripNo column in descending order
			} else {
				// If sorting already applied on tripNo column
				var bDescending = !oBinding.aSorters[0].bDescending; // Toggle the sorting order
				oSorter = new sap.ui.model.Sorter(buttonValue, bDescending);
			}

			oBinding.sort(oSorter);
		},
		handleFilterButtonPressed: function() {
			this.openFilterDialog();
		},
		openFilterDialog: function() {
			if (!this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.FilterDialog", this);
				this.getView().addDependent(this._oFilterDialog);
			}
			this._oFilterDialog.open();
		},
		handleFilterDialogCancel: function() {
			// Close the filter dialog
			this._oFilterDialog.close();
		},

		handleExportExcelPressed: function(event) {
			var oTable = this.getView().byId("tripListTable");
			var Export = sap.ui.core.util.Export;
			var ExportTypeCSV = sap.ui.core.util.ExportTypeCSV;
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ",",
					charset: "utf-8",
					fileExtension: "csv"
				}),
				models: oTable.getModel(),
				rows: {
					path: "/Pending"
				},
				columns: [{
					name: "Trip Number",
					template: {
						content: "{tripNo}"
					}
				}, {
					name: "Traveller Name",
					template: {
						content: "{travellerName}"
					}
				}, {
					name: "Start Date",
					template: {
						content: "{startDate}"
					}
				}, {
					name: "End Date",
					template: {
						content: "{endData}"
					}
				}, {
					name: "From",
					template: {
						content: "{from}"
					}
				}, {
					name: "To",
					template: {
						content: "{to}"
					}
				}, {
					name: "Status",
					template: {
						content: "{status/0}"
					}
				}]
			});

			oExport.saveFile().catch(function(error) {
				MessageToast.show("Error exporting data: " + error);
			});
		}
	});
});