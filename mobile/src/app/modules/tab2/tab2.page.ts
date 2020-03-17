import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { RoleType } from 'src/app/models/role.enum';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

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
