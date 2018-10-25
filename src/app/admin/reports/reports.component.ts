import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { TranslateService } from "../../utility/translate/translate.service";
import { API } from "../../utility/constants/api";
import { SharedService } from "../../utility/shared-service/shared.service";
import { ReportsService } from '../../utility/shared-service/reports.service';
var jsPDF = require('jspdf');
require('jspdf-autotable');
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as CellObject from 'xlsx'
import { write } from 'xlsx-style';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [ReportsService],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.8, .8, .8)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ]),
    slideUp, dialog
  ]
})

export class ReportsComponent extends BaseComponent implements OnInit {

  reportsForm: FormGroup;
  Title: string;
  lstReportTypes: any;
  LoginType: string;
  currentDate: string;
  minFromDate: Date;
  maxFromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  EXCEL_EXTENSION: string = 'xlsx';
  defaultReportType: string = "";
  data: any[];
  cols: any[];

  constructor(private fb: FormBuilder,
    private sharedService: SharedService,
    private reportsService: ReportsService,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
    this.LoginType = this.sharedService.getLoginType();
  }

  ngOnInit() {
    this.Title = "Reports";
    this.createReportsFormGroup();
    this.getReportTypes(this.LoginType);
    let today = new Date();
    this.minToDate = today;
    this.maxToDate = today;
    this.currentDate = this.converDate(today);
    this.reportsForm.patchValue({
      FromDate: this.currentDate,
      ToDate: this.currentDate
    })
  }

  createReportsFormGroup() {
    this.reportsForm = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      ReportType: [this.defaultReportType]
    })
  }

  public getReportTypes(LoginType: string) {
    this.sharedService.setLoader(true);
    this.reportsService._getgetReportTypes(LoginType).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstReportTypes = res.m_Item3;
        this.defaultReportType = this.lstReportTypes[0].ReportDescription;
        this.reportsForm.controls['ReportType'].setValue(this.defaultReportType, { onlySelf: true });
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  DownloadExcelReports(formParam, isValid) {
    if (isValid) {
      if (formParam.ReportType == "")
        formParam.ReportType = this.defaultReportType;
      this.buildColumns(formParam.ReportType);
      this.apiManager.postAPI(API.DOWNLOADREPORTS, formParam).subscribe((response: any) => {
        if (!!response && response.length > 0) {
          this.data = response;
          let date = new Date();
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
          const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          XLSX.writeFile(workbook, formParam.ReportType + '_' + date.getDate() + (date.getMonth() + 1) + date.getFullYear() + '_' + date.getTime() + '.' + this.EXCEL_EXTENSION, { bookType: 'xlsx', type: 'buffer' });
        }
        else
          this.toastr.error('No records found');
      }, err => {
        console.log(err);
        this.toastr.error("Error while downloading report.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  buildColumns(reportType: string) {
    if (reportType === "All Loan Payments") {
      this.cols = [
        { field: 'vin', header: 'Vin' },
        { field: 'year', header: 'Year' },
        { field: 'brand', header: 'Brand' },
        { field: 'color', header: 'Color' }
      ];
    }
    else if (reportType === "Loan Payments") {

    }
    else if (reportType === "All Loan Details") {

    }
    else if (reportType === "Loan Details") {

    }
    else if (reportType === "All Used Secret Keys") {

    }
    else if (reportType === "Used Secret Keys") {

    }
    else if (reportType === "All Issued Secret Keys") {

    }
    else if (reportType === "Issued Secret Keys") {

    }
    else if (reportType === "All Wallet Transactions") {

    }
    else if (reportType === "Wallet Transactions") {

    }
    else if (reportType === "Transfer Payments") {

    }
    else if (reportType === "All Commissions Log") {

    }
    else if (reportType === "Commissions Log") {

    }
  }

  private wrapAndCenterCell(cell: XLSX.CellObject) {
    const wrapAndCenterCellStyle = { font: { bold: true }, fill: { fgColor: { rgb: "ff6600" } } };
    this.setCellStyle(cell, wrapAndCenterCellStyle);
  }

  private setCellStyle(cell, style: {}) {
    cell.s = style;
  }

  public DownloadPDFReports(formParam, isValid) {
    var rows = [];
    var columns = ["Id", "TypeID", "Accnt", "Amnt", "Start", "End", "Contrapartida", "ToUserID", "SharedUserID"];
    this.sharedService.setLoader(true);
    this.reportsService._getSharedSecretKeyByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        res.m_Item3.forEach(element => {
          var temp = [element.CreatedBy, element.RegKey, element.KeyCost, element.KeyType, element.PhoneNumber,
          element.CreateDate, element.RegKeyStatus, element.ToUserID, element.SharedUserID,];
          rows.push(temp);
        });
        console.log(rows)
        var doc = new jsPDF();
        doc.autoTable(columns, rows);
        doc.save('table.pdf');
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  FromDateChange(fromDate: Date) {
    this.minToDate = fromDate;
    this.maxToDate = new Date();
    this.maxFromDate = new Date();
    this.reportsForm.patchValue({
      FromDate: this.converDate(fromDate)
    })
  }

  ToDateChange(toDate: Date) {
    this.reportsForm.patchValue({
      ToDate: this.converDate(toDate)
    })
  }

  converDate(date: Date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  fileDownloader(documentContent, documentName, contentType) {
    var ieEDGE = navigator.userAgent.match(/Edge/g);
    var ie = navigator.userAgent.match(/.NET/g); // IE 11+
    var oldIE = navigator.userAgent.match(/MSIE/g);

    var blob = new window.Blob([documentContent], { type: contentType });

    if (ie || oldIE || ieEDGE) {

      var fileName = documentName;
      window.navigator.msSaveBlob(blob, fileName);
    }
    else {

      var file = new Blob([documentContent], {
        type: contentType
      });
      var fileURL = URL.createObjectURL(file);

      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
    }
  }
}
