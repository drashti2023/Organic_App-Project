import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = 'http://localhost:5500/carts'; // Backend URL
  private cartKey = 'cart'; // LocalStorage key
  private cartSubject = new BehaviorSubject<any>(null); // Holds cart object
  cart$ = this.cartSubject.asObservable(); // Observable for cart state
  private cartVisible = new BehaviorSubject<boolean>(false); // Store visibility
  cartVisible$ = this.cartVisible.asObservable(); // Observable for tracking visibility


  private totalAmountSubject = new BehaviorSubject<number>(0);
  totalAmount$ = this.totalAmountSubject.asObservable();

  constructor(private http: HttpClient) { }

  syncCartWithBackend(userId: string): void {
    this.http.get<any>(`${this.cartUrl}/user/${userId}`).pipe(
      tap(cart => {
        this.cartSubject.next(cart); // Update cart state
        localStorage.setItem(this.cartKey, JSON.stringify(cart)); // Cache cart in localStorage

        // ✅ Update total amount
        this.updateTotalAmount(this.getTotalAmount(cart));
      }),
      catchError(error => {
        console.error('Error syncing cart with backend:', error);
        return throwError(error);
      })
    ).subscribe();
  }


  /** Add item to cart */
  addToCart(userId: string, productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.cartUrl}/add`, { user: userId, product: productId, quantity }).pipe(
      tap(() => this.syncCartWithBackend(userId)), // Sync after adding
      catchError(error => {
        console.error('Error adding item to cart:', error);
        return throwError(error);
      })
    );
  }

  /** Remove item from cart */
  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/${userId}/product/${productId}`).pipe(
      tap(() => this.syncCartWithBackend(userId)),
      catchError(error => {
        console.error('Error removing item from cart:', error);
        return throwError(error);
      })
    );
  }

  updateCart(userId: string, productId: string, quantity: number): Observable<any> {
    const payload = {
      user: userId,
      items: [{ product: productId, quantity: quantity }]
    };
  
    console.log("Sending update request:", payload);
  
    return this.http.put(`${this.cartUrl}/${userId}`, payload).pipe(
      tap(cart => {
        this.syncCartWithBackend(userId);
        this.updateTotalAmount(this.getTotalAmount(cart)); // ✅ Update total amount
      }),
      catchError(error => {
        console.error('Error updating cart:', error);
        return throwError(error);
      })
    );
  }
  
  updateTotalAmount(amount: number): void {
    this.totalAmountSubject.next(amount);
  }

  /** Clear entire cart */
  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/${userId}`).pipe(
      tap(() => {
        this.cartSubject.next(null); // Clear cart state
        localStorage.removeItem(this.cartKey);
      }),
      catchError(error => {
        console.error('Error clearing cart:', error);
        return throwError(error);
      })
    );
  }

  /** Get total cart amount */
  getTotalAmount(cart: any): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total: any, item: any) => total + (item.product.price * item.quantity), 0);
  }

  /** Toggle Cart Visibility */
  toggleCart() {
    this.cartVisible.next(!this.cartVisible.value);
  }

  /** Close Cart */
  closeCart() {
    this.cartVisible.next(false);
  }
}


