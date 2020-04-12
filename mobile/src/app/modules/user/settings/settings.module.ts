import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'component/avatar/avatar.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AvatarModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    TranslateModule.forChild()
  ],
  declarations: [SettingsPage]
})
export class Tab3PageModule {}
