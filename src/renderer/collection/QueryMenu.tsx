import { useContext, useState, useEffect } from 'react';

import styles from './QueryMenu.module.css';
import Commands from '../../commands';
import TabContext from '../contexts/TabContext';
import { Document } from '../../types';

interface Props {
  clusterId: string,
  setTabTitle: (title: string) => void
}

export default function QueryMenu({ clusterId, setTabTitle }: Props) {
  const { database, setDocuments } = useContext(TabContext);
  const [collections, setCollections] = useState([]);

  async function selectCollection(collection: string) {
    const docs = await window.electron.ipcRenderer.invoke(Commands.GetDocuments, clusterId, database.name, collection, {}, 50) as Document[];
    setDocuments(docs);
    setTabTitle(`${collection} | ${database.name}`);
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke(Commands.GetCollections, clusterId, database.name)
      .then(setCollections);
  }, []);

  return (
    <div className={styles.container}>
      <select className={styles.dropdown} defaultValue='' onChange={(e) => selectCollection(e.target.value)}>
        <option value='' disabled>Select collection</option>
        {
          collections.map(collection => (
            <option key={collection}>
              {collection}
            </option>
          ))
        }
      </select>
    </div>
  );
}
