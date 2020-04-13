import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilesPage } from './profiles.page';
import { TranslateModule } from '@ngx-translate/core';
import { FiltersPage } from 'modules/search/filters/filters.page';
import { CardListModule } from 'component/card-list/card-list.module';
import { AvatarModule } from 'component/avatar/avatar.module';

@NgModule({

  imports: [
    IonicModule,
    CommonModule,
    CardListModule,
    FormsModule,
    AvatarModule,
    RouterModule.forChild([{ path: '', component: ProfilesPage }]),
    TranslateModule.forChild()
  ],
  declarations: [
    ProfilesPage,
    FiltersPage],
  entryComponents: [
    FiltersPage
  ]
})
export class ProfilesPageModule {}
