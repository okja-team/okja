import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilterProfilePage } from './filter-profile.page';

describe('FilterProfilePage', () => {
  let component: FilterProfilePage;
  let fixture: ComponentFixture<FilterProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterProfilePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
