import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login-gg',
  templateUrl: './login-gg.component.html',
  styleUrls: ['./login-gg.component.css']
})
export class LoginGGComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private flashMessage:FlashMessagesService
    ) { }

  ngOnInit() {
  
  }

}
