/*global QUnit*/

sap.ui.define([
	"zgateentry/controller/Gate.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Gate Controller");

	QUnit.test("I should test the Gate controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
