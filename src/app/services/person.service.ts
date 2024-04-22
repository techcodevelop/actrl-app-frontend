import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/persons';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private _http = inject(HttpClient)
  private myAppUrl: string = 'https://actrl-app-backend-production.up.railway.app/'
  private myApiUrl: string = 'api/persons'
  constructor() { }

  getPerson(person: Person): Observable<string> {

   return this._http.post<string>(`${this.myAppUrl}${this.myApiUrl}/dni`, person)
  }
}
