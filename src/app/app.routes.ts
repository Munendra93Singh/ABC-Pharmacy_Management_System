import { Routes } from '@angular/router';
import { AddMedicine } from './components/add-medicine/add-medicine';
import { MedicineList } from './components/medicine-list/medicine-list';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'medicines', component: MedicineList },
  { path: 'add-medicine', component: AddMedicine },
];
