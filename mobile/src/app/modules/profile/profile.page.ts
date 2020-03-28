import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { UserDataService } from '../../services/user-data.service';
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
    help: Roles
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

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }


  ionViewDidEnter() {
    this.onEnter();
  }

  async onEnter() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.showInfo = true;
    this.getProrile()

    await loading.dismiss();
  }


  public onClickHideInfo() {
    this.showInfo = false;
  }

  public async saveProfile() {

    const loading = await this.loadingCtrl.create();

    await loading.present();
    await this.profileService.addProfile(this.profile).toPromise()
    await loading.dismiss();

    this.navCtrl.navigateRoot('home/tabs/map');
  }



  public async setPosition() {
    await this.saveProfile();
    this.router.navigate(['position-piker']);
  }

  public toggleCapability(role: Roles) {
    const val = !this.getCapability(role);
    this.profileService.setCapability(this.profile, role, val);
  }
  public getCapability(role: Roles) {
    return this.profileService.getCapability(this.profile, role);
  }

  public getCapabilityClass(role: Roles) {
    return this.getCapability(role) ? 'cap-enabled' : '';
  }

  public getAvaibleClass() {
    return this.profile.isAvailable ? 'cap-enabled' : '';
  }

  public toggleIsAvaible() {
    this.profile.isAvailable = !this.profile.isAvailable
    if (this.profile.isAvailable) {
      this.profile.isHelper = true;
    }
  }

  // ------------- PRIVATE METHODS --------------//
  // --------------------------------------------//

  private getProrile() {
    return this.profileService.getProfile()
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
      return of(profile);
    } else {
      return this.userDataService.getUser().pipe(map(user => {
        this.hasProfile = false;
        profile = new Profile();
        this.profileService.setProfileByUser(profile, user);
        return profile;
      }));
    }
  }

  // private async showToast(): Promise<void> {
  //   const t = await this.toast.create({ message: 'Le informazioni inserite non sembrano essere corrette' })
  //   t.present();
  //   setTimeout(() => {
  //     t.dismiss();
  //   }, 2000);
  // }

}


