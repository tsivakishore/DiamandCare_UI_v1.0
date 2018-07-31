import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { dialog, slideUp } from "../animation";
import { Router } from "@angular/router";
import { API } from "../../utility/constants/api";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { BaseComponent } from "../../utility/base-component/base.component";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { Message, SelectItem } from "primeng/primeng";
import * as moment from 'moment';
import { Role } from './role-model';
import { UserAuthService } from "../../user-auth/user-auth.service";
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-addroletouser',
  templateUrl: './addroletouser.component.html',
  styleUrls: ['./addroletouser.component.css'],
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

export class AddroletouserComponent extends BaseComponent implements OnInit {
  userRolesList: any;
  originalallRolesList: any;
  allRolesList: SelectItem[] = [];;
  fgRoles: FormGroup;
  isShowModal: number = 1;
  selectedRole: Role;

  constructor(private userAuthService: UserAuthService, public fb: FormBuilder,
    private apiManager: APIManager,
    public translateService: TranslateService,
    public vcr: ViewContainerRef,
    public toastr: ToastsManager) {
      super(toastr, vcr);
  }

  ngOnInit() {
    this.getUsersAndRoles();
    this.getAllRoles();
    this.createRoles();
  }

  createRoles() {
    this.fgRoles = this.fb.group({
      Id: new FormControl('', Validators.required),
      RoleID: new FormControl('', Validators.required)
    })
  }

  public getUsersAndRoles() {
    this.userAuthService._getUsersAndRoles().subscribe((res: any) => {
      if (res.m_Item1) {
        this.userRolesList = res.m_Item3;
      }
      else{
        this.toastr.error(res.m_Item2);
      }
    })
  }

  public getAllRoles() {
    this.allRolesList = [];
    if (!this.originalallRolesList) {
      this.userAuthService._getAllRoles().subscribe((res: any) => {
        if (res.m_Item1) {
          this.originalallRolesList = res.m_Item3;
          this.allRolesList.push({ label: '--Select Role--', value: { RoleID: '', label: '--Select Role--' } });
          this.originalallRolesList.map(o => {
            this.allRolesList.push({ label: o.Name, value: { RoleID: o.RoleID, label: o.Name } });
          });
        }
      })
    }
    else {
      this.allRolesList.push({ label: '--Select Role--', value: { RoleID: '', label: '--Select Role--' } });
      this.originalallRolesList.map(o => {
        this.allRolesList.push({ label: o.Name, value: { RoleID: o.RoleID, label: o.Name } });
      });
    }
  }

  UpdateRole(value) {
    if (this.fgRoles.valid) {
      this.fgRoles.value.RoleID = value.RoleID.RoleID;
      this.apiManager.postAPI(API.UPDATEUSERROLE, this.fgRoles.value).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.fgRoles.reset();
          this.getUsersAndRoles();
          this.isShowModal = 1;
        }
        else this.toastr.error(response.m_Item2);
      });
    }
  }

  closeForm() {
    this.isShowModal = 1;
    this.fgRoles.reset();
  }

  //Change roles
  onShowUpdateRoleModal(rowData) {
    this.fgRoles.patchValue({ Id: rowData.UserID })
    this.isShowModal = 2;
  }

}
