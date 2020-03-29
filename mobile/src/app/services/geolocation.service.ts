import { Injectable } from '@angular/core';
import { ProfilePosition } from 'models/class/profile-position';
import { NativeGeocoderOptions, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { TranslateConfigService } from './translate-config.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IGeoWeb } from 'models/inteface/geo-web.innterface';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private readonly nativeGeocoder: NativeGeocoder,
    private readonly platform: Platform,
    private readonly translactionServise: TranslateConfigService,
    private readonly http: HttpClient,
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

  formatGeoWebAddress(retrievedAddress: IGeoWeb[]): string {
    let subLocality = '';
    let locality = '';
    let administrativeArea = '';
    let postalCode = '';
    let countryName = '';
    retrievedAddress.forEach(element => {
      if (element.types.includes('sublocality')) {
        subLocality = element.short_name ? element.short_name + ', ' : '';
      }
      if (element.types.includes('locality')) {
        locality = element.short_name ? element.short_name + ', ' : '';
      }
      if (!subLocality && !locality && element.types.includes('administrative_area_level_3')) {
        subLocality = element.short_name ? element.short_name + ', ' : '';
      }
      if (element.types.includes('administrative_area_level_1')) {
        administrativeArea = element.short_name ? element.short_name + ', ' : '';
      }
      if (element.types.includes('postal_code')) {
        postalCode = element.short_name ? element.short_name + ', ' : '';
      }
      if (element.types.includes('country')) {
        countryName = element.long_name ? element.long_name : '';
      }


    });
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
    else {
      const res = await this.reverseGeoWeb(lat, lng)
      if (res && res.results) {
        const reverseAddress = this.formatGeoWebAddress(res.results[0].address_components);
        return reverseAddress;
      }
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

  public computeDistance(position: ProfilePosition, userPosition: ProfilePosition) {
    const lat1 = position.lat;
    const lon1 = position.lng;
    const lat2 = userPosition.lat;
    const lon2 = userPosition.lng;

    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1000.609344;
      return Math.trunc(dist);
    }
  }

  public computeRoundDistance(position: ProfilePosition, userPosition: ProfilePosition) {
    let distance = this.computeDistance(position, userPosition);
    distance = Math.round(distance / 500) * 500;
    let unit;
    if (distance >= 1000) {
      distance = Math.round(distance / 1000);
      unit = this.translactionServise.translateInstant('COMMON.UNIT_DISTANCE_K');
    } else {
      unit = this.translactionServise.translateInstant('COMMON.UNIT_DISTANCE');
    }
    return distance + unit;
  }

  public async reverseGeoWeb(lat: number, lng: number): Promise<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.GMaps.apiKey}`
    ).toPromise();

  }
}
