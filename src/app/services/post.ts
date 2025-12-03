import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface post {

  userid: number;
  id:number ;
  tiftle: string; 

}

@Injectable({
  providedIn: 'root'
})
export class Post {

  private urlApi = "";

  constructor(private httpClient : HttpClient) {};

  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.urlApi);
  }
  
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