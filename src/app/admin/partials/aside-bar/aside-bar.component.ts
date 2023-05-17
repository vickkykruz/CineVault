import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit, OnChanges{

  @Input() isChecked!: boolean;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChecked']) {
      const currentChecked = changes['isChecked'].currentValue;
      const previousChecked = changes['isChecked'].previousValue;

      // console.log('isChecked changed from', previousChecked, 'to', currentChecked);
      // Perform desired actions when isChecked changes
    }
  }





}
