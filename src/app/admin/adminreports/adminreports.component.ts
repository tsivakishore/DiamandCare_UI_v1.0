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
import { CommonService } from '../../utility/shared-service/common.service';
var jsPDF = require('jspdf');
require('jspdf-autotable');
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as CellObject from 'xlsx'
import { write } from 'xlsx-style';

@Component({
  selector: 'app-adminreports',
  templateUrl: './adminreports.component.html',
  styleUrls: ['./adminreports.component.css'],
  providers: [ReportsService, CommonService],
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

export class AdminreportsComponent extends BaseComponent implements OnInit {
  adminReportsForm: FormGroup;
  lstUserStatus: any[] = [];
  currentDate: string;
  minFromDate: Date;
  maxFromDate: Date;
  minToDate: Date;
  maxToDate: Date;
  EXCEL_EXTENSION: string = 'xlsx';
  defaultStatus: string = "";
  data: any[];
  cols: any[];

  constructor(private fb: FormBuilder,
    private sharedService: SharedService,
    private reportsService: ReportsService,
    private apiManager: APIManager,
    private commonService: CommonService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createAdminReportsFormGroup();
    this.getUserStatus();
    let today = new Date();
    this.minToDate = today;
    this.maxToDate = today;
    this.currentDate = this.converDate(today);
    this.adminReportsForm.patchValue({
      FromDate: this.currentDate,
      ToDate: this.currentDate,
      //UserStatus: this.defaultStatus
    })

  }

  createAdminReportsFormGroup() {
    this.adminReportsForm = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      UserStatusID: ['']
    })
  }

  public getUserStatus() {
    this.sharedService.setLoader(true);
    this.commonService._getUserStatus().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        debugger;
        this.lstUserStatus = res.m_Item3;
        this.lstUserStatus.push({ UserStatusID: 0, Status: 'All', Description: 'All' })
        //this.defaultStatus = 'All';
        this.adminReportsForm.controls['UserStatusID'].setValue(0, { onlySelf: true });
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }
  get dataLength() {
    return this.data ? this.data.length : 0
  }
  FromDateChange(fromDate: Date) {
    this.minToDate = fromDate;
    this.maxToDate = new Date();
    this.maxFromDate = new Date();
    this.adminReportsForm.patchValue({
      FromDate: this.converDate(fromDate)
    })
  }

  ToDateChange(toDate: Date) {
    this.adminReportsForm.patchValue({
      ToDate: this.converDate(toDate)
    })
  }

  converDate(date: Date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }
  
  DownloadExcelReports(formParam, isValid) {
    if (isValid) {
      this.buildColumns();
      this.apiManager.postAPI(API.DOWNLOADUSERREPORTS, formParam).subscribe((response: any) => {
        if (!!response && response.length > 0) {
          this.data = response;
          // let date = new Date();
          // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response);
          // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          // XLSX.writeFile(workbook, formParam.ReportType + '_' + date.getDate() + (date.getMonth() + 1) + date.getFullYear() + '_' + date.getTime() + '.' + this.EXCEL_EXTENSION, { bookType: 'xlsx', type: 'buffer' });
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

  DownloadAllExcelReports() {    
      this.buildColumns();
      this.apiManager.getAPI(API.DOWNLOADALLUSERREPORTS).subscribe((response: any) => {
        if (!!response && response.length > 0) {
          this.data = response;         
        }
        else
          this.toastr.error('No records found');
      }, err => {
        console.log(err);
        this.toastr.error("Error while downloading report.Please try again.");
      });  
  }

  buildColumns() {
    this.cols = [
      { field: 'UserName', header: 'User Name' },
      { field: 'FirstName', header: 'First Name' },
      { field: 'LastName', header: 'Last Name' },
      { field: 'DcID', header: 'DcID' },
      { field: 'Email', header: 'Email' },
      { field: 'PhoneNumber', header: 'Phone Number' },
      { field: 'FatherName', header: 'Father Name' },
      { field: 'AadharNumber', header: 'Aadhar Number' },
      { field: 'SponserName', header: 'Sponser Name' },
      { field: 'UnderName', header: 'Under Name' },
      { field: 'RegisterFrom', header: 'Register From' },
      { field: 'CreatedDate', header: 'Created Date' },
      { field: 'SecretKey', header: 'Secret Key' },
      { field: 'UserStatus', header: 'User Status' },
      { field: 'LoanWaiveOff', header: 'Loan WaiveOff' },
      { field: 'IsSponserJoineesReq', header: 'Sponser Joinees Req' }
    ];
  }
}
