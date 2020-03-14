import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttivazionePage } from './attivazione.page';

const routes: Routes = [
  {
    path: '',
    component: AttivazionePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttivazionePageRoutingModule {}
