import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapService } from '../../dashboard/map/map.service';

@Component({
  selector: 'app-pdf-report',
  standalone: true,
  imports: [],
  templateUrl: './pdf-report.component.html',
  styleUrl: './pdf-report.component.scss'
})
export class PdfReportComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef;

}
