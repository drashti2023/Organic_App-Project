import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistUrl = 'http://localhost:5500/wishlists'; 
  private wishlist = new BehaviorSubject<any>({ products: [] });

  constructor(private http: HttpClient, private authService: AuthService) {
    // ✅ Load wishlist after successful login
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log("🔄 User logged in, loading wishlist...");
        this.loadWishlist();
      } else {
        console.log("❌ User logged out, clearing wishlist...");
        this.clearWishlist();
      }
    });
  }

  private loadWishlist(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      console.warn("⚠ No user found, skipping wishlist load.");
      return;  
    }

    this.http.get<any>(`${this.wishlistUrl}/user/${user.id}`).pipe(
      tap(wishlist => {
        console.log("✅ Wishlist loaded successfully:", wishlist);
        this.wishlist.next(wishlist);
      }),
      catchError(error => {
        console.error('❌ Error loading wishlist:', error);
        return of({ products: [] });
      })
    ).subscribe();
  }

  private clearWishlist(): void {
    this.wishlist.next({ products: [] });
  }

  getWishlist(): Observable<any> {
    return this.wishlist.asObservable();
  }

  addToWishlist(productId: string): Observable<any> {
    const user = this.authService.getUser();
    if (!user || !user.id) {  
      console.error('❌ User not logged in.');
      return of(this.wishlist.value);
    }
  
    return this.http.post<any>(`${this.wishlistUrl}/`, { user: user.id, products: [productId] }).pipe(
      tap(response => {
        console.log("✅ Product added to wishlist:", response);
        
        // ✅ Check if response contains 'wishlist' before updating BehaviorSubject
        if (response?.wishlist && response.wishlist.products) {
          this.wishlist.next(response.wishlist);  // ✅ Ensure correct format
        } else {
          console.warn("⚠ Unexpected response format:", response);
        }
      }),
      catchError(error => {
        console.error('❌ Error adding to wishlist:', error);
        return of(this.wishlist.value);
      })
    );
  }
  

  removeFromWishlist(productId: string): Observable<any> {
    const user = this.authService.getUser(); 
    if (!user || !user.id) {
      console.error('❌ User not logged in.');
      return of(this.wishlist.value);
    }

    return this.http.post<any>(`${this.wishlistUrl}/remove`, { user: user.id, productId }).pipe(
      tap(response => {
        console.log("✅ Product removed from wishlist:", response);
        this.wishlist.next(response);
      }),
      catchError(error => {
        console.error('❌ Error removing from wishlist:', error);
        return of(this.wishlist.value);
      })
    );
  }
}