import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class BaseDatos {

  private db: SQLiteObject | null = null;

  constructor(private sqlite: SQLite, private platform: Platform) {}

  async crearBD() {
    try {
      await this.platform.ready();

      this.db = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });

      console.log("Base de datos creada");

      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, password TEXT)', []
      );

      console.log("Tabla creada");
    } catch (e) {
      console.log("Ocurrió un error al crear la base de datos", e);
    }
  }

  async insertarUsuario() {
    try {
      if (!this.db) {
        console.log('La base de datos no está inicializada.');
        return;
      }

      const nombre = 'Juan Pérez';
      const email = 'juan.perez@example.com';
      const password = '123456';

      await this.db.executeSql(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
      );

      console.log('Usuario insertado correctamente');
    } catch (e) {
      console.error('Error al insertar usuario', e);
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      if (!this.db) {
        console.log('La base de datos no está inicializada.');
        return [];
      }

      const result = await this.db.executeSql('SELECT * FROM usuarios', []);
      const usuarios = [];

      for (let i = 0; i < result.rows.length; i++) {
        usuarios.push(result.rows.item(i));
      }

      return usuarios;
    } catch (e) {
      console.error('Error al obtener usuarios', e);
      return [];
    }
  }
}