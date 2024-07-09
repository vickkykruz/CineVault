import { Component, OnInit } from '@angular/core';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { VideoTrailerComponent } from 'src/app/partials/video-trailer/video-trailer.component';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
  biographyMoviesResults: any = [];
  comedyMoviesResults: any = [];
  crimeMoviesResults: any = [];
  documentaryMoviesResults: any = [];
  dramaMoviesResults: any = [];
  familyMoviesResults: any = [];
  fantasyMoviesResults: any = [];
  filmNoirMoviesResults: any = [];
  historyMoviesResults: any = [];
  musicalMoviesResults: any = [];
  mysteryMoviesResults: any = [];
  romanceMoviesResults: any = [];
  scifiMoviesResults: any = [];
  sportMoviesResults: any = [];
  thrillerMoviesResults: any = [];
  warMoviesResults: any = [];
  westernMoviesResults: any = [];
  loading: boolean = true;
  errorStatus: number | null = null;

  sections = [
    { title: 'All Movies', results: this.trendingMoviesResults },
    { title: 'Adventure Movies', results: this.adventureMoviesResults },
    { title: 'Action Movies', results: this.actionMoviesResults },
    { title: 'Animation Movies', results: this.animationMoviesResults },
	{ title: 'Biography Movies', results: this.biographyMoviesResults },
	{ title: 'Comedy Movies', results: this.comedyMoviesResults },
	{ title: 'Crime Movies', results: this.crimeMoviesResults },
	{ title: 'Documentary Movies', results: this.documentaryMoviesResults },
	{ title: 'Drama Movies', results: this.dramaMoviesResults },
	{ title: 'Family Movies', results: this.familyMoviesResults },
	{ title: 'Fantasy Movies', results: this.fantasyMoviesResults },
	{ title: 'Film-Noir Movies', results: this.filmNoirMoviesResults },
	{ title: 'History Movies', results: this.historyMoviesResults },
	{ title: 'Musical Movies', results: this.musicalMoviesResults },
	{ title: 'Mystery Movies', results: this.mysteryMoviesResults },
	{ title: 'Romance Movies', results: this.romanceMoviesResults },
    { title: 'Sci-Fi Movies', results: this.scifiMoviesResults },
	{ title: 'Sport Movies', results: this.sportMoviesResults },
    { title: 'Thriller Movies', results: this.thrillerMoviesResults },
	{ title: 'War Movies', results: this.warMoviesResults },
	{ title: 'Western Movies', results: this.westernMoviesResults },
  ];

  selectedCategory: string = 'All Movies';
  selectedCategoryData: any = this.sections.find(section => section.title === this.selectedCategory);
  showNextNavText: boolean = false; // Flag to show Next navText
  isPrevClicked: boolean = false;

  constructor(
    private service: MovieApiServiceService,
    private title: Title,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.title.setTitle('cruztv.netlify.app || Welcome to cruztv, where we offer latest and trending movies.');
    this.loadData();
    this.logSections();
  }

  logSections() {
    console.log(this.sections);
  }

  loadData() {
    forkJoin({
      banner: this.service.bannerApiData(),
      trending: this.service.trendingMoviesApi(),
      action: this.service.getActionMovies(),
      adventure: this.service.getAdventureMovies(),
      animation: this.service.getAnimationMovies(),
      scifi: this.service.getSciFiMovies(),
      comedy: this.service.getComedyMovies(),
      documentary: this.service.getDocumentaryMovies(),
      thriller: this.service.getThrillerMovies()
    }).subscribe({
      next: (results) => {
        this.bannerApiData = results.banner.results;
        this.trendingMoviesResults = results.trending.results;
        this.actionMoviesResults = results.action.results;
        this.adventureMoviesResults = results.adventure.results;
        this.animationMoviesResults = results.animation.results;
        this.scifiMoviesResults = results.scifi.results;
        this.comedyMoviesResults = results.comedy.results;
        this.documentaryMoviesResults = results.documentary.results;
        this.thrillerMoviesResults = results.thriller.results;

        this.sections = [
			{ title: 'All Movies', results: this.trendingMoviesResults },
			{ title: 'Adventure Movies', results: this.adventureMoviesResults },
			{ title: 'Action Movies', results: this.actionMoviesResults },
			{ title: 'Animation Movies', results: this.animationMoviesResults },
			{ title: 'Biography Movies', results: this.biographyMoviesResults },
			{ title: 'Comedy Movies', results: this.comedyMoviesResults },
			{ title: 'Crime Movies', results: this.crimeMoviesResults },
			{ title: 'Documentary Movies', results: this.documentaryMoviesResults },
			{ title: 'Drama Movies', results: this.dramaMoviesResults },
			{ title: 'Family Movies', results: this.familyMoviesResults },
			{ title: 'Fantasy Movies', results: this.fantasyMoviesResults },
			{ title: 'Film-Noir Movies', results: this.filmNoirMoviesResults },
			{ title: 'History Movies', results: this.historyMoviesResults },
			{ title: 'Musical Movies', results: this.musicalMoviesResults },
			{ title: 'Mystery Movies', results: this.mysteryMoviesResults },
			{ title: 'Romance Movies', results: this.romanceMoviesResults },
			{ title: 'Sci-Fi Movies', results: this.scifiMoviesResults },
			{ title: 'Sport Movies', results: this.sportMoviesResults },
			{ title: 'Thriller Movies', results: this.thrillerMoviesResults },
			{ title: 'War Movies', results: this.warMoviesResults },
			{ title: 'Western Movies', results: this.westernMoviesResults },
		  ];

        this.selectCategory(this.selectedCategory);
        this.logSections();
        this.loading = false; // Data loading is complete
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedCategoryData = this.sections.find(section => section.title === this.selectedCategory);
  }

  handleError(error: HttpErrorResponse) {
    this.errorStatus = error.status;
    this.loading = false;
  }

  openVideo(id: number, enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(VideoTrailerComponent, {
      width: '100%',
      height: '500px',
      data: { id: id },
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 3000,
    navText: ['<', '>'],
    autoplay: true,
    autoplayTimeout: 10000,
    responsive: { 0: { items: 1 }, 400: { items: 1 }, 740: { items: 1 }, 940: { items: 1 } },
    nav: false,
  }

  tendingSlide: OwlOptions = {
    loop: true,
    center: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 1500,
    navText: ['<', '>'],
    responsive: { 0: { items: 2 }, 400: { items: 3 }, 740: { items: 4 }, 940: { items: 6 } },
    nav: true,
  }
  
  categoryOptions: OwlOptions = {
	  loop: false,
	  center: false,
	  mouseDrag: true,
	  touchDrag: true,
	  pullDrag: false,
	  dots: false,
	  navText: ['<', '>'],
	  responsive: {
		0: { items: 2, margin: 10 },
		400: { items: 3, margin: 15 },
		740: { items: 5, margin: 20 },
		940: { items: 7, margin: 25 }
	  },
	  nav: true,
	  navSpeed: 700,
	  navClass: ['owl-prev', 'owl-next'],
	};
}