import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  displayName = '';

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  navigateToHome() {
    let url = `/home?displayname=${this.displayName}`;
    this.router.navigateByUrl(url);
  }

}
