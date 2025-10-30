import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { observable, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,HttpClientModule,IonicModule
  ],
  providers: [NativeAudio]
})
export class HomePage {
  constructor(private nativeAudio: NativeAudio) {}

audio = new Audio('assets/audio/track1.mp3');
currentTime = 0;
duration = 0;

playAudio() {
  this.audio.play();
}

pauseAudio() {
  this.audio.pause();
}

seekAudio(event: any) {
  this.audio.currentTime = event.detail.value;
}

formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' + s : s}`;
}

ngOnInit() {
  this.audio.addEventListener('loadedmetadata', () => {
    this.duration = this.audio.duration;
  });

  this.audio.addEventListener('timeupdate', () => {
    this.currentTime = this.audio.currentTime;
  });
}

  preloadAudio() {
    this.nativeAudio.preloadSimple('track1', 'assets/audio/track1.mp3').then(() => {
      console.log('Audio cargado');
    });
  }

  PlayAudio() {
    this.nativeAudio.play('track1').then(() => {
      console.log('Reproduciendo');
    });
  }

  stopAudio() {
    this.nativeAudio.stop('track1').then(() => {
      console.log('Detenido');
    });
  }
}

