import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssurancesComponent } from './assurances.component';

describe('AssurancesComponent', () => {
  let component: AssurancesComponent;
  let fixture: ComponentFixture<AssurancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssurancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
