import {Injectable} from '@angular/core';
import {IndexeddbService, Stores} from './indexeddb.service';
import {getSubsocialApi} from '../utils/subsocial-connect';
import {CommonContent} from '@subsocial/types/offchain';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private idb: IndexeddbService) {
  }

  // TODO: Check for content updates ?
  async getContent<T extends CommonContent>(id: string) {
    if (!id) {
      return {};
    }

    const content = await this.idb.get(Stores.ContentStore, id);
    if (content) {
      console.log(`content ${id} exists in indexeddb`);
      return content;
    } else {
      console.log(`fetching ${id} content from ipfs`);
      const subsocial = await getSubsocialApi();
      const fetchedContent = await subsocial.ipfs.getContent<T>(id);
      await this.idb.addOrReplace(Stores.ContentStore, {id, ...fetchedContent});
      return fetchedContent;
    }
  }

}
