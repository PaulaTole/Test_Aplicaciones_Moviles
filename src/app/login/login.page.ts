import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonInputPasswordToggle, IonItem, IonToast } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonInputPasswordToggle, IonItem, IonToast, HttpClientModule]
})
export class LoginPage {
  correo = '';
  contrasenna = '';
  isToastOpen = false;
  toastMessage = '';
  toastColor: 'danger' | 'success' = 'danger';

  @ViewChild('correoInput',     { read: ElementRef }) correoInput!: ElementRef;
  @ViewChild('contrasennaInput',{ read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(private router: Router, private http: HttpClient) {}

  login(event: Event): void {
  event.preventDefault();
    // 1) Validar campos
    if (!this.correo.trim() || !this.contrasenna.trim()) {
      this.toastMessage = 'Faltan datos';
      this.toastColor   = 'danger';
      this.isToastOpen  = true;
      return;
    }

    
    const buscarDatos = {
      correo: this.correo.trim(),
      contrasenna: this.contrasenna
    };

 
    this.http.post<any>(
      'http://localhost:3000/guardar_datos/login.php',
      buscarDatos,
      { headers: { 'Content-Type': 'application/json' } }
      ).subscribe(
      res => {
        console.log('Respuesta del servidor:', res);

        if (res.success) {
          this.toastMessage = `Bienvenida, ${res.usuario.nombre}`;
          this.toastColor   = 'success';
          this.isToastOpen  = true;
          this.animateSuccess();

          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          this.router.navigateByUrl('/home');
        } else {
          this.toastMessage = res.message || 'Credenciales incorrectas';
          this.toastColor   = 'danger';
          this.isToastOpen  = true;
          this.animateError();
        }
      },
      err => {
        console.error('Error en la petición:', err);
        this.toastMessage = 'Error de conexión con el servidor';
        this.toastColor   = 'danger';
        this.isToastOpen  = true;
        this.animateError();
      }
    );
  }
  

  animateSuccess() {
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
  goToRegistro() {
  this.router.navigateByUrl('/registro');}

  goToHome() {
    this.router.navigateByUrl('/home');
  
  }


}