import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import Statistics from '../../statistics.interface';
import { DashboardService } from '../../dashboard.service';
import { MapService } from '../../map/map.service';
type FeatureCounts<T extends string = string> = Record<T, number>;

@Component({
  selector: 'app-mech-one',
  standalone: true,
  imports: [CardModule],
  templateUrl: './mech-one.component.html',
  styleUrl: './mech-one.component.scss',
})
export class MechOneComponent implements OnInit {
  /**
   *
   */
  statistics: FeatureCounts;
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.featureCounts$.subscribe((data) => {
      this.statistics = data;
    });
  }
}
