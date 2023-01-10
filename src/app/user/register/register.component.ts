import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';

import { RegisterService } from 'src/app/services/register.service';
import { IUserCredentials } from 'src/app/shared/types/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);

  showAlert = false;
  alertMessage = 'Please, wait! Your account is being created. ';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  inSubmission = false;

  constructor(private registerService: RegisterService) {}

  async onSubmit() {
    this.showAlert = true;
    this.alertMessage = 'Please, wait! Your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const userCredentials: IUserCredentials = this.registerForm.getRawValue();

    try {
      await this.registerService.registerUser(userCredentials);

      this.inSubmission = false;
    } catch (err) {
      console.error(err);
      this.alertMessage = `${err}`;
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMessage = 'Success! Your account has been created!';
    this.alertColor = 'green';
    this.registerForm.reset();
  }

  //GETTERS
  get userName(): AbstractControl | null {
    return this.registerForm.get('name');
  }
}

// REGEX
// - at least 8 characters
// - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
// - Can contain special characters
