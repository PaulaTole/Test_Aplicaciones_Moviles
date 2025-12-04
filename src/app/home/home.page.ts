import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonContent, IonList, IonItem, IonLabel,
  IonButton, IonRange, IonThumbnail, IonMenu, IonTitle, IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';

import { BaseDatos } from '../service/sql-lite';
import { AudioService, Track } from '../service/audio';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonRange, CommonModule, IonThumbnail, IonMenu, IonTitle,
    IonButtons, IonMenuButton
  ],
})
export class HomePage implements OnInit, OnDestroy {

  private sql = inject(BaseDatos);
  private audio = inject(AudioService);

  usuarios: any[] = [];

  tracks: Track[] = [];
  currentTrack: Track | null = null;
  currentIndex = -1;
  isPlaying = false;

  progress = 0;
  duration = 1;

  private subs: Subscription[] = [];
  constructor(private router: Router) {};

  ngOnInit() {
    this.iniciarBaseDatos();
    this.cargarPlaylist();
    this.iniciarSubscripciones();
  }

  // -----------------------
  // Usuarios (SQLite)
  // -----------------------
  async iniciarBaseDatos() {
    await this.sql.crearBD();
    this.sql.obtenerUsuarios().then(users => this.usuarios = users);
  }

  // -----------------------
  // Playlist
  // -----------------------
  cargarPlaylist() {
    setTimeout(() => {
      this.tracks = this.audio.playlist;
      console.log("Tracks cargados:", this.tracks);
    }, 300);
  }

  // -----------------------
  // Observables Audio
  // -----------------------
  iniciarSubscripciones() {
    this.audio.trackInfo$.subscribe(track => {
      this.currentTrack = track;

      if (track) {
        this.duration = this.audio.getDuration();
      }
    });

    this.audio.isPlaying$.subscribe(p => {
      this.isPlaying = p;
    });
  }

  // -----------------------
  // Reproductor
  // -----------------------
  playTrack(index: number) {
    this.currentIndex = index;
    this.audio.playTrack(index);
    this.startProgressLoop();
  }

  pauseTrack() {
    this.audio.pauseTrack();
  }

  resumeTrack() {
  this.audio.resumeTrack();
  } 


  next() {
    this.audio.nextTrack();
  }

  prev() {
    this.audio.prevTrack();
  }

  // -----------------------
  // Barra de progreso
  // -----------------------
  private startProgressLoop() {
    const loop = interval(300).subscribe(() => {
      const p = this.audio.getProgress();
      if (p !== null) {
        this.progress = p;
        this.duration = this.audio.getDuration();
      }
    });

    this.subs.push(loop);
  }

  seekTrack(event: any) {
    let value = event.detail.value;

    if (typeof value === 'object') {
      value = value.lower;
    }

    this.audio.seek(value);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  irANowPlaying() {
  this.router.navigate(['/now-playing']);
}
  logout() {
  console.log("logout");
    this.router.navigate(['/login']);
  }

}

