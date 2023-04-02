import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Cluster.module.css';
import TabNavItem from './TabItem';
import TabContent from './TabContent';
import { ClusterRecord, TabData } from '../../types';

interface Props {
  cluster: ClusterRecord,
  onAllTabsClosed: () => void
}

export default function Cluster({ cluster, onAllTabsClosed }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [tabs, setTabs] = useState<TabData[]>([null]);

  function createNewTab() {
    const numTabs = tabs.length;
    setTabs(tabs => [...tabs, null]);
    setSelectedTabIndex(numTabs);
  }

  function closeTab() {
    if (tabs.length === 0) {
      return;
    }
    if (tabs.length === 1) {
      onAllTabsClosed();
    } else {
      setTabs(tabs => tabs.filter((tab, index) => index !== selectedTabIndex));
      setSelectedTabIndex(selectedTabIndex >= 1 ? selectedTabIndex - 1 : 0);
    }
  }

  return (
    <>
      <div className={styles.tabs}>
        {
          tabs.map((tab, index) => {
            return <TabNavItem
              key={index}
              title={tab?.title || 'New tab'}
              selected={selectedTabIndex === index}
              onSelect={() => setSelectedTabIndex(index)}
              onClose={closeTab} />;
          })
        }
        <button type='button' className={styles.plusBtn} onClick={createNewTab}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className={styles.tab}>
        <TabContent cluster={cluster} selectedTabIndex={selectedTabIndex} tabs={tabs} setTabs={setTabs} />
      </div>
    </>
  );
}
