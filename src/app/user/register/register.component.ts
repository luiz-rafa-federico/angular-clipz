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
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
  });

  onSubmit() {
    const payload = this.registerForm.getRawValue();
  }

  get name(): AbstractControl | null {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get age() {
    return this.registerForm.get('age');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirm_password() {
    return this.registerForm.get('confirm_password');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }
}
