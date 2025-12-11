import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorLoginComponent } from '../component/doctor-login/doctor-login';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DoctorLoginComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
