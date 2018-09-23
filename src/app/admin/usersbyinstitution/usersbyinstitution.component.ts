import { Component, HostListener, OnInit, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { dialog, slideUp } from "../animation";
import { BaseComponent } from "../../utility/base-component/base.component";
import { RouteConstants } from "../../utility/constants/routes";
import { SharedService } from "../../utility/shared-service/shared.service";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
declare var $: any;
import { UserService } from "../../utility/shared-service/user.service";

@Component({
  selector: 'app-usersbyinstitution',
  templateUrl: './usersbyinstitution.component.html',
  styleUrls: ['./usersbyinstitution.component.css'],
  providers: [UserService],
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

export class UsersbyinstitutionComponent extends BaseComponent implements OnInit {

  lstUsers: any;
  UserDetails: any;
  constructor(public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private sharedService: SharedService,
    private userService: UserService,
    private router: Router,
    public translateService: TranslateService, ) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.GetUsersByInstitution(this.UserDetails.UserID);
  }

  public GetUsersByInstitution(UserID: number) {
    this.sharedService.setLoader(true);
    this.userService._getUsersByInstitution(UserID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstUsers = res.m_Item3;
        console.log(this.lstUsers)
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  viewUsersByInstitutionForm() {
    this.router.navigate(["/" + RouteConstants.REGISTRATIONBYINSTITUTION]);
  }

}
