import { Injectable } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class SQLiteMock {
  async create(config: any): Promise<any> {
    console.warn('SQLite no disponible en navegador. Usando mock.');
    return {
      executeSql: async (query: string, params: any[]) => {
        console.warn('Ejecutando SQL mock:', query, params);
        return {
          rows: {
            length: 0,
            item: (i: number) => ({})
          }
        };
      }
    };
  }
}