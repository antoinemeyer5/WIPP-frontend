import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from '@angular/router';

/**
 * Custom RouteReuseStrategy, force reload of components on navigation
 */
export class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
