import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovieApiServiceService } from 'src/app/service/movie-api-service.service';

@Component({
  selector: 'app-video-trailer',
  templateUrl: './video-trailer.component.html',
  styleUrls: ['./video-trailer.component.scss']
})
export class VideoTrailerComponent implements OnInit{

  @ViewChild('youtubeVideo', { static: true }) youtubeVideo!: ElementRef<HTMLIFrameElement>;
  movieVideoResults: any;
  error: Error | null = null;
  errorMessage!: string;
  loading: boolean = true;
  movieDetails:any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {id: number},
  public dialogRef: MatDialogRef<VideoTrailerComponent>,
  private service: MovieApiServiceService) {}

  id: number = this.data.id;
  ngOnInit(): void {
    this.getMovieVideos(this.id);
    this.getMovieDeatils(this.id);
  }

  getMovieDeatils(id:any): void {
    try {
      this.service.getMovieDetails(id).subscribe((result)=> {
        if (result != undefined || result != null) {
          this.movieDetails = result;
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

  getMovieVideos(id: number) {
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
}
