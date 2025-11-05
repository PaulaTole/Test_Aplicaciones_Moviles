import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, HttpClientModule, HttpClientJsonpModule],
})
export class AppComponent {
  constructor() {}
}
