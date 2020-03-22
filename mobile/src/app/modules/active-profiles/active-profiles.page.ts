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
import { TranslateConfigService } from '../../services/translate-config.service';
import { ProfileService } from 'services/profile.service';
import { take } from 'rxjs/operators';
import { LoadingController, ModalController } from '@ionic/angular';
import { CardProfileComponent } from 'modules/card-profile/card-profile.component';
declare const google: any;

@Component({
  selector: 'active-profiles',
  templateUrl: 'active-profiles.page.html',
  styleUrls: ['active-profiles.page.scss']
})
export class ActiveProfilesPage implements OnInit, OnDestroy {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  hiddenMap = true;
  modal: HTMLIonModalElement;
  opacityNotSelected: number = 0.4;
  opacitySelected: number = 1;
  icon: any = {
    url: 'assets/images/icon/help_you.png',
    scaledSize: {
      width: 64,
      height: 64
    }
  };
  profileSelected: Profile = null;
  activeProfile: Profile[] = [];
  lat: any;
  lng: any;

  map: any;

  constructor(
    public router: Router,
    private translactionServise: TranslateConfigService,
    private activeProfileSerive: ActiveProfilesService,
    private profileService: ProfileService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController
  ) {
    translactionServise.getDefaultLanguage();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter() {
    this.activeProfileSerive.getActiveProfile()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.activeProfile = x;
        // this.repositionMap();
      });
    this.repositionMap();
  }

  ionViewDidLeave() {
    this.lat = '';
    this.lng = '';
  }

  async repositionMap() {
    const loader = await this.loadingCtrl.create({
      message: '',
      spinner: 'crescent',
    });
    await loader.present(); //TODO

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
    await loader.dismiss();
  }

  async presentModal() {
    if(this.modal){
      this.modal.dismiss();
      this.modal = null;
    }
      
    this.modal = await this.modalController.create({
      component: CardProfileComponent,
      componentProps: {
        'profileSelected': this.profileSelected
      },
      cssClass: "RectangleContainer",
      swipeToClose: false,
      showBackdrop: false
    });
    return await this.modal.present();
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
    this.router.navigate(['profile']);
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('ProfileButton'));
  }

  openCardHelper(profile: Profile): void {
    this.profileSelected = profile;
    this.presentModal();
  }  

  closeCard(): void {
    this.modal.dismiss();
    this.profileSelected = null;
  }
}
