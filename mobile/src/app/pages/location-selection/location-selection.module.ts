import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationSelectionPageRoutingModule } from './location-selection-routing.module';

import { LocationSelectionPage } from './location-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationSelectionPageRoutingModule
  ],
  declarations: [LocationSelectionPage],
  exports: [
    LocationSelectionPage
  ]
})
export class LocationSelectionPageModule {}
