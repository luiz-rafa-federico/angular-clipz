import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { IUserCredentials } from '../shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private usersCollection: AngularFirestoreCollection<IUserCredentials>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
  }

  async registerUser(userInfo: IUserCredentials) {
    const { email, name, password, age, phoneNumber } = userInfo;

    await this.auth.createUserWithEmailAndPassword(email, password as string);

    await this.saveUserOnDB(email, name, age, phoneNumber);
  }

  async saveUserOnDB(
    email: string,
    name: string,
    age: string,
    phoneNumber: string
  ) {
    await this.usersCollection.add({
      name,
      email,
      age,
      phoneNumber,
    });
  }
}
