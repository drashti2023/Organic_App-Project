import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppComponent } from './download-app.component';

describe('DownloadAppComponent', () => {
  let component: DownloadAppComponent;
  let fixture: ComponentFixture<DownloadAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
