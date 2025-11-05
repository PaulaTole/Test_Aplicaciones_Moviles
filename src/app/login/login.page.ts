import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonToast, IonLabel, IonItem, IonInputPasswordToggle} from '@ionic/angular/standalone';
import { PostService } from '../Service/post-service';
import { firstValueFrom } from 'rxjs';
import { BaseDatos } from '../Service/base-datos';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonToast, IonLabel, IonItem, IonInputPasswordToggle ]
})
export class LoginPage implements AfterViewInit {
  correo = '';
  contrasenna = '';
  isToastOpen = false;
  showToast = false;
  toastMessage = '';
  toastColor: 'danger' | 'success' = 'danger';
  loading = false;

  @ViewChild('correoInput', { read: ElementRef }) correoInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(private router: Router, private auth: PostService, private db: BaseDatos) {}

  ngAfterViewInit() {}
    
  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2500);
  }

  async login(event: Event) {
  this.loading = true;
  event.preventDefault();

  try {
    const res = await firstValueFrom(this.auth.login(this.correo.trim(), this.contrasenna.trim()));

    if (res?.success) {
      this.presentToast('Inicio de sesión exitoso (servidor)', 'success');
      this.router.navigateByUrl('/home');
    } else {
      this.presentToast(res?.message || 'Credenciales inválidas', 'danger');
    }

  } catch (error) {
    console.warn('Servidor no disponible, intentando login local...');
    const valido = await this.db.validarUsuario(this.correo.trim(), this.contrasenna.trim());

    if (valido) {
      this.openToast('Inicio de sesión local exitoso', 'success');
      this.router.navigateByUrl('/home');
    } else {
      this.openToast('Credenciales inválidas (local)', 'danger');
    }
  }

  this.loading = false;
}


  openToast(message: string, color: 'danger' | 'success') {
  this.toastMessage = message;
  this.toastColor = color;
  this.isToastOpen = true;
  setTimeout(() => this.isToastOpen = false, 2500);
}


  animateSuccess() {
    if (!this.correoInput || !this.contrasennaInput) return;
    const animation = createAnimation()
      .addElement(this.correoInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .duration(400)
      .keyframes([
        { offset: 0, transform: 'scale(1)', background: 'transparent' },
        { offset: 0.5, transform: 'scale(1.05)', background: '#d4edda' },
        { offset: 1, transform: 'scale(1)', background: 'transparent' }
      ]);
    animation.play();
  }

  animateError() {
    if (!this.correoInput || !this.contrasennaInput) return;
    const animation = createAnimation()
      .addElement(this.correoInput.nativeElement)
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

  goToRegistro() { this.router.navigateByUrl('/registro'); }
}