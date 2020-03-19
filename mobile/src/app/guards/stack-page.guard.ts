import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { RoutingState } from 'services/routing-state/routing-state.service';
import { AppRoutingPaths } from 'enums';

@Injectable({
  providedIn: 'root'
})
export class StackPageGuard implements CanActivate {

  constructor(private routingState: RoutingState, private routes: Router) { }

  async canActivate(): Promise<boolean> {
    const canEnter = !!this.routingState.getPreviousUrl();

    console.log(`[STACK PAGE GUARD] - can enter: ${canEnter}`);
    return canEnter || this.routes.navigate([AppRoutingPaths.Home]);
  }
}
