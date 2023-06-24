import { Injectable } from '@angular/core';
import { AuthService } from '../AuthService';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly port = "5800"; //"5800" docker
  //local api 7165
  readonly HomeApiUrl = 'https://localhost:' + this.port + '/';

  constructor(
    private authService: AuthService
  ) {
    axios.interceptors.request.use(
      (config) => {
        if (config && config.headers) {
          const token = authService.GetToken();

          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async ChangePassword(acc: unknown) {
    await axios.put(this.HomeApiUrl + 'ChangePassword', acc);
  }

  async DeleteAccount() {
    await axios.delete(this.HomeApiUrl + 'DeleteAccount');
  }
}
