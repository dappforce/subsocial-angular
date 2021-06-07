import * as BN from 'bn.js';
import {Injectable} from '@angular/core';
import {PaginationQuery, parsePageQuery} from '../utils/pagination';
import {environment} from '../../../environments/environment';
import {getSubsocialApi} from '../utils/subsocial-connect';
import {flattenSpaceStruct, flattenSpaceStructs} from '../utils/flatteners';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private ZERO = new BN(0);
  private ONE = new BN(1);

  constructor() {
  }

  async getNextId() {
    const subsocial = await getSubsocialApi();
    return subsocial.substrate.nextSpaceId();
  }

  async getSpace(bnId) {
    const subsocial = await getSubsocialApi();
    const space = await subsocial.substrate.findSpace({id: bnId});
    return flattenSpaceStruct(space);
  }

  async getSpaces(nextId: BN) {
    const subsocial = await getSubsocialApi();
    const bnIds = this.getReversePageOfSpaceIds(nextId, {});
    const spaces = await subsocial.substrate.findSpaces({ids: bnIds});
    return flattenSpaceStructs(spaces);
  }

  private getReversePageOfIds = (nextId: BN, query: PaginationQuery) => {
    const {page, size} = parsePageQuery(query);
    const offset = (page - 1) * size;
    const nextPageId = nextId.subn(offset);
    return this.getLastNIds(nextPageId, size);
  };

  private getReversePageOfSpaceIds = (nextId: any, query: PaginationQuery) => {
    let ids = this.getReversePageOfIds(nextId, query);
    if (!ids.length) {
      return [];
    }

    const lowId = ids[ids.length - 1];

    // Exclude ids of reserved spaces:
    if (lowId.lten(environment.substrate.lastReservedSpaceId)) {
      ids = ids.filter(id => id.gtn(environment.substrate.lastReservedSpaceId));
    }

    const {size} = parsePageQuery(query);

    return ids.length < size
      ? [...ids, ...environment.substrate.claimedSpaceIds.reverse().map(x => new BN(x))]
      : ids;
  };

  // Is this a common function for ids of other classes?
  private getLastNIds = (nextId: BN, size: number): BN[] => {
    let minId = nextId.subn(size);
    if (minId.lt(this.ONE)) {
      minId = this.ONE;
    }

    const ids: BN[] = [];
    for (let id = nextId.sub(this.ONE); id.gte(minId); id = id.sub(this.ONE)) {
      ids.push(id);
    }
    return ids;
  };


}
