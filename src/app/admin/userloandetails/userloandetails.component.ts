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
  listOfPendingLoans: any[];
  listOfRejectedLoans: any[];

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
    this.GetPendingLoans();
    this.GetRejectedLoans();
  }

  public GetApprovedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getApprovedLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfApprovedLoans = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetPendingLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getPendingLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfPendingLoans = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetRejectedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getRejectedLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfRejectedLoans = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

}
