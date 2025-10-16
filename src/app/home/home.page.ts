import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular'; 
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IonApp, IonMenu, IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonIcon,IonLabel,IonRouterOutlet} from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule, IonApp,IonMenu,IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonIcon,IonLabel,IonRouterOutlet]
})
export class HomePage {
  users$!: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.users$ = this.http
      .get<any>('https://randomuser.me/api/?results=20')
      .pipe(map(res => res.results));
  }
}


