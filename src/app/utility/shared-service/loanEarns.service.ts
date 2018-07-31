
import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { SharedService } from '../../utility/shared-service/shared.service';
import { AppConstant, BaseUrl } from '../../utility/constants/base-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoanEarnsService {

  constructor(private httpService: HttpService,
    private http: HttpClient,
    private sharedService: SharedService,
    private toastManager: ToastsManager) {
  }

  _getLoanEarns() {
    return this.httpService
      .get(API.LoanEarns)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getLoans() {
    return this.httpService
      .get(API.GETLOANS)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getApprovedLoansByUserID() {
    return this.httpService
      .get(API.GETAPPROVEDLOANSBYUSERID)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }
  
  _getApprovedLoans() {
    return this.httpService
      .get(API.GETAPPROVEDLOANS)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getNotApprovedLoans() {
    return this.httpService
      .get(API.GETNOTAPPROVEDLOANS)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getNotApprovedLoansByUserID() {
    return this.httpService
      .get(API.GETNOTAPPROVEDLOANSBYUSERID)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getLoanDetails() {
    return this.httpService
      .get(API.GETLOANDETAILS)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  //Check Personal loan
  _checkPLExist() {
    return this.httpService
      .get(API.CHECKPL)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  //Check Fee reimbursement
  _checkFRExist() {
    return this.httpService
      .get(API.CHECKFR)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  //Check Home Loan
  _checkHLExist() {
    return this.httpService
      .get(API.CHECKHL)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  //Check Health benefit
  _checkHBExist() {
    return this.httpService
      .get(API.CHECKHB)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  //Check Risk benefit
  _checkRBExist() {
    return this.httpService
      .get(API.CHECKRB)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _getDownloadFile(postData: any) {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(BaseUrl.Api + API.DOWNLOADS, postData, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  _getLoanDetailsByLoanID(postData: number) {
    const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
    let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(BaseUrl.Api + API.GETLOANDETAILSBYLOANID + '?LoanID=' + postData, { headers: headers })
      .toPromise()
      .then(this.extractDataDownload.bind(this))
      .catch(this.handleError.bind(this));
  }

  private extractDataDownload(res: Response) {
    let body = res;
    return body || {};
  }

  private extractData(res: Response, show?: boolean) {
    let data = res.json();
    let msg = data.message;
    if (show && msg) {
      this.toastManager.success(msg);
    }
    return data || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
