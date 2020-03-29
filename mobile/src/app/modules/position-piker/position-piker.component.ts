import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { LoadingController, Platform, ModalController, NavParams } from '@ionic/angular';
import { Profile } from 'models/class/profile';
import { GeolocationService } from 'services/geolocation.service';
import { take } from 'rxjs/operators';
import { TranslateConfigService } from 'services/translate-config.service';
import { IPosition } from 'models/inteface/position.interface';

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
    private readonly profileService: ProfileService,
    private readonly loadingCtrl: LoadingController,
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

