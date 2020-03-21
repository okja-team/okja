import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveProfilesPage } from './active-profiles.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AgmCoreModule } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AgmCoreModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ActiveProfilesPage }]),
    TranslateModule.forChild()
  ],
  providers: [
    CallNumber
  ],
  declarations: [ActiveProfilesPage]
})
export class ActiveProfilesPageModule {}
