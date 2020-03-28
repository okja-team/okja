import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardListComponent } from './card-list.component';

@NgModule({
  declarations: [CardListComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [],
  entryComponents: [CardListComponent],
  exports: [CardListComponent]
})
export class CardListModule { }
