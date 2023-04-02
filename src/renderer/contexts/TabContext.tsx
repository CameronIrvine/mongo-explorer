import { createContext } from 'react';

import { CollectionRecord, DatabaseRecord, Document } from '../../types';

interface Context {
  database: DatabaseRecord | null,
  collections: CollectionRecord[],
  documents: Document[],
  setDatabase: (database: DatabaseRecord) => void,
  setCollections: (collections: CollectionRecord[]) => void,
  setDocuments: (documents: Document[]) => void
}

const TabContext = createContext<Context>({
  database: null,
  collections: [],
  documents: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDatabase: () => { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCollections: () => { },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDocuments: () => { }
});

export default TabContext;
