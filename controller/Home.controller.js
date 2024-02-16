sap.ui.define([
	"com/TitagarhTravel_Expence_Management/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, Fragment, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.TitagarhTravel_Expence_Management.controller.Home", {
		onInit: function() {
			// get the router instance
			this.oRouter = this.getOwnerComponent().getRouter();
			
			// get User ID from logged user
			this.getUserIdFromLoggedInUser();

		},
		getUserIdFromLoggedInUser: function(oEvent){
			var that = this;
			var userId = "00001000";
			this.onGlobalUserIdSet(userId);
			this.getEmployeeData();
			/*hello*/
		},
		onGlobalUserIdSet: function(oUserId){
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData();
			
			// create the userId property
			oGlobalData.userId = oGlobalData.userId === undefined ? "" : oGlobalData.userId;
			oGlobalData.userId = oUserId;
			oGlobalModel.setData(oGlobalData);
			
		},
		getEmployeeData: function(){
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var oGlobalData = this.getOwnerComponent().getModel("globalData").getData();
			var oEmpId = new Filter("EMPID", sap.ui.model.FilterOperator.EQ ,oGlobalData.userId);
			var oUrl = "/EMPLOYEE_MASTER_TRAVEL_PERMITSet";
			
			oModel.read(oUrl,{
				filters: [oEmpId],
				urlParameters: {
					"$format": "json"
				},
				success: function(response){
					var oData = response.results;
					console.log(oData);
					
					// set the data to employeeModel
					var oEmployeeModel = that.getOwnerComponent().getModel("employeeData");
					oEmployeeModel.setData(oData);
					
				},
				error: function(error){
					console.log(error);
				}
			});
			
			
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
		onPressNavigate: function (oEvent) {
            var tileText = oEvent.getSource()._oTitle.mProperties.text;
            this.oRouter = this.getOwnerComponent().getRouter();

            switch (tileText) {
                case "Create Trip":
                    this.oRouter.navTo("createtrip");
                    break;
                case "Pending trip for Approval":
                    this.oRouter.navTo("tripForApproval");
                    break;
                case "Already Approved trip":
                    this.oRouter.navTo("alreadyApprovedTrip");
                    break;
                case "Pending trip from finance":
                    this.oRouter.navTo("tripForApprovalToFinance");
                    break;
                case "Rejected Trip":
                    this.oRouter.navTo("rejectedTrip");
                    break;
                case "Already Completed Trip":
                    this.oRouter.navTo("alreadyCompletedTrip");
                    break;
                case "Advance Requests":
                    this.oRouter.navTo("advanceRequests");
                    break;
                case "Escalation from finance":
                    this.oRouter.navTo("escalationFromFinance");
                    break;
                default:
                    break;
            }
        },
		onPressToCreateTrip: function(){
			/*var sEmployeeData = this.getOwnerComponent().getModel("employeeData").getData();*/
		    
		    this.oRouter = this.getOwnerComponent().getRouter();
		    this.oRouter.navTo("createtrip",{
		    	directReload: true
		    });
		    
		    // Construct the URL parameter
			/*var sDataAsUrlParameter = encodeURIComponent(JSON.stringify(sEmployeeData));
		    
		    this.oRouter.navTo("createtrip",{
		    	"oEmployeeData" : sDataAsUrlParameter
		    });*/
		}
	});
});