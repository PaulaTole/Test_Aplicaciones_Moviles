import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonToast, IonLabel, IonItem, IonInputPasswordToggle} from '@ionic/angular/standalone';
import { PostService } from '../Service/post-service';

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
  toastMessage = '';
  toastColor: 'danger' | 'success' = 'danger';
  loading = false;

  @ViewChild('correoInput', { read: ElementRef }) correoInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(private router: Router, private auth: PostService) {}

  ngAfterViewInit() {}

  login(event: Event): void {
    event.preventDefault();
    if (this.loading) return;
    if (!this.correo.trim() || !this.contrasenna.trim()) {
      this.showToast('Faltan datos', 'danger');
      this.animateError();
      return;
    }

    this.loading = true;
    this.auth.login(this.correo.trim(), this.contrasenna)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res?.success) {
            this.showToast(`Bienvenida, ${res.usuario?.nombre}`, 'success');
            if (this.correoInput && this.contrasennaInput) this.animateSuccess();
            // almacenar token/usuario según respuesta
            if (res.usuario) localStorage.setItem('usuario', JSON.stringify(res.usuario));
            if (res.token) localStorage.setItem('token', res.token);
            this.router.navigateByUrl('/home');
          } else {
            this.showToast(res?.message || 'Credenciales incorrectas', 'danger');
            this.animateError();
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('login error', err);
          this.showToast('Error de conexión con el servidor', 'danger');
          this.animateError();
        }
      });
  }

  showToast(message: string, color: 'danger' | 'success') {
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