import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';

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
  cities!: City[];

  selectedCities!: City[];

  ngOnInit() {
    this.cities = [
      { name: 'Freezing', code: 'NY' },
      { name: 'Lighting', code: 'RM' },
      { name: 'Water Supply', code: 'LDN' },
      // { name: 'Istanbul', code: 'IST' },
      // { name: 'Paris', code: 'PRS' },
    ];
  }
}
