import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuryPlacementComponent } from './jury-placement.component';

describe('JuryPlacementComponent', () => {
  let component: JuryPlacementComponent;
  let fixture: ComponentFixture<JuryPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuryPlacementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuryPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
