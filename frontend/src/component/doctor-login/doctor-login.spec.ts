import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorLoginComponent } from './doctor-login';

describe('DoctorLogin', () => {
  let component: DoctorLoginComponent;
  let fixture: ComponentFixture<DoctorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
