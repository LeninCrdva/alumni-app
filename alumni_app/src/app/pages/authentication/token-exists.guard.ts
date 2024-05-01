import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const tokenExistsGuard: (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  router: Router
) => boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> = (route, state, router) => {
  if (route.queryParams['reset_token']) {
    return true;
  } else {
    router.navigate(['/inicio']);
    return false;
  }
};