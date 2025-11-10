import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule],
  providers: []
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

  constructor(
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

  }
//dijeron que esta propiedad es para limpiar recursos
  ngOnDestroy() {
    try {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    } catch (e) {}
  }
}