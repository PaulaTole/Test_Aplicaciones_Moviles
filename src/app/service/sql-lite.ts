import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

/* ------------------------------------------------------------------
   MOCK — SOLO PARA WEB (Laptop, navegador, Chrome)
-------------------------------------------------------------------*/
class SQLiteWebMock {
  private data: any[] = [];

  async open() {
    console.log('🔵 SQLite MOCK abierto');
  }

  async run(statement: string, values?: any[]) {
    console.log('🔵 MOCK RUN:', statement, values);

    if (statement.startsWith('INSERT')) {
      const usuario = {
        id: this.data.length + 1,
        nombre: values?.[0],
        correo: values?.[1],
        contrasenna: values?.[2],
      };
      this.data.push(usuario);
    }

    return { changes: { changes: 1 } };
  }

  async query(statement: string, values?: any[]) {
    console.log('🔵 MOCK QUERY:', statement, values);

    if (statement.includes('WHERE correo = ? AND contrasenna = ?')) {
      const [correo, contrasenna] = values || [];
      return {
        values: this.data.filter(
          (u) => u.correo === correo && u.contrasenna === contrasenna
        ),
      };
    }

    if (statement.startsWith('SELECT * FROM usuarios')) {
      return { values: this.data };
    }

    return { values: [] };
  }
}

/* ------------------------------------------------------------------
   SERVICIO PRINCIPAL — USO REAL EN ANDROID Y MOCK EN WEB
-------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
export class BaseDatos {
  private db: SQLiteDBConnection | SQLiteWebMock | null = null;
  private readonly isWeb = Capacitor.getPlatform() === 'web';

  constructor() {}

  /* Inicialización */
  async crearBD() {
    try {
      if (this.isWeb) {
        // --- WEB → usar MOCK ---
        this.db = new SQLiteWebMock();
        await this.db.open();

        // Usuario pre cargado
        await this.db.run(
          'INSERT INTO usuarios (nombre, correo, contrasenna) VALUES (?, ?, ?)',
          ['Tester', 'tester@test.com', '12345678']
        );

        console.log('🔵 Base de datos MOCK lista (web)');
        return;
      }

      // --- ANDROID → usar SQLite real ---
      const sqlite = new SQLiteConnection(CapacitorSQLite);

      const db: SQLiteDBConnection = await sqlite.createConnection(
        'reproductor_db',
        false,
        'no-encryption',
        1,
        false
      );

      await db.open();

      await db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          correo TEXT,
          contrasenna TEXT
        );
      `);

      await db.execute(`
        INSERT OR IGNORE INTO usuarios (nombre, correo, contrasenna)
        VALUES ('Tester', 'tester@test.com', '12345678');
      `);

      this.db = db;
      console.log('🟢 Base de datos SQLite lista (android)');
    } catch (e) {
      console.error('❌ Error al crear base de datos:', e);
    }
  }

  /* Insertar usuario */
  async insertarUsuario(nombre: string, correo: string, contrasenna: string) {
    if (!this.db) return false;

    try {
      await this.db.run(
        'INSERT INTO usuarios (nombre, correo, contrasenna) VALUES (?, ?, ?)',
        [nombre, correo, contrasenna]
      );

      return true;
    } catch (e) {
      console.error('❌ Error al insertar usuario:', e);
      return false;
    }
  }

  /* Obtener todos */
  async obtenerUsuarios(): Promise<any[]> {
    if (!this.db) return [];

    try {
      const result = await this.db.query('SELECT * FROM usuarios');
      return result.values ?? [];
    } catch (e) {
      console.error('❌ Error al obtener usuarios:', e);
      return [];
    }
  }

  /* Login */
  async validarUsuario(correo: string, contrasenna: string): Promise<boolean> {
    if (!this.db) {
      console.warn('⚠ BD no lista, usando fallback');
      return correo === 'tester@test.com' && contrasenna === '12345678';
    }

    try {
      const result = await this.db.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasenna = ?',
        [correo, contrasenna]
      );

      return (result.values?.length ?? 0) > 0;
    } catch (e) {
      console.error('❌ Error en login:', e);
      return false;
    }
  }
}
