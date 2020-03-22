import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterProfilePage } from './filter-profile.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TranslateModule } from '@ngx-translate/core';
import { FilterPage } from 'modules/filter/filter.page';

@NgModule({

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: FilterProfilePage }]),
    TranslateModule.forChild()
  ],
  declarations: [
    FilterProfilePage,
    FilterPage],
  entryComponents: [
    FilterPage
  ]
})
export class FilterProfilePageModule {}
