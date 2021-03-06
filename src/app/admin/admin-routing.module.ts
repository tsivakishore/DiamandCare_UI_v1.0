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
import { StudentmappingdetailsComponent } from './studentmappingdetails/studentmappingdetails.component';
import { AdminreportsComponent } from './adminreports/adminreports.component';
import { UserwithdrawsComponent } from './userwithdraws/userwithdraws.component';
import { UploadInstImagesComponent } from './uploadInstImages/uploadInstImages.component';
import { RenewloanaccountComponent } from './renewloanaccount/renewloanaccount.component';
import { IdcardComponent } from './idcard/idcard.component';
import { UpgradetoEmployeeComponent } from "./upgradetoEmployee/upgradetoEmployee.component";

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
  },
  {
    path: RouteConstants.UPGRADETOFRANCHISE,
    component: UpgradetofranchiseComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.LOANDISPATCHED,
    component: LoandispatchedComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.DISPLAYSCREENS,
    component: DisplayscreensComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.LOANPAYMENT,
    component: LoanpaymentComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.MYSECRETKEYS,
    component: MysecretkeysComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.APPLYUSERLOANS,
    component: ApplyuserloansComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.WALLETTRANSACTIONS,
    component: WallettransactionsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.FRANCHISEREQUEST,
    component: FranchiserequestComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.FRANCHISETREE,
    component: FranchisetreeComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.EXPENSES,
    component: ExpensesComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.GENERATEMYKEY,
    component: GeneratemysecretkeysComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.REQUESTFUNDS,
    component: RequestfundsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.UPGRADETOSCHOOL,
    component: UpgradetoschoolComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.UPDATEUSERPROFILE,
    component: UpdateuserprofileComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.MYLOANPAYMENTS,
    component: MyloanpaymentsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.FEEMASTER,
    component: FeemasterComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.REPORTS,
    component: ReportsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.COURSEMASTER,
    component: CoursemasterComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.STUDENTMAPPING,
    component: StudentmappingComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.REGISTRATIONBYINSTITUTION,
    component: RegisterbyinstitutionComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.USERSBYINSTITUTION,
    component: UsersbyinstitutionComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.STUDENTMAPPINGDETAILS,
    component: StudentmappingdetailsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.ADMINREPORTS,
    component: AdminreportsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.USERWITHDRAWS,
    component: UserwithdrawsComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.UPLOADINSTIMAGES,
    component: UploadInstImagesComponent,   
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.RENEWLOANACCOUNT,
    component: RenewloanaccountComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.IDCARD,
    component: IdcardComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.UPGRADETOEMPLOYEE,
    component: UpgradetoEmployeeComponent,
    canActivate: [AuthGaurd]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})

export class AdminRoutingModule { }
