import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalService } from '../services/modal.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    public modal: ModalService,
    public auth: RegisterService,
    private fireAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  openModal() {
    this.modal.toggleModal('auth');
  }

  async logout($event: Event) {
    $event.preventDefault();

    await this.fireAuth.signOut();
  }
}
