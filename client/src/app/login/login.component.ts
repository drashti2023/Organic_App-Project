import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { identifier: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.loginData.identifier || !this.loginData.password) {
      alert('Please enter both Username/Email and Password.');
      return;
    }

    this.authService.login(this.loginData.identifier, this.loginData.password).subscribe({
      next: (res) => {
        console.log('Login Response:', res);

        if (res.isvalid) {
          localStorage.setItem('token', res.token); // Store token for authentication
          alert(res.msg || 'Login successful!');
          this.router.navigate(['/']); // Redirect to home or dashboard
        } else {
          alert(res.msg || 'Invalid username/email or password.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}
