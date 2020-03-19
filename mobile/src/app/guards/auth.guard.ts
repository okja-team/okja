import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { AppRoutingPaths } from 'enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      map(authState => authState !== null),
      tap(canEnter => {
        console.log(`[AUTH GUARD] - can enter: ${canEnter}`);
        return canEnter || this.router.navigate([`${AppRoutingPaths.Login}`]);
      })
    );
  }
}
