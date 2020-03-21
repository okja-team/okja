import { Component, OnInit } from '@angular/core';
import { Profile } from 'models/profile';
import { ModalController } from '@ionic/angular';
import { FilterPage } from 'modules/filter/filter.page';

@Component({
  selector: 'app-filter-profile',
  templateUrl: 'filter-profile.page.html',
  styleUrls: ['filter-profile.page.scss']
})
export class FilterProfilePage implements OnInit {

  public helpers: Profile[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.mockHelpers();
  }

  mockHelpers() {
    const profile1 = new Profile();
    profile1.name = 'Volontario 1';
    profile1.phone = '332637522';
    this.helpers.push(profile1);

    const profile2 = new Profile();
    profile2.name = 'Volontario 2';
    profile2.phone = '343456422';
    this.helpers.push(profile2);

    const profile3 = new Profile();
    profile3.name = 'Volontario 3';
    profile3.phone = '3398765234';
    this.helpers.push(profile3);
  }

  onClickPhone(phoneNumber: string) {
  }

  onClickInfo(id: string) {
  }

  filterHelpersList(filters) {
  }

  async openFilterModal() {
    const modal: HTMLIonModalElement =
       await this.modalController.create({
          component: FilterPage
    });

    modal.onDidDismiss().then((filters) => {
      this.filterHelpersList(filters);
    });

    await modal.present();
  }

}
