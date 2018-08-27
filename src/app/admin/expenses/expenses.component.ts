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
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
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
export class ExpensesComponent extends BaseComponent implements OnInit {
  WalletExpensesList: any[]
  OriginalWalletExpensesList: any[]
  walletExpensesForm: FormGroup;
  updateExpense: boolean = false;
  saveExpense: boolean = false;

  constructor(private fb: FormBuilder, private walletServ: WalletService, private sharedService: SharedService,
    public toastr: ToastsManager, private apiManager: APIManager,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.createExpensesForm();
    this.getWalletRecentExpenses();
    this.walletExpensesForm.get('TransactionAmount').enable();
  }
  createExpensesForm() {
    this.walletExpensesForm = this.fb.group({
      TransactionAmount: new FormControl('', Validators.compose([Validators.min(1), Validators.maxLength(8), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      //TransactionAmount: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP), Validators.maxLength(8), Validators.minLength(1)])],
      Purpose: ['', Validators.compose([Validators.required])],
      ID:0
    })
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

  onSubmitExpenses(formParam, IsValidForm) {
    if (IsValidForm) {
      this.apiManager.postAPI(API.INSERTWALLETEXPENSES, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.getWalletRecentExpenses();
          this.walletExpensesForm.reset();
        }
        else {
          this.expensesreset();
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.expensesreset();
        this.toastr.error("Oops! Role Registeration failed.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }
  editExpenses(values) {
    this.walletExpensesForm.patchValue(values);
    this.updateExpense = true;
    this.saveExpense = true;
  }

  expensesreset() {
    this.walletExpensesForm.reset({ TransactionAmount: "", Purpose: "", ID:0 });
    this.updateExpense = false;
    this.saveExpense = false;
    this.walletExpensesForm.get('TransactionAmount').enable();
    this.walletExpensesForm.get('Purpose').enable();
  }
}
