import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'

import { FlashMessagesService } from 'angular2-flash-messages'
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: String;
  password: String;
  re_password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage:FlashMessagesService,
    ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }

    console.log(JSON.stringify(user));
    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields', {
        cssClass: 'alert-danger',
        timeout: 3000});
      return false;
    }

    // Validate Email
    // if(!this.validateService.validateEmail(user.username)){
    //   console.log('Please user a vaild email');
    //   return false;
    // }

    // Match-pass
    if(user.password != this.re_password){
      this.flashMessage.show('2 mat khau khong trung nhau', {
        cssClass: 'alert-danger',
        timeout: 3000});
      return false;
    }

    // Register user
    this.authService.registerUser(JSON.stringify(user)).subscribe(data => {
      if(data.success){
        // console.log('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
        this.flashMessage.show('You are now logged in', {
          cssClass: 'alert-success',
          timeout: 5000});
        this.router.navigate(['/login']);
      } else {
        // console.log('Something went wrong', {cssClass: 'alert-danger', timeout: 400});
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
        this.router.navigate(['/register']);
      }
    });
  }
}
