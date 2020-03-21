import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RoundButtonComponent } from './round-button.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  declarations: [RoundButtonComponent],
  exports: [RoundButtonComponent]
})
export class RoundButtonComponentModule {}
