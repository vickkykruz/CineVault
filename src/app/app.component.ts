import { Component, OnInit } from '@angular/core';
import { MovieApiServiceService } from './service/movie-api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Netflix_Clone';

  constructor(private service: MovieApiServiceService, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 10000);
  }
}
