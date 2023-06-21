import { Component, OnInit } from '@angular/core';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { VideoTrailerComponent } from 'src/app/partials/video-trailer/video-trailer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bannerApiData: any = [];
  trendingMoviesResults: any = [];
  actionMoviesResults: any = [];
  adventureMoviesResults: any = [];
  animationMoviesResults: any = [];
  comedyMoviesResults: any = [];
  documentaryMoviesResults: any = [];
  scifiMoviesResults: any = [];
  thrillerMoviesResults: any = [];
  loading: boolean = true;
  error: Error | null = null;
  errorStatus!: number;
  errorMessage!: string;

  constructor(private service: MovieApiServiceService, private title: Title, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.title.setTitle('cruztv.netlify.app || Welcome to cruztv, where we offer latest and trending movies.');
    this.bannerData();
    this.trendingData();
    this.actionMovieData();
    this.adventureMovieData();
    this.animationMovieData();
    this.comedyMoviesData();
    this.documentaryMovieData();
    this.scfiMovieData();
    this.thrillerMovieData();
    this.imbTrendingData();
  }

  bannerData() {
    try {
      this.service.bannerApiData().subscribe((result)=> {
        // console.log(result, 'bannerResult##');
        this.bannerApiData = result.results;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error, "bannerError##");
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

  imbTrendingData() {
    try {
      this.service.imdbTrendingMoivesApi().subscribe((result) => {
        // console.log(result, 'Imdb Data');
      })
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error, 'Imdb Trending Error');
      }
    }
  }

  trendingData() {
    try {
      this.service.trendingMoviesApi().subscribe((result)=> {
        this.trendingMoviesResults = result.results;
      });
    } catch (error) {
      if (error instanceof Error) {
        // this.errorStatus = err.status;
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

  actionMovieData() {
    try {
      this.service.getActionMovies().subscribe((res) => {
        this.actionMoviesResults = res.results;
      });
    } catch (error) {
      if (error instanceof Error){
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

    adventureMovieData() {
      try {
        this.service.getAdventureMovies().subscribe((res) => {
          this.adventureMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    animationMovieData() {
      try {
        this.service.getAnimationMovies().subscribe((res) => {
          this.animationMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    comedyMoviesData() {
      try {
        this.service.getComedyMovies().subscribe((res) => {
          this.comedyMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    documentaryMovieData() {
      try {
        this.service.getDocumentaryMovies().subscribe((res) => {
          this.documentaryMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    scfiMovieData() {
      try {
        this.service.getSciFiMovies().subscribe((res) => {
          this.scifiMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    thrillerMovieData() {
      try {
        this.service.getThrillerMovies().subscribe((res) => {
          this.thrillerMoviesResults = res.results;
        });
      } catch (error) {
        if (error instanceof Error){
          this.errorMessage = error.message;
          this.loading = false;
        }
      }
    }

    customOptions: OwlOptions = {
      loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 800,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 10000,
    responsive: { 0: { items: 1 }, 400: { items: 1 }, 740: { items: 1 }, 940: { items: 1 } },
    nav: false
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
    responsive: { 0: { items: 1, margin: 5 }, 280: { items: 1, margin: 5 }, 320: { items: 2, margin: 5 }, 510: { items: 2, margin: 5 }, 758: { items: 3, margin: 10 }, 900: { items: 4, margin: 15 } }
  }

  // Watch Trailer
  openVideo(id: number, enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(VideoTrailerComponent, {
      width: '100%',
      height: '500px',
      data: { id: id },
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }

}
