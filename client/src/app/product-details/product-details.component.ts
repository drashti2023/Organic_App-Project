import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { WishlistService } from '../wishlist.service';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-details',
  imports: [NgIf,NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  private _route = inject(ActivatedRoute);
  private _api = inject(ApiService);
  private _wishlist = inject(WishlistService);
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);
  private _router = inject(Router);

  product: any;
  loading: boolean = true;
  quantity: number = 1;  
  isInWishlist: boolean = false;

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      const productId = params.get('productId');
      if (productId) {
        this.loadProductDetails(productId);
        this.checkIfInWishlist(productId);
      }
    });
  }

  loadProductDetails(productId: string) {
    this.loading = true;
    this._api.getProductById(productId).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.loading = false;
      }
    });
  }

  checkIfInWishlist(productId: string) {
    this._wishlist.getWishlist().subscribe({
      next: (wishlist) => {
        this.isInWishlist = wishlist?.products?.some((p: any) => p._id === productId) || false;
      },
      error: (err) => {
        console.error('Error checking wishlist:', err);
      }
    });
  }

  increaseQuantity() {
    if (this.product?.stock > this.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
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

  addToWishlist(product: any) {
    const user = this._authService.getUser();
  
    if (!user) {
      alert('Please log in to continue.');
      this._router.navigate(['/login']); // Redirect to login
      return;
    }
  
    this._wishlist.addToWishlist(product._id).subscribe({
      next: (res) => {
        console.log('Added to Wishlist:', res);
        this.isInWishlist = true;
      },
      error: (err) => {
        console.error('Failed to add to wishlist:', err);
        alert('Error adding to wishlist. Please try again.');
      }
    });
  }
  
  
  removeFromWishlist(product: any) {
    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      return;
    }

    this._wishlist.removeFromWishlist(product._id).subscribe({
      next: (res) => {
        console.log(`Removed from Wishlist: ${product.name}`);
        this.isInWishlist = false; // Update UI state
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
      }
    });
  }

  buyNow(product: any) {
    console.log(`Buying Now: ${product.name} (Qty: ${this.quantity})`);
    // Implement buy now logic
  }
}
