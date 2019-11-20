import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
// import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/user/register', user, {headers: headers})
    .pipe(map(res => res.json()));
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/api/user/login', user, {headers: headers})
    .pipe(map(res => res.json()));
  }

  socialAuthenticate(){
    return this.http.get('http://localhost:3000/api/user/auth/google')
    .pipe(map(res => res.json));
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('api/user/profile', {headers: headers})
    .pipe(map(res => res.json()));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    this.loadToken();
    const tokenNotExpired = !helper.isTokenExpired(this.authToken);
    return tokenNotExpired;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
