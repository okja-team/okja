import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage {

  public distanceFilter = 5;
  public availabilityFilter;

  constructor(private modalCtrl: ModalController, navParams: NavParams) {
    this.distanceFilter = navParams.get('distance') / 1000;
    this.availabilityFilter = navParams.get('availability');
  }

  onChangeDistance() {
    if (this.distanceFilter === 0) {
      this.distanceFilter = 1;
    } else if (this.distanceFilter > 10) {
      this.distanceFilter = 9999;
    }
  }

  onChangeAvailability() {
    console.log(this.availabilityFilter);
  }

  closeModal() {
    this.modalCtrl.dismiss({distance: this.distanceFilter * 1000, availability: this.availabilityFilter});
  }

  resetFilters() {
    this.distanceFilter = 5;
  }

}
