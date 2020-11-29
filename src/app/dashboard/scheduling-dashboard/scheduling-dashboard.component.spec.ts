import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingDashboardComponent } from './scheduling-dashboard.component';

describe('SchedulingDashboardComponent', () => {
  let component: SchedulingDashboardComponent;
  let fixture: ComponentFixture<SchedulingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
