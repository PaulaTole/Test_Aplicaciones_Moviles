import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.page.html',
  styleUrls: ['./now-playing.page.scss'],
  standalone: true,
  imports: [
    IonicModule,   
    CommonModule,  
    DecimalPipe    
  ]
})
export class NowPlayingPage {

  usuarios = [{ nombre: 'Usuario', correo: 'correo@correo.com' }];

  currentTrack: any = null;
  progress = 0;
  duration = 0;
  isPlaying = false;

  constructor(private router: Router) {}

  // -------------------------
  // Métodos que controlarás desde Home
  // -------------------------
  prev() {
    console.log('prev');
  }

  next() {
    console.log('next');
  }

  resumeTrack() {
    console.log('resume');
  }

  pauseTrack() {
    console.log('pause');
  }

  logout() {
    console.log("logout");
    this.router.navigate(['/login']);
  }


}
