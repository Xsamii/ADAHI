import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PreferenceService } from '../../../shared/services/preference.service';

@Component({
  selector: 'app-elec-two',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './elec-two.component.html',
  styleUrl: './elec-two.component.scss'
})
export class ElecTwoComponent {
preference = inject(PreferenceService);
}
