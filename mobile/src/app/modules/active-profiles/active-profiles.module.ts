import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveProfilesPage } from './active-profiles.page';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardProfileModule } from 'component/card-profile/card-profile.module';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AvatarModule } from 'component/avatar/avatar.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    CardProfileModule,
    AvatarModule,
    RouterModule.forChild([{ path: '', component: ActiveProfilesPage }]),
    TranslateModule.forChild()
  ],
  providers: [],
  declarations: [ActiveProfilesPage]
})
export class ActiveProfilesPageModule {}
