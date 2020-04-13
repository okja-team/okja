import { ActiveProfilesService } from 'active-profiles.service';
import { AgmMap } from '@agm/core';
import { CardProfileComponent } from 'component/card-profile/card-profile.component';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { GeolocationService } from 'services/geolocation.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Profile } from 'models/class/profile';
import { Router } from '@angular/router';
import { TranslateConfigService } from 'services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { User } from 'models/inteface/user.interface';
import { AuthenticationService } from 'services/authentication.service';
import { LoaderService } from 'services/loader.service';

declare const google: any;

@Component({
  selector: 'active-profiles',
  templateUrl: 'active-profiles.page.html',
  styleUrls: ['active-profiles.page.scss']
})
export class ActiveProfilesPage implements OnInit, OnDestroy {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  hiddenMap = false;
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
    url: 'assets/images/icon/help_you_cluster.png',
    height: 48,
    width: 48,
    anchor: [-3, -3],
    textColor: '#FFFFFF',
    textSize: 18,
  }];

  profileSelected: Profile = null;
  activeProfile: Profile[] = [];
  lat: any;
  lng: any;
  map: any;
  avatarPhoto = '';
  userLogged = false;
  user: User;
  userProfile: Profile;

  avatarPlaceHolder = 'assets/images/icon/ico_user_placeholder.svg';

  constructor(
    private readonly translactionServise: TranslateConfigService,
    private readonly router: Router,
    private readonly activeProfileSerive: ActiveProfilesService,
    private readonly loaderService: LoaderService,
    private readonly modalController: ModalController,
    private readonly geoService: GeolocationService,
    private readonly authService: AuthenticationService,
    private readonly toastController: ToastController
  ) {
    this.translactionServise.getDefaultLanguage();
    this.setSubscriptions();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  async ionViewDidEnter() {
  }

  private async showWelcomeMessage() {
    const toast = await this.toastController.create({
      cssClass: 'toast-welcome',
      duration: 0,
      header: this.translactionServise.translateInstant("WELCOME.TITLE"),
      message: this.translactionServise.translateInstant("WELCOME.MESSAGE"),
      buttons: [
        {
          side: 'end',
          text: this.translactionServise.translateInstant("WELCOME.CTA"),
          handler: () => {
            this.goToProfile();
          }
        }
      ]
    });
    toast.present();
  }

  ionViewDidLeave() {
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
        this.showWelcomeMessage();
      }
    })

    this.activeProfileSerive.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.activeProfile = x;
      });
    this.repositionMap();
  }

  async repositionMap() {
    try {
      await this.loaderService.showLoader();
      const geo = await this.geoService.getCurrentPosition();
      if (geo) {
        this.lat = geo.lat;
        this.lng = geo.lng;
      }
      await this.loaderService.hideLoader();
    }
    catch (err) {
      await this.loaderService.hideLoader();
      window.alert(`error on repositionMap: ${err}`);

    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CardProfileComponent,
      componentProps: {
        'profileSelected': this.profileSelected
      },
      swipeToClose: true,
      showBackdrop: true,
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
    if (this.userLogged) {
      this.router.navigate(['profile']);
    } else {
      this.router.navigate(['login']);
    }
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
