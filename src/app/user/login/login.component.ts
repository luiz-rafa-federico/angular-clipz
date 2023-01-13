import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { CommonFunctionsService } from 'src/app/services/common-functions.service';

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

  showAlert = false;
  alertMessage = 'Please, wait! You are being signed in. ';
  alertColor = 'blue';
  inSubmission = false;

  constructor(
    private auth: AngularFireAuth,
    private commonFunctions: CommonFunctionsService
  ) {}

  async onSubmit(form: NgForm) {
    this.showAlert = true;
    this.alertMessage = 'Please, wait! You are being signed in. ';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const { email, password } = form.value;

    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.log(err);
      this.alertMessage = this.commonFunctions.handleServerError(err);
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMessage = 'Success! You are logged in!';
    this.alertColor = 'green';
    form.reset();

    // or due to the ngModel 2-way-data-binding, we can console log
    // the crendentials object directly and check if the info has been submitted
  }
}
