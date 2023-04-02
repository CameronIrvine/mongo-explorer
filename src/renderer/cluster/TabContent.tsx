import DatabaseList from './DatabaseList';
import TabContext from '../contexts/TabContext';
import Collection from '../collection/Collection';
import { ClusterRecord, CollectionRecord, DatabaseRecord, Document, TabData } from '../../types';

interface Props {
  cluster: ClusterRecord,
  selectedTabIndex: number,
  tabs: TabData[],
  setTabs: (updater: (tabs: TabData[]) => TabData[]) => void
}

export default function TabContent({ cluster, selectedTabIndex, tabs, setTabs }: Props) {
  const currentTabData = tabs[selectedTabIndex];

  function setDatabase(database: DatabaseRecord) {
    setTabs(tabs => {
      return tabs.map((tab, index) => {
        if (index === selectedTabIndex) {
          return {
            title: database.name,
            database,
            collections: [],
            documents: []
          };
        }
        return tab;
      });
    });
  }

  function updateTab(key: string, value: unknown) {
    setTabs(tabs => {
      return tabs.map((tab, index) => {
        if (index === selectedTabIndex) {
          return {
            ...tab,
            [key]: value
          };
        }
        return tab;
      });
    });
  }

  return (
    <TabContext.Provider value={{
      database: currentTabData?.database || null,
      collections: currentTabData?.collections || [],
      documents: currentTabData?.documents || [],
      setDatabase,
      setCollections: (collections: CollectionRecord[]) => updateTab('collections', collections),
      setDocuments: (documents: Document[]) => updateTab('documents', documents)
    }}>
      <div>
        {
          currentTabData?.database
            ? <Collection key={currentTabData.database.name} clusterId={cluster.id} setTabTitle={(title: string) => updateTab('title', title)} />
            : <DatabaseList clusterId={cluster.id} />
        }
      </div>
    </TabContext.Provider>
  );
}
