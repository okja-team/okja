import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositionPikerComponent } from './position-piker.component';

describe('PositionPikerComponent', () => {
  let component: PositionPikerComponent;
  let fixture: ComponentFixture<PositionPikerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionPikerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionPikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
