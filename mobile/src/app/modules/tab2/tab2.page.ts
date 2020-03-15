import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { RoleType } from 'src/app/models/role.enum';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  public helpers: Profile[] = [];
  public activityFilter: any[] = [];

  constructor(private callNumber: CallNumber) {}

  ngOnInit() {
    this.mockFilters();
    this.mockHelpers();
  }

  mockFilters() {
    Object.values(RoleType).forEach(v => {
      this.activityFilter.push({ type: v, active: false });
    });
  }

  mockHelpers() {
    const profile1 = new Profile();
    profile1.name = 'Aiutante 1';
    profile1.phone = '332637522';
    this.helpers.push(profile1);

    const profile2 = new Profile();
    profile2.name = 'Aiutante 2';
    profile2.phone = '343456422';
    this.helpers.push(profile2);

    const profile3 = new Profile();
    profile3.name = 'Aiutante 3';
    profile3.phone = '3398765234';
    this.helpers.push(profile3);
  }

  onClickPhone(phoneNumber: string) {
    this.callNumber.callNumber(phoneNumber, true);
  }

  onClickInfo(id: string) {
  }

}
