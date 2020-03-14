import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.page.html',
  styleUrls: ['./registrazione.page.scss'],
})
export class RegistrazionePage implements OnInit {

  public spesa = false;
  public farmacia = false;
  public compagnia = false;
  public posta = false;

  constructor(
    private readonly router: Router
  ) { }
  
  public registrati() : void {
    this.router.navigate(["/"]);
  }

  ngOnInit() {
  }

}
