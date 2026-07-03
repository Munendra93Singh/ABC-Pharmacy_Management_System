import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  private apiURL ='/api/Medicines';

  constructor(private http: HttpClient){}

  getmedicine(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }

   addmedicine(medicineData: any): Observable<any> {
    return this.http.post<any>(this.apiURL, medicineData);
  }
}
