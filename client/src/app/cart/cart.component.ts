import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { NgFor, NgIf, AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent  {
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  cart$: Observable<any> = this._cartService.cart$; // Cart observable
  isCartOpen$: Observable<boolean> = this._cartService.cartVisible$; // Listen for visibility changes

  isAuthenticated: boolean = false;
  errorMessage: string = '';
  totalAmount: number = 0;


  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        const user = this._authService.getUser();
        if (user?.id) {
          this._cartService.syncCartWithBackend(user.id);
        }
      }
    });
     // ✅ Subscribe to total amount changes
  this._cartService.totalAmount$.subscribe(amount => {
    this.totalAmount = amount;
  });
  }

  /** Navigate to product details */
  viewProductDetails(productId: string): void {
    this._router.navigate([`/product/${productId}`]);
  }

  /** Remove an item from cart */
  removeFromCart(productId: string): void {
    if (!this.isAuthenticated) return;
  
    const user = this._authService.getUser();
    if (!user?.id) return;
  
    this._cartService.removeFromCart(user.id, productId).subscribe({
      next: (response) => {
        console.log('Item removed successfully:', response);
        this._cartService.syncCartWithBackend(user.id); // Refresh the cart after removal
      },
      error: (err) => {
        console.error('Error removing product from cart:', err);
        this.errorMessage = 'Failed to remove product. Please try again later.';
      }
    });
  }
  

  /** Update cart item quantity */
  updateQuantity(productId: string, newQuantity: number): void {
    if (!this.isAuthenticated || newQuantity < 1) return;

    const user = this._authService.getUser();
    if (!user?.id) return;

    this._cartService.updateCart(user.id, productId, newQuantity).subscribe({
      error: err => {
        console.error('Error updating cart item:', err);
        this.errorMessage = 'Failed to update quantity. Please try again later.';
      }
    });
  }

  /** Clear entire cart */
  clearCart(): void {
    if (!this.isAuthenticated) return;

    const user = this._authService.getUser();
    if (!user?.id) return;

    this._cartService.clearCart(user.id).subscribe({
      error: err => {
        console.error('Error clearing cart:', err);
        this.errorMessage = 'Failed to clear cart. Please try again later.';
      }
    });
  }

  /** Proceed to checkout */
  checkout(): void {
    this._router.navigate(['/checkout']);
  }
  

  /** Toggle cart visibility */
  toggleCart(): void {
    this.cartService.toggleCart();
  
    setTimeout(() => {
      const cartSidebar = document.querySelector('.cart-sidebar');
      if (cartSidebar) {
        cartSidebar.classList.toggle('open');
      }
    }, 10); // Adding a small delay for smooth transition
  }
  
  closeCart() {
    this._cartService.closeCart();
  }
}
