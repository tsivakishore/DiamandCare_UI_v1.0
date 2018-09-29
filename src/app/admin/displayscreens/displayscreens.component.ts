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
import { style, transition, animate, trigger } from "@angular/animations";
import { DisplayScreensService } from "../../utility/shared-service/displayscreens.service";

@Component({
  selector: 'app-displayscreens',
  templateUrl: './displayscreens.component.html',
  styleUrls: ['./displayscreens.component.css'],
  providers: [DisplayScreensService],
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
export class DisplayscreensComponent extends BaseComponent implements OnInit {

  frmScreenMaster: FormGroup;
  lstScreenMaster: any;
  isShowModal: number = 1;
  actiontype: string;

  constructor(private sharedService: SharedService,
    private displayScreensService: DisplayScreensService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.getScreenMaster();
    this.createScreenMasterForm();
  }

  createScreenMasterForm() {
    this.frmScreenMaster = this.fb.group({
      MenuID: [''],
      MenuName: ['', Validators.compose([Validators.required])],
      MenuDescription: ['', Validators.compose([Validators.required])],
    })
  }

  EditScreenMaster(rowData: any) {
    debugger;
    console.log(rowData);
    this.isShowModal = 2;
    this.createScreenMasterForm();
    this.actiontype = "Edit Screen";
    this.frmScreenMaster.patchValue({
      MenuID: rowData.MenuID,
      MenuName: rowData.MenuName,
      MenuDescription: rowData.MenuDescription
    })
    debugger;
  }

  ViewScreenMasterModel() {
    this.isShowModal = 2;
    this.actiontype = "Add Screen";
    this.createScreenMasterForm();
  }

  CreateScreenMaster(formScreenMaster, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.CREATESCREENMASTER, formScreenMaster).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmScreenMaster.reset();
          this.getScreenMaster();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while create course master.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  public getScreenMaster() {
    this.sharedService.setLoader(true);
    this.displayScreensService._getScreenMasterDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstScreenMaster = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  restrictSpace(e) {
    //restrict Space
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
      e.preventDefault();
  }

  closeForm() {
    this.isShowModal = 1;
  }
}
