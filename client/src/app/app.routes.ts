import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DisplayProductsComponent } from './display-products/display-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'products/:categoryId', component:DisplayProductsComponent},
    {path:'product/:productId', component:ProductDetailsComponent},
    {path:'register', component:SignupComponent},
    {path:'login', component:LoginComponent},
    {path:'wishlist', component:WishlistComponent},
    {path:'cart', component: CartComponent},
    {path:'checkout', component:CheckoutComponent}

];
