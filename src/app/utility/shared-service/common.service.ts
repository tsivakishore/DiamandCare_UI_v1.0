
import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../../utility/shared-service/shared.service';
import { AppConstant, BaseUrl } from '../../utility/constants/base-constants';

@Injectable()
export class CommonService {

    constructor(private httpService: HttpService,
        private apiManager: APIManager,
        private http: HttpClient,
        private sharedService: SharedService,
        private toastManager: ToastsManager) {
    }

    _getSchoolDetails() {
        return this.httpService
            .get(API.SCHOOLDETAILS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getSourceOfUser() {
        return this.httpService
            .get(API.SOURCEOFUSER)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getAccountTypes() {
        return this.httpService
            .get(API.ACCOUNTTYPES)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getLoanTransferStatus() {
        return this.httpService
            .get(API.GETTRANSFERSTATUS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUserBankDetails(ID: number) {
        const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
        let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(BaseUrl.Api + API.GETUSERBANKDETAILS + '?ID=' + ID, { headers: headers })
            .toPromise()
            .then(this.extractDataDownload.bind(this))
            .catch(this.handleError.bind(this));
    }

    _getNomineeRelations() {
        return this.httpService
            .get(API.NOMINEERELATIONS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getModeofTransfer() {
        return this.httpService
            .get(API.GETMODEOFTRANSFER)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUserDetaildByLoginID() {
        const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
        let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(BaseUrl.Api + API.USERDETAILS, { headers: headers })
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
