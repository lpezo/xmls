import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService : UserService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });


  // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //   //if login, redirect to home....
  //   if (this.authenticationService.currentUserValue) { 
  //     this.router.navigate(['/']);
  // }
  }


    // for accessing to form fields
    get fval() { return this.loginForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.login(this.fval.email.value, this.fval.password.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data,'response from the app----');
              this.router.navigate(['/']);
            },
            error => {
                alert(error.error.message);
                this.loading = false;
            });
  }
}
