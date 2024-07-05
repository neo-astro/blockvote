import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../shared/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isCollapsed: boolean = false;
  isUserAuthenticated: boolean;
  currentRoute: string;
  isUserAdmin:boolean

  
  constructor(private authService: AuthenticationService, private router: Router,private _snackBar: MatSnackBar) {
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
      this.isUserAdmin = res ? this.isUserAdmin = this.authService.isUserAdmin(): false
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
      }
    });

    // this.isUserAdmin = this.authService.isUserAdmin()
    
   }

  ngOnInit(): void {

    
    this.authService.authChanged
    .subscribe(res => {
      this.isUserAuthenticated = res;
    })

    window.addEventListener('scroll', () => {
    
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 100) {
          navbar.classList.add('navbar-transparent');
      } else {
          navbar.classList.remove('navbar-transparent');
      }
    });

  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}

