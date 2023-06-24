import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  GetToken() {
    const item = localStorage.getItem('authtoken');

    if (!item) {
      return null;
    }

    const token = JSON.parse(item);

    if (new Date().getTime() > token.expiry) {
      this.RemoveToken();
      return null;
    }

    return token.value;
  }

  SetToken(value: string): void {
    const token = {
      value: value,
      expiry: new Date().getTime() + 3600000,
    };

    localStorage.setItem('authtoken', JSON.stringify(token));
  }

  RemoveToken(): void {
    localStorage.removeItem('authtoken');
  }

  SetUserContext(name: string): void {
    const user = {
      name: name,
      expiry: new Date().getTime() + 3600000,
    };

    localStorage.setItem('user', JSON.stringify(user));
  }

  GetUserContext() {
    const item = localStorage.getItem('user');

    if (!item) {
      return null;
    }
    const user = JSON.parse(item);

    if (new Date().getTime() > user.expiry) {
      this.RemoveUserContext();
      this.RemoveToken();
      return null;
    }

    return user.name;
  }

  RemoveUserContext() {
    localStorage.removeItem('user');
  }
}
