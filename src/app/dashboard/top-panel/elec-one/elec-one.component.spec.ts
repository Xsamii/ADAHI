import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecOneComponent } from './elec-one.component';

describe('ElecOneComponent', () => {
  let component: ElecOneComponent;
  let fixture: ComponentFixture<ElecOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElecOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElecOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
