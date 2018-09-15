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
  todayDate: string;
  minFromDate: Date;
  maxFromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  EXCEL_EXTENSION: string = 'xlsx';
  defaultReportTypeID: number;

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
    this.todayDate = this.converDate(today);
    this.reportsForm.patchValue({
      FromDate: this.todayDate,
      ToDate: this.todayDate
    })
  }

  createReportsFormGroup() {
    this.reportsForm = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      ReportTypeID: ['']
    })
  }

  public getReportTypes(LoginType: string) {
    this.sharedService.setLoader(true);
    this.reportsService._getgetReportTypes(LoginType).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        debugger;
        this.lstReportTypes = res.m_Item3;
        this.reportsForm.controls['ReportTypeID'].setValue(1, { onlySelf: true });
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public DownloadPDFReports(formParam, isValid) {
    var rows = [];
    var columns = ["Id", "TypeID", "Accnt", "Amnt", "Start", "End", "Contrapartida", "ToUserID", "SharedUserID"];
    this.sharedService.setLoader(true);
    this.reportsService._getSharedSecretKeyByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        res.m_Item3.forEach(element => {
          debugger;
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

  DownloadExcelReports(formParam, isValid) {
    debugger;
    if (isValid) {
      this.reportsService._getSharedSecretKeyByUserID().subscribe((response: any) => {
        if (response.m_Item1) {
          debugger;
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response.m_Item3);
          const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          XLSX.writeFile(workbook, 'my_file.' + this.EXCEL_EXTENSION, { bookType: 'xlsx', type: 'buffer' });
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        console.log(err);
        this.toastr.error("Error while downloading report.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  exportAsXLSX() { }

  FromDateChange(fromDate: Date) {
    this.minToDate = fromDate;
    let toMindate = this.converDate(fromDate);
    this.reportsForm.patchValue({
      ToDate: toMindate
    })
  }

  converDate(date: Date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  fileDownloader(documentContent, documentName, contentType) {
    debugger;
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
