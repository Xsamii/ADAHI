import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasemapTogglerComponent } from './basemap-toggler.component';

describe('BasemapTogglerComponent', () => {
  let component: BasemapTogglerComponent;
  let fixture: ComponentFixture<BasemapTogglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasemapTogglerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasemapTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
