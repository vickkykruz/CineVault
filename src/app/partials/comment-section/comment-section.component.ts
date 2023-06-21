import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent {
  expanded: boolean = false;

  // Demo Comment
  comment = [
    {
      id: 1,
      text: 'This movie is very intersting to say... I love there performance',
      replies: [
        { id: 1, text: 'You can say that again...'},
        { id: 1, text: 'You right.'},
      ]
    },
    {
      id: 2,
      text: 'This movie is very intersting to say... I love there performance',
      replies: [
        { id: 1, text: 'You can say that again...'},
        { id: 1, text: 'You right.'},
      ]
    }
  ]

  toggleReplies() {
    this.expanded = !this.expanded;
  }

}
