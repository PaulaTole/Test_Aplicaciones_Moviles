import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



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

  private apiUrl = `${environment.apiUrl}/login.php`;
  private registerUrl = `${environment.apiUrl}/registrar_usser.php`;

  constructor(private http: HttpClient) {}

  login(correo: string, contrasenna: string): Observable<any> {
    const body = { correo, contrasenna };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.http.post(`${this.apiUrl}/auth`, { correo, contrasenna }, { headers });

   
  }

  register(nombre: string, correo: string, contrasenna: string): Observable<any> {
    const body = { nombre, correo, contrasenna };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(`${this.registerUrl}/register`, body, { headers });
  }
}
