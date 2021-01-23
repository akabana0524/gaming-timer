import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBMemory from 'pouchdb-adapter-memory';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBMemory);

export class BaseEntity implements PouchDB.Core.IdMeta, PouchDB.Core.RevisionIdMeta {
  _id!: string;
  _rev!: string;
  $createdAt!: Date;
  $modifiedAt!: Date;
}
export class SoftDeletableEntity extends BaseEntity {
  $deletedAt!: Date;
}
export function createDao<T extends BaseEntity>(entityConstructor: { new(): T }, options: PouchDB.Configuration.DatabaseConfiguration = {}) {
  const className = entityConstructor.name;
  class Static {
    db = new PouchDB<T>(entityConstructor.name, options);
    async save(data: Partial<T>) {
      const now = new Date();
      if ('_id' in data) {
        return await this.db.put({ ...data, $modifiedAt: now } as unknown as T);
      }
      else {
        return await this.db.post({ ...data, $createdAt: now, $modifiedAt: now } as unknown as T);
      }
    }
    async delete(data: T, force?: boolean) {
      if (force || !(data instanceof SoftDeletableEntity)) {
        await this.db.remove(data);
      }
      else {
        const now = new Date();
        await this.db.put({ ...data, $deletedAt: now });
      }
    }
    async getAll() {
      return await this.db.allDocs({ include_docs: true });
    }
    async get(id: string) {
      return await this.db.get(id);
    }
    async createIndex(index: PouchDB.Find.CreateIndexOptions) {
      return await this.db.createIndex(index);
    }
    async find(selector: PouchDB.Find.FindRequest<T>) {
      return await this.db.find(selector);
    }
    subscribe(listener: {
      change?: (info: PouchDB.Core.ChangesResponseChange<T>) => void,
      complete?: (info: PouchDB.Core.ChangesResponse<T>) => void,
      error?: (error: any) => void
    }) {
      this.db.changes<T>({
        live: true
      })
        .on('change', (info) => listener.change && listener.change(info))
        .on('complete', (info) => listener.complete && listener.complete(info))
        .on('error', (err) => listener.error && listener.error(err));
    }
  }
  return new Static();
}
