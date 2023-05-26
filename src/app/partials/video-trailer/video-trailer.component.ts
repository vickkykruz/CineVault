import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-trailer',
  templateUrl: './video-trailer.component.html',
  styleUrls: ['./video-trailer.component.scss']
})
export class VideoTrailerComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {key: string}) {}
}
