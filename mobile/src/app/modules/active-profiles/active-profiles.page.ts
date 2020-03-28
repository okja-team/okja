import { ActiveProfilesService } from 'active-profiles.service';
import { AgmMap } from '@agm/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CardProfileComponent } from 'modules/card-profile/card-profile.component';
import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import { GeolocationService } from 'services/geolocation.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Profile } from 'models/class/profile';
import { ProfileService } from 'services/profile.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TranslateConfigService } from 'services/translate-config.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { User } from 'models/inteface/user.interface';

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
    translactionServise: TranslateConfigService,
    public readonly router: Router,
    private readonly activeProfileSerive: ActiveProfilesService,
    private readonly profileService: ProfileService,
    private readonly loadingCtrl: LoadingController,
    private readonly modalController: ModalController,
    private readonly geoService: GeolocationService,
    private readonly ngFireAuth: AngularFireAuth,

  ) {
    translactionServise.getDefaultLanguage();
    this.setSubscriptions();

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
  }

  ionViewDidLeave() {
  }

  setSubscriptions() {
    this.avatarPhoto = this.avatarPlaceHolder;
    this.ngFireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userLogged = true;
        this.setProfile();
      } else {
        this.userLogged = false;
        this.avatarPhoto = this.avatarPlaceHolder;
      }
    });

    this.activeProfileSerive.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.activeProfile = x;
      });
    this.repositionMap();
  }

  async repositionMap() {
    const loader = await this.loadingCtrl.create();
    await loader.present();

    const geo = await this.geoService.getCurrentPosition();
    if (geo) {
      this.lat = geo.lat;
      this.lng = geo.lng;
    } else if (this.userProfile && this.userProfile.position) {
      this.lat = this.userProfile.position.lat;
      this.lng = this.userProfile.position.lng;
    }
    await loader.dismiss();
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

  setProfile() {
    this.profileService.getProfile()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(p => {
        this.userProfile = p;
        this.avatarPhoto = (p && p.photoURL) ? p.photoURL : this.avatarPlaceHolder;
        if (p && p.position && p.position.lat && p.position.lng) {
          this.lat = p.position.lat;
          this.lng = p.position.lng;
        }
      });
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
