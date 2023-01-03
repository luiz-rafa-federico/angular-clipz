import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', Validators.required);
  age = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  confirm_password = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  onSubmit() {
    const payload = this.registerForm.getRawValue();
  }
}
