import { useContext } from 'react';

import styles from './Collection.module.css';
import TabContext from '../contexts/TabContext';
import CollectionObject from './CollectionObject';
import QueryMenu from './QueryMenu';

interface Props {
  clusterId: string,
  setTabTitle: (title: string) => void
}

export default function Collection({ clusterId, setTabTitle }: Props) {
  const { documents } = useContext(TabContext);

  return (
    <div className={styles.container}>
      <div className={styles.documents}>
        {
          documents.map(doc => <CollectionObject key={doc._id.value as string} value={doc} canCollapse={false} />)
        }
      </div>

      <QueryMenu clusterId={clusterId} setTabTitle={setTabTitle} />
    </div>
  );
}
