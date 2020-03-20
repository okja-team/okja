import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Plugins, Toast } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Profile } from '../../models/profile';
import { LoadingController } from '@ionic/angular';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-position-piker',
  templateUrl: './position-piker.page.html',
  styleUrls: ['./position-piker.page.scss'],
})
export class PositionPikerPage implements OnInit, OnDestroy {

  profile: Profile;
  public lat: any; public lng: any;
  showingCurrent = false;
  address: string;
  constructor(
    private nativeGeocoder: NativeGeocoder,
    private ngZone: NgZone,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController
  ) {
    this.profileService.getProfile()
      .pipe(untilDestroyed(this))
      .subscribe(profile => {
        this.profile = profile;
        this.getSavedPosition();
      });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
    this.getSavedPosition();
  }

  async setCurrentPosition() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    loader.present(); //TODO
    const position = await Geolocation.getCurrentPosition();
    this.ngZone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
    this.showingCurrent = true;
    loader.dismiss();
  }

  async geocode() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    if (this.address !== '') {
      const options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.forwardGeocode(this.address, options)
        .then((result: NativeGeocoderResult[]) => {
          this.ngZone.run(() => {
            this.lat = parseFloat(result[0].latitude);
            this.lng = parseFloat(result[0].longitude);
          })
          this.showingCurrent = true;
        })
        .catch((error: any) => console.log(error));
    } else {
      await Toast.show({
        text: 'Please add address to Geocode'
      });
    }
    loader.dismiss();
  }

  savePosition() {
    if (this.lat && this.lng && this.lat !== '' && this.lng !== '') {
      this.profile.position = { lat: this.lat, lng: this.lng };
      this.profileService.addProfile(this.profile);
      if (this.profile.published) {
        this.profileService.publishProfile(this.profile);
      }
    } else {
      window.alert(`no position selected`);
    }
  }

  onDragEnd(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  getSavedPosition() {
    if (this.profile && this.profile.position
      && this.profile.position.lat
      && this.profile.position.lat !== ''
      && this.profile.position.lng
      && this.profile.position.lng !== ''
    ) {
      this.lat = this.profile.position.lat;
      this.lng = this.profile.position.lng;
      this.showingCurrent = true;
    } else {
      this.setCurrentPosition();
    }
  }
}

