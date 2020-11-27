import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicoComponent } from './add-servico.component';

describe('AddServicoComponent', () => {
  let component: AddServicoComponent;
  let fixture: ComponentFixture<AddServicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
