import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular'; // 1. Importamos Platform aquí
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
  
  constructor(
    private bd: BaseDatos,
    private platform: Platform 
  ) {
    this.initApp();
  }

  initApp() {
    // 4. EL "SEGURIDAD": Esperamos a que el celular diga "Estoy listo"
    this.platform.ready().then(async () => {
      console.log('📱 Plataforma lista. Iniciando BD...');
      try {
        await this.bd.crearBD();
        console.log('✅ BD Inicializada correctamente');
      } catch (err) {
        console.error('☠️ Error crítico al iniciar BD:', err);
      }
    });
  }
}