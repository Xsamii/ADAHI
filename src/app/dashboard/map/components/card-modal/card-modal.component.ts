import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { DashboardService } from '../../../dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-modal',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.scss',
})
export class CardModalComponent implements OnInit {
  @Input({ required: true }) toggler!: Observable<boolean>;
  @Input({ required: true }) header!: string;
  display: boolean;

  /**
   *
   */
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.toggler.subscribe((v) => (this.display = v));
  }
  close(event: MouseEvent) {
    event.stopPropagation(); // Prevent click from bubbling up
    this.dashboardService.closeCards();
  }
  // @HostListener('document:click', ['$event'])
  // onClickOutside(event: MouseEvent) {
  //   console.log(event);
  //   console.log(this.displayLayerList);

  //   // Check if the click was outside the card
  //   if (
  //     !this.displayLayerList &&
  //     !this.eRef.nativeElement.contains(event.target)
  //   ) {
  //     this.dashboardService.toggleLayerList();
  //     // Close the card
  //   }
  // }
}
