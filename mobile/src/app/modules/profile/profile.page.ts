import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public spesa = false;
  public farmacia = false;
  public compagnia = false;
  public posta = false;

  constructor() { }

  ngOnInit() {
  }

}
