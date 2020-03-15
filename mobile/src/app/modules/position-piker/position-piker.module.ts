import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PositionPikerPageRoutingModule } from './position-piker-routing.module';

import { PositionPikerPage } from './position-piker.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PositionPikerPageRoutingModule,
    AgmCoreModule,
  ],
  declarations: [PositionPikerPage]
})
export class PositionPikerPageModule {}
