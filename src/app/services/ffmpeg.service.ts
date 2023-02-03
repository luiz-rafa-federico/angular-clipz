import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  public isReady = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpeg.load();

    this.isReady = true;
  }

  async getScreenshots(file: File) {
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);

    const secs = [1, 2, 3];
    const cmds: string[] = [];

    secs.forEach((sec) => {
      cmds.push(
        // Input
        '-i',
        file.name,
        //Output Options
        '-ss',
        `00:00:0${sec}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        //Output
        `output_0${sec}.png`
      );
    });

    await this.ffmpeg.run(...cmds);

    const screenShots: string[] = [];

    secs.forEach((sec) => {
      const screenShotFile = this.ffmpeg.FS('readFile', `output_0${sec}.png`);

      const screenShotBlob = new Blob([screenShotFile.buffer], {
        type: 'image/png',
      });

      const screenShotUrl = URL.createObjectURL(screenShotBlob);

      screenShots.push(screenShotUrl);
    });

    return screenShots;
  }
}
