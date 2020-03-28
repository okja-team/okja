import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


  constructor(
    private readonly router: Router,
    private readonly ngFireAuth: AngularFireAuth
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.ngFireAuth.authState != null) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}