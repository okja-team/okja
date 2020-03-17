import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Plugins, Toast } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ProfileService } from 'services/profile.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

const { Geolocation } = Plugins;

@Component({
  selector: 'app-position-piker',
  templateUrl: './position-piker.page.html',
  styleUrls: ['./position-piker.page.scss'],
})
export class PositionPikerPage implements OnInit, OnDestroy {

  public lat: any; public lng: any;
  showingCurrent = false;
  address: string;
  constructor(
    private nativeGeocoder: NativeGeocoder,
    private ngZone: NgZone,
    private profileService: ProfileService) {

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
    this.getSavedPosition();
  }

  async setCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    this.ngZone.run(() => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
    this.showingCurrent = true;
  }

  async geocode() {
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
  }

  savePosition() {
    this.profileService.getProfile()
      .pipe(untilDestroyed(this))
      .subscribe(p => {
        p.position = { lat: this.lat, lng: this.lng };
        this.profileService.addProfile(p);
        if (p.published) {
          this.profileService.publishProfile(p);
        }
      });
  }

  onDragEnd(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  getSavedPosition() {
    this.profileService.getProfile()
      .pipe(untilDestroyed(this))
      .subscribe(p => {
        if (p && p.position && p.position.lat && p.position.lng) {
          this.lat = p.position.lat;
          this.lng = p.position.lng;
          this.showingCurrent = true;
        } else {
          this.setCurrentPosition();
        }
      });
  }
}

