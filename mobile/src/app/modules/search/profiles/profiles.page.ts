import { Component, OnDestroy, OnInit } from '@angular/core';
import { Profile } from 'models/class/profile';
import { ModalController } from '@ionic/angular';
import { FiltersPage } from 'modules/search/filters/filters.page';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActiveProfilesService } from 'active-profiles.service';
import { GeolocationService } from 'services/geolocation.service';
import { ProfilePosition } from 'models/class/profile-position';
import { LoaderService } from 'services/loader.service';

@Component({
  selector: 'search-profiles',
  templateUrl: 'profiles.page.html',
  styleUrls: ['profiles.page.scss']
})
export class ProfilesPage implements OnInit, OnDestroy {

  activeProfiles: Profile[] = [];
  userPosition: ProfilePosition;
  distanceFilter = 9999;
  availabilityFilter = 'all_time';

  constructor(
    private modalController: ModalController,
    private readonly geoService: GeolocationService,
    public router: Router,
    private activeProfileService: ActiveProfilesService,
    private loaderService: LoaderService,
  ) {
  }

  async ngOnInit() {
    await this.initData();
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
    this.refreshData();
  }

  async openFilterModal() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: FiltersPage,
        componentProps: {
          distance: this.distanceFilter,
          availability: this.availabilityFilter
        }
      });

    modal.onDidDismiss().then(async (filters) => {
      this.distanceFilter = filters.data.distance;
      this.availabilityFilter = filters.data.availability;
      await this.getActiveProfiles();
    });

    await modal.present();
  }

  computeRoundDistance = (position) => {
    return this.geoService.computeRoundDistance(position, this.userPosition);
  }

  sortProfiles(profiles: Profile[]) {
    profiles.sort((a, b) => {
      const dist1 = this.geoService.computeDistance(a.position, this.userPosition);
      const dist2 = this.geoService.computeDistance(b.position, this.userPosition);
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
      profiles = profiles.filter(x => this.geoService.computeDistance(x.position, this.userPosition) < this.distanceFilter);
    }
    return profiles;
  }

  async getActiveProfiles() {
    this.activeProfileService.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(
        profiles => {
          this.activeProfiles = this.filterProfiles(profiles);
        });
  }

  async initData() {
    try {
      await this.loaderService.showLoader();
      this.userPosition = await this.geoService.getCurrentPosition();
      await this.getActiveProfiles();
      await this.loaderService.hideLoader();
    }
    catch (error) {
      this.loaderService.hideLoader();
      window.alert(`error on initData: ${error}`);
      console.log('Error getting inidData', error);
    };
  }

  async refreshData() {
    try {
      this.userPosition = await this.geoService.getCurrentPosition();
      this.activeProfiles = this.filterProfiles(this.activeProfiles);
    }
    catch (error) {
      window.alert(`error on refreshData: ${error}`);
      console.log('Error getting refreshData', error);
    }

  }

}
