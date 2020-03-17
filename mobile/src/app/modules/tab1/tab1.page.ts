import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveProfileService } from 'src/app/active-profile.service';
import { Profile } from 'src/app/models/profile';
import { AgmMap } from '@agm/core';
declare const google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('AgmMap', { static: true }) agmMap: AgmMap;

  activeProfile: Profile[] = [];
  lat: Number;
  lng: Number;

  map: any;

  constructor(
    public router: Router,
    private activeProfileSerive: ActiveProfileService) { }

  ionViewDidEnter() {
    this.activeProfileSerive.getActiveProfile().subscribe(x => {
      console.log(x);
      this.activeProfile = x;
      // this.repositionMap();
    });
    this.repositionMap();
  }

  ionViewDidLeave() {
    this.lat = 0;
    this.lng = 0;
  }

  repositionMap() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position: Position) => {  
        if (position) {
          this.lat = position.coords.latitude;  
          this.lng = position.coords.longitude; 
        }  
      })  
    }
  //   console.log(this.agmMap);
  //   this.agmMap.mapReady.subscribe(map => {
  //     const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
  //     for (const mm of this.activeProfile) {
  //       bounds.extend(new google.maps.LatLng(mm.position.lat, mm.position.lng));
  //     }
  //     map.fitBounds(bounds);
  //   });
  }

  goToProfile() {
    this.router.navigate(['profile']);
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('Profile'));
}
}
