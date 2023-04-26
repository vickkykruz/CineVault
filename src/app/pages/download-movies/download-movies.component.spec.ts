import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMoviesComponent } from './download-movies.component';

describe('DownloadMoviesComponent', () => {
  let component: DownloadMoviesComponent;
  let fixture: ComponentFixture<DownloadMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadMoviesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
