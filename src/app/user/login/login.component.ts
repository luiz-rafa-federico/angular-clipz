import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  onSubmit(form: NgForm) {
    const { email, password } = form.value;

    console.log('EMAIL', email);
    console.log('PASSWORD', password);

    // or due to the ngModel 2-way-data-binding, we can console log
    // the crendentials object directly and check if the info has been submitted
  }
}
