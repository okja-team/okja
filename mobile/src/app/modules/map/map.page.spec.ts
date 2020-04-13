import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ActiveProfilesPage } from './map.page';

describe('ActiveProfilesPage', () => {
  let component: ActiveProfilesPage;
  let fixture: ComponentFixture<ActiveProfilesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveProfilesPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveProfilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
