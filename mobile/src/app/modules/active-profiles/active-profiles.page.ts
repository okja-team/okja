import { ActiveProfilesService } from 'active-profiles.service';
import { AgmMap } from '@agm/core';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Profile } from 'models/class/profile';
import { ICapability } from 'models/inteface/capability.interfae';
import { Roles } from 'models/enums/roles.enum';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { TranslateConfigService } from '../../services/translate-config.service';
import { ProfileService } from 'services/profile.service';
import { take } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { UserDataService } from 'services/user-data/user-data.service';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import { User } from 'services/user-data/user.interface';
declare const google: any;

@Component({
  selector: 'active-profiles',
  templateUrl: 'active-profiles.page.html',
  styleUrls: ['active-profiles.page.scss']
})
export class ActiveProfilesPage implements OnInit, OnDestroy {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  hiddenMap = true;
  firstTime: boolean = true;
  opacityNotSelected: number = 0.4;
  opacitySelected: number = 1;
  icon: any = {
    url: 'assets/images/icon/help_you.png',
    scaledSize: {
      width: 48,
      height: 48
    }
  };

  clusterStyles: ClusterStyle[] = [{
    url: 'assets/images/icon/help_you_cluster.png', //background che non viene scalato
    height: 48,
    width: 48,
    anchor: [-3, -3], //The anchor position of the label text.
    textColor: '#FFFFFF',
    textSize: 18,
    // backgroundPosition: "",
    // iconAnchor: [number, number],
  }];

  profileSelected: Profile = null;
  activeProfile: Profile[] = [];
  lat: any;
  lng: any;
  map: any;
  avatarPhoto = '';
  userLogged = false;
  user: User;

  avatarPlaceHolder = 'assets/images/icon/ico_user_placeholder.svg';

  constructor(
    public readonly router: Router,
    private readonly translactionServise: TranslateConfigService,
    private readonly activeProfileSerive: ActiveProfilesService,
    private readonly profileService: ProfileService,
    private readonly callNumber: CallNumber,
    private readonly loadingCtrl: LoadingController,
    private readonly authService: AuthenticationService,
    private readonly userDataService: UserDataService

  ) {
    translactionServise.getDefaultLanguage();
    this.userDataService.isLogged().subscribe(v => {
      this.userLogged = v;
      if (v) {
        this.setProfile();
      } else {
        this.avatarPhoto = this.avatarPlaceHolder;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
    this.activeProfileSerive.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.activeProfile = x;
        // this.repositionMap();
      });
    this.repositionMap();
  }

  ionViewDidLeave() {
    this.lat = '';
    this.lng = '';
  }

  async repositionMap() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    await loader.present(); //TODO

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.hiddenMap = false;
        }
      });
    } else {
      this.setProfile();
    }
    await loader.dismiss();
  }

  setProfile() {
    this.profileService.getProfile()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(p => {
        this.avatarPhoto = (p && p.photoURL) ? p.photoURL : this.avatarPlaceHolder;
        if (p && p.position && p.position.lat && p.position.lng) {
          this.lat = p.position.lat;
          this.lng = p.position.lng;
          this.hiddenMap = false;
        }
      });
  }

  getOpacity(p: Profile): number {

    if (
      !this.profileSelected
      || (p.id && this.profileSelected.id === p.id)
      || (p.surName === this.profileSelected.surName && p.name === this.profileSelected.name)
    ) {
      return this.opacitySelected;
    }

    return this.opacityNotSelected;
  }

  goToProfile() {
    if (this.userLogged) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
    }
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('avatarPhoto'));
  }

  openCardHelper(profile: Profile): void {
    if (this.firstTime) {
      this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('ProfileHelperContainer'));
      this.firstTime = false;
    }
    this.profileSelected = profile;
    console.log(this.profileSelected.address);
  }

  getActiveRoles(): ICapability[] {
    if (this.profileSelected.capabilities) {
      return this.profileSelected.capabilities.filter(act => act.available);
    }
    return [];
  }

  getColorFromRoleType(roleType: Roles): string {
    switch (roleType) {
      case Roles.Food:
        return '#046506';
      case Roles.Pharmacy:
        return '#df8c8c';
      default:
        return '#dcdcdc';
    }
  }

  closeCard(): void {
    this.profileSelected = null;
  }

  openSkype(profile: Profile) {

  }

  callProfile() {
    this.callNumber.callNumber(this.profileSelected.phone, false).then(res => console.log('Launched dialer!', res))
  }
}
