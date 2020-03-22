import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProfileComponent } from './card-profile.component'
import { TranslateModule } from '@ngx-translate/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  declarations: [CardProfileComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [
    CallNumber
  ],
  entryComponents: [CardProfileComponent],
  exports: [CardProfileComponent]
})
export class CardProfileModule { }
