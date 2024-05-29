import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JurySelectionComponent } from './jury-selection.component';

describe('JurySelectionComponent', () => {
  let component: JurySelectionComponent;
  let fixture: ComponentFixture<JurySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JurySelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JurySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
