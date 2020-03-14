import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attivazione',
  templateUrl: './attivazione.page.html',
  styleUrls: ['./attivazione.page.scss'],
})
export class AttivazionePage implements OnInit {

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit() {
  }

  public registrati(): void {
    this.router.navigate(["/registrazione"]);
  }

}
