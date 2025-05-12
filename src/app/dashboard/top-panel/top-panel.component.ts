import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MechOneComponent } from './mech-one/mech-one.component';
import { MechTwoComponent } from './mech-two/mech-two.component';
import { ElecTwoComponent } from './elec-two/elec-two.component';
import { ElecOneComponent } from './elec-one/elec-one.component';

@Component({
  selector: 'app-top-panel',
  standalone: true,
  imports: [
  MechOneComponent,
  MechTwoComponent,
  ElecTwoComponent,
  ElecOneComponent
],
  templateUrl: './top-panel.component.html',
  styleUrl: './top-panel.component.scss',
})
export class TopPanelComponent { }
