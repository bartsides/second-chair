import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuryCardComponent } from './jury-card.component';

describe('JuryCardComponent', () => {
  let component: JuryCardComponent;
  let fixture: ComponentFixture<JuryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JuryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JuryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
