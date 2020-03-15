import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationSelectionPage } from './location-selection.page';

describe('LocationSelectionPage', () => {
  let component: LocationSelectionPage;
  let fixture: ComponentFixture<LocationSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSelectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
