import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  imports: [IonicModule, CommonModule, RouterModule],
})
export class LayoutPage {}
