import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    NavigationExtras
} from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(
        // Not using but worth knowing about
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.userService.isLoggedIn) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.userService.redirectUrl = state.url;
        //this.userService.redirectUrl = decodeURIComponent(state.url);
        //encodeURIComponent
        this.router.navigate(['/sign/login']);
        return false;
    }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //   if (this.authService.isLoggedIn) { return true; }

    //   // Store the attempted URL for redirecting
    //   this.authService.redirectUrl = state.url;

    //   // Create a dummy session id
    //   let sessionId = 123456789;

    //   // Set our navigation extras object
    //   // that contains our global query params and fragment
    //   let navigationExtras: NavigationExtras = {
    //     queryParams: { 'session_id': sessionId },
    //     fragment: 'anchor'
    //   };

    //   // Navigate to the login page with extras
    //   this.router.navigate(['/login'], navigationExtras);
    //   return false;
    // }

}
