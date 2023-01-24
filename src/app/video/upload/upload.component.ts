import { Component, OnDestroy } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  fileUploaded = false;
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  uploadForm = new FormGroup({
    title: this.title,
  });
  alertMessage = 'Please wait! Your clip is being uploaded';
  alertColor = 'blue';
  showAlert = false;
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile($evt: Event) {
    this.isDragOver = false;

    this.file = ($evt as DragEvent).dataTransfer
      ? ($evt as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($evt.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      // video/mp4 is a mime type (type/subtype)

      this.fileUploaded = false;
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.fileUploaded = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    this.alertMessage = 'Please wait! Your clip is being uploaded';
    this.alertColor = 'blue';
    this.showAlert = true;
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const cliPath = `clips/${clipFileName}.mp4`;

    this.task = this.storage.upload(cliPath, this.file);
    const clipRef = this.storage.ref(cliPath);

    this.task
      .percentageChanges()
      .subscribe((progress) => (this.percentage = (progress as number) / 100));

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
          };

          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertMessage =
            'Success! Your clip is now ready to be shared with the world';
          this.alertColor = 'green';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();

          this.alertMessage = 'Failed to upload file. Try again later';
          this.alertColor = 'red';
          this.inSubmission = true;
          this.showPercentage = false;

          console.error(error);
        },
      });
  }
}
