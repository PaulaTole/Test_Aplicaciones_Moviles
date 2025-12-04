import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface Track {
  
  name: string;
  file: string; 
}

@Injectable({
  providedIn: 'root'
  
})
export class AudioService {

  // ------- PLAYLIST -------
  playlist: Track[] = [];
  public playlist$ = new BehaviorSubject<Track[]>([]);

  private player!: Howl;   // reproductor principal
  private currentIndex: number = 0;

  // Para que el Home pueda saber qué suena
  public trackInfo$ = new BehaviorSubject<Track | null>(null);
  public isPlaying$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  this.loadPlaylist();
}
  // Cargar la lista de reproducción desde el archivo JSON
  private loadPlaylist() {
    this.http.get<Track[]>('assets/audio/audio.json').subscribe(data => {
      this.playlist = data;
      this.playlist$.next(data);
    })}

  // -------------------------
  // INICIAR UNA CANCIÓN
  // -------------------------
  playTrack(index: number) {
    console.log("👉 playTrack() llamado con index:", index);
    /**/
    if (this.playlist.length === 0) {
    console.warn("Playlist aún no cargada");
    return;}

    console.log("Playlist cargada correctamente:", this.playlist);

    if (this.player) {
    console.log("⏹️ Deteniendo audio anterior");
    this.player.stop();
    }

    this.currentIndex = index;
    const track = this.playlist[index];

    console.log("🎵 Canción seleccionada:", track);

   this.player = new Howl({
    src: [`assets/audio/${track.file}`],
    html5: true,
    onload: () => {
      console.log("✅ Howler cargó el audio correctamente");
    },
    onloaderror: (_id:number, error:any) => {
      console.error("❌ ERROR al cargar audio:", error);
    },
    onplay: () => {
      console.log("▶️ Reproducción iniciada");
      this.isPlaying$.next(true);
      this.trackInfo$.next(track);
    },
    onplayerror: (_id:number, error:any) => {
      console.error("❌ ERROR al intentar reproducir:", error);
    },
    onend: () => {
      console.log("⏭️ Canción terminada, pasando a la siguiente…");
      this.nextTrack();
     }
  });
  console.log("📀 Howl creado, intentando reproducir…");
  this.player.play();

  }

  // -------------------------
  // PAUSAR
  // -------------------------
  pauseTrack() {
    if (this.player) {
      this.player.pause();
      this.isPlaying$.next(false);
    }
  }

  // -------------------------
  // REANUDAR
  // -------------------------
  resumeTrack() {
    if (this.player) {
      this.player.play();
      this.isPlaying$.next(true);
    }
  }

  // -------------------------
  // SIGUIENTE
  // -------------------------
  nextTrack() {
    let next = this.currentIndex + 1;
    if (next >= this.playlist.length) next = 0;
    this.playTrack(next);
  }

  // -------------------------
  // ANTERIOR
  // -------------------------
  prevTrack() {
    let prev = this.currentIndex - 1;
    if (prev < 0) prev = this.playlist.length - 1;
    this.playTrack(prev);
  }

  // Obtener canción actual
  getCurrentTrack() {
    return this.playlist[this.currentIndex];
  }

  getProgress(): number | null {
  if (!this.player) return null;
  return this.player.seek() as number;
  }

  getDuration(): number {
    if (!this.player) return 1;
    return this.player.duration();
  }

  seek(value: number) {
    if (this.player) {
      this.player.seek(value);
    }
  }

}
