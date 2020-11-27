import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as jspdf from 'jspdf';
import * as html2canvas from "html2canvas"
import { PrecricaoService } from '../precricao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prescricao',
  templateUrl: './prescricao.component.html',
  styleUrls: ['./prescricao.component.scss']
})
export class PrescricaoComponent implements OnInit {

  public patient: string;
  public professional: string;
  public text: string;

  @ViewChild('pdfContent') content: ElementRef;
  constructor(public prescService: PrecricaoService,
              public router: Router) { }

  ngOnInit() {
    this.loadInformations();
  }

  public captureScreen(){  
    var data = document.getElementById('pdfContent');  
    html2canvas(data, 
      {
        scale: 2
      }).then(canvas => {    
      var imgWidth = 210;   
      var pageHeight = 297;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('prescricao-' + this.patient + '.pdf'); // Generated PDF   
    });  
  }
  
  loadInformations() {
    if (this.prescService.patient && this.prescService.professional && this.prescService.text) {
      this.patient = this.prescService.patient;
      this.professional = this.prescService.professional;
      this.text = this.prescService.text;
    } else {
      this.router.navigate(['/agendamentos']);
    }
  }

}
