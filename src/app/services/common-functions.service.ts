import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  constructor() {}

  handleServerError(err: any): string {
    switch (err.code) {
      case 'auth/missing-email':
        return 'Missing email address';
      case 'auth/invalid-email':
        return 'Insert your email address and password';
      case 'auth/email-already-in-use':
        return 'This email address is already in use by another account';
      case 'auth/user-not-found':
        return 'User not found. Verify your credentials';
      case 'auth/wrong-password':
        return 'Password and email address mismatch';
      default:
        return 'Something went wrong';
    }
  }
}
