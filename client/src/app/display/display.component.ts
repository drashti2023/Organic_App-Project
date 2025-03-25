import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display',
  imports: [],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {

  constructor(private router: Router) {}

  navigateToSignUp() {
    this.router.navigate(['/register'])
}

}