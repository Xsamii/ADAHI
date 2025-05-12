import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MapService } from '../../map/map.service';
type FeatureCounts<T extends string = string> = Record<T, number>;

@Component({
  selector: 'app-elec-one',
  standalone: true,
  imports: [CardModule],
  templateUrl: './elec-one.component.html',
  styleUrl: './elec-one.component.scss',
})
export class ElecOneComponent implements OnInit {
  statistics: FeatureCounts;
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.featureCounts$.subscribe((data) => {
      this.statistics = data;
    });
  }
}
