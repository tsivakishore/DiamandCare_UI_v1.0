import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../../admin/animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
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

export class ContactusComponent extends BaseComponent implements OnInit {
  frmContactUs: FormGroup;

  constructor(private sharedService: SharedService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createreContactUsForm();
  }

  createreContactUsForm() {
    this.frmContactUs = this.fb.group({
      FirstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])),
      LastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25)])),
      PhoneNumber: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])],
      Email: new FormControl('', Validators.compose([Validators.minLength(5), Validators.maxLength(100), <any>Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)])),
      Comment: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(250), Validators.pattern(CommonRegexp.ALPHABETS_SPECIALCHAR_REGEXP)])]
    })
  }

  ContactUSRequest(formContactUs, isValidForm) {
    if (isValidForm) {
      this.toastr.success("Contact us details submitted successfully.");
    }
    else {
      this.toastr.error("Contact us details submitted failed.");
    }
  }

  restrictSpace(e) {
    //restrict Space
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
      e.preventDefault();
  }

}
