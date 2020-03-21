import { ActiveProfileService } from 'active-profile.service';
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
declare const google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  firstTime: boolean = true;
  opacityNotSelected: number = 0.4;
  opacitySelected: number = 1;
  icon: any = {
    url: 'assets/images/icon/help_you.png',
    scaledSize: {
      width: 64,
      height: 64
    }
  };
  profileSelected: Profile = null;
  activeProfile: Profile[] = [];
  lat: Number;
  lng: Number;

  map: any;

  constructor(
    public router: Router,
    private translactionServise: TranslateConfigService,
    private activeProfileSerive: ActiveProfileService,
    private callNumber: CallNumber) {
    translactionServise.getDefaultLanguage();
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
    this.lat = 0;
    this.lng = 0;
  }

  repositionMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      })
    }
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
    this.router.navigate(['profile']);
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('ProfileButton'));
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
