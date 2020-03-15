import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attivazione',
  templateUrl: './attivazione.page.html',
  styleUrls: ['./attivazione.page.scss'],
})
export class AttivazionePage implements OnInit {

  public isDarkMode = false;

  constructor(
    private readonly router: Router
  ) {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
   }

  ngOnInit() {
  }

  public registrati(): void {
    this.router.navigate(["/registrazione"]);
  }

}
