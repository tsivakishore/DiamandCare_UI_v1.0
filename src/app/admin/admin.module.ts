import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { HeaderSidebarComponent } from './header-sidebar/header-sidebar.component';
import { AdminRoutingModule } from "./admin-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SecretkeyComponent } from './secretkey/secretkey.component';
import { MasterscreenComponent } from './masterscreen/masterscreen.component';
import { LoanearnsComponent } from './loanearns/loanearns.component';
import { AppliedloandetailsComponent } from './appliedloandetails/appliedloandetails.component';
import { UserloandetailsComponent } from './userloandetails/userloandetails.component'
import { UtilityModule } from "../utility/utility.module";
import { DataTableModule, DropdownModule, InputSwitchModule, MessagesModule, SharedModule, TooltipModule } from "primeng/primeng";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingsComponent } from './settings/settings.component';
import { MyAutofocusDirective } from "./focus.directive";
import { FooterComponent } from './footer/footer.component';
import { AddroletouserComponent } from '../admin/addroletouser/addroletouser.component';
import { UnderuserdetailsComponent } from '../admin/underuserdetails/underuserdetails.component';
import { TreeviewComponent } from '../admin/underuserdetails/treeview/treeview.component';
import { RolesComponent } from '../admin/roles/roles.component';
import { UpgradetofranchiseComponent } from '../admin/upgradetofranchise/upgradetofranchise.component';
import { DisplayscreensComponent } from '../admin/displayscreens/displayscreens.component';
import { LoandispatchedComponent } from '../admin/loandispatched/loandispatched.component';
import { LoanpaymentComponent } from './loanpayment/loanpayment.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule,
    TooltipModule,
    DataTableModule,
    MessagesModule,
    SharedModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    UtilityModule,
    AdminRoutingModule
  ],
  declarations: [
    HeaderSidebarComponent,
    DashboardComponent,
    SecretkeyComponent,
    MasterscreenComponent,
    LoanearnsComponent,
    AppliedloandetailsComponent,
    AddroletouserComponent,
    RolesComponent,
    UserloandetailsComponent,
    UnderuserdetailsComponent,
    UpgradetofranchiseComponent,
    DisplayscreensComponent,
    LoandispatchedComponent,
    TreeviewComponent,
    SettingsComponent,
    FooterComponent,
    LoanpaymentComponent
],
  exports: [HeaderSidebarComponent]
})
export class AdminModule { }
