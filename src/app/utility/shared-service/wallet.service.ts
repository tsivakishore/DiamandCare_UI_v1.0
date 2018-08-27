import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class WalletService {

    constructor(private httpService: HttpService, private toastManager: ToastsManager) {
    }

    _getWalletRecentExpenses() {
        return this.httpService
            .get(API.GETWALLETRECENTEXPENSES)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    private extractData(res: Response, show?: boolean) {
        let data = res.json();
        let msg = data.message;
        if (show && msg) {
            this.toastManager.success(msg);
        }
        return data || {};
    }
    _getWalletTransactions() {
        return this.httpService
            .get(API.GETWALLETTRANSACTIONS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    _getFundrequest() {
        return this.httpService
            .get(API.GETFUNDREQUEST)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    _getFundrequestStatus() {
        return this.httpService
            .get(API.GETFUNDREQUESTSTATUS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
}