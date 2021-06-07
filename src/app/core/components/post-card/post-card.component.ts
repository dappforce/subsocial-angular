import {Component, Input, OnInit} from '@angular/core';
import {flattenProfileStruct, PostStruct} from '../../utils/flatteners';
import {environment} from '../../../../environments/environment';
import {PostContent, ProfileContent} from '@subsocial/types';
import {ContentService} from '../../services/content.service';
import {getSubsocialApi} from '../../utils/subsocial-connect';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  @Input() post: PostStruct;

  creatorContent: ProfileContent;
  postContent: PostContent;

  constructor(private contentService: ContentService) {
  }

  async ngOnInit() {
    this.contentService.getContent<PostContent>(this.post.contentId).then(p => this.postContent = p);

    const subsocial = await getSubsocialApi();
    const account = await subsocial.substrate.findSocialAccount(this.post.createdByAccount);
    const flatAccount = flattenProfileStruct(account);

    this.contentService.getContent<ProfileContent>(flatAccount.contentId).then(c => this.creatorContent = c);
  }

  getImageUrl() {
    return this.creatorContent?.avatar
      ? environment.ipfs.url + '/ipfs/' + this.creatorContent.avatar
      : 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  }

  getCreatorName() {
    return this.creatorContent
      ? this.creatorContent.name
      : this.post.createdByAccount.substr(0, 6)
      + '...'
      + this.post.createdByAccount.substr(this.post.createdByAccount.length - 6);
  }

}
