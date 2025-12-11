import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicApiService {
  private http = inject(HttpClient);

  private url = 'https://jsonplaceholder.typicode.com/albums?_limit=8';

  constructor() { }

  getDatos() {
    return this.http.get<any[]>(this.url);
  }
}