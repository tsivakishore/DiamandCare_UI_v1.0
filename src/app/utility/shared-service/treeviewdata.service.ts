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
export class TreeViewDataService {

    constructor(private httpService: HttpService,
        private sharedService: SharedService,
        private http: HttpClient,
        private toastManager: ToastsManager) {
    }

    _getTreeViewData(ID: number) {
        const token = this.sharedService.isLoggedIn() ? this.sharedService.getToken() : AppConstant.staticToken;
        let headers = new HttpHeaders(token ? { 'Authorization': `bearer ${token}` } : null);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.get(BaseUrl.Api + API.GETTREEVIEWDATA + '?ID=' + ID, { headers: headers })
            .toPromise()
            .then(this.extractDataTree.bind(this))
            .catch(this.handleError.bind(this));

    }

    private extractData(res: Response, show?: boolean) {
        let data = res.json();
        let msg = data.message;
        if (show && msg) {
            this.toastManager.success(msg);
        }
        return data || {};
    }

    private extractDataTree(res: Response) {
        let body = res;
        return body || {};
      }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}