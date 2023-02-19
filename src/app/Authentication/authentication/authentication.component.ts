import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/RoutingService';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  Login: boolean = true;

  constructor(private route: ActivatedRoute, private routing: RoutingService) {}

  ngOnInit(): void {
    this.routing.getData().subscribe((value: boolean) => {
      this.Login = value;
    });
  }
}
