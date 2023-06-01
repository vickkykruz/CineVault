import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{

  searchResult:any;
  trendingMoviesResults: any;

  constructor(
    private route: ActivatedRoute,
    private service: MovieApiServiceService,
    private title: Title) {}
  SearchInput: string = this.route.snapshot.params['input'];
  ngOnInit(): void {
    this.title.setTitle('Search For' + this.SearchInput);
    this.getResult();
    this.trendingData();
  }

  errorStatus!: number;
  errorMessage!: string;
  resulterr: boolean = true;
  loading: boolean = true;

  http_issuse!: boolean;

  typeInput: any;
  // = this.route.snapshot.paramMap.get('input');

  getResult() {
    this.route.paramMap.subscribe((parms) => {
      this.typeInput = parms.get('input');
      this.service.getSearchMovie(this.typeInput).subscribe((result) => {
        console.log(result, 'SearchResult***');
        this.searchResult = result.results;

        if(this.searchResult.length === 0) {
          this.resulterr = false;
        }
      }, ((err) => {
        this.errorStatus = err.status;
        this.errorMessage= err.message;
        this.loading = false;
      }));
    });
  }

  trendingData() {
    this.service.trendingMoviesApi().subscribe((result)=> {
      console.log(result, 'trendingMovies');
      this.trendingMoviesResults = result.results;
    }, ((err) => {
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    }))
  }
}
