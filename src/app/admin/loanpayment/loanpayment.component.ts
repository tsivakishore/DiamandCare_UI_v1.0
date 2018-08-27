import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { CommonService } from "../../utility/shared-service/common.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { ToastsManager } from "ng2-toastr";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { CommonRegexp } from "../../utility/constants/validations";
import { BaseComponent } from "../../utility/base-component/base.component";
import { TranslateService } from "../../utility/translate/translate.service";

@Component({
  selector: 'app-loanpayment',
  templateUrl: './loanpayment.component.html',
  styleUrls: ['./loanpayment.component.css'],
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
    slideUp, dialog
  ]
})

export class LoanpaymentComponent extends BaseComponent implements OnInit {
  @ViewChild('txtSearcByLoanId') txtSearcByLoanId: ElementRef;

  isShowModal: number = 1;
  frmLoanDetails: FormGroup;
  selectedRow: any;

  listOfActiveUserLoans: any[];
  OriginalActiveUserLoans: any[];
  lstAllPaidLoans: any[];
  loanID: number;
  LoanID: number;
  LoanAmount: any;
  AmountToPay: any;
  UserID: number;
  isValidAmount: boolean = false;
  isValidAmountError: string;

  constructor(public fb: FormBuilder,
    private loanEarnsService: LoanEarnsService,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    private sharedService: SharedService,
    public translateService: TranslateService,
    public vcr: ViewContainerRef,
    private commonService: CommonService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createLoanDetailsForm();
    this.GetActiveLoansByUserID();
    this.GetAllPaidLoans();
  }

  createLoanDetailsForm() {
    this.frmLoanDetails = this.fb.group({
      LoanID: new FormControl(''),
      UserID: new FormControl(''),
      LoanAmount: new FormControl(''),
      AmountToPay: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])]
    })
  }

  public GetActiveLoansByUserID() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getActiveLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfActiveUserLoans = res.m_Item3;
      }
      else {
        this.listOfActiveUserLoans = [];
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetAllPaidLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getPaidLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstAllPaidLoans = res.m_Item3;
      }
      else {
        this.lstAllPaidLoans = [];
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  Refresh() {
    this.GetActiveLoansByUserID();
    this.GetAllPaidLoans();
    this.txtSearcByLoanId.nativeElement.value = '';
  }

  ViewLoanDetails(rowIndex) {
    this.selectedRow = this.listOfActiveUserLoans[rowIndex];
    this.LoanID = this.selectedRow.LoanID;
    this.LoanAmount = this.selectedRow.LoanAmount;
    this.frmLoanDetails.patchValue({
      AmountToPay: this.selectedRow.AmountToPay,
      UserID: this.selectedRow.UserID
    })
    this.isShowModal = 2;
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

  onSubmitLoanPayment(formLoanDetails, isValidForm) {
    this.sharedService.setLoader(true);
    this.UserID = formLoanDetails.UserID;
    this.AmountToPay = formLoanDetails.AmountToPay;
    if (isValidForm) {
      this.loanEarnsService._updateUserLoanPayment(this.UserID, this.LoanID, this.AmountToPay).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(res.m_Item2);
          this.GetAllPaidLoans();
          this.GetActiveLoansByUserID();
        }
        else
          this.toastr.error(res.m_Item2);
      }, err => {
        this.sharedService.setLoader(false);
      })
    }
    else {
      this.sharedService.setLoader(false);
      this.toastr.error("Form is not valid");
    }
  }

  onChangeAmountToPay(amount: any) {
    if (!!amount || amount <= 0) {
      this.isValidAmount = true;
      this.isValidAmountError = "Payment amount should not be zero";
    }
    else {
      this.isValidAmount = false;
      this.isValidAmountError = "";
    }
  }

  public GetActiveLoansByUserNameorDCID(DcIDorName: string) {
    if (!!DcIDorName && DcIDorName.trim().length >= 5) {
      try {
        this.sharedService.setLoader(true);
        this.loanEarnsService._getActiveLoansByUserNameorDCID(DcIDorName).subscribe((res: any) => {
          if (res.m_Item1) {
            this.listOfActiveUserLoans = [];
            this.listOfActiveUserLoans = res.m_Item3;
          }
          else {
            this.listOfActiveUserLoans = [];
            this.listOfActiveUserLoans = res.m_Item3;
          }
        })

        this.loanEarnsService._getPaidLoansByUserNameorDCID(DcIDorName).subscribe((res: any) => {
          if (res.m_Item1) {
            this.lstAllPaidLoans = [];
            this.lstAllPaidLoans = res.m_Item3;
          }
          else {
            this.lstAllPaidLoans = [];
            this.lstAllPaidLoans = res.m_Item3;
          }
        })
      }
      finally {
        this.sharedService.setLoader(false);
      }
    }
    else {
      this.listOfActiveUserLoans = [];
      this.lstAllPaidLoans = [];
    }
  }

  onSearchChange(searchValue: string) {
    if (searchValue.trim() == "")
      this.loanID = 0;
    else
      this.loanID = Number(searchValue);

    if (this.loanID > 0) {
      this.listOfActiveUserLoans = this.OriginalActiveUserLoans.filter(element => element.LoanID && element.LoanID == this.loanID);
    }
    else
      this.listOfActiveUserLoans = this.OriginalActiveUserLoans;
  }

  closeForm() {
    this.isShowModal = 1;
  }

  colorCodeRenew() {
    return "btnpay";
  }

}
