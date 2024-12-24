sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/type/String",
    "sap/m/Token",
    "sap/ui/table/Column",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, ODataModel, Filter, FilterOperator, MessageBox, Fragment, TypeString, Token, UIColumn, DateFormat) {
        "use strict";

        return Controller.extend("zgateentry.controller.GateEntryDetails", {
            onInit: function () {
                var oModel = new JSONModel({
                    dDefaultDate: new Date()
                });
                this.getView().setModel(oModel, "view");

                UIComponent.getRouterFor(this).getRoute('GateEntryDetails').attachPatternMatched(this._onRouteMatch, this);

                this.getView().setModel(new JSONModel(), "oWeightModel")

                var oView = this.getView();
                var oMultiInput2 = oView.byId("idDel1");
                oMultiInput2.addValidator(function (args) {
                    var oToken = new Token({ key: args.text, text: args.text });
                    args.asyncCallback(oToken);
                    return MultiInput.WaitForAsyncValidation;
                });

            },
            _onRouteMatch: function (oEvent) {
                this.getView().byId('idDel1').removeAllTokens();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                if(oCommonModel === undefined){
                    // var oRouter = this.getOwnerComponent().getRouter();
                    // oRouter.navTo("Gate", {}, true);
                    window.history.go(-1);
                }else{
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
                var sAction = oCommonModel.getProperty('/displayObject').Action;
                }
                this.getView().setModel(new JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                var getOutFlag = false;
                var getInFlag = false;

                var Grossvalue = this.getView().byId("idGross").getValue();
                var Tarevalue = this.getView().byId("idTare").getValue();

                var emptyValue = "";

                if (Grossvalue != "") {
                    this.getView().getModel("oWeightModel").setProperty("/GrossWt", emptyValue)
                }

                if (Tarevalue != "") {
                    this.getView().getModel("oWeightModel").setProperty("/TareWt", emptyValue)
                }

                //gate entry type
                // var type = "";
                // if (gateinout === "Out") {
                //     type = "RGPO"
                // } else if (gateinout === "In") {
                //     type = "RGPI"
                // } else if (gateType === '1') {
                //     type = "DEL"
                // } else if (gateType === '2') {
                //     type = "RDEL"
                // } else if (gateType === '4') {
                //     type = "NRGP"
                // } else if (gateType === '5') {
                //     type = "WPO"
                // } else if (gateType === '6') {
                //     type = "WPO"
                // }

                var oDelnum = this.getView().byId("idDel1").getValue();
                if (oDelnum.length > 0) {
                    this.getView().byId("idDel1").setValue("");
                }

                if ((gateinout === 'Out' && (sAction === "Create")) && (gateType === '3') || (gateinout === 'Out' && (sAction === "Create")) && (gateType === '12') || (gateinout === 'Out' && gateType === '3' && sAction === "Change") || (gateinout === 'Out' && gateType === '12' && sAction === "Change") || (gateType === '4' && sAction === "Create") || (gateType === '6') || (gateType === '1' && sAction === "Gate Out") || (gateType === '5' && sAction === "Change")) {
                    getOutFlag = true;
                }

                if (sAction === "Display") {
                    getOutFlag = false;
                }

                if ((gateinout === 'In' && (sAction === "Create") && (gateType === '3')) || (gateinout === 'In' && (sAction === "Create") && (gateType === '12')) || (sAction === "Create" && gateType === '6') || (gateinout === 'In' && gateType === '3' && sAction === "Change") || (sAction === 'Create' && (gateType !== '3')) || (gateinout === 'In' && gateType === '12' && sAction === "Change") || (sAction === 'Create' && (gateType !== '12'))) {
                    getInFlag = true;
                }

                if (gateType === '4' || gateType === '6' && sAction === "Create") {
                    getInFlag = false;
                }


                var oSettingObject = {
                    "editable": true,
                    "gateEntryNumEdit": true,
                    "deliveryNumVisible": true,
                    "SaveBtnVisible": true,
                    "RefGateEditable": true,
                    "gateInEditable": true,
                    "visible": true,
                    "labelForType": "Delivery No",
                    "gateInFlag": getInFlag,
                    "gateOutFlag": getOutFlag,
                    "isRowItemEmpty": false,
                    "gateDoneEditable": false,
                    "gateQtyEditable": false,
                    "buttonVisible": true,
                    "cancelVisible": true,
                    "checkValue": false,
                    "validPO": true,
                    "weighslipvisible": true,
                    "invoiceDateEditable": false,
                };
                this.getView().setModel(new JSONModel(oSettingObject), "oGenericModel");

                if (gateinout === 'Out' && (sAction === 'Create')) {
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                }
                if (gateType === '3' && gateinout === 'Out' && sAction === 'Create' || sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", false);
                }
                if (gateType === '3' && gateinout === 'Out' && sAction === 'Create') {
                    // this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    this.getView().byId("idGateInTime").setValue(null);
                    this.getView().byId("picker0").setValue(null);
                }
                if (gateType === '3' && gateinout === 'In' && sAction === 'Create') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                }
                if (gateType === '3' && gateinout === 'In' && sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", false);
                }
                if (gateType === '12' && gateinout === 'Out' && sAction === 'Create' || sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", false);
                }
                if (gateType === '12' && gateinout === 'Out' && sAction === 'Create') {
                    // this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    this.getView().byId("idGateInTime").setValue(null);
                    this.getView().byId("picker0").setValue(null);
                }
                if (gateType === '12' && gateinout === 'In' && sAction === 'Create') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                }
                if (gateType === '12' && gateinout === 'In' && sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/editableField", false);
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/gateDoneEditable", false);
                }
                if (gateType === '4' && sAction === 'Change') {
                    this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                    this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);
                }


                if (oCommonModel.getProperty('/displayObject').Action === "Create") {
                    // this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gateType === '1' || gateType === '2' || gateType === '9') {
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    }
                    this.getView().getModel("oGenericModel").setProperty("/cancelVisible", false);
                    this.onReadNumberRange();

                    var outProperty = false;
                    var inProperty = false;
                    if ((gateType === '3' && sAction === "Create" && gateinout === "Out") || (gateType === '4' && sAction === "Create")) {
                        outProperty = true;
                    } else if (gateType === '3' && sAction === "Create" && gateinout === "In") {
                        inProperty = true
                    } else {
                        outProperty = false;
                        inProperty = false;
                    }
                    if ((gateType === '12' && sAction === "Create" && gateinout === "Out")) {
                        outProperty = true;
                    } else if (gateType === '12' && sAction === "Create" && gateinout === "In") {
                        inProperty = true
                    } else {
                        outProperty = false;
                        inProperty = false;
                    }

                    var oDate = new Date();


                    var oPayloadObject = {
                        "Gateno": "",
                        "Entrydate": oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate(),
                        "GateInDate": outProperty ? "" : (oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()),
                        "VehicalNo": "",
                        "Operator": "",
                        // "GateInDt": oDate.getDate() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getFullYear(),
                        "GateInTm": outProperty ? "" : oDate.toLocaleTimeString().slice(0, 7),
                        "LrDate": "",
                        // oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()
                        "LrNo": "",
                        "Remark": "",
                        "RefGate": null,
                        "Plant": oCommonModel.getProperty('/plantObject').Plant,
                        //"Approved": "",
                        "Puchgrp": "",
                        "Name1": "Road",
                        "Driver": "",
                        "DrLisc": "",
                        "GateOutDt": inProperty ? "" : (oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()),
                        "GateOutTm": inProperty ? "" : oDate.toLocaleTimeString().slice(0, 7),
                        "Driverno": "",
                        "GrossWt": "",
                        "TareWt": "",
                        "NetWt": "",
                        "TrOper": "",
                        "Cancelled": "",
                        "Invoice": "",
                        "Invdt": oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate(),
                        "EntryType": oCommonModel.getProperty('/typeobject').Domain,
                        "Container": "",
                        "WtBrNo": "",
                        "sleepno": "",
                        "to_gateitem": {
                            results: []
                        }
                    };
                    this.getView().setModel(new JSONModel(oPayloadObject), "oGateEntryHeadModel");
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);
                }



                if (oCommonModel.getProperty('/displayObject').Action === "Display" && (gateType === '1' || gateType === '2' || gateType === '9')) {
                    this.onreadGateData();
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "Delivery No");
                    this.getView().getModel("oGenericModel").setProperty("/editable", false);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", false);
                } else if (oCommonModel.getProperty('/displayObject').Action === "Display" && (gateType === '3' || gateType === '4' || gateType === '5' || gateType === '6' || gateType === '12')) {

                    this.onreadGateData();
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                    this.getView().getModel("oGenericModel").setProperty("/editable", false);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                } else if ((oCommonModel.getProperty('/displayObject').Action === "Create" || oCommonModel.getProperty('/displayObject').Action === "Change" || oCommonModel.getProperty('/displayObject').Action === "Display") && (gateType === '1' || gateType === '2' || gateType === '9')) {
                    if (gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "Invoice");
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '2') {
                        this.onreadGateData();
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Display" && gateType === '1') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Display" && gateType === '9') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '1') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '9') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Create" && gateType === '1') {
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                    }
                    else if (oCommonModel.getProperty('/displayObject').Action === "Create" && gateType === '9') {
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                    }
                    else {
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.getView().getModel("oGenericModel").setProperty("/visible", false);
                    }
                } else if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gateType === '3' || gateType === '4' || gateType === '5' || gateType === '6' || gateType === '7' || gateType === '12')) {
                    // if (gateType === '1') {
                    //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                    // }
                    if (gateType === '3') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.onReadValueHelpData("VendorValueHelp");
                        this.onReadValueHelpData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (gateType === '12') {
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.onReadCustomerData("CustomerValueHelp");
                        this.onReadCustomerData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (gateType === '4') {
                        this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);
                        // this.getView().getModel("oGenericModel").setProperty("/editable", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateQtyEditable", true);
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        this.onReadValueHelpData("VendorValueHelp");
                        this.onReadValueHelpData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    if (gateType === '5') {
                        // this.getView().getModel("oGenericModel").setProperty("/visible", true);
                        this.getView().getModel("oGenericModel").setProperty("/editable", false);
                        // this.getView().getModel("oGenericModel").setProperty("/Entrydate", true);
                        this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                        // this.getView().byId("idOut").setValue(oDate.getDate() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getFullYear());
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }


                    if (gateType === '6') {
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    if (gateType === '7') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                    }
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);

                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty('/displayObject').Action === "Change" && (gateType === '3' || gateType === '4' || gateType === '5' || gateType === '6' || gateType === '7' || gateType === '12')) {
                    this.onreadGateData();
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '6') {
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", true);
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '1') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '9') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '3') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '12') {
                        this.onReadCustomerData("CustomerValueHelp");
                        this.onReadCustomerData("MaterialValueHelp");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '4') {
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateType === '5') {
                        this.onreadGateData();
                        this.getView().getModel("oGenericModel").setProperty("/gateInFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/gateOutFlag", false);
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                        this.getView().getModel("oGenericModel").setProperty("/weighslipvisible", false);
                        this.getView().getModel("oGenericModel").setProperty("/invoiceDateEditable", true);
                    }

                    // if (oCommonModel.getProperty('/displayObject').Action === "Change" && gateinout === 'In' && gateType === '3') {
                    //     this.onreadGateData();
                    //     var oDate = new Date();
                    //     this.getView().byId("picker0").setValue(oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate());
                    //     this.getView().byId("idGateInTime").setValue(oDate.toLocaleTimeString().slice(0, 7))
                    // }
                    // else {
                    //     this.getView().getModel("oGenericModel").setProperty("/editable", true);
                    //     this.getView().getModel("oGenericModel").setProperty("/gateEntryNumEdit", true);
                    //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    //     this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);
                    //     this.onreadGateData();
                    //     this.onReadValueHelpData("VendorValueHelp");
                    //     this.onReadValueHelpData("MaterialValueHelp");
                    // }
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') {
                    this.onreadGateData();
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Create" && gateType === '3') {
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Create" && gateType === '12') {
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Gate Out" && gateType === '1') {
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);
                }

                if (oCommonModel.getProperty('/displayObject').Action === "Display") {
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", false);
                }
            },
            GetClock: function () {

                var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
                var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                var d = new Date();
                var nday = d.getDay(),
                    nmonth = d.getMonth(),
                    ndate = d.getDate(),
                    nyear = d.getYear(),
                    nhour = d.getHours(),
                    nmin = d.getMinutes(),
                    nsec = d.getSeconds(),
                    ap;
                if (nhour === 0) {
                    ap = " AM";
                    nhour = 12;
                } else if (nhour < 12) {
                    ap = " AM";
                } else if (nhour == 12) {
                    ap = " PM";
                } else if (nhour > 12) {
                    ap = " PM";
                    nhour -= 12;
                }
                if (nyear < 1000) nyear += 1900;
                if (nmin <= 9) nmin = "0" + nmin;
                if (nsec <= 9) nsec = "0" + nsec;
                var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
                return result;
            },
            onReadValueHelpData: function (sTypeName) {
                var oModel = this.getOwnerComponent().getModel();
                var sPath = "";

                var oGenericModel = this.getView().getModel("oGenericModel");
                if (sTypeName === 'VendorValueHelp') {
                    sPath = "/SUPPLIER";
                } else if (sTypeName === 'MaterialValueHelp') {
                    sPath = "/MATERIAL";
                }
                else if (sTypeName === 'CustomerValueHelp') {
                    sPath = "/Customer";
                }
                oModel.read(sPath, {
                    async: true,
                    urlParameters: {
                        "$top": "50000000"
                    },
                    success: function (oresponse) {
                        oGenericModel.setProperty("/" + sTypeName, oresponse.results);
                    }.bind(this),
                    error: function () {

                    }.bind(this)
                });
            },
            onReadCustomerData: function (sTypeName) {
                var oModel = this.getOwnerComponent().getModel();
                var oGenericModel = this.getView().getModel("oGenericModel");
                var sPath = "";

                if (sTypeName === 'CustomerValueHelp') {
                    sPath = "/Customer";
                } else if (sTypeName === 'MaterialValueHelp') {
                    sPath = "/CusMATERIAL";
                }

                oModel.read(sPath, {
                    async: true,
                    urlParameters: {
                        "$top": "100000"
                    },
                    success: function (oresponse) {
                        oGenericModel.setProperty("/" + sTypeName, oresponse.results);
                    }.bind(this)
                })
            },
            onCheckWeight: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var Gross = Number(this.getView().byId("idGross").getValue());
                var Tare = Number(this.getView().byId("idTare").getValue());
                var NetWt = null;
                if (oEvent.getSource().getCustomData()[0].getKey() === 'tareWeight') {

                    if (this.getView().byId("idGross").getVisible()) {
                        if (Tare >= Gross) {
                            MessageBox.show("Tare weight should not be greater than or equal to Gross weight");
                            this.getView().byId("idGross").setValueState("Error");
                            this.getView().byId("idTare").setValueState("Error");
                        } else {
                            NetWt = Gross - Tare;
                            oCommonModel.setProperty("/NetWeight", NetWt);
                            this.getView().byId("idGross").setValueState("None");
                            this.getView().byId("idTare").setValueState("None");
                        }
                    }
                }
                else {
                    if (Gross <= Tare) {
                        this.getView().byId("idGross").setValueState("Error");
                        this.getView().byId("idTare").setValueState("Error");
                        MessageBox.show("Tare weight should not be greater than or equal to Gross weight");
                    } else {
                        NetWt = Gross - Tare;
                        oCommonModel.setProperty("/NetWeight", NetWt);
                        this.getView().byId("idGross").setValueState("None");
                        this.getView().byId("idTare").setValueState("None");
                    }
                }



            },
            attachChange: function (oEvent) {
                var comboValue = oEvent.getSource().getSelectedKey();
                var valueEntered = this.getView().byId("idPurchG").getValue();

                if (valueEntered != comboValue) {
                    MessageBox.error("Select correct purchase group");
                }

            },
            onSubmit: function () {
                var oGateEntryHeadModel = this.getView().getModel('oGateEntryHeadModel');
                // var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var GrossWt = Number(this.getView().byId("idGross").getValue());
                var TareWt = Number(this.getView().byId("idTare").getValue());
                var NetWeight;

                if (GrossWt > TareWt) {
                    NetWeight = Number(GrossWt - TareWt);
                    oGateEntryHeadModel.setProperty("/NetWt", NetWeight);
                } else {
                    MessageBox.error("Tare weight cannot be greater than or equal to Gross weight");
                }
            },
            fnChange: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
                var sAction = oCommonModel.getProperty('/displayObject').Action;

                if (gateType === "5" && sAction === "Create") {
                    var oContext = oEvent.mParameters.newValue;


                    var newdate = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(new Date());

                    var dateObj3 = new Date();

                    // Subtract two day from current time					
                    dateObj3.setDate(dateObj3.getDate() - 2);

                    var backdate3 = dateObj3.getFullYear() + '-' + Number(dateObj3.getMonth() + 1) + '-' + dateObj3.getDate();

                    if (backdate3.length === 10) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5, 7);
                        var dd = backdate3.slice(8, 10);
                        var dte3 = yyyy + '-' + mm + '-' + dd;
                    }
                    else if (backdate3.length === 9) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5, 7);
                        if (mm.slice(1, 2) === '-') {
                            var mm = backdate3.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate3.slice(7, 9);
                        }
                        else {
                            var mm = backdate3.slice(5, 7);
                            var dd = backdate3.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte3 = yyyy + '-' + mm + '-' + dd;
                    }
                    else if (backdate3.length === 8) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate3.slice(7, 8);
                        dd = "0" + dd;
                        var dte3 = yyyy + '-' + mm + '-' + dd;
                    }

                    var backdate3 = dte3;

                    var dateObj4 = new Date();

                    // Subtract one day from current time					
                    dateObj4.setDate(dateObj4.getDate() - 1);

                    var backdate4 = dateObj4.getFullYear() + '-' + Number(dateObj4.getMonth() + 1) + '-' + dateObj4.getDate();

                    if (backdate4.length === 10) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5, 7);
                        var dd = backdate4.slice(8, 10);
                        var dte4 = yyyy + '-' + mm + '-' + dd;
                    }
                    else if (backdate4.length === 9) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5, 7);
                        if (mm.slice(1, 2) === '-') {
                            var mm = backdate4.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate4.slice(7, 9);
                        }
                        else {
                            var mm = backdate4.slice(5, 7);
                            var dd = backdate4.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte4 = yyyy + '-' + mm + '-' + dd;
                    }
                    else if (backdate4.length === 8) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate4.slice(7, 8);
                        dd = "0" + dd;
                        var dte4 = yyyy + '-' + mm + '-' + dd;
                    }

                    var backdate4 = dte4;

                    if (oContext === newdate || oContext === backdate4 || oContext === backdate3) {
                        oEvent.getSource().setValueState('None');
                    }
                    else {
                        oEvent.getSource().setValueState('Error');
                        this.getView().byId("picker0").setValue("");
                    }
                }
                else {
                    var today = new Date();
                    var gateInDate = oEvent.getSource().getDateValue();

                    if (gateInDate > today) {
                        oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
                    }
                }

            },
            dtChange: function (oEvent) {
                var today = new Date();
                var time = today.toLocaleTimeString();
                var gateInTime = oEvent.getSource().getValue();

                if (gateInTime > time) {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
                } else {
                    oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
                }
            },
            readGateData: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oModel = this.getView().getModel();
                var oGenericModel = this.getView().getModel("oGenericModel");
                var gatenumber = this.getView().byId("refGate").getValue();
                // var gatenumber = oCommonModel.getProperty('/displayObject').GateNum;
                var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenumber);
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read("/zgat", {
                    filters: [oFilter],
                    urlParameters: {
                        "$expand": "to_gateitem"
                    },
                    success: function (oresponse) {
                        // if (oresponse.results[0].to_gateitem.results.length === 0) {
                        //     oGenericModel.setProperty("/isRowItemEmpty", true);
                        //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        // } else {
                        //     oGenericModel.setProperty("/isRowItemEmpty", false);
                        //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                        // }



                        this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                        // oCommonModel.setProperty('/plantObject', {
                        //     "Plant": oresponse.results[0].Plant,
                        //     "PlantName": oresponse.results[0].PlantName
                        // });
                        var Gatenum = this.getView().byId("idInput").getValue();
                        this.getView().byId("refGate").setValue(Gatenum);
                        if (oresponse.results.length > 0) {
                            oTableModel.setProperty("/aTableItem", oresponse.results[0].to_gateitem.results);
                            //this.getView().byId('table1').setVisibleRowCount(oresponse.results[0].to_gateitem.results.length);
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },
            onreadGateData: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oModel = this.getView().getModel();
                var oGenericModel = this.getView().getModel("oGenericModel");
                var gatenumber = oCommonModel.getProperty('/displayObject').GateNum;
                var oFilter = new sap.ui.model.Filter("Gateno", "EQ", gatenumber);
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read("/zgat", {
                    filters: [oFilter],
                    urlParameters: {
                        "$expand": "to_gateitem",
                        "$top": "100000"
                    },
                    success: function (oresponse) {
                        if (oresponse.results[0].to_gateitem.results.length === 0) {
                            oGenericModel.setProperty("/isRowItemEmpty", true);
                            // this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                        } else {
                            oGenericModel.setProperty("/isRowItemEmpty", false);
                            // this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                        }

                        // this.getView().getModel("oWeightModel").setProperty("/GrossWt", oresponse.results.GrossWt)
                        this.getView().getModel("oWeightModel").setProperty("/GrossWt", oresponse.results[0].GrossWt)
                        this.getView().getModel("oWeightModel").setProperty("/TareWt", oresponse.results[0].TareWt)

                        this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                        oCommonModel.setProperty('/plantObject', {
                            "Plant": oresponse.results[0].Plant,
                            "PlantName": oresponse.results[0].PlantName
                        });
                        if (oresponse.results.length > 0) {
                            oTableModel.setProperty("/aTableItem", oresponse.results[0].to_gateitem.results);
                            //this.getView().byId('table1').setVisibleRowCount(oresponse.results[0].to_gateitem.results.length);
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });

            },
            handleSaveGateEntryData: function () {
                var cancel = this.getView().byId("idCancel").getSelected().toString();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                var oModel = this.getView().getModel();
                var aheaderObj = [];
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oTableData = oTableModel.getProperty('/aTableItem');
                var oGateEntryHeadModel = this.getView().getModel("oGateEntryHeadModel");
                var sGateNum = oCommonModel.getProperty("/displayObject").GateNum;
                var oGenericModel = this.getView().getModel("oGenericModel");
                var oGrossWt = this.getView().byId("idGross").getValue();
                var oTareWt = this.getView().byId("idTare").getValue();
                var oNetWt = this.getView().byId("idNet").getValue();
                var ponumber = this.getView().byId("idDel1").getTokens();
                var ponumber = ponumber.map(function (oToken) {
                    return oToken.getText();
                })

                oGateEntryHeadModel.getData().Gateno = oCommonModel.getProperty("/GateEntryGeneratedNum");
                // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
                oGateEntryHeadModel.getData().to_gateitem.results = oTableModel.getProperty("/aTableItem");
                oGateEntryHeadModel.getData().NetWt = this.getView().byId("idNet").getValue();
                // oGateEntryHeadModel.getData().LrDate = this.getView().byId("idLrDate").getValue();
                aheaderObj.push(oGateEntryHeadModel.getData());
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                if (oCommonModel.getProperty('/displayObject').Action === "Create") {
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '1') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }


                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '9') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }


                    }
                    // if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '3') {
                    //     if (oGrossWt.length === 0 || oTareWt.length === 0) {
                    //         oGateEntryHeadModel.getData().GrossWt = "0.00";
                    //         oGateEntryHeadModel.getData().TareWt = "0.00";
                    //     }

                    // }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '2') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '4') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '5') {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Create" && gatetype === '6') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '6') {

                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }

                    }
                    if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').GateType === '3') {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }
                    }
                    if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').GateType === '3') {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }
                    }
                    if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').GateType === '12') {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }
                    }
                    if (oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').GateType === '12') {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }
                    }
                    // if (gatetype === '1' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                    //     oGateEntryHeadModel.getData().GateOutDt = "0.00";
                    //     oGateEntryHeadModel.getData().GateOutTm = "0.00";
                    // }
                    if (gatetype === '4' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                        oGateEntryHeadModel.getData().GateInDate = "0.00";
                        oGateEntryHeadModel.getData().GateInTm = "0.00";
                    }
                    if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }
                    }
                    if (gatetype === '3' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }
                    }
                    if (gatetype === '12' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'Out' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }
                    }
                    if (gatetype === '12' && oCommonModel.getProperty('/displayObject').gatInOutKey === 'In' && oCommonModel.getProperty('/displayObject').Action === "Create") {
                        if (oGrossWt.length === 0) {
                            oGateEntryHeadModel.getData().GrossWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().GrossWt = oGrossWt;
                        }

                        if (oTareWt.length === 0) {
                            oGateEntryHeadModel.getData().TareWt = "0.00";
                        } else {
                            oGateEntryHeadModel.getData().TareWt = oTareWt;
                        }

                        if (oNetWt.length === 0) {
                            oGateEntryHeadModel.getData().NetWt = "0.00";
                        }
                    }

                    oModel.create("/zgat", oGateEntryHeadModel.getData(), {
                        method: "POST",
                        success: function (data) {
                            oBusyDialog.close();
                            MessageBox.success("Gate no." + oCommonModel.getProperty("/GateEntryGeneratedNum") + " generated successfully!", {
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        var oHistory = sap.ui.core.routing.History.getInstance();
                                        var sPreviousHash = oHistory.getPreviousHash();

                                        if (sPreviousHash !== undefined) {
                                            window.history.go(-1);
                                        } else {
                                            var oRouter = this.getOwnerComponent().getRouter();
                                            oRouter.navTo("Gate", {}, true);
                                        }
                                    }
                                }.bind(this)
                            });
                        }.bind(this),
                        error: function (e) {
                            oBusyDialog.close();
                            // alert("error");
                        }
                    });
                } else if (oCommonModel.getProperty('/displayObject').Action === "Change" || oCommonModel.getProperty('/displayObject').Action === "Gate Out") {
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
                        if (cancel === "false")
                            oGateEntryHeadModel.getData().Cancelled = "no";

                    }
                    if (oCommonModel.getProperty('/displayObject').Action === "Change" && gatetype === '5') {
                        if (cancel === "true")
                            oGateEntryHeadModel.getData().Cancelled = "yes";

                    }

                    if (oGenericModel.getProperty("/isRowItemEmpty")) {
                        if (oTableData.length === 0) {
                            if (oGenericModel.getProperty("/isRowItemEmpty") && oCommonModel.getProperty('/displayObject').Action === "Change") {
                                delete oGateEntryHeadModel.getData().__metadata;
                                delete oGateEntryHeadModel.getData().to_gateitem;
                                oModel.update("/zgat(Gateno='" + sGateNum + "')", oGateEntryHeadModel.getData(), {
                                    success: function (data) {
                                        oBusyDialog.close();
                                        alert("success");
                                    }.bind(this),
                                    error: function (e) {
                                        oBusyDialog.close();
                                        alert("error");
                                    }
                                });

                            }
                        } else {
                            oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
                                delete item.__metadata;
                                delete item.to_gatehead;
                                // if (index === 0) {
                                item.Gateno = sGateNum;
                                oModel.create("/zgateitem_ent", item, {
                                    success: function (data) {
                                        if (index === arr.length - 1) {
                                            delete aheaderObj[0].__metadata;
                                            delete aheaderObj[0].to_gateitem;
                                            oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                success: function (data) {
                                                    oBusyDialog.close();
                                                    alert("success");
                                                }.bind(this),
                                                error: function (e) {
                                                    oBusyDialog.close();
                                                    alert("error");
                                                }
                                            });

                                        }
                                    },
                                    error: function (e) {
                                        oBusyDialog.close();
                                    }
                                });
                                // }

                            }.bind(this));
                        }
                    } else {
                        oGateEntryHeadModel.getData().to_gateitem.results.map(function (item, index, arr) {
                            if (item.hasOwnProperty("__metadata")) {
                                delete item.__metadata;
                                delete item.to_gatehead;
                                item.Gateno = sGateNum;
                                // if (index === 0) {
                                oModel.update("/zgateitem_ent(Gateno='" + item.Gateno + "',GateItem='" + item.GateItem + "')", item, {
                                    success: function (data) {
                                        if (index === arr.length - 1) {
                                            delete aheaderObj[0].__metadata;
                                            delete aheaderObj[0].to_gateitem;
                                            oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                success: function (data) {
                                                    oBusyDialog.close();
                                                    alert("success");
                                                }.bind(this),
                                                error: function (e) {
                                                    oBusyDialog.close();
                                                    alert("error");
                                                }
                                            });

                                        }
                                    },
                                    error: function (e) {
                                        oBusyDialog.close();
                                    }
                                });
                                // }
                            } else {
                                item.Gateno = sGateNum;
                                oModel.create("/zgateitem_ent", item, {
                                    success: function (data) {
                                        if (index === arr.length - 1) {
                                            delete aheaderObj[0].__metadata;
                                            delete aheaderObj[0].to_gateitem;
                                            oModel.update("/zgatehead(Gateno='" + sGateNum + "')", aheaderObj[0], {
                                                success: function (data) {
                                                    oBusyDialog.close();
                                                    alert("success");
                                                }.bind(this),
                                                error: function (e) {
                                                    oBusyDialog.close();
                                                    alert("error");
                                                }
                                            });

                                        }
                                    },
                                    error: function (e) {
                                        oBusyDialog.close();
                                    }
                                });
                            }


                        }.bind(this));
                    }



                }




            },
            handleSavePurchaseData: function () {
                var oModel = this.getOwnerComponent().getModel();
                var Gateentrytype = this.getView().byId("idType").getValue();
                var plant = this.getView().byId("plant21").getValue();
                var Cbuserid = sap.ushell.Container.getService("UserInfo").getId();
                var fullname = sap.ushell.Container.getService("UserInfo").getFullName();
                var oFilter = new sap.ui.model.Filter("plant", "EQ", plant);
                var oFilter1 = new sap.ui.model.Filter("user_id", "EQ", Cbuserid);
                var oFilter2 = new sap.ui.model.Filter("user_name", "EQ", fullname);
                var oFilter3 = new sap.ui.model.Filter("gate_entry_type", "EQ", Gateentrytype);
                oModel.read("/tmgtable", {
                    filters: [oFilter, oFilter1, oFilter2, oFilter3],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            this.handleSavePurchaseData1();
                        }
                        else {
                            MessageBox.error("You are Not Authroized for This Gate Entry Type " + Gateentrytype + " and Plant " + plant + " or User Id " + Cbuserid);
                        }

                    }.bind(this),
                    error: function () {
                        MessageBox.error("You are Not Authroized for This Gate Entry Type " + Gateentrytype + " and Plant " + plant + " or User Id " + Cbuserid);
                    }

                })
            },
            handleSavePurchaseData1: function () {
                var oTableModel = this.getView().getModel("oTableItemModel");
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gatetype = oCommonModel.getProperty('/displayObject').GateType;
                var sAction = oCommonModel.getProperty('/displayObject').Action;

                if (oTableModel.getProperty("/aTableItem").length > 0) {
                    oTableModel.getProperty("/aTableItem").map(function (items) {
                        if (items.OrderQty === items.OpenQty) {
                            this.getView().getModel("oGenericModel").setProperty("/validPO", false);
                        }
                        else if (items.GateQty != "") {
                            this.getView().getModel("oGenericModel").setProperty("/validPO", true);
                        }
                    }.bind(this))
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/validPO", true);
                }

                if (gatetype === "12") {
                    for (var i = 0; i < oTableModel.getProperty("/aTableItem").length; i++) {
                        if (oTableModel.getProperty("/aTableItem")) {

                        }
                    }
                }


                var date = new Date();

                var newdate = date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate();


                var dateObj = new Date();

                // Subtract six day from current time					
                dateObj.setDate(dateObj.getDate() - 5);

                var backdate = dateObj.getFullYear() + '-' + Number(dateObj.getMonth() + 1) + '-' + dateObj.getDate();

                if (backdate.length === 10) {
                    var yyyy = backdate.slice(0, 4);
                    var mm = backdate.slice(5, 7);
                    var dd = backdate.slice(8, 10);
                    var dte = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate.length === 9) {
                    var yyyy = backdate.slice(0, 4);
                    var mm = backdate.slice(5, 7);
                    if (mm.slice(1, 2) === '-') {
                        var mm = backdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate.slice(7, 9);
                    }
                    else {
                        var mm = backdate.slice(5, 7);
                        var dd = backdate.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate.length === 8) {
                    var yyyy = backdate.slice(0, 4);
                    var mm = backdate.slice(5, 6);
                    mm = "0" + mm;
                    var dd = backdate.slice(7, 8);
                    dd = "0" + dd;
                    var dte = yyyy + '-' + mm + '-' + dd;
                }

                var backdate = dte;

                var dateObj1 = new Date();

                // Subtract four day from current time					
                dateObj1.setDate(dateObj1.getDate() - 4);

                var backdate1 = dateObj1.getFullYear() + '-' + Number(dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();

                if (backdate1.length === 10) {
                    var yyyy = backdate1.slice(0, 4);
                    var mm = backdate1.slice(5, 7);
                    var dd = backdate1.slice(8, 10);
                    var dte1 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate1.length === 9) {
                    var yyyy = backdate1.slice(0, 4);
                    var mm = backdate1.slice(5, 7);
                    if (mm.slice(1, 2) === '-') {
                        var mm = backdate1.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate1.slice(7, 9);
                    }
                    else {
                        var mm = backdate1.slice(5, 7);
                        var dd = backdate1.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte1 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate1.length === 8) {
                    var yyyy = backdate1.slice(0, 4);
                    var mm = backdate1.slice(5, 6);
                    mm = "0" + mm;
                    var dd = backdate1.slice(7, 8);
                    dd = "0" + dd;
                    var dte1 = yyyy + '-' + mm + '-' + dd;
                }

                var backdate1 = dte1;

                var dateObj2 = new Date();

                // Subtract three day from current time					
                dateObj2.setDate(dateObj2.getDate() - 3);

                var backdate2 = dateObj2.getFullYear() + '-' + Number(dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();

                if (backdate2.length === 10) {
                    var yyyy = backdate2.slice(0, 4);
                    var mm = backdate2.slice(5, 7);
                    var dd = backdate2.slice(8, 10);
                    var dte2 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate2.length === 9) {
                    var yyyy = backdate2.slice(0, 4);
                    var mm = backdate2.slice(5, 7);
                    if (mm.slice(1, 2) === '-') {
                        var mm = backdate2.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate2.slice(7, 9);
                    }
                    else {
                        var mm = backdate2.slice(5, 7);
                        var dd = backdate2.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte2 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate2.length === 8) {
                    var yyyy = backdate2.slice(0, 4);
                    var mm = backdate2.slice(5, 6);
                    mm = "0" + mm;
                    var dd = backdate2.slice(7, 8);
                    dd = "0" + dd;
                    var dte2 = yyyy + '-' + mm + '-' + dd;
                }

                var backdate2 = dte2;

                var dateObj3 = new Date();

                // Subtract two day from current time					
                dateObj3.setDate(dateObj3.getDate() - 2);

                var backdate3 = dateObj3.getFullYear() + '-' + Number(dateObj3.getMonth() + 1) + '-' + dateObj3.getDate();

                if (backdate3.length === 10) {
                    var yyyy = backdate3.slice(0, 4);
                    var mm = backdate3.slice(5, 7);
                    var dd = backdate3.slice(8, 10);
                    var dte3 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate3.length === 9) {
                    var yyyy = backdate3.slice(0, 4);
                    var mm = backdate3.slice(5, 7);
                    if (mm.slice(1, 2) === '-') {
                        var mm = backdate3.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate3.slice(7, 9);
                    }
                    else {
                        var mm = backdate3.slice(5, 7);
                        var dd = backdate3.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte3 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate3.length === 8) {
                    var yyyy = backdate3.slice(0, 4);
                    var mm = backdate3.slice(5, 6);
                    mm = "0" + mm;
                    var dd = backdate3.slice(7, 8);
                    dd = "0" + dd;
                    var dte3 = yyyy + '-' + mm + '-' + dd;
                }

                var backdate3 = dte3;

                var dateObj4 = new Date();

                // Subtract one day from current time					
                dateObj4.setDate(dateObj4.getDate() - 1);

                var backdate4 = dateObj4.getFullYear() + '-' + Number(dateObj4.getMonth() + 1) + '-' + dateObj4.getDate();

                if (backdate4.length === 10) {
                    var yyyy = backdate4.slice(0, 4);
                    var mm = backdate4.slice(5, 7);
                    var dd = backdate4.slice(8, 10);
                    var dte4 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate4.length === 9) {
                    var yyyy = backdate4.slice(0, 4);
                    var mm = backdate4.slice(5, 7);
                    if (mm.slice(1, 2) === '-') {
                        var mm = backdate4.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate4.slice(7, 9);
                    }
                    else {
                        var mm = backdate4.slice(5, 7);
                        var dd = backdate4.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte4 = yyyy + '-' + mm + '-' + dd;
                }
                else if (backdate4.length === 8) {
                    var yyyy = backdate4.slice(0, 4);
                    var mm = backdate4.slice(5, 6);
                    mm = "0" + mm;
                    var dd = backdate4.slice(7, 8);
                    dd = "0" + dd;
                    var dte4 = yyyy + '-' + mm + '-' + dd;
                }

                var backdate4 = dte4;

                var oGrossWt = this.getView().byId("idGross").getValue();
                var oTareWt = this.getView().byId("idTare").getValue();
                var vechileno = this.getView().byId("vehno").getValue();
                var DriverName = this.getView().byId("idDrv").getValue();
                var operatorname = this.getView().byId("idOpr").getValue();
                var lrnumber = this.getView().byId("idLr").getValue();
                var purchasegroup = this.getView().byId("idPurchG").getValue();
                var invoicenumber = this.getView().byId("idinvno").getValue();
                var InvoiceDate = this.getView().byId("idInvoiceDate").getValue();
                var purchaseordertype = this.getView().byId("idpurchaseordertype").getValue();
                var getuserid = sap.ushell.Container.getService("UserInfo").getFullName();
                var sDate = new Date(InvoiceDate);
                var eDate = new Date();
                var diff = Math.abs(eDate.getTime() - sDate.getTime());
                var diffD = Math.ceil(diff / (1000 * 3600 * 24)); 
                if (vechileno === "") {
                    MessageBox.error("Please Enter Vehicle No.");
                }
                else if (operatorname === "") {
                    MessageBox.error("Please Enter Operator Name");
                }
                else if (DriverName === "") {
                    MessageBox.error("Please Enter Driver Name");
                }
                else if (invoicenumber === "") {
                    MessageBox.error("Please Enter Invoice No");
                }

                // else if (oTableModel.getProperty("/aTableItem").length === 0) {
                //     MessageBox.error("Please Enter PO No");
                // }
                else if (lrnumber === "" && purchasegroup === "R01") {
                    MessageBox.error("Please Enter LR Number");
                }
                else if (lrnumber === "" && purchasegroup === "R02") {
                    MessageBox.error("Please Enter LR Number");
                }
                else if (lrnumber === "" && purchasegroup === "S05") {
                    MessageBox.error("Please Enter LR Number");
                }
                else if(diffD >10){
                    if ( purchaseordertype === "ZST2" || getuserid === 'Nasir Khan') {
                        var invoicenumber = this.getView().byId("idinvno").getValue();
                        for (var i = 0; i < invoicenumber.length; i++) {
                            var k = i + 1;
                            if (invoicenumber[i] === ' ') {
                                MessageBox.error("Space character is not allowed in Invoice No.");
                                break;
                            }
                            else if (k === invoicenumber.length) {
                                this.savepurchasedata2();
                            }
                        }
                    }
                    else{
                        MessageBox.error("Invoice Date is Back From Last 10 days are Not Allowed");
                    }
                    
                }
                else{
                    var invoicenumber = this.getView().byId("idinvno").getValue();
                    for (var i = 0; i < invoicenumber.length; i++) {
                        var k = i + 1;
                        if (invoicenumber[i] === ' ') {
                            MessageBox.error("Space character is not allowed in Invoice No.");
                            break;
                        }
                        else if (k === invoicenumber.length) {
                            this.savepurchasedata2();
                        }
                    }
                }
            },
            savepurchasedata2: function () {



                var oTableModel = this.getView().getModel("oTableItemModel");
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var sAction = oCommonModel.getProperty('/displayObject').Action;
                var invoicenumber = this.getView().byId("idinvno").getValue();
                if (sAction === "Create") {
                    var data = oTableModel.getProperty("/aTableItem");
                    var Deliveryno = [];
                    for (var i = 0; i < data.length; i++) {
                        Deliveryno.push(data[i].Lifnr)
                    }

                    var oModel = this.getOwnerComponent().getModel();

                    var aFilters = Deliveryno.map(function (value) {
                        return new sap.ui.model.Filter("lifnr", sap.ui.model.FilterOperator.EQ, value);
                    });

                    var oFilter = new sap.ui.model.Filter({
                        filters: aFilters,
                        and: false
                    });
                    var oFilter1 = new sap.ui.model.Filter("invoice", "EQ", invoicenumber);
                    oModel.read("/InvoiceChck", {
                        filters: [oFilter, oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                this.handleSaveGateEntryData();
                            }
                            else {
                                
                                function getFiscalYear(entryDate, fiscalStartMonth, fiscalStartDay) {
                                    let today = new Date(entryDate); // Ensure entryDate is a Date object
                                    let fiscalStart = new Date(today.getFullYear(), fiscalStartMonth - 1, fiscalStartDay); // Adjust month to 0-index
                                
                                    if (today < fiscalStart) {
                                        return today.getFullYear() - 1;
                                    } else {
                                        return today.getFullYear();
                                    }
                                }
                                
                                // Example usage with oresponse.results[0].entrydate
                                let entryDate = new Date();
                                let fiscalStartMonth = 4; // April (4th month)
                                let fiscalStartDay = 1;   // 1st day
                                let fiscalYear = getFiscalYear(entryDate, fiscalStartMonth, fiscalStartDay);
                                // console.log("Current fiscal year:", fiscalYear);
                                
                                // var entryDate1 = oresponse.results[0].entrydate;
                                // let fiscalStartMonth1 = 4; // April (4th month)
                                // let fiscalStartDay1 = 1;   // 1st day
                                // let fiscalYear1 = getFiscalYear(entryDate1, fiscalStartMonth1, fiscalStartDay1);
                                // // console.log("Documnet fiscal year:", fiscalYear);

                                // if(fiscalYear ===  fiscalYear1){
                                //     var gateno = oresponse.results[0].gateno;
                                //     MessageBox.error("Invoice Already Received From This Party in Gate Entry Number:-" + gateno);
                                // }
                                // else{
                                //     this.handleSaveGateEntryData();
                                // }
                                for (var i = 0; i < oresponse.results.length; i++) {
                                    var k= i +1;
                                    let entryDate1 = new Date(oresponse.results[i].entrydate); 
                                    let fiscalStartMonth1 = 4; 
                                    let fiscalStartDay1 = 1;   
                                    let fiscalYear1 = getFiscalYear(entryDate1, fiscalStartMonth1, fiscalStartDay1);
                                
                                    if (fiscalYear === fiscalYear1) {
                                        var gateno = oresponse.results[i].gateno;
                                        MessageBox.error("Invoice Already Received From This Party in Gate Entry Number:-" + gateno);
                                        break;
                                    }
                                    else if(oresponse.results.length === k){
                                        this.handleSaveGateEntryData();
                                    }
                                    
                                }
                                
                            }

                        }.bind(this),
                        error: function () {
                            MessageBox.error("Wrong Invoice No.")
                        }

                    })
                }
                else {
                    this.handleSaveGateEntryData();
                }


            },
            oninvoice: function (oEvent) {

                var sValue = oEvent.getParameter('value');
                for (var i = 0; i < sValue.length; i++) {
                    if (sValue[i] === ' ') {
                        MessageBox.error("Space character is not allowed");
                    }
                }



            },
            checkValue: function (oEvent) {
                var oModel = this.getView().getModel();

                var oContext = oEvent.getSource().getBindingContext('oTableItemModel').getObject();
                var difference = Number(oContext.OrderQty) - Number(oContext.OpenQty);
                if (Number(oEvent.getSource().getValue()) + Number(oContext.OpenQty) > Number(oContext.RsplName)) {
                    this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText('Entered Value is greater than Tolerance Value.');
                } else {
                    this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                    oEvent.getSource().setValueState('None');
                    oEvent.getSource().setValueStateText(' ');
                }

                // if ((Number(oContext.OpenQty) > Number(oContext.RsplName)) || (Number(oEvent.getSource().getValue()) > difference)) {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                //     oEvent.getSource().setValueState('Error');
                //     oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.');
                // } else {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                //     oEvent.getSource().setValueState('None');
                //     oEvent.getSource().setValueStateText(' ');
                // }


                // var difference = Number(oContext.OrderQty) - Number(oContext.OpenQty);
                // if (Number(oEvent.getSource().getValue()) > difference) {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", true);
                //     oEvent.getSource().setValueState('Error');
                //     oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.');
                // } else {
                //     this.getView().getModel("oGenericModel").setProperty("/checkValue", false);
                //     oEvent.getSource().setValueState('None');
                //     oEvent.getSource().setValueStateText(' ');
                // }

                // var oTableModel = this.getView().getModel('oTableItemModel').getProperty("/aTableItem");
                // var length = oTableModel.length;
                // for (var i = 0; i < length; i++) {
                //     if (oTableModel[i].Bnfpo > (oTableModel[i].OrderQty - oTableModel[i].Banfn)) {
                //         MessageBox.error("Gate Quantity cannot be greater than the difference of Order Quantity and Gate Done Quantity.");
                //     }
                // }
            },
            // checkValue1: function (oEvent) {
            //     var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
            //     var gateType = oCommonModel.getProperty('/displayObject').GateType;
            //     var sAction = oCommonModel.getProperty('/displayObject').Action;
            //     var gateinout = oCommonModel.getProperty('/displayObject').gatInOutKey;
            //     var oContext = oEvent.getSource().getBindingContext('oTableItemModel').getObject();
            //     var GateDoneQty = Number(oContext.OutQty);
            //     var GateQty = Number(oContext.GateQty);

            //     if (gateType === '3' && gateinout === 'In' && sAction === 'Create') {
            //         if (Number(oEvent.getSource().getValue()) > GateDoneQty) {
            //             oEvent.getSource().setValueState('Error');
            //             oEvent.getSource().setValueStateText('Gate Quantity cannot be greater than Gate Done Quantity.');
            //         } else {
            //             oEvent.getSource().setValueState('None');
            //             oEvent.getSource().setValueStateText(' ');
            //         }
            //     }
            // },       CHANGES BY ANSHUL AS PER INSTRUCT BY ADESH THIS IS NOT MANDOATORY IN RETURNABLE 
            onReadDeliveryData: function () {
                var sDeliveryNum = this.getView().byId("idDel1").getValue();
                var sPath = "/delieverydata";
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var plant = oCommonModel.getProperty('/plantObject').Plant;
                var sFieldName = "";
                if (gateType === '1') {
                    sFieldName = "DeliveryDocument";
                } else if (gateType === '2') {
                    sFieldName = "invoice";
                } else if (gateType === '3') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                } else if (gateType === '4') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                else if (gateType === '5') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity";


                } else if (gateType === '6') {
                    sFieldName = "PurchaseOrder";
                    sPath = "/purchase_ordentity"
                }
                else if (gateType === '9') {
                    sFieldName = "DeliveryDocument";
                }

                var oInput = this.getView().byId("idPurchG");
                var oInput1 = this.getView().byId("idpurchaseordertype");

                var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", plant);         /////changes By Anshul

                // var oFilter = new sap.ui.model.Filter(sFieldName, "EQ", sDeliveryNum);

                var oMultiInput1 = this.getView().byId("idDel1");
                var aTokens = oMultiInput1.getTokens();
                var aFilterValues = aTokens.map(function (oToken) {
                    return oToken.getText();
                });
                var aFilters = aFilterValues.map(function (value) {
                    return new sap.ui.model.Filter(sFieldName, sap.ui.model.FilterOperator.EQ, value);
                });

                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                });                                                         /////changes By Anshul multiple dlevery and po for 

                var oModel = this.getOwnerComponent().getModel();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                oModel.read(sPath, {
                    filters: [oFilter, oFilter1],
                    urlParameters: {"$top": "5000"},
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oBusyDialog.close();
                            MessageBox.error("Inavlid Plant for the Document");                                /////changes By Anshul
                        }
                        else {
                            var gateItemNum = "";
                            var oNewResponseArr = [];
                            var aNewArr = [];
                            var isDataAlreadyExist = false;
                            var isPOadded = false;
                            var gateEntryCreated = false;
                            if (oTableModel.getProperty("/aTableItem").length > 0) {
                                oresponse.results.map(function (items) {
                                    var isMatched = false;
                                    var oData = items;
                                    oTableModel.getProperty("/aTableItem").map(function (item) {
                                        if (gateType === '1' || gateType === '2') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }
                                        } else if (gateType === '3') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '5') {
                                            if (item.Ebeln === oData.PurchaseOrder && item.GateItem === oData.PurchaseOrderItem) {
                                                isMatched = true;
                                            }

                                        } else if (gateType === '6') {
                                            if (item.Delievery === oData.DeliveryDocument && item.GateItem === oData.DeliveryDocumentItem) {
                                                isMatched = true;
                                            }

                                        }
                                        if (item.Ebeln === oData.PurchaseOrder) {
                                            isPOadded = true;
                                        }


                                    });

                                    if (isMatched === false) {
                                        oNewResponseArr.push(oData);
                                    }


                                }.bind(this));
                                isDataAlreadyExist = true;
                                var igateNum = Math.max.apply(null, oTableModel.getProperty("/aTableItem").map(function (item) {
                                    return Number(item.GateItem)
                                }));
                                gateItemNum = igateNum + 10;
                                aNewArr = oTableModel.getProperty("/aTableItem");

                            } else {
                                oNewResponseArr = oresponse.results;
                                if (oresponse.results[0].OrderQuantity === oresponse.results[0].totalgatequantity) {
                                    gateEntryCreated = true;
                                } else {
                                    gateEntryCreated = false;
                                }
                            }


                            if (gateType === '1' || gateType === '2' || gateType === '9') {
                                oNewResponseArr.map(function (item) {

                                    var num = item.delievered_quantity;
                                    var oValue = num.indexOf(".");
                                    if (oValue != -1) {
                                        var num1 = num.slice(0, oValue);
                                        var qty = num.slice(oValue, oValue + 3);
                                        var num2 = num1 + qty;
                                    } else {
                                        num2 = item.delievered_quantity;
                                    }

                                    var obj = {
                                        Sono: item.ReferenceSDDocument,
                                        Zinvoice: item.invoice,
                                        Delievery: item.DeliveryDocument,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.DeliveryDocumentItem,
                                        Lifnr: item.SoldToParty,
                                        Name1: item.CustomerName,
                                        Matnr: item.Material,
                                        OrderQty: num2,
                                        Maktx: item.material_description,
                                        Uom: item.ItemWeightUnit,
                                        Remark: '',
                                        ZbagQty: item.zpackage.toString()
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));
                            } else if (gateType === '3') {

                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        OutQty: item.totalqty1,
                                        Bnfpo: '',
                                        OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            } else if (gateType === '4') {

                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        Lpnum: item.ConsumptionTaxCtrlCode,
                                        OrderQty: item.OrderQuantity,
                                        OpenQty: null,
                                        GateQty: null,
                                        // Department: '',
                                        Remark: '',
                                        Uom: item.PurchaseOrderQuantityUnit,
                                        Zinvoice: '',
                                        OutQty: item.totalqty1,
                                        Bnfpo: '',
                                        OutQty: null,
                                        InQty: null,
                                        OutValue: null
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));

                            }
                            else if (gateType === '5') {

                                var purchasegroup = oNewResponseArr[0].PurchasingGroup;     /////changes By Anshul
                                oInput.setValue(purchasegroup);
                                var PurchaseOrderType = oNewResponseArr[0].PurchaseOrderType;     /////changes By Anshul
                                oInput1.setValue(PurchaseOrderType);                            /////changes By Anshul

                                if (oNewResponseArr[0].ReleaseIsNotCompleted === false && oNewResponseArr[0].PurchasingProcessingStatus === "05") {
                                    oNewResponseArr.map(function (item) {
                                        var num = item.OrderQuantity;
                                        var oValue = num.indexOf(".");
                                        if (oValue != -1) {
                                            var num1 = num.slice(0, oValue);
                                            var qty = num.slice(oValue, oValue + 3);
                                            var num2 = num1 + qty;
                                            console.log(qty);
                                        } else {
                                            num2 = item.OrderQuantity;
                                        }

                                        var outqty = item.totalqty1;
                                        var value = outqty.indexOf(".");
                                        if (value != -1) {
                                            var quantity = outqty.slice(0, value);
                                            var quantity1 = outqty.slice(value, value + 3);
                                            var quantity2 = quantity + quantity1;

                                        } else {
                                            quantity2 = item.totalqty1;
                                        }


                                        var obj = {
                                            Ebeln: item.PurchaseOrder,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Ebelp: item.PurchaseOrderItem,
                                            Lifnr: item.suppliernumber,
                                            Name1: item.suppliername,
                                            Matnr: item.Material,
                                            Maktx: item.ProductName,
                                            RsplName: item.tolerancequantity,
                                            OrderQty: num2,
                                            GateQty: null,
                                            OpenQty: item.totalgatequantity,
                                            Remark: '',
                                            Uom: item.PurchaseOrderQuantityUnit,
                                            OutQty: quantity2,
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }.bind(this));
                                }
                                else {

                                    oBusyDialog.close();
                                    MessageBox.error("Please Realsed Purchase Order First");
                                }



                            } else if (gateType === '6') {
                                var purchasegroup = oNewResponseArr[0].PurchasingGroup;     /////changes By Anshul
                                oInput.setValue(purchasegroup);
                                var PurchaseOrderType = oNewResponseArr[0].PurchaseOrderType;     /////changes By Anshul
                                oInput1.setValue(PurchaseOrderType);
                                if (oNewResponseArr[0].ReleaseIsNotCompleted === false && oNewResponseArr[0].PurchasingProcessingStatus === "05") {
                                    oNewResponseArr.map(function (item) {
                                        var obj = {
                                            Ebeln: item.PurchaseOrder,
                                            GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                            Lifnr: item.suppliernumber,
                                            Name1: item.suppliername,
                                            Maktx: item.Material,
                                            Matnr: item.ProductName,
                                            OrderQty: item.OrderQuantity,
                                            GateQty: null,
                                            Remark: '',
                                            Uom: ''
                                        };
                                        aNewArr.push(obj);
                                        gateItemNum = gateItemNum + 10;
                                    }.bind(this));

                                }
                                else {
                                    oBusyDialog.close();
                                    MessageBox.error("Please Realsed Purchase Order First");
                                }
                            } else if (gateType === '7') {
                                oNewResponseArr.map(function (item) {
                                    var obj = {
                                        Ebeln: item.PurchaseOrder,
                                        GateItem: isDataAlreadyExist ? gateItemNum.toString() : item.PurchaseOrderItem,
                                        Lifnr: item.suppliernumber,
                                        Name1: item.suppliername,
                                        Maktx: item.Material,
                                        Matnr: item.ProductName,
                                        OrderQty: item.OrderQuantity,
                                        GateQty: null,
                                        Remark: '',
                                        Uom: ''
                                    };
                                    aNewArr.push(obj);
                                    gateItemNum = gateItemNum + 10;
                                }.bind(this));
                            }

                            oTableModel.setProperty("/aTableItem", aNewArr);
                            this.getView().byId('idDel1').removeAllTokens();
                            oBusyDialog.close();
                        }
                    }.bind(this),
                    error: function () {
                        oBusyDialog.close();
                    }.bind(this)
                });
            },
            onAddNewRows: function () {
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var aTableArr = oTableModel.getProperty("/aTableItem");
                if (!oTableModel.getProperty("/aTableItem").length === 0) {
                    MessageBox.warning("Please fetch table data first!");
                } else {
                    var igateNum = Math.max.apply(null, aTableArr.map(function (item) {
                        return Number(item.GateItem)
                    }));
                    if (igateNum === -Infinity) {
                        igateNum = 0;
                    }
                    if (gateType === '1' || gateType === '2' || gateType === '9') {
                        //oTableModel.getProperty("/aTableItem").map(function (item) {

                        var obj = {
                            Sono: '',
                            Zinvoice: '',
                            Delievery: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Matnr: '',
                            OrderQty: null,
                            OpenQty: null,
                            Maktx: '',
                            Uom: '',
                            Remark: ''
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '3') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            Lpnum: '',
                            OrderQty: null,
                            OpenQty: null,
                            GateQty: null,
                            // Department: '',
                            Remark: '',
                            Uom: '',
                            Zinvoice: '',
                            OutQty: null,
                            InQty: null,
                            Address1: null
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '4') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            Lpnum: '',
                            OrderQty: null,
                            OpenQty: null,
                            GateQty: null,
                            // Department: '',
                            Remark: '',
                            Uom: '',
                            Zinvoice: '',
                            OutQty: null,
                            Address1: null
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '5') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            OrderQty: null,
                            GateQty: null,
                            Remark: '',
                            Uom: ''
                        };
                        aTableArr.push(obj);
                        //});
                    } else if (gateType === '6') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Ebeln: '',
                            GateItem: (igateNum + 10).toString(),
                            Lifnr: '',
                            Name1: '',
                            Maktx: '',
                            Matnr: '',
                            OrderQty: null,
                            GateQty: null,
                            Remark: '',
                            Uom: ''
                        };
                        aTableArr.push(obj);
                        //});
                    }
                    else if (gateType === '12') {
                        //oresponse.results.map(function (item) {
                        var obj = {
                            Lifnr: '',
                            Name1: '',
                            GateItem: (igateNum + 10).toString(),
                            Address1: '',
                            Maktx: '',
                            Matnr: '',
                            Lpnum: null,
                            OutQty: '0',
                            GateQty: '0',
                            Uom: '',
                            Remark: '',
                            Zinvoice: '',
                            OutValue: '0'
                        };
                        aTableArr.push(obj);
                        //});
                    }

                    oTableModel.setProperty("/aTableItem", aTableArr);
                }
            },
            onDeleteSelectedData: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "Please wait ..."
                });
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var gateType = oCommonModel.getProperty('/displayObject').GateType;
                var oModel = this.getView().getModel();
                var oTable = oEvent.getSource().getParent().getParent();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var aTableArr = oTableModel.getProperty("/aTableItem");
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableId;
                if (gateType === '5') {
                    oTableId = "table2";
                } else if (gateType === '1' || gateType === '2' || gateType === '9') {
                    oTableId = "table1"
                } else if (gateType === '6') {
                    oTableId = "table3"
                } else if (gateType === '3' || gateType === '4') {
                    oTableId = "table4"
                }
                else if (gateType === '12') {
                    oTableId = "table5"
                }
                var aNewArray = [];

                var tb = this.getView().byId(oTableId);

                var rowid = tb.getSelectedIndices();
                var data = aTableArr[rowid];

                if (rowid.length === 1) {
                    MessageBox.alert("Are you sure you want to delete?", {
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                oBusyDialog.open();
                                oModel.remove("/gate_item(Gateno='" + data.Gateno + "',GateItem='" + data.GateItem + "')", {
                                    method: "DELETE",
                                    success: function (data) {
                                        oBusyDialog.close();


                                        for (var i = 0; i < aSelectedIndex.length; i++) {
                                            aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                            // aTableArr.splice(aSelectedIndex[i],1);
                                        }

                                        aNewArray.map(function (item) {
                                            var gateItem = item;
                                            var iIndex = "";
                                            aTableArr.map(function (item, index) {
                                                if (gateItem === item.GateItem) {
                                                    iIndex = index;
                                                }
                                            });
                                            aTableArr.splice(iIndex, 1);
                                        }.bind(this));

                                        var iGateItem = 10;
                                        aTableArr.map(function (item) {
                                            if (iGateItem === 10) {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            } else {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            }
                                        }.bind(this));

                                        oTableModel.setProperty("/aTableItem", aTableArr);
                                    },
                                    error: function (e) {
                                        oBusyDialog.close();
                                        for (var i = 0; i < aSelectedIndex.length; i++) {
                                            aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                            // aTableArr.splice(aSelectedIndex[i],1);
                                        }

                                        aNewArray.map(function (item) {
                                            var gateItem = item;
                                            var iIndex = "";
                                            aTableArr.map(function (item, index) {
                                                if (gateItem === item.GateItem) {
                                                    iIndex = index;
                                                }
                                            });
                                            aTableArr.splice(iIndex, 1);
                                        }.bind(this));

                                        var iGateItem = 10;
                                        aTableArr.map(function (item) {
                                            if (iGateItem === 10) {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            } else {
                                                item.GateItem = (iGateItem).toString();
                                                iGateItem = iGateItem + 10;
                                            }
                                        }.bind(this));

                                        oTableModel.setProperty("/aTableItem", aTableArr);
                                    }
                                });
                            }
                        }
                    })
                }

                if (rowid.length > 1) {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Deleting Records",
                        text: "Please wait ..."
                    });
                    MessageBox.alert("Are you sure you want to delete?", {
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                for (var i = 0; i <= rowid.length; i++) {
                                    oBusyDialog.open();
                                    data = aTableArr[i];
                                    oModel.remove("/gate_item(Gateno='" + data.Gateno + "',GateItem='" + data.GateItem + "')", {
                                        method: "DELETE",
                                        success: function (data) {
                                            oBusyDialog.close();

                                            for (var i = 0; i < aSelectedIndex.length; i++) {
                                                aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                                // aTableArr.splice(aSelectedIndex[i],1);
                                            }

                                            aNewArray.map(function (item) {
                                                var gateItem = item;
                                                var iIndex = "";
                                                aTableArr.map(function (item, index) {
                                                    if (gateItem === item.GateItem) {
                                                        iIndex = index;
                                                    }
                                                });
                                                aTableArr.splice(iIndex, 1);
                                            }.bind(this));

                                            var iGateItem = 10;
                                            aTableArr.map(function (item) {
                                                if (iGateItem === 10) {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                } else {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                }
                                            }.bind(this));

                                            oTableModel.setProperty("/aTableItem", aTableArr);

                                        },
                                        error: function (e) {
                                            oBusyDialog.close();
                                            for (var i = 0; i < aSelectedIndex.length; i++) {
                                                aNewArray.push(aTableArr[aSelectedIndex[i]].GateItem);
                                                // aTableArr.splice(aSelectedIndex[i],1);
                                            }

                                            aNewArray.map(function (item) {
                                                var gateItem = item;
                                                var iIndex = "";
                                                aTableArr.map(function (item, index) {
                                                    if (gateItem === item.GateItem) {
                                                        iIndex = index;
                                                    }
                                                });
                                                aTableArr.splice(iIndex, 1);
                                            }.bind(this));

                                            var iGateItem = 10;
                                            aTableArr.map(function (item) {
                                                if (iGateItem === 10) {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                } else {
                                                    item.GateItem = (iGateItem).toString();
                                                    iGateItem = iGateItem + 10;
                                                }
                                            }.bind(this));

                                            oTableModel.setProperty("/aTableItem", aTableArr);
                                        }
                                    });
                                }
                            }
                        }
                    });

                }

            },
            getWeight: function () {
                var radioButtonValue = this.getView().byId("idRadioWeight").getSelectedButton().getText();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                // var url = "https://smplweighingscale.in:8081/weightscale/registorWeightScaleData";
                // var url1 = "https://smplweighingscale.in:8081/weightscale/getWeightScaleData";
                var url = "https://192.168.0.106:8081/weightscale/registorWeightScaleData";
                var url1 = "https://192.168.0.106:8081/weightscale/getWeightScaleData";
                $.ajax({
                    url: url,
                    beforeSend: function (xhr) {
                        // xhr.withCredentials = true
                        // xhr.username = username;
                        // xhr.password = password;
                    },
                    // headers: {
                    //     "Access-Control-Allow-Headers" : "*"
                    // },
                    type: "GET",
                    success: function (oresponse) {
                        $.ajax({
                            url: url1,
                            beforeSend: function (xhr) {
                                // xhr.withCredentials = true;
                                // xhr.username = username;
                                // xhr.password = password;
                            },
                            type: "GET",
                            success: function (oresponse) {
                                var data = oresponse.split("\x03");
                                var data1 = data[0].slice(4);
                                if (radioButtonValue === "Gross") {
                                    this.getView().byId("idGross").setValue(data1);
                                    // this.getView().setModel(new JSONModel(), "oWeightModel")
                                    // this.getView().getModel("oWeightModel").setProperty("/GrossWt", data1)
                                } else if (radioButtonValue === "Tare") {
                                    this.getView().byId("idTare").setValue(data1)
                                    // this.getView().setModel(new JSONModel(), "oTareWeightModel")
                                    // this.getView().getModel("oTareWeightModel").setProperty("/TareWt", data1)
                                }
                            }.bind(this)

                        })
                    }.bind(this)
                })
            },
            onReadNumberRange: function () {
                // var plant = this.getView().byId("idPlantCombo").getValue();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var plant = oCommonModel.getProperty('/plantObject').Plant;
                if (plant === '1100') {
                    var num = "01"
                } else if (plant === '1200') {
                    var num = "02"
                } else if (plant === '1300') {
                    var num = "03"
                } else if (plant === '1310') {
                    var num = "04"
                } else if (plant === '1400') {
                    var num = "05"
                } else if (plant === '2100') {
                    var num = "06"
                }
                else if (plant === '2200') {
                    var num = "07"
                }
                else if (plant === '1210') {
                    var num = "08"
                }
                else if (plant === '1320') {
                    var num = "09"
                }
                // var url = "/numberrange/?&nrrangenr=01";
                var url1 = "/sap/bc/http/sap/zgatehttp_2022?sap-client=080&numc=";
                var url = url1 + num;
                // var url = "/numberrange";
                var username = "ZSAP_4MUSER";
                var password = "LECapyZCfBppljSuk}TVWLSAUpS7RgmNLLaoFrAS";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {
                        oCommonModel.setProperty("/GateEntryGeneratedNum", result);
                    }.bind(this)
                });

            },
            onValueHelpWithSuggestionsRequested: function () {
                this._oBasicSearchFieldWithSuggestions = new sap.m.SearchField();
                if (!this.pDialogWithSuggestions) {
                    this.pDialogWithSuggestions = this.loadFragment({
                        name: "zgateentry.fragments.ValueHelpDialog"
                    });
                }
                this.pDialogWithSuggestions.then(function (oDialogSuggestions) {
                    var oFilterBar = oDialogSuggestions.getFilterBar();
                    this._oVHDWithSuggestions = oDialogSuggestions;

                    // Initialise the dialog with model only the first time. Then only open it
                    if (this._bDialogWithSuggestionsInitialized) {
                        // Re-set the tokens from the input and update the table
                        oDialogSuggestions.setTokens([]);
                        oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
                        oDialogSuggestions.update();

                        oDialogSuggestions.open();
                        return;
                    }
                    this.getView().addDependent(oDialogSuggestions);

                    // Set key fields for filtering in the Define Conditions Tab
                    oDialogSuggestions.setRangeKeyFields([{
                        label: "Product Code",
                        key: "Product",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);

                    // Set Basic Search for FilterBar
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldWithSuggestions);

                    // Trigger filter bar search when the basic search is fired
                    this._oBasicSearchFieldWithSuggestions.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialogSuggestions.getTableAsync().then(function (oTable) {

                        oTable.setModel(this.oProductsModel);

                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            // Bind rows to the ODataModel and add columns
                            oTable.bindAggregation("rows", {
                                urlParameters: { "$top": "500000" },
                                path: "/MATERIAL",
                                events: {
                                    dataReceived: function () {
                                        oDialogSuggestions.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label: "Product Code", template: "Product" }));
                            oTable.addColumn(new UIColumn({ label: "Product Name", template: "DESCRIPTION" }));
                        }

                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            oTable.bindAggregation("items", {
                                urlParameters: { "$top": "500000" },
                                path: "/MATERIAL",
                                template: new ColumnListItem({
                                    cells: [new Label({ text: "{Product}" }), new Label({ text: "{DESCRIPTION}" })]
                                }),
                                events: {
                                    dataReceived: function () {
                                        oDialogSuggestions.update();
                                    }
                                }
                            });
                            oTable.addColumn(new MColumn({ header: new Label({ text: "Product Code" }) }));
                            oTable.addColumn(new MColumn({ header: new Label({ text: "Product Name" }) }));
                        }
                        oDialogSuggestions.update();
                    }.bind(this));

                    oDialogSuggestions.setTokens(this._oMultiInputWithSuggestions.getTokens());
                    this._bDialogWithSuggestionsInitialized = true;
                    oDialogSuggestions.open();
                }.bind(this));
            },
            onOpenDialog: function () {

                // create dialog lazily
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "sap.ui.demo.walkthrough.view.HelloDialog"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            handlef4: function () {
                var that = this;
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                // var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput = sap.ui.getCore().byId("material");
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("material", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        ok: function (oEvent) {
                            //  var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Material;
                            // dataModel.setProperty("/value", valueset);
                            //   var ansh = that.byId("material").setValue(valueset);
                            // that.getView().byId("packingtype").setText(valueset);
                            //  this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    // filterBarExpanded: false,
                    filterBarExpanded: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Material", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "ProductName", control: new sap.m.Input() })],

                    search: function (oEvt) {
                        // var oParams = oEvt.getParameter("purchase_ordentity");
                        // var mater = oEvt.mParameters.selectionSet[0].mProperties.value;
                        // var mDESC = oEvt.mParameters.selectionSet[1].mProperties.value;
                        oTable.bindRows({
                            path: "/purchase_ordentity"
                        });
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Material", template: "Material" },
                        { label: "ProductName", template: "ProductName" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/Y1416_GATE/");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },
            onValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableItemModel').getPath();
                var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zgateentry.fragments.VendorValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog(this.oSource);
                    if (sKey === 'VC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>SupplierName}",
                            description: "{oGenericModel>Supplier}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/VendorValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Vendor");
                    } else if (sKey === 'MC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>DESCRIPTION}",
                            description: "{oGenericModel>Product}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/MaterialValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    }
                    else if (sKey === 'CC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>Customer}",
                            description: "{oGenericModel>CustomerName}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/VendorValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Customer");
                    }

                    oValueHelpDialog.open();
                }.bind(this));
            },
            _configValueHelpDialog: function (oSource) {
                var sInputValue = oSource.getValue(),
                    oModel = this.getView().getModel('oGenericModel'),
                    sKey = oSource.getCustomData()[0].getKey();
                if (sKey === 'VC') {
                    var aData = oModel.getProperty("/VendorValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.SupplierName === sInputValue);
                    });
                    oModel.setProperty("/VendorValueHelp", aData);
                } else if (sKey === 'MC') {
                    var aData = oModel.getProperty("/MaterialValueHelp");
                    // var aData = oModel.getProperty("/VendorValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Product === sInputValue);
                    });
                    oModel.setProperty("/VendorValueHelp", aData);
                }
                else
                    if (sKey === 'VC') {
                        var aData = oModel.getProperty("/Customer");
                        aData.forEach(function (oData) {
                            oData.selected = (oData.SupplierName === sInputValue);
                        });
                        oModel.setProperty("/VendorValueHelp", aData);
                    }

            },
            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                //this.oSource = this.byId("productInput");
                if (!oSelectedItem) {
                    this.oSource.resetProperty("value");
                    return;
                }
                if (sPath.search('/MaterialValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Matnr = oObject.DESCRIPTION;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Lpnum = oObject.HSN;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                } else if (sPath.search('/VendorValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Name1 = oObject.SupplierName;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Address1 = oObject.Addrress;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                }
                else if (sPath.search('/CustomerValueHelp') !== -1) {
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Name1 = oObject.CustomerName;
                    this.getView().getModel('oTableItemModel').getProperty(this.sPath).Address1 = oObject.CustomerFullName;
                    this.getView().getModel('oTableItemModel').setProperty(this.sPath, this.getView().getModel('oTableItemModel').getProperty(this.sPath));
                }


                this.oSource.setValue(oSelectedItem.getDescription());
            },
            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                if (oEvent.getParameter('itemsBinding').getPath() === '/VendorValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Supplier", FilterOperator.Contains, sValue),
                        new Filter("SupplierName", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Supplier", FilterOperator.Contains, sValue);
                    // var oFilter = new Filter("SupplierName", FilterOperator.Contains, sValue);
                } else if (oEvent.getParameter('itemsBinding').getPath() === '/MaterialValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Product", FilterOperator.Contains, sValue),
                        new Filter("DESCRIPTION", FilterOperator.Contains, sValue)
                    ])
                    // var oFilter = new Filter("Product", FilterOperator.Contains, sValue);
                }
                else if (oEvent.getParameter('itemsBinding').getPath() === '/CustomerValueHelp') {
                    var oFilter = new Filter([
                        new Filter("Customer", FilterOperator.Contains, sValue),
                        new Filter("CustomerName", FilterOperator.Contains, sValue)
                    ])

                }
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            onValueHelpRequest1: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableItemModel').getPath();
                var sKey = this.oSource.getCustomData()[0].getKey();
                if (!this._pValueHelpDialog) {
                    this._pValueHelpDialog = Fragment.load({
                        id: oView.getId(),
                        name: "zgateentry.fragments.CustomerValueHelp",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        oView.addDependent(oValueHelpDialog);
                        return oValueHelpDialog;
                    });
                }
                this._pValueHelpDialog.then(function (oValueHelpDialog) {
                    this._configValueHelpDialog1(this.oSource);
                    if (sKey === 'CC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>CustomerName}",
                            description: "{oGenericModel>Customer}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/CustomerValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Customer");
                    } else if (sKey === 'MC') {
                        var oTemplate = new sap.m.StandardListItem({
                            title: "{oGenericModel>DESCRIPTION}",
                            description: "{oGenericModel>Product}",
                            type: "Active"
                        });
                        oValueHelpDialog.bindAggregation("items", {
                            path: 'oGenericModel>/MaterialValueHelp',
                            template: oTemplate
                        });
                        oValueHelpDialog.setTitle("Select Material");
                    }

                    oValueHelpDialog.open();
                }.bind(this));
            },
            _configValueHelpDialog1: function (oSource) {
                var sInputValue = oSource.getValue(),
                    oModel = this.getView().getModel('oGenericModel'),
                    sKey = oSource.getCustomData()[0].getKey();
                if (sKey === 'CC') {
                    var aData = oModel.getProperty("/CustomerValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Customer === sInputValue);
                    });
                    oModel.setProperty("/CustomerValueHelp", aData);
                } else if (sKey === 'MC') {
                    var aData = oModel.getProperty("/MaterialValueHelp");
                    aData.forEach(function (oData) {
                        oData.selected = (oData.Product === sInputValue);
                    });
                    oModel.setProperty("/MaterialValueHelp", aData);
                }

            },
            handleSuggest: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Supplier", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },
            handleSuggest1: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("Product", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },
            handleSuggest2: function (oEvent) {
                var oModel = this.getView().getModel();
                oModel.setSizeLimit(100000);
                var sTerm = oEvent.getParameter("value");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("DESCRIPTION", sap.ui.model.FilterOperator.StartsWith, sTerm));
                }
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },
            searchSupplier: function (oEvent) {
                var oModel = this.getView().getModel();
                var oValue = oEvent.getSource().getValue();
                var oFilter = new sap.ui.model.Filter("Supplier", "EQ", oValue);
                var oTableModel = this.getView().getModel('oTableItemModel').getProperty('/aTableItem');
                var sPath = "/aTableItem/";
                oModel.read('/SUPPLIER', {
                    urlParameters: { "$top": "500000" },
                    filters: [oFilter],
                    success: function (oresponse) {
                        for (var i = 0; i < oTableModel.length; i++) {
                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Name1 = oresponse.results[0].SupplierName;
                            this.getView().getModel('oTableItemModel').setProperty(sPath + i, this.getView().getModel('oTableItemModel').getProperty(sPath + i));
                        }
                    }.bind(this)
                })
            },
            searchMaterial: function (oEvent) {
                var oModel = this.getView().getModel();
                var oValue = oEvent.getSource().getValue();
                var oFilter = new sap.ui.model.Filter("Product", "EQ", oValue);
                var oTableModel = this.getView().getModel('oTableItemModel').getProperty('/aTableItem');
                var sPath = "/aTableItem/";
                oModel.read('/MATERIAL', {
                    urlParameters: { "$top": "500000" },
                    filters: [oFilter],
                    success: function (oresponse) {
                        for (var i = 0; i < oTableModel.length; i++) {

                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Maktx = oresponse.results[0].DESCRIPTION;
                            this.getView().getModel('oTableItemModel').getProperty(sPath + i).Lpnum = oresponse.results[0].HSN;
                            this.getView().getModel('oTableItemModel').setProperty(sPath + i, this.getView().getModel('oTableItemModel').getProperty(sPath + i));

                        }
                    }.bind(this)
                })
            },

        });
    });