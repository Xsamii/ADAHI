import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import { MapService } from '../map.service';
import { DashboardService } from '../../dashboard.service';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { PdfReportComponent } from '../../../shared/pdf-report/pdf-report.component';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { PreferenceService } from '../../../shared/services/preference.service';
import { MapComponent } from '../map.component';


@Component({
  selector: 'app-side-widgets',
  standalone: true,
  imports: [PdfReportComponent, CommonModule],
  templateUrl: './side-widgets.component.html',
  styleUrl: './side-widgets.component.scss',
})
export class SideWidgetsComponent {
  /**
   *
   */
  el = document.getElementById('content')
  preference = inject(PreferenceService)
  isLoading: boolean = false;
  constructor(
    private mapService: MapService,
    private dashboardService: DashboardService
  ) { }
  // @Input({ required: true }) mapView!: MapView | undefined;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  goBackExtent() {
    console.log('hereee');
    this.mapService.goBackExtent();
  }
  goForwardExtent() {
    this.mapService.goForwardExtent();
  }

  showPopup() {
    this.dashboardService.toggleInfo();
  }
  zoomIn() {
    this.mapService.zoomIn();
  }
  zoomOut() {
    this.mapService.zoomOut();
  }
  goHome() {
    this.mapService.goHome();
  }
  toggleLayerList() {
    this.dashboardService.toggleLayerList();
  }
  toggleBaseMap() {
    this.dashboardService.toggleBaseMap();
  }


   @Output() toggleLegend = new EventEmitter<void>();

  triggerLegendToggle() {
    this.toggleLegend.emit();
  }
  // WORKING JUST FINE

  mapImage;
  mapScaleFactor;
  scaledMapWidth;
  scaledMapHeight;
  printScreen() {
    this.isLoading = true;

    const mapView = this.mapService.getMapView();
    if (!mapView) {
      console.error('MapView not found');
      this.isLoading = false;
      return;
    }

    // Ensure the map has fully rendered before capturing
    mapView.when(() => {
      // Step 1: Take a screenshot of the map using MapView.takeScreenshot
      mapView.takeScreenshot({ width: mapView.width, height: mapView.height }).then((screenshot) => {
        this.mapImage = screenshot.dataUrl; // Data URL of the map image

        // Step 2: Capture the rest of the HTML content
        toPng(this.el, { quality: 0.9 })
          .then((htmlImage) => {
            const pdf = new jsPDF('l', 'mm', 'a3');
            const x = 8;
            const y = 8;
            const imageWidth = pdf.internal.pageSize.getWidth() - 20;
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // First, add the HTML content to the PDF
            let imageHeight = (this.el.offsetHeight * imageWidth) / this.el.offsetWidth;
            if (pdfHeight < imageHeight) {
              let difference = imageHeight - pdfHeight;
              pdf.internal.pageSize.height = pdfHeight + difference + 20;
            }
            pdf.addImage(htmlImage, 'JPEG', x, y, imageWidth, imageHeight);

            // Step 3: Add the captured map image to the PDF (scaled down)
            // Scale down the map image to 60% of its original size (for example)
            this.mapScaleFactor = 0.68; // Set the scaling factor here
            this.scaledMapWidth = (imageWidth * this.mapScaleFactor);
            this.scaledMapHeight = (mapView.height * this.scaledMapWidth) / mapView.width;

            // Add the map image with scaled dimensions
            pdf.addImage(
              this.mapImage, 'PNG',
              75, 75, // Adjust the positioning of the map below the HTML content
              this.scaledMapWidth - 10, this.scaledMapHeight + 10, // Use scaled width and height
              '', 'FAST'
            );

            // Save the PDF
            pdf.save('map.pdf');
            this.isLoading = false;
          })
          .catch((error) => {
            console.error('Error generating image:', error);
            this.isLoading = false;
          });
      }).catch((error) => {
        console.error('Error taking screenshot of map:', error);
        this.isLoading = false;
      });
    });
  }

  // exportToPDF() {
  //   this.isPrinting = true; // Show the PDF content temporarily

  //   setTimeout(() => {
  //     // Check if `pdfContent` is defined
  //     if (this.pdfContent) {
  //       const element = this.pdfContent.nativeElement;

  //       // Capture the element using html2canvas without scaling it
  //       html2canvas(element, { scale: 1 }).then(canvas => {
  //         const imgData = canvas.toDataURL('image/png');

  //         // Initialize jsPDF in landscape mode
  //         const pdf = new jsPDF({
  //           orientation: 'landscape',
  //           unit: 'mm',
  //           format: 'a3'
  //         });

  //         // Get the PDF page dimensions
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const pdfHeight = pdf.internal.pageSize.getHeight();

  //         // Calculate the image's width and height in mm (using canvas dimensions)
  //         const imgWidth = canvas.width * 0.264583; // Convert canvas pixels to mm
  //         const imgHeight = canvas.height * 0.264583;

  //         // Determine scaling to fit the image within the PDF if necessary
  //         let finalWidth = imgWidth;
  //         let finalHeight = imgHeight;
  //         if (imgWidth > pdfWidth || imgHeight > pdfHeight) {
  //           const widthScale = pdfWidth / imgWidth;
  //           const heightScale = pdfHeight / imgHeight;
  //           const scale = Math.min(widthScale, heightScale);
  //           finalWidth = imgWidth * scale;
  //           finalHeight = imgHeight * scale;
  //         }

  //         // Position the image on the left edge of the PDF, centered vertically
  //         const xPosition = 0; // Align to the left edge
  //         const yPosition = (pdfHeight - finalHeight) / 2; // Center vertically

  //         // Add the image to the PDF with the scaled dimensions
  //         pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);

  //         // Save the PDF
  //         pdf.save('report.pdf');
  //         this.isPrinting = false; // Hide the PDF content again
  //       }).catch((error) => {
  //         console.error('Error capturing image:', error);
  //         this.isPrinting = false;
  //       });
  //     }
  //   }, 0); // Short delay to ensure rendering
  // }
  // el2 = document.getElementById('pdfContent')

  // @ViewChild('pdfContent', { static: false, read: ElementRef }) pdfContent: ElementRef;
  // isPrinting: boolean = false;

  // exportToPDF() {
  //   this.isPrinting = true; // Show the PDF content temporarily

  //   setTimeout(() => {
  //     // Check if `pdfContent` is defined
  //     // if (this.pdfContent) {
  //       // const element = this.pdfContent.nativeElement;

  //       // Use `html-to-image` to capture the element as PNG
  //       toPng(this.el2, { quality: 1.0 }).then(imgData => {
  //         // Initialize jsPDF in landscape mode
  //         const pdf = new jsPDF({
  //           orientation: 'landscape',
  //           unit: 'mm',
  //           format: 'a3'
  //         });

  //         // Get the PDF page dimensions
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const pdfHeight = pdf.internal.pageSize.getHeight();

  //         // Since `html-to-image` uses the device's pixel ratio, use a scale factor
  //         const imgWidth = this.el2.offsetWidth * 0.264583; // Convert element's width to mm
  //         const imgHeight = this.el2.offsetHeight * 0.264583; // Convert element's height to mm

  //         // Determine scaling to fit the image within the PDF if necessary
  //         let finalWidth = imgWidth;
  //         let finalHeight = imgHeight;
  //         if (imgWidth > pdfWidth || imgHeight > pdfHeight) {
  //           const widthScale = pdfWidth / imgWidth;
  //           const heightScale = pdfHeight / imgHeight;
  //           const scale = Math.min(widthScale, heightScale);
  //           finalWidth = imgWidth * scale;
  //           finalHeight = imgHeight * scale;
  //         }

  //         // Position the image on the PDF
  //         const xPosition = (pdfWidth - finalWidth) / 2;
  //         const yPosition = (pdfHeight - finalHeight) / 2;

  //         // Add the image to the PDF with the scaled dimensions
  //         pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgWidth);

  //         // Save the PDF
  //         pdf.save('report.pdf');
  //         this.isPrinting = false; // Hide the PDF content again
  //       }).catch((error) => {
  //         console.error('Error capturing image:', error);
  //         this.isPrinting = false;
  //       });
  //     // }
  //   }, 0); // Short delay to ensure rendering
  // }




  @ViewChild(PdfReportComponent) pdfReportComponent: PdfReportComponent; // Access the pdf-report component
  @ViewChild(MapComponent) mapComponent: MapComponent; // Access the map component
  isPrinting: boolean = false;

  exportToPDF() {
    this.isPrinting = true;
    // setTimeout(() => {
    //   this.triggerLegendToggle();

    // }, 5);

    setTimeout(() => {
      // Ensure pdfReportComponent and pdfContent are available
      if (this.pdfReportComponent && this.pdfReportComponent.pdfContent) {
        const element = this.pdfReportComponent.pdfContent.nativeElement; // Access pdfContent element
        // this.mapComponent.showLegend(); // Ensure legend is visible
        const innerElement = document.getElementById('pdfContent')
        const mapView = this.mapService.getMapView();
        if (!mapView) {
          console.error('MapView not found');
          this.isLoading = false;
          return;
        } document.getElementById('legend').innerHTML=document.getElementById('legendContainer').innerHTML;

        // Ensure the map has fully rendered before capturing
        mapView.when(() => {
          // Step 1: Take a screenshot of the map using MapView.takeScreenshot
          mapView.takeScreenshot({ width: mapView.width, height: mapView.height }).then(async (screenshot) => {
            this.mapImage = screenshot.dataUrl; // Data URL of the map image
            let legImg =
            // Use `html-to-image` to capture the element as PNG

            toPng(element, { quality: 1.0,width:element.width , height:element.height }).then(imgData => {
              const pdf = new jsPDF({
                orientation: 'l',
                unit: 'mm',
                format: [innerElement.clientWidth, innerElement.clientHeight],

              },);

              // Get the PDF page dimensions
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();

              // Convert the element’s width and height to mm for the PDF
              const imgWidth = element.offsetWidth
              const imgHeight = element.offsetHeight
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
              this.mapScaleFactor = 1; // Set the scaling factor here
              this.scaledMapWidth = (pdfWidth * this.mapScaleFactor);
              this.scaledMapHeight = (mapView.height * this.scaledMapWidth) / mapView.width;

              if(this.preference.dir() === 'rtl'){
                 pdf.addImage(
                this.mapImage, 'PNG',
                13, 62, // Adjust the positioning of the map below the HTML content
                this.scaledMapWidth - 410, this.scaledMapHeight +75, // Use scaled width and height
                '', 'FAST'
              )
            }
              else{
                 pdf.addImage(
                this.mapImage, 'PNG',
                395, 62, // Adjust the positioning of the map below the HTML content
                this.scaledMapWidth - 410, this.scaledMapHeight +75, // Use scaled width and height
                '', 'FAST'
              );
              }

              // pdf.addImage(
              //   this.mapImage, 'PNG',
              //   13, 62, // Adjust the positioning of the map below the HTML content
              //   this.scaledMapWidth - 410, this.scaledMapHeight +75, // Use scaled width and height
              //   '', 'FAST'
              // );
              // Save the PDF
              pdf.save('report.pdf');
              this.isPrinting = false;
            }).catch(error => {
              console.error('Error capturing image:', error);
              this.isPrinting = false;
            });
          }).catch((error) => {
            console.error('Error taking screenshot of map:', error);
            this.isLoading = false;
          });
        });
      } else {
        console.error('pdfReportComponent or pdfContent is not available');
        this.isPrinting = false;
      }
    }, 10 ); // Delay to ensure rendering
  }



}
