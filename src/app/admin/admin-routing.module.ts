import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RouteConstants } from "../utility/constants/routes";
import { AuthGaurd } from "../_guards/auth.gaurds";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SecretkeyComponent } from './secretkey/secretkey.component';
import { MasterscreenComponent } from './masterscreen/masterscreen.component';
import { LoanearnsComponent } from './loanearns/loanearns.component';
import { AppliedloandetailsComponent } from './appliedloandetails/appliedloandetails.component';
import { UserloandetailsComponent } from './userloandetails/userloandetails.component'
import { SettingsComponent } from "./settings/settings.component";
import { AddroletouserComponent } from '../admin/addroletouser/addroletouser.component';
import { UnderuserdetailsComponent } from '../admin/underuserdetails/underuserdetails.component';
import { RolesComponent } from '../admin/roles/roles.component';

const routes: Routes = [
  {
    path: RouteConstants.DASHBOARD,
    component: DashboardComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.SECRETKEY,
    component: SecretkeyComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.MASTERSCREEN,
    component: MasterscreenComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.EARNLOANS,
    component: LoanearnsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.ADDROLETOUSER,
    component: AddroletouserComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.ROLES,
    component: RolesComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.APPLIEDLOANDETAILS,
    component: AppliedloandetailsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.UNDERUSERDETAILS,
    component: UnderuserdetailsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.APPLIEDUSERLOANDETAILS,
    component: UserloandetailsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.SETTINGS,
    component: SettingsComponent,
    canActivate: [AuthGaurd]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})

export class AdminRoutingModule { }
