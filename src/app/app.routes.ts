import { Routes } from '@angular/router';
import { AddMedicine } from './components/add-medicine/add-medicine';
import { MedicineList } from './components/medicine-list/medicine-list';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registration } from './components/registration/registration';
import { authGuard } from './Services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Registration },
  { path: 'medicines', component: MedicineList, canActivate: [authGuard] },
  { path: 'add-medicine', component: AddMedicine, canActivate: [authGuard] },
];
