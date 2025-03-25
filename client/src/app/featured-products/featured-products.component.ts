import { Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist.service';
import { AuthService } from '../auth.service';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { NgFor, NgIf } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent {
  private _api = inject(ApiService);
  private _router = inject(Router);
  private _wishlistService = inject(WishlistService);
  private _authService = inject(AuthService);
  private _cartService = inject(CartService);

  featuredProducts: any[] = [];
  wishlistProductIds: Set<string> = new Set();
  loading: boolean = true;
  isAuthenticated: boolean = false;

  ngOnInit() {
    this._authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) this.loadWishlist();
    });

    this.loadFeaturedProducts();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeSwiper(), 500);
  }

  loadFeaturedProducts() {
    this.loading = true;
    this._api.getFeaturedProducts().subscribe({
      next: (res) => {
        console.log("Fetched Featured Products:", res);
        this.featuredProducts = res || [];
        this.loading = false;
        setTimeout(() => this.initializeSwiper(), 500);
      },
      error: (err) => {
        console.error('Error fetching featured products:', err);
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
        } else {
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
        }
      },
      error: (err) => console.error('Failed to add to wishlist:', err)
    });
  }

  removeFromWishlist(product: any) {
    if (!this.isAuthenticated) return;

    this._wishlistService.removeFromWishlist(product._id).subscribe({
      next: (res) => {
        if (res?.wishlist?.products) {
          this.wishlistProductIds = new Set(res.wishlist.products.map((p: any) => p._id));
          console.log('Removed from Wishlist:', product.name);
        }
      },
      error: (err) => console.error('Error removing from wishlist:', err)
    });
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

  viewProductDetails(product: any) {
    const productId = product?.id || product?._id;
    if (!productId) return;
    this._router.navigate([`/product/${productId}`]);
  }

  trackByProductId(index: number, product: any): string {
    return product._id;
  }

  redirectToAuth() {
    alert('Please log in to continue.');
    this._router.navigate(['/login']);
  }

  initializeSwiper() {
    new Swiper('.featured-carousel', {
      modules: [Navigation, Pagination],
      slidesPerView: 4,
      spaceBetween: 15,
      navigation: {
        nextEl: '.featured-carousel-next',
        prevEl: '.featured-carousel-prev',
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      loop: true
    });
  }
}
