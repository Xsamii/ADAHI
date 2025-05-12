import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecTwoComponent } from './elec-two.component';

describe('ElecTwoComponent', () => {
  let component: ElecTwoComponent;
  let fixture: ComponentFixture<ElecTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElecTwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElecTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
