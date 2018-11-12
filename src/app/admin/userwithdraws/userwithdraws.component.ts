import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import { SharedService } from "../../utility/shared-service/shared.service";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { WalletService } from '../../utility/shared-service/wallet.service';
import { CommonRegexp } from "../../utility/constants/validations";
import { UserService } from "../../utility/shared-service/user.service";
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'app-userwithdraws',
  templateUrl: './userwithdraws.component.html',
  styleUrls: ['./userwithdraws.component.css'],
  providers: [WalletService, UserService, CommonService],
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
export class UserwithdrawsComponent extends BaseComponent implements OnInit {
  WalletWithdrawals: any[]
  ApprovedList: any[]
  RejectedList: any[]
  listOfTransferStatus: any[]
  isShowModal: number = 1;
  fdFundRequest: FormGroup;
  frmTransferFunds: FormGroup;
  frmWithdrawFunds: FormGroup;
  selectedRow: any;
  lstFranchise: any;
  lstFndRqstStatus: any;
  selectedRequestedAmount: any;
  ToUserDetails: any;
  UserDetails: any;
  walletBalance: string;
  walletHoldBalance: string = "0";
  loadBalance: boolean = false;
  OriginalLoanAmountPay: any;
  requestedAmount: any;
  approvedAmount: any;

  constructor(private fb: FormBuilder, private walletServ: WalletService,
    private sharedService: SharedService,
    public toastr: ToastsManager, private apiManager: APIManager,
    private userService: UserService,
    private commonService: CommonService,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.walletBalance = this.sharedService.getWalletBalance();
    this.walletHoldBalance = this.sharedService.getWalletHoldBalance();
    this.GetLoanTransferStatus();
    this.getWithdrawalTransactions();
    this.getRejectedWithdrawalTransactions();
    this.getApprovedWithdrawalTransactions();
  }

  createWithdrawFundsForm() {
    this.frmWithdrawFunds = this.fb.group({
      ID:new FormControl(''),
      AvlBalance: this.walletBalance,
      WithdrawAmount: ['', Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.walletBalance), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      TransferStatusID: new FormControl(null, Validators.compose([Validators.required])),
      Purpose: new FormControl(''),
    })
  }

  EditWithdrawals(rowIndex) {
    this.isShowModal = 4;
    this.createWithdrawFundsForm();
    this.selectedRow = this.WalletWithdrawals[rowIndex];
    this.frmWithdrawFunds.patchValue({
      ID: this.selectedRow.ID,
      AvlBalance: this.walletBalance,
      WithdrawAmount: this.selectedRow.WithdrawAmount,      
      Purpose: this.selectedRow.Purpose
    })
    this.frmWithdrawFunds.controls["TransferStatusID"].setValue(this.selectedRow.TransferStatusID, { onlySelf: true })
  }

  public getWithdrawalTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getPendingWithdrawalTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.WalletWithdrawals = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }
  public getRejectedWithdrawalTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getRejectedWithdrawalTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.RejectedList = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }
   SubmitWithdrawFunds(frmWithdrawFunds, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.UPDATEWITHDRAWFUNDS, frmWithdrawFunds).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmWithdrawFunds.reset();
          this.ngOnInit();
          //this.getWalletBalance();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while transfer funds.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }
  public getApprovedWithdrawalTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getApprovedWithdrawalTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.ApprovedList = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }
  
  closeForm() {
    this.isShowModal = 1;
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

  public getWalletBalance() {
    this.commonService._getWalletBalance().then((response: any) => {
      if (response.m_Item1) {
        this.walletBalance = response.m_Item3.Balance;
        this.walletHoldBalance = response.m_Item3.HoldAmount;
        this.sharedService.setWalletBalance(this.walletBalance);
        this.sharedService.setWalletHoldBalance(this.walletHoldBalance);
      }
      this.loadBalance = response.m_Item1;
    }, err => {
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
