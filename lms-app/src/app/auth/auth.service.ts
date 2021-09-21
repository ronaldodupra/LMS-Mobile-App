import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SERVER_URL } from "src/environments/environment";
import { UserModel } from "../model/user.model";
const TOKEN_KEY = "token";
let httpHeaders = new HttpHeaders({
  "Content-Type": "application/x-www-form-urlencoded",
});
let options = {
  headers: httpHeaders,
};
@Injectable({
  providedIn: "root",
})
export class AuthService {
  api: string;
  redirectUrl: string;
  constructor(private http: HttpClient) {
    this.api = `${SERVER_URL}/account`;
  }
  login(_userName, _password): Observable<any> {
    const credentials = { username: _userName, password: _password };
    if (_userName != null && _password != null) {
      return this.http.post<any>(`${this.api}/login`, credentials);
    }
  }
  isAuthenticated(): boolean {
    return this.getToken() != null;
  }
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
  storeUrlAttempt(url: string): void {
    this.redirectUrl = url;
  }
  logOut() {
    localStorage.removeItem("token");
    //return this.http.post(`${this.api}/logout`, null);
  }
  getUserDetails(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.api}/`);
  }
}
