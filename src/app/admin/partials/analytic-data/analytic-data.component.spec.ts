import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticDataComponent } from './analytic-data.component';

describe('AnalyticDataComponent', () => {
  let component: AnalyticDataComponent;
  let fixture: ComponentFixture<AnalyticDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
