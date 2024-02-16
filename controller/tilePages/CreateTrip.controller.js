sap.ui.define([
	"com/TitagarhTravel_Expence_Management/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Input",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function(BaseController, History, Dialog, Button, Input, Fragment, MessageBox) {
	"use strict";

	return BaseController.extend("com.TitagarhTravel_Expence_Management.controller.tilePages.CreateTrip", {
		/******************** initial operations **************************/
		onInit: function() {

			this.oRouter = this.getOwnerComponent().getRouter();
			var wizard = this.byId("CreateTripWizard");

			if (wizard) {
				this.oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
			}

			// get the country drop down
			this.getCountryDropDownData();

			// set the default flight IconTabFilter Data
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData();
			oGlobalData.DEPART_RETURN = "Depart";
			oGlobalModel.setData(oGlobalData);
			console.log(oGlobalData);

			// set the default carpool data
			var oCarPoolModel = this.getOwnerComponent().getModel("carPoolData");
			var oCarPoolData = oCarPoolModel.getData();
			oCarPoolData.carPoolValue = "Yes";
			// set the data
			oCarPoolModel.setData(oCarPoolData);

		},
		onRoutePatternMatched: function(oEvent) {

			var oArguments = oEvent.getParameter("arguments").directReload;
			var sEmployeeData = this.getOwnerComponent().getModel("employeeData").getData();
			oArguments = Object.keys(sEmployeeData).length === 0 ? true : false;
			//var oData = JSON.parse(decodeURIComponent(oArguments));

			/*if (oArguments === true) {
				this.onNavBack(oArguments);
			} else {
				var routeName = oEvent.getParameter("name");
				if (routeName === "createtrip") {
					var wizard = this.byId("CreateTripWizard");
					if (wizard) {

						// Reset the wizard to the first step
						wizard.discardProgress(wizard.getSteps()[0]);
					}
				}
			}*/

		},
		getCountryDropDownData: function() {

			var that = this;
			var sModel = this.getOwnerComponent().getModel();
			var sUrl = "/COUNTRY_DROPDOWNSet";

			sModel.read(sUrl, {
				urlParameters: {
					"$format": "json"
				},
				success: function(response) {
					var sData = response.results;
					var oCountryNameData = that.getOwnerComponent().getModel("CountryNameData");
					oCountryNameData.setData(sData);

				},
				error: function(error) {
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
		onNavBack: function(oArguments) {

			if (oArguments !== "false" || !oArguments) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = this.getOwnerComponent().getRouter();
					oRouter.navTo("home", {}, true);
				}
			}

		},

		/********************** Trip info ***************************/

		/********************* trip info *****************/

		onRadioButtonSelectTravel: function(oEvent) {
			var interTravelViewId = this.byId("interTravelView");
			var radioButtonGroup = oEvent.getSource();
			var selectedButtonText = radioButtonGroup.getSelectedButton().getText();

			if (selectedButtonText === "International Travel") {
				interTravelViewId.setVisible(true);
			} else {
				interTravelViewId.setVisible(false);
			}
		},

		onComboBoxChange: function(oEvent) {
			var oTripInfoModel = this.getOwnerComponent().getModel("tripInfo");
			var oTripInfoData = oTripInfoModel.getData();
			var selectedValue = oEvent.getParameters().value;
			var selectedId = oEvent.getParameters().id.split("--")[1];

			if (selectedId === "fromLocation") {
				oTripInfoData.fromLocation = selectedValue;
			} else {
				oTripInfoData.toLocation = selectedValue;
			}

			oTripInfoModel.setData(oTripInfoData);

		},
		editTrip: function(oEvent) {
			var tripRadioBtn = this.byId("tripRadioBtn");
			var tripEdit = this.byId("tripEdit");
			var tripView = this.byId("tripView");
			var travelType = this.byId("travelType").getSelectedButton().getText();
			var tripWay = this.byId("tripWay").getSelectedButton().getText();

			var oTripInfoModel = this.getOwnerComponent().getModel("tripInfo");
			var oTripInfoData = oTripInfoModel.getData();
			oTripInfoData.travelType = travelType;
			oTripInfoData.tripWay = tripWay;

			oTripInfoModel.setData(oTripInfoData);
			tripRadioBtn.setVisible(true);
			tripEdit.setVisible(true);
			tripView.setVisible(false);

			this.toggleButtonSaveAndEdit(true);
		},
		saveTrip: function(oEvent) {

			var tripRadioBtn = this.byId("tripRadioBtn");
			var tripEdit = this.byId("tripEdit");
			var tripView = this.byId("tripView");
			var travelType = this.byId("travelType").getSelectedButton().getText();
			var tripWay = this.byId("tripWay").getSelectedButton().getText();
			var fromTrip = this.byId("fromTrip").getSelectedItem();
			var toTrip = this.byId("toTrip").getSelectedItem();
			var oTripInfoModel = this.getOwnerComponent().getModel("tripInfo");
			var oTripInfoData = oTripInfoModel.getData();

			oTripInfoData.travelType = travelType;
			oTripInfoData.tripWay = tripWay;

			oTripInfoModel.setData(oTripInfoData);
			tripRadioBtn.setVisible(false);
			tripEdit.setVisible(false);
			tripView.setVisible(true);

			this.toggleButtonSaveAndEdit(false);
		},
		toggleButtonSaveAndEdit: function(active) {
			this.byId("editTripInfo").setVisible(!active);
			this.byId("saveTripInfo").setVisible(active);
		},
		/********************* Wizard Steps *****************/

		goFrom2To3: function() {
			var wizard = this.byId("CreateTripWizard");
			var step2 = this.byId("travellerDetails");
			var step3 = this.byId("flightsTrainStep");

			step2.setVisible(false);
			step3.setVisible(true);
			wizard.nextStep();
			/*this._wizard.goToStep(step3);*/
		},

		/*goFrom1To2: function(oEvent) {
			var wizard = this.byId("CreateTripWizard");
			var oNavContainer = this.byId("wizardNavContainer");
			var oWizardContentPage = this.byId("wizardContentPage");
			var wizardStepId = this.byId("tripInformation");

			var currentStep = wizard.getCurrentStep();
			var currentStepIndex = wizard.getSteps().indexOf(currentStep);
			var previousStepIndex = currentStepIndex - 1;

			var wizardStepTitle = wizard.mAssociations.currentStep.split("--")[1];

			if (wizardStepTitle === "tripInformation") {
				// Move to step 2
				wizard.nextStep();
			} else {
				wizard.previousStep();
				if (wizardStepId) {
					wizardStepId.setValidated(false);
				}
			}

		},*/
		/*goFrom2To3: function(oEvent) {
			var that = this;
			var wizard = this.byId("CreateTripWizard");
			var oNavContainer = this.byId("wizardNavContainer");
			var oWizardContentPage = this.byId("wizardContentPage");
			var wizardStepId = this.byId("travellerDetails");

			var wizardStepTitle = wizard.mAssociations.currentStep.split("--")[1];

			if (wizardStepTitle === "travellerDetails") {
				// Move to step 3
				wizard.nextStep();

			} else {
				wizard.previousStep();
				if (wizardStepId) {
					wizardStepId.setValidated(false);
				}
			}
		},*/
		goFrom3To4: function(oEvent) {
			var wizard = this.byId("CreateTripWizard");
			var oNavContainer = this.byId("wizardNavContainer");
			var oWizardContentPage = this.byId("wizardContentPage");

			// Move to step 4
			wizard.nextStep();
		},
		goFrom4To5: function() {
			var wizard = this.byId("CreateTripWizard");
			var oNavContainer = this.byId("wizardNavContainer");
			var oWizardContentPage = this.byId("wizardContentPage");

			// Move to step 5
			wizard.nextStep();
		},
		goFrom5To6: function() {
			var wizard = this.byId("CreateTripWizard");
			/*	var oNavContainer = this.byId("wizardNavContainer");
				var oWizardContentPage = this.byId("wizardContentPage");*/

			// Move to step 6
			wizard.nextStep();
		},
		wizardCompletedHandler: function() {
			var oNavContainer = this.byId("wizardNavContainer");
			oNavContainer.to(this.byId("wizardReviewPage"));
			var onNavBack = this.byId("onNavBack");
			onNavBack.setVisible(false);

			// id's for flight/ train
			var flightReviewPage = this.byId("flightReviewPage");
			var trainReviewPage = this.byId("trainReviewPage");

			// flight visibility if available data
			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oFlightDataMaster = oFlightModelMaster.getData();

			// if oFlightData available make it true or make it false
			if (Object.keys(oFlightDataMaster).length === 0) {
				flightReviewPage.setVisible(false);
			} else {
				flightReviewPage.setVisible(true);
			}

			// train visibility if available data
			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oTrainDataMaster = oTrainModelMaster.getData();

			// if oTrainData available make it true or make it false
			if (Object.keys(oTrainDataMaster).length === 0) {
				trainReviewPage.setVisible(false);
			} else {
				trainReviewPage.setVisible(true);
			}
		},
		backToWizardContent: function() {
			var createTripPage = this.byId("createTripPage");
			var oNavContainer = this.byId("wizardNavContainer");
			var oWizardContentPage = this.byId("wizardContentPage");

			oNavContainer.backToPage(oWizardContentPage.getId());
			var onNavBack = this.byId("onNavBack");
			onNavBack.setVisible(true);

		},
		editStepOne: function() {
			this.handleNavigationToEditStep(0);
		},
		editStepTwo: function() {
			this.handleNavigationToEditStep(1);
		},
		editStepThree: function() {
			this.handleNavigationToEditStep(2);
		},
		editStepFour: function() {
			this.handleNavigationToEditStep(3);
		},
		editStepFive: function() {
			this.handleNavigationToEditStep(4);
		},
		handleNavigationToEditStep: function(iStepNum) {
			var wizard = this.byId("CreateTripWizard");
			var oNavContainer = this.byId("wizardNavContainer");

			var funAfterNavigate = function() {
				wizard.goToStep(wizard.getSteps()[iStepNum]);
				oNavContainer.detachAfterNavigate(funAfterNavigate);
			}.bind(this);
			oNavContainer.attachAfterNavigate(funAfterNavigate);
			this.backToWizardContent();
		},

		/********************** Traveller details ***************************/

		addTraveller: function(oEvent) {
			// fragment Open
			if (!this.oAddTraveller) {
				this.oAddTraveller = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.TravellerTypeDialog", this);
				this.getView().addDependent(this.oAddTraveller);
			}
			this.oAddTraveller.open();

			// traveller type view hide & visible
			this.setTravellerTypeVisible();
		},
		onCancelPress: function() {
			this.oAddTraveller.close();
		},
		setTravellerTypeVisible: function() {
			var radioBtnTraveller = sap.ui.getCore().byId("radioBtnTraveller");
			var emplyId = sap.ui.getCore().byId("emplyId");
			var guestId = sap.ui.getCore().byId("guestId");
			var selectedValue = radioBtnTraveller.getSelectedButton().getText();

			if (selectedValue === "Employee") {
				emplyId.setVisible(true);
				guestId.setVisible(false);
			}
		},
		changeRadioBtn: function(oEvent) {
			var emplyId = sap.ui.getCore().byId("emplyId");
			var guestId = sap.ui.getCore().byId("guestId");
			var btnText = oEvent.getSource().getSelectedButton().getText();

			// based on radio btn clicked view display or off
			if (btnText === "Guest") {
				emplyId.setVisible(false);
				guestId.setVisible(true);
			} else if (btnText === "Employee") {
				emplyId.setVisible(true);
				guestId.setVisible(false);
			}
		},
		/*onExpandCollapse: function(oEvent) {
			var oPanel = oEvent.getSource();
			var oItem = oPanel.getBindingContext().getObject();
			oItem.expanded = oPanel.getExpanded();
			this.getView().getModel().refresh();
		},*/

		addEmpTravel: function() {
			var radioBtnTraveller = sap.ui.getCore().byId("radioBtnTraveller");
			var travellerType = radioBtnTraveller.getSelectedButton().getText();
			var oTravellerDetailsModel = this.getOwnerComponent().getModel("travellerDetails");
			var oEmployeeModel = this.getOwnerComponent().getModel("employeeData");
			var oEmployeeData = oEmployeeModel.getData();
			var oTravellerDetailsData = oTravellerDetailsModel.getData();

			// create a new Traveller object 
			var newTraveller = {
				EMP_ID: oEmployeeData[0].EMPID,
				EMP_NAME: oEmployeeData[0].EMP_NAME,
				TRVLR_TYPE: travellerType,
				PHONE: oEmployeeData[0].EMP_MOBILE2,
				GENDER: oEmployeeData[0].GENDER === "M" ? "Male" : "Female",
				EMAIL: oEmployeeData[0].EMP_MAIL.toLowerCase()
					/*travellerMobile2: oEmployeeData[0].EMP_MOBILE2*/
			};

			// get Existing array of traveller or initilize it if it doesnt exist
			var existingTravellers = Object.keys(oTravellerDetailsData).length !== 0 ? oTravellerDetailsData.travellers : [];

			// push the newTraveller object into the array 
			existingTravellers.push(newTraveller);

			// update the travellerDetails model with the modified data

			oTravellerDetailsModel.setData({
				travellers: existingTravellers
			});

			// close the button
			this.oAddTraveller.close();

		},
		addGuestTravel: function() {
			var radioBtnTraveller = sap.ui.getCore().byId("radioBtnTraveller");
			var travellerType = radioBtnTraveller.getSelectedButton().getText();
			var oTravellerDetailsModel = this.getOwnerComponent().getModel("travellerDetails");
			var oEmployeeModel = this.getOwnerComponent().getModel("employeeData");
			var oEmployeeData = oEmployeeModel.getData();
			var oTravellerDetailsData = oTravellerDetailsModel.getData();
			var oGuestModel = this.getOwnerComponent().getModel("guestData");
			var oGuestData = oGuestModel.getData();

			// create a new guest object 
			var newTraveller = {
				EMP_NAME: oGuestData.firstName + " " + oGuestData.lastName,
				TRVLR_TYPE: travellerType,
				EMP_ID: oEmployeeData[0].EMPID,
				PHONE: oGuestData.PHONE,
				EMAIL: oGuestData.EMAIL,
				GENDER: oGuestData.GENDER,
				AGE: oGuestData.AGE
			};

			// get Existing array of traveller or initilize it if it doesnt exist
			var existingTravellers = Object.keys(oTravellerDetailsData).length !== 0 ? oTravellerDetailsData.travellers : [];

			// push the newTraveller object into the array 
			existingTravellers.push(newTraveller);
			// update the travellerDetails model with the modified data
			oTravellerDetailsModel.setData({
				travellers: existingTravellers
			});

			// get Existing array of Guest traveller or initilize it if it doesnt exist
			var guestExistingTravellers = !oGuestData.guestTravellers ? [] : oGuestData.guestTravellers;

			guestExistingTravellers.push(newTraveller);
			oGuestModel.setData({
				guestTravellers: guestExistingTravellers
			});

			// close the button
			this.oAddTraveller.close();
		},
		onDeleteTask: function(oEvent) {
			// Get the binding context of the selected list item
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var iIndex = sPath.substr(sPath.lastIndexOf("/") + 1);

			var oTravellerDetailsModel = this.getOwnerComponent().getModel("travellerDetails");
			var oTravellerDetailsData = oTravellerDetailsModel.getData();
			oTravellerDetailsData.travellers.splice(iIndex, 1);
			oTravellerDetailsModel.setData(oTravellerDetailsData);
		},

		/********************** Flights/Train ***************************/

		/********* Flights logic ************/

		changeRadioBtnFlightTrain: function(oEvent) {
			/*var radioBtnFlightTrain = this.byId("radioBtnFlightTrain");*/
			var flightsView = this.byId("flightsView");
			var trainsView = this.byId("trainsView");
			var BtnText = oEvent.getSource().getSelectedButton().getText();

			// based on radio btn clicked view display or off
			if (BtnText === "Train Booking") {
				trainsView.setVisible(true);
				flightsView.setVisible(false);
			} else if (BtnText === "Flight Booking") {
				trainsView.setVisible(false);
				flightsView.setVisible(true);
			}

		},
		addFlights: function() {

			// fragment Open
			if (!this.oAddFlights) {
				this.oAddFlights = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.AddFlightsDialog", this);
				this.getView().addDependent(this.oAddFlights);
			}
			this.oAddFlights.open();
			/*var perPerson = sap.ui.getCore().byId("passengerInput").getValue();
			perPerson = (perPerson === 0) ? 1 : perPerson;*/
			/*sap.ui.getCore().byId("passengerInput").setValue("1");*/
		},
		onCancelFlights: function() {
			this.oAddFlights.close();
		},
		/*onPassengerChange: function(oEvent) {
			var persons = oEvent.getParameters().value;                         
			var price = sap.ui.getCore().byId("priceRound").getValue();

		},*/
		onTabSelectFlight: function(oEvent) {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData();
			var sSelectedKey = oEvent.getParameters().key; // Get the key of the selected tab
			oGlobalData.DEPART_RETURN = sSelectedKey;
			oGlobalModel.setData(oGlobalData);
		},
		saveFlights: function() {
			/*var DEPART_RETURN = "";
			var Depart = sap.ui.getCore().byId("Depart").getId().charAt(0);
			var Return = sap.ui.getCore().byId("Return").getId().charAt(0);*/
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData().DEPART_RETURN.charAt(0);

			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oFlightDataMaster = oFlightModelMaster.getData();
			var oFlightModel = this.getOwnerComponent().getModel("flightData");
			var oFlightModelReturn = this.getOwnerComponent().getModel("flightDataReturn");
			var oFlightData = oFlightModel.getData();
			var oFlightDataReturn = oFlightModelReturn.getData();
			
			var existingFlights = !oFlightDataMaster.flights ? [] : oFlightDataMaster.flights;
			
			var newFlights = {
				AIRLINE_NAME: oFlightData.AIRLINE_NAME,
				CABIN_CLASS: oFlightData.CABIN_CLASS,
				DEPT_DATE: oFlightData.DEPT_DATE,
				RETURN_DATE: oFlightData.RETURN_DATE,
				DEPART_FROM: oFlightData.DEPART_FROM,
				ARRIVE_AT: oFlightData.ARRIVE_AT,
				PERSONS: oFlightData.PERSONS.toString(),
				STOPS: oFlightData.STOPS,
				TICKET_NO: oFlightData.TICKET_NO,
				PRICE: (oFlightData.PRICE * oFlightData.PERSONS).toString(),
				DEPART_RETURN: "D"
			};

			if (oGlobalData === "R") {
				var newReturnFlights = {
					AIRLINE_NAME: oFlightDataReturn.AIRLINE_NAME,
					CABIN_CLASS: oFlightDataReturn.CABIN_CLASS,
					DEPT_DATE: oFlightDataReturn.DEPT_DATE,
					RETURN_DATE: oFlightDataReturn.RETURN_DATE,
					DEPART_FROM: oFlightDataReturn.DEPART_FROM,
					ARRIVE_AT: oFlightDataReturn.ARRIVE_AT,
					PERSONS: oFlightDataReturn.PERSONS.toString(),
					STOPS: oFlightDataReturn.STOPS,
					TICKET_NO: oFlightDataReturn.TICKET_NO,
					PRICE: (oFlightDataReturn.PRICE * oFlightDataReturn.PERSONS).toString(),
					DEPART_RETURN: "R"
				};

				existingFlights.push(newReturnFlights);
			}

			existingFlights.push(newFlights);

			// Update the flights model with modified data
			oFlightModelMaster.setData({
				flights: existingFlights
			});
			
			// clear the data
			oFlightModel.setData({});
			oFlightModelReturn.setData({});
			this.onCancelFlights();
		},
		onDeleteFlight: function(oEvent) {
			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("flightDataMaster");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
				var oFlightDataMaster = oFlightModelMaster.getProperty("/flights");
				oFlightDataMaster.splice(iIndex, 1);

				oFlightModelMaster.setProperty("/flights", oFlightDataMaster);
			}
		},
		onEditFlight: function(oEvent) {
			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oFlightDataMaster = oFlightModelMaster.getProperty("/flights");

			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("flightDataMaster");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				// fragment Open
				if (!this.oEditFlightDialog) {
					this.oEditFlightDialog = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.EditFlightsDialog", this);
					this.getView().addDependent(this.oEditFlightDialog);
				}

				// Set the flight data for the selected index as a property of the dialog
				oFlightModelMaster.setProperty("/updateFlightData", oFlightDataMaster[iIndex]);
				oFlightModelMaster.setProperty("/flightIndex", iIndex);
				this.oEditFlightDialog.open();
			}
		},
		onCancelEditFlight: function() {
			this.oEditFlightDialog.close();
		},
		updateFlights: function(oEvent) {
			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oUpdatedFlightData = oFlightModelMaster.getProperty("/updateFlightData");
			var iIndex = oFlightModelMaster.getProperty("/flightIndex");

			var oFlightDataMaster = oFlightModelMaster.getProperty("/flights");
			oFlightDataMaster[iIndex] = oUpdatedFlightData;
			oFlightModelMaster.setProperty("/flights", oFlightDataMaster);

			// close dialog
			this.oEditFlightDialog.close();

		},
		/********* Trains logic ************/

		addTrains: function(oEvent) {
			// fragment Open
			if (!this.oAddTrains) {
				this.oAddTrains = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.AddTrainsDialog", this);
				this.getView().addDependent(this.oAddTrains);
			}
			this.oAddTrains.open();
			/*sap.ui.getCore().byId("passengerInputTrain").setValue("1");*/
		},
		onCancleTrains: function(oEvent) {
			this.oAddTrains.close();
		},
		onTabSelectTrain: function(oEvent) {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData();
			var sSelectedKey = oEvent.getParameters().key; // Get the key of the selected tab
			oGlobalData.DEPART_RETURN = sSelectedKey;
			oGlobalModel.setData(oGlobalData);
		},
		saveTrains: function(oEvent) {
			var oGlobalModel = this.getOwnerComponent().getModel("globalData");
			var oGlobalData = oGlobalModel.getData().DEPART_RETURN.charAt(0);
			
			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oTrainDataMaster = oTrainModelMaster.getData();
			var oTrainModel = this.getOwnerComponent().getModel("trainData");
			var oTrainModelReturn = this.getOwnerComponent().getModel("trainDataReturn");
			var oTrainData = oTrainModel.getData();
			var oTrainDataReturn = oTrainModelReturn.getData();
			
			var existingTrains = !oTrainDataMaster.trains ? [] : oTrainDataMaster.trains;

			// create a new train object
			var newTrains = {
				BOARD: oTrainData.BOARD,
				DESTINATION: oTrainData.DESTINATION,
				DEPT_DATE: oTrainData.DEPT_DATE,
				RETURN_DATE: oTrainData.RETURN_DATE,
				TICKET_NO: oTrainData.TICKET_NO,
				PRICE: (oTrainData.PRICE * oTrainData.PERSONS).toString(),
				CLASS: oTrainData.CLASS,
				PERSONS: oTrainData.PERSONS.toString(),
				TRAIN_NAME: oTrainData.TRAIN_NAME,
				QUOTA: oTrainData.QUOTA,
				PNR_NO: oTrainData.PNR_NO,
				DEPART_RETURN: "D"
			};
			
			if(oGlobalData === "R"){
				
				var newReturnTrains = {
					BOARD: oTrainDataReturn.BOARD,
					DESTINATION: oTrainDataReturn.DESTINATION,
					DEPT_DATE: oTrainDataReturn.DEPT_DATE,
					RETURN_DATE: oTrainDataReturn.RETURN_DATE,
					TICKET_NO: oTrainDataReturn.TICKET_NO,
					PRICE: (oTrainDataReturn.PRICE * oTrainDataReturn.PERSONS).toString(),
					CLASS: oTrainDataReturn.CLASS,
					PERSONS: oTrainDataReturn.PERSONS.toString(),
					TRAIN_NAME: oTrainDataReturn.TRAIN_NAME,
					QUOTA: oTrainDataReturn.QUOTA,
					PNR_NO: oTrainDataReturn.PNR_NO,
					DEPART_RETURN: "R"
				};
				existingTrains.push(newReturnTrains);
			}

			existingTrains.push(newTrains);

			// Update the trains model with modified data
			oTrainModelMaster.setData({
				trains: existingTrains
			});
			
			// clear the data
			oTrainModel.setData({});
			oTrainModelReturn.setData({});
			// close the dialog
			this.onCancleTrains();

		},
		onDeleteTrain: function(oEvent) {
			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("trainDataMaster");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
				var oTrainDataMaster = oTrainModelMaster.getProperty("/trains");
				oTrainDataMaster.splice(iIndex, 1);

				oTrainModelMaster.setProperty("/trains", oTrainDataMaster);
			}

		},
		onEditTrain: function(oEvent) {
			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oTrainDataMaster = oTrainModelMaster.getProperty("/trains");

			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("trainDataMaster");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				// fragment Open
				if (!this.oEditTrainDialog) {
					this.oEditTrainDialog = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.EditTrainsDialog", this);
					this.getView().addDependent(this.oEditTrainDialog);
				}

				// Set the flight data for the selected index as a property of the dialog
				oTrainModelMaster.setProperty("/updateTrainData", oTrainDataMaster[iIndex]);
				oTrainModelMaster.setProperty("/trainIndex", iIndex);
				this.oEditTrainDialog.open();
			}

		},
		onCancelEditTrain: function() {
			this.oEditTrainDialog.close();
		},
		updateTrain: function() {
			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oUpdatedTrainData = oTrainModelMaster.getProperty("/updateTrainData");
			var iIndex = oTrainModelMaster.getProperty("/trainIndex");

			var oTrainDataMaster = oTrainModelMaster.getProperty("/trains");
			oTrainDataMaster[iIndex] = oUpdatedTrainData;
			oTrainModelMaster.setProperty("/trains", oTrainDataMaster);

			// close dialog
			this.oEditTrainDialog.close();
		},

		/********************** Accomadation  ***************************/

		addHotels: function(oEvent) {
			// fragment Open
			if (!this.oAddHotels) {
				this.oAddHotels = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.AddHotelsDialog", this);
				this.getView().addDependent(this.oAddHotels);
			}
			this.oAddHotels.open();
			/*sap.ui.getCore().byId("passengerInputHotel").setValue("1");*/

		},
		onCancleHotels: function(oEvent) {
			this.oAddHotels.close();
		},
		saveHotels: function(oEvent) {
			var oHotelModel = this.getOwnerComponent().getModel("hotelData");
			var oHotelData = oHotelModel.getData();

			// create a new train object
			var newHotels = {
				LOCATION: oHotelData.LOCATION,
				NAME: oHotelData.NAME,
				CHECK_IN: oHotelData.CHECK_IN,
				CHECK_OUT: oHotelData.CHECK_OUT,
				NO_OF_ROOMS: oHotelData.NO_OF_ROOMS,
				PRICE: (oHotelData.PRICE * oHotelData.PERSONS).toString(),
				HOTEL_CLASS: oHotelData.HOTEL_CLASS,
				PERSONS: oHotelData.PERSONS.toString()
			};

			var existingHotels = !oHotelData.hotels ? [] : oHotelData.hotels;

			existingHotels.push(newHotels);

			// Update the hotels model with modified data
			oHotelModel.setData({
				hotels: existingHotels
			});

			// close the dialog
			this.onCancleHotels();
		},
		onDeleteHotel: function(oEvent) {
			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("hotelData");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				var oHotelModel = this.getOwnerComponent().getModel("hotelData");
				var oHotelData = oHotelModel.getProperty("/hotels");
				oHotelData.splice(iIndex, 1);

				oHotelModel.setProperty("/hotels", oHotelData);
			}

		},
		onEditHotel: function(oEvent) {
			var oHotelModel = this.getOwnerComponent().getModel("hotelData");
			var oHotelData = oHotelModel.getProperty("/hotels");

			var listItem = oEvent.getSource().getParent().getParent();
			var bindingContext = listItem.getBindingContext("hotelData");

			if (bindingContext) {
				var iIndex = bindingContext.getPath().split("/")[2];

				// fragment Open
				if (!this.oEditHotelDialog) {
					this.oEditHotelDialog = sap.ui.xmlfragment("com.TitagarhTravel_Expence_Management.view.fragments.EditHotelsDialog", this);
					this.getView().addDependent(this.oEditHotelDialog);
				}

				// Set the flight data for the selected index as a property of the dialog
				oHotelModel.setProperty("/updateHotelData", oHotelData[iIndex]);
				oHotelModel.setProperty("/hotelIndex", iIndex);
				this.oEditHotelDialog.open();
			}
		},
		onCancelEditHotel: function() {
			this.oEditHotelDialog.close();
		},
		updateHotel: function() {
			var oHotelModel = this.getOwnerComponent().getModel("hotelData");
			var oUpdatedHotelData = oHotelModel.getProperty("/updateHotelData");
			var iIndex = oHotelModel.getProperty("/hotelIndex");

			var oHotelData = oHotelModel.getProperty("/hotels");
			oHotelData[iIndex] = oUpdatedHotelData;
			oHotelModel.setProperty("/hotels", oHotelData);

			// close dialog
			this.oEditHotelDialog.close();
		},

		/********************** Car pool  ***************************/

		changeRadioBtnCarpool: function(oEvent) {
			var oCarPoolModel = this.getOwnerComponent().getModel("carPoolData");
			var oCarPoolData = oCarPoolModel.getData();
			var radioBtxText = oEvent.getSource().getSelectedButton().getText();

			if (radioBtxText === "Yes") {
				oCarPoolData.carPoolValue = radioBtxText;
			} else {
				oCarPoolData.carPoolValue = radioBtxText;
			}

			// set the data
			oCarPoolModel.setData(oCarPoolData);

		},
		/********************** Final Submit  ***************************/

		sendForApproval: function(oEvent) {

			// get the current date
			var currentDate = new Date();
			var year = currentDate.getFullYear();
			var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
			var day = currentDate.getDate().toString().padStart(2, '0');
			var currentDateString = day + month + year;

			var oEmployeeModel = this.getOwnerComponent().getModel("employeeData");
			var oEmployeeData = oEmployeeModel.getData();

			var oTripInfoModel = this.getOwnerComponent().getModel("tripInfo");
			var oTripInfoData = oTripInfoModel.getData();

			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oFlightDataMaster = oFlightModelMaster.getData();

			if (Object.keys(oFlightDataMaster).length > 0) {
				oFlightDataMaster.flights.forEach(function(element) {
					element.TRAVEL_ID = "TRID000100";
					element.TRIP_ID = "TRIP_ID";
					element.EMP_ID = oEmployeeData[0].EMPID;
					element.EMP_NAME = oEmployeeData[0].EMP_NAME;
					element.TRVLR_TYPE = "E";
					element.BOOKING_DATE = currentDateString;
				});
			}

			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oTrainDataMaster = oTrainModelMaster.getData();

			if (Object.keys(oTrainDataMaster).length > 0) {
				oTrainDataMaster.trains.forEach(function(element) {
					element.TRAVEL_ID = "TRID000100";
					element.TRIP_ID = "TRIP_ID";
					element.EMP_ID = oEmployeeData[0].EMPID;
					element.EMP_NAME = oEmployeeData[0].EMP_NAME;
					element.TRVLR_TYPE = "E";
					element.BOOKING_DATE = currentDateString;
				});
			}

			var oHotelModel = this.getOwnerComponent().getModel("hotelData");
			var oHotelData = oHotelModel.getData();

			if (Object.keys(oHotelData).length > 0) {
				oHotelData.hotels.forEach(function(element) {
					element.TRAVEL_ID = "TRID000100";
					element.TRIP_ID = "TRIP_ID";
					element.EMP_ID = oEmployeeData[0].EMPID;
					element.TRVLR_TYPE = "E";
					element.BOOKING_DATE = currentDateString;
				});
			}

			var oCarPoolModel = this.getOwnerComponent().getModel("carPoolData");
			var oCarPoolData = oCarPoolModel.getData();

			var oTravellerDetailsModel = this.getOwnerComponent().getModel("travellerDetails");
			var oTravellerDetailsData = oTravellerDetailsModel.getData();

			//  "travellerDetails" model is loaded and contains valid data
			if (oTravellerDetailsData && oTravellerDetailsData.travellers) {
				// Filter travelers of type "Employee"
				var specificTravellerData = oTravellerDetailsData.travellers.filter(function(item) {
					delete item.GENDER;
					return item.TRVLR_TYPE === "Employee" || item.TRVLR_TYPE === "E";
				});
				// console.log(specificTravellerData); 

				specificTravellerData.forEach(function(element) {
					element.TRAVEL_ID = "TRID000100";
					element.TRIP_ID = "TRIP_ID";
					element.TRVLR_TYPE = "E";
					element.BOOKING_DATE = currentDateString;
					element.BEGDA = "20230101";
					element.ENDDA = "99991231";
					element.COST_CENTER = "COSTCENTER";
					element.EMP_GRADE = oEmployeeData[0].GRADE;
					element.DESIGNATION = oEmployeeData[0].DESIGNATION;
					element.TRAVEL_TYPE = oEmployeeData[0].TRAVEL_TYPE;
					element.TRIP_TYPE = oTripInfoData.tripWay === "One Way" ? "O" : "R";
					element.FROM_LOCATION = oTripInfoData.fromLocation;
					element.TO_LOCATION = oTripInfoData.toLocation;
					element.PURPOSE = oTripInfoData.purpose;
					element.TRIP_FOR = oTripInfoData.tripFor;
					element.TRAVEL_DETAIL = oTripInfoData.travelDetails;
					element.ADD_FLIGHT = Object.keys(oFlightDataMaster).length > 0 ? oFlightDataMaster.flights.length.toString() : "0";
					element.ADD_TRAIN = Object.keys(oTrainDataMaster).length > 0 ? oTrainDataMaster.trains.length.toString() : "0";
					element.ADD_HOTEL = Object.keys(oHotelData).length > 0 ? oHotelData.hotels.length.toString() : "0";
					element.ADD_POOL = Object.keys(oCarPoolData).length.toString();
				});

				// Check if any "Employee" travelers are found
				/*if (specificTravellerData.length > 0) {
					
				} else {
					console.log("No travelers of type 'Employee' found.");
				}*/
			} else {
				console.log("Error: 'travellerDetails' model not loaded or contains invalid data.");
			}

			var oGuestModel = this.getOwnerComponent().getModel("guestData");
			var oGuestData = oGuestModel.getData();

			if (Object.keys(oGuestData).length > 0) {
				oGuestData.guestTravellers.forEach(function(element) {
					element.TRAVEL_ID = "TRID000100";
					element.TRIP_ID = "TRIP_ID";
					element.BOOKING_DATE = currentDateString;
					element.COST_CENTER = "COST_CENTER";
					element.ORG_NAME = "InFocus pvt ltd.";
					element.ADD_TRVLR = "00000010";
					element.GENDER = element.GENDER === "Male" ? "M" : "F";
					element.TRVLR_TYPE = element.TRVLR_TYPE === "Guest" ? "G" : " ";
				});
			}

			var approvalOdata = {
				"TRAVEL_ID": "TRID000100",
				"EMP_ID": oEmployeeData[0].EMPID,
				"TRVLR_TYPE": specificTravellerData[0].TRVLR_TYPE,
				"BOOKING_DATE": currentDateString,
				"EMP_NAME": oEmployeeData[0].EMP_NAME,
				"TRIP_TYPE": oTripInfoData.tripWay === "One Way" ? "O" : "R",
				"TRAVELIDTOHOTELDETAILSNAV": Object.keys(oHotelData).length > 0 ? oHotelData.hotels : "",
				"TRAVELIDTOTRAINDETAILSNAV": Object.keys(oTrainDataMaster).length > 0 ? oTrainDataMaster.trains : "",
				"TRAVELIDTOFLIGHTDETAILSNAV": Object.keys(oFlightDataMaster).length > 0 ? oFlightDataMaster.flights : "",
				"TRAVELIDTOGUESTDETAILSNAV": Object.keys(oGuestData).length > 0 ? oGuestData.guestTravellers : "",
				"TRAVELIDTOTRAVELDETAILSNAV": specificTravellerData

			};

			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			var oUrl = "/TRAVELID_MASTERSet";
			
			sap.ui.core.BusyIndicator.show();
    
			oModel.create(oUrl, approvalOdata, {
				success: function(response) {
					// Hide the busy indicator upon success
            		sap.ui.core.BusyIndicator.hide();
            		
					sap.m.MessageBox.success("The response is sent for Approval", {
						onClose: function(){
							that.onAfterSendForApproval();
						}.bind(this)
					});
				},
				error: function(error) {
					// Hide the busy indicator upon success
            		sap.ui.core.BusyIndicator.hide();
            		
					var errorObject = JSON.parse(error.responseText);
					sap.m.MessageBox.error(errorObject.error.message.value);
				}
			});

		},
		onAfterSendForApproval: function() {
			var oTripInfoModel = this.getOwnerComponent().getModel("tripInfo");
			var oFlightModelMaster = this.getOwnerComponent().getModel("flightDataMaster");
			var oTrainModelMaster = this.getOwnerComponent().getModel("trainDataMaster");
			var oHotelModel = this.getOwnerComponent().getModel("hotelData");
			var oCarPoolModel = this.getOwnerComponent().getModel("carPoolData");
			var oTravellerDetailsModel = this.getOwnerComponent().getModel("travellerDetails");
			var oGuestModel = this.getOwnerComponent().getModel("guestData");

			// clear the main data 
			oTripInfoModel.setData({});
			oFlightModelMaster.setData({
				flights: []
			});
			oTrainModelMaster.setData({
				trains: []
			});
			oHotelModel.setData({
				hotels: []
			});
			oCarPoolModel.setData({});
			oTravellerDetailsModel.setData({
				travellers: []
			});
			oGuestModel.setData({
				guestTravellers: []
			});

			// Navigate to the home page
			this.oRouter = this.getOwnerComponent().getRouter();
			this.backToWizardContent();
			this.oRouter.navTo("home");

		}
	});
});