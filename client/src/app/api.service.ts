import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Base URLs for API endpoints
  private categoryUrl = 'http://localhost:5500/categories';
  private productUrl = 'http://localhost:5500/products';

  constructor() { }

  private _http = inject(HttpClient);

  // Fetch all categories
  getAll() {
    return this._http.get(this.categoryUrl);
  }

  // Fetch products by category ID
  getProductsByCategory(categoryId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.productUrl}/categories/${categoryId}`);
  }

  // Fetch a product by its ID
  getProductById(productId: string): Observable<any> {
    return this._http.get<any>(`${this.productUrl}/${productId}`);
  }

  // Fetch all products
  getAllProducts(): Observable<any[]> {
    return this._http.get<any[]>(this.productUrl);
  }

  // Fetch bestseller products
  getBestsellerProducts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.productUrl}?bestseller=true`);
  }

  // Fetch popular products
  getPopularProducts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.productUrl}?popular=true`);
  }

  // Fetch latest products
  getLatestProducts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.productUrl}?latest=true`);
  }

  // Fetch featured products
  getFeaturedProducts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.productUrl}?featured=true`);
  }
}
