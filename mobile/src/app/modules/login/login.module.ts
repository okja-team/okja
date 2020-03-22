import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RoundButtonComponentModule } from 'components/round-button/round-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    RoundButtonComponentModule,
    TranslateModule.forChild()
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
