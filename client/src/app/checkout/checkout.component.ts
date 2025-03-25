import { Component, inject } from '@angular/core';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, AsyncPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent  {
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  cart$: Observable<any> = this._cartService.cart$;
  totalAmount: number = 0;
  isAuthenticated: boolean = false;
  errorMessage: string = '';
  isPlacingOrder: boolean = false; // Prevents multiple submissions

  checkoutForm = {
    name: '',
    email: '',
    address: '',
    phone: '',
    paymentMethod: 'COD', // Default to Cash on Delivery
  };

  constructor() {}

  ngOnInit(): void {
    // Check authentication & fetch cart data
    this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
      if (isLoggedIn) {
        const user = this._authService.getUser();
        if (user?.id) {
          this._cartService.syncCartWithBackend(user.id);
        }
      }
    });

    // Get total amount
    this._cartService.totalAmount$.subscribe(amount => {
      this.totalAmount = amount;
    });
  }

  /** Place Order */
  placeOrder(): void {
    if (!this.isAuthenticated) return;
    if (!this.checkoutForm.name || !this.checkoutForm.email || !this.checkoutForm.address || !this.checkoutForm.phone) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isPlacingOrder = true; // Disable button while processing

    const user = this._authService.getUser();
    if (!user?.id) return;

    const orderData = {
      user: user.id,
      items: [],
      totalAmount: this.totalAmount,
      shippingDetails: this.checkoutForm,
      paymentMethod: this.checkoutForm.paymentMethod,
      status: 'Pending', // Initial order status
    };

    this.cart$.subscribe(cart => {
      if (cart?.items) {
        orderData.items = cart.items.map((item: any) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }));
      }

      console.log('Placing Order:', orderData);

      // Simulate backend API call for order placement
      setTimeout(() => {
        this._cartService.clearCart(user.id).subscribe({
          next: () => {
            alert('Order placed successfully!');
            this._router.navigate(['']); // Redirect to home
          },
          error: err => {
            console.error('Error clearing cart after order:', err);
            this.errorMessage = 'Order placed, but cart was not cleared.';
          }
        });
      }, 1500);
    });
  }
}
