import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AvailabilityType } from 'models/enums/availability.enum';

@Component({
  selector: 'search-filter',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage {

  distanceFilter = 5;
  availabilityFilter = 'all_time';
  availabilityFilterList = [];

  constructor(private modalCtrl: ModalController, navParams: NavParams) {
    this.distanceFilter = navParams.get('distance') / 1000;
    this.availabilityFilter = navParams.get('availability');
    Object.keys(AvailabilityType).forEach((type) => {
      this.availabilityFilterList.push(AvailabilityType[type]);
    });
  }

  onChangeDistance() {
    if (this.distanceFilter === 0) {
      this.distanceFilter = 1;
    } else if (this.distanceFilter > 10) {
      this.distanceFilter = 9999;
    }
  }

  onChangeAvailability(type) {
    this.availabilityFilter = type;
  }

  closeModal() {
    this.modalCtrl.dismiss({distance: this.distanceFilter * 1000, availability: this.availabilityFilter});
  }

  resetFilters() {
    this.distanceFilter = 5;
    this.availabilityFilter = 'all_time';
  }

}
