import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private readonly router: Router) {}

  async onMainClick() {
    await this.router.navigate(['home/tabs/map']);
  }

}
