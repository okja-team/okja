import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
