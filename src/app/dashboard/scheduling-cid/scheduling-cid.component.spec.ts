import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingCidComponent } from './scheduling-cid.component';

describe('SchedulingCidComponent', () => {
  let component: SchedulingCidComponent;
  let fixture: ComponentFixture<SchedulingCidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingCidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingCidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
