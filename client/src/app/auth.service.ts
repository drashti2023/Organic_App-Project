import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5500/users';  
  private currentUserSubject = new BehaviorSubject<any>(this.getUser());
  isLoggedIn$ = this.currentUserSubject.asObservable().pipe(map(user => !!user));

  constructor(private http: HttpClient) {}

  // ✅ Fetch stored user data from localStorage
  public getUser(): any {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }

  // ✅ Ensure both token and user exist for authentication
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !!this.getUser();
  }

  signUp(userData: { 
    username: string;
    name: string; 
    email: string; 
    password: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }[];
  }): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/signup`, userData).pipe(
      tap(response => {
        if (response?.token && response?.user) {
          this.storeAuthData(response.token, response.user);
        } else {
          console.warn("Signup response missing token or user data.");
        }
      })
    );
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { identifier, password }).pipe(
      tap(response => {
        if (response?.token && response?.user) {
          console.log("Login successful. Storing token.");
          this.storeAuthData(response.token, response.user);
        } else {
          console.error("Login failed: Missing token or user data.");
        }
      }),
      catchError(error => {
        console.error("Login request failed:", error);
        throw error;
      })
    );
  }

  // ✅ Logout function to clear user data
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null); // Clear the BehaviorSubject
  }

  // ✅ Store user token securely in localStorage
  // private storeAuthData(token: string, user: any) {
  //   localStorage.setItem('token', token);

  //   if (user && user._id) {
  //     // ⚠ Store only essential user details
  //     const userData = { id: user._id, username: user.username, role: user.role, address: user.address };
  //     localStorage.setItem('user', JSON.stringify(userData));
  //     this.currentUserSubject.next(userData);
  //   } else {
  //     console.warn("User data missing from login response.");
  //   }
  // }
  private storeAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
  
    if (user && user._id) {
      // ✅ Ensure address is stored as an array
      const userData = { 
        id: user._id, 
        username: user.username, 
        role: user.role, 
        address: Array.isArray(user.address) ? user.address : user.address ? [user.address] : [] 
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    } else {
      console.warn("User data missing from login response.");
    }
  }
  

  // ✅ Get current user as observable
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // ✅ Check if user is new (registered within last 24 hours)
  isNewUser(): boolean {
    const user = this.getUser();
    return !!user && user.createdAt ? (new Date().getTime() - new Date(user.createdAt).getTime()) < 86400000 : false;
  }
}