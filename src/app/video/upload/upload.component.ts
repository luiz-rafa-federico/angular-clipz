import { Component, OnDestroy } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { combineLatest, last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

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
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffpmeg: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    this.ffpmeg.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($evt: Event) {
    if (this.ffpmeg.isRunning) {
      return;
    }

    this.isDragOver = false;

    this.file = ($evt as DragEvent).dataTransfer
      ? ($evt as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($evt.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      // video/mp4 is a mime type (type/subtype)

      this.fileUploaded = false;
      return;
    }

    this.screenshots = await this.ffpmeg.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.fileUploaded = true;
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.alertMessage = 'Please wait! Your clip is being uploaded';
    this.alertColor = 'blue';
    this.showAlert = true;
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const cliPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffpmeg.blobFromUrl(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);

    this.task = this.storage.upload(cliPath, this.file);
    const clipRef = this.storage.ref(cliPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) return;

      const total = clipProgress + screenshotProgress;

      this.percentage = (total as number) / 200;
    });

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
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
