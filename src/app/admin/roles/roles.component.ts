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

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [RoleService],
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
export class RolesComponent extends BaseComponent implements OnInit {
  rolesList: any[]
  OriginalrolesList: any[]
  roleForm: FormGroup;
  updateRole: boolean = false;
  saveRole: boolean = false;

  constructor(private fb: FormBuilder, private roleService: RoleService, private sharedService: SharedService,
    public toastr: ToastsManager, private apiManager: APIManager,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.createBuyTokenForm();
    this.getAllRoles();
    this.roleForm.get('Name').enable();
  }

  createBuyTokenForm() {
    this.roleForm = this.fb.group({
      Name: new FormControl(''),
      RoleID: '',
      IsActive: false
    })
  }

  public getAllRoles() {
    this.roleService._getAllRoles().subscribe((res: any) => {
      if (res.m_Item1) {
        this.OriginalrolesList = res.m_Item3;
        this.rolesList = this.OriginalrolesList;
      }
    })
  }

  onSubmitrole(formParam, IsValidForm) {
    if (IsValidForm) {
      this.apiManager.postAPI(API.NEWROLE, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.getAllRoles();
          this.roleForm.reset();
        }
        else {
          this.rolereset();
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.rolereset();
        this.toastr.error("Oops! Role Registeration failed.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  editRole(values) {
    this.roleForm.patchValue(values);
    this.updateRole = true;
    this.saveRole = true;
    this.roleForm.get('Name').disable();
  }

  rolereset() {
    this.roleForm.reset({ RoleID: "", Name: "", IsActive: false });
    this.updateRole = false;
    this.saveRole = false;
    this.roleForm.get('Name').enable();
  }

  onUpdaterole(formParam, IsValidForm) {
    if (IsValidForm) {
      this.sharedService.setLoader(true);
      this.apiManager.postAPI(API.UPDATEROLE, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.rolereset();
          this.toastr.success(response.m_Item2);
          this.getAllRoles();
        }
        else {
          this.rolereset();
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        console.log(err);
        this.toastr.error("Oops! Role details updatation failed.Please try again.");
      });
      this.sharedService.setLoader(false);
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }
}
