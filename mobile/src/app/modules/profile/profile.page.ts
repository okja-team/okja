import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from 'src/app/models/class/profile';
import { Aiuti } from 'src/app/models/enums/aiuti.enum';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { LocationSelectionPage } from '../location-selection/location-selection.page';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  public user: Profile;
  public readonly aiuti = Aiuti;

  public isDarkMode = false;
  public img: string;

  public isHelper = false;

  constructor(
    private readonly router: Router,
    private readonly modal: ModalController,
    private readonly profileService: ProfileService,
    private readonly loadingCtrl: LoadingController,
    private readonly alertCtrl: AlertController,
    private readonly toast: ToastController,
    private readonly translateConfigService: TranslateConfigService,

  ) {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.img = `assets/img/abbiamo-bisogno-del-tuo-aiuto${this.isDarkMode? '-dark' : ''}.png`;
   }

   ionViewWillEnter() {
     this.profileService.getProfile().subscribe( p => {
       if(!!p) {
        this.user = p;
       } else {
         this.user = new Profile();
       }
     });
   }

   private async saveProfile(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: this.translateConfigService.translateInstant('PROFILE_PAGE.LOADER_MESSAGE'),
      spinner: 'crescent',
    });
    loading.present();
    this.profileService.addProfile(this.user);
    if (this.user.published) {
      this.profileService.publishProfile(this.user);
    } else {
      this.profileService.unpublishProfile(this.user);
    }

    loading.dismiss();
  }
  
  public async registrati(): Promise<void> {
    if(this.user.isProfileValid()) {
      try{
        await this.saveProfile();
        this.router.navigate(['/']);
      } catch(e) {
        this.alertCtrl.create({
          message: 'Siamo spiacenti, si è verificato un errore',
          buttons: [
            { text: 'Ho capito' }
          ]
        }).then( a => a.present());
      }
    } else {
      this.showToast();
    }
  }

  public indietro(): void {
    this.router.navigate(['/attivazione']);
  }

  public openLocationSelector(): void {
    this.modal.create({component: LocationSelectionPage}).then( m => m.present());
  }

  public segmentChanged(event: CustomEvent): void {
    this.user.isHelper = event.detail.value === 'true';
  }

  private async showToast(): Promise<void> {
    const t = await this.toast.create({message: 'Le informazioni inserite non sembrano essere corrette'})
    t.present();
    setTimeout(() => {
      t.dismiss();
    }, 2000);
  }


}


