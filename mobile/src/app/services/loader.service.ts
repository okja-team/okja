import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingElement: HTMLIonLoadingElement;

  constructor(
    private loadingCtrl: LoadingController,

  ) {
  }


  private async setLoader(message: string = ''): Promise<any> {
    this.loadingElement = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    });
    await this.loadingCtrl.dismiss();
    return await this.loadingElement.present();
  }

  public async showLoader(message: string = ''): Promise<any>  {
    return await this.setLoader(message);
  }

  public async hideLoader() {
    return this.loadingElement.dismiss();
  }
}
