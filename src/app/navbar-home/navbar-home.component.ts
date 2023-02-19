import { Component, OnInit } from '@angular/core';
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
    private router: ActivatedRoute,
    private routing: RoutingService,
    private auth: AuthService
  ) {
    route.events.subscribe((event) => {
      this.showSidenav = false;
      this.Navbar();
    });
  }

  ngOnInit(): void {
    this.routing.getUserInfo().subscribe((value: boolean) => {
      this.IsUserLogged = value;
    });

    if (this.IsUserLogged) {
      this.routing.getUserName().subscribe((value: string) => {
        this.LoggedUserName = value;
      });
    }
  }

  ngOnChanges() {
    if (this.IsUserLogged) {
      this.routing.getUserName().subscribe((value: string) => {
        this.LoggedUserName = value;
      });
    }
  }

  Navbar() {
    var a = document.getElementsByClassName('sidenav')[0] as HTMLElement;
    var main = document.getElementsByClassName(
      'MainWindow-View'
    )[0] as HTMLElement;

    if (this.route.url.indexOf('id') !== -1) {
    }

    if (this.showSidenav == false) {
      a.setAttribute('style', 'width: 0');
      main.setAttribute('style', 'margin-left: 0');

      this.showSidenav = true;
    } else {
      a.setAttribute('style', 'width: 270px');
      main.setAttribute('style', 'margin-left: 270px');

      this.showSidenav = false;
      //(<HTMLInputElement>document.getElementById('mySearch')).value = '';
    }
  }

  Logout() {
    if (confirm('Are you sure to logout?')) {
      this.auth.RemoveToken();
      this.routing.setUserInfo(false);
      this.route.navigate(['']);
    }
  }
}
