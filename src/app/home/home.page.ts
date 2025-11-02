import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule],
  providers: [NativeAudio]
})
export class HomePage implements OnInit, OnDestroy {
  // Reproducción de audio HTML5
  audio = new Audio('assets/audio/track1.mp3');
  currentTime = 0;
  duration = 0;


  profileImg: string | null = 'assets/icon/Profile-Icon.png';

  // Menú de perfil
  menuOpen = false;
  popoverEvent: any = null;

  // Me dijeron qu esto es para saber si NativeAudio está listo
  private nativeReady = false;

  constructor(
    private nativeAudio: NativeAudio,
    private router: Router,
    private platform: Platform
  ) {}

  // Menú

  
  toggleProfileMenu(event: Event) {
    this.menuOpen = !this.menuOpen;
    this.popoverEvent = event;
    this.profileImg = localStorage.getItem('profileImg') || 'assets/icon/Profile-Icon.png';
    this.profileImg = this.profileImg ? this.profileImg : 'assets/icon/Profile-Icon.png';
  }

  closeMenu() {
    this.menuOpen = false;
    this.popoverEvent = null;
  }

  onMiPerfil() {
    this.closeMenu();
    this.router.navigate(['/mi-perfil']);
  }

  onListas() {
    this.closeMenu();
    this.router.navigate(['/listas']);
  }

  onLogout() {
    this.closeMenu();
    // Añade aquí tu lógica de logout (limpiar token, servicio auth, etc.)
    this.router.navigate(['/login']);
  }

  // Reproducción con HTML5
  playAudio() {
    this.audio.play();
  }

  pauseAudio() {
    this.audio.pause();
  }

  seekAudio(event: any) {
    const value = event?.detail?.value ?? event;
    if (typeof value === 'number') {
      this.audio.currentTime = value;
    }
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  async ngOnInit() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
    });

    // Esta parte sirve param lo nativo (explicasion de internets)
    if (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) {
      try {
        await this.platform.ready();
        this.nativeReady = true;
        await this.nativeAudio.preloadSimple('track1', 'assets/audio/track1.mp3');
        // esto me avisa si falla el narrador nativo
      } catch (err) {
        console.warn('NativeAudio no disponible o no pudo precargar:', err);
        this.nativeReady = false;
      }
    }
  }
//dijeron que esta propiedad es para limpiar recursos
  ngOnDestroy() {
    try {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    } catch (e) {}

  
    if (this.nativeReady) {
      try {
        this.nativeAudio.unload('track1').catch(() => {});
      } catch (e) {}
    }
  }

    // Reproducción con NativeAudio
  async playNativeAudio() {
    if (!this.nativeReady) {
      
      return this.playAudio();
    }
    try {
      await this.nativeAudio.play('track1');
    } catch (err) {
      console.warn('Error al reproducir con NativeAudio, usando fallback HTML5', err);
      this.playAudio();
    }
  }

  async stopNativeAudio() {
    if (!this.nativeReady) {
      return this.pauseAudio();
    }
    try {
      await this.nativeAudio.stop('track1');
    } catch (err) {
      console.warn('Error al detener NativeAudio', err);
      this.pauseAudio();
    }
  }
}