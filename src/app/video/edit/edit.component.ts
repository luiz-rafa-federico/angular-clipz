import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { IClip } from 'src/app/shared/types/clip';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  showAlert = false;
  alertMessage = 'Please wait! Your clip title is being updated';
  inSubmission = false;
  alertColor = 'blue';

  @Output() updated = new EventEmitter();

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async onSubmit() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Your clip title is being updated';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Failed to update the clip. Try again later';
      console.error(error);
      return;
    }

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success! Your clip has been updated';
    this.inSubmission = false;

    this.activeClip.title = this.title.value;
    this.updated.emit(this.activeClip);

    setTimeout(() => {
      this.showAlert = false;
      this.editForm.reset;
      this.modal.toggleModal('editClip');
    }, 1200);
  }
}
