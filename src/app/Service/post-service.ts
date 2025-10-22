import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  message?: string;
  usuario?: {
    id: number;
    nombre: string;
    correo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = '';

  constructor(private http: HttpClient) {}

  login(correo: string, contrasenna: string): Observable<LoginResponse> {
    const body = { correo, contrasenna };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponse>(this.apiUrl, body, { headers });
  }
}
