import { Component } from '@angular/core';
import { DisplayComponent } from '../display/display.component';
import { BestSellingProductsComponent } from "../best-selling-products/best-selling-products.component";
import { CategoryComponent } from '../category/category.component';
import { ItemsOnSaleComponent } from "../items-on-sale/items-on-sale.component";
import { FeaturedProductsComponent } from "../featured-products/featured-products.component";
import { MemberRegistrationComponent } from "../member-registration/member-registration.component";
import { PopularProductsComponent } from "../popular-products/popular-products.component";
import { LatestProductsComponent } from "../latest-products/latest-products.component";
import { DownloadAppComponent } from "../download-app/download-app.component";
import { SuggestionsComponent } from "../suggestions/suggestions.component";
import { AssurancesComponent } from "../assurances/assurances.component";
import { BlogsComponent } from '../blogs/blogs.component';

@Component({
  selector: 'app-home',
  imports: [DisplayComponent, BestSellingProductsComponent, CategoryComponent, ItemsOnSaleComponent, FeaturedProductsComponent, MemberRegistrationComponent, PopularProductsComponent, LatestProductsComponent, DownloadAppComponent, SuggestionsComponent, AssurancesComponent, BlogsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
