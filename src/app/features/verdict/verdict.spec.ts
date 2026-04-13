import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Verdict } from './verdict';

describe('Verdict', () => {
  let component: Verdict;
  let fixture: ComponentFixture<Verdict>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verdict],
    }).compileComponents();

    fixture = TestBed.createComponent(Verdict);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
