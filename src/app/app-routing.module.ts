import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './utility/constants/routes';
import { LandingComponent } from "./user-auth/landing/landing.component";
import { LoginComponent } from "./user-auth/login/login.component";
import { HomeComponent } from './user-auth/home/home.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: RouteConstants.LOGIN,
    component: LoginComponent
  },
  {
    path: RouteConstants.HOME,
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: RouteConstants.LOGIN,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {

}
