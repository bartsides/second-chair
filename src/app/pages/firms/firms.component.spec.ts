import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmsComponent } from './firms.component';

describe('FirmsComponent', () => {
  let component: FirmsComponent;
  let fixture: ComponentFixture<FirmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
