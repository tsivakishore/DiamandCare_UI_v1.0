import { RoleService } from '../../utility/shared-service/role.service';
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

@Component({
  selector: 'app-wallettransactions',
  templateUrl: './wallettransactions.component.html',
  styleUrls: ['./wallettransactions.component.css'],
  providers: [WalletService],
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

  constructor(private fb: FormBuilder, private walletServ: WalletService, private sharedService: SharedService,
    public toastr: ToastsManager, private apiManager: APIManager,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.getWalletRecentExpenses();
  }
  
  public getWalletRecentExpenses() {
    this.sharedService.setLoader(true);
    this.walletServ._getWalletRecentExpenses().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.WalletExpensesList = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }
}
