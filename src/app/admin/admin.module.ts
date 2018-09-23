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
import { DataTableModule, DropdownModule, InputSwitchModule, MessagesModule, SharedModule, TooltipModule, CalendarModule } from "primeng/primeng";
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
import { MysecretkeysComponent } from './mysecretkeys/mysecretkeys.component';
import { ApplyuserloansComponent } from './applyuserloans/applyuserloans.component';
import { WallettransactionsComponent } from './wallettransactions/wallettransactions.component';
import { FranchiserequestComponent } from './franchiserequest/franchiserequest.component';
import { FranchisetreeComponent } from './franchisetree/franchisetree.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { RequestfundsComponent } from './requestfunds/requestfunds.component';
import { UpgradetoschoolComponent } from './upgradetoschool/upgradetoschool.component';
import { GeneratemysecretkeysComponent } from './generatemysecretkeys/generatemysecretkeys.component';
import { UpdateuserprofileComponent } from './updateuserprofile/updateuserprofile.component';
import { MyloanpaymentsComponent } from './myloanpayments/myloanpayments.component';
import { FeemasterComponent } from './feemaster/feemaster.component';
import { ReportsComponent } from './reports/reports.component';
import { CoursemasterComponent } from './coursemaster/coursemaster.component';
import { StudentmappingComponent } from './studentmapping/studentmapping.component';
import { RegisterbyinstitutionComponent } from './registerbyinstitution/registerbyinstitution.component';
import { UsersbyinstitutionComponent } from './usersbyinstitution/usersbyinstitution.component';

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
    AdminRoutingModule,
    CalendarModule
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
    LoanpaymentComponent,
    MysecretkeysComponent,
    ApplyuserloansComponent,
    WallettransactionsComponent,
    FranchiserequestComponent,
    FranchisetreeComponent,
    ExpensesComponent,
    RequestfundsComponent,
    UpgradetoschoolComponent,
    GeneratemysecretkeysComponent,
    UpdateuserprofileComponent,
    MyloanpaymentsComponent,
    FeemasterComponent,
    ReportsComponent,
    CoursemasterComponent,
    StudentmappingComponent,
    RegisterbyinstitutionComponent,
    UsersbyinstitutionComponent
  ],
  exports: [HeaderSidebarComponent]
})
export class AdminModule { }
