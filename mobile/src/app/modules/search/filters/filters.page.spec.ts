import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltersPage } from './filters.page';

describe('FilterPage', () => {
  let component: FiltersPage;
  let fixture: ComponentFixture<FiltersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
