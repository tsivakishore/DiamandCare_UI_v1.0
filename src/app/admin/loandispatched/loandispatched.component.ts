import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { CommonService } from "../../utility/shared-service/common.service";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as CellObject from 'xlsx'
import { write } from 'xlsx-style';

@Component({
  selector: 'app-loandispatched',
  templateUrl: './loandispatched.component.html',
  styleUrls: ['./loandispatched.component.css'],
  providers: [LoanEarnsService, CommonService],
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
    slideUp
  ]
})

export class LoandispatchedComponent extends BaseComponent implements OnInit {
  @ViewChild('txtSearcByLoanId') txtSearcByLoanId: ElementRef;
  isShowModal: number = 1;

  listOfTransferPendingLoans: any[];
  listOfTransferPendingLoansDownload: any[];
  listOfTransferedLoans: any[];
  listOfTransferRejectedLoans: any[];
  listOfTransferStatus: any[];
  loanTransferStatusForm: FormGroup;
  selectedRow: any;
  loanID: number;
  OriginalTransferPendingLoans: any[];
  OriginalTransferedLoans: any[];
  OriginalTransferRejectedLoans: any[];
  EXCEL_EXTENSION: string = 'xlsx';

  constructor(private sharedService: SharedService,
    private loanEarnsService: LoanEarnsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.GetLoanTransferStatus();
    this.createTransferStatusForm();
    this.GetAllTransferPendingLoans();
    this.GetAllTransferedLoans();
    this.GetAllTransferRejectedLoans();
  }

  createTransferStatusForm() {
    this.loanTransferStatusForm = this.fb.group({
      ID: ['', Validators.compose([Validators.required])],
      TransferStatusID: [''],
      LoanID: [''],
      UserID: [''],
    })
  }

  public GetAllTransferPendingLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoansAmountTransferPending().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfTransferPendingLoans = [];
        this.listOfTransferPendingLoans = res.m_Item3;
      }
      else {
        this.listOfTransferPendingLoans = [];
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetAllTransferedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoansAmountTransfered().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfTransferedLoans = [];
        this.listOfTransferedLoans = res.m_Item3;
      }
      else {
        this.listOfTransferedLoans = [];
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public downloadTransferPendingLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoansAmountTransferedDownload().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfTransferPendingLoansDownload = [];
        this.listOfTransferPendingLoansDownload = res.m_Item3;

        let date = new Date();
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listOfTransferPendingLoansDownload);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, 'TransferPendingLoans_' + date.getDate() + (date.getMonth() + 1) + date.getFullYear() + '_' + date.getTime() + '.' + this.EXCEL_EXTENSION, { bookType: 'xlsx', type: 'buffer' });

      }
      else {
        this.listOfTransferPendingLoansDownload = [];
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetAllTransferRejectedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoansAmountTransferRejectedLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfTransferRejectedLoans = [];
        this.listOfTransferRejectedLoans = res.m_Item3;
      }
      else {
        this.listOfTransferRejectedLoans = [];
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetLoanTransferStatus() {
    this.commonService._getLoanTransferStatus().subscribe((res: any) => {
      if (res.m_Item1) {
        this.listOfTransferStatus = res.m_Item3;
      }
    }, err => {
      console.log(err);
    })
  }

  LoanTransferSattus(formLoanTransferStatus, isValidForm) {
    if (isValidForm) {
      formLoanTransferStatus.UserID = this.selectedRow.UserID;
      formLoanTransferStatus.TransferStatusID = formLoanTransferStatus.ID;
      formLoanTransferStatus.LoanID = this.selectedRow.LoanID;
      this.apiManager.postAPI(API.GETTRANSFERAPPROVALSTATUS, formLoanTransferStatus).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.GetAllTransferPendingLoans();
          this.GetAllTransferedLoans();
          this.GetAllTransferRejectedLoans();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying health benefits.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  onShowTransferModal(rowIndex) {
    this.selectedRow = this.listOfTransferPendingLoans[rowIndex];
    this.createTransferStatusForm();
    this.isShowModal = 2;
  }

  Refresh() {
    this.GetAllTransferPendingLoans();
    this.GetAllTransferedLoans();
    this.GetAllTransferRejectedLoans();
    this.txtSearcByLoanId.nativeElement.value = '';
  }

  colorCodeRenew() {
    return "btntransfer";
  }

  onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.sharedService.setLoader(true);
      this.getTransferPendingLoansByDCICorName(searchValue);
      this.getTransferedLoansByDCICorName(searchValue);
      this.getTransferRejectedLoansByDCICorName(searchValue);
      this.sharedService.setLoader(false);
    }
  }

  getTransferPendingLoansByDCICorName(searchValue: string) {
    this.loanEarnsService._gettTransferPendingLoansByDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfTransferPendingLoans = res.m_Item3;
      }
      else {
        this.listOfTransferPendingLoans = [];
      }
    }, err => {

    })
  }

  getTransferedLoansByDCICorName(searchValue: string) {
    this.loanEarnsService._gettTransferedLoansByDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfTransferedLoans = res.m_Item3;
      }
      else {
        this.listOfTransferedLoans = [];
      }
    }, err => {
      this.listOfTransferedLoans = [];
    })
  }

  getTransferRejectedLoansByDCICorName(searchValue: string) {
    this.loanEarnsService._gettTransferRejectedLoansByDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfTransferRejectedLoans = res.m_Item3;
      }
      else {
        this.listOfTransferRejectedLoans = [];
      }
    }, err => {
      this.listOfTransferRejectedLoans = [];
    })
  }

  getFormattedDate(date1) {
    var date = new Date(date1);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + month + '-' + year;
  }
}
