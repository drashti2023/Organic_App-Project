import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from "./cart/cart.component";
import { MenuComponent } from "./menu/menu.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartComponent, MenuComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  cartVisible = false;

  toggleCart() {
    console.log("Cart visibility toggled!", this.cartVisible); // Debugging log
    this.cartVisible = !this.cartVisible;
  }
}
