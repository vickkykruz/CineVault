import { Component, OnInit } from '@angular/core';
import { MovieApiServiceService } from './service/movie-api-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Netflix_Clone';

  constructor(private service: MovieApiServiceService) {}

  ngOnInit(): void {
    
  }
}
