import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createAnimation, ToastController  } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonToast, IonLabel} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';

import { PostService } from '../Service/post-service';
import { BaseDatos } from '../Service/base-datos';
import { __await } from 'tslib';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonItem, IonToast, IonLabel]
})
export class RegistroPage implements AfterViewInit {
  nombre = '';
  correo = '';
  contrasenna = '';

  @ViewChild('nombreInput', { read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';
  loading = false;

  constructor(private router: Router, private auth: PostService, private db: BaseDatos,private toastController: ToastController) {};
  

  ngAfterViewInit() {
  }

  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2500);
  }
  async registrar(event: Event) {
      event.preventDefault();
      const res = await firstValueFrom(this.auth.register(this.nombre, this.correo, this.contrasenna));
      if (this.loading) return;

      // Validaciones
      if (!this.nombre.trim() || !this.correo.trim() || !this.contrasenna) {
       await this.animateError(this.nombreInput||this.emailInput||this.contrasennaInput, 'Todos los campos son obligatorios');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.correo)) {
        await this.animateError(this.emailInput, 'El correo es obligatorio');
        return;
      }

      if (this.contrasenna.length < 8) {
        await this.animateError(this.contrasennaInput, 'La contraseña debe tener 8 caracteres');
        return;
      }

      this.loading = true;

try {
      // Verificar campos vacíos
      if (!this.nombre || !this.correo || !this.contrasenna) {
        await this.mostrarToast('Completa todos los campos');
        return;
      }

      // Intentar registrar normalmente en la BD
      const registrado = await this.db.insertarUsuario(
        this.nombre,
        this.correo,
        this.contrasenna
      );

      if (registrado) {
        await this.mostrarToast('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      } else {
        throw new Error('Fallo al registrar en BD');
      }
    } catch (error) {
      console.warn('Fallo al registrar, usando modo tester:', error);

      // Crear usuario tester si BD no disponible
      if (this.correo === 'tester@test.com' && this.contrasenna === '12345678') {
        localStorage.setItem('modoTester', 'true');
        await this.mostrarToast('Modo tester activado');
        this.router.navigate(['/home']);
      } else {
        await this.mostrarToast(
          'No se pudo registrar. Usa tester@test.com / 12345678 para modo local.'
        );
      }
    }

  this.loading = false;
  setTimeout(() => this.router.navigateByUrl('/login'), 1000);
  }
  

  animateSuccess() {
    if (!this.emailInput || !this.contrasennaInput || !this.nombreInput) return;
    const animation = createAnimation()
      .addElement(this.emailInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .addElement(this.nombreInput.nativeElement)
      .duration(400)
      .keyframes([
        { offset: 0, transform: 'scale(1)', background: 'transparent' },
        { offset: 0.5, transform: 'scale(1.05)', background: '#d4edda' },
        { offset: 1, transform: 'scale(1)', background: 'transparent' }
      ]);
    animation.play();
  }

/*  animateError() {
    if (!this.emailInput || !this.contrasennaInput) return;
    const animation = createAnimation()
      .addElement(this.emailInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .duration(100)
      .iterations(3)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)' },
        { offset: 0.25, transform: 'translateX(-10px)' },
        { offset: 0.5, transform: 'translateX(10px)' },
        { offset: 0.75, transform: 'translateX(-10px)' },
        { offset: 1, transform: 'translateX(0px)' }
      ]);
    animation.play();
  }*/

  async animateError(element: ElementRef, mensaje: string) {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 2000,
    color: 'danger',
    position: 'bottom',
  });
  await toast.present();

  const animation = createAnimation()
    .addElement(element.nativeElement)
    .duration(100)
    .iterations(3)
    .keyframes([
      { offset: 0, transform: 'translateX(0px)' },
      { offset: 0.25, transform: 'translateX(-8px)' },
      { offset: 0.5, transform: 'translateX(8px)' },
      { offset: 0.75, transform: 'translateX(-8px)' },
      { offset: 1, transform: 'translateX(0px)' },
    ]);

  animation.play();
  }


  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  irALogin() {
  this.router.navigate(['/login']);
}
}