import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MedicineList } from './components/medicine-list/medicine-list';
import { SideNavbar } from './components/side-navbar/side-navbar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SideNavbar,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ABC Pharmacy Dashboard');
  darkMode = false;

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
  }
}
