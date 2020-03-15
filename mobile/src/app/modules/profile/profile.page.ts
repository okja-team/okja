import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // public spesa = false;
  // public farmacia = false;
  // public compagnia = false;
  // public posta = false;

  // public rolesCollection: Role[] = [];

  public profile: Profile;
  public hasProfile: boolean;

  public publishProfile: Profile[];

  constructor(
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private profileService: ProfileService,
    private translateConfigService: TranslateConfigService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() {
    this.profile = new Profile();

  }

  ionViewWillEnter() {
    this.profileService.getProfile().subscribe(p => {
      if (p) {
        this.profile = p;
        this.hasProfile = true;
      } else {
        this.hasProfile = false;
      }
    });
  }

  async saveProfile() {

    const loading = await this.loadingCtrl.create({
      message: this.translateConfigService.translateInstant("PROFILE_PAGE.LOADER_MESSAGE"),
      spinner: 'crescent',
    });
    loading.present();

    this.profileService.addProfile(this.profile);
    if (this.profile.published) {
      this.profileService.publishProfile(this.profile);
    } else {
      this.profileService.unpublishProfile(this.profile);
    }

    loading.dismiss();
  }

  messageSubmit() : String{
    return this.hasProfile ? "SAVE" : "SIGN_UP";
  }

  goToHome() {
    this.navCtrl.navigateRoot('home/tabs/tab1');
  }

  setPosition(){
    this.router.navigate(['position-piker']);
  }

}


