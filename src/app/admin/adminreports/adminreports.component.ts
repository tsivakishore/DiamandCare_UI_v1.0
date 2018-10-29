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
  lstUserStatus: any;
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
      ToDate: this.currentDate
    })

  }

  createAdminReportsFormGroup() {
    this.adminReportsForm = this.fb.group({
      FromDate: [''],
      ToDate: [''],
      UserStatus: ['']
    })
  }

  public getUserStatus() {
    this.sharedService.setLoader(true);
    this.commonService._getUserStatus().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        debugger;
        this.lstUserStatus = res.m_Item3;
        this.defaultStatus = this.lstUserStatus[0].UserStatusID;
        this.adminReportsForm.controls['ReportType'].setValue(this.defaultStatus, { onlySelf: true });
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  converDate(date: Date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
