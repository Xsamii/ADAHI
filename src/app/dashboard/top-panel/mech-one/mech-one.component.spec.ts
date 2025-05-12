import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechOneComponent } from './mech-one.component';

describe('MechOneComponent', () => {
  let component: MechOneComponent;
  let fixture: ComponentFixture<MechOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
