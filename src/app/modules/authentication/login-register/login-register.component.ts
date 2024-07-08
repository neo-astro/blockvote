import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserForAuthenticationDto } from 'src/app/_interfaces/user/userForAuthenticationDto.model';
import { AuthResponseDto } from 'src/app/_interfaces/response/authResponseDto.model';
import { PasswordConfirmationValidatorService } from 'src/app/shared/custom-validators/password-confirmation-validator.service';
import { UserForRegistrationDto } from 'src/app/_interfaces/user/userForRegistrationDto.model';
import { ToastServiceService } from 'src/app/shared/services/toast.service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements AfterViewInit {
  private returnUrl: string;
  currentRoute : string
  viewPassword : boolean= false;
  loginFormIsValid : boolean = false
  loginForm: FormGroup;
  registerForm: FormGroup;

  errorMessage: string = '';
  showError: boolean;

  @ViewChild('signUp') signUpButton!: ElementRef;
  @ViewChild('signIn') signInButton!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('btnSignIn') btnSignIn!: ElementRef;
  @ViewChild('inputEmailLogin') inputEmailLogin!: ElementRef;
  @ViewChild('inpFirstNameRegister') inpFirstNameRegister!: ElementRef;
  


  constructor(private cookieService: CookieService,private authService: AuthenticationService, private passConfValidator: PasswordConfirmationValidatorService, private router: Router, private route: ActivatedRoute,private _toastService:ToastServiceService) { }
  
  
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstNameRegister: new FormControl(''),
      lastNameRegister: new FormControl(''),
      emailRegister: new FormControl('', [Validators.required, Validators.email]),
      passwordRegister: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.registerForm.get('confirm').setValidators([Validators.required, 
    this.passConfValidator.validateConfirmPassword(this.registerForm.get('passwordRegister'))]);


    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
    this.loginFormIsValid = this.loginForm.valid
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.currentRoute = this.router.url;
    // if (this.currentRoute.split("/")[2] == "register"){
    //   setInterval(()=>
    //     this.signUpButton.nativeElement.click()
    //     , 10
    //   )
    // }

  }

  ngAfterViewInit() {
    if (this.signUpButton && this.signInButton && this.container) {
      const signUpButton = this.signUpButton.nativeElement;
      const signInButton = this.signInButton.nativeElement;
      const container = this.container.nativeElement;
  
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
  
      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    } else {
      console.error('No se encontraron elementos en el DOM.');
    }
    console.log(this.currentRoute.split("/"))
    if (this.currentRoute.split("/")[2] == "register"){
      setTimeout(()=>this.signUpButton.nativeElement.click(), 2)
      this.inpFirstNameRegister.nativeElement.focus() 
    
    }
    if (this.currentRoute.split("/")[2].startsWith("login")){
      this.inputEmailLogin.nativeElement.focus() 
    }



  }
  
  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName).hasError(errorName)
  }

  loginUser = (loginFormValue) => {
    this.showError = false;
    let login = {... loginFormValue };

    let userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password
    }

    this.authService.loginUser('api/accounts/login', userForAuth)
    .subscribe({
      next: (res:AuthResponseDto) => {
       localStorage.setItem("token", res.token);
       this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
       this.router.navigate([this.returnUrl]);
       this._toastService.showNotification('¡Inicio de sesión exitoso!');

    },


    error: (err: HttpErrorResponse) => {
      alert('error')
      this.errorMessage = 'Compruebe sus credenciales';
      this.showError = true;
      this._toastService.showNotification(this.errorMessage);
    }})
  }



  ChangeViewPassword(){
    this.viewPassword = !this.viewPassword 
  } 



  public registerUser = (registerFormValue) => {
    this.showError = false;
    const formValues = { ...registerFormValue };

    const user: UserForRegistrationDto = {
      firstName: formValues.firstNameRegister,
      lastName: formValues.lastNameRegister,
      email: formValues.emailRegister,
      password: formValues.passwordRegister,
      confirmPassword: formValues.confirm
    };

    this.authService.registerUser("api/accounts/registration", user)
    .subscribe({
      next: (_) =>{
        this.router.navigate(["/"])
        let login = {... registerFormValue };
        let userForAuthRegister: UserForAuthenticationDto = {
          email: login.emailRegister,
          password: login.passwordRegister
        }

        
        this.authService.loginUser('api/accounts/login', userForAuthRegister)
        .subscribe({
          next: (res:AuthResponseDto) => {
          localStorage.setItem("token", res.token);
          this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
          this.router.navigate([this.returnUrl]);
          this._toastService.showNotification('¡Te has registrado exitosamente!');
        },


        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Compruebe sus credenciales';
          this.showError = true;
          this._toastService.showNotification(this.errorMessage);

        }})
    
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
        this._toastService.showNotification(this.errorMessage);
      }
    })
  }

  private guardarCookie() {
    this.cookieService.set('HangFireCookie', 'valor de la cookie');
  }










}
