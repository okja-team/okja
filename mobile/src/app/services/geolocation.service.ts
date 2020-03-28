import { Injectable } from '@angular/core';
import { ProfilePosition } from 'models/class/profile-position';
import { NativeGeocoderOptions, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private nativeGeocoder: NativeGeocoder,
    private readonly platform: Platform
  ) { }

  approximateLocation(geo: ProfilePosition) {
    const apx: ProfilePosition = {
      lat: Math.floor(geo.lat * 1000 + 0.5) / 1000,
      lng: Math.floor(geo.lng * 1000 + 0.5) / 1000
    };
    return apx;

  }

  async getCurrentPosition(): Promise<ProfilePosition> {
    const position = await Geolocation.getCurrentPosition();
    const p: ProfilePosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    return this.approximateLocation(p);
  }

  formatAddress(retrievedAddress: any): string {
    const subLocality = retrievedAddress.subLocality ? retrievedAddress.subLocality + ', ' : '';
    const locality = retrievedAddress.locality ? retrievedAddress.locality + ', ' : '';
    const administrativeArea = retrievedAddress.administrativeArea ? retrievedAddress.administrativeArea + ', ' : '';
    const postalCode = retrievedAddress.postalCode ? retrievedAddress.postalCode + ', ' : '';
    const countryName = retrievedAddress.countryName ? retrievedAddress.countryName : '';
    const reversedAddress = subLocality + locality + administrativeArea + postalCode + countryName;
    return reversedAddress;
  }

  async reverseGeocoding(lat: number, lng: number, maxResult: number = 5): Promise<string> {
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: maxResult
    };
    if (lat && lng && this.platform.is('capacitor')) {
      const result = await this.nativeGeocoder.reverseGeocode(lat, lng, options);
      const retrievedAddress = result[0];
      const reverseAddress = this.formatAddress(retrievedAddress);
      return reverseAddress;
    }
  }

  async geocodeAddress(address: string, maxResult: number = 5): Promise<{ position: ProfilePosition, address: string }> {
    if (address && address !== '') {
      const options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: maxResult
      };
      if (this.platform.is('capacitor')) {
        const result = await this.nativeGeocoder.forwardGeocode(address, options);
        const retrievedAddress = result[0];
        const p: ProfilePosition = {
          lat: parseFloat(retrievedAddress.latitude),
          lng: parseFloat(retrievedAddress.longitude)
        };
        const apx = this.approximateLocation(p);

        const fAddress = await this.reverseGeocoding(apx.lat, apx.lng);
        return { position: p, address: fAddress };
      }
    }
  }
}
