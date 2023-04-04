import { Component, OnInit } from '@angular/core';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bannerApiData: any = [];
  trendingMoviesResults: any = [];
  loading: boolean = true;
  errorStatus!: number;
  errorMessage!: string;

  constructor(private service: MovieApiServiceService) {}
  ngOnInit(): void {
    this.bannerData();
    this.trendingData();
  }

  bannerData() {
    this.service.bannerApiData().subscribe((result)=> {
      console.log(result, 'bannerResult#');
      this.bannerApiData = result.results;
    }, (err) => {
      console.error(err, 'errors#')
      this.errorStatus = err.status;
      this.errorMessage = err.message;
      this.loading = false;
    })
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
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
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
