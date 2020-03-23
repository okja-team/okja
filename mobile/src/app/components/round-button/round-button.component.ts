import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'round-button',
  templateUrl: './round-button.component.html',
  styleUrls: ['./round-button.component.scss'],
})
export class RoundButtonComponent implements OnInit {

  @Input() color: string;

  constructor() { }

  ngOnInit() {}

}
