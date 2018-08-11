import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { RouteConstants } from "../../utility/constants/routes";
import { BaseComponent } from "../../utility/base-component/base.component";
import { User } from "../../utility/shared-model/shared-user.model";
import { Router, NavigationEnd } from "@angular/router";
import { style, transition, animate, trigger } from "@angular/animations";
import { slideDown, slideUp } from "../animation";
import { API } from "../../utility/constants/api";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { BaseUrl } from '../../utility/constants/base-constants';
import { ToastsManager } from "ng2-toastr";

@Component({
  selector: 'header-sidebar',
  templateUrl: './header-sidebar.component.html',
  styleUrls: ['./header-sidebar.component.css'],
  animations: [
    trigger('sideAmination', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    slideUp, slideDown
  ]
})
export class HeaderSidebarComponent extends BaseComponent implements OnInit {

  @Output() menuToggle = new EventEmitter<boolean>();
  walletBalance: string = "0";
  isOpenSidebar: boolean = true;
  isOpenMobileSidebar: boolean = false;
  currentPath: string;
  user: User;
  address;
  loadBalance: boolean = false;
  loaderProof: boolean = false;
  UserDetails: any;
  userName: string;
  userID: string;
  roleID: string;
  roleName: string;


  Is_Visible_EarnLoans: boolean = false;
  Is_Visible_AppliedLoanDetails: boolean = false;
  Is_Visible_Settings: boolean = false;
  Is_Visible_SecretKey: boolean = false;
  Is_Visible_MasterScreen: boolean = false;
  Is_Visible_AppliedUserLoanDetails: boolean = false;
  Is_Visible_Roles: boolean = false;
  Is_Visible_UnderUserDetails: boolean = false;
  Is_Visible_Add_Roles = false;
  Is_Visible_Upgrade_Franchise = false;
  Is_Visible_Loans_Dispatched = false;

  constructor(private apiManager: APIManager, private sharedService: SharedService,
    private router: Router, public toastr: ToastsManager, public vcr: ViewContainerRef) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.userID = this.sharedService.getUserID();
    this.roleID = this.sharedService.getRoleID();
    this.getMenusBasedOnRole(this.userID);
    this.UserDetails = this.sharedService.getUser();
    this.userName = this.sharedService.getUserName().toUpperCase();
    this.roleName = this.sharedService.getRoleName();
    this.getWallet();
  }

  getMenusBasedOnRole(userID: string) {
    // if (this.roleID == BaseUrl.AdminRoleID) {
    this.apiManager.postAPI(API.GETMENU, { Id: userID }).subscribe(response => {
      if (response.m_Item1) {
        response.m_Item3.forEach(element => {
          var menu = element.MenuName;
          if (this.roleID === BaseUrl.AdminRoleID) {
            switch (menu) {
              case RouteConstants.SETTINGS:
                this.Is_Visible_Settings = true;
                break;
              case RouteConstants.EARNLOANS:
                this.Is_Visible_EarnLoans = true;
                break;
              case RouteConstants.APPLIEDLOANDETAILS:
                this.Is_Visible_AppliedLoanDetails = true;
                break;
              case RouteConstants.APPLIEDUSERLOANDETAILS:
                this.Is_Visible_AppliedUserLoanDetails = true;
                break;
              case RouteConstants.SECRETKEY:
                this.Is_Visible_SecretKey = true;
                break;
              case RouteConstants.MASTERSCREEN:
                this.Is_Visible_MasterScreen = true;
                break;
              case RouteConstants.ADDROLETOUSER:
                this.Is_Visible_Roles = true;
                break;
              case RouteConstants.UNDERUSERDETAILS:
                this.Is_Visible_UnderUserDetails = true;
                break;
              case RouteConstants.ROLES:
                this.Is_Visible_Add_Roles = true;
                break;
              case RouteConstants.UPGRADETOFRANCHISE:
                this.Is_Visible_Upgrade_Franchise = true;
                break;
              case RouteConstants.LOANDISPATCHED:
                this.Is_Visible_Loans_Dispatched = true;
                break;
            }
          }
          else if (this.roleID === BaseUrl.UserRoleID) {
            switch (menu) {
              case RouteConstants.SETTINGS:
                this.Is_Visible_Settings = true;
                break;
              case RouteConstants.EARNLOANS:
                this.Is_Visible_EarnLoans = true;
                break;
              case RouteConstants.APPLIEDUSERLOANDETAILS:
                this.Is_Visible_AppliedUserLoanDetails = true;
                break;
              case RouteConstants.ADDROLETOUSER:
                this.Is_Visible_Roles = false;
                break;
              case RouteConstants.ROLES:
                this.Is_Visible_Add_Roles = false;
                break;
              case RouteConstants.UNDERUSERDETAILS:
                this.Is_Visible_UnderUserDetails = true;
                break;
              case RouteConstants.UPGRADETOFRANCHISE:
                this.Is_Visible_Upgrade_Franchise = false;
                break;
            }
          }
          else if (this.roleID === BaseUrl.FranchiseRoleID) {
            switch (menu) {
              case RouteConstants.SETTINGS:
                this.Is_Visible_Settings = true;
                break;
              case RouteConstants.EARNLOANS:
                this.Is_Visible_EarnLoans = true;
                break;
              case RouteConstants.APPLIEDUSERLOANDETAILS:
                this.Is_Visible_AppliedUserLoanDetails = true;
                break;
              case RouteConstants.UNDERUSERDETAILS:
                this.Is_Visible_UnderUserDetails = true;
                break;
            }
          }
          else if (this.roleID === BaseUrl.SchoolRoleID) {
            switch (menu) {
              case RouteConstants.SETTINGS:
                this.Is_Visible_Settings = true;
                break;
              case RouteConstants.EARNLOANS:
                this.Is_Visible_EarnLoans = true;
                break;
              case RouteConstants.APPLIEDUSERLOANDETAILS:
                this.Is_Visible_AppliedUserLoanDetails = true;
                break;
              case RouteConstants.UNDERUSERDETAILS:
                this.Is_Visible_UnderUserDetails = true;
                break;
            }
          }
          else if (this.roleID === BaseUrl.DeveloperRoleID) {
            switch (menu) {
              case RouteConstants.SETTINGS:
                this.Is_Visible_Settings = true;
                break;
              case RouteConstants.EARNLOANS:
                this.Is_Visible_EarnLoans = true;
                break;
              case RouteConstants.APPLIEDUSERLOANDETAILS:
                this.Is_Visible_AppliedUserLoanDetails = true;
                break;
              case RouteConstants.ADDROLETOUSER:
                this.Is_Visible_Roles = false;
                break;
              case RouteConstants.ROLES:
                this.Is_Visible_Add_Roles = false;
                break;
              case RouteConstants.UNDERUSERDETAILS:
                this.Is_Visible_UnderUserDetails = true;
                break;
              case RouteConstants.UPGRADETOFRANCHISE:
                this.Is_Visible_Upgrade_Franchise = false;
                break;
            }
          }
          else
            this.logout();
        });
      }
    });
  }

  currentRoute() {
    let currentRoute = window.location.pathname;
    let currentRoute1 = currentRoute.split('/');
    // console.log("current Route:=>",currentRoute1[1]);
    this.currentPath = currentRoute1[1];
  }

  onToggleSidebar() {
    this.isOpenSidebar = !this.isOpenSidebar;
    this.menuToggle.emit(this.isOpenSidebar);
  }

  onMobileToggleSidebar() {
    this.isOpenMobileSidebar = !this.isOpenMobileSidebar;
    this.menuToggle.emit(this.isOpenMobileSidebar);
  }

  closeSidebar() {
    this.isOpenMobileSidebar = false;
  }

  logout() {
    this.sharedService.logout();
  }

  get dashboardUrl() {
    return "/" + RouteConstants.DASHBOARD;
  }

  get secretKeyUrl() {
    return "/" + RouteConstants.SECRETKEY;
  }

  get masterScreenUrl() {
    return "/" + RouteConstants.MASTERSCREEN;
  }

  get appliedLoanDetailsScreenUrl() {
    return "/" + RouteConstants.APPLIEDLOANDETAILS;
  }

  get appliedUserLoanDetailsScreenUrl() {
    return "/" + RouteConstants.APPLIEDUSERLOANDETAILS;
  }

  get addUserToRoleUrl() {
    return "/" + RouteConstants.ADDROLETOUSER;
  }

  get settingsUrl() {
    return "/" + RouteConstants.SETTINGS;
  }

  get changePasswordUrl() {
    return "/" + RouteConstants.CHANGE_PASSWORD;
  }

  get earnLoansUrl() {
    return "/" + RouteConstants.EARNLOANS;
  }

  get underUserDetailsUrl() {
    return "/" + RouteConstants.UNDERUSERDETAILS;
  }

  get rolesUrl() {
    return "/" + RouteConstants.ROLES;
  }

  get upgradeFranchiseUrl() {
    return "/" + RouteConstants.UPGRADETOFRANCHISE;
  }

  get loanDispatchedUrl() {
    return "/" + RouteConstants.LOANDISPATCHED;
  }

  get screenPermissionsUrl() {
    return "/" + RouteConstants.SCREENPERMISSIONS;
  }

  earnLoanEvent() {
    this.sharedService.trackMixPanelEvent("Second Step Button");
  }

  underUserDetailsEvent() {
    this.sharedService.trackMixPanelEvent("Third Step Button");
  }

  // checkAccountBalance(account) {
  //   if (this.loaderEther)
  //     this.sharedService.trackMixPanelEvent("Refresh Ether Balance");

  // }

  getProofTokensRaised(erc20Units): number {
    if (erc20Units) {
      return Math.round(erc20Units / (10 ** 18));
    }
    else {
      return 0;
    }
  }

  getWallet() {
    this.apiManager.getAPI(API.GETWALLET).subscribe(response => {
      if (response.m_Item1) {
        this.walletBalance = response.m_Item3.Balance;
      }
      this.loadBalance = response.m_Item1;
    });
  }
}
