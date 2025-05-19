import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { PreferenceService } from '../../../shared/services/preference.service';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [CardModule, MultiSelectModule, FormsModule, CommonModule],
  templateUrl: './filtering.component.html',
  styleUrl: './filtering.component.scss',
})
export class FilteringComponent {
  preference = inject(PreferenceService);
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
