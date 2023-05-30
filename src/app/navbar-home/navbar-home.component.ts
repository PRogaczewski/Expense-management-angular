import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../AuthService';
import { RoutingService } from '../RoutingService';

@Component({
  selector: 'app-navbar-home',
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css'],
})
export class NavbarHomeComponent implements OnInit {
  showSidenav: boolean = false;
  IsUserLogged: boolean = false;
  LoggedUserName: string = '';

  constructor(
    private route: Router,
    private routing: RoutingService,
    private eventSubscriber: ActivatedRoute,
    private auth: AuthService
  ) {
    route.events.subscribe((event) => {
      this.showSidenav = false;
      this.Navbar();
    });

    this.eventSubscriber.queryParams.subscribe((event) => {

      this.routing.getUserInfo().subscribe((value: boolean) => {
        this.IsUserLogged = value;

        if (this.IsUserLogged) {
          this.routing.getUserName().subscribe((value: string) => {
            this.LoggedUserName = value;
          });
        }
      });
    });
  }


  ngOnInit() {
    const name = this.auth.GetUserContext();
   if(name){
    this.IsUserLogged = true;
    this.LoggedUserName = name;
   }
   else{
    this.IsUserLogged = false;
   }
  }

  Navbar() {
    var a = document.getElementsByClassName('sidenav')[0] as HTMLElement;
    var main = document.getElementsByClassName('MainWindow-View')[0] as HTMLElement;

    if (this.route.url.indexOf('id') !== -1) {
    }

    if (this.showSidenav === false) {
      if(a !== null && main !== null){
        a?.setAttribute('style', 'width: 0');
        main?.setAttribute('style', 'margin-left: 0');
      }
    
      this.showSidenav = true;
    } else {
      if(a !== null && main !== null){
        a?.setAttribute('style', 'width: 270px');
        main?.setAttribute('style', 'margin-left: 270px');
      }
     
      this.showSidenav = false;
    }
  }

  Account(){
    this.route.navigate(['/Account']);
  }

  Logout() {
    if (confirm('Are you sure to logout?')) {
      this.auth.RemoveToken();
      this.auth.RemoveUserContext();
      this.routing.setUserInfo(false);
      this.route.navigate(['']);
    }
  }
}
