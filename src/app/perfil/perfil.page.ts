import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit {
  usuario: any = { id: null, nombre: '', correo: '', contrasenna: ''};

  constructor(private bd: BaseDatos, private router: Router) {}

  async ngOnInit() {
    await this.bd.crearBD();
    const usuarios = await this.bd.obtenerUsuarios();
    if (usuarios.length) this.usuario = usuarios[0];
  }

  async guardar() {
    const ok = await this.bd.guardarUsuario(this.usuario);
    if (ok) {
      // puedes mostrar toast aquí; por simplicidad navegamos al home
      this.router.navigate(['/home']);
    } else {
      // manejar error
      console.error('No se pudo guardar usuario');
    }
  }
}
