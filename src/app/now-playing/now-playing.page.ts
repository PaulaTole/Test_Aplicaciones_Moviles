import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { addIcons } from 'ionicons';
import { grid, logOut, person, musicalNotes, home } from 'ionicons/icons';
import { AudioService, Track } from '../service/audio';
import { BaseDatos } from '../service/sql-lite';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonButton, IonRange, IonIcon, IonRouterLink, IonAvatar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nowplaying',
  templateUrl: './now-playing.page.html',
  styleUrls: ['./now-playing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DecimalPipe, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonButton, IonRange, IonIcon, IonRouterLink, IonAvatar],
})
export class NowPlayingPage implements OnInit, OnDestroy {
  
  usuarios: any[] = []; 
  usuarioActual: any = null;
  currentImage: string = 'assets/icon/default_user_profile.png'; 

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
    private navCtrl: NavController,
    private router: Router
  ) {
    addIcons({ 'grid': grid, 'log-out': logOut, 'person': person, 'musical-notes': musicalNotes, 'home': home });
  }

  async ngOnInit() {
    await this.bd.crearBD();
    try {
        this.usuarios = await this.bd.obtenerUsuarios();
    } catch (e) {
        console.error('❌ Error usuarios NowPlaying:', e);
        this.usuarios = [];
    }
    
    
    const usuarioAlmacenado = localStorage.getItem('usuario_actual');
    if (usuarioAlmacenado) {
      this.usuarioActual = this.usuarios.find(u => u.correo === usuarioAlmacenado);
      
      const foto = localStorage.getItem('foto_' + usuarioAlmacenado);
      if (foto) this.currentImage = foto;
    }
    
    
    if (!this.usuarioActual && this.usuarios.length > 0) {
      this.usuarioActual = this.usuarios[0];
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

  ionViewWillEnter() {
    console.log('Now-Playing activo');
    this.cd.detectChanges();
    const token = localStorage.getItem('token');
    if (!token) {
      this.navCtrl.navigateRoot('/login', { animated: false });
    }
  }

  
  prev() { this.audioService.prevTrack(); }
  next() { this.audioService.nextTrack(); }
  resumeTrack() { this.audioService.resumeTrack(); }
  pauseTrack() { this.audioService.pauseTrack(); }
  
  onRangeChange(event: any) {
    const value = event.detail.value;
    this.audioService.seek(value);
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }
 
 logout() {
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario_actual');
    this.navCtrl.navigateRoot('/login', { animated: false });
  }
}