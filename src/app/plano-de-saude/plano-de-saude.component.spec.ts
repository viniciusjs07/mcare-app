import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoDeSaudeComponent } from './plano-de-saude.component';

describe('PlanoDeSaudeComponent', () => {
  let component: PlanoDeSaudeComponent;
  let fixture: ComponentFixture<PlanoDeSaudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoDeSaudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoDeSaudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
