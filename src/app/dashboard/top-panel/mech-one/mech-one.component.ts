import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import Statistics from '../../statistics.interface';
import { MapService } from '../../map/map.service';
import { CommonModule } from '@angular/common';
import { PreferenceService } from '../../../shared/services/preference.service';
type FeatureCounts<T extends string = string> = Record<T, number>;

@Component({
  selector: 'app-mech-one',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './mech-one.component.html',
  styleUrl: './mech-one.component.scss',
})
export class MechOneComponent implements OnInit {
  /**
   *
   */
  statistics: FeatureCounts;
  preference = inject(PreferenceService);
  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.featureCounts$.subscribe((data) => {
      this.statistics = data;
    });
  }
}
