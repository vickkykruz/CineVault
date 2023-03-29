import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  searchResult:any;

  constructor(private route: ActivatedRoute, private service: MovieApiServiceService) {}
  ngOnInit(): void {
    this.getResult();
  }

  typeInput: string = this.route.snapshot.params['input'];
  getResult() {
    this.service.getSearchMovie(this.typeInput).subscribe((result) => {
      console.log(result, 'SearchResult***');
      this.searchResult = result.results;
    })
  }
}
