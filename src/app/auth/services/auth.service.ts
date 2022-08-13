import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
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
            this.saveTokenInLocalStorage(resp.token!);
            this.setUserInfo(resp);
          }
        }),
        map( resp => { return resp.ok }),
        catchError(err => of(err.error.msg) )
      );
  }

  register() {
    
  }

  validateToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;

    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');
      
    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(resp => {
          this.saveTokenInLocalStorage(resp.token!);
          this.setUserInfo(resp);
          return resp.ok;
        }),
        catchError(err => of(false))
      );
  }

  logout() {
    localStorage.clear();
    // Esto no quiere decir que se borren todas las variables del localstorage de todas las paginas, solo se pueden borrar
    // las que se hayan guardado en la url actual
  }

  private setUserInfo(resp: AuthResponse) {
    this._user = {
      name: resp.name!,
      uid: resp.uid! 
    };
  }

  private saveTokenInLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }
}
