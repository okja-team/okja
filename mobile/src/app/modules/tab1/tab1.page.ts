import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveProfileService } from 'active-profile.service';
import { Profile } from 'models/profile';
import { Role } from 'models/role';
import { RoleType } from 'models/role.enum';
import { AgmMap } from '@agm/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { TranslateConfigService } from '../../services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
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
    url: "assets/images/icon/help_you.png",
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

    if (!this.profileSelected || (p.id && this.profileSelected.id == p.id) || (p.surName == this.profileSelected.surName && p.name == this.profileSelected.name))
      return this.opacitySelected;

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
    if(this.firstTime){
      this.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('ProfileHelperContainer'));
      this.firstTime = false;
    }
    this.profileSelected = profile;
  }

  getActiveRoles(): Role[] {
    if(this.profileSelected.activity)
      return this.profileSelected.activity.filter(act => act.active);
    return [];
  }

  getColorFromRoleType(roleType: RoleType): string {
    switch (roleType) {
      case RoleType.Food:
        return "#046506";
      case RoleType.Pharmacy:
        return "#df8c8c";
      default:
        return "#dcdcdc";
    }
  }

  closeCard(): void{
    this.profileSelected = null;
  }

  openSkype(profile: Profile){

  }

  callProfile(){
    this.callNumber.callNumber(this.profileSelected.phone, false).then(res => console.log('Launched dialer!', res))
  }
}
