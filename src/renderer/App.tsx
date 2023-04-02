import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import './App.css';
import DataContext from './contexts/DataContext';
import Commands from '../commands';
import Home from './Home';
import Cluster from './cluster/Cluster';
import { ClusterRecord, ElectronContextBridge } from '../types';
import TitleBar from './common/TitleBar';

declare global {
  interface Window {
    electron: ElectronContextBridge;
  }
}

export default function App() {
  const [clustersList, setClustersList] = useState<ClusterRecord[] | null>(null);
  const [activeCluster, setActiveCluster] = useState<ClusterRecord | null>(null);

  async function loadClustersList() {
    const data = await window.electron.ipcRenderer.invoke(Commands.GetAllCredentials) as ClusterRecord[];
    setClustersList(data);
  }

  async function createCluster(name: string, hostname: string, port: string) {
    if (!clustersList) {
      throw new Error('Clusters not set');
    }
    const cluster: ClusterRecord = {
      id: uuid(),
      name,
      uri: `mongodb://${hostname}:${port}`,
      metadata: {
        lastAccessedDate: new Date().toISOString(),
        databases: {}
      }
    };
    await window.electron.ipcRenderer.invoke(Commands.WriteCredential, cluster);
    const data = [...clustersList, cluster];
    setClustersList(data);
  }

  function deleteCluster(clusterId: string) {
    window.electron.ipcRenderer.invoke(Commands.DeleteCredential, clusterId);
    setClustersList(clusters => clusters.filter(cluster => cluster.id !== clusterId));
  }

  async function connectToCluster(cluster: ClusterRecord) {
    await window.electron.ipcRenderer.invoke(Commands.ConnectToCluster, cluster);
    setActiveCluster(cluster);
  }

  async function disconnectFromCluster() {
    await window.electron.ipcRenderer.invoke(Commands.DisconnectFromCluster, activeCluster.id);
    setActiveCluster(null);
  }

  useEffect(() => {
    if (!clustersList) {
      loadClustersList();
    }
  }, []);

  return (
    <>
      <TitleBar title={activeCluster ? `${activeCluster.name} - Mongo Explorer` : 'Mongo Explorer'} />
      <DataContext.Provider value={{ clustersList, createCluster }}>
        {
          activeCluster
            ? <Cluster cluster={activeCluster} onAllTabsClosed={disconnectFromCluster} />
            : <Home onClusterSelected={connectToCluster} onClusterDeleted={deleteCluster} />
        }
      </DataContext.Provider>
    </>
  );
}
