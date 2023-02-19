import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { RoutingService } from 'src/app/RoutingService';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerGroup!: FormGroup;

  constructor(
    private route: Router,
    private service: AuthenticationService,
    private formBuilder: FormBuilder,
    private routing: RoutingService,
    private auth: AuthService
  ) {}

  get getComponents() {
    return this.registerGroup.controls;
  }

  ngOnInit(): void {
    this.registerGroup = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmedPassword: ['', Validators.required],
    });
  }

  async Register() {
    if (this.registerGroup.valid) {
      let registerModel = {
        name: this.getComponents['name'].value,
        password: this.getComponents['password'].value,
        confirmedPassword: this.getComponents['confirmedPassword'].value,
      };

      if(registerModel.password !== registerModel.confirmedPassword){
        this.registerGroup.setErrors({confirmedValidator: true});
      }else{
        const model = await this.service.Register(registerModel);

        if(model.status==200){
          this.routing.setUserInfo(true);
          this.routing.setUserName(model.data.name);
  
          this.auth.SetToken(model.data.token);
          this.route.navigate([''])
        }
        else{
          console.log(model.status)
        }
      }
    }
    else{
      console.log("errrrr")
      console.log(this.registerGroup.errors)
    }
  }

  Login() {
    this.routing.setData(true);
    this.route.navigate(['/Authentication']);
  }
}
