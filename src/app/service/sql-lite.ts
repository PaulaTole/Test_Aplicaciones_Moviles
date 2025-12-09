import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';

/* ------------------------------------------------------------------
   MOCK — SOLO PARA WEB 
-------------------------------------------------------------------*/
class SQLiteWebMock {
  private data: any[] = [];

  async open() {
    console.log('🔵 SQLite MOCK abierto');
  }

  async run(statement: string, values?: any[]) {
    console.log('🔵 MOCK RUN:', statement, values);
    if (statement.startsWith('INSERT')) {
       // Mock insert
    }
    return { changes: { changes: 1 } };
  }

  async query(statement: string, values?: any[]) {
    // Simulación para el Login
    if (statement.includes('SELECT') && statement.includes('usuarios')) {
      const [correo, contrasenna] = values || [];
      // Usuario quemado para pruebas web
      if (correo === 'tester@test.com' && contrasenna === '12345678') {
          return { values: [{ id: 1, nombre: 'Tester', correo: correo }] };
      }
      if (!values || values.length === 0) {
          return { values: [{ id: 1, nombre: 'Tester', correo: 'tester@test.com' }] };
      }
    }
    return { values: [] };
  }
}

/* ------------------------------------------------------------------
   SERVICIO PRINCIPAL BLINDADO 🛡️
-------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
export class BaseDatos {
  private db: SQLiteDBConnection | SQLiteWebMock | null = null;
  private readonly isWeb = Capacitor.getPlatform() === 'web';

  // Semáforo de estado
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  dbState() {
    return this.dbReady.asObservable();
  }

  // --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
  async crearBD() {
    try {
      // 1. WEB: Retorno rápido
      if (this.isWeb) {
        this.db = new SQLiteWebMock();
        await this.db.open();
        console.log('🔵 Base de datos MOCK lista (web)');
        this.dbReady.next(true);
        return;
      }

    // 2. ANDROID: Lógica inteligente
      const sqlite = new SQLiteConnection(CapacitorSQLite);
    
      const isConn = (await sqlite.isConnection('reproductor_db', false)).result;
      
      let db: SQLiteDBConnection;

      if (isConn) {
        // B) Si existe, la RECUPERAMOS
        console.log('⚠️ La conexión ya existía, recuperándola...');
        db = await sqlite.retrieveConnection('reproductor_db', false);
      } else {
        // C) Si no existe, la CREAMOS
        db = await sqlite.createConnection(
          'reproductor_db',
          false,
          'no-encryption',
          1,
          false
        );
      }

      this.db = db;

      // 3. Abrimos la conexión
      await db.open();

      // 4. Creamos tablas (IF NOT EXISTS es vital)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          correo TEXT,
          contrasenna TEXT
        );
      `);

      // 5. Insertamos datos semilla
      await db.execute(`
        INSERT OR IGNORE INTO usuarios (nombre, correo, contrasenna)
        VALUES ('Tester', 'tester@test.com', '12345678');
      `);


      this.dbReady.next(true);
      console.log('🟢 Base de datos SQLite lista y estable (android)');

    } catch (e) {
      // 6. RED DE SEGURIDAD: Si falla por "already exists", lo ignoramos
      const msg = JSON.stringify(e);
      if (msg.includes('already exists')) {
         console.log('⚠️ Error controlado: Conexión existente detectada en catch.');
         this.dbReady.next(true); // Asumimos que está lista
      } else {
         console.error('❌ Error CRÍTICO al crear base de datos:', e);
      }
    }
  }
  async validarUsuario(correo: string, contrasenna: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasenna = ?',
        [correo, contrasenna]
      );
      return (result.values?.length ?? 0) > 0;
    } catch (e) {
      return false;
    }
  }

  async insertarUsuario(nombre: string, correo: string, contrasenna: string) {
    if (!this.db) return false;
    try {
      await this.db.run(
        'INSERT INTO usuarios (nombre, correo, contrasenna) VALUES (?, ?, ?)',
        [nombre, correo, contrasenna]
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.query('SELECT * FROM usuarios');
      return result.values ?? [];
    } catch (e) {
      return [];
    }
  }

  async getUsuarioPorId(id: number): Promise<any | null> {
    if (!this.db) return null;
    try {
      const result = await this.db.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
      );
      return result.values?.length ? result.values[0] : null;
    } catch (e) {
      return null;
    }
  }

  async actualizarUsuario(id: number, nombre: string, correo: string, contrasenna: string) {
    if (!this.db) return false;
    try {
      await this.db.run(
        'UPDATE usuarios SET nombre = ?, correo = ?, contrasenna = ? WHERE id = ?',
        [nombre, correo, contrasenna, id]
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async guardarUsuario(usuario: any) {
    if (!usuario.id) {
      return await this.insertarUsuario(usuario.nombre, usuario.correo, usuario.contrasenna);
    }
    return await this.actualizarUsuario(usuario.id, usuario.nombre, usuario.correo, usuario.contrasenna);
  }
}