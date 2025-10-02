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

  constructor(private Httpclient : HttpClient) {};

  /*getPost():Observable.Post[]> {
    return this.HttpClient.getPost[]>(this.urlApi);
  }
*/
  
}
