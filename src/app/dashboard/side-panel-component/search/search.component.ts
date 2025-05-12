import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardModule, AutoCompleteModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  items: any[] | undefined;

  selectedItem: any;

  suggestions: any[] | undefined;
  /**
   *
   */
  constructor(private dashboardService: DashboardService) {}

  // ngOnInit() {
  //   this.dashboardService.items.subscribe((items) => {
  //     this.items = items;
  //   });
  // }
  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }
}
