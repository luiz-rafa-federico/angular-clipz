import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id; => this does not update the params

    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}