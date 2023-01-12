import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { delay, map, Observable } from 'rxjs';
import { IUserCredentials } from '../shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private usersCollection: AngularFirestoreCollection<IUserCredentials>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
  }

  async registerUser(userInfo: IUserCredentials) {
    const { email, name, password, age, phoneNumber } = userInfo;

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      email,
      password as string
    );

    // const token = userCredentials.user?.getIdToken();

    await this.usersCollection.doc(userCredentials.user?.uid).set({
      name,
      email,
      age,
      phoneNumber,
    });

    await userCredentials.user?.updateProfile({
      displayName: name,
    });
  }
}
