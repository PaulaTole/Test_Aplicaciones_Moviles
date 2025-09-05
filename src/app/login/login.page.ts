import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonInputPasswordToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonInputPasswordToggle]
})
export class LoginPage {

  email: string = '';
  password: string = '';
  isToastOpen = false;

  @ViewChild('emailInput', { read: ElementRef }) emailInput!: ElementRef;
  @ViewChild('passwordInput', { read: ElementRef }) passwordInput!: ElementRef;

  constructor(private router: Router) { }

  login(event: Event) {
    event.preventDefault();

    if (this.email === 'jesus.vargas@tinet.cl' && this.password === '123456') {
      this.animateSuccess();
      setTimeout(() => {
        this.router.navigateByUrl('/home', {
          state: { email: this.email }
        });
      }, 600);
    } else {
      this.animateError();
      this.isToastOpen = true;
    }
  }

  animateSuccess() {
    const animation = createAnimation()
      .addElement(this.emailInput.nativeElement)
      .addElement(this.passwordInput.nativeElement)
      .duration(400)
      .keyframes([
        { offset: 0, transform: 'scale(1)', background: 'transparent' },
        { offset: 0.5, transform: 'scale(1.05)', background: '#d4edda' },
        { offset: 1, transform: 'scale(1)', background: 'transparent' }
      ]);

    animation.play();
  }

  animateError() {
    const animation = createAnimation()
      .addElement(this.emailInput.nativeElement)
      .addElement(this.passwordInput.nativeElement)
      .duration(100)
      .iterations(3)
      .keyframes([
        { offset: 0, transform: 'translateX(0px)' },
        { offset: 0.25, transform: 'translateX(-10px)' },
        { offset: 0.5, transform: 'translateX(10px)' },
        { offset: 0.75, transform: 'translateX(-10px)' },
        { offset: 1, transform: 'translateX(0px)' }
      ]);

    animation.play();
  }

}
