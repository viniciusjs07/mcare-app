import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsByCompanyComponent } from './patients-by-company.component';

describe('PatientsByCompanyComponent', () => {
  let component: PatientsByCompanyComponent;
  let fixture: ComponentFixture<PatientsByCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsByCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsByCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
