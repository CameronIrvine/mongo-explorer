import { useContext, useEffect, useState } from 'react';

import styles from './DatabaseList.module.css';
import Commands from '../../commands';
import TableView from '../common/TableView';
import TabContext from '../contexts/TabContext';
import SearchBar from '../common/SearchBar';
import { DatabaseRecord } from '../../types';

interface Props {
  clusterId: string
}

export default function DatabaseList({ clusterId }: Props) {
  const { setDatabase } = useContext(TabContext);
  const [databases, setDatabases] = useState<DatabaseRecord[]>([]);
  const [filteredDatabaseList, setFilteredDatabaseList] = useState<DatabaseRecord[]>([]);

  function filterDatabaseList(searchInput: string) {
    setFilteredDatabaseList(databases.filter(db => new RegExp(searchInput).test(db.name)));
  }

  useEffect(() => {
    window.electron.ipcRenderer.invoke(Commands.GetDatabases, clusterId)
      .then((databases: { name: string, size: number }[]) => {
        setDatabases(databases);
        setFilteredDatabaseList(databases);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchbar}>
        <SearchBar placeholder='Search for a database...' onInputChange={filterDatabaseList} />
      </div>
      <TableView>
        <tbody>
          {
            filteredDatabaseList.map(db => (
              <tr key={db.name} onClick={() => setDatabase(db)}>
                <td>{db.name}</td>
                <td>{db.size}</td>
              </tr>
            ))
          }
        </tbody>
      </TableView>
    </div>
  );
}
