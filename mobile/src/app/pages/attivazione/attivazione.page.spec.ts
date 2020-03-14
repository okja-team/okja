import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AttivazionePage } from './attivazione.page';

describe('AttivazionePage', () => {
  let component: AttivazionePage;
  let fixture: ComponentFixture<AttivazionePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttivazionePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AttivazionePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
