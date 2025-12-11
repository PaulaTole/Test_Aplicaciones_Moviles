import { Component, ElementRef, ViewChild, NgZone, ChangeDetectorRef, ApplicationRef } from '@angular/core'; 
import { NavController } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonInput, IonButton, IonInputPasswordToggle,
  IonItem, IonToast
} from '@ionic/angular/standalone';

import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonInput, IonButton,
    IonInputPasswordToggle, IonItem, IonToast
  ]
})
export class LoginPage {

  email: string = '';
  password: string = '';
  isToastOpen = false;

  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('passwordInput', { read: ElementRef }) passwordInput!: ElementRef;

  constructor(
    private router: Router,
    private sql: BaseDatos, 
    private navCtrl: NavController, 
    private ngZone: NgZone, 
    private cd: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ionViewWillEnter() {
    console.log('🔄 Login: Iniciando protocolo de repintado...');
    this.cd.detectChanges();

    this.appRef.tick();

   setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.cd.detectChanges();
        console.log('✨ Pantalla forzada a repintarse');
    }, 100);
  }

  
  async login(event: Event) {
    event.preventDefault();

    const correo = this.email.trim();
    const contrasenna = this.password.trim();


    if (!correo || !contrasenna) {
      this.animateError();
      this.isToastOpen = true;
      return;
    }

    const valido = await this.sql.validarUsuario(correo, contrasenna);

    if (valido) {
      
      localStorage.setItem('token', 'sesion-activa'); 
      localStorage.setItem('usuario_actual', correo); 

      this.animateSuccess();
      // Pequeña espera para ver la animación antes de cambiar de página
      setTimeout(() => {
        // En el éxito del login:
            this.ngZone.run(() => {
                this.navCtrl.navigateRoot('/main/home', { animated: false }); 
        });
      }, 400);
      
    } else {
      this.animateError();
      this.isToastOpen = true;
    }
  }
    


animateSuccess() {
  const animation = createAnimation()
    .addElement(this.emailInput.nativeElement)
    .addElement(this.passwordInput.nativeElement)
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
    .addElement(this.passwordInput.nativeElement)
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
      this.ngZone.run(() => {
        this.navCtrl.navigateForward('/registro');
      });
    }

    
}
