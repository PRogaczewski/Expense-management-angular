import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { RoutingService } from 'src/app/RoutingService';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../register/register.component.css'],
})

export class LoginComponent implements OnInit {
  loginGroup!: FormGroup;

  constructor(
    private route: Router,
    private service: AuthenticationService,
    private formBuilder: FormBuilder,
    private routing: RoutingService,
    private auth: AuthService
  ) {}

  get getComponents() {
    return this.loginGroup.controls;
  }

  ngOnInit(): void {
    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async Login() {
    if (this.loginGroup.valid) {
      let loginModel = {
        name: this.getComponents['name'].value,
        password: this.getComponents['password'].value,
      };

      try{
        const model = await this.service.Login(loginModel);
      
      if(model.status == 200){
        this.routing.setUserInfo(true);
        this.routing.setUserName(model.data.name);

        this.auth.SetToken(model.data.token);
        this.auth.SetUserContext(model.data.name);
        this.route.navigateByUrl('/');
      }
      }
      catch(err){
        console.log(err)
        if(err instanceof Error){
          this.loginGroup.setErrors({unexpected: true})
          console.log(err.message)
        }
      }
    }
  }

  Register() {
    this.routing.setData(false);
    this.route.navigate(['/Authentication']);
  }
}
