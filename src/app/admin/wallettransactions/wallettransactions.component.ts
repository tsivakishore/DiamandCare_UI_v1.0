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
  selector: 'app-wallettransactions',
  templateUrl: './wallettransactions.component.html',
  styleUrls: ['./wallettransactions.component.css'],
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

export class WallettransactionsComponent extends BaseComponent implements OnInit {
  WalletExpensesList: any[]
  FundsRequestList: any[]
  WalletWithdrawals: any[]
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
    this.getWalletTransactions();
    this.getFundsRequestByOthersDetails();
    this.getFundRequestStatus();
  }

  public getWalletTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getWalletTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.WalletExpensesList = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public getWithdrawalTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getWalletTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.WalletWithdrawals = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  createFundsRequestForm() {
    this.fdFundRequest = this.fb.group({
      ID: new FormControl(''),
      RequestedAmount: ['', Validators.compose([Validators.required])],
      RequestToUserID: new FormControl(''),
      RequestStatusID: new FormControl(''),
      ApprovedAmount: ['', Validators.compose([Validators.required, Validators.min(1.00), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])]
    })
  }

  createTransferFundsForm() {
    this.frmTransferFunds = this.fb.group({
      TransferFrom: new FormControl(''),
      TransferTo: ['', Validators.compose([Validators.required])],
      RequestToUserID: new FormControl(''),
      TransferToName: new FormControl(''),
      ApprovedAmount: ['', Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.walletBalance), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
    })
  }

  createWithdrawFundsForm() {
    this.frmWithdrawFunds = this.fb.group({
      AvlBalance: this.walletBalance,
      WithdrawTo: ['', Validators.compose([Validators.required])],
      RequestToUserID: new FormControl(''),
      WithdraweeName: new FormControl(''),
      WithdrawAmount: ['', Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.walletBalance), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      Purpose: new FormControl(''),
      UserID: new FormControl('')
    })
  }

  public getFundsRequestByOthersDetails() {
    this.sharedService.setLoader(true);
    this.walletServ._getFundrequest().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.FundsRequestList = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  onChangeApprovedAmount(searchValue: string) {
    if (!!searchValue) {
      this.fdFundRequest.controls['ApprovedAmount'].setValidators(Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.selectedRequestedAmount), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)]));
      this.fdFundRequest.get('ApprovedAmount').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  onChangeTransferAmount(searchValue: string) {
    if (!!searchValue) {
      this.frmTransferFunds.controls['ApprovedAmount'].setValidators(Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.walletBalance), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)]));
      this.frmTransferFunds.get('ApprovedAmount').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }
  onChangeWithdrawAmount(searchValue: string) {
    if (!!searchValue) {
      this.frmWithdrawFunds.controls['AvlBalance'].setValidators(Validators.compose([Validators.required, Validators.min(1.00), Validators.max(this.walletBalance), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)]));
      this.frmWithdrawFunds.get('AvlBalance').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  EditFundRequest(rowIndex) {
    this.isShowModal = 2;
    this.createFundsRequestForm();
    this.selectedRow = this.FundsRequestList[rowIndex];
    let requestStatusId = this.selectedRow.RequestStatusID;
    this.selectedRequestedAmount = this.selectedRow.RequestedAmount;
    this.fdFundRequest.patchValue({
      ID: this.selectedRow.ID,
      RequestedAmount: this.selectedRow.RequestedAmount,
      RequestToUserID: this.selectedRow.RequestToUserID,
    })
    this.fdFundRequest.controls['RequestStatusID'].setValue(requestStatusId, { onlySelf: true })
  }

  ApproveRequestFunds(frmdata, isValidForm) {
    if (isValidForm) {
      this.requestedAmount = frmdata.RequestedAmount;
      this.approvedAmount = frmdata.ApprovedAmount;

      if (!!this.walletBalance && !!this.approvedAmount) {
        if (this.walletBalance < this.approvedAmount) {
          this.toastr.error("Wallet Balance is insufficient");
          this.sharedService.setLoader(false);
          return;
        }
      }

      if (!!this.requestedAmount && !!this.approvedAmount) {
        if (this.approvedAmount > this.requestedAmount) {
          this.toastr.error("Allowed to send max of " + this.requestedAmount + ". Please enter correct amount to send.");
          this.sharedService.setLoader(false);
          return;
        }
      }

      this.apiManager.postAPI(API.APPROVEFUNDSREQUEST, frmdata).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.fdFundRequest.reset();
          this.getFundsRequestByOthersDetails();
          this.getWalletTransactions();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
        this.getWalletBalance();
      }, err => {
        this.isShowModal = 1;
        this.getWalletBalance();
        this.toastr.error("Oops! There has been an error while approve request funds.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  closeForm() {
    this.isShowModal = 1;
  }

  public getFundRequestStatus() {
    this.walletServ._getFundrequestStatus().subscribe((res: any) => {
      if (res.m_Item1) {
        this.lstFndRqstStatus = res.m_Item3;
      }
    })
  }

  public onChangeUsernameByDCIDorName(DCIDorName, name) {
    this.sharedService.setLoader(true);
    if (DCIDorName != "") {
      this.userService._getUserDetailsByDCIDorName(DCIDorName).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.ToUserDetails = res.m_Item3;
          if (name == 'Transfer') {
            this.frmTransferFunds.patchValue({
              TransferFrom: this.UserDetails.UserName,
              TransferTo: this.ToUserDetails.UserName,
              RequestToUserID: this.ToUserDetails.UserID,
              TransferToName: this.ToUserDetails.FirstName + ' ' + this.ToUserDetails.LastName
            })
          }
          if (name == 'Withdraw') {
            this.frmWithdrawFunds.patchValue({
              UserID: this.ToUserDetails.UserID,
              WithdrawTo: this.ToUserDetails.UserName,
              WithdraweeName: this.ToUserDetails.FirstName + ' ' + this.ToUserDetails.LastName
            })
          }

        }
        else {
          if (name == 'Transfer') {
            this.frmTransferFunds.patchValue({
              TransferTo: '',
              TransferToName: ''
            })
          }
          if (name == 'Withdraw') {
            this.frmWithdrawFunds.patchValue({
              WithdrawTo: '',
              WithdraweeName: ''
            })
          }
          this.toastr.error("Please provide valid user name or DCID");
        }
      }, err => {
        this.sharedService.setLoader(false);
      })
    }
    else {
      if (name == 'Transfer') {
        this.frmTransferFunds.patchValue({
          TransferTo: '',
          TransferToName: ''
        })
      }
      if (name == 'Withdraw') {
        this.frmWithdrawFunds.patchValue({
          WithdrawTo: '',
          WithdraweeName: ''
        })
      }
    }
  }

  OpenFundsTransferPopup() {
    this.isShowModal = 3;
    this.createTransferFundsForm();
    this.frmTransferFunds.patchValue({
      TransferFrom: this.UserDetails.UserName
    })
  }
  OpenWithdrawFundsPopup() {
    this.isShowModal = 4;
    this.createWithdrawFundsForm();
    this.frmWithdrawFunds.patchValue({
      AvlBalance: this.walletBalance,
      WithdrawAmount: this.walletBalance
    })
  }
  SubmitFundsTransfer(frmTransferFunds, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.TRANSFERFUNDS, frmTransferFunds).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmTransferFunds.reset();
          this.getWalletTransactions();
          this.getWalletBalance();
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
  SubmitWithdrawFunds(frmWithdrawFunds, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.WITHDRAWFUNDS, frmWithdrawFunds).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmWithdrawFunds.reset();
          //this.getWalletTransactions();
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
