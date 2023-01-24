import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { IClip } from 'src/app/shared/types/clip';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipsService: ClipService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
    });

    this.clipsService.getUserClips().subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort($event: Event) {
    const { value } = $event?.target as HTMLSelectElement;

    // this.router.navigateByUrl(`/video/manage?sort=${value}`);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }
}
