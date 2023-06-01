import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-download-movies',
  templateUrl: './download-movies.component.html',
  styleUrls: ['./download-movies.component.scss']
})
export class DownloadMoviesComponent implements OnInit{

  constructor(private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('Download Movie');
  }

}
