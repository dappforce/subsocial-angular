import {Component, Input, OnInit} from '@angular/core';
import {SpaceContent} from '@subsocial/types';
import {environment} from '../../../../../environments/environment';
import {SpaceStruct} from '../../../../core/utils/flatteners';
import {ContentService} from '../../../../core/services/content.service';

@Component({
  selector: 'app-space-card',
  templateUrl: './space-card.component.html',
  styleUrls: ['./space-card.component.scss']
})
export class SpaceCardComponent implements OnInit {

  @Input() space: SpaceStruct;

  content: SpaceContent;

  constructor(private contentService: ContentService) {
  }

  async ngOnInit() {
    this.content = await this.contentService.getContent<SpaceContent>(this.space.contentId);
  }

  getImageUrl(content: SpaceContent) {
    return content?.image
      ? environment.ipfs.url + '/ipfs/' + content.image
      : 'https://material.angular.io/assets/img/examples/shiba1.jpg';
  }
}
