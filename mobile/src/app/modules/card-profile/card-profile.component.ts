import { Component, OnInit, Input } from '@angular/core';
import { Profile } from 'models/class/profile';
import { ICapability } from 'models/inteface/capability.interfae';
import { Roles } from 'models/enums/roles.enum';
import { TranslateConfigService } from '../../services/translate-config.service';

@Component({
  selector: 'app-card-profile',
  templateUrl: './card-profile.component.html',
  styleUrls: ['./card-profile.component.scss'],
})
export class CardProfileComponent implements OnInit {

  @Input() profileSelected: Profile;

  constructor(
    private translactionServise: TranslateConfigService
  ) {
    translactionServise.getDefaultLanguage();
  }

  ngOnInit() { }

  getActiveRoles(): ICapability[] {
    if (this.profileSelected.capabilities) {
      return this.profileSelected.capabilities.filter(act => act.available).slice(0,2);
    }
    return [];
  }

  getColorFromRoleType(roleType: Roles): string {
    switch (roleType) {
      case Roles.Food:
        return '#046506';
      case Roles.Pharmacy:
        return '#df8c8c';
      default:
        return '#dcdcdc';
    }
  }
}
