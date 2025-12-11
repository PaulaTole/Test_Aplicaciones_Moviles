import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  // Prueba 1: Validar formato de correo básico
  validarCorreo(correo: string): boolean {
    if (!correo) return false;
    return correo.includes('@') && correo.includes('.');
  }

  // Prueba 2: Validar longitud de contraseña
  validarContrasena(contrasena: string): boolean {
    if (!contrasena) return false;
    return contrasena.length >= 6;
  }
}