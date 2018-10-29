import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserAuthRoutingModule } from "./user-auth-routing.module";
import { UserAuthService } from "./user-auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UtilityModule } from "../utility/utility.module";
import { LoginComponent } from "./login/login.component";
import { ToastModule } from "ng2-toastr";
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import {
  DataTableModule, ChartModule, DialogModule, DropdownModule, TooltipModule, TabMenuModule,
  BreadcrumbModule, GalleriaModule, CarouselModule
} from 'primeng/primeng';
import { LandingComponent } from './landing/landing.component';
import { CompleteIcoComponent } from './complete-ico/complete-ico.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from './home/home.component';
import { ContactusComponent } from './contactus/contactus.component';
import { SphotogalleryComponent } from './sphotogallery/sphotogallery.component';
import { EphotogalleryComponent } from './ephotogallery/ephotogallery.component';
import { LoansflowComponent } from './loansflow/loansflow.component';
import { LegalDocumentsComponent } from './legal-documents/legal-documents.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    DataTableModule,
    DialogModule,
    TooltipModule,
    ChartModule,
    UtilityModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),
    UserAuthRoutingModule,
    TabMenuModule,
    BreadcrumbModule,
    GalleriaModule,
    CarouselModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LandingComponent,
    CompleteIcoComponent,
    ContactusComponent,
    SphotogalleryComponent,
    EphotogalleryComponent,
    LoansflowComponent,
    LegalDocumentsComponent,
    ImageUploadComponent],
  providers: [UserAuthService],
  exports: [
    LandingComponent,
    LoginComponent,
    RegisterComponent]
})

export class UserAuthModule {
}
