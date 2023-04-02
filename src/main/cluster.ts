import { ipcMain } from 'electron';
import { Binary, Decimal128, Double, Int32, Long, MongoClient, ObjectId } from 'mongodb';

import logger from './logger';
import Commands from '../commands';
import { ClusterRecord, ClusterRecordMetadata, DocumentFieldType } from '../types';
import { writeCredential } from './credential';

export class Cluster {

  static #instances = new Map<string, Cluster>();

  #id: string;
  #name: string;
  #uri: string;
  #metadata: ClusterRecordMetadata;
  #client: MongoClient;

  constructor(cluster: ClusterRecord) {
    this.#id = cluster.id;
    this.#name = cluster.name;
    this.#uri = cluster.uri;
    this.#metadata = cluster.metadata;
    this.#client = new MongoClient(cluster.uri);
  }

  public static getCluster(clusterId: string): Cluster {
    return Cluster.#instances.get(clusterId);
  }

  public static async disconnectAllClusters(): Promise<void> {
    for (const cluster of this.#instances.values()) {
      await cluster.disconnect();
    }
  }

  public async connect(): Promise<void> {
    try {
      await this.#client.connect();
      Cluster.#instances.set(this.#id, this);
      writeCredential({
        id: this.#id,
        name: this.#name,
        uri: this.#uri,
        metadata: {
          ...this.#metadata,
          lastAccessedDate: new Date().toISOString()
        }
      });
      logger.info(`Connected to ${this.#name} (${this.#id})`);

    } catch (err) {
      logger.error(err);
    }
  }

  public async disconnect(): Promise<void> {
    await this.#client.close();
    Cluster.#instances.delete(this.#id);
    logger.info(`Disconnected from ${this.#name} (${this.#id})`);
  }

  public async getDatabases(): Promise<{ name: string, size: number }[]> {
    try {
      const databases = (await this.#client.db()
        .admin()
        .listDatabases())
        .databases
        .map(db => ({
          name: db.name,
          size: db.sizeOnDisk
        }));

      return databases;

    } catch (err) {
      logger.error(err);
    }
  }

  public async getCollections(db: string): Promise<string[]> {
    try {
      const collections = (await this.#client.db(db)
        .listCollections()
        .toArray())
        .map(collection => collection.name);
      logger.info(`Fetched ${collections.length} collection(s) from ${db}`);

      return collections;

    } catch (err) {
      logger.error(err);
    }
  }

  private getFieldType(value: unknown) {
    if (value === null) return 'Null';
    if (value === undefined) return 'Undefined';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'Boolean';
    if (value instanceof Int32) return 'Int32';
    if (value instanceof Long) return 'Long';
    if (value instanceof Decimal128) return 'Decimal128';
    if (value instanceof Double) return 'Double';
    if (value instanceof ObjectId) return 'ObjectId';
    if (value instanceof Binary) return 'Binary';
    if (value instanceof Date) return 'Date';
    if (Array.isArray(value)) return 'Array';
    if (value && Object.getPrototypeOf(value) === Object.prototype) return 'Object';

    throw new Error(`Failed to determine type of value ${value}`);
  }

  private getNodeJsValue(value: unknown): { type: string, value: unknown } {
    const type = this.getFieldType(value);
    let mappedValue = value;

    if (Array.isArray(value)) {
      mappedValue = value.map(item => this.getNodeJsValue(item));
    } else if (type === 'Date') {
      mappedValue = new Date(value as string).toISOString();
    } else if (type === 'ObjectId') {
      mappedValue = value.toString();
    } else if (['Int32', 'Long', 'Decimal128', 'Double'].includes(type)) {
      mappedValue = Number(value);
    } else if (type === 'Object') {
      mappedValue = Object.fromEntries(
        Object.entries(value)
          .map(([key, value]) => [key, this.getNodeJsValue(value)])
      );
    }

    return {
      type,
      value: mappedValue
    };
  }

  public async getDocuments(db: string, collection: string, query: { [key: string]: unknown }, limit: number) {
    try {
      const documents = await this.#client
        .db(db)
        .collection(collection)
        .find(query, { promoteValues: false })
        .limit(limit)
        .toArray();
      logger.info(`Fetched ${documents.length} document(s) from ${db}`);

      const parsedDocs = (this.getNodeJsValue(documents).value as unknown[])
        .map((doc: { type: string, value: DocumentFieldType }) => doc.value);

      return parsedDocs;

    } catch (err) {
      logger.error(err);
    }
  }

}

ipcMain.handle(Commands.ConnectToCluster, async (_e: Electron.IpcMainEvent, cluster: ClusterRecord) => {
  if (!Cluster.getCluster(cluster.id)) {
    await new Cluster(cluster).connect();
  }
});

ipcMain.handle(Commands.DisconnectFromCluster, async (_e: Electron.IpcMainEvent, clusterId: string) => {
  await Cluster.getCluster(clusterId)?.disconnect();
});

ipcMain.handle(Commands.GetDatabases, async (_e: Electron.IpcMainEvent, clusterId: string) => {
  const databases = await Cluster.getCluster(clusterId)?.getDatabases() || [];
  return databases;
});

ipcMain.handle(Commands.GetCollections, async (_e: Electron.IpcMainEvent, clusterId: string, db: string) => {
  const collections = await Cluster.getCluster(clusterId)?.getCollections(db) || [];
  return collections;
});

ipcMain.handle(Commands.GetDocuments, async (_e: Electron.IpcMainEvent, clusterId: string, db: string, collection: string, query: { [key: string]: unknown }, limit: number) => {
  const docs = await Cluster.getCluster(clusterId)?.getDocuments(db, collection, query, limit) || [];
  return docs;
});
