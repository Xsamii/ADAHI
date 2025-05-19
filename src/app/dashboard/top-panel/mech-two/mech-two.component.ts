import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PreferenceService } from '../../../shared/services/preference.service';

@Component({
  selector: 'app-mech-two',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './mech-two.component.html',
  styleUrl: './mech-two.component.scss'
})
export class MechTwoComponent {
preference = inject(PreferenceService);
}
