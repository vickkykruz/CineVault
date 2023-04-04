import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {

  errorStatus!: number;
  errorMessage!: string;
  loading: boolean = true;
  movieDetails:any;
  movieVideoResults: any;

  trendingMoviesResults!:any[];
  constructor(private service: MovieApiServiceService, private router: ActivatedRoute) {};
  ngOnInit(): void {
    this.trendingData();
    this.getMovieDeatils(this.id);
    console.log(this.id, 'ParamsId#');
    this.getMovieVideos(this.id);
  }

  id: any = this.router.snapshot.paramMap.get('id');

  getMovieDeatils(id:any): void {
    this.service.getMovieDetails(id).subscribe((result)=> {
      console.log(result, 'getTheMovieDetails');
      this.movieDetails = result;

    }, ((err) => {
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    }))
  }

  // Get Movie Videos
  getMovieVideos(id:any) {
    this.service.getMovieVideo(id).subscribe((result) => {
      console.log(result, 'movieVideos###');
      result.results.forEach((element:any) => {
        if(element.name == "Official Trailer") {
          this.movieVideoResults = element.key;
        }
      });
    }, ((err) => {
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    }))
  }

  // Get Movie Casts
  getMovieCast(id:any) {
    this.service.getMovieCast(id).subscribe((result) => {
      console.log(result, 'getMoieCast###');
    }, ((err) => {
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    }))
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

  tendingSlide: OwlOptions = {
    loop: true,
    center: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 800,
    autoplay: true,
    autoplayTimeout: 10000,
    items: 2,
    // margin: 10,
    responsive: {
      0: {
        items: 1,
        margin: 5
      },
      280: {
        items: 1,
        margin: 5
      },
      320: {
        items: 2,
        margin: 5
      },
      510: {
        items: 2,
        margin: 5
      },
      758: {
        items: 3,
        margin: 10
      },
      900: {
        items: 4,
        margin: 15
      }
    }
  }
}
