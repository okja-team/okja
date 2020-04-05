import { Component, OnInit, Input } from '@angular/core';
import { Profile } from 'models/class/profile';
import { ICapability } from 'models/inteface/capability.interfae';
import { Roles } from 'models/enums/roles.enum';
import { TranslateConfigService } from 'services/translate-config.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {

  @Input() profile: Profile;
  @Input() computeRoundDistance: Function;


  constructor(
    private translactionServise: TranslateConfigService
  ) {
    translactionServise.getDefaultLanguage();
  }

  ngOnInit() { }

  getActiveRoles(): ICapability[] {
    if (this.profile.capabilities) {
      return this.profile.capabilities.filter(act => act.available).slice(0,2);
    }
    return [];
  }

  getColorFromRoleType(roleType: Roles): string {
    switch (roleType) {
      case Roles.Food:
        return '#3fc05e';
      case Roles.Pharmacy:
        return '#df8c8c';
      default:
        return '#dcdcdc';
    }
  }

  computeRoundDistanceFunction(position) {
    return this.computeRoundDistance(position);
  }

}
