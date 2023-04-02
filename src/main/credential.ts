import { ipcMain, safeStorage } from 'electron';
import Store from 'electron-store';

import Commands from '../commands';
import { ClusterRecord } from '../types';

export const credentialStore = new Store<Record<string, string>>({
  name: 'mongo-explorer'
});

export function writeCredential(cluster: ClusterRecord) {
  cluster.uri = safeStorage.encryptString(cluster.uri).toString('base64');
  credentialStore.set(cluster.id, JSON.stringify(cluster));
}

function deleteCredential(clusterId: string) {
  credentialStore.delete(clusterId);
}

function getAllCredentials() {
  return Object.values(credentialStore.store).map((clusterJson: string) => {
    const cluster: ClusterRecord = JSON.parse(clusterJson);
    cluster.uri = safeStorage.decryptString(Buffer.from(cluster.uri, 'base64'));
    return cluster;
  });
}

ipcMain.handle(Commands.WriteCredential, (_e: Electron.IpcMainEvent, cluster: ClusterRecord) => writeCredential(cluster));
ipcMain.handle(Commands.DeleteCredential, (_e: Electron.IpcMainEvent, clusterId: string) => deleteCredential(clusterId));
ipcMain.handle(Commands.GetAllCredentials, () => getAllCredentials());
