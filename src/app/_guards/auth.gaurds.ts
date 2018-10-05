import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {SharedService} from "../utility/shared-service/shared.service";
import {RouteConstants} from "../utility/constants/routes";

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private router: Router, private sharedService: SharedService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let rawUrl = state.url.split("?")[0];
    let activateRoute: boolean = true;
    if (this.sharedService.isLoggedIn()) {
      if (rawUrl !== '/' + RouteConstants.LOGIN &&
          rawUrl !== '/' + RouteConstants.REGISTERATION &&
          rawUrl !== '/') {
        activateRoute = true;
      } else {
        this.router.navigate(['/' + RouteConstants.APPLIEDUSERLOANDETAILS]);
        activateRoute = false;
      }
    } else if (rawUrl !== '/' + RouteConstants.LOGIN &&
      rawUrl !== '/' + RouteConstants.REGISTERATION &&
      rawUrl !== '/' + RouteConstants.INSTITUTIONSGALLERY &&
      rawUrl !== '/' + RouteConstants.CONTACTUS &&
      rawUrl !== '/' + RouteConstants.EMPLOYEESGALLERY &&
      rawUrl !== '/' + RouteConstants.HOME &&
      rawUrl !== '/' + RouteConstants.LOANS &&
      rawUrl !== '/' ) {
      this.router.navigate(['/' + RouteConstants.LOGIN]);
      activateRoute = false;
    }
    return activateRoute;
  }
}
