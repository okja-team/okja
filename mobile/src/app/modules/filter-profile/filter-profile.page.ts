import { Component, OnDestroy, OnInit } from '@angular/core';
import { Profile } from 'models/class/profile';
import { ModalController, LoadingController } from '@ionic/angular';
import { FilterPage } from 'modules/filter/filter.page';
import { UserDataService } from 'services/user-data.service';
import { User } from 'models/inteface/user.interface';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActiveProfilesService } from 'active-profiles.service';
import { Plugins } from '@capacitor/core';
import { TranslateConfigService } from 'services/translate-config.service';
import { AuthenticationService } from 'services/authentication.service';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-filter-profile',
  templateUrl: 'filter-profile.page.html',
  styleUrls: ['filter-profile.page.scss']
})
export class FilterProfilePage implements OnInit, OnDestroy {

  activeProfiles: Profile[] = [];
  user: User;
  userPosition: any;
  distanceFilter = 5000;
  availabilityFilter = 'all_time';

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    public router: Router,
    private activeProfileService: ActiveProfilesService,
    private loadingCtrl: LoadingController,
    private translactionServise: TranslateConfigService,
    private readonly authService: AuthenticationService
  ) {
    this.authService.loggedUser.subscribe(u => {
      this.user = u;
    })
  }

  async ngOnInit() {
    await this.setLoading();
    await this.initDataUsers();
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
  }

  private async setLoading() {
    this.loadingElement = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
  }

  async openFilterModal() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: FilterPage,
        componentProps: {
          distance: this.distanceFilter,
          availability: this.availabilityFilter
        }
      });

    modal.onDidDismiss().then((filters) => {
      this.distanceFilter = filters.data.distance;
      this.availabilityFilter = filters.data.availability;
      this.getActiveProfiles();
    });

    await modal.present();
  }

  computeDistance(position) {
    const lat1 = position.lat;
    const lon1 = position.lng;
    const lat2 = this.userPosition.latitude;
    const lon2 = this.userPosition.longitude;

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

  computeRoundDistance(position) {
    let distance = this.computeDistance(position);
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

  sortProfiles(profiles) {
    profiles.sort((a, b) => {
      const dist1 = this.computeDistance(a.position);
      const dist2 = this.computeDistance(b.position);
      if (dist1 > dist2) {
        return 1;
      } else {
        return -1;
      }
    });

    return profiles;
  }

  filterProfiles(profiles) {
    profiles = this.sortProfiles(profiles);
    profiles = profiles.slice(0, 20);
    if (this.distanceFilter !== 9999) {
      profiles = profiles.filter(x => this.computeDistance(x.position) < this.distanceFilter);
    }
    return profiles;
  }

  async getActiveProfiles() {
    this.loadingElement.present();
    this.activeProfileService.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(profiles => {
        this.activeProfiles = this.filterProfiles(profiles);
        console.log(this.activeProfiles[0]);
        this.loadingElement.dismiss();
      });
  }


  goToProfile() {
    this.router.navigate(['profile']);
  }

  async initDataUsers() {
    this.loadingElement.present();
    Geolocation.getCurrentPosition().then((resp) => {
      this.userPosition = resp.coords;
      this.getActiveProfiles();
      this.loadingElement.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
