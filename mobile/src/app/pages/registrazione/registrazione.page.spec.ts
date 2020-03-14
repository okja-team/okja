import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrazionePage } from './registrazione.page';

describe('RegistrazionePage', () => {
  let component: RegistrazionePage;
  let fixture: ComponentFixture<RegistrazionePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrazionePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrazionePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
