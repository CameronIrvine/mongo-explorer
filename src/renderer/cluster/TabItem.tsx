import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './TabItem.module.css';

interface Props {
  title: string,
  selected: boolean,
  onSelect: () => void,
  onClose: () => void
}

export default function TabItem({ title, selected, onSelect, onClose }: Props) {
  return (
    <div
      className={`${styles.tab} ${selected ? styles.selected : ''}`}
      onClick={() => !selected && onSelect()}
    >
      {title}
      {
        selected &&
        <button type='button' className={styles.closeBtn} onClick={() => onClose && onClose()}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      }
    </div>
  );
}
