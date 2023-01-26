import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { IClip } from 'src/app/shared/types/clip';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipsService: ClipService,
    private modal: ModalService
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

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();

    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update($evt: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == $evt.docID) {
        this.clips[index].title = $evt.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipsService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if (element.docID === clip.docID) {
        this.clips.splice(index, 1);
      }
    });
  }
}
