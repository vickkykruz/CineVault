import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { VideoTrailerComponent } from 'src/app/partials/video-trailer/video-trailer.component';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { DomSanitizer, SafeResourceUrl, Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  @ViewChild('youtubeVideo', { static: true }) youtubeVideo!: ElementRef<HTMLIFrameElement>;

  errorStatus!: number;
  errorMessage!: string;
  loading: boolean = true;
  movieDetails:any = {};
  movieVideoResults: any;
  movieCastResult!: any[];
  videoPlayer!: string;
  error: Error | null = null;

  trendingMoviesResults!:any[];
  constructor(
    private service: MovieApiServiceService,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title
    ) {};
  ngOnInit(): void {
    this.trendingData();
    this.getMovieDeatils(this.id);
    // console.log(this.id, 'ParamsId#');
    this.getMovieVideos(this.id);
    // this.getMovieCast(this.id);
    // this.trailerDialog();
  }



  id: any = this.router.snapshot.paramMap.get('id');
  currentLocation: string = encodeURI(window.location.href);
  // currentLocation: string = encodeURI('https://www.cruztv.netlify.app/movie/569094');
  message: string = encodeURIComponent('Hey I just found this movie i would like to share...');

  getMovieDeatils(id:any): void {
    try {
      this.service.getMovieDetails(id).subscribe((result)=> {
        if (result != undefined || result != null) {
          this.movieDetails = result;
          this.updateMetadata();
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error, "Details##");
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

  updateMetadata(): void {
    if (this.movieDetails.title != '' || this.movieDetails.title != null) {
      this.title.setTitle(this.movieDetails.title);
    }else {
      this.title.setTitle('Movie');
    }
      this.meta.updateTag({property: 'og:title', content: this.movieDetails.title});
      this.meta.updateTag({property: 'og:description', content: this.movieDetails.overview});
      this.meta.updateTag({property: 'og:image', itemprop: 'image', content: `https://image.tmdb.org/t/p/original${ this.movieDetails.poster_path }`});
      this.meta.updateTag({property: 'og:type', content: 'website'});
      this.meta.addTags([
        // Side For image
        {property: 'og:image:type', content: 'image/jpg'},
        {property: 'og:image:width', content: '300'},
        {property: 'og:image:height', content: '300'},
        {property: 'og:url', content: `https://www.cruztv.netlify.app/movie/${this.id}`},
        {property: 'og:site_name', content: 'CruzTv'},
        {property: 'og:locale', content: 'en_Us'}
      ]);
      this.meta.updateTag({name: 'twitter:card', content: 'summary_large_image'});
      this.meta.updateTag({name: 'twitter:title', content: this.movieDetails.title});
      this.meta.updateTag({name: 'twitter: description', content: this.movieDetails.overview});
      this.meta.updateTag({name: 'twitter:image', content: `https://image.tmdb.org/t/p/original${ this.movieDetails.poster_path }`});
  }

  //Share Post To Exertal Soical Media
  share(title: string, media: string) {
    const movietitle: string = encodeURIComponent(title);
    const altimage: string = encodeURI(`https://image.tmdb.org/t/p/original${ this.movieDetails.poster_path }`);

    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.currentLocation}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://www.twitter.com/intent/tweet?&url=${this.currentLocation}&text=${this.message}&hashtags=${movietitle},cruztv`);
        break;
      case 'whatsapp':
        window.open(`https://we.me/?text=${this.message}%20${this.currentLocation}`);
        break;
      case 'telegram':
        window.open(`https://www.t.me/share/url?url=${this.currentLocation}&text=${this.message}`);
        break;
    }

    console.log([movietitle, this.currentLocation, this.message, this.movieDetails.overview]);
  }

  // Get Movie Videos
  getMovieVideos(id:any) {
    try {
      this.service.getMovieVideo(id).subscribe((result) => {
        result.results.forEach((element:any) => {
          if(element.name == "Official Trailer") {
            this.movieVideoResults = element.key;
            this.embedVideo(this.movieVideoResults);
          }
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error, "Details##");
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

  embedVideo(videoId: string) {
    const iframe = this.youtubeVideo.nativeElement;
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
  }

  // getSafeVideoUrl(): SafeResourceUrl {
  //   try {
  //     const videoUrl = `https://www.youtube.com/embed/${this.movieVideoResults}`;
  //     return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  //   }
  //   catch (error) {
  //     console.error('An error occurred while generating the safe video URL:', error);
  //     return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/error');
  //   }
  // }

  // Get Movie Casts
  // getMovieCast(id:any) {
  //   this.service.getMovieCast(id).subscribe((result) => {
  //     // console.log(result, 'getMoieCast###');
  //     this.movieCastResult = result.cast;
  //   }, ((err) => {
  //     // console.log(err, 'getMovieCastErr##');
  //     this.errorStatus = err.status;
  //     this.errorMessage = err.message;
  //     this.loading = false;
  //   }))
  // }

  trendingData() {
    try {
      this.service.trendingMoviesApi().subscribe((result)=> {
        this.trendingMoviesResults = result.results;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.warn(error, "Details##");
        this.errorMessage = error.message;
        this.loading = false;
      }
    }
  }

  // trailerDialog(key: any) {
  //   console.log(key, "Passing Dialog ##");
  //   this.dialog.open(
  //     VideoTrailerComponent,
  //     {
  //      data: { Videokey: key }
  //     }
  //   );
  // }

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

}
