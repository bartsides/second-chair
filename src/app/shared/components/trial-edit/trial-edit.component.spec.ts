import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialEditComponent } from './trial-edit.component';

describe('TrialEditComponent', () => {
  let component: TrialEditComponent;
  let fixture: ComponentFixture<TrialEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
