import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PreferenceService } from '../../../../shared/services/preference.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-maintenance-details',
  standalone: true,
   imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TabViewModule,
    CardModule,
    DividerModule,
    TranslateModule
  ],
  templateUrl: './maintenance-details.component.html',
  styleUrl: './maintenance-details.component.scss'
})
export class MaintenanceDetailsComponent {
 @Input() visible: boolean = false;
  @Input() equipmentData: any = null;
  @Input() showRawData: boolean = false; // Set to true during development

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() createMaintenance = new EventEmitter<any>();

  preference = inject(PreferenceService);

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onCreateMaintenance() {
    this.createMaintenance.emit(this.equipmentData);
    // You can keep the dialog open or close it after creating maintenance
  }
}
