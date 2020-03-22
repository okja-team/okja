import { ActiveProfilesService } from 'active-profiles.service';
import { AgmMap } from '@agm/core';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Profile } from 'models/class/profile';
import { CardProfileComponent } from 'modules/card-profile/card-profile.component';
import { TranslateConfigService } from 'services/translate-config.service';
import { ProfileService } from 'services/profile.service';
import { take } from 'rxjs/operators';
import { LoadingController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { AuthenticationService } from 'services/authentication/authentication.service';
import { UserDataService } from 'services/user-data/user-data.service';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
declare const google: any;

@Component({
  selector: 'active-profiles',
  templateUrl: 'active-profiles.page.html',
  styleUrls: ['active-profiles.page.scss']
})
export class ActiveProfilesPage implements OnInit, OnDestroy {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  hiddenMap = true;
  opacityNotSelected: number = 0.4;
  opacitySelected: number = 1;
  icon: any = {
    url: 'assets/images/icon/help_you.png',
    scaledSize: {
      width: 48,
      height: 48
    }
  };

  clusterStyles: ClusterStyle[] = [{
    url: 'assets/images/icon/help_you_cluster.png', //background che non viene scalato
    height: 48,
    width: 48,
    anchor: [-3, -3], //The anchor position of the label text.
    textColor: '#FFFFFF',
    textSize: 18,
    // backgroundPosition: "",
    // iconAnchor: [number, number],
  }];

  profileSelected: Profile = null;
  activeProfile: Profile[] = [];
  lat: any;
  lng: any;
  map: any;
  avatarPhoto = '';
  userLogged = false;

  constructor(
    public readonly router: Router,
    private readonly translactionServise: TranslateConfigService,
    private readonly activeProfileSerive: ActiveProfilesService,
    private readonly profileService: ProfileService,
    private readonly loadingCtrl: LoadingController,
    private readonly authService: AuthenticationService,
    private readonly userDataService: UserDataService,
    private readonly modalController: ModalController,
    private readonly routerOutlet: IonRouterOutlet
  ) {
    translactionServise.getDefaultLanguage();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
    this.getActiveProfile();
    this.repositionMap();
  }

  ionViewDidLeave() {
    this.lat = '';
    this.lng = '';
  }

  async getActiveProfile() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    loader.present()
      .then(x => {
        this.userLogged = this.userDataService.isLoggedIn;
        this.activeProfileSerive.getActiveProfile()
          .pipe(untilDestroyed(this))
          .subscribe(x => {
            this.activeProfile = x;
            // this.repositionMap();
          });
        const placeHolder = 'assets/images/icon/ico_user_placeholder.svg';
        this.avatarPhoto = placeHolder;
        if (this.userLogged) {
          this.profileService.getProfile()
            .pipe(take(1), untilDestroyed(this))
            .subscribe(x => {
              this.avatarPhoto = placeHolder;
              if (x && x.photoURL) {
                this.avatarPhoto = x.photoURL;
              }
            });
        }
      })
      .finally(() => {
        loader.dismiss();
      })

  }

  async repositionMap() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    loader.present()
      .then(x => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position: Position) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.hiddenMap = false;
            }
          });
        } else {
          this.profileService.getProfile()
            .pipe(take(1), untilDestroyed(this))
            .subscribe(p => {
              if (p && p.position && p.position.lat && p.position.lng) {
                this.lat = p.position.lat;
                this.lng = p.position.lng;
                this.hiddenMap = false;
              }
            });
        }
      })
      .finally(() => {
        loader.dismiss();
      });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CardProfileComponent,
      componentProps: {
        'profileSelected': this.profileSelected
      },
      swipeToClose: true,
      showBackdrop: true,
      presentingElement: this.routerOutlet.nativeEl,
      mode: 'ios',
      cssClass: 'map-modal-card'
    });
    return modal.present();
  }

  getOpacity(p: Profile): number {

    if (
      !this.profileSelected
      || (p.id && this.profileSelected.id === p.id)
      || (p.surName === this.profileSelected.surName && p.name === this.profileSelected.name)
    ) {
      return this.opacitySelected;
    }

    return this.opacityNotSelected;
  }

  goToProfile() {
    this.authService.checkAuth()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['profile']);
        } else {
          this.router.navigate(['login']);
        }
      })
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('avatarPhoto'));
  }

  openCardHelper(profile: Profile): void {
    this.profileSelected = profile;
    this.presentModal();
  }

  closeCard(): void {
    this.profileSelected = null;
  }
}
