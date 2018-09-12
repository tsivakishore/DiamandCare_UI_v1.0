import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../shared-model/shared-user.model";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { APPStorage } from "../constants/storage";
import { CommonFunctions } from "../common-functions";
import { RouteConstants } from "../constants/routes";
declare var mixpanel;
@Injectable()
export class SharedService {

  mixpanel;

  constructor(private router: Router) {

  }

  commonFunctions = new CommonFunctions();
  private _user: User;
  private _userName: string;
  private _userID: string;
  private _loginType: number;
  private _roleID: string;
  private _roleName: string;
  private _walletBalance: string;
  private _walletHoldBalance: string;
  private _pass: string;
  private _refer: string;
  private _expiredIn: any;
  private isProfileUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /* Shared LoggedIn Param */

  private isLoginRequired: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getLoginRequired(): Observable<boolean> {
    return this.isLoginRequired.asObservable();
  }

  setLoginRequired(val: boolean): void {
    this.isLoginRequired.next(val);
  }

  /* Shared LoggedIn Param */

  /* Shared Loader Param */

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private taskCount: number = 0;

  getLoader(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  setLoader(val: boolean): void {
    if (val) {
      this.taskCount += 1
    } else {
      this.taskCount -= 1
      this.taskCount != 0 ? val = true : "";
    }
    this.isLoading.next(val);
  }

  private isOpenTokenTermModel: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  getTokenTermModal(): Observable<any> {
    return this.isOpenTokenTermModel.asObservable();
  }

  setTokenTermModal(val: any): void {
    this.isOpenTokenTermModel.next(val);
  }

  /* Shared Loader Param */

  /* Shared User Token Param */

  private _token: string = '';

  setToken(value: string): void {
    // sessionStorage.setItem(APPStorage.TOKEN, value);
    this._token = value;
  }

  getToken(): string {
    return this._token;
  }

  setRoleID(value: string): void {
    this._roleID = value;
  }

  getRoleID(): string {
    return this._roleID;
  }

  setRoleName(value: string): void {
    this._roleName = value;
  }

  getRoleName(): string {
    return this._roleName;
  }

  /* Common Methods */
  isLoggedIn(): boolean {
    return CommonFunctions.isValidString(this.getToken()) ? true : false;
  }

  logout(): void {
    sessionStorage.clear();
    this.setToken(null);
    this.setUser(null);
    this.setUserName(null);
    this.setUserID(null);
    this.setRoleID(null);
    this.setLoginRequired(true);
    this.router.navigate(["/"]);
  }

  getProfileUpdated(): Observable<boolean> {
    return this.isProfileUpdated.asObservable();
  }

  getUser(): User {
    if (!this._user) {
      this._user = JSON.parse(sessionStorage.getItem(APPStorage.USER));
      this.setUser(this._user);
      this.getProfileUpdated();
    }
    return this._user;
  }

  setUser(value: User): void {
    sessionStorage.setItem(APPStorage.USER, JSON.stringify(value));
    this._user = value;
    this.isProfileUpdated.next(true);
  }


  /* Shared Language Param */
  private langulage;

  getLanguage() {
    return this.langulage = localStorage.getItem(APPStorage.LANG);
  }

  setLanguage(val: string) {
    localStorage.setItem(APPStorage.LANG, val);
  }

  getPass(): string {
    return this._pass;
  }

  setPass(value: string) {
    this._pass = value;
    // sessionStorage.setItem(APPStorage.PASS, value);
  }

  setRefer(value: string) {
    this._refer = value;
    sessionStorage.setItem(APPStorage.REFER, value);
  }

  getUserName(): string {
    return this._userName;
  }

  setUserName(value: string) {
    this._userName = value;
    // sessionStorage.setItem(APPStorage.PASS, value);
  }

  getUserID(): string {
    return this._userID;
  }

  setUserID(value: string) {
    this._userID = value;
  }

  getLoginType(): number {
    return this._loginType;
  }

  setLoginType(value: number) {
    this._loginType = value;
  }

  getRefer(): string {
    if (!this._refer) {
      this._refer = sessionStorage.getItem(APPStorage.REFER);
    }
    return this._refer;
  }

  setWalletBalance(value: string): void {
    this._walletBalance = value;
  }

  getWalletBalance(): string {
    return this._walletBalance;
  }

  setWalletHoldBalance(value: string): void {
    this._walletHoldBalance = value;
  }

  getWalletHoldBalance(): string {
    return this._walletHoldBalance;
  }

  public ChekUserPermission(RoleID: string) {
    if (RoleID == "") {
      let roleID = this.getRoleID();
      if (roleID == RoleID) {
        this.router.navigate(["/" + RouteConstants.APPLIEDUSERLOANDETAILS]);
      }
      else
        this.logout();
    }
    else {
      this.logout();
    }
  }

  setSessionExpireIn(value: any): void {
    this._expiredIn = value;
  }

  getSessionExpireIn(): any {
    return this._expiredIn;
  }

  public getExpireTimeSeconds(): string {
    return this.getSessionExpireIn();
  }

  trackMixPanelEvent(value) {
    // console.log("Yes",value);
    mixpanel.track(value);
  }

} 
