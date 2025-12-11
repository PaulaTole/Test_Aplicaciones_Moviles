import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { grid, logOut, person, musicalNotes, home } from 'ionicons/icons';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class LayoutPage {}