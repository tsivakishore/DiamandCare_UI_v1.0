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
import { CommonService } from "../../utility/shared-service/common.service";
import { UserService } from "../../utility/shared-service/user.service";

@Component({
  selector: 'header-sidebar',
  templateUrl: './header-sidebar.component.html',
  styleUrls: ['./header-sidebar.component.css'],
  providers: [CommonService, UserService],
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
  walletHoldBalance: string = "0";
  isOpenSidebar: boolean = true;
  isOpenMobileSidebar: boolean = false;
  currentPath: string;
  user: User;
  address;
  loadBalance: boolean = false;
  isUserWallet: boolean = false;
  UserDetails: any;
  userName: string;
  userID: string;
  roleID: string;
  roleName: string;
  lstUserMenus: any[];

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
  Is_Visible_LoanPayment = false;
  Is_Visible_My_SecretKeys = false;
  Is_Visible_Apply_Userloans = false;
  Is_Visible_Wallet_Transactions = false;
  Is_Visible_Franchise_Request = false;
  Is_Visible_Franchise_Tree = false;
  Is_Visible_Expenses = false;
  Is_Visible_Upgrade_School = false;
  Is_Visible_Request_Funds = false;
  Is_Visible_Generate_My_SecretKeys = false;
  Is_Visible_Update_UsersProfile = false;
  Is_Visible_My_LoanPayments = false;
  Is_Visible_Fee_Master = false;
  Is_Visible_Reports = false;
  Is_Visible_Course_Master = false;
  Is_Visible_Student_Mapping = false;
  Is_Visible_Registration_By_Institution = false;
  Is_Visible_Users_By_Institution = false;
  Is_Visible_Displayscreens = false;

  constructor(private apiManager: APIManager, private sharedService: SharedService, private commonService: CommonService, private userService: UserService,
    private router: Router, public toastr: ToastsManager, public vcr: ViewContainerRef) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.userID = this.sharedService.getUserID();
    this.roleID = this.sharedService.getRoleID();
    //this.getMenusBasedOnRole(this.userID);
    this.getMenuByUserID(this.userID);
    this.UserDetails = this.sharedService.getUser();
    this.userName = this.sharedService.getUserName().toUpperCase();
    this.roleName = this.sharedService.getRoleName();
    this.getWalletBalance();
  }
  

  currentRoute() {
    let currentRoute = window.location.pathname;
    let currentRoute1 = currentRoute.split('/');
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

  public getWalletBalance() {
    this.commonService._getWalletBalance().then((response: any) => {
      if (response.m_Item1) {
        this.walletBalance = response.m_Item3.Balance;
        this.walletHoldBalance = response.m_Item3.HoldAmount;
        this.sharedService.setWalletBalance(this.walletBalance);
        this.sharedService.setWalletHoldBalance(this.walletHoldBalance);
      }
      this.loadBalance = response.m_Item1;
    }, err => {
    })
  }



  getMenuByUserID(userID: string) {
    this.userService._getMenuDetailsByUserID(userID).subscribe((res: any) => {
      if (res.m_Item1) {
        this.lstUserMenus = res.m_Item3;
        this.setMenusByItems();
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })
  }

  setMenusByItems() {
    if (!!this.lstUserMenus) {
      this.lstUserMenus.forEach(element => {
        switch (element.MenuName) {
          case "loanearns": {
            this.Is_Visible_EarnLoans = element.Checked;
            break;
          }
          case "appliedloandetails": {
            this.Is_Visible_AppliedLoanDetails = element.Checked;
            break;
          }
          case "settings": {
            this.Is_Visible_Settings = element.Checked;
            break;
          }
          case "secretkey": {
            this.Is_Visible_SecretKey = element.Checked;
            break;
          }
          case "masterscreen": {
            this.Is_Visible_MasterScreen = element.Checked;
            break;
          }
          case "userloandetails": {
            this.Is_Visible_AppliedUserLoanDetails = element.Checked;
            break;
          }
          case "addroletouser": {
            this.Is_Visible_Roles = element.Checked;
            break;
          }
          case "underuserdetails": {
            this.Is_Visible_UnderUserDetails = element.Checked;
            break;
          }
          case "roles": {
            this.Is_Visible_Add_Roles = element.Checked;
            break;
          }
          case "upgradetofranchise": {
            this.Is_Visible_Upgrade_Franchise = element.Checked;
            break;
          }
          case "loandispatched": {
            this.Is_Visible_Loans_Dispatched = element.Checked;
            break;
          }
          case "loanpayment": {
            this.Is_Visible_LoanPayment = element.Checked;
            break;
          }
          case "mysecretkeys": {
            this.Is_Visible_My_SecretKeys = element.Checked;
            break;
          }
          case "applyuserloans": {
            this.Is_Visible_Apply_Userloans = element.Checked;
            break;
          }
          case "wallettransactions": {
            this.Is_Visible_Wallet_Transactions = element.Checked;
            break;
          }
          case "franchiserequest": {
            this.Is_Visible_Franchise_Request = element.Checked;
            break;
          }
          case "franchisetree": {
            this.Is_Visible_Franchise_Tree = element.Checked;
            break;
          }
          case "expenses": {
            this.Is_Visible_Expenses = element.Checked;
            break;
          }
          case "upgradetoschool": {
            this.Is_Visible_Upgrade_School = element.Checked;
            break;
          }
          case "requestfunds": {
            this.Is_Visible_Request_Funds = element.Checked;
            break;
          }
          case "generatemysecretkeys": {
            this.Is_Visible_Generate_My_SecretKeys = element.Checked;
            break;
          }
          case "updateuserprofile": {
            this.Is_Visible_Update_UsersProfile = element.Checked;
            break;
          }
          case "myloanpayments": {
            this.Is_Visible_My_LoanPayments = element.Checked;
            break;
          }
          case "feemaster": {
            this.Is_Visible_Fee_Master = element.Checked;
            break;
          }
          case "reports": {
            this.Is_Visible_Reports = element.Checked;
            break;
          }
          case "coursemaster": {
            this.Is_Visible_Course_Master = element.Checked;
            break;
          }
          case "studentmapping": {
            this.Is_Visible_Student_Mapping = element.Checked;
            break;
          }
          case "registerbyinstitution": {
            this.Is_Visible_Registration_By_Institution = element.Checked;
            break;
          }
          case "users": {
            this.Is_Visible_Users_By_Institution = element.Checked;
            break;
          }
          case "displayscreens": {
            this.Is_Visible_Displayscreens = element.Checked;
            break;
          }          
          default: {
            //this.logout();
            break;
          }
        }
      });
    }
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

  // get screenPermissionsUrl() {
  //   return "/" + RouteConstants.SCREENPERMISSIONS;
  // }

  get loanPaymentsUrl() {
    return "/" + RouteConstants.LOANPAYMENT;
  }

  get mySecretKeysUrl() {
    return "/" + RouteConstants.MYSECRETKEYS;
  }

  get applyUserLoansUrl() {
    return "/" + RouteConstants.APPLYUSERLOANS;
  }

  get walletTransactionsUrl() {
    return "/" + RouteConstants.WALLETTRANSACTIONS;
  }

  get franchiseRequestUrl() {
    return "/" + RouteConstants.FRANCHISEREQUEST;
  }

  get franchiseTreeUrl() {
    return "/" + RouteConstants.FRANCHISETREE;
  }

  get expensesUrl() {
    return "/" + RouteConstants.EXPENSES;
  }

  get requestFundsUrl() {
    return "/" + RouteConstants.REQUESTFUNDS;
  }

  get upgradeToSchoolUrl() {
    return "/" + RouteConstants.UPGRADETOSCHOOL;
  }

  get generateMySecreteKeysUrl() {
    return "/" + RouteConstants.GENERATEMYKEY;
  }

  get updateUsersProfileUrl() {
    return "/" + RouteConstants.UPDATEUSERPROFILE;
  }

  get myLoanPaymentsUrl() {
    return "/" + RouteConstants.MYLOANPAYMENTS;
  }

  get feeMasterUrl() {
    return "/" + RouteConstants.FEEMASTER;
  }

  get reportsUrl() {
    return "/" + RouteConstants.REPORTS;
  }

  get displayscreensUrl() {
    return "/" + RouteConstants.DISPLAYSCREENS;
  }  

  get courseMasterUrl() {
    return "/" + RouteConstants.COURSEMASTER;
  }

  get studentMappingUrl() {
    return "/" + RouteConstants.STUDENTMAPPING;
  }

  get registrationByInstitutionUrl() {
    return "/" + RouteConstants.REGISTRATIONBYINSTITUTION;
  }

  get usersByInstitutionUrl() {
    return "/" + RouteConstants.USERSBYINSTITUTION;
  }

  earnLoanEvent() {
    this.sharedService.trackMixPanelEvent("Second Step Button");
  }

  underUserDetailsEvent() {
    this.sharedService.trackMixPanelEvent("Third Step Button");
  }

}
