import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositionPikerPage } from './position-piker.page';

const routes: Routes = [
  {
    path: '',
    component: PositionPikerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionPikerPageRoutingModule {}
