import {Injectable} from '@angular/core';

export enum Stores {
  ContentStore = 'ContentStore',
}

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {

  DATABASE_NAME = 'SubSocialIDB';
  VERSION = 1;

  db: IDBDatabase;

  constructor() {
    this.createOrUpgradeDB();
  }

  private createOrUpgradeDB() {
    const request = indexedDB.open(this.DATABASE_NAME, this.VERSION);
    request.addEventListener('error', (err) => {
      console.warn(err);
    });
    request.addEventListener('success', (ev) => {
      this.db = request.result;
      console.log('success', this.db);
    });
    request.addEventListener('upgradeneeded', (ev) => {
      this.db = request.result;

      for (let key in Stores) {
        if (!this.db.objectStoreNames.contains(key)) {
          this.db.createObjectStore(key, {keyPath: 'id'});
        }
      }

      // Create indexes here if needed
    });
  }

  private getStore(store: Stores, mode: 'readonly' | 'readwrite'): IDBObjectStore {
    let tx = this.db.transaction(store, mode);
    tx.onerror = console.error;
    return tx.objectStore(store);
  }

  addOrReplace(store: Stores, data: { id?: string }): Promise<any> {
    const idbObjectStore = this.getStore(store, 'readwrite');
    return new Promise<any>(((resolve, reject) => {
      let request: IDBRequest;
      request = idbObjectStore.put(data);
      request.onsuccess = (ev) => resolve(data);
      request.onerror = (err) => reject(err);
    }));
  }

  getAll(store: Stores) {
    const idbObjectStore = this.getStore(store, 'readonly');

    return new Promise<any>(((resolve, reject) => {
      const request = idbObjectStore.getAll();
      request.onsuccess = (ev) => resolve(request.result);
      request.onerror = (err) => reject(err);
    }));
  }

  get(store: Stores, id: string) {
    const idbObjectStore = this.getStore(store, 'readonly');

    return new Promise<any>(((resolve, reject) => {
      const request = idbObjectStore.get(id);
      // TODO: decrypt data
      request.onsuccess = (ev) => resolve(request.result);
      request.onerror = (err) => reject(err);
    }));
  }

  async delete(store: Stores, id: string) {
    const idbObjectStore = this.getStore(store, 'readwrite');

    return new Promise<any>(((resolve, reject) => {
      const request = idbObjectStore.delete(id);
      request.onsuccess = (ev) => resolve(request.result);
      request.onerror = (err) => reject(err);
    }));
  }
}

