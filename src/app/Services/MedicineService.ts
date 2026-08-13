import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  private apiURL = '/api/Medicines';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwtToken'); // use the same key where you store the token
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getmedicine(): Observable<any> {
    return this.http.get<any>(this.apiURL, this.getAuthHeaders());
  }

  addmedicine(medicineData: any): Observable<any> {
    return this.http.post<any>(this.apiURL, medicineData, this.getAuthHeaders());
  }
}