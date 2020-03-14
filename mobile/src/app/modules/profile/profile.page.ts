import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ProfileService } from 'src/app/profile.service';
import { Role } from './role';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public spesa = false;
  public farmacia = false;
  public compagnia = false;
  public posta = false;

  public rolesCollection: Role[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.profileService.refreshAndGetRoleCollectionForCurrentUser().subscribe(roles => {
      this.rolesCollection = roles;
      if (this.rolesCollection.length === 0) {
        this.rolesCollection.push(
          { id: null, type: 'pharmacy', active: false },
          { id: null, type: 'food', active: false }
        )
      }
    });
  }


  async saveProfile() {

    const loading = await this.loadingCtrl.create({
      message: "saving your profile",
      spinner: 'crescent',
    });
    loading.present();

    for (let i = 0; i < this.rolesCollection.length; i++) {
      if (this.rolesCollection[i].id) {
        this.profileService.updateRole(this.rolesCollection[i]);
      } else {
        this.profileService.addRole(this.rolesCollection[i]).then(roleDoc => {
          this.rolesCollection[i].id = roleDoc.id;
        });
      }
      loading.dismiss();
    }
  }

}


