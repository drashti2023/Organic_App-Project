import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() cartToggle = new EventEmitter<void>();
  cartCount: number = 0;
  _cartService = inject(CartService);

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // this._cartService.cartCount$.subscribe(count => {
    //   this.cartCount = count; // Update cart count
    // });
  }

  toggleCart() {
    console.log("Cart toggle clicked!");
    this._cartService.toggleCart(); // Toggle cart visibility
  }

  onLogout() {
    this.authService.logout();
    alert('You have been logged out.');
    this.router.navigate(['/login']);
  }
}