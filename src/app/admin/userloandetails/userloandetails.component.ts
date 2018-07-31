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
  selector: 'app-userloandetails',
  templateUrl: './userloandetails.component.html',
  styleUrls: ['./userloandetails.component.css'],
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

export class UserloandetailsComponent extends BaseComponent implements OnInit {

  listOfApprovedLoans: any[];
  listOfNotApprovedLoans: any[];

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
    this.GetApprovedLoans();
    this.GetNotApprovedLoans();
  }

  public GetApprovedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getApprovedLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfApprovedLoans = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetNotApprovedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getNotApprovedLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfNotApprovedLoans = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  getLoanType(loanTypeCode: string) {
    if (loanTypeCode.toUpperCase().trim() == "PL")
      return "Personal Loan";
    else if (loanTypeCode.toUpperCase().trim() == "FR")
      return "Fee Reimbursement";
    else if (loanTypeCode.toUpperCase().trim() == "HB")
      return "Health Benefits";
    else if (loanTypeCode.toUpperCase().trim() == "RB")
      return "Risk Benefit";
    else if (loanTypeCode.toUpperCase().trim() == "HL")
      return "Home Loan";
  }

  getModeofTransfer(ModeofTransfer: number) {
    if (ModeofTransfer == 1)
      return "Check";
    else if (ModeofTransfer == 2)
      return "Cash";
    else if (ModeofTransfer == 3)
      return "DD";
    else if (ModeofTransfer == 4)
      return "A/C Transfer";
  }

  getLoanStatus(LoanStatusID: number) {
    if (LoanStatusID == 1)
      return "Payment Pending";
    else if (LoanStatusID == 2)
      return "Partial Payment done";
    else if (LoanStatusID == 3)
      return "Payment Done";
  }

  IsLoanApproved(isApproved: number) {
    if (isApproved == 0)
      return "Pending";
    else if (isApproved == 1)
      return "Approved";
    else if (isApproved == 3)
      return "Rejected";
  }

}
