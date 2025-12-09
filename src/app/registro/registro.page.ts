import { Component, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core'; // <--- 1. Agregado NgZone
import { NavController } from '@ionic/angular'; // <--- 2. Cambiamos Router por NavController (Mejor para Ionic)
import { ToastController } from '@ionic/angular';
import { createAnimation } from '@ionic/core';

import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonInput, IonButton, IonItem, IonLabel 
} from '@ionic/angular/standalone';

import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonInput, IonButton,
    IonItem, IonLabel
  ]
})
export class RegistroPage {

  nombre = '';
  correo = '';
  contrasenna = '';

  @ViewChild('nombreInput', { read: ElementRef }) nombreInput!: ElementRef;
  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('contrasennaInput', { read: ElementRef }) contrasennaInput!: ElementRef;

  constructor(
    private sql: BaseDatos,
    private toastController: ToastController,
    private navCtrl: NavController,
    private ngZone: NgZone, 
    private cd: ChangeDetectorRef         
  ) {}

  ionViewWillEnter() {
    this.cd.detectChanges();
  }

  async ngOnInit() {
    await this.sql.crearBD(); 
  }

  async registrar(event: Event) {
    event.preventDefault();

    const nombre = this.nombre.trim();
    const correo = this.correo.trim();
    const contrasenna = this.contrasenna.trim();

    // --- VALIDACIÓN 1: CAMPOS VACÍOS ---
    if (!nombre || !correo || !contrasenna) {
      await this.mostrarToast("Por favor completa todos los campos", "warning");
      this.reproducirAnimacionError();
      return;
    }

    // --- VALIDACIÓN 2: FORMATO DE CORREO (REGEX) ---
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(correo)) {
      await this.mostrarToast("El formato del correo no es válido 📧", "danger");
      this.reproducirAnimacionError();
      return;
    }

    // --- VALIDACIÓN 3: LARGO DE CONTRASEÑA ---
    if (contrasenna.length < 6) {
      await this.mostrarToast("La contraseña debe tener al menos 6 caracteres 🔒", "warning");
      this.reproducirAnimacionError();
      return;
    }

    // --- INTENTO DE REGISTRO ---
    try {
      const ok = await this.sql.insertarUsuario(nombre, correo, contrasenna);

      if (ok) {
        await this.mostrarToast("Registro exitoso 🎉", "success");
        this.animateSuccess();
        
        // --- 5. EL FIX PARA LA PANTALLA NEGRA ---
        // Forzamos a Angular a navegar dentro de su zona segura
       setTimeout(() => {
            this.ngZone.run(() => {
                // animated: false es CRÍTICO para evitar la pantalla blanca
                this.navCtrl.navigateRoot('/login', { animated: false }); 
            });
        }, 500);

      } else {
        throw new Error("No se pudo insertar");
      }

    } catch (e) {
      console.error("Error en registro:", e);
      await this.mostrarToast("Error al registrar (¿Correo duplicado?)", "danger");
    }
  }

  irALogin() {
    // También protegemos la navegación normal
    this.ngZone.run(() => {
        this.navCtrl.navigateBack('/login');
    });
  }

  reproducirAnimacionError() {
    const anim = createAnimation()
      .addElement(this.nombreInput.nativeElement)
      .addElement(this.emailInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .duration(300)
      .keyframes([
        { offset: 0, transform: "translateX(0)" },
        { offset: 0.25, transform: "translateX(-8px)" },
        { offset: 0.5, transform: "translateX(8px)" },
        { offset: 0.75, transform: "translateX(-8px)" },
        { offset: 1, transform: "translateX(0)" }
      ]);

    anim.play();
  }

  async mostrarToast(mensaje: string, color: string = "primary") {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: "bottom",
    });
    await toast.present();
  }

  animateSuccess() {
    const anim = createAnimation()
      .addElement(this.nombreInput.nativeElement)
      .addElement(this.emailInput.nativeElement)
      .addElement(this.contrasennaInput.nativeElement)
      .duration(300)
      .keyframes([
        { offset: 0, transform: "scale(1)", background: "transparent" },
        { offset: 0.5, transform: "scale(1.05)", background: "#d4edda" },
        { offset: 1, transform: "scale(1)", background: "transparent" }
      ]);

    anim.play();
  }
}