import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
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
  duration = 0.01;
  isPlaying = false;

  private subs: Subscription[] = [];

  constructor(
    public audioService: AudioService,
    private bd: BaseDatos,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    // carga usuarios (mock o sqlite según plataforma)
    try {
      this.usuarios = await this.bd.obtenerUsuarios();
    } catch (e) {
      console.log('Error cargando usuarios', e);
    }

    
    this.subs.push(this.audioService.trackInfo$.subscribe(t => {
      this.currentTrack = t;
      this.cd.detectChanges();
    }));
    
    this.subs.push(this.audioService.isPlaying$.subscribe(p => {
      this.isPlaying = p;
      this.cd.detectChanges();
    }));

    
    this.subs.push(
      interval(100).subscribe(() => {
        this.ngZone.run(() => {
          const p = this.audioService.getProgress();
          const d = this.audioService.getDuration();
          
          this.progress = p ?? 0;
          this.duration = (d && d > 0) ? d : 0.01;
        });
      })
    );
  }

  // Fix pantalla negra al volver
  ionViewWillEnter() {
    this.cd.detectChanges();
  }

  // Controles
  prev() { this.audioService.prevTrack(); }
  next() { this.audioService.nextTrack(); }
  resumeTrack() { this.audioService.resumeTrack(); }
  pauseTrack() { this.audioService.pauseTrack(); }
  
  onRangeChange(event: any) {
    const value = event.detail.value;
    this.audioService.seek(value);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}