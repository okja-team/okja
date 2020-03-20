import { Component, OnInit } from '@angular/core';
import { Profile } from 'models/profile';

@Component({
  selector: 'app-filter-profile',
  templateUrl: 'filter-profile.page.html',
  styleUrls: ['filter-profile.page.scss']
})
export class FilterProfilePage implements OnInit {

  public helpers: Profile[] = [];
  public pharmacyFilter = true;
  public foodFilter = true;
  public distanceFilter = '5';

  constructor() {}

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

    this.filterHelpersList();
  }

  onClickPhone(phoneNumber: string) {
  }

  onClickInfo(id: string) {
  }

  onDistanceChange() {
    console.log(this.distanceFilter);
    this.filterHelpersList();
  }

  onFoodChange() {
    this.foodFilter ? this.foodFilter = false : this.foodFilter = true;
    this.filterHelpersList();
  }
  onPharmacyChange() {
    this.pharmacyFilter ? this.pharmacyFilter = false : this.pharmacyFilter = true;
    this.filterHelpersList();
  }

  filterHelpersList() {
  }

}
