import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { PositionPikerComponent } from './position-piker.component';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AgmCoreModule,
    TranslateModule.forChild()
  ],
  declarations: [PositionPikerComponent],
  entryComponents: [PositionPikerComponent],
  exports: [PositionPikerComponent]
})
export class PositionPikerComponentModule {}
