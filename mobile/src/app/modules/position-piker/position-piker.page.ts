import { Component, OnInit, NgZone } from '@angular/core';
import { Plugins, Toast } from '@capacitor/core';
const { Geolocation } = Plugins;
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-position-piker',
  templateUrl: './position-piker.page.html',
  styleUrls: ['./position-piker.page.scss'],
})
export class PositionPikerPage implements OnInit {

  public coords;

  public lat: any; public lng: any;
  showingCurrent: boolean = false;
  address: string;
  constructor(
    private nativeGeocoder: NativeGeocoder,
    private ngZone: NgZone,
    private profileService: ProfileService) {

  }

  ngOnInit() {
  }


  ionViewDidEnter() {
    this.setCurrentPosition();
  }

  async setCurrentPosition() {
    this.coords = await Geolocation.getCurrentPosition();
    this.ngZone.run(() => {
      this.lat = this.coords.coords.latitude;
      this.lng = this.coords.coords.longitude;
      window.alert(this.lat + " " + this.lng);
    })
    this.showingCurrent = true;
  }

  async geocode() {
    if (this.address != "") {
      let options: NativeGeocoderOptions = {
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
    }
    else {
      await Toast.show({
        text: 'Please add address to Geocode'
      });
    }
  }

  savePosition() {
    this.profileService.getProfile().subscribe(p => {
      p.position = { lat: this.lat, lng: this.lng };
      this.profileService.addProfile(p);
      if (p.published) {
        this.profileService.publishProfile(p);
      }
    })
  }
}

// async getCoordinate() {
//   const coordinates = await Geolocation.getCurrentPosition();
//   this.coords = coordinates.coords;
//   this.lat = coordinates.coords.latitude;
//   this.lng = coordinates.coords.longitude;

// }

// reverseGeocode() {
//   let options: NativeGeocoderOptions = {
//     useLocale: true,
//     maxResults: 5
//   };
//   this.nativeGeocoder.reverseGeocode(this.coords, this.coords, options)
//     .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
//     .catch((error: any) => console.log(error));
// }

// forwardGeocode() {
//   this.nativeGeocoder.forwardGeocode(this.address, options)
//     .then((result: NativeGeocoderResult[]) => {
//       console.log('lat=' + result[0].latitude + 'long=' + result[0].longitude);
//     })
//     .catch((error: any) => console.log(error));

