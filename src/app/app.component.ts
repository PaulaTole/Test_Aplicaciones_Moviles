import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BaseDatos } from './service/sql-lite';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private bd: BaseDatos) {}

    async ngOnInit() {
      await this.bd.crearBD();
}
}
