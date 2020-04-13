import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { Profile } from 'models/class/profile';
import { GeolocationService } from 'services/geolocation.service';
import { TranslateConfigService } from 'services/translate-config.service';
import { IPosition } from 'models/inteface/position.interface';
import { LoaderService } from 'services/loader.service';

@Component({
  selector: 'app-position-piker',
  templateUrl: './position-piker.component.html',
  styleUrls: ['./position-piker.component.scss'],
})
export class PositionPikerComponent implements OnInit, OnDestroy {

  @Input() position: IPosition;

  profile: Profile;
  public lat: any; public lng: any;
  address: string;
  retrievedAddress: any;
  reversedAddress = '';
  isMobileApp = false;

  constructor(
    private readonly loaderService: LoaderService,
    private readonly geoService: GeolocationService,
    private readonly platform: Platform,
    private readonly translateConfigService: TranslateConfigService,
    private readonly modalController: ModalController,
    private readonly navParams: NavParams
  ) {
    this.translateConfigService.getDefaultLanguage();
    this.isMobileApp = this.platform.is('capacitor');
    this.profile = this.navParams.get('profile');
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  ionViewDidEnter() {
    this.getSavedPosition();
  }

  async geocodeAddress() {
    await this.loaderService.showLoader();
    if (this.address && this.address !== '') {
      const geo = await this.geoService.geocodeAddress(this.address);
      this.lat = geo.position.lat;
      this.lng = geo.position.lng;
      this.reversedAddress = geo.address;
    }

    await this.loaderService.hideLoader();
  }

  async returnPosition() {
    if (this.lat && this.lng) {

      if (this.reversedAddress) {
        this.profile.address = this.reversedAddress;
      }

      this.profile.position = { lat: this.lat, lng: this.lng };

      this.modalController.dismiss({
        profile: this.profile
      });

    } else {
      window.alert(`no position selected`);
    }
  }

  async onDragEnd(event) {
    try {
      await this.loaderService.showLoader();
      this.lat = event.coords.lat;
      this.lng = event.coords.lng;
      const reversedAddress = await this.geoService.reverseGeocoding(this.lat, this.lng);
      this.reversedAddress = reversedAddress;
      await this.loaderService.hideLoader();
    }
    catch (error) {
      await this.loaderService.hideLoader();
      window.alert(`error on onDragEnd: ${error}`);
      console.log('Error getting onDragEnd', error);
    }
  }

  async getSavedPosition() {
    await this.loaderService.showLoader();
    if (this.profile && this.profile.position
      && this.profile.position.lat
      && this.profile.position.lng
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
    await this.loaderService.hideLoader();
  }

  async getCurrentPosition() {
    try {
      await this.loaderService.showLoader();
      const geo = await this.geoService.getCurrentPosition();
      this.lat = geo.lat;
      this.lng = geo.lng;
      const reversedAddress = await this.geoService.reverseGeocoding(geo.lat, geo.lng);
      this.reversedAddress = reversedAddress;
      await this.loaderService.hideLoader();
    }
    catch (error) {
      await this.loaderService.hideLoader();
      window.alert(`error on getCurrentPosition: ${error}`);
      console.log('Error getting getCurrentPosition', error);
    }
  }
}

