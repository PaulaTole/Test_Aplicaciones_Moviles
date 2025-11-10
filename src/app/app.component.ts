import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { BaseDatos } from './Service/base-datos';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, HttpClientModule, HttpClientJsonpModule],
})
export class AppComponent {

  constructor(private bd: BaseDatos) {}


async ngOnInit() {
  await this.bd.crearBD();
  await this.bd.insertarUsuario('Paula', 'paula@test.com', '1234');
  const usuarios = await this.bd.obtenerUsuarios();
  console.log('Usuarios:', usuarios);
}

}
