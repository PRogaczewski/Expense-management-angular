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
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
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

      this.CheckPasswordComponent(registerModel);
      this.CheckNameComponent(registerModel);

      if(!this.registerGroup.errors){
        try{
          const model = await this.service.Register(registerModel);

        if(model.status === 200){
          this.routing.setUserInfo(true);
          this.routing.setUserName(model.data.name);
  
          this.auth.SetToken(model.data.token);
          this.auth.SetUserContext(model.data.name);
          this.route.navigate([''])
        }
        }
        catch(err){
            this.registerGroup.setErrors({unexpected: true});
        }
      }
    }
    else{
      console.log(this.registerGroup.errors)
    }
  }

  Login() {
    this.routing.setData(true);
    this.route.navigate(['/Authentication']);
  }

  CheckPasswordComponent(model: any): void{
    if(model.password !== model.confirmedPassword){
      this.registerGroup.setErrors({confirmedValidator: true});
    }
    if(model.password.length > 35){
      this.registerGroup.setErrors({maxPassLengthValidator: true});
    }
    if(model.password.length < 8){
      this.registerGroup.setErrors({minPassLengthValidator: true});
    }
  }

  CheckNameComponent(model: any): void{
    if(model.name.length > 20){
      this.registerGroup.setErrors({maxNameLengthValidator: true});
    }
    if(model.name.length < 5){
      this.registerGroup.setErrors({minNameLengthValidator: true});
    }
  }
}
