import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrecricaoService {

  professional: string;
  patient: string;
  text: string;

  constructor() { }

  public setPrescriptAttributes(professional: string, patient: string, text: string) {
    this.patient = patient;
    this.professional = professional;
    this.text = text;
  }
}
