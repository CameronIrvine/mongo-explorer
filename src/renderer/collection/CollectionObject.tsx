import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import styles from './CollectionObject.module.css';

interface Props {
  value: unknown | unknown[],
  canCollapse: boolean
}

export default function CollectionObject({ value, canCollapse }: Props) {
  const [collapsed, setCollapsed] = useState(canCollapse);

  function getClassForValueType(type: string) {
    switch (type) {
      case 'ObjectId':
        return styles.objectIdValue;
      case 'String':
        return styles.stringValue;
      default:
        return null;
    }
  }

  function renderField(key: string, type: string, value: unknown) {
    return (
      <div className={styles.row} key={key}>
        <div className={styles.col}>{key}</div>
        <div className={`${styles.col} ${getClassForValueType(type)}`}>
          {
            type === 'Object' || type === 'Array'
              ? <CollectionObject value={value} canCollapse={true} />
              : value as string
          }
        </div>
      </div>
    );
  }

  return (
    <>
      {
        canCollapse &&
        <button className={styles.collapseButton} type='button' onClick={() => setCollapsed(!collapsed)}>
          <span>{Array.isArray(value) ? `Array (${value.length})` : 'Object'}</span>
          <FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} />
        </button>
      }
      {
        !collapsed &&
        <div className={styles.collectionObject}>
          {
            Array.isArray(value)
              ? value.map((item, index) => {
                if (item.type === 'Object' || item.type === 'Array') {
                  return <CollectionObject key={index} value={item.value} canCollapse={false} />;
                }
                return <div className={getClassForValueType(item.type)} key={index}>{item.value.toString()}</div>;
              })
              : Object.entries(value).map(([field, { type, value }]) => renderField(field, type, value))
          }
        </div>
      }
    </>
  );
}
