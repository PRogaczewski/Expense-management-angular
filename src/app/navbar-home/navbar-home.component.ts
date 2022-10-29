import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar-home',
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css'],
})
export class NavbarHomeComponent implements OnInit {
  showSidenav: boolean = false;

  constructor(private route: Router, private router: ActivatedRoute) {
    route.events.subscribe((event)=>{

      this.showSidenav=false;
      this.Navbar();
    })
  }

  ngOnInit(): void {
  }

  Navbar() {
    var a = document.getElementsByClassName('sidenav')[0] as HTMLElement;
    var main = document.getElementsByClassName('MainWindow-View')[0] as HTMLElement;

    if(this.route.url.indexOf('id') !== -1){
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
}
