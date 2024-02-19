import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitEditComponent } from './exhibit-edit.component';

describe('ExhibitEditComponent', () => {
  let component: ExhibitEditComponent;
  let fixture: ComponentFixture<ExhibitEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
