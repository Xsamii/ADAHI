import { Component } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { ComponentsComponent } from './components/components.component';
import { LocationComponent } from './location/location.component';
import { FilteringComponent } from './filtering/filtering.component';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [
    SearchComponent,
    ComponentsComponent,
    LocationComponent,
    FilteringComponent,
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponentComponent {}
