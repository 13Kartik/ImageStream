import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }
  currentPage: number = 1;

  storeCurrentPage(page: number) {
    // localStorage.setItem('currentPage', page.toString());
    this.currentPage = page
  }
}
