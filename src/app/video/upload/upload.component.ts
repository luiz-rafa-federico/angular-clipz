import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  isDragOver = false;
  file: File | null = null;

  constructor() {}

  ngOnInit(): void {}

  storeFile($evt: Event) {
    this.isDragOver = false;

    this.file = ($evt as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      // video/mp4 is a mime type (type/subtype)
      return;
    }
  }
}
