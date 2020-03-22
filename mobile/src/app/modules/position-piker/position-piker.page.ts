import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Plugins, Toast } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ProfileService } from '../../services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { LoadingController } from '@ionic/angular';
import { Profile } from 'models/class/profile';

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
  retrievedAddress: any;
  reversedAddress = '';

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
      this.reverseGeocoding();
    });
    this.showingCurrent = true;
    loader.dismiss();
  }

  async geocode() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    if (this.address && this.address !== '') {
      const options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.forwardGeocode(this.address, options)
        .then((result: NativeGeocoderResult[]) => {
          this.ngZone.run(() => {
            this.retrievedAddress = result[0];
            this.lat = parseFloat(result[0].latitude);
            this.lng = parseFloat(result[0].longitude);
            this.showingCurrent = true;
            this.formatAddress();
          });
        })
        .catch((error: any) => {
          window.alert('No result found');
        });
    } else {
      window.alert('Please add address to Geocode');
    }
    loader.dismiss();
  }

  reverseGeocoding() {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    if (this.lat && this.lng) {
      this.nativeGeocoder.reverseGeocode(this.lat, this.lng, options)
        .then((result: NativeGeocoderResult[]) => {
          this.retrievedAddress = result[0];
          this.formatAddress();
          // console.log(JSON.stringify(result[0]));
        }
        )
        .catch((error: any) => console.log(error));
    }
  }

  formatAddress() {
    const subLocality = this.retrievedAddress.subLocality ? this.retrievedAddress.subLocality + ', ' : '';
    const locality = this.retrievedAddress.locality ? this.retrievedAddress.locality + ', ' : '';
    const administrativeArea = this.retrievedAddress.administrativeArea ? this.retrievedAddress.administrativeArea + ', ' : '';
    const postalCode = this.retrievedAddress.postalCode ? this.retrievedAddress.postalCode + ', ' : '';
    const countryName = this.retrievedAddress.countryName ? this.retrievedAddress.countryName : '';
    this.reversedAddress = subLocality + locality + administrativeArea + postalCode + countryName;
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

  onDragEnd(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.reverseGeocoding();
  }

  getSavedPosition() {
    if (this.profile && this.profile.position
      && this.profile.position.lat
      && this.profile.position.lng
      && this.address
    ) {
      this.lat = this.profile.position.lat;
      this.lng = this.profile.position.lng;
      this.retrievedAddress = this.profile.address;
      this.showingCurrent = true;
    } else {
      this.setCurrentPosition();
    }
  }
}

