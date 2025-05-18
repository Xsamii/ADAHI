import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DashboardService } from '../../dashboard.service';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [CardModule, MultiSelectModule, FormsModule],
  templateUrl: './filtering.component.html',
  styleUrl: './filtering.component.scss',
})
export class FilteringComponent {
  systems!: { name: string; selected: boolean }[];

  selectedSystems!: { name: string; selected: boolean }[];
  /**
   *
   */
  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.systems = this.dashboardService.systems.value;
  }
  onSystemChange(e) {
    console.log('e', e.value);
    const selectedSystems = e.value.map((sys: any) => sys.name);

    this.systems.forEach((system) => {
      if (selectedSystems.includes(system.name)) {
        console.log('heree', system.name);
        system.selected = true; // Set selected to true if the system is in the selectedSystems array
      }
    });
    this.dashboardService.systems.next(this.systems);
  }
}
