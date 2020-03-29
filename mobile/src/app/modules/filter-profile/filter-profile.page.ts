import { Component, OnDestroy, OnInit } from '@angular/core';
import { Profile } from 'models/class/profile';
import { ModalController, LoadingController } from '@ionic/angular';
import { FilterPage } from 'modules/filter/filter.page';
import { User } from 'models/inteface/user.interface';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActiveProfilesService } from 'active-profiles.service';
import { AuthenticationService } from 'services/authentication.service';
import { GeolocationService } from 'services/geolocation.service';
import { ProfilePosition } from 'models/class/profile-position';

@Component({
  selector: 'app-filter-profile',
  templateUrl: 'filter-profile.page.html',
  styleUrls: ['filter-profile.page.scss']
})
export class FilterProfilePage implements OnInit, OnDestroy {

  activeProfiles: Profile[] = [];
  user: User;
  userLogged = false;
  userPosition: ProfilePosition;
  distanceFilter = 9999;
  availabilityFilter = 'all_time';
  avatarPlaceHolder = 'assets/images/icon/ico_user_placeholder.svg';
  avatarPhoto = '';

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    private readonly geoService: GeolocationService,
    public router: Router,
    private activeProfileService: ActiveProfilesService,
    private loadingCtrl: LoadingController,
    private readonly authService: AuthenticationService
  ) {
    this.setSubscriptions();
  }

  async ngOnInit() {
    await this.setLoading();
    await this.initData();
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
    this.refreshData();
  }

  setSubscriptions() {
    this.avatarPhoto = this.avatarPlaceHolder;
    this.authService.loggedUser.subscribe((user) => {
      if (user) {
        this.userLogged = true;
        this.avatarPhoto = user.photoURL ? user.photoURL : this.avatarPlaceHolder;
      } else {
        this.userLogged = false;
        this.avatarPhoto = this.avatarPlaceHolder;
      }
    });
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
    this.loadingElement.present();
    this.activeProfileService.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(profiles => {
        this.activeProfiles = this.filterProfiles(profiles);
        this.loadingElement.dismiss();
      });
  }


  goToProfile() {
    if (this.userLogged) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
    }
  }

  async initData() {
    try {
      this.loadingElement.present();
      this.userPosition = await this.geoService.getCurrentPosition();
      this.getActiveProfiles();

    } catch (error) {
      console.log('Error getting location', error);
    };
  }

  async refreshData() {
    this.userPosition = await this.geoService.getCurrentPosition();
    this.activeProfiles = this.filterProfiles(this.activeProfiles);

  }

}
