import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly port = "5800"; //5800
  //7165
  readonly AuthenticationApiUrl="https://localhost:" + this.port + "/";

  constructor(private httpClient:HttpClient) { }

  async Login(login:unknown){
    return axios.post(this.AuthenticationApiUrl + 'Login', login);

  }

  async Register(register:unknown){
    return axios.post(this.AuthenticationApiUrl + 'Register', register)
  }
}
