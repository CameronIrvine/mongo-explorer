import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  ipcRenderer: {
    async invoke(channel: string, ...args: unknown[]): Promise<unknown> {
      return await ipcRenderer.invoke(channel, ...args);
    }
  }
});
