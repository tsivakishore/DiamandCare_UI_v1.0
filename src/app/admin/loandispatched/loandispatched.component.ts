import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import * as moment from 'moment';
import { Message } from "primeng/primeng";
import { style, transition, animate, trigger } from "@angular/animations";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { CommonService } from "../../utility/shared-service/common.service";

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
  isShowModal: number = 1;

  listOfTransferPendingLoans: any[];
  listOfTransferStatus: any[];
  loanTransferStatusForm: FormGroup;
  selectedRow: any;

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
    this.GetAllTransferPendingLoans();
    this.GetLoanTransferStatus();
    this.createTransferStatusForm();
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
        this.listOfTransferPendingLoans = res.m_Item3;
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
      debugger;
      formLoanTransferStatus.UserID = this.selectedRow.UserID;
      formLoanTransferStatus.TransferStatusID = formLoanTransferStatus.ID;
      formLoanTransferStatus.LoanID = this.selectedRow.LoanID;
      this.apiManager.postAPI(API.GETTRANSFERAPPROVALSTATUS, formLoanTransferStatus).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
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
    debugger;
    this.createTransferStatusForm();
    this.isShowModal = 2;
  }

  colorCodeRenew() {
    return "btntransfer";
  }

}
