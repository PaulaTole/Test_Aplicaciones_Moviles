import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { __param } from 'tslib';

// MOCK para el navegador
class SQLiteWebMock {
  private data: any[] = [];

  async open() {
    console.log('SQLite mock abierto (web)');
  }

  async execute(statement: string) {
    console.log('Ejecutando en mock:', statement);
    return { changes: { changes: 1 } };
  }

  async run(statement: string, values?: any[]) {
    console.log('Insert (mock):', statement, values);
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
    console.log('Consulta mock:', statement, values);
    if (statement.startsWith('SELECT * FROM usuarios')) {
      return { values: this.data };
    }

    if (statement.includes('WHERE correo = ? AND contrasenna = ?')) {
      const [correo, contrasenna] = values || [];
      const result = this.data.filter(
        (u) => u.correo === correo && u.contrasenna === contrasenna
      );
      return { values: result };
    }

    return { values: [] };
  }
}

@Injectable({ providedIn: 'root' })
export class BaseDatos {
  private db: SQLiteDBConnection | SQLiteWebMock | null = null;
  private isWeb = false;

  constructor() {
    this.isWeb = Capacitor.getPlatform() === 'web';
  }

  async crearBD() {
    try {
      if (this.isWeb) {
        // Mock para el navegador
        this.db = new SQLiteWebMock();
        await this.db.open();
        console.log('Mock DB lista (web)');
      } else {
        // Usa SQLite real en Android/iOS
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db: SQLiteDBConnection = await sqlite.createConnection(
          'reproductor_db',
          false,
          'no-encryption',
          1,
          false
        );
        await db.open();

        await db.execute(
          'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, correo TEXT, contrasenna TEXT);'
        );
        this.db = db;
        console.log('Base de datos SQLite lista (nativa)');
      }
    } catch (e) {
      console.error('Error al crear la base de datos:', e);
    }
  }

  async insertarUsuario(nombre: string, correo: string, contrasenna: string) {
    if (!this.db) {
      console.warn('La base de datos no está inicializada.');
      return;
    }
    try {
      await this.db.run(
        'INSERT INTO usuarios (nombre, correo, contrasenna) VALUES (?, ?, ?)',
        [nombre, correo, contrasenna]
      );
      console.log('Usuario insertado correctamente');
    } catch (e) {
      console.error('Error al insertar usuario:', e);
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    if (!this.db) {
      console.warn('La base de datos no está inicializada.');
      return [];
    }
    try {
      const result = await this.db.query('SELECT * FROM usuarios');
      return result.values || [];
    } catch (e) {
      console.error('Error al obtener usuarios:', e);
      return [];
    }
  }

  async validarUsuario(correo: string, contrasenna: string): Promise<boolean> {
    if (!this.db) {
      console.warn('La base de datos no está inicializada.');
      return false;
    }
    try {
      const result = await this.db.query(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasenna = ?',
        [correo, contrasenna]
      );
      return (result.values?.length ?? 0) > 0;
    } catch (e) {
      console.error('Error al validar usuario:', e);
      return false;
    }
  }
}
