import { TestBed } from '@angular/core/testing';
import { ValidacionesService } from './validaciones';

describe('ValidacionesService', () => {
  let service: ValidacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionesService);
  });

  // --- PRUEBA DE INICIALIZACIÓN ---
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- PRUEBAS DE CORREO ---
  it('debe retornar TRUE para un correo valido', () => {
    const correoValido = 'test@duoc.cl';
    const resultado = service.validarCorreo(correoValido);
    expect(resultado).toBeTrue(); // Esperamos que sea verdadero
  });

  it('debe retornar FALSE para un correo sin @', () => {
    const correoMalo = 'testduoc.cl';
    const resultado = service.validarCorreo(correoMalo);
    expect(resultado).toBeFalse(); // Esperamos que falle
  });

  // --- PRUEBAS DE CONTRASEÑA ---
  it('debe validar contraseñas de mas de 6 caracteres', () => {
    const pass = '123456';
    expect(service.validarContrasena(pass)).toBeTrue();
  });

  it('debe rechazar contraseñas cortas', () => {
    const pass = '123';
    expect(service.validarContrasena(pass)).toBeFalse();
  });
});