import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin, from, Observable } from 'rxjs';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { filter, map, take } from 'rxjs/operators';
import { AppRoutingPaths } from 'enums';
import { RoutingState } from 'services/routing-state/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private readonly platform: Platform,
    private readonly splashScreen: SplashScreen,
    private readonly statusBar: StatusBar,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly routingState: RoutingState
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // init routing state for recording all the navigations
    this.routingState.loadRouting();
    forkJoin([from(this.platform.ready()), this.authService.checkAuth(), this.firstRouterNavigationEnd()])
      .subscribe({
        next: data => {
          this.statusBar.styleDefault();
          if (this.router.url === AppRoutingPaths.Root) {
            this.router.navigate([data[1] ? AppRoutingPaths.Home : AppRoutingPaths.Login]);
          }

          this.splashScreen.hide();
        }
      });
  }

  private firstRouterNavigationEnd(): Observable<string> {
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(({ url }: NavigationEnd) => url),
      take(1)
    );
  }
}
