import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private data = new BehaviorSubject<boolean>(true);
  private isUserLogged = new BehaviorSubject<boolean>(false);
  private loggedUser = new BehaviorSubject<string>('');

  getData() {
    return this.data.asObservable();
  }

  setData(value: boolean) {
    this.data.next(value);
  }

  getUserInfo() {
    return this.isUserLogged.asObservable();
  }

  setUserInfo(value: boolean) {
    this.isUserLogged.next(value);
  }

  getUserName() {
    return this.loggedUser.asObservable();
  }

  setUserName(value: string) {
    this.loggedUser.next(value);
  }
}
