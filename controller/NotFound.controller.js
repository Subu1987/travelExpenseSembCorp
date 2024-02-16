sap.ui.define([
	"com/TitagarhTravel_Expence_Management/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.TitagarhTravel_Expence_Management.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("home");
		}

	});

});