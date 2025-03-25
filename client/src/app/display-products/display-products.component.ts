import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NgFor, NgIf } from '@angular/common';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service'; // Import CartService

@Component({
  selector: 'app-display-products',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent  {
  private _api = inject(ApiService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _wishlistService = inject(WishlistService);
  private _authService = inject(AuthService);
  private _cartService = inject(CartService); 

  products: any[] = [];
  wishlistProductIds: Set<string> = new Set();
  loading: boolean = true;
  isAuthenticated: boolean = false;

  ngOnInit() {
    this._authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) this.loadWishlist();
    });

    this._route.paramMap.subscribe(params => {
      const categoryId = params.get('categoryId') || '';
      if (categoryId) this.loadProducts(categoryId);
    });
  }

  loadProducts(categoryId: string) {
    this.loading = true;
    this._api.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        console.log("Fetched products:", res);
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

  loadWishlist() {
    this._wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        console.log("Wishlist loaded successfully:", wishlist);
  
        if (wishlist && Array.isArray(wishlist.products)) {
          this.wishlistProductIds = new Set(wishlist.products.map((p: any) => p._id));
          console.log("Wishlist Product IDs:", this.wishlistProductIds);
        } else {
          console.warn("Wishlist response does not contain a valid products array:", wishlist);
          this.wishlistProductIds.clear();
        }
      },
      error: (err) => console.error('Error fetching wishlist:', err)
    });
  }

  addToWishlist(product: any) {
    if (!this.isAuthenticated) {
      this.redirectToAuth();
      return;
    }

    this._wishlistService.addToWishlist(product._id).subscribe({
      next: (res) => {
        if (res?.wishlist?.products) {
          this.wishlistProductIds = new Set(res.wishlist.products.map((p: any) => p._id));
          console.log('Added to Wishlist:', product.name);
        } else {
          console.warn("Unexpected wishlist response format:", res);
        }
      },
      error: (err) => {
        console.error('Failed to add to wishlist:', err);
        alert('Error adding to wishlist. Please try again.');
      }
    });
  }

  removeFromWishlist(product: any) {
    if (!this.isAuthenticated || !product || !product._id) return;

    this._wishlistService.removeFromWishlist(product._id).subscribe({
      next: (res) => {
        if (res?.wishlist?.products) {
          this.wishlistProductIds = new Set(res.wishlist.products.map((p: any) => p._id));
          console.log(`Removed from Wishlist: ${product.name}`);
        } else {
          console.warn("Unexpected wishlist response format:", res);
        }
      },
      error: (err) => console.error('Error removing from wishlist:', err)
    });
  }

  viewProductDetails(product: any) {
    if (!product || !product._id) return;
    this._router.navigate([`/product/${product._id}`]);
  }

  addToCart(product: any) {
    const user = this._authService.getUser(); // Get logged-in user
    if (!user) {
      this._router.navigate(['/login']);
      return;
    }
    console.log("Adding to cart:", {  
      userId: user?.id, // Check if user ID exists
      productId: product?._id, // Check if product ID exists
      quantity: 1  
    });
  
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
  

  trackByProductId(index: number, product: any): string {
    return product._id;
  }

  redirectToAuth() {
    const isNewUser = this._authService.isNewUser();
    if (isNewUser) {
      alert('New user? Please sign up to continue.');
      this._router.navigate(['/signup']);
    } else {
      alert('Please log in to continue.');
      this._router.navigate(['/login']);
    }
  }
}
