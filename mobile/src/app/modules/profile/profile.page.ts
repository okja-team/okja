import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ProfileService } from 'services/profile.service';
import { Profile } from 'models/profile';
import { TranslateConfigService } from 'services/translate-config.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { RoleType } from 'models/role.enum';
import { Role } from 'models/role';
import { map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { UserDataService } from 'services/user-data/user-data.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AppRoutingPaths } from 'enums';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public activities: Role[];
  public hasProfile$: Observable<boolean>;

  public profileForm: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private userDataService: UserDataService,
    private profileService: ProfileService,
    private translateConfigService: TranslateConfigService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.activities = [];
    this.hasProfile$ = this.profileService.hasProfile();
    const group = {
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl('+39'),
      isAvailable: new FormControl(false)
    };
    this.translateConfigService.getDefaultLanguage();
    Object.values(RoleType).forEach(roleType => {
      this.activities.push({ active: false, type: roleType });
      group[roleType] = new FormControl(false);

    });

    this.profileForm = new FormGroup(group);
  }

  set firstName(firstName: string) {
    this.profileForm.get('firstName').setValue(firstName);
  }

  get firstName(): string {
    return this.profileForm.get('firstName').value;
  }

  set lastName(lastName: string) {
    this.profileForm.get('lastName').setValue(lastName);
  }

  get lastName(): string {
    return this.profileForm.get('lastName').value;
  }

  set address(address: string) {
    this.profileForm.get('address').setValue(address);
  }

  get address(): string {
    return this.profileForm.get('address').value;
  }

  set phone(phone: string) {
    this.profileForm.get('phone').setValue(phone);
  }

  get phone(): string {
    return this.profileForm.get('phone').value;
  }

  set isAvailable(isAvailable: boolean) {
    this.profileForm.get('isAvailable').setValue(isAvailable);
  }

  get isAvailable(): boolean {
    return this.profileForm.get('isAvailable').value;
  }

  // --------------- HOOK METHODS ---------------//
  // --------------------------------------------//

  ngOnInit() {
    this.subscriptions();
  }

  ngOnDestroy(): void { }

  // -------------- PUBLIC METHODS --------------//
  // --------------------------------------------//

  public async saveProfile() {
    const profile = this.getProfileFromForm();
    const loading = await this.loadingCtrl.create({
      message: this.translateConfigService.translateInstant('PROFILE_PAGE.LOADER_MESSAGE'),
      spinner: 'crescent',
    });
    loading.present();

    this.profileService.addProfile(profile);
    if (this.isAvailable) {
      this.profileService.publishProfile(profile);
    } else {
      this.profileService.unpublishProfile(profile);
    }

    loading.dismiss();
  }

  public goToHome() {
    this.navCtrl.navigateRoot(AppRoutingPaths.Home);
  }

  public setPosition() {
    this.router.navigate([AppRoutingPaths.PositionPiker]);
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
        next: profile => this.populateProfileForm(profile)
      });
  }

  private getProfileSwitchMap(profile: Profile) {
    if (profile) {
      return of(profile);
    } else {
      return this.userDataService.getUser().pipe(map(user => {
        profile = new Profile();
        profile.setProfileByUser(user);
        return profile;
      }));
    }
  }

  private populateProfileForm(profile: Profile) {
    this.firstName = profile.name;
    this.lastName = profile.surName;
    this.address = profile.address;
    this.phone = profile.phone;
    this.isAvailable = profile.published;
    profile.activity.forEach(act => {
      this.profileForm.get(act.type).setValue(act.active);
    });
  }

  private getProfileFromForm(): Profile {
    return new Profile(
      this.firstName,
      this.lastName,
      this.address,
      this.phone,
      this.isAvailable,
      this.getActivitiesByForm()
    );
  }

  private getActivitiesByForm(): Role[] {
    return Object.values(RoleType).map(roleType => {
      return { active: this.profileForm.get(roleType).value, type: roleType };
    });
  }

}


