import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';
import { PreferenceService } from '../../../../shared/services/preference.service';
interface MaintenanceRequest {
  equipmentId: string;
  requestType: string;
  priority: string;
  requestedBy: string;
  assignedTo?: string;
  scheduledDate?: Date;
  description: string;
  issueCategory: string;
  urgency: string;
  estimatedDuration?: number;
  requiredParts?: string;
  specialInstructions?: string;
  contactInfo: string;
}
@Component({
  selector: 'app-maintenance-request-dialog',
  standalone: true,
  imports: [
      CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    DividerModule,
    TranslateModule
  ],
  templateUrl: './maintenance-request-dialog.component.html',
  styleUrl: './maintenance-request-dialog.component.scss'
})
export class MaintenanceRequestDialogComponent {
 @Input() visible: boolean = false;
  @Input() equipmentData: any = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() requestSubmitted = new EventEmitter<MaintenanceRequest>();

  preference = inject(PreferenceService);
  private fb = inject(FormBuilder);

  maintenanceForm: FormGroup;

  requestTypes = [
    { label: 'MAINTENANCE_REQUEST.TYPES.PREVENTIVE', value: 'preventive' },
    { label: 'MAINTENANCE_REQUEST.TYPES.CORRECTIVE', value: 'corrective' },
    { label: 'MAINTENANCE_REQUEST.TYPES.EMERGENCY', value: 'emergency' },
    { label: 'MAINTENANCE_REQUEST.TYPES.INSPECTION', value: 'inspection' }
  ];

  priorities = [
    { label: 'MAINTENANCE_REQUEST.PRIORITIES.LOW', value: 'low' },
    { label: 'MAINTENANCE_REQUEST.PRIORITIES.MEDIUM', value: 'medium' },
    { label: 'MAINTENANCE_REQUEST.PRIORITIES.HIGH', value: 'high' },
    { label: 'MAINTENANCE_REQUEST.PRIORITIES.CRITICAL', value: 'critical' }
  ];

  issueCategories = [
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.MECHANICAL', value: 'mechanical' },
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.ELECTRICAL', value: 'electrical' },
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.PLUMBING', value: 'plumbing' },
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.HVAC', value: 'hvac' },
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.SAFETY', value: 'safety' },
    { label: 'MAINTENANCE_REQUEST.CATEGORIES.OTHER', value: 'other' }
  ];

  technicians = [
    { label: 'Ahmed Al-Rashid', value: 'ahmed_rashid' },
    { label: 'Mohammed Hassan', value: 'mohammed_hassan' },
    { label: 'Fatima Al-Zahra', value: 'fatima_zahra' },
    { label: 'Omar Abdullah', value: 'omar_abdullah' }
  ];

  constructor() {
    this.initializeForm();
  }

  ngOnInit() {
    // Pre-populate form with equipment data when component initializes
    if (this.equipmentData) {
      this.populateEquipmentInfo();
    }
  }

  initializeForm() {
    this.maintenanceForm = this.fb.group({
      requestType: ['', Validators.required],
      priority: ['medium', Validators.required],
      requestedBy: ['', Validators.required],
      assignedTo: [''],
      scheduledDate: [''],
      description: ['', Validators.required],
      issueCategory: ['', Validators.required],
      urgency: ['medium'],
      estimatedDuration: [''],
      requiredParts: [''],
      specialInstructions: [''],
      contactInfo: ['', Validators.required]
    });
  }

  populateEquipmentInfo() {
    // Auto-populate some fields based on equipment data
    if (this.equipmentData) {
      // Set default issue category based on equipment discipline
      if (this.equipmentData.Discipline === 'MECHANICAL') {
        this.maintenanceForm.patchValue({ issueCategory: 'mechanical' });
      } else if (this.equipmentData.Discipline === 'ELECTRICAL') {
        this.maintenanceForm.patchValue({ issueCategory: 'electrical' });
      }
    }
  }

  onSubmit() {
    if (this.maintenanceForm.valid) {
      const formValue = this.maintenanceForm.value;

      const maintenanceRequest: MaintenanceRequest = {
        equipmentId: this.equipmentData?.OBJECTID_1 || '',
        requestType: formValue.requestType,
        priority: formValue.priority,
        requestedBy: formValue.requestedBy,
        assignedTo: formValue.assignedTo,
        scheduledDate: formValue.scheduledDate,
        description: formValue.description,
        issueCategory: formValue.issueCategory,
        urgency: formValue.urgency,
        estimatedDuration: formValue.estimatedDuration,
        requiredParts: formValue.requiredParts,
        specialInstructions: formValue.specialInstructions,
        contactInfo: formValue.contactInfo
      };

      this.requestSubmitted.emit(maintenanceRequest);
      this.onClose();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.maintenanceForm.controls).forEach(key => {
        this.maintenanceForm.get(key)?.markAsTouched();
      });
    }
  }

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.maintenanceForm.reset();
    this.initializeForm();
  }
}
