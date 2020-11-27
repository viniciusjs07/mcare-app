import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionalDeSaudeComponent } from './profissional-de-saude.component';

describe('ProfissionalDeSaudeComponent', () => {
  let component: ProfissionalDeSaudeComponent;
  let fixture: ComponentFixture<ProfissionalDeSaudeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfissionalDeSaudeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalDeSaudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
