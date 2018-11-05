import { Injectable } from "@angular/core";
import { HttpService } from "../utility/http-service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { API } from "../utility/constants/api";
import { Response, RequestOptions, RequestOptionsArgs, Headers, ResponseContentType, Request } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { SharedService } from '../utility/shared-service/shared.service';
import { AppConstant, BaseUrl } from '../utility/constants/base-constants';

@Injectable()
export class UserAuthService {

  constructor(private httpService: HttpService,
    private sharedService: SharedService,
    private httpClient: HttpClient,
    private toastManager: ToastsManager) {
  }

  login(body): Observable<any> {
    return this.httpService.post(API.Login, body)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  sendOTP(userName) {
    let values = { "email": userName };
    return this.httpService
      .post('', values)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  verifyUserOTP(email, userOTP) {
    let values = { "email": email, "otp": userOTP };
    return this.httpService
      .post('', values)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getUsersAndRoles() {
    return this.httpService
      .get(API.GETUSERSANDROLES)
      .map(res => this.extractData(res, false)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getAllRoles() {
    return this.httpService
      .get(API.GETALLROLES)
      .map(res => this.extractData(res, false)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getUserImage() {
    return this.httpService
      .get(API.GETUSERIMAGE)
      .map(res => this.extractData(res, false)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  resetPWD(email, userOTP, newPWD, confirmPWD) {
    let values = { "email": email, "otp": userOTP, "password": newPWD, "repeatPassword": confirmPWD };
    return this.httpService
      .post('', values)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });

  }

  _getUserProfile() {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(BaseUrl.Api + API.USERPROFILE, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  _getUserAddress() {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(BaseUrl.Api + API.USERADDRESS, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  _getUserNomineeDetails(postData) {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(BaseUrl.Api + API.GETNOMINEEDETAILS + '?UserID=' + postData, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  _getBankNames() {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.get(BaseUrl.Api + API.BANKNAMES, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  createHeaders() {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new Headers(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append("Accept", 'application/json');
    return headers
  }

  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = this.createHeaders();
    }
    return options;
  }

  private extractData(res: Response, showToast: boolean) {
    if (showToast) {
      this.toastManager.success(res.json().message)
    }
    let data = res.json();
    return data || {};
  }

  private extractDataDownload(res: Response, showToast: boolean) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
