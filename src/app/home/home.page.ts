import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController} from '@ionic/angular';
//import { IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid, logOut, person, musicalNotes, home } from 'ionicons/icons';

import { AudioService, Track } from '../service/audio';
import { BaseDatos } from '../service/sql-lite';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule/*,IonHeader, IonToolbar*/],
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

  private subs: Subscription[] = [];

  constructor(
    public audioService: AudioService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private bd: BaseDatos, 
    private navCtrl: NavController
  ) {
    addIcons({ grid, logOut, person, musicalNotes, home });
  }

  ionViewWillEnter() {
    console.log('🏠 Home activo - Verificando seguridad...');
    
    // 1. EL FIX DE PANTALLA NEGRA
    this.cd.detectChanges();

    // 2. EL FIX DE SEGURIDAD "ANTI-ZOMBIE" 🧟‍♂️🚫
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('🚨 Acceso no autorizado detectado en Home (Botón Atrás). Expulsando...');
      // Si no hay token, lo mandamos al login inmediatamente
      this.navCtrl.navigateRoot('/login', { animated: false });
      return;
    }
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
    const usuarioAlmacenado = localStorage.getItem('usuario_actual');
    if (usuarioAlmacenado) {
      this.usuarioActual = this.usuarios.find(u => u.correo === usuarioAlmacenado);
    }
    if (!this.usuarioActual && this.usuarios.length > 0) {
      this.usuarioActual = this.usuarios[0];
    }

    
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
    this.router.navigate(['/main/now-playing']);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  logout() {
    console.log('👋 Cerrando sesión...');
    
    // 1. Borrar las llaves
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario_actual'); 
    // 2. Navegar a login
    this.navCtrl.navigateRoot('/login', { animated: false });
  }

}
