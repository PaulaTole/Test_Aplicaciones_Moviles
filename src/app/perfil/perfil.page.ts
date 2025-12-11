import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { grid, logOut, person, musicalNotes, home, camera } from 'ionicons/icons';
import { BaseDatos } from '../service/sql-lite';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRouterLink,IonRange,IonButtons, IonMenuButton, IonButton, IonIcon, IonInputPasswordToggle
  , IonAvatar, IonItem, IonLabel
  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  IonicModule, CommonModule, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonButton, IonRange, IonIcon, IonRouterLink, IonAvatar, IonItem, IonLabel, IonInputPasswordToggle],
})
export class PerfilPage implements OnInit {
  
 
  usuario: any = { id: null, nombre: '', correo: '', contrasenna: ''};
  
  usuarios: any[] = [];
  usuarioActual: any = null;

  currentImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(
    private bd: BaseDatos, 
    private router: Router, 
    private navCtrl: NavController,
    private cd: ChangeDetectorRef 
  ) {
    addIcons({ 
      'grid': grid,
      'log-out': logOut,
      'person': person,
      'musical-notes': musicalNotes,
      'home': home, 
      'camera': camera
    });
  }

  // 3. SEGURIDAD ANTI-ZOMBIE + FIX PANTALLA NEGRA
  ionViewWillEnter() {
    this.cd.detectChanges(); // Repintar
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('🚨 Acceso no autorizado en Perfil. Expulsando...');
      this.navCtrl.navigateRoot('/login', { animated: false });
    }
  }

  async ngOnInit() {
    await this.bd.crearBD();
    try {
      this.usuarios = await this.bd.obtenerUsuarios();
    } catch (e) {
      console.error('❌ Error al cargar usuarios:', e);
      this.usuarios = [];
    }

    const usuarioAlmacenado = localStorage.getItem('usuario_actual');
    
    if (usuarioAlmacenado) {
      this.usuarioActual = this.usuarios.find(u => u.correo === usuarioAlmacenado);
    }
    
    if (!this.usuarioActual && this.usuarios.length > 0) {
      this.usuarioActual = this.usuarios[0];
    }

    
    if (this.usuarioActual) {
        this.usuario = { ...this.usuarioActual }; 
      const fotoGuardada = localStorage.getItem('foto_' + this.usuario.correo);
      if (fotoGuardada) {
        this.currentImage = fotoGuardada; 


    }
  }
  }

  async guardar() {
    const ok = await this.bd.guardarUsuario(this.usuario);
    if (ok) {
      // Actualizamos también el usuario actual en memoria para reflejar cambios
      this.usuarioActual = { ...this.usuario };
      alert('Datos guardados correctamente'); // O usa un Toast mejor
      // this.router.navigate(['/main/home']); // Opcional: volver al home
    } else {
      console.error('No se pudo guardar usuario');
    }
  }

  logout() {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario_actual');
    this.navCtrl.navigateRoot('/login', { animated: false });
  }
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt 
      });

      if (image.webPath) {
        this.currentImage = image.webPath;
        if (this.usuario && this.usuario.correo) {
        localStorage.setItem('foto_' + this.usuario.correo, image.webPath);
        }
      }
    } catch (error) {
      console.log('Cancelado por el usuario');
    }
  }
}