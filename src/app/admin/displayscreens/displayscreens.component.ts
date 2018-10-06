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
import { RoleService } from "../../utility/shared-service/role.service";

@Component({
  selector: 'app-displayscreens',
  templateUrl: './displayscreens.component.html',
  styleUrls: ['./displayscreens.component.css'],
  providers: [DisplayScreensService, RoleService],
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
  fgRoleMenu: FormGroup;
  lstScreenMaster: any;
  lstRoleMenus: any;
  isShowModal: number = 1;
  actiontype: string;
  screenID: any;
  lstRoles: any;
  deletingData: any;

  constructor(private sharedService: SharedService,
    private displayScreensService: DisplayScreensService,
    private roleService: RoleService,
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
    this.getAllRoles();
  }

  createScreenMasterForm() {
    this.frmScreenMaster = this.fb.group({
      MenuID: [''],
      MenuName: ['', Validators.compose([Validators.required])],
      MenuDescription: ['', Validators.compose([Validators.required])],
    })
  }
  createRoleMenuForm() {
    this.fgRoleMenu = this.fb.group({
      ID: [''],
      MenuID: ['', Validators.compose([Validators.required])],
      RoleID: ['', Validators.compose([Validators.required])]
    })
  }

  public getAllRoles() {
    this.roleService._getAllRoles().subscribe((res: any) => {
      if (res.m_Item1) {
        this.lstRoles = res.m_Item3;
      }
    })
  }

  EditScreenMaster(rowData: any) {
    //console.log(rowData);
    this.isShowModal = 2;
    this.createScreenMasterForm();
    this.actiontype = "Edit Screen";
    this.frmScreenMaster.patchValue({
      MenuID: rowData.MenuID,
      MenuName: rowData.MenuName,
      MenuDescription: rowData.MenuDescription
    })
  }

  ViewScreenMasterModel() {
    this.isShowModal = 2;
    this.actiontype = "Add Screen";
    this.createScreenMasterForm();
  }

  ViewScreenRoleModel() {
    //console.log(rowData);
    this.isShowModal = 3;
    this.actiontype = "Add Screen to Role";
    this.createRoleMenuForm();
    //this.screenID = rowData.MenuID;
    this.fgRoleMenu.patchValue({
      MenuID: this.screenID
    });
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

  CreateRoleMenu(data, isvalid) {
    if (isvalid) {
      this.apiManager.postAPI(API.CREATEROLEMENU, data).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.fgRoleMenu.reset();
          this.getRoleMenusByScreenID(this.screenID);
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }

      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while mapping. Please try again.");
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

  getRoleMenusByScreenID(screenID: number) {
    //console.log(screenID);
    this.sharedService.setLoader(true);
    this.screenID = screenID;
    this.lstRoleMenus = [];
    this.displayScreensService._getRoleMenusByScreenID(screenID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstRoleMenus = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  deleteMapModel(deletingData: any) {
    this.deletingData = deletingData;
    this.isShowModal = 4;    
  }

  DeleteRoleMenu(status: string) {
    if (status == "Yes") {      
      this.sharedService.setLoader(true);
      this.displayScreensService._deleteRoleMenuMap(this.deletingData.ID).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.toastr.success(res.m_Item2);
          this.getRoleMenusByScreenID(this.screenID);
          this.isShowModal = 1;          
        }
        else {
          this.toastr.success(res.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {        
        this.sharedService.setLoader(false);
        this.toastr.success(err);
      })
    }
    else if (status == "No") {
      this.closeForm();
    }
    this.deletingData = null;
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
