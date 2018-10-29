import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RouteConstants } from "../utility/constants/routes";
import { AuthGaurd } from "../_guards/auth.gaurds";
import { RegisterComponent } from "./register/register.component";
import { LandingComponent } from "./landing/landing.component";
import { ContactusComponent } from './contactus/contactus.component';
import { SphotogalleryComponent } from './sphotogallery/sphotogallery.component';
import { EphotogalleryComponent } from './ephotogallery/ephotogallery.component';
import { HomeComponent } from "./home/home.component";
import { LoansflowComponent } from './loansflow/loansflow.component';
import { LegalDocumentsComponent } from './legal-documents/legal-documents.component';

const routes: Routes = [
  {
    path: RouteConstants.LOGIN,
    component: LoginComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: RouteConstants.REGISTERATION,
    component: RegisterComponent,
    canActivate: [AuthGaurd]
  },
  {
    path: '',
    component: LandingComponent, children: [
      {
        path: RouteConstants.HOME,
        component: HomeComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: RouteConstants.CONTACTUS,
        component: ContactusComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: RouteConstants.INSTITUTIONSGALLERY,
        component: SphotogalleryComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: RouteConstants.EMPLOYEESGALLERY,
        component: EphotogalleryComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: RouteConstants.LOANS,
        component: LoansflowComponent,
        canActivate: [AuthGaurd]
      },
      {
        path: RouteConstants.LEGALDOCS,
        component: LegalDocumentsComponent,
        canActivate: [AuthGaurd]
      }
    ],
    canActivate: [AuthGaurd]
  },
  {
    path: '**',
    component: HomeComponent,
    canActivate: [AuthGaurd]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})

export class UserAuthRoutingModule {

}
