import {Component, OnInit} from '@angular/core';
import {SpaceService} from '../../../../core/services/space.service';
import {SpaceStruct} from '../../../../core/utils/flatteners';
import {idToBN} from '../../../../core/utils/bn-util';

@Component({
  selector: 'app-space-list-page',
  templateUrl: './space-list-page.component.html',
  styleUrls: ['./space-list-page.component.scss']
})
export class SpaceListPageComponent implements OnInit {

  spaces: SpaceStruct[] = [];
  nextSpaceId;

  constructor(private spaceService: SpaceService) {
  }

  async ngOnInit() {
    this.nextSpaceId = await this.spaceService.getNextId();
    await this.load();
  }

  async load() {
    const spaces = await this.spaceService.getSpaces(this.nextSpaceId);
    spaces.forEach(s => this.spaces.push(s));
    this.nextSpaceId = idToBN(spaces[spaces.length - 1].id);
  }


}
