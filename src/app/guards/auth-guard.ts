import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BaseDatos } from '../service/sql-lite'; // Asegúrate de que el nombre del archivo sea correcto
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private db: BaseDatos, private router: Router) {}

  canActivate() {
    // 1. Escuchamos el estado de la base de datos
    return this.db.dbState().pipe(
      
      // 2. FILTRO: Esto detiene la navegación hasta que la BD diga "true" (estoy lista)
      filter(isReady => isReady === true),
      
      // 3. TAKE(1): Una vez que está lista, tomamos ese valor y dejamos de escuchar
      take(1),
      
      // 4. MAP: Ahora que la BD es segura, aplicamos tu lógica original del token
      map(() => {
        const token = localStorage.getItem('token');

        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }

        // Si hay token y la BD está lista, dejamos pasar
        return true;
      })
    );
  }
}