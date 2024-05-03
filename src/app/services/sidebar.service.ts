import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  private drawer!: MatDrawer;

  public setDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }

  public toggle(): void {
    this.drawer.toggle();
  }
}
