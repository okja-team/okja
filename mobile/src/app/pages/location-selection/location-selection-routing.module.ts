import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationSelectionPage } from './location-selection.page';

const routes: Routes = [
  {
    path: '',
    component: LocationSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationSelectionPageRoutingModule {}
