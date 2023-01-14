import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import { IUserCredentials } from '../shared/types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUserCredentials>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd), // filter by the type of event
        map((e) => this.route.firstChild), // routes from a nested tree of routes
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => (this.redirect = data.authOnly ?? false));
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

  public async logout($event: Event) {
    $event.preventDefault();

    await this.auth.signOut();

    console.log(this.redirect);

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
