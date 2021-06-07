import {Injectable} from '@angular/core';
import {flattenPostStructs} from '../utils/flatteners';
import {getSubsocialApi} from '../utils/subsocial-connect';
import {idToBN} from '../utils/bn-util';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() {
  }

  async getPostsOfSpace(bnId) {
    const subsocial = await getSubsocialApi();
    const postIds = await subsocial.substrate.postIdsBySpaceId(bnId);
    const posts = await subsocial.substrate.findPosts({ids: postIds});
    return flattenPostStructs(posts);
  }
}
