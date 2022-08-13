import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {    
    const url = `${this.baseUrl}/auth`;
    const credentials = {
      email,
      password
    };

    return this.http.post<AuthResponse>(url, credentials);
  }

  register() {
    
  }
}
