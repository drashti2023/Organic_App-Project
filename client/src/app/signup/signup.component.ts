import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    name: '',
    email: '',
    password: '',
    address: [{
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }]
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.authService.signUp(this.user).subscribe({
      next: (res) => {
        console.log('Signup successful:', res);
        alert('Signup successful! Please login.');
        this.router.navigate(['/login']);  // Redirect after signup
      },
      error: (err) => {
        console.error('Signup failed:', err);
        alert(err.error?.msg || 'Signup failed. Please try again.');
      }
    });
  }
}
