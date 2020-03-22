import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  public pharmacyFilter = true;
  public foodFilter = true;
  public distanceFilter = '5';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async clodeModal() {
    const result: Date = new Date();
    await this.modalCtrl.dismiss(result);
  }

}
