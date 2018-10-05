import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RouteConstants } from "../../utility/constants/routes";
import { slideUp, dialog } from "../../admin/animation";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import { SharedService } from "../../utility/shared-service/shared.service";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { style, transition, animate, trigger } from "@angular/animations";

@Component({
  selector: 'app-loansflow',
  templateUrl: './loansflow.component.html',
  styleUrls: ['./loansflow.component.css'],
  providers: [LoanEarnsService],
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

export class LoansflowComponent extends BaseComponent implements OnInit {
  landingTitle2 = ' Digital India Awareness Monitoring Analysis for National Development';
  lstLoanEarns: any;

  constructor(private sharedService: SharedService,
    private leService: LoanEarnsService,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private router: Router,
    private apiManager: APIManager) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.getLoanEarns();
  }

  public getLoanEarns() {
    this.sharedService.setLoader(true);
    this.leService._getLoanEarns().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstLoanEarns = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  get loanEarnsLength() {
    return this.lstLoanEarns ? this.lstLoanEarns.length : 0
  }

}
