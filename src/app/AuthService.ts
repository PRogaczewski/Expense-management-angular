import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  GetToken() {
    return localStorage.getItem('authtoken');
  }

  SetToken(value: string): void {
    localStorage.setItem('authtoken', value);
  }

  RemoveToken():void{
    localStorage.removeItem('authtoken');
  }

}

