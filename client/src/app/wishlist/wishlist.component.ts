import { Component, OnInit, inject } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent  {
  private _wishlistService = inject(WishlistService);
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  private _router = inject(Router);

  wishlist: any = { products: [] };
  isAuthenticated: boolean = false; // Track login status
  loading: boolean = true;

  ngOnInit(): void {
    this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        this._wishlistService.getWishlist().subscribe(wishlist => {
          this.wishlist = wishlist;
          this.loading = false;
        });
      } else {
        this.wishlist = { products: [] }; // Clear wishlist if logged out
        this.loading = false;
      }
    });
  }

  removeFromWishlist(product: any): void {
    if (!this.isAuthenticated || !product || !product._id) return;

    this._wishlistService.removeFromWishlist(product._id).subscribe(() => {
      console.log(`Removed from Wishlist: ${product.name}`);
    });
  }

  viewProductDetails(product: any): void {
    if (!this.isAuthenticated) return;
    const productId = product.id || product._id;
    if (!productId) return;
    this._router.navigate([`/product/${productId}`]);
  }

  addToCart(product: any) {
    const user = this._authService.getUser(); // Get logged-in user
    
    if (!user) {
      this._router.navigate(['/login']);
      return;
    }
  
    if (!user?.id || !product?._id) {
      console.error("Missing user ID or product ID! Cannot add to cart.");
      return;
    }
  
    this._cartService.addToCart(user.id, product._id, 1).subscribe({
      next: (response) => {
        console.log('Added to cart successfully:', response);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }

  trackByProductId(index: number, product: any): number {
    return product.id || product._id;
  }
}