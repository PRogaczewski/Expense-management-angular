import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/AuthService';
import { RoutingService } from 'src/app/RoutingService';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

changePassForm!: FormGroup

  constructor(private service: AccountService, private route: Router,
    private routing: RoutingService, private auth: AuthService,  private formBuilder: FormBuilder,) { }

    get getComponents() {
      return this.changePassForm.controls;
    }

  ngOnInit(): void {

    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
      confirmedNewPassword: ['', Validators.required],
    })
  }

ChangePasswordSite(){

  let element = document.getElementById("changePass");

  if(element !== null){
    if(element.style.display === "none"){
      element.style.display = "block"
    }else{
      element.style.display = "none"
    }

  }
}

ChangePassword(){

}

  DeleteAccount(){
    if(confirm("Are you sure you want to delete your account?")){
      console.log("aaaaaaa")


      this.auth.RemoveToken();
      this.auth.RemoveUserContext();
      this.routing.setUserInfo(false);
      this.route.navigate(['']);
    };   
  }

}
