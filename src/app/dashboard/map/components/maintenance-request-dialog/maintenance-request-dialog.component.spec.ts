import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestDialogComponent } from './maintenance-request-dialog.component';

describe('MaintenanceRequestDialogComponent', () => {
  let component: MaintenanceRequestDialogComponent;
  let fixture: ComponentFixture<MaintenanceRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRequestDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
