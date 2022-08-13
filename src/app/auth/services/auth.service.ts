import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { AuthResponse, User } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.BASE_URL;
  private _user!: User;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {    
    const url = `${this.baseUrl}/auth`;
    const credentials = {
      email,
      password
    };

    return this.http.post<AuthResponse>(url, credentials)
      .pipe(
        tap( resp => {
          if (resp.ok) {
            this._user = {
              name: resp.name!,
              uid: resp.uid! 
            };
          }
        }),
        map( resp => { return resp.ok }),
        catchError(err => of(err.error.msg) )
      );
  }

  register() {
    
  }
}
