import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLiteMock } from './sqlite-browser-mock';

let SQLite: any;

if (typeof window !== 'undefined' && window.navigator) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);

  if (isMobile) {
    import('@awesome-cordova-plugins/sqlite/ngx').then(module => {
      SQLite = module.SQLite;
    });
  } else {
    import('./sqlite-browser-mock').then(module => {
      SQLite = module.SQLiteMock;
    });
  }
}

@Injectable({ providedIn: 'root' })
export class BaseDatos {
  private db: SQLiteObject | null = null;
  private sqlite: any;

  constructor(private platform: Platform) {
    const isMobile = this.platform.is('cordova') || this.platform.is('capacitor');
    this.sqlite = isMobile ? new (window as any).SQLite() : new SQLiteMock();
  }

  async crearBD() {
    try {
      await this.platform.ready();

      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      this.db = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });

      await this.db?.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, correo TEXT, contrasenna TEXT)',
        []
      );
    } else {
      console.warn('SQLite no está disponible en el navegador.');
    }

      console.log("Tabla creada");
    } catch (e) {
      console.log("Ocurrió un error al crear la base de datos", e);
    }
  }
  async insertarUsuario(nombre: string, correo: string, contrasenna: string) {
  try {
    if (!this.db) {
      console.log('La base de datos no está inicializada.');
      return;
    }

    await this.db.executeSql(
      'INSERT INTO usuarios (nombre, correo, contrasenna) VALUES (?, ?, ?)',
      [nombre, correo, contrasenna]
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

  async validarUsuario(correo: string, contrasenna: string): Promise<boolean> {
  if (!this.db) {
    console.log('La base de datos no está inicializada.');
    return false;
  }

  const result = await this.db.executeSql(
    'SELECT * FROM usuarios WHERE correo = ? AND contrasenna = ?',
    [correo, contrasenna]
  );

  return result.rows.length > 0;
}

}