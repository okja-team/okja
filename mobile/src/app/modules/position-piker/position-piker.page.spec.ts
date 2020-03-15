import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PositionPikerPage } from './position-piker.page';

describe('PositionPikerPage', () => {
  let component: PositionPikerPage;
  let fixture: ComponentFixture<PositionPikerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionPikerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionPikerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
