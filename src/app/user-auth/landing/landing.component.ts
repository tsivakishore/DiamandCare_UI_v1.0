import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { RouteConstants } from "../../utility/constants/routes";
import { slideUp } from "../../admin/animation";
declare var particlesJS: any;
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
    particlesJS.load('landing-particles-js', 'assets/js/particles.json', function () { });
    this.viewHomeForm();
  }

  ngOnDestroy() {

  }

  viewHomeForm() {
    this.router.navigate(["/" + RouteConstants.HOME]);
  }

  viewRegisterForm() {
    this.router.navigate(["/" + RouteConstants.REGISTERATION]);
  }

  loginForm() {
    this.router.navigate(["/" + RouteConstants.LOGIN]);
  }
}
