import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfissionalComponent } from './add-profissional.component';

describe('AddProfissionalComponent', () => {
  let component: AddProfissionalComponent;
  let fixture: ComponentFixture<AddProfissionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfissionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
