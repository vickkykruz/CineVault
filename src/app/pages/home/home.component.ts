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
  constructor(private service: MovieApiServiceService) {}
  ngOnInit(): void {
    this.bannerData();
  }
  // bannerApiTitle!: string;

  bannerData() {
    this.service.bannerApiData().subscribe((result)=> {
      console.log(result, 'bannerResult#');
      this.bannerApiData = result.results;

      // if (result.results.original_name == ""){
      //   this.bannerApiTitle = result.results.title;
      // }else if (result.results.title == "") {
      //   this.bannerApiTitle = result.results.original_name;
      // }else {
      //   this.bannerApiTitle = "Error";
      // }
    })
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
}
