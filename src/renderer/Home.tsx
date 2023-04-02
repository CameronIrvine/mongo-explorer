import { useState, useContext } from 'react';

import styles from './Home.module.css';
import DataContext from './contexts/DataContext';
import NewCluster from './NewCluster';
import { ClusterRecord } from '../types';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onClusterSelected: (cluster: ClusterRecord) => void,
  onClusterDeleted: (clusterId: string) => void
}

export default function Home({ onClusterSelected, onClusterDeleted }: Props) {
  const { clustersList } = useContext(DataContext);
  const [showNewClusterForm, setShowNewClusterForm] = useState(false);

  return (
    <div>
      <ul className={styles.clusterList}>
        {
          clustersList?.map(cluster => (
            <li key={cluster.id} onClick={() => onClusterSelected(cluster)}>
              <div>
                {cluster.name}
              </div>
              <button type='button' className={styles.deleteBtn} onClick={(e) => {
                e.stopPropagation();
                onClusterDeleted(cluster.id);
              }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          ))
        }
        <li onClick={() => setShowNewClusterForm(true)}>Add new cluster</li>
      </ul>

      {showNewClusterForm && <NewCluster onGoBack={() => setShowNewClusterForm(false)} />}
    </div>
  );
}
