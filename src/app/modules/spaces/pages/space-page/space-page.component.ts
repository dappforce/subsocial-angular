import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostStruct, SpaceStruct} from '../../../../core/utils/flatteners';
import {idToBN} from '../../../../core/utils/bn-util';
import {PostService} from '../../../../core/services/post.service';
import {SpaceService} from '../../../../core/services/space.service';

@Component({
  selector: 'app-space-page',
  templateUrl: './space-page.component.html',
  styleUrls: ['./space-page.component.scss']
})
export class SpacePageComponent implements OnInit {

  spaceId: string;
  space: SpaceStruct;
  posts: PostStruct[];

  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private spaceService: SpaceService) {
  }

  async ngOnInit() {
    this.spaceId = this.route.snapshot.paramMap.get('spaceId');
    const bnId = idToBN(this.spaceId);
    this.space = await this.spaceService.getSpace(bnId);
    this.posts = await this.postService.getPostsOfSpace(bnId);

  }

}
