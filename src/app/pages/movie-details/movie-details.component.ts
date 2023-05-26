import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { VideoTrailerComponent } from 'src/app/partials/video-trailer/video-trailer.component';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  movieCastResult!: any[];
  videoPlayer!: string;

  trendingMoviesResults!:any[];
  constructor(
    private service: MovieApiServiceService,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
    ) {};
  ngOnInit(): void {
    this.trendingData();
    this.getMovieDeatils(this.id);
    console.log(this.id, 'ParamsId#');
    this.getMovieVideos(this.id);
    this.getMovieCast(this.id);
    // this.trailerDialog();
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
          this.videoPlayer = 'https://www.youtube.com/watch?v=qEVUtrk8_B4';
        }
      });
    }, ((err) => {
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    }))
  }

  getSafeVideoUrl(): SafeResourceUrl {
    const videoUrl = `https://www.youtube.com/embed/${this.movieVideoResults}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  // Get Movie Casts
  getMovieCast(id:any) {
    this.service.getMovieCast(id).subscribe((result) => {
      console.log(result, 'getMoieCast###');
      this.movieCastResult = result.cast;
    }, ((err) => {
      // console.log(err, 'getMovieCastErr##');
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

  trailerDialog(key: any) {
    console.log(key, "Passing Dialog ##");
    this.dialog.open(
      VideoTrailerComponent,
      {
       data: { Videokey: key }
      }
    );
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
