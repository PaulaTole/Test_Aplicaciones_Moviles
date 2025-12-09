import { Component, OnInit, OnDestroy, ChangeDetectorRef,  } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AudioService, Track } from '../service/audio';
import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentTrack: Track | null = null;
  isPlaying = false;
  currentIndex = -1;

  progress = 0;
  duration = 1;

  usuarios: any[] = [];

  private subs: Subscription[] = [];

  constructor(
    public audioService: AudioService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private bd: BaseDatos
  ) {}

  ionViewWillEnter() {
    console.log('🏠 Home activo - Repintando');
    this.cd.detectChanges();
  }

  async ngOnInit() {
    // carga usuarios (mock o sqlite según plataforma)
    await this.bd.crearBD();
    try {
      this.usuarios = await this.bd.obtenerUsuarios();
    } catch (e) {
      console.error('❌ Error al cargar usuarios en HomePage:', e);
      this.usuarios = [];
    }

    // playlist (AudioService carga el JSON en su constructor)
    // Suscribirse al playlist$ para actualizar cuando llegue la respuesta HTTP
    this.subs.push(
      this.audioService.playlist$.subscribe(list => {
        this.tracks = list || [];
      })
    );

    // suscripciones
    this.subs.push(
      this.audioService.trackInfo$.subscribe(track => {
        this.currentTrack = track;
        // currentIndex lo guarda el servicio
        (this.currentIndex as any) = (this.audioService as any).currentIndex ?? -1;
      })
    );

    this.subs.push(this.audioService.isPlaying$.subscribe(v => (this.isPlaying = v)));

    // loop de progreso
    this.subs.push(
      interval(400).subscribe(() => {
        const p = this.audioService.getProgress();
        if (p !== null) this.progress = p;
        this.duration = this.audioService.getDuration();
      })
    );
  }

  playTrack(i: number) {
    this.audioService.playTrack(i);
  }

  pauseTrack() {
    this.audioService.pauseTrack();
  }

  seekTrack(ev: any) {
    const val = ev?.detail?.value;
    if (typeof val === 'number') this.audioService.seek(val);
  }

  irANowPlaying() {
    this.router.navigate(['/now-playing']);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
