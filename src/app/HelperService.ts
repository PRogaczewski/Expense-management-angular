import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })

export class HelperService {
  private months = new BehaviorSubject<Map<number, string>>(
    new Map([
      [0, 'January'],
      [1, 'Feburary'],
      [2, 'March'],
      [3, 'April'],
      [4, 'May'],
      [5, 'June'],
      [6, 'July'],
      [7, 'August'],
      [8, 'September'],
      [9, 'October'],
      [10, 'Novamber'],
      [11, 'December'],
    ])
  );

  GetMonths(){
    return this.months.asObservable();
  }
}
