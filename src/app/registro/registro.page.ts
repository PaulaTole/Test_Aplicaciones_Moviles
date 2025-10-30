import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonToast, IonLabel} from '@ionic/angular/standalone';

import { PostService } from '../Service/post-service';


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

  constructor(private router: Router, private auth: PostService) {}

  ngAfterViewInit() {
  }

  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2500);
  }

  registrar(event: Event) {
    event.preventDefault();
    if (this.loading) return;
    // Validaciones
    if (!this.nombre.trim() || !this.correo.trim() || !this.contrasenna) {
      this.presentToast('Todos los campos son obligatorios', 'danger');
      this.animateError();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      this.presentToast('El correo no es válido', 'danger');
      this.animateError();
      return;
    }
    if (this.contrasenna.length < 8) {
      this.presentToast('La contraseña debe tener al menos 8 caracteres', 'danger');
      this.animateError();
      return;
    }

    this.loading = true;
    this.auth.register(this.nombre.trim(), this.correo.trim(), this.contrasenna)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.success) {
            this.presentToast('Usuario registrado correctamente', 'success');
            // animación de éxito solo si existe la referencia
            if (this.emailInput && this.contrasennaInput && this.nombreInput) this.animateSuccess();
            setTimeout(() => this.router.navigateByUrl('/login'), 1000);
          } else {
            this.presentToast(res?.message || 'Error al registrar', 'danger');
            this.animateError();
          }
        },
        error: (err:any) => {
          this.loading = false;
          console.error('registro error', err);
          this.presentToast('Error al conectar con el servidor', 'danger');
          this.animateError();
        }
      });
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

  animateError() {
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
  }
}