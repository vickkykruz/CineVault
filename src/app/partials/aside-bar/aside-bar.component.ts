import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchInput } from './search';

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit{

  constructor(private routes: Router) {}
  ngOnInit(): void {

  }

  inputSearch: SearchInput = {
    search: ''
  }

  submitForm() {
    console.log(this.inputSearch.search, 'SearchValue');
    this.routes.navigateByUrl(`/search/${this.inputSearch.search}`);  
    // this.sevices.getSearchMovie(this.inputSearch.search).subscribe((result) => {
    //   console.log(result, 'searchResult##');
    // })
  }
}
