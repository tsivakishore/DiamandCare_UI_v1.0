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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LoanEarnsService],
  animations: [slideUp]
})
export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

}
