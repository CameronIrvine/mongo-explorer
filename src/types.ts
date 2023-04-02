export interface ElectronContextBridge {
  platform: string,
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  }
}

export interface ClusterRecord {
  id: string,
  name: string,
  uri: string,
  metadata: ClusterRecordMetadata
}

export interface ClusterRecordMetadata {
  lastAccessedDate: string,
  databases: {
    [key: string]: {
      lastAccessed: string
    }
  }
}

export interface DatabaseRecord {
  name: string,
  size: number
}

export interface CollectionRecord {
  name: string
}

export type DocumentFieldType = 'String' | 'Boolean' | 'Null' | 'Undefined' | 'Int32' | 'Long' | 'Decimal128' | 'Double' | 'ObjectId' | 'Binary' | 'Date' | 'Array' | 'Object';

export interface Document {
  [key: string]: {
    type: DocumentFieldType,
    value: string | number | boolean | null | undefined | unknown | unknown[]
  }
}

export interface TabData {
  title: string,
  database: DatabaseRecord | null,
  collections: CollectionRecord[],
  documents: Document[]
}