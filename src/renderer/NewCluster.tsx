import { useContext, useState } from 'react';

import DataContext from './contexts/DataContext';
import Modal from './common/Modal';
import FormField from './common/FormField';

interface Props {
  onGoBack: () => void
}

export default function NewCluster({ onGoBack }: Props) {
  const { createCluster } = useContext(DataContext);
  const [name, setName] = useState('');
  const [hostname, setHostname] = useState('');
  const [port, setPort] = useState('');

  return (
    <Modal heading='Add new cluster' onNext={() => createCluster(name, hostname, port)} onCancel={onGoBack}>
      <form>
        <div className='row'>
          <FormField label='Cluster Name' placeholder='Local Cluster' onChange={setName} />
        </div>

        <div className='row'>
          <FormField label='Hostname' placeholder='127.0.0.1' onChange={setHostname} />
          <FormField label='Port' placeholder='27017' onChange={setPort} />
        </div>
      </form>
    </Modal>
  );
}
