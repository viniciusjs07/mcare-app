import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgendamentoComponent } from './add-agendamento.component';

describe('AddAgendamentoComponent', () => {
  let component: AddAgendamentoComponent;
  let fixture: ComponentFixture<AddAgendamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgendamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
