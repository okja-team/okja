import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/class/user';
import { Aiuti } from 'src/app/models/enums/aiuti.enum';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage {

  public readonly user = new User();
  public readonly aiuti = Aiuti;

  public isDarkMode = false;
  public img: string;

  constructor(
    private readonly router: Router,
  ) {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.img = `assets/img/abbiamo-bisogno-del-tuo-aiuto${this.isDarkMode? "-dark" : ""}.png`;
   }
  
  public registrati() : void {
    this.router.navigate(['/']);
  }

}
