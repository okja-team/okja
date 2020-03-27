import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { LoadingController, Platform } from '@ionic/angular';
import { Profile } from 'models/class/profile';
import { GeolocationService } from 'services/geolocation.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-position-piker',
  templateUrl: './position-piker.page.html',
  styleUrls: ['./position-piker.page.scss'],
})
export class PositionPikerPage implements OnInit, OnDestroy {

  profile: Profile;
  public lat: any; public lng: any;
  showingCurrent = true;
  address: string;
  retrievedAddress: any;
  reversedAddress = '';
  isMobileApp = false;

  constructor(
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    private geoService: GeolocationService,
    private platform: Platform
  ) {
    this.isMobileApp = this.platform.is('capacitor');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
    this.profileService.getProfile()
      .pipe(
        take(1),
        untilDestroyed(this))
      .subscribe(profile => {
        this.profile = profile;
        this.getSavedPosition();
      });
  }

  async geocodeAddress() {
    const loader = await this.loadingCtrl.create();
    await loader.present();
    if (this.address && this.address !== '') {
      const geo = await this.geoService.geocodeAddress(this.address);
      this.lat = geo.position.lat;
      this.lng = geo.position.lng;
      this.reversedAddress = geo.address;
    }

    await loader.dismiss();
  }

  savePosition() {
    if (this.lat && this.lng) {
      if (this.reversedAddress) {
        this.profile.address = this.reversedAddress;
      }
      this.profile.position = { lat: this.lat, lng: this.lng };
      this.profileService.addProfile(this.profile);
    } else {
      window.alert(`no position selected`);
    }
  }

  async onDragEnd(event) {
    const loader = await this.loadingCtrl.create();
    await loader.present();

    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    const reversedAddress = await this.geoService.reverseGeocoding(this.lat, this.lng);
    this.reversedAddress = reversedAddress;
    await loader.dismiss();
  }

  async getSavedPosition() {
    const loader = await this.loadingCtrl.create();
    await loader.present();

    if (this.profile && this.profile.position
      && this.profile.position.lat !== 0
      && this.profile.position.lng !== 0
      && this.address
    ) {
      this.lat = this.profile.position.lat;
      this.lng = this.profile.position.lng;
      this.retrievedAddress = this.profile.address;
    } else {
      await this.getCurrentPosition();
    }
    await loader.dismiss();
  }

  async getCurrentPosition() {
    const loader = await this.loadingCtrl.create();
    await loader.present();

    const geo = await this.geoService.getCurrentPosition();
    this.lat = geo.lat;
    this.lng = geo.lng;
    const reversedAddress = await this.geoService.reverseGeocoding(geo.lat, geo.lng);
    this.reversedAddress = reversedAddress;
    await loader.dismiss();
  }
}

