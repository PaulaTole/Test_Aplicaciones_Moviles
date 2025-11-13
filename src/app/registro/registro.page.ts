import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { createAnimation } from '@ionic/core';
import { PostService } from '../Service/post-service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonToast, IonLabel} from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true, 
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonItem, IonToast, IonLabel]
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasenna: string = '';

  @ViewChild('nombreInput', { read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(
    private auth: PostService,
    private toastController: ToastController,
    private router: Router
  ) {}

  async registrar(event: Event) {
    event.preventDefault();

    const nombre = this.nombre.trim();
    const correo = this.correo.trim();
    const contrasenna = this.contrasenna.trim();

    if (!nombre || !correo || !contrasenna) {
      await this.mostrarToast('Por favor completa todos los campos', 'warning');
      this.reproducirAnimacionError();
      return;
    }

    try {
      // Intentamos enviar los datos al backend
     const response = await firstValueFrom(
        this.auth.register(this.nombre, this.correo, this.contrasenna)
      );

      console.log('Respuesta del servidor:', response);
      this.mostrarToast('Registro exitoso');
      this.animateSuccess();

      if (response && response.success) {
        await this.mostrarToast('Registro exitoso 🎉', 'success');
        this.router.navigate(['/login']);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error al registrar:', error);

      // Fallback: usuario tester local
      await this.mostrarToast(
        'No se pudo conectar al servidor. Se creó un usuario tester 🧩',
        'medium'
      );

      const tester = {
        nombre: 'Tester Local',
        correo: 'tester@local.com',
        contrasenna: '123456',
      };

      localStorage.setItem('usuario', JSON.stringify(tester));
      this.router.navigate(['/home']);
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  reproducirAnimacionError() {
    const anim = createAnimation()
      .addElement(this.nombreInput.nativeElement)
      .addElement(this.emailInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .duration(300)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)' },
        { offset: 0.25, transform: 'translateX(-8px)' },
        { offset: 0.5, transform: 'translateX(8px)' },
        { offset: 0.75, transform: 'translateX(-8px)' },
        { offset: 1, transform: 'translateX(0px)' },
      ]);

    anim.play();
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
  animateSuccess() { 
    if (!this.emailInput || !this.contrasennaInput || !this.nombreInput) 
      return; const animation = createAnimation() 
    .addElement(this.emailInput.nativeElement) 
    .addElement(this.contrasennaInput.nativeElement) 
    .addElement(this.nombreInput.nativeElement) 
    .duration(400) 
    .keyframes([ { 
      offset: 0, 
      transform: 'scale(1)', 
      background: 'transparent' },
      { offset: 0.5, 
        transform: 'scale(1.05)', 
        background: '#d4edda' }, 
      { offset: 1, transform: 'scale(1)', background: 'transparent' } ]);
    animation.play(); }
}

