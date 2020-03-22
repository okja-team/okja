import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProfileComponent } from './card-profile.component'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CardProfileComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [],
  entryComponents: [CardProfileComponent],
  exports: [CardProfileComponent]
})
export class CardProfileModule { }
