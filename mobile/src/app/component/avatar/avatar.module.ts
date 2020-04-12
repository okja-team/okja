import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from './avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild()
  ],
  providers: [],
  entryComponents: [AvatarComponent],
  exports: [AvatarComponent]
})
export class AvatarModule { }
