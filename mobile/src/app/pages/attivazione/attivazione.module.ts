import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttivazionePageRoutingModule } from './attivazione-routing.module';

import { AttivazionePage } from './attivazione.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttivazionePageRoutingModule
  ],
  declarations: [AttivazionePage]
})
export class AttivazionePageModule {}
