import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, StackPageGuard } from 'guards';
import { AppRoutingPaths } from 'enums';

const routes: Routes = [
  {
    path: AppRoutingPaths.Home,
    loadChildren: () => import('./modules/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutingPaths.Login,
    loadChildren: () => import('./modules/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: AppRoutingPaths.Profile,
    loadChildren: () => import('./modules/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutingPaths.PositionPiker,
    loadChildren: () => import('./modules/position-piker/position-piker.module').then( m => m.PositionPikerPageModule),
    canActivate: [AuthGuard, StackPageGuard]
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
