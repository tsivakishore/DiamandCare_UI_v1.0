import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RouteConstants } from "../../utility/constants/routes";
import { slideUp } from "../../admin/animation";

import { APIManager } from "../../utility/shared-service/apimanager.service";
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import { SharedService } from "../../utility/shared-service/shared.service";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  providers: [LoanEarnsService],
  animations: [slideUp]
})
export class LandingComponent extends BaseComponent implements OnInit, OnDestroy {

  // countdown timer variables
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
    // particlesJS.load('landing-particles-js', 'assets/js/particles.json', function () { });
    // let param1 = this.route.snapshot.queryParams["ref"];
    // if (param1 && param1.length <= 8 && param1.length >= 8) {
    //   this.sharedService.setRefer(param1);
    // } else {
    //   this.sharedService.setRefer('');
    // }
    this.getLoanEarns();
  }

  ngOnDestroy() {

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

  viewRegisterForm() {
    this.router.navigate(["/" + RouteConstants.REGISTERATION]);
  }

  loginForm() {
    this.router.navigate(["/" + RouteConstants.LOGIN]);
  }
}
