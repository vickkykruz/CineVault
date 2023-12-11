import { Component } from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {
  displayedColumns: string[] = ['position', 'name',  'email', 'symbol'];
  dataSource = ELEMENT_DATA;
  toggle!: any;

  checkBoxChecker: boolean = false;
  handleCheckboxChange(checked: boolean) {
    this.checkBoxChecker = checked;
    // console.log(checked, "SideToggle");
  }
}

// Create Table Records
export interface PeriodicElement {
  name: string;
  position: number;
  email: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Victor Chukwuemeka', email: 'onwuegbuchulemvic02@gmail.com', symbol: 'May 13th 2023'},
  {position: 2, name: 'Dave Friday', email: 'davefriday@yahoo.com', symbol: 'May 13th 2023'},
  {position: 3, name: 'Ada Esther', email: 'adaester@gmail.com', symbol: 'May 13th 2023'},
  {position: 4, name: 'Debbi Chukuema', email: 'debbichukwuema@gmail.com', symbol: 'May 12th 2023'},
];
