import { Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { play, pause } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

import { BaseDatos } from '../service/sql-lite';
import { AudioService, Track } from '../service/audio';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    CommonModule,
  ],
})
export class HomePage implements OnInit {

  private sql = inject(BaseDatos);
  private audio = inject(AudioService);

  playIcon = play;
  pauseIcon = pause;

  usuarios: any[] = [];
  playlist: Track[] = [];       
  isPlaying = false;
  currentTrack: Track | null = null;

  ngOnInit() {
    this.iniciarBaseDatos();
    this.subscribirReproductor();
    this.cargarPlaylist();
  }

  // -------------------------
  // USUARIOS (SQLite o mock)
  // -------------------------
  async iniciarBaseDatos() {
    await this.sql.crearBD();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.sql.obtenerUsuarios().then((data) => {
      console.log("👤 Usuarios cargados:", data);
      this.usuarios = data;
    });
  }

  // -------------------------
  // PLAYLIST desde servicio
  // -------------------------
  cargarPlaylist() {
    // AudioService carga el JSON de assets automáticamente
    setTimeout(() => {
      this.playlist = this.audio.playlist;
      console.log("🎵 Playlist lista:", this.playlist);
    }, 300); // pequeño delay para permitir la carga del JSON
  }

  // -------------------------
  // SUBSCRIPCIONES
  // -------------------------
  subscribirReproductor() {
    this.audio.isPlaying$.subscribe(state => {
      this.isPlaying = state;
    });

    this.audio.trackInfo$.subscribe(track => {
      this.currentTrack = track;
    });
  }

  // -------------------------
  // CONTROLES DE AUDIO
  // -------------------------
  play(index: number) {
    console.log("▶️ Play index:", index);
    this.audio.playTrack(index);
  }

  pause() {
    console.log("⏸️ Pause");
    this.audio.pauseTrack();
  }
}
