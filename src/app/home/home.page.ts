import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController} from '@ionic/angular';
import {IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonMenuButton, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonRange,
  IonFab, IonFabButton, IonFabList, IonIcon, IonRouterOutlet, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, logOut, person, musicalNotes, home } from 'ionicons/icons';
import { MusicApiService } from '../service/music-api';
import { AudioService, Track } from '../service/audio';
import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, IonList, IonItem, IonThumbnail, IonLabel, IonButton, IonRange,
  IonFab, IonFabButton, IonFabList, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton
 , IonRouterOutlet, RouterLink, IonAvatar],
})
export class HomePage implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentTrack: Track | null = null;
  isPlaying = false;
  currentIndex = -1;

  progress = 0;
  duration = 1;

  usuarios: any[] = [];
  usuarioActual: any = null;
  currentImage: string = 'assets/icon/default_user_profile.png';
  listaApi: any[] = [];

  private subs: Subscription[] = [];

  constructor(
    public audioService: AudioService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private bd: BaseDatos, 
    private navCtrl: NavController,
    private api: MusicApiService
  ) {
    addIcons({ 'grid': grid, 'log-out': logOut, 'person': person, 'musical-notes': musicalNotes, 'home': home });
  }

  ionViewWillEnter() {
    console.log('🏠 Home activo - Verificando seguridad...');
    this.cd.detectChanges();

    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('🚨 Acceso no autorizado. Expulsando...');
      this.navCtrl.navigateRoot('/login', { animated: false });
      return;
    }

    
    const correo = localStorage.getItem('usuario_actual');
    if (correo) {
      const foto = localStorage.getItem('foto_' + correo);
      if (foto) {
        this.currentImage = foto;
      }
    }
  }

  async ngOnInit() {
    await this.bd.crearBD();
    try {
      this.usuarios = await this.bd.obtenerUsuarios();
    } catch (e) {
      console.error('❌ Error al cargar usuarios en HomePage:', e);
      this.usuarios = [];
    }

    // LÓGICA DE USUARIO ACTUAL
    const usuarioAlmacenado = localStorage.getItem('usuario_actual');
    if (usuarioAlmacenado) {
      this.usuarioActual = this.usuarios.find(u => u.correo === usuarioAlmacenado);
      
      // Cargar foto inicial
      const foto = localStorage.getItem('foto_' + usuarioAlmacenado);
      if (foto) this.currentImage = foto;

    } else if (this.usuarios.length > 0) {
      // Fallback por si acaso (opcional)
      this.usuarioActual = this.usuarios[0];
    }

    // Suscripciones de Audio (Igual que antes)
    this.subs.push(
      this.audioService.playlist$.subscribe(list => {
        this.tracks = list || [];
      })
    );

    this.subs.push(
      this.audioService.trackInfo$.subscribe(track => {
        this.currentTrack = track;
        (this.currentIndex as any) = (this.audioService as any).currentIndex ?? -1;
      })
    );

    this.subs.push(this.audioService.isPlaying$.subscribe(v => (this.isPlaying = v)));

    this.subs.push(
      interval(400).subscribe(() => {
        const p = this.audioService.getProgress();
        if (p !== null) this.progress = p;
        this.duration = this.audioService.getDuration();
      })
    );

    this.api.getDatos().subscribe(datos => {
      // Le inventamos una foto al azar porque la API solo trae texto
      this.listaApi = datos.map((item: any) => ({
        titulo: item.title,
        id: item.id,
        imagen: `https://picsum.photos/id/${item.id + 10}/100/100` 
      }));
    });
  }

  playTrack(i: number) { this.audioService.playTrack(i); }
  pauseTrack() { this.audioService.pauseTrack(); }
  seekTrack(ev: any) {
    const val = ev?.detail?.value;
    if (typeof val === 'number') this.audioService.seek(val);
  }
  irANowPlaying() { this.router.navigate(['/main/now-playing']); }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  logout() {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario_actual'); 
    this.navCtrl.navigateRoot('/login', { animated: false });
  }
}