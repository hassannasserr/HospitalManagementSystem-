import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './features/auth/components/register/register';
import { Home } from "./features/landing/pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
