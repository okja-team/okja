import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserDataService } from '../../services/user-data/user-data.service';
import { Roles } from 'models/enums/roles.enum';
import { Profile } from 'models/class/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  // Binding
  public Page = {
    help : Roles
  }

  public showInfo = true;
  public profile: Profile;
  public hasProfile = false;

  constructor(
    private readonly loadingCtrl: LoadingController,
    private readonly userDataService: UserDataService,
    private readonly profileService: ProfileService,
    private readonly translateConfigService: TranslateConfigService,
    private readonly navCtrl: NavController,
    private readonly router: Router,
    private readonly toast: ToastController,
  ) {
    this.translateConfigService.getDefaultLanguage();
  }


  // --------------- HOOK METHODS ---------------//
  // --------------------------------------------//

  ngOnInit() {
    this.showInfo = true;
    this.subscriptions();
  }

  ngOnDestroy(): void { }

  // -------------- PUBLIC METHODS --------------//
  // --------------------------------------------//

  public onClickHideInfo(){
    this.showInfo = false;
  }

  public async saveProfile() {
    const loading = await this.loadingCtrl.create({
      message: this.translateConfigService.translateInstant('PROFILE_PAGE.LOADER_MESSAGE'),
      spinner: 'crescent',
    });
    loading.present();

    this.profileService.addProfile(this.profile);
    await loading.dismiss();
  }

  public goToHome() {
    this.navCtrl.navigateRoot('home/tabs/map');
  }

  public async setPosition() {
    await this.saveProfile();
    this.router.navigate(['position-piker']);
  }

  // ------------- PRIVATE METHODS --------------//
  // --------------------------------------------//

  private subscriptions() {
    this.profileService.getProfile()
      .pipe(
        switchMap(profile => this.getProfileSwitchMap(profile)),
        untilDestroyed(this)
      )
      .subscribe({
        next: profile => this.profile = profile
      });
  }

  private getProfileSwitchMap(profile: Profile) {
    if (profile) {
      this.hasProfile = true;
      console.log(profile);
      return of(profile);
    } else {
      return this.userDataService.getUser().pipe(map(user => {
        this.hasProfile = false;
        profile = new Profile();
        this.profileService.setProfileByUser(profile, user);
        console.log(profile);
        return profile;
      }));
    }
  }

  public segmentChanged(event: CustomEvent): void {
    this.profile.isHelper = event.detail.value === 'helper';
  }

  private async showToast(): Promise<void> {
    const t = await this.toast.create({ message: 'Le informazioni inserite non sembrano essere corrette' })
    t.present();
    setTimeout(() => {
      t.dismiss();
    }, 2000);
  }

  public toggleCapability(role: Roles) {
    const val = !this.getCapability(role);
    this.profileService.setCapability(this.profile, role, val);
  }
  public getCapability(role: Roles) {
    return this.profileService.getCapability(this.profile, role);
  }
}


