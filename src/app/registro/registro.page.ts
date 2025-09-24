import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef, ViewChild } from '@angular/core';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonLabel, IonToolbar, IonInput, IonButton, IonInputPasswordToggle, IonItem, IonToast } from '@ionic/angular/standalone';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonInputPasswordToggle, IonItem, IonToast, IonLabel, HttpClientModule]
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasenna: string = '';

  @ViewChild('nombreInput', { read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(private router: Router, private http: HttpClient) {}
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';

  private presentToast(message: string, color: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }


 registrar(event: Event) {
  event.preventDefault();

  // Validaciones 
  if (!this.nombre || !this.correo || !this.contrasenna) {
    alert('Todos los campos son obligatorios');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.correo)) {
    alert('El correo no es válido');
    return;
  }
  if (this.contrasenna.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres');
    return;
  }

  // Guardar usuario en localStorage
   const datos = new FormData();
    datos.append('nombre', this.nombre);
    datos.append('correo', this.correo);
    datos.append('contrasenna', this.contrasenna);

    this.http
      .post('http://localhost:3000/guardar_datos/registrar_usser.php', datos)
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.presentToast('Usuario registrado correctamente', 'success');
            setTimeout(() => this.router.navigateByUrl('/login'), 2000);
          } else {
            this.presentToast(res.message, 'danger');
          }
        },
        error: () => {
          this.presentToast('Error al conectar con el servidor', 'danger');
        }
      });

        // Navegar al login
        this.router.navigateByUrl('/login');
        this.animateSuccess();
    }
  
    animateSuccess() {
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
