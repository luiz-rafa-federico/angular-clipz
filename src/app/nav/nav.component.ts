import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(public modal: ModalService, public auth: RegisterService) {}

  ngOnInit(): void {}

  openModal() {
    this.modal.toggleModal('auth');
  }
}
