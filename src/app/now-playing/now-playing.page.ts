import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

import { AudioService, Track } from '../service/audio';
import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-nowplaying',
  templateUrl: './now-playing.page.html',
  styleUrls: ['./now-playing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DecimalPipe],
})
export class NowPlayingPage implements OnInit, OnDestroy {
  usuarios: any[] = [];
  currentTrack: Track | null = null;
  progress = 0;
  duration = 1;
  isPlaying = false;

  private subs: Subscription[] = [];

  constructor(
    public audioService: AudioService,
    private router: Router,
    private bd: BaseDatos
  ) {}

  async ngOnInit() {
    await this.bd.crearBD();
    this.usuarios = await this.bd.obtenerUsuarios();

    this.subs.push(this.audioService.trackInfo$.subscribe(t => (this.currentTrack = t)));
    this.subs.push(this.audioService.isPlaying$.subscribe(p => (this.isPlaying = p)));

    this.subs.push(
      interval(400).subscribe(() => {
        const p = this.audioService.getProgress();
        this.progress = p ?? 0;
        this.duration = this.audioService.getDuration();
      })
    );
  }

  prev() {
    this.audioService.prevTrack();
  }

  next() {
    this.audioService.nextTrack();
  }

  resumeTrack() {
    this.audioService.resumeTrack();
  }

  pauseTrack() {
    this.audioService.pauseTrack();
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  onRangeChange(event: any) {
  const value = event.detail.value;
    if (typeof value === 'number') {
      this.audioService.seek(value);
      return;
    }

    if (typeof value === 'object' && value.upper !== undefined) {
      this.audioService.seek(value.upper);
    }
}

}
