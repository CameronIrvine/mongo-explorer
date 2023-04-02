import { createContext } from 'react';

import { ClusterRecord } from '../../types';

interface Context {
  clustersList: ClusterRecord[] | null,
  createCluster: (name: string, hostname: string, port: string) => Promise<void>
}

const DataContext = createContext<Context>({
  clustersList: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCluster: async (_name: string, _hostname: string, _port: string) => Promise.resolve()
});

export default DataContext;
