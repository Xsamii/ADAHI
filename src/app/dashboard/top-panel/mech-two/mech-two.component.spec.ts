import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechTwoComponent } from './mech-two.component';

describe('MechTwoComponent', () => {
  let component: MechTwoComponent;
  let fixture: ComponentFixture<MechTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
