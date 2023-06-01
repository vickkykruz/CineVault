import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AnalyticDataComponent } from '../../partials/analytic-data/analytic-data.component';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name',  'symbol'];
  dataSource = ELEMENT_DATA;
  toggle!: any;

  checkBoxChecker: boolean = false;

  handleCheckboxChange(checked: boolean) {
    this.checkBoxChecker = checked;
    // console.log(checked, "SideToggle");
  }

  constructor(private dialog: MatDialog, private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Cruz Tv || Adminstration Home');
  }



  // if (isChecked == true){
  //
  // }else {
  //
  // }


  openDialog() {
    const dialogRef = this.dialog.open(AnalyticDataComponent);
  }

}
export interface PeriodicElement {
  name: string;
  position: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Spider Man No Way Home', symbol: 'May 13th 2023'},
  {position: 2, name: 'Sonic The Heihug The Return', symbol: 'May 13th 2023'},
  {position: 3, name: 'Black Partenr Forever', symbol: 'May 13th 2023'},
  {position: 4, name: 'God Of War No Return', symbol: 'May 12th 2023'},
];

