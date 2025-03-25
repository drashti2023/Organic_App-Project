import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsOnSaleComponent } from './items-on-sale.component';

describe('ItemsOnSaleComponent', () => {
  let component: ItemsOnSaleComponent;
  let fixture: ComponentFixture<ItemsOnSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsOnSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsOnSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
