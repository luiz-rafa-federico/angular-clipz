import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IUserCredentials } from '../shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  async registerUser(userInfo: IUserCredentials) {
    const { email, name, password, age, phoneNumber } = userInfo;

    await this.auth.createUserWithEmailAndPassword(email, password);

    await this.saveUserOnDB(email, name, age, phoneNumber);
  }

  async saveUserOnDB(
    email: string,
    name: string,
    age: string,
    phoneNumber: string
  ) {
    await this.db.collection('users').add({
      name,
      email,
      age,
      phoneNumber,
    });
  }
}
