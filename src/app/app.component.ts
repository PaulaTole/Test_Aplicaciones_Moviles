import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseDatos } from './service/sql-lite';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
})
export class AppComponent {
  constructor(private bd: BaseDatos) {}

  async ngOnInit() {
    await this.bd.crearBD();
  }
}
