import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCapsule } from './time-capsule';

describe('TimeCapsule', () => {
  let component: TimeCapsule;
  let fixture: ComponentFixture<TimeCapsule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeCapsule],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeCapsule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
